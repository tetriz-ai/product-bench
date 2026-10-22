// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, cpSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('a cold new example accepts both folder and README links while enforcing exact output', () => {
  const root = mkdtempSync(join(tmpdir(), 'pb-example-index-'));
  try {
    mkdirSync(join(root, 'scripts')); mkdirSync(join(root, 'examples/cold-example'), { recursive: true });
    writeFileSync(join(root, 'scripts/run-examples.mjs'), readFileSync(new URL('./scripts/run-examples.mjs', import.meta.url)));
    writeFileSync(join(root, 'examples/cold-example/README.md'), "Fictional offline example.\n\n```sh\nprintf 'Fictional result\\n'\n```\n\n```text\nFictional result\n```\n");
    for (const path of ['cold-example/', 'cold-example/README.md']) {
      writeFileSync(join(root, 'examples/README.md'), `# Examples\n\n[Cold example](${path})\n`);
      assert.equal(execFileSync(process.execPath, [join(root, 'scripts/run-examples.mjs')], { encoding: 'utf8' }), 'cold-example: passed\n');
    }
    writeFileSync(join(root, 'examples/cold-example/README.md'), "```sh\nprintf 'Changed result\\n'\n```\n\n```text\nFictional result\n```\n");
    assert.throws(() => execFileSync(process.execPath, [join(root, 'scripts/run-examples.mjs')], { stdio: 'pipe' }));
  } finally { rmSync(root, { recursive: true, force: true }); }
});


test('documented examples work with only the packed artifact and no source runtime modules', () => {
  const root = mkdtempSync(join(tmpdir(), 'pb-packed-examples-'));
  try {
    // Build the real distribution before isolating the examples from source modules.
    const repository = new URL('./', import.meta.url);
    const packResult = JSON.parse(execFileSync('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', root], {
      cwd: repository, encoding: 'utf8', env: { ...process.env, npm_config_cache: join(root, 'npm-cache') },
    }));
    const [packed] = Array.isArray(packResult) ? packResult : Object.values(packResult);
    const isolated = join(root, 'isolated');
    mkdirSync(isolated);
    cpSync(new URL('./examples/', import.meta.url), join(isolated, 'examples'), { recursive: true });
    mkdirSync(join(root, 'bin'));
    // Reuse that immutable pack in the isolated checkout, which has no runtime source.
    const npm = join(root, 'bin/npm');
    writeFileSync(npm, `#!${process.execPath}\nimport { copyFileSync } from 'node:fs';\nimport { join } from 'node:path';\nconst destination = process.argv[process.argv.indexOf('--pack-destination') + 1];\ncopyFileSync(${JSON.stringify(join(root, packed.filename))}, join(destination, ${JSON.stringify(packed.filename)}));\nconsole.log(${JSON.stringify(JSON.stringify([{ filename: packed.filename }]))});\n`);
    chmodSync(npm, 0o755);
    writeFileSync(join(root, 'bin/package.json'), '{"type":"module"}');
    const trace = join(root, 'entrypoints.jsonl');
    const hook = join(root, 'trace.cjs');
    writeFileSync(hook, `require('node:fs').appendFileSync(${JSON.stringify(trace)}, JSON.stringify(process.argv[1]) + '\\n');`);
    const env = { ...process.env, PATH: `${join(root, 'bin')}:${process.env.PATH}`, NODE_OPTIONS: `${process.env.NODE_OPTIONS || ''} --require ${hook}` };

    for (const name of ['inspect-install', 'protect-team-edits', 'render-spec']) {
      const readme = readFileSync(join(isolated, 'examples', name, 'README.md'), 'utf8');
      const expected = [...readme.matchAll(/```text\n([^]*?)\n```/g)].at(-1)[1] + '\n';
      writeFileSync(trace, '');
      const actual = execFileSync(process.execPath, [join(isolated, 'examples', name, 'run.mjs')], { cwd: isolated, env, encoding: 'utf8' });
      assert.equal(actual, expected, `${name} must exercise the distribution without source modules`);
      const entrypoints = readFileSync(trace, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
      const entry = name === 'render-spec' ? 'render-document.mjs' : 'product-bench.mjs';
      assert.ok(entrypoints.some((path) => path?.endsWith(`/package/${entry}`)), `${name} must invoke the packed ${entry} entrypoint`);
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});
