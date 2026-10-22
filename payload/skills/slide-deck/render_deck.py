#!/usr/bin/env python3
# Copyright 2026 Workloom Solutions Private Limited
# SPDX-License-Identifier: MIT
"""Export already authored Pattern Library slides; schema-to-HTML remains instruction-driven."""
import argparse, json, re
from pathlib import Path
from playwright.sync_api import sync_playwright
from pypdf import PdfReader

def render(html_path, schema_path, out):
    schema=json.loads(Path(schema_path).read_text())
    slides=schema['slides']; ids=[s['id'] for s in slides]
    if not slides or len(ids)!=len(set(ids)) or any(not re.fullmatch(r'S\d{2,}', i) for i in ids):
        raise ValueError('Nonempty schema requires unique S01-style slide IDs')
    for slide in slides:
        if slide['surface'] not in ('canvas','dark','forest'):
            raise ValueError(f"Invalid surface on {slide['id']}")
    out=Path(out).resolve();out.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as pw:
        browser=pw.chromium.launch()
        page=browser.new_page(viewport={'width':960,'height':540}, device_scale_factor=1)
        page.goto(Path(html_path).resolve().as_uri())
        page.evaluate('document.fonts.ready')
        page.add_style_tag(content='.slide{box-shadow:none}@page {size:960px 540px;margin:0} @media print {body{margin:0;background:white}.slide-page{width:960px;height:540px;margin:0!important;break-after:page;break-inside:avoid}.slide-page:last-child{break-after:auto}.slide{box-shadow:none}}')
        actual=page.locator('.slide-page').evaluate_all('(nodes)=>nodes.map(n=>n.dataset.slideId)')
        if actual!=ids:
            raise ValueError(f'Schema/DOM identity mismatch: {ids} versus {actual}')
        broken=page.locator('img').evaluate_all('(nodes)=>nodes.filter(n=>!n.complete || n.naturalWidth===0).map(n=>n.src)')
        if broken: raise ValueError(f'Missing image assets: {broken}')
        for slide in slides:
            wrapper=page.locator(f'.slide-page[data-slide-id="{slide["id"]}"]')
            if wrapper.locator('.slide').count()!=1:
                raise ValueError('Each page must contain exactly one slide')
            metrics=wrapper.locator('.slide').evaluate('''el=>{
              const box=el.getBoundingClientRect();
              const bad=Array.from(el.querySelectorAll('*')).filter(n=>{
                if(n.matches('.tex,.div-mark,.cv-num,svg *')) return false;
                const r=n.getBoundingClientRect(); const c=getComputedStyle(n);
                if(c.visibility==='hidden'||c.display==='none'||!r.width||!r.height) return false;
                return r.left<box.left-1||r.top<box.top-1||r.right>box.right+1||r.bottom>box.bottom+1;
              }).map(n=>n.className);
              return {width:box.width,height:box.height,bad};
            }''')
            if abs(metrics['width']-960)>1 or abs(metrics['height']-540)>1 or metrics['bad']:
                raise ValueError(f"Canvas/element fit failure {slide['id']}: {metrics}")
            wrapper.screenshot(path=str(out/f"{slide['id']}.png"))
        page.pdf(path=str(out/'deck.pdf'),width='960px',height='540px',print_background=True,prefer_css_page_size=True,margin={'top':'0','bottom':'0','left':'0','right':'0'})
        browser.close()
    reader=PdfReader(str(out/'deck.pdf'))
    if len(reader.pages)!=len(slides): raise ValueError('PDF page count differs from schema')
    text=' '.join(p.extract_text() or '' for p in reader.pages)
    if not text.strip(): raise ValueError('PDF contains no text; inspect for renderer error or lost content')
    receipt={'slides':ids,'pdf_pages':len(reader.pages),'html':str(Path(html_path).resolve()),'schema':str(Path(schema_path).resolve()),'canvas_fit':'passed','images':'loaded','visual_inspection':'pending'}
    (out/'render-receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
    return receipt

if __name__=='__main__':
    ap=argparse.ArgumentParser();ap.add_argument('--html',required=True);ap.add_argument('--schema',required=True);ap.add_argument('--out',required=True)
    a=ap.parse_args();print(json.dumps(render(a.html,a.schema,a.out),indent=2))
