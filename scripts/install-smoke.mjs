// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const scratch = mkdtempSync(join(tmpdir(), 'product-bench-install-'));
const npmEnv = { ...process.env, npm_config_cache: join(scratch, 'npm-cache') };
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
function runNode(entry, args, cwd) {
  return execFileSync(process.execPath, [entry, ...args], { cwd, encoding: 'utf8', input: '{}' });
}
try {
  const packResult = JSON.parse(execFileSync(npm, ['pack', '--json', '--ignore-scripts', '--pack-destination', scratch], { cwd: root, encoding: 'utf8', env: npmEnv }));
  const [packed] = Array.isArray(packResult) ? packResult : Object.values(packResult);
  const files = packed.files.map(({ path }) => path);
  assert(files.includes('product-bench.mjs'));
  assert(files.includes('payload/commands/pb-setup.md'));
  assert(!files.some((path) => path.endsWith('.test.mjs') || path.startsWith('.github/') || path.startsWith('tests/') || path.startsWith('src/')));
  const install = join(scratch, 'install');
  mkdirSync(install);
  execFileSync(npm, ['install', '--prefix', install, '--ignore-scripts', '--no-audit', '--no-fund', '--offline', join(scratch, packed.filename)], { encoding: 'utf8', env: npmEnv });
  const entry = join(install, 'node_modules/product-bench/product-bench.mjs');
  assert.match(runNode(entry, ['help'], install), /Usage: product-bench/);
  const host = join(scratch, 'host');
  mkdirSync(host);
  runNode(entry, ['init', '--target', host, '--brain-dir', '.product-bench', '--yes'], host);
  const runtime = join(host, '.product-bench/runtime');
  const cli = join(runtime, 'product-bench.mjs');
  const report = JSON.parse(runNode(cli, ['doctor', '--target', host], host));
  assert.equal(report.ready, true);
  assert.deepEqual(report.missing, []);
  assert.match(readFileSync(join(host, '.codex/commands/pb-setup.md'), 'utf8'), /pb-_preamble/);
  const legacyCLI = join(runtime, 'bin/product-bench.mjs');
  assert.equal(JSON.parse(runNode(legacyCLI, ['doctor', '--target', host], host)).ready, true);
  for (const hook of ['freshness-hook.mjs', 'bin/freshness-hook.mjs']) {
    const result = JSON.parse(runNode(join(runtime, hook), ['--host', 'codex'], host));
    assert.equal(result.hookSpecificOutput.hookEventName, 'SessionStart');
    assert.match(result.hookSpecificOutput.additionalContext, /context check/);
  }
  const analytics = JSON.parse(runNode(cli, ['analytics', '--target', host, '--metric', 'activation_rate'], host));
  assert.equal(analytics.fictional, true);
  assert.equal(analytics.denominator, 3);
  assert.equal(analytics.numerator, 3);
  assert.equal(analytics.value, 1);
  const updated = JSON.parse(runNode(cli, ['update', '--target', host, '--apply'], host));
  assert.deepEqual(updated.skipped, []);
  assert.deepEqual(updated.changed, []);
  const removed = runNode(cli, ['uninstall', '--target', host, '--yes'], host).trim().split('\n');
  assert.match(removed.join('\n'), /context_preserved/);
  assert.match(readFileSync(join(host, '.product-bench/context/product.md'), 'utf8'), /Last updated: never/);
  console.log('Install smoke passed: packed CLI, runtime, compatibility paths, hooks, analytics, update, and uninstall.');
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
