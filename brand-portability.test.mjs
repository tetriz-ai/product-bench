// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const hasPython = spawnSync('python3', ['--version']).status === 0;

test('both visual engines use supplied brand inputs and reject invalid CSS values', { skip: !hasPython }, () => {
  const target = mkdtempSync(join(tmpdir(), 'pb-brand-'));
  try {
    const brand = join(target, 'brand.json');
    writeFileSync(brand, JSON.stringify({ name: 'Fixture Studio', display_font: 'Courier New, monospace',
      body_font: 'Courier New, monospace', tokens: { t500: '#7c3aed', t900: '#2e1065' } }));
    for (const skill of ['visual-doc-creation', 'slide-deck']) {
      const module = fileURLToPath(new URL(`./payload/skills/${skill}/brand_config.py`, import.meta.url));
      const result = JSON.parse(execFileSync('python3', ['-c', `
import importlib.util,json,sys
spec=importlib.util.spec_from_file_location('tested_brand',sys.argv[1])
engine=importlib.util.module_from_spec(spec);spec.loader.exec_module(engine)
supplied=engine.load_brand(sys.argv[2]);defaults=engine.load_brand()
rejected=[]
for value in ['#12345','red; color: teal',123]:
    bad=engine.load_brand();bad['tokens']['t500']=value
    try: engine.brand_css(bad)
    except ValueError: rejected.append(value)
print(json.dumps({'name':supplied['name'],'css':engine.brand_css(supplied),'defaults':engine.brand_css(defaults),'rejected':rejected}))
`, module, brand], { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } }));
      assert.equal(result.name, 'Fixture Studio');
      assert.match(result.css, /--t500:#7c3aed/);
      assert.match(result.css, /--t900:#2e1065/);
      assert.match(result.css, /--f-display:Courier New, monospace/);
      assert.match(result.css, /--f-body:Courier New, monospace/);
      assert.deepEqual(result.rejected, ['#12345', 'red; color: teal', 123]);
      assert.match(result.defaults, /--t500:#64748b/);
      assert.match(result.defaults, /--t900:#1e293b/);
      const defaultFont = skill === 'slide-deck' ? 'system-ui, Arial, sans-serif' : 'Arial, sans-serif';
      assert.ok(result.defaults.includes(`--f-display:${defaultFont}`));
      assert.ok(result.defaults.includes(`--f-body:${defaultFont}`));
    }
  } finally { rmSync(target, { recursive: true, force: true }); }
});

test('visual starters use local fonts and explicitly configured icons', () => {
  for (const path of ['visual-doc-creation/TEMPLATE.html', 'visual-doc-creation/PRINCIPLES.md',
    'visual-doc-creation/DECISIONS.md', 'visual-doc-creation/HEURISTICS.md', 'slide-deck/Pattern-Library.html',
    'slide-deck/SKILL.md']) {
    const content = readFileSync(new URL(`./payload/skills/${path}`, import.meta.url), 'utf8');
    assert.doesNotMatch(content, /(?:@import\s+(?:url\()?['"]?https?:|<link[^>]+href=['"]https?:[^'"]*(?:font|css))/i, path);
  }
  const flow = readFileSync(new URL('./payload/skills/visual-doc-creation/flow_renderer.py', import.meta.url), 'utf8');
  assert.match(flow, /enable_icons: bool = False/);
  assert.match(flow, /icon_registry_path: Optional\[str\] = None/);
  assert.match(flow, /section_icons:.*default_factory=list/);
  assert.match(flow, /pillar_icons:.*default_factory=dict/);
});
