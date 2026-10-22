// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const python = process.env.PB_RENDERER_PYTHON || 'python3';
const probe = spawnSync(python, ['-c', 'from playwright.sync_api import sync_playwright;import pypdf,markdown; p=sync_playwright().start();print(p.chromium.executable_path);p.stop()'], { encoding: 'utf8' });
const runtimeReady = probe.status === 0 && existsSync(probe.stdout.trim());
const available = spawnSync(python, ['--version']).status === 0;
test('Python entry points compile and missing renderer inputs fail', { skip: !available && 'Python unavailable' }, () => {
  const root = mkdtempSync(join(tmpdir(), 'pb-python-syntax-'));
  try {
    for (const file of ['scripts/renderer-smoke.py', 'payload/skills/slide-deck/render_deck.py', 'payload/skills/visual-doc-creation/flow_renderer.py', 'payload/skills/visual-doc-creation/build_trial_report.py']) {
      const syntax = spawnSync(python, ['-c', 'import ast,sys;ast.parse(open(sys.argv[1]).read())', file], { encoding: 'utf8' }); assert.equal(syntax.status, 0, syntax.stderr);
    }
    const guard = spawnSync(python, ['payload/skills/slide-deck/render_deck.py', '--html', join(root, 'missing.html'), '--schema', join(root, 'missing.json'), '--out', join(root, 'unused')], { encoding: 'utf8', env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } }); assert.notEqual(guard.status, 0, 'missing input must fail even if optional imports are unavailable');
  } finally { rmSync(root, { recursive: true, force: true }); }
});
test('optional Python renderers emit actual artifacts and reject invalid slides', { skip: !runtimeReady && 'Optional renderer dependencies or Chromium binary unavailable; see docs/RENDERER-VERIFICATION.md', timeout: 120000 }, () => {
  const root = mkdtempSync(join(tmpdir(), 'pb-render-smoke-'));
  try { const r = spawnSync(python, ['scripts/renderer-smoke.py', '--out', root], { encoding: 'utf8', timeout: 110000, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' } }); assert.equal(r.status, 0, r.stdout + r.stderr); assert.match(r.stdout, /PNG\/PDF\/text\/receipt verified/); }
  finally { rmSync(root, { recursive: true, force: true }); }
});

test('prototype browser oracle rejects inert HTML and exercises manual completion and cancellation', { skip: !runtimeReady && 'Optional browser runtime unavailable', timeout: 60000 }, () => {
  const root=mkdtempSync(join(tmpdir(),'pb-prototype-oracle-'));
  const file=join(root,'prototype.html');
  const shell='<p>Row A stays completed</p><p id="count">1 of 2</p><p id="permission">Granted</p><button id="retry">Retry row B</button><button id="finish" disabled>Finish active retry: success</button><button id="revoke">Revoke permission</button>';
  const run=()=>spawnSync(python,['scripts/check-functional-prototype.py',file],{encoding:'utf8',timeout:25000});
  try {
    writeFileSync(file,shell);
    const inert=run();assert.notEqual(inert.status,0);assert.match(inert.stderr,/Retry did not complete B/);
    writeFileSync(file,shell+`<script>
      const retry=document.getElementById('retry'),finish=document.getElementById('finish');
      retry.onclick=()=>{retry.disabled=true;finish.disabled=false;};
      finish.onclick=()=>{document.getElementById('count').textContent='2 of 2';retry.hidden=true;finish.disabled=true;};
      document.getElementById('revoke').onclick=()=>{document.getElementById('permission').textContent='Revoked';retry.disabled=true;finish.disabled=true;};
    </script>`);
    const interactive=run();assert.equal(interactive.status,0,interactive.stderr);
    assert.deepEqual(JSON.parse(interactive.stdout),{retry_completed:true,revocation_blocked_retry:true,javascript_errors:[]});
  } finally {rmSync(root,{recursive:true,force:true});}
});
