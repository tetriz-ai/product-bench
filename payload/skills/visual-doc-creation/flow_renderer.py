#!/usr/bin/env python3
# Copyright 2026 Workloom Solutions Private Limited
# SPDX-License-Identifier: MIT
"""Render Markdown to PDF with optional task-configured layout patterns.

CLI: python3 flow_renderer.py --src source.md --output output.pdf
Library: FlowConfig and render_flow_doc. Neutral preview branding by default.
"""

import argparse
import html as html_utils
import json
from brand_config import load_brand, brand_css
import base64
import markdown
import os
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Optional, Tuple

SKILL_DIR = Path(__file__).parent


# ── Configuration ──────────────────────────────────────────────────────────────

@dataclass
class FlowConfig:
    """All rendering parameters for a flow document. Override per-doc as needed."""

    # Document identity
    sender: str = ""
    date_label: str = ""
    doc_title: str = "Example"
    doc_tagline: str = "Neutral layout preview"

    brand_config: Optional[str] = None
    logo_path: Optional[str] = None
    font_url: Optional[str] = None

    # Directory where dash-* and demo-* images live (defaults to src parent dir)
    assets_dir: Optional[str] = None

    # Optional icon injection from a reviewed caller-supplied registry.
    enable_icons: bool = False
    icon_registry_path: Optional[str] = None  # reviewed JSON of name -> SVG child markup
    section_icons: List[Tuple[str, str]] = field(default_factory=list)
    pillar_icons: Dict[str, str] = field(default_factory=dict)

    # Legacy name for contextual section navigation; <=5 labels fit this implementation.
    # None: identity header; "off": no header; list: contextual navigation.
    pillar_nav: Optional[List[str]] = None
    # Optional numbered-section bands and page breaks; no chapter structure is inferred by default.
    numbered_section_bands: bool = False
    show_cover: bool = False
    show_contact: bool = False
    label_body_split_threshold: int = 0  # zero disables sentence emphasis
    logo_intake: bool = False  # optional advisory inventory, never an approval gate
    page_break_h2: List[str] = field(default_factory=list)
    callout_labels: List[str] = field(default_factory=list)
    subhead_labels: List[str] = field(default_factory=list)


# ── Asset inventory ──────────────────────────────────────────────────────

# Brand patterns most likely to warrant a logo treatment when they appear in
# a list context (founders' previous orgs, connector lists, partner mentions).
# Keys are lowercase substring match; values are the canonical brand label.
LOGO_CANDIDATES = {}  # populate only from reviewed task/brand input



def logo_intake(md_text: str, assets_dir: Path, *, prompt: bool = True) -> Dict[str, str]:
    """Optionally report task-configured asset candidates; does not request approval."""
    md_lower = md_text.lower()
    mentioned = {}
    for needle, brand in LOGO_CANDIDATES.items():
        if needle in md_lower:
            # Match supported asset prefixes as well as bare filenames.
            slug = brand.lower().replace(' ', '-').replace('&', 'and')
            first_word = slug.split('-')[0]
            candidates = (
                list(assets_dir.glob(f'{slug}*'))
                + list(assets_dir.glob(f'{first_word}*'))
                + list(assets_dir.glob(f'demo-logo-{first_word}*'))
                + list(assets_dir.glob(f'demo-team-{first_word}*'))
                + list(assets_dir.glob(f'dash-{first_word}*'))
            )
            mentioned[brand] = 'available' if candidates else 'missing'

    if prompt and mentioned:
        print('\n── Asset inventory ─────────────────────────────────────')
        print(f'Brands mentioned in this doc: {len(mentioned)}')
        for brand, status in sorted(mentioned.items()):
            marker = '✓' if status == 'available' else '✗'
            print(f'  [{marker}] {brand:<22} ({status})')
        missing = [b for b, s in mentioned.items() if s == 'missing']
        if missing:
            print(f'\n  Missing optional assets: {len(missing)}; searched:')
            print(f'    {assets_dir}')
            print('    Inventory only; authored image references still must resolve.')
        print('───────────────────────────────────────────────────────────────\n')

    return mentioned


