#!/usr/bin/env python3
# Copyright 2026 Workloom Solutions Private Limited
# SPDX-License-Identifier: MIT
"""Render a table-based findings PDF from the documented Markdown contract.

A4 fixed pages, explicit continuation breaks, configurable branding, and a
required DOM overflow check before PDF export. Layout defaults are neutral.
CLI: --md findings.md --client 'Audience' --out findings.pdf [--brand-config brand.json]
"""
import argparse, html, pathlib, re, subprocess, sys

from brand_config import load_brand, brand_css
SKILL = pathlib.Path(__file__).resolve().parent
CSS = (SKILL / 'fixed-page.css').read_text()



# --------------------------------------------------------------------------- #
# Markdown parsing for the table-report contract documented in SKILL.md
# --------------------------------------------------------------------------- #
def _inline(t):
    """Bold + italic + code, escaped first. No raw HTML passthrough."""
    t = html.escape(t.strip())
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)', r'<em>\1</em>', t)
    t = re.sub(r'`(.+?)`', r'<code>\1</code>', t)
    return t


def _rows(lines):
    """Parse a github markdown table into (header, rows)."""
    cells = lambda l: [c.strip() for c in l.strip().strip('|').split('|')]
    head = cells(lines[0])
    body = [cells(l) for l in lines[2:] if l.strip().startswith('|')]
    return head, body


def parse(md_path):
    txt = pathlib.Path(md_path).read_text().splitlines()
    doc = {'title': '', 'meta': '', 'headline': None, 'sections': [], 'note': None,
           'footer': ''}
    i, n = 0, len(txt)
    while i < n:
        line = txt[i].rstrip()
        if line.startswith('# ') and not doc['title']:
            doc['title'] = line[2:].strip()
        elif line.startswith('> '):
            # The headline: `> **num** | label | sentence`. Three pipe-delimited fields, so the
            # renderer never has to guess which part is the stat. One field = plain callout.
            blk = []
            while i < n and txt[i].startswith('>'):
                blk.append(txt[i].lstrip('>').strip())
                i += 1
            parts = [s.strip() for s in ' '.join(blk).split('|')]
            doc['headline'] = (parts + ['', ''])[:3] if len(parts) > 1 else [None, None, parts[0]]
            continue
        elif line.startswith('^ '):
            # Final-page supporting note.
            lead, items = [], []
            while i < n and txt[i].startswith('^'):
                body = txt[i].lstrip('^').strip()
                # A bullet keeps its own line; everything else joins the lead. Bullets exist
                # because a 140-word single paragraph at 7pt is unreadable however true it is.
                (items if body.startswith('- ') else lead).append(
                    body[2:].strip() if body.startswith('- ') else body)
                i += 1
            doc['note'] = {'lead': ' '.join(lead), 'items': items}
            continue
        elif line.strip() == '=== page ===':
            # Sentinel section: build_html splits the section list here.
            doc['sections'].append({'pagebreak': True})
            i += 1
            continue
        elif line.startswith('## '):
            title = line[3:].strip()
            i += 1
            tbl, prose = [], []
            while i < n and not txt[i].startswith('## ') and not txt[i].startswith('---') \
                    and not txt[i].startswith('^') and txt[i].strip() != '=== page ===':
                if txt[i].strip().startswith('|'):
                    tbl.append(txt[i])
                elif txt[i].strip() and not txt[i].startswith('#'):
                    para = [txt[i].strip()]
                    i += 1
                    while i < n and txt[i].strip() and not txt[i].strip().startswith('|') \
                            and not txt[i].startswith('#') and not txt[i].startswith('---') \
                            and not txt[i].startswith('^') and txt[i].strip() != '=== page ===':
                        para.append(txt[i].strip()); i += 1
                    prose.append(' '.join(para))
                    continue
                i += 1
            doc['sections'].append({'title': title, 'table': tbl, 'prose': prose})
            continue
        elif line.startswith('**') and not doc['meta'] and doc['title']:
            doc['meta'] = line.strip('*').strip()
        elif line.startswith('*') and line.endswith('*') and len(line) > 4:
            doc['footer'] = line.strip('*').strip()
        i += 1
    return doc


