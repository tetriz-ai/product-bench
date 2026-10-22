// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, chmodSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { init } from './installer.mjs';
const adapter = new URL('./review-lenses.mjs', import.meta.url).pathname;
for (const [name, code] of [
  ['spawn failure', null], ['nonzero host exit', 'process.stdin.resume();process.exit(2);'],
  ['Claude error terminal', "process.stdin.resume();process.stdin.on('end',()=>process.stdout.write(JSON.stringify({is_error:true,result:'Fixture failure'})));"],
  ['malformed terminal JSON', "process.stdin.resume();process.stdin.on('end',()=>process.stdout.write('invalid-json'));"],
  ['timeout', 'process.stdin.resume();setInterval(()=>{},1000);']
]) {
  test(`reviewer ${name} stays failed with a recorded receipt`, () => {
    const root = mkdtempSync(join(tmpdir(), 'pb-review-failure-'));
    try {
      init({ target: root, brainDir: '.product-bench', apply: true }); const bin = join(root, 'bin'); mkdirSync(bin);
      if (code) { const path = join(bin, 'claude'); writeFileSync(path, `#!${process.execPath}\n${code}\n`); chmodSync(path, 0o755); }
      writeFileSync(join(root, 'artifact.md'), '# Fictional contract\n');
      const shim = join(root, 'timer.mjs'); writeFileSync(shim, 'const original=globalThis.setTimeout;globalThis.setTimeout=(fn,ms,...args)=>original(fn,ms===240000?50:ms,...args);\n');
      const args = [...(name === 'timeout' ? ['--import', shim] : []), adapter, '--host', 'claude', '--input', 'artifact.md', '--out', 'reviews', '--lenses', 'naive-reader'];
      let error;
      try { execFileSync(process.execPath, args, { cwd: root, env: { ...process.env, PATH: bin }, stdio: 'pipe', timeout: 10000 }); }
      catch (caught) { error = caught; }
      assert.equal(error?.status, 1, 'adapter must fail, rather than the outer timeout');
      const receipt = JSON.parse(readFileSync(join(root, 'reviews/execution.json'))); assert.equal(receipt.reviews.length, 1); assert.notEqual(receipt.reviews[0].exit_code, 0);
      assert.equal(receipt.reviews[0].fresh_process, true);
      if (name === 'spawn failure') assert.match(receipt.reviews[0].error, /ENOENT/);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
}

test('reviewer rejects invalid bounds, lenses, evidence and input collisions before starting a host', () => {
  const root = mkdtempSync(join(tmpdir(), 'pb-review-inputs-'));
  try {
    init({ target: root, brainDir: '.product-bench', apply: true }); mkdirSync(join(root, 'reviews'));
    writeFileSync(join(root, 'artifact.md'), '# Fictional contract\n'); writeFileSync(join(root, 'reviews/naive-reader.md'), '# Supplied fictional artifact\n');
    for (const [extra, pattern] of [
      [['--parallel', '0'], /parallel 1\.\.7/], [['--parallel', '8'], /parallel 1\.\.7/], [['--parallel', '1.5'], /parallel 1\.\.7/],
      [['--lenses', 'unsupported'], /supported lens/], [['--lenses', 'naive-reader,naive-reader'], /unique supported/],
      [['--evidence'], /requires a file path/], [['--evidence', 'missing.md'], /ENOENT/],
      [['--input', 'reviews/naive-reader.md'], /overwrite the input artifact/]
    ]) {
      const args = [adapter, '--host', 'claude', '--input', extra.includes('--input') ? 'reviews/naive-reader.md' : 'artifact.md', '--out', 'reviews', ...(extra.includes('--lenses') ? [] : ['--lenses', extra.includes('--evidence') ? 'functional' : 'naive-reader']), ...extra];
      let error; try { execFileSync(process.execPath, args, { cwd: root, env: { ...process.env, PATH: join(root, 'no-host') }, stdio: 'pipe', timeout: 10000 }); } catch (caught) { error = caught; }
      assert.equal(error?.status, 1); assert.match(error.stderr.toString(), pattern); assert.doesNotMatch(error.stderr.toString(), /spawn.*ENOENT/);
    }
    assert.equal(readFileSync(join(root, 'reviews/naive-reader.md'), 'utf8'), '# Supplied fictional artifact\n');
  } finally { rmSync(root, { recursive: true, force: true }); }
});