# ── Running header ──────────────────────────────────────────────────────────────

def _pillar_nav_header(doc_title: str, pillars: List[str], active: Optional[str], tokens=None) -> str:
    """Build the pages-2+ running header with the pillar nav breadcrumb.

    `active` is the pillar name to highlight (accent, full opacity); all others
    render muted. Pass active=None for the all-muted state (cover, framing
    pages). The active pillar cannot be known from a single
    Playwright header_template, so render_flow_doc renders one variant per
    pillar state and stitches the right one onto each physical page.
    """
    tokens = tokens or load_brand()["tokens"]
    def span(p: str) -> str:
        if active and p.lower() == active.lower():
            return (f'<span style="color:{tokens["t500"]}; opacity:1;'
                    f' font-weight:700;">{html_utils.escape(p.upper())}</span>')
        return f'<span style="color:{tokens["mineral"]}; opacity:0.45;">{html_utils.escape(p.upper())}</span>'

    nav_items = ' &middot; '.join(span(p) for p in pillars)
    # Playwright's header_template/footer_template render in an isolated
    # mini-document with no access to the main page's @font-face fonts.
    # Naming a brand font here (even with a generic fallback) silently
    # collapses to Times in Chromium — name a real system font directly.
    return (
        '<div style="font-size:7pt; font-family:Helvetica,Arial,sans-serif;'
        ' width:100%; padding:0 14mm; display:flex;'
        ' justify-content:space-between; align-items:center;">'
        '<span style="font-family:Helvetica,Arial,sans-serif; font-weight:800;'
        f' color:{tokens["t900"]}; font-size:9pt;">' + doc_title + '</span>'
        f'<span style="letter-spacing:0.14em;">{nav_items}</span>'
        '</div>'
    )


def _page_pillar_map(pdf_path: str, pillars: List[str]) -> List[Optional[str]]:
    """Return the owning pillar for each physical page of a rendered PDF.

    A page owns the pillar whose opener (``0N — Name``) it introduces; pages
    with no opener inherit the current pillar. Pages before the first numbered opener own no section. The ``0N`` numeric
    prefix is required so the uppercase nav breadcrumb in the running header
    never false-matches.
    """
    from pypdf import PdfReader

    name_alt = '|'.join(re.escape(p) for p in pillars)
    opener_re = re.compile(r'\b\d{2}\s*\S{0,3}\s*(' + name_alt + r')', re.I)
    canon = {p.lower(): p for p in pillars}

    owners: List[Optional[str]] = []
    current: Optional[str] = None
    for page in PdfReader(pdf_path).pages:
        text = page.extract_text() or ''
        m = opener_re.search(text)
        if m:
            current = canon[m.group(1).lower()]
        owners.append(current)
    return owners


# ── Renderer ───────────────────────────────────────────────────────────────────

