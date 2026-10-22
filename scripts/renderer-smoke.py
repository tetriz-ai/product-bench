#!/usr/bin/env python3
# Copyright 2026 Workloom Solutions Private Limited
# SPDX-License-Identifier: MIT
"""Optional offline renderer acceptance checks; outputs belong outside the checkout."""
import argparse, importlib.util, json, shutil, subprocess, sys
from pathlib import Path
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
FIXTURES = ROOT / 'scripts/fixtures/renderers'

def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    value = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(value)
    return value

def run(out):
    out = Path(out).resolve()
    out.mkdir(parents=True, exist_ok=True)
    sys.path.insert(0, str(ROOT / 'payload/skills/slide-deck'))
    deck = module('deck_smoke', ROOT / 'payload/skills/slide-deck/render_deck.py')
    receipt = deck.render(FIXTURES / 'slide.html', FIXTURES / 'slides.json', out / 'slide')
    assert receipt['slides'] == ['S01'] and receipt['pdf_pages'] == 1
    assert receipt['canvas_fit'] == 'passed' and receipt['images'] == 'loaded'
    assert json.loads((out / 'slide/render-receipt.json').read_text()) == receipt
    assert (out / 'slide/S01.png').read_bytes().startswith(b'\x89PNG\r\n\x1a\n')
    assert 'Fictional renderer smoke' in PdfReader(str(out / 'slide/deck.pdf')).pages[0].extract_text()
    schema = json.loads((FIXTURES / 'slides.json').read_text())
    cases = [('empty', {'slides': []}, None, 'Nonempty schema'),
             ('duplicate', {'slides': schema['slides'] * 2}, None, 'Nonempty schema'),
             ('surface', {'slides': [{'id': 'S01', 'surface': 'invalid'}]}, None, 'Invalid surface'),
             ('identity', schema, 'data-slide-id="S02"', 'identity mismatch'),
             ('asset', schema, '<img src="missing-fixture.png">', 'Missing image'),
             ('fit', schema, '<div style="position:absolute;left:1200px">Outside</div>', 'fit failure')]
    html = (FIXTURES / 'slide.html').read_text()
    for name, data, edit, message in cases:
        path = out / (name + '.json'); path.write_text(json.dumps(data))
        source = out / (name + '.html')
        text = html.replace('data-slide-id="S01"', edit) if name == 'identity' else html.replace('</div></section>', (edit or '') + '</div></section>')
        source.write_text(text)
        try: deck.render(source, path, out / name)
        except ValueError as error: assert message.lower() in str(error).lower(), (name, error)
        else: raise AssertionError('Invalid renderer fixture accepted: ' + name)
    sys.path[0] = str(ROOT / 'payload/skills/visual-doc-creation')
    sys.modules.pop('brand_config', None)
    import flow_renderer
    flow_renderer.render_flow_doc(str(FIXTURES / 'document.md'), str(out / 'flow.pdf'), flow_renderer.FlowConfig(doc_title='Fictional renderer smoke', doc_tagline='Offline fixture'))
    assert 'Fictional renderer smoke' in ' '.join(p.extract_text() or '' for p in PdfReader(str(out / 'flow.pdf')).pages)
    shutil.copy2(FIXTURES / 'document.md', out / 'report.md')
    subprocess.run([sys.executable, str(ROOT / 'payload/skills/visual-doc-creation/build_trial_report.py'), '--md', str(out / 'report.md'), '--client', 'Fictional audience', '--out', str(out / 'report.pdf')], check=True)
    assert 'Fictional renderer smoke' in ' '.join(p.extract_text() or '' for p in PdfReader(str(out / 'report.pdf')).pages)
    print(json.dumps({'slide': 'PNG/PDF/text/receipt verified', 'invalid_slide_cases': len(cases), 'flow': 'PDF/text verified', 'report': 'PDF/text/fit verified', 'visual_inspection': 'required separately'}))

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--out', required=True)
    run(parser.parse_args().out)