# --------------------------------------------------------------------------- #
# html emit
# --------------------------------------------------------------------------- #
def _table_html(head, rows, lead_display=True):
    cols = len(head)
    # findings: theme | finding | number      actions: # | action | owner | move
    # Two different 4-column tables exist (findings and actions) and they need
    # opposite weightings, so key off the header rather than the column count.
    h0 = head[0].strip().lower()
    if cols == 3 and not h0:
        # start-vs-now comparison: wide label, two equal value columns
        grid = '1.25fr 1.35fr 1.5fr'
    elif cols == 4 and h0 in ('theme', 'axis'):
        grid = '21mm 2.15fr 1.35fr 0.75fr'            # findings
    elif cols == 4:
        grid = '6mm 2.7fr 0.62fr 1.0fr'               # actions
    elif cols == 5 and h0:
        # Named-entity lead column (per-repository detail). The other 5-col shape has a
        # numeric `#` lead and wants 0.16fr — keying off the count alone clipped repo
        # names to two characters. Same lesson as the two 4-column tables above.
        grid = '1.85fr 0.8fr 0.62fr 0.55fr 0.6fr'
    else:
        grid = {2: '0.95fr 2.6fr',
                3: '0.6fr 2.55fr 1.5fr',   # findings (theme/finding/number)
                5: '0.16fr 2.3fr 0.8fr 0.55fr 0.95fr'}.get(
            cols, ' '.join(['1fr'] * cols))
    grid = ' '.join(f'minmax(0, {tr})' if tr.endswith('fr') else tr for tr in grid.split())
    out = [f'<div class="value-table" style="--cols:{grid}">']
    if any(c.strip() for c in head):          # an all-empty header row is a layout artifact
        out.append('<div class="vt-row vt-head">'
                   + ''.join(f'<div class="vt-cell">{_inline(c)}</div>' for c in head)
                   + '</div>')
    for r in rows:
        cells = []
        for j, c in enumerate(r):
            cls = 'vt-cell vt-goal' if (j == 0 and lead_display) else 'vt-cell'
            cells.append(f'<div class="{cls}">{_inline(c)}</div>')
        out.append('<div class="vt-row">' + ''.join(cells) + '</div>')
    out.append('</div>')
    return ''.join(out)