def render_flow_doc(
    src: str,
    output: str,
    config: FlowConfig,
    html_out: Optional[str] = None,
) -> str:
    """Convert a markdown file to a PDF. Returns the output path."""

    brand = load_brand(config.brand_config)
    if config.brand_config:
        config.doc_title = brand["name"]
        config.doc_tagline = brand["tagline"]
        config.sender = brand["sender"]
    config.doc_title = html_utils.escape(config.doc_title)
    config.doc_tagline = html_utils.escape(config.doc_tagline)
    config.sender = html_utils.escape(config.sender)
    config.date_label = html_utils.escape(config.date_label)
    src_path   = Path(src).resolve()
    output_path = Path(output).resolve()
    assets_dir  = Path(config.assets_dir).resolve() if config.assets_dir else src_path.parent

    # ── Load + pre-clean markdown ─────────────────────────────────────────────
    md = src_path.read_text()

    if config.logo_intake:
        logo_intake(md, assets_dir, prompt=True)

    # Pre-render markdown inside <td> cells (md_in_html is finicky)
    def render_td(match):
        attrs = match.group(1)
        inner = markdown.markdown(match.group(2).strip(), extensions=['extra', 'tables', 'sane_lists'])
        return f'<td{attrs}>{inner}</td>'
    md = re.sub(r'<td([^>]*)>(.*?)</td>', render_td, md, flags=re.DOTALL)

    html_body = markdown.markdown(md, extensions=['extra', 'tables', 'sane_lists'])

    # ── Image embedding ───────────────────────────────────────────────────────
    def embed_or_placeholder(match):
        alt, fname = match.group(1), match.group(2)
        img_path = assets_dir / fname
        if img_path.exists():
            data = base64.b64encode(img_path.read_bytes()).decode()
            ext  = img_path.suffix.lstrip('.')
            mime = 'image/svg+xml' if ext == 'svg' else f'image/{ext}'
            return f'<img class="dash-img" alt="{alt}" src="data:{mime};base64,{data}"/>'
        raise FileNotFoundError(f'Required document image missing: {img_path}')

    html_body = re.sub(
        r'<img alt="([^"]*)" src="((?:dash-|demo-)[^"]+)"\s*/?>',
        embed_or_placeholder, html_body)

    # Wrap image + trailing italic caption in a <figure>
    html_body = re.sub(
        r'(?:<p>)?(<img class="dash-img"[^>]*/?>)(?:</p>)?\s*<p>\s*<em>(.*?)</em>\s*</p>',
        r'<figure class="dash-figure">\1<figcaption>\2</figcaption></figure>',
        html_body, flags=re.DOTALL)

    # ── Optional layout pattern injection ───────────────────────────────────────────────

    # 1. Pillar opener H2s → icon + band class
    def inject_pillar_icon(match):
        text = match.group(1)
        for prefix, icon in config.pillar_icons.items():
            if text.strip().startswith(prefix):
                return (f'<h2 class="pillar-opener">'
                        f'<i data-icon="{icon}" class="pillar-icon"></i>'
                        f'<span>{text}</span></h2>')
        return f'<h2 class="pillar-opener">{text}</h2>'

    if config.numbered_section_bands:
        html_body = re.sub(r'<h2>(\d{2}[^<]*)</h2>', inject_pillar_icon, html_body)

    # 2. Section H3s → icon + label class
    # Only explicitly mapped subsection headings receive supplied icons.
    def inject_section_icon(match):
        text = match.group(1)
        if not config.enable_icons:
            return f'<h3>{text}</h3>'
        tl = text.lower()
        for pattern, icon in config.section_icons:
            if pattern in tl:
                return (f'<h3 class="icon-label">'
                        f'<i data-icon="{icon}" class="sub-icon"></i>'
                        f'<span>{text}</span></h3>')
        return f'<h3>{text}</h3>'

    html_body = re.sub(r'<h3>([^<]+)</h3>', inject_section_icon, html_body)

    # When a <p class="label-body"> (or directly after a label-row) has >threshold
    # words, wrap the first sentence in <span class="micro-lede"> for visual relief.
    def split_label_body(match):
        body = match.group(1).strip()
        word_count = len(body.split())
        if config.label_body_split_threshold <= 0 or word_count <= config.label_body_split_threshold:
            return f'<p class="label-body">{body}</p>'
        # Split on the first sentence-terminating punctuation
        m = re.match(r'(.+?[.!?])\s+(.+)$', body, re.DOTALL)
        if not m:
            return f'<p class="label-body">{body}</p>'
        first, rest = m.group(1).strip(), m.group(2).strip()
        return (f'<p class="label-body">'
                f'<span class="micro-lede">{first}</span> {rest}</p>')

    html_body = re.sub(
        r'<p class="label-body">(.+?)</p>',
        split_label_body, html_body, flags=re.DOTALL)

    # 3. Callout boxes
    for label in config.callout_labels:
        html_body = re.sub(
            rf'<p><strong>{re.escape(label)}</strong>(.*?)</p>',
            rf'<div class="delivers-callout"><strong>{label}</strong>\1</div>',
            html_body, flags=re.DOTALL)

    # 4. Subheads
    for label in config.subhead_labels:
        html_body = html_body.replace(
            f'<p><strong>{label}</strong></p>',
            f'<p class="section-subhead">{label}</p>')

    # 5. Page breaks
    html_body = re.sub(
        r'(<h2 class="pillar-opener">)',
        r'<div class="page-break"></div>\1',
        html_body)
    for trigger in config.page_break_h2:
        html_body = re.sub(
            rf'(<h2[^>]*>\s*{re.escape(trigger)}\s*</h2>)',
            r'<div class="page-break"></div>\1',
            html_body, flags=re.IGNORECASE)

    # Use a reviewed explicit mark, only task-approved assets.
    logo_path = Path(config.logo_path or brand.get('logo_path') or SKILL_DIR / 'assets/neutral-mark.svg').resolve()
    if not logo_path.is_file():
        raise FileNotFoundError(f'Reviewed logo unavailable: {logo_path}')

    logo_data = base64.b64encode(logo_path.read_bytes()).decode()
    ext = logo_path.suffix.lstrip('.')
    logo_mime = 'image/svg+xml' if ext == 'svg' else f'image/{ext}'
    logo_src  = f'data:{logo_mime};base64,{logo_data}'

    # ── Brand CSS ─────────────────────────────────────────────────────────────
    css = (SKILL_DIR / 'brand-system.css').read_text() + brand_css(brand)
    font_link = ('<link rel="stylesheet" href="' + html_utils.escape(config.font_url or brand.get('font_url',''), quote=True) + '">') if (config.font_url or brand.get('font_url')) else ''
    icon_shapes = json.loads(Path(config.icon_registry_path).read_text()) if config.icon_registry_path else {}
    def embed_icon(match):
        name, cls = match.group(1), match.group(2)
        if not config.icon_registry_path:
            return ''  # no inherited icon assets; headings retain their text
        if name not in icon_shapes:
            raise ValueError(f'Unknown supplied icon: {name}')
        return f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">{icon_shapes[name]}</svg>'
    html_body = re.sub(r'<i data-(?:icon|lucide)="([^"]+)" class="([^"]+)"></i>', embed_icon, html_body)

    # Optional furniture; source headings and authored content remain intact.
    cover = f'<div class="cover"><span class="cover-eyebrow">{html_utils.escape(brand["confidentiality"])} · {config.date_label}</span><div class="cover-logo-row"><img src="{logo_src}" alt="{config.doc_title}"/></div><h1>{config.doc_title}</h1><div class="tagline">{config.doc_tagline}</div></div>' if config.show_cover else ''
    contact = f'<div class="contact"><strong>{html_utils.escape(brand["website"])}</strong><strong>{config.sender}</strong></div>' if config.show_contact else ''
    html = f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{config.doc_title}</title>{font_link}<style>{css}</style></head><body>{cover}{html_body}{contact}</body></html>'

    # Write HTML (for inspection / debugging)
    html_path = Path(html_out).resolve() if html_out else output_path.with_suffix('.html')
    html_path.write_text(html)

    # ── Render PDF via Playwright ─────────────────────────────────────────────
    from playwright.sync_api import sync_playwright

    # header_template/footer_template render in an isolated mini-document with
    # no access to the main page's @font-face fonts — naming a brand font here
    # (even with a generic fallback) silently collapses to Times in Chromium.
    # Name a real system font directly instead.
    footer_tpl = (
        f'<div style="font-size:7pt; color:{brand["tokens"]["mineral"]}; font-family:Helvetica,Arial,sans-serif;'
        ' width:100%; text-align:center; padding:0 14mm;">'
        + config.doc_title + ' &middot; ' + html_utils.escape(brand['confidentiality']) + '</div>'
    )

    #   pillar_nav == "off"        → no header
    #   pillar_nav == [..≤5..]     → pillar nav breadcrumb, active pillar
    #                                highlighted contextually per page
    #   otherwise                  → wordmark only
    pdf_margin = {'top': '16mm', 'right': '14mm', 'bottom': '20mm', 'left': '14mm'}
    contextual = bool(config.pillar_nav) and config.pillar_nav != "off" \
        and len(config.pillar_nav) <= 5

    if config.pillar_nav == "off":
        header_tpl = '<div></div>'
    elif contextual:
        header_tpl = _pillar_nav_header(config.doc_title, config.pillar_nav, None, brand["tokens"])
    else:
        header_tpl = (
            '<div style="font-size:9pt; font-family:Helvetica,Arial,sans-serif;'
            f' font-weight:800; color:{brand["tokens"]["t900"]}; width:100%; padding:0 14mm;'
            ' text-align:left;">' + config.doc_title + '</div>'
        )

    def _render(page, header, dest):
        page.pdf(
            path=str(dest),
            format='A4',
            margin=pdf_margin,
            display_header_footer=True,
            header_template=header,
            footer_template=footer_tpl,
            print_background=True,
        )

    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page    = browser.new_page()
        page.goto(f'file://{html_path}')
        page.wait_for_load_state('networkidle')
        page.evaluate('document.fonts.ready')

        if not contextual:
            _render(page, header_tpl, output_path)
        else:
            # Playwright's header_template is a single template applied to every
            # physical page, so contextual highlighting needs one render per
            # pillar state (plus an all-muted base) stitched together page by
            # page. Render the muted base first to learn which pillar each page
            # owns, then render only the pillar variants that page map needs.
            import tempfile
            from pypdf import PdfReader, PdfWriter

            tmp = Path(tempfile.mkdtemp(prefix='flowpdf-'))
            base_pdf = tmp / 'base.pdf'
            _render(page, header_tpl, base_pdf)

            owners = _page_pillar_map(str(base_pdf), config.pillar_nav)
            variants = {None: base_pdf}
            for pillar in config.pillar_nav:
                if pillar in owners:
                    variant_pdf = tmp / f'{pillar.lower()}.pdf'
                    _render(page, _pillar_nav_header(
                        config.doc_title, config.pillar_nav, pillar, brand["tokens"]), variant_pdf)
                    variants[pillar] = variant_pdf

            # The cover carries no running nav — render page 1 headerless
            # (footer kept) and stitch it in as page 0.
            cover_pdf = tmp / 'cover.pdf'
            page.pdf(
                path=str(cover_pdf),
                format='A4',
                margin=pdf_margin,
                display_header_footer=True,
                header_template='<div></div>',
                footer_template=footer_tpl,
                print_background=True,
                page_ranges='1',
            )
            cover_reader = PdfReader(str(cover_pdf))

            readers = {k: PdfReader(str(v)) for k, v in variants.items()}
            writer = PdfWriter()
            for i, owner in enumerate(owners):
                src = cover_reader.pages[0] if i == 0 and config.show_cover else readers[owner].pages[i]
                writer.add_page(src)
            with open(output_path, 'wb') as fh:
                writer.write(fh)

            for f in tmp.glob('*.pdf'):
                f.unlink()
            tmp.rmdir()

        browser.close()

    size = output_path.stat().st_size
    print(f'PDF written: {output_path}')
    print(f'Size: {size:,} bytes ({size / 1024 / 1024:.1f} MB)')
    return str(output_path)


# ── CLI entry point ────────────────────────────────────────────────────────────

if __name__ == '__main__':
    parser = argparse.ArgumentParser(
        description='Flow document renderer — markdown → PDF')
    parser.add_argument('--src',        required=True, help='Source markdown file')
    parser.add_argument('--output',     required=True, help='Output PDF path')
    parser.add_argument('--sender',     default='', help='Sender email for footer')
    parser.add_argument('--date-label', default='',      help='Eyebrow date label')
    parser.add_argument('--assets-dir', default=None,             help='Image assets directory')
    parser.add_argument('--html-out',   default=None,             help='Path for intermediate HTML')
    parser.add_argument('--brand-config', help='Reviewed brand JSON; neutral preview defaults otherwise')
    parser.add_argument('--title', default='Example')
    parser.add_argument('--tagline', default='Neutral layout preview')
    args = parser.parse_args()

    cfg = FlowConfig(
        sender=args.sender,
        doc_title=args.title,
        doc_tagline=args.tagline,
        brand_config=args.brand_config,
        date_label=args.date_label,
        assets_dir=args.assets_dir,
    )
    render_flow_doc(src=args.src, output=args.output, config=cfg, html_out=args.html_out)
