// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, readdirSync, chmodSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { init } from './installer.mjs';
const cli = new URL('./product-bench.mjs', import.meta.url).pathname;
function fixture(fn) { const root = mkdtempSync(join(tmpdir(), 'pb-cli-')); const target = join(root, 'target'); mkdirSync(target); try { fn(root, target); } finally { rmSync(root, { recursive: true, force: true }); } }
function driver(root, target, env = process.env) { return (...args) => { const r = spawnSync(process.execPath, [cli, ...args, '--target', target], { cwd: root, env, encoding: 'utf8' }); assert.equal(r.status, 0, r.stderr); return r.stdout; }; }
function snapshot(root) { const hashes = {}; function walk(dir) { for (const file of readdirSync(dir, { withFileTypes: true })) { const path = join(dir, file.name); if (file.isDirectory()) walk(path); else if (file.isFile()) hashes[path] = createHash('sha256').update(readFileSync(path)).digest('hex'); } } walk(root); return hashes; }
test('CLI numeric fixture filters reach analytics, saved runs and dashboards', () => fixture((root, target) => {
  init({ target, brainDir: '.product-bench', apply: true }); const run = driver(root, target), parse = (...args) => JSON.parse(run(...args));
  const filters = ['--from', '2026-01-04', '--to', '2026-01-06', '--account', 'Northstar'];
  assert.equal(parse('analytics', '--metric', 'event_count', '--provider', 'fixture', ...filters).value, 2);
  assert.equal(parse('analytics', '--metric', 'event_count', '--to', '2026-01-06', '--account', 'Northstar').value, 3);
  writeFileSync(join(root, 'saved.json'), JSON.stringify({ name: 'counts', provider: 'fixture', metric: 'event_count' })); run('analytics-save', '--file', 'saved.json'); assert.equal(parse('analytics-list')[0].name, 'counts');
  assert.equal(parse('analytics-run', '--name', 'counts', ...filters).result.value, 2); writeFileSync(join(root, 'dash.json'), JSON.stringify({ definitions: ['counts'] })); assert.equal(parse('analytics-dashboard', '--file', 'dash.json', ...filters).results[0].result.value, 2);
  assert.equal(run('analytics', '--metric', 'event_count', ...filters), run('analytics', '--metric', 'event_count', ...filters, '--json'));
}));
test('CLI accepted lifecycle and review actions produce actual side effects and fake-provider argv', () => fixture((root, target) => {
  const bin = join(root, 'bin'); mkdirSync(bin); const log = join(root, 'provider.json'); const env = { PATH: bin, PGHOST: 'database.example.invalid', PGUSER: 'fixture', PB_CLI_LOG: log };
  for (const name of ['bq', 'psql']) { const path = join(bin, name); writeFileSync(path, `#!${process.execPath}\nconst fs=require('node:fs');fs.writeFileSync(process.env.PB_CLI_LOG,JSON.stringify(process.argv.slice(2)));process.stdout.write(${JSON.stringify(name === 'bq' ? '[{"value":1}]' : 'value\n1\n')});\n`); chmodSync(path, 0o755); }
  const run = driver(root, target, env), parse = (...args) => JSON.parse(run(...args));
  assert.match(run('init', '--brain-dir', '.product-bench', '--yes', '--json'), /Next:/); assert.equal(parse('doctor', '--json').ready, true); assert.equal(parse('update').applied, false); assert.equal(parse('update', '--apply', '--json').applied, true);
  assert.equal(parse('buzz-install', '--apply', '--json').status, 'not_configured');
  writeFileSync(join(root, 'source.json'), JSON.stringify({ id: 'notes', kind: 'repo', scope: 'fictional notes', paths: ['notes'], targets: ['product.md'] })); assert.equal(parse('source-add', '--file', 'source.json').id, 'notes'); mkdirSync(join(target, 'notes')); writeFileSync(join(target, 'notes/note.md'), 'Fictional source.'); assert.equal(parse('source-pull', '--id', 'notes').added, 1);
  writeFileSync(join(root, 'stage.json'), JSON.stringify({ source_id: 'notes', complete: true, cursor: 'v2', items: [{ object_id: 'manual', version: 'v1', target: 'product.md', citation: 'manual:fixture', summary: 'Fictional review reference' }] })); assert.equal(parse('sync-stage', '--file', 'stage.json').added, 1);
  for (const proposal of parse('sync-status').proposals) assert.equal(parse('sync-decide', '--id', proposal.id, '--decision', 'accepted', '--applied').decision, 'accepted'); assert.equal(parse('sync-status').proposals.length, 0);
  writeFileSync(join(target, '.product-bench/context/product.md'), '# Product\nLast updated: 2026-01-01\nReviewed fictional evidence.\n'); assert.equal(parse('share', '--files', 'product.md').status, 'preview_only'); assert.equal(parse('share', '--files', 'product.md', '--apply', '--reviewed').status, 'copied_for_review');
  const config = join(target, '.product-bench/config.json'), value = JSON.parse(readFileSync(config)); value.analytics.project = 'fictional-project'; value.analytics.max_bytes = 42; writeFileSync(config, JSON.stringify(value)); writeFileSync(join(root, 'query.sql'), 'SELECT 1;');
  for (const provider of ['bigquery', 'postgres']) { assert.equal(parse('analytics', '--provider', provider, '--sql-file', 'query.sql').query, 'SELECT 1'); const argv = JSON.parse(readFileSync(log)); if (provider === 'bigquery') { assert.ok(argv.includes('--project_id=fictional-project')); assert.ok(argv.includes('--maximum_bytes_billed=42')); assert.equal(argv.at(-1), 'SELECT 1'); } else assert.match(argv.at(-1), /BEGIN READ ONLY;.*SELECT 1.*ROLLBACK/s); }
  assert.equal(parse('analytics', '--provider', 'bigquery', '--sql', 'SELECT 2').query, 'SELECT 2'); assert.equal(JSON.parse(readFileSync(log)).at(-1), 'SELECT 2'); assert.match(run('uninstall', '--yes', '--json'), /context_preserved/);
}));
test('CLI help and rejection edges preserve installation and JSON compatibility', () => fixture((root, target) => {
  init({ target, brainDir: '.product-bench', apply: true }); const run = driver(root, target); const defaultHelp = spawnSync(process.execPath, [cli], { cwd: root, encoding: 'utf8' }); assert.equal(defaultHelp.status, 0); assert.equal(defaultHelp.stdout, run('help')); assert.equal(run('help'), run('help', '--json')); assert.equal(run('doctor'), run('doctor', '--json'));
  for (const args of [['--help'], ['help', '--help'], [''], ['constructor'], ['__proto__'], ['toString'], ['analytics', '--constructor', 'x'], ['analytics', '--__proto__', 'x'], ['analytics', '--from', ''], ['analytics', '--from', '--to', '2026-01-03']]) {
    const before = snapshot(target), r = spawnSync(process.execPath, [cli, ...args, '--target', target], { cwd: root, encoding: 'utf8' }); assert.equal(r.status, 1); assert.match(r.stderr, /Unknown action|Unsupported option|Missing value/); assert.deepEqual(snapshot(target), before);
  }
}));