EXTRA_CSS = """

  .tr-hero { background: var(--t50); padding: 8mm 20mm 0; position: relative; }
  .tr-eyebrow { font-family: var(--f-body); font-size: 7.6pt; font-weight: 700;
                letter-spacing: 0.14em; text-transform: uppercase; color: var(--t500); }
  .tr-title { font-family: var(--f-display); font-size: 20pt; font-weight: 800;
              color: var(--t900); letter-spacing: -0.015em; margin-top: 2.5mm; line-height: 1.05; }
  .tr-meta { font-family: var(--f-display); font-size: 9.6pt; font-weight: 500;
             color: var(--t700); margin-top: 1.4mm; padding-bottom: 6mm; }
  .tr-mark { position: absolute; top: 14mm; right: 20mm; height: 7mm; width: auto; }
  .tr-accent { position: absolute; bottom: 0; left: 0; right: 0; height: 1.1mm; background: var(--t500); }

  .tr-body { padding: 4mm 20mm 11.5mm; }

  .tr-cont { background: var(--t50); padding: 6mm 20mm 4.4mm; position: relative; }
  .tr-cont span { font-family: var(--f-display); font-size: 11pt; font-weight: 700;
                  color: var(--t900); }
  .tr-cont .tr-cont-tag { font-family: var(--f-body); font-size: 7.6pt; font-weight: 700;
                          letter-spacing: 0.12em; text-transform: uppercase;
                          color: var(--t500); margin-left: 3mm; }
  .tr-cont .tr-mark { top: 6mm; }


  .tr-headline { display: grid; grid-template-columns: 33mm minmax(0, 1fr); gap: 4.2mm;
                 background: var(--t50); border-left: 1.1mm solid var(--t500);
                 padding: 3mm 4.2mm; margin-bottom: 4.4mm; align-items: center; }
  .trh-num { font-family: var(--f-display); font-size: 21pt; font-weight: 800;
             color: var(--t500); letter-spacing: -0.02em; line-height: 0.95; }
  .trh-label { font-family: var(--f-body); font-size: 6.9pt; font-weight: 700;
               letter-spacing: 0.06em; text-transform: uppercase; color: var(--t700);
               margin-top: 1.4mm; line-height: 1.22; hyphens: none; }
  .trh-text { font-family: var(--f-body); font-size: 8.5pt; line-height: 1.42;
              color: var(--t900); }
  .trh-text strong { font-weight: 700; }
  .tr-solo { background: var(--t50); border-left: 1.1mm solid var(--t500);
             padding: 3.6mm 4.6mm; margin-bottom: 5mm; }

  .tr-fine { font-family: var(--f-body); font-size: 7pt; line-height: 1.38;
             color: var(--mineral); margin-top: 2.1mm;
             border-top: 0.4pt solid var(--t100); padding-top: 1.5mm; }
  .tr-fine strong { color: var(--t700); font-weight: 700; }
  .tr-fine-lead { margin-bottom: 1.4mm; }

  .tr-fine-list { columns: 2; column-gap: 7mm; margin: 0; padding: 0; list-style: none; }
  .tr-fine-list li { break-inside: avoid; padding-left: 2.4mm; text-indent: -2.4mm;
                     margin-bottom: 0.9mm; }
  .tr-fine-list li::before { content: "•"; color: var(--t300); padding-right: 1.2mm; }
  .tr-cov { background: var(--t50); border-left: 1.1mm solid var(--t500);
            padding: 3mm 4.2mm; margin-bottom: 4.6mm; }
  .tr-cov p { font-family: var(--f-body); font-size: 8.1pt; line-height: 1.45;
              color: var(--t900); }
  .tr-cov p + p { margin-top: 2mm; }

  .tr-h2 { font-family: var(--f-display); font-size: 11.6pt; font-weight: 700;
           color: var(--t900); letter-spacing: -0.01em; padding-bottom: 1.3mm;
           border-bottom: 0.7pt solid var(--t500); margin: 0 0 2.2mm; }
  .tr-sec + .tr-sec { margin-top: 3mm; }
  .tr-note { font-family: var(--f-body); font-size: 8.2pt; line-height: 1.45;
             color: var(--t700); margin-top: 1.6mm; }
  .tr-note strong { color: var(--t900); }

  .tr-levels { font-family: var(--f-body); font-size: 8.5pt; line-height: 1.55;
               color: var(--t900); background: #fff; border: 0.4pt solid var(--t100);
               border-radius: 2mm; padding: 3.5mm 4mm; margin-top: 3mm; }
  .tr-levels strong { font-family: var(--f-display); font-weight: 700; color: var(--t500); }

  .value-table { margin: 0; }
  .vt-row { grid-template-columns: var(--cols); }

  .vt-cell { padding: 1.25mm 2.5mm; font-size: 8pt; line-height: 1.32; }
  .vt-head .vt-cell { font-size: 7pt; }
  .vt-goal { background: var(--t50); }
  .vt-goal strong { display: block; font-family: var(--f-display); font-size: 9.6pt;
                    color: var(--t500); font-weight: 700; margin-bottom: 0; }
  code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 7.6pt;
         color: var(--t700); }
  .tr-footer { position: absolute; bottom: 0; left: 0; right: 0; height: 8.5mm;
               padding: 0 20mm; display: flex; align-items: center;
               justify-content: space-between; border-top: 0.4pt solid var(--t100); }
  .tr-footer span { font-family: var(--f-body); font-size: 7.8pt; color: var(--mineral); }
"""


