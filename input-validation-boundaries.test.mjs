// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { init, sharePreview } from './installer.mjs';
import { addSource, pullLocalSource, stageObservation, syncStatus } from './sync-state.mjs';
import { saveAnalyticsDefinition, listAnalyticsDefinitions, runAnalyticsDefinition, runAnalyticsDashboard, validateReadOnlySQL, analyticsQuery } from './analytics.mjs';
import { renderMarkdown } from './render-document.mjs';
const cli = new URL('./product-bench.mjs', import.meta.url).pathname;
function fixture(fn) { const root = mkdtempSync(join(tmpdir(), 'pb-p2-')); init({ target: root, brainDir: '.product-bench', apply: true }); try { return fn(root); } finally { rmSync(root, { recursive: true, force: true }); } }
const registry = (root) => join(root, '.product-bench/sources.json');
const state = (root) => join(root, '.product-bench/state/sync.json');
const manual = { id: 'notes', kind: 'manual', targets: ['product.md'] };
for (const name of ['vendor', 'node_modules', 'dist', 'build']) test(`explicit approved ${name} subtree stages cited evidence for review`, () => fixture((root) => {
  mkdirSync(join(root, 'notes', name), { recursive: true }); writeFileSync(join(root, 'notes', name, 'product.md'), 'Approved fictional evidence.\n');
  addSource(root, { ...manual, kind: 'repo', scope: 'all notes', paths: ['notes'] });
  assert.equal(pullLocalSource(root, 'notes').added, 1);
  const pending = syncStatus(root).proposals; assert.equal(pending.length, 1); assert.equal(pending[0].citation, `file:notes/${name}/product.md`);
  assert.equal(syncStatus(root).sources[0].state.reviewed_cursor, null);
  assert.equal(JSON.stringify(JSON.parse(readFileSync(state(root)))).includes('Approved fictional evidence'), false, 'state keeps references, not source contents');
}));
test('share requires reviewed dates and meaningful content, while unknown prose remains valid', () => fixture((root) => {
  const path = join(root, '.product-bench/context/product.md');
  const today = new Date().toISOString().slice(0, 10), future = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  for (const contents of ['# Product\nUnknown.\n', '# Product\nUseful fictional content.\n', '# Product\nLast updated: never\nUseful text.\n', '# Product\nLast updated: 2026-02-30\nUseful text.\n', `# Product\nLast updated: ${future}\nUseful text.\n`, `# Product\nLast updated: ${today}\nUnknown.\n`, `# Product\nLast updated: ${today}\n`]) {
    writeFileSync(path, contents); assert.throws(() => sharePreview(root, 'product.md', true, true), /Sharing blocked/); assert.equal(existsSync(join(root, 'product-bench-shared/context/product.md')), false);
  }
  writeFileSync(path, `# Product\nLast updated: ${today}\nThe fictional launch date remains unknown pending review.\n`);
  assert.equal(JSON.parse(sharePreview(root, 'product.md', true, true)).status, 'copied_for_review');
}));
test('non-NUL binary rejects without acknowledging state; valid Unicode and empty text survive', () => fixture((root) => {
  mkdirSync(join(root, 'notes')); const path = join(root, 'notes/product.md'); writeFileSync(path, 'Reviewed fictional baseline.');
  addSource(root, { ...manual, kind: 'repo', scope: 'all notes', paths: ['notes'] }); pullLocalSource(root, 'notes');
  const before = syncStatus(root).sources[0].state;
  writeFileSync(path, Buffer.from([255,216,255,224,255])); assert.throws(() => pullLocalSource(root, 'notes'), /binary|UTF.?8/i);
  const after = syncStatus(root).sources[0].state; assert.equal(after.observed_cursor, before.observed_cursor); assert.equal(after.reviewed_cursor, before.reviewed_cursor); assert.equal(after.last_checked_at, null);
  writeFileSync(path, 'Fictional café — 日本語.'); assert.equal(pullLocalSource(root, 'notes').added, 1);
  writeFileSync(path, ''); assert.equal(pullLocalSource(root, 'notes').added, 1);
}));
test('cadence defaults only when omitted and invalid registration is atomic', () => fixture((root) => {
  assert.equal(addSource(root, manual).cadence_days, 30);
  for (const cadence of [0, false, true, '', null, [1], {}, -1, 1.5, 'bad']) {
    const before = readFileSync(registry(root)); assert.throws(() => addSource(root, { ...manual, id: 'invalid', cadence_days: cadence }), /positive integer/); assert.deepEqual(readFileSync(registry(root)), before);
  }
  assert.equal(addSource(root, { ...manual, id: 'daily', cadence_days: 1 }).cadence_days, 1);
}));
test('CLI rejects typo and wrong-action options, preserving documented globals and filters', () => fixture((root) => {
  const run = (...args) => spawnSync(process.execPath, [cli, ...args, '--target', root], { encoding: 'utf8' });
  for (const args of [['analytics', '--metric', 'activation_rate', '--fro', '2026-01-01'], ['doctor', '--metric', 'event_count'], ['init', '--apply']]) { const r = run(...args); assert.notEqual(r.status, 0); assert.match(r.stderr, /Unsupported option/); }
  assert.equal(run('help', '--json').status, 0); assert.equal(run('doctor', '--json').status, 0);
  const r = run('analytics', '--metric', 'event_count', '--from', '2026-01-01', '--to', '2026-01-01', '--json'); assert.equal(r.status, 0); assert.equal(JSON.parse(r.stdout).fictional, true);
}));
test('empty complete checkpoints advance consecutively and required-item failures leave persisted state atomic', () => fixture((root) => {
  addSource(root, manual);
  for (const cursor of ['v1', 'v2']) { const r = stageObservation(root, { source_id: 'notes', complete: true, cursor, items: [] }); assert.equal(r.observed_cursor, cursor); assert.equal(r.reviewed_cursor, cursor); assert.equal(r.pending, 0); }
  const item = { object_id: 'o1', version: 'v1', target: 'product.md', citation: 'manual:fixture', summary: 'Fictional reference only' };
  for (const key of Object.keys(item)) { const bad = { ...item }; delete bad[key]; const before = readFileSync(state(root)); assert.throws(() => stageObservation(root, { source_id: 'notes', complete: true, cursor: 'v3', items: [item, bad] }), /Each proposal needs/); assert.deepEqual(readFileSync(state(root)), before); }
  assert.equal(readFileSync(state(root), 'utf8').includes(item.summary), false);
}));
test('saved names pin 64/65 and SQL guard rejects every modifying keyword even inside literals', () => fixture((root) => {
  saveAnalyticsDefinition(root, { name: 'a'.repeat(64), provider: 'fixture', metric: 'schema' });
  assert.throws(() => saveAnalyticsDefinition(root, { name: 'a'.repeat(65), provider: 'fixture', metric: 'schema' }), /Definition name/);
  for (const word of ['INSERT','UPDATE','DELETE','MERGE','CREATE','ALTER','DROP','TRUNCATE','GRANT','REVOKE','CALL','COPY','EXPORT','EXECUTE']) assert.throws(() => validateReadOnlySQL(`SELECT '${word}'`), /Potentially modifying SQL/);
}));
test('Markdown renders lists, tables, fences and Unicode without unsafe links', () => {
  const html = renderMarkdown('# Fictional café\n\n- alpha\n- beta\n\n1. first\n2. second\n\n| Key | Value |\n|---|---|\n| status | reviewed |\n\n```js\n<x>&\n```\n\n[safe](https://example.invalid/日本語) [bad](javascript:alert) [bad-data](data:text/html,x) [relative](./artifact.md)');
  for (const expected of ['Fictional café','<ul>','<ol>','<li>alpha</li>','<th>Key</th>','<td>reviewed</td>','&lt;x&gt;&amp;','href="https://example.invalid/日本語"','href="./artifact.md"']) assert.ok(html.includes(expected), expected);
  assert.doesNotMatch(html, /href="(?:javascript|data):/);
});
test('saved/live/dashboard errors keep invalid definitions out of persisted inventory', async () => {
  const root = mkdtempSync(join(tmpdir(), 'pb-p2-analytics-')); init({ target: root, brainDir: '.product-bench', apply: true });
  try {
    for (const definition of [{ name: 'bad', provider: 'unsupported' }, { name: 'bad', provider: 'fixture', metric: 'missing' }, { name: 'bad', provider: 'postgres', sql: 'DELETE FROM example' }]) assert.throws(() => saveAnalyticsDefinition(root, definition));
    assert.deepEqual(listAnalyticsDefinitions(root), []);
    await assert.rejects(runAnalyticsDefinition(root, 'missing'), /ENOENT/); await assert.rejects(runAnalyticsDashboard(root, []), /nonempty/); await assert.rejects(runAnalyticsDashboard(root, ['missing']), /ENOENT/);
    await assert.rejects(analyticsQuery(root, { provider: 'postgres' }), /requires --sql/);
    saveAnalyticsDefinition(root, { name: 'counts', provider: 'fixture', metric: 'event_count' }); assert.throws(() => saveAnalyticsDefinition(root, { name: 'counts', provider: 'fixture', metric: 'event_count' }), /already exists/);
    assert.equal((await runAnalyticsDashboard(root, ['counts'], { from: '2026-01-01', to: '2026-01-03' })).results.length, 1);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('share preflights every destination before copying, rejecting escaping and dangling symlinks', () => fixture((root) => {
  const today = new Date().toISOString().slice(0, 10);
  for (const file of ['product.md', 'users.md']) writeFileSync(join(root, '.product-bench/context', file), `# Reviewed fictional context\nLast updated: ${today}\nApproved fixture only.\n`);
  const outside = mkdtempSync(join(tmpdir(), 'pb-share-out-'));
  try {
  symlinkSync(outside, join(root, 'product-bench-shared'));
  assert.throws(() => sharePreview(root, 'product.md', true, true), /symlink|escapes/i);
  assert.equal(existsSync(join(outside, 'context/product.md')), false);
  rmSync(join(root, 'product-bench-shared')); mkdirSync(join(root, 'product-bench-shared/context'), { recursive: true });
  symlinkSync(join(outside, 'missing.md'), join(root, 'product-bench-shared/context/users.md'));
  assert.throws(() => sharePreview(root, 'product.md,users.md', true, true), /symlink|escapes/i);
  assert.equal(existsSync(join(root, 'product-bench-shared/context/product.md')), false);
  } finally { rmSync(outside, { recursive: true, force: true }); }
}));