_PAGEBREAK = object()


def build_html(doc, client, mark_svg):
    secs = []
    for s in doc['sections']:
        if s.get('pagebreak'):
            secs.append(_PAGEBREAK)
            continue
        inner = [f'<div class="tr-h2">{_inline(s["title"])}</div>']
        if s['table']:
            head, rows = _rows(s['table'])
            plain_lead = len(head) in (2, 3) and not head[0].strip()
            inner.append(_table_html(head, rows, lead_display=not plain_lead))
        for p in s['prose']:
            cls = 'tr-note'
            inner.append(f'<div class="{cls}">{_inline(p)}</div>')
        secs.append(f'<div class="tr-sec">{"".join(inner)}</div>')

    hl = ''
    if doc['headline']:
        num, label, text = doc['headline']
        if num:
            hl = (f'<div class="tr-headline"><div><div class="trh-num">{_inline(num)}</div>'
                  f'<div class="trh-label">{_inline(label)}</div></div>'
                  f'<div class="trh-text">{_inline(text)}</div></div>')
        else:
            hl = f'<div class="tr-solo"><div class="trh-text">{_inline(text)}</div></div>'
    note = ''
    if doc['note']:
        parts = []
        if doc['note']['lead']:
            parts.append(f'<p class="tr-fine-lead">{_inline(doc["note"]["lead"])}</p>')
        if doc['note']['items']:
            lis = ''.join(f'<li>{_inline(it)}</li>' for it in doc['note']['items'])
            parts.append(f'<ul class="tr-fine-list">{lis}</ul>')
        note = f'<div class="tr-fine">{"".join(parts)}</div>'

    # Split the section stream on pagebreak sentinels -> one .page box each.
    groups, cur = [], []
    for item in secs:
        if item is _PAGEBREAK:
            groups.append(cur)
            cur = []
        else:
            cur.append(item)
    groups.append(cur)
    groups = [g for g in groups if g] or [[]]
    total = len(groups)
    title_txt = _inline(doc['title'].replace('— Trial Findings', '').strip())
    hero = (f'<div class="tr-hero">{mark_svg}'
            f'<div class="tr-eyebrow">Trial Findings</div>'
            f'<div class="tr-title">{title_txt}</div>'
            f'<div class="tr-meta">{_inline(doc["meta"])}</div>'
            f'<div class="tr-accent"></div></div>')
    built = []
    for idx, group in enumerate(groups):
        # Page 1 carries the hero and the headline; a continuation page gets a slim
        # band instead, so page 2 is identifiable without repeating the whole masthead.
        if idx == 0:
            head, lead = hero, hl
        else:
            head = (f'<div class="tr-cont">{mark_svg}<span>{title_txt}</span>'
                    f'<span class="tr-cont-tag">Trial Findings, continued</span>'
                    f'<div class="tr-accent"></div></div>')
            lead = ''
        # The fine print sits on the LAST page only — it annotates the whole document.
        tail = note if idx == total - 1 else ''
        pager = f'<span>{idx + 1} / {total}</span>' if total > 1 else '<span>Product</span>'
        built.append(
            f'<div class="page">{head}'
            f'<div class="tr-body">{lead}{"".join(group)}{tail}</div>'
            f'<div class="tr-footer"><span>{_inline(doc["footer"])}</span>{pager}</div>'
            f'</div>')
    pages = ''.join(built)
    return f"""<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<title>{html.escape(client)} — Trial Findings</title>
<style>{CSS}{EXTRA_CSS}</style></head><body>
  {pages}
</body></html>"""


def _assert_fits(html_path):
    """Fail loudly when content overflows the single page.

    `.page` is a fixed 297mm box with `overflow: hidden`, so Chrome does not
    complain about an overlong document — it clips the tail and prints the
    absolutely-positioned footer over whatever is left. The failure is invisible
    in the PDF unless you happen to look at the bottom of the page. Same class of
    silent failure as the relative file:// URL, so it gets the same treatment.
    """
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        sys.exit('playwright missing — fit and rendering pending; install requirements first')
    with sync_playwright() as pw:
        br = pw.chromium.launch()
        pg = br.new_page(viewport={'width': 900, 'height': 1400})
        pg.goto(f'file://{html_path}')
        pg.evaluate('document.fonts.ready')
        pg.wait_for_load_state('networkidle')
        ms = pg.evaluate("""() => Array.from(document.querySelectorAll('.page')).map(page => {
            const body = page.querySelector('.tr-body');
            const foot = page.querySelector('.tr-footer');
            if (!body.lastElementChild) return {overflow: -1, slack: 0, empty: true};
            const last = body.lastElementChild.getBoundingClientRect().bottom;
            return {overflow: last - foot.getBoundingClientRect().top,
                    slack:    page.getBoundingClientRect().bottom - last, empty: false};
        })""")
        br.close()
    px_per_mm = 96 / 25.4
    bad = [(i + 1, m) for i, m in enumerate(ms) if m['overflow'] > 0]
    if bad:
        detail = '; '.join(f"page {i} by {m['overflow'] / px_per_mm:.1f}mm" for i, m in bad)
        sys.exit(f"content overflows — {detail}. Rows would be clipped: cut content, "
                 f"tighten .vt-cell, or add a `=== page ===` break.")
    print('fit : ok (' + ', '.join(
        f"p{i + 1} {m['slack'] / px_per_mm:.1f}mm clear" for i, m in enumerate(ms)) + ')')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--md', required=True)
    ap.add_argument('--client', required=True)
    ap.add_argument('--out', default=None)
    ap.add_argument('--brand-config', default=None)
    a = ap.parse_args()
    brand = load_brand(a.brand_config)
    global CSS
    CSS += brand_css(brand)

    doc = parse(a.md)
    if not doc['sections']:
        sys.exit('no ## sections parsed — check the markdown contract')

    mark = pathlib.Path(brand.get('logo_path') or SKILL / 'assets/neutral-mark.svg')
    mark_svg = ''
    if not mark.is_file():
        raise FileNotFoundError(f'Required logo missing: {mark}')
    if mark.exists():
        import base64
        b64 = base64.b64encode(mark.read_bytes()).decode()
        mark_svg = f'<img class="tr-mark" src="data:image/svg+xml;base64,{b64}" alt="Product">'

    # Absolute paths are mandatory: Chrome resolves a relative file:// URL against
    # its own cwd, silently renders its "page not available" error, and still exits 0
    # with a plausible ~65KB PDF. Nothing in the output tells you it failed.
    outdir = pathlib.Path(a.md).resolve().parent
    html_path = outdir / f'{pathlib.Path(a.md).stem}.html'
    rendered_html = build_html(doc, a.client, mark_svg)
    rendered_html = rendered_html.replace('<span>Product</span>', '<span>' + html.escape(brand['name']) + '</span>')
    html_path.write_text(rendered_html)
    pdf = (pathlib.Path(a.out).resolve() if a.out
           else outdir / f'{pathlib.Path(a.md).stem}-findings.pdf')

    _assert_fits(html_path)

    from playwright.sync_api import sync_playwright
    from pypdf import PdfReader
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page()
        page.goto(html_path.as_uri())
        page.evaluate('document.fonts.ready')
        page.pdf(path=str(pdf), format='A4', margin={'top':'0','bottom':'0','left':'0','right':'0'}, print_background=True)
        browser.close()
    reader = PdfReader(str(pdf))
    extracted = ' '.join(p.extract_text() or '' for p in reader.pages)
    ok = bool(reader.pages) and doc['title'].split('—')[0].strip() in extracted
    print(f'html: {html_path}')
    print(f'pdf : {pdf}  ({pdf.stat().st_size // 1024} KB)')
    if not ok:
        sys.exit('PDF looks empty or is an error page — check the file:// URL')


if __name__ == '__main__':
    main()
