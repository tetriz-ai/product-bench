// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, renameSync, rmSync, symlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { init, update, doctor, sharePreview } from './installer.mjs';
import { addSource, stageObservation, decideProposal, syncStatus, pullLocalSource } from './sync-state.mjs';
import { queryFixture, validateReadOnlySQL } from './analytics.mjs';
import { scanText } from './privacy.mjs';

function fixture(fn) {
  const parent = mkdtempSync(join(tmpdir(), 'pb-audit-')); const target = join(parent, 'target'); mkdirSync(target);
  init({ target, brainDir: '.product-bench', apply: true });
  try { return fn(target, parent); } finally { rmSync(parent, { recursive: true, force: true }); }
}
function state(target) { return join(target, '.product-bench/state/sync.json'); }
const source = { id: 'notes', kind: 'repo', scope: 'approved notes only', paths: ['notes'], targets: ['product.md'] };

for (const dest of ['.product-bench/runtime', '.claude/commands', '.product-bench-install.json', '.product-bench/config.json']) {
  test(`update preflights external symlink ${dest} before any write`, () => fixture((target, parent) => {
    const outside = join(parent, 'outside'); renameSync(join(target, dest), outside); symlinkSync(outside, join(target, dest));
    const ignore = join(target, '.gitignore'); writeFileSync(ignore, '# Needs update\n');
    if (dest.endsWith('runtime')) rmSync(join(outside, 'privacy.mjs'));
    const before = readFileSync(ignore);
    assert.throws(() => update(target, true), /symlink|escapes/i);
    assert.deepEqual(readFileSync(ignore), before, 'a late unsafe destination must prevent earlier mutation');
    if (dest.endsWith('runtime')) assert.equal(existsSync(join(outside, 'privacy.mjs')), false);
  }));
}

test('quoted JSON and YAML credentials block reviewed export', () => fixture((target) => {
  for (const value of ['{"api_key":"abcdefghijklmnop"}', "'password': 'abcdefghijklmnop'", 'token=abcdefghijklmnop']) {
    writeFileSync(join(target, '.product-bench/context/product.md'), `# Product\nLast updated: 2026-10-07\n${value}\n`);
    assert.match(scanText(value).join(','), /credential assignment/);
    assert.throws(() => sharePreview(target, 'product.md', true, true), /Sharing blocked/);
    assert.equal(existsSync(join(target, 'product-bench-shared/context/product.md')), false);
  }
}));

test('prototype-colliding source IDs persist observed and reviewed checkpoints across processes', () => fixture((target) => {
  addSource(target, { id: 'constructor', kind: 'manual', targets: ['product.md'] });
  const result = stageObservation(target, { source_id: 'constructor', complete: true, cursor: 'v1', items: [{ object_id: 'o1', version: 'v1', target: 'product.md', citation: 'manual:fixture', summary: 'Reviewed fictional note' }] });
  const pending = syncStatus(target).proposals[0];
  assert.equal(result.observed_cursor, 'v1');
  const cli = new URL('./product-bench.mjs', import.meta.url);
  execFileSync(process.execPath, [cli.pathname, 'sync-decide', '--target', target, '--id', pending.id, '--decision', 'rejected']);
  assert.equal(syncStatus(target).sources[0].state.reviewed_cursor, 'v1');
  assert.equal(JSON.parse(doctor(target)).sources[0].status, 'checked');
}));

test('invalid and future source timestamps remain unchecked', () => fixture((target) => {
  addSource(target, { id: 'manual', kind: 'manual', targets: ['product.md'] });
  for (const last of [null, 42, 'garbage', '2026-02-30T00:00:00Z', new Date(Date.now() + 86400000).toISOString()]) {
    writeFileSync(state(target), JSON.stringify({ sources: { manual: { last_checked_at: last } }, proposals: [] }));
    assert.equal(JSON.parse(doctor(target)).sources[0].status, 'unchecked', last);
  }
}));

test('exact calendar dates and freshness boundaries are classified honestly', () => fixture((target) => {
  const path = join(target, '.product-bench/context/product.md');
  for (const value of ['2026-09-31', '2025-02-29', '2026-13-01']) {
    writeFileSync(path, `Last updated: ${value}\n`);
    assert.equal(JSON.parse(doctor(target)).freshness['product.md'].status, 'missing', value);
  }
  for (const age of [29, 30, 31]) {
    const date = new Date(Date.now() - age * 86400000).toISOString().slice(0, 10);
    writeFileSync(path, `Last updated: ${date}\n`);
    assert.equal(JSON.parse(doctor(target)).freshness['product.md'].status, age > 30 ? 'stale' : 'fresh');
  }
}));

test('fixture windows reject invalid/reversed dates and include the entire final day', () => fixture((target) => {
  const root = join(target, '.product-bench');
  for (const window of [{ from: null }, { to: 42 }, { from: 'garbage' }, { to: '2026-02-30' }, { from: '2026-01-07', to: '2026-01-03' }]) assert.throws(() => queryFixture(root, { metric: 'event_count', ...window }), /date|window|range/i);
  writeFileSync(join(root, 'analytics/example-events.json'), JSON.stringify([{ at: '2026-01-03T23:59:59Z', account: 'example', user: 'u1', event: 'signed_up' }]));
  assert.equal(queryFixture(root, { metric: 'event_count', from: '2026-01-03', to: '2026-01-03' }).value, 1);
}));

test('activation denominator stays the signup cohort, including empty and asymmetric cohorts', () => fixture((target) => {
  const root = join(target, '.product-bench'); const path = join(root, 'analytics/example-events.json');
  writeFileSync(path, JSON.stringify([{ at: '2026-01-01', user: 'u1', event: 'signed_up' }, { at: '2026-01-01', user: 'u2', event: 'signed_up' }, { at: '2026-01-01', user: 'u4', event: 'signed_up' }, { at: '2026-01-01', user: 'u1', event: 'activated' }, { at: '2026-01-01', user: 'u3', event: 'activated' }]));
  assert.deepEqual(queryFixture(root, { metric: 'activation_rate' }), { value: 1 / 3, numerator: 1, denominator: 3, fictional: true });
  writeFileSync(path, '[]'); assert.equal(queryFixture(root, { metric: 'activation_rate' }).value, null);
}));

test('partial batches never advance cursors or proposals', () => fixture((target) => {
  addSource(target, { id: 'manual', kind: 'manual', targets: ['product.md'] }); const before = readFileSync(state(target));
  assert.throws(() => stageObservation(target, { source_id: 'manual', complete: false, cursor: 'partial', items: [] }), /complete/);
  assert.deepEqual(readFileSync(state(target)), before);
}));

test('500-file cap and binary rejection preserve previously reviewed checkpoint', () => fixture((target) => {
  const notes = join(target, 'notes'); mkdirSync(notes);
  for (let i = 0; i < 500; i++) writeFileSync(join(notes, `note-${i}.md`), 'Fictional text');
  addSource(target, source); assert.equal(pullLocalSource(target, 'notes').added, 500);
  for (const proposal of syncStatus(target).proposals) decideProposal(target, proposal.id, 'rejected');
  const before = syncStatus(target).sources[0].state;
  writeFileSync(join(notes, 'extra.md'), 'Fictional text'); assert.throws(() => pullLocalSource(target, 'notes'), /more than 500/);
  rmSync(join(notes, 'extra.md')); writeFileSync(join(notes, 'note-0.md'), Buffer.from([65, 0, 66]));
  assert.throws(() => pullLocalSource(target, 'notes'), /Binary/);
  const after = syncStatus(target).sources[0].state;
  assert.equal(after.reviewed_cursor, before.reviewed_cursor); assert.equal(after.observed_cursor, before.observed_cursor); assert.deepEqual(after.file_versions, before.file_versions); assert.equal(after.last_checked_at, null);
}));

test('source registry rejects invalid contracts without changing registration', () => fixture((target) => {
  const valid = { id: 'manual', kind: 'manual', targets: ['product.md'] };
  const rejected = [
    { ...valid, id: 'Upper' }, { ...valid, id: '../escape' }, { ...valid, kind: 'unknown' },
    { ...valid, targets: [] }, { ...valid, targets: ['../product.md'] }, { ...valid, targets: ['absent.md'] },
    { ...valid, kind: 'mcp', scope: 'approved' }, { ...valid, kind: 'repo' },
    { ...valid, cadence_days: -1 }, { ...valid, cadence_days: 1.5 }, { ...valid, paths: [''] },
    { ...valid, kind: 'local', scope: 'approved', paths: ['relative.md'] },
    { ...valid, kind: 'repo', scope: 'approved', paths: ['/absolute.md'] }
  ];
  const path = join(target, '.product-bench/sources.json'); const before = readFileSync(path);
  for (const value of rejected) { assert.throws(() => addSource(target, value)); assert.deepEqual(readFileSync(path), before); }
  for (const kind of ['manual', 'repo', 'local', 'mcp', 'web']) {
    const value = addSource(target, { id: kind, kind, scope: 'approved fictional scope', capability: 'read approved documents', targets: ['product.md'] });
    assert.equal(value.enabled, true); assert.equal(value.cadence_days, 30);
  }
  assert.throws(() => addSource(target, valid), /already exists/);
}));

test('local pulls enforce reviewed paths, size, symlinks, disabled state and approved target', () => fixture((target, parent) => {
  const text = join(parent, 'approved.md'); writeFileSync(text, 'Fictional local note');
  addSource(target, { id: 'local', kind: 'local', scope: 'one reviewed local file', paths: [text], targets: ['users.md'] });
  assert.equal(pullLocalSource(target, 'local').added, 1);
  const notes = join(target, 'notes'); mkdirSync(notes); const file = join(notes, 'large.md'); writeFileSync(file, 'a'.repeat(1024 * 1024));
  addSource(target, source); assert.equal(pullLocalSource(target, 'notes').added, 1);
  const checkpoint = syncStatus(target).sources.find((x) => x.id === 'notes').state.observed_cursor;
  writeFileSync(file, 'a'.repeat(1024 * 1024 + 1)); assert.throws(() => pullLocalSource(target, 'notes'), /1 MiB/);
  assert.equal(syncStatus(target).sources.find((x) => x.id === 'notes').state.observed_cursor, checkpoint);
  const link = join(target, 'linked.md'); symlinkSync(text, link);
  addSource(target, { ...source, id: 'link', paths: ['linked.md'] }); assert.throws(() => pullLocalSource(target, 'link'), /escapes|Symlink/);
  addSource(target, { ...source, id: 'disabled', enabled: false }); assert.throws(() => pullLocalSource(target, 'disabled'), /enabled/);
  assert.throws(() => stageObservation(target, { source_id: 'disabled', complete: true, cursor: 'v1', items: [] }), /disabled/);
  assert.throws(() => stageObservation(target, { source_id: 'notes', complete: true, cursor: 'v1', items: [{ object_id: '1', version: '1', target: 'users.md', citation: 'manual:fixture', summary: 'Fictional' }] }), /not approved/);
}));

test('fixture metrics, account filter and SQL guard keep their explicit contracts', () => fixture((target) => {
  const root = join(target, '.product-bench');
  assert.deepEqual(queryFixture(root, { metric: 'schema' }), { columns: ['at', 'account', 'user', 'event'], fictional: true });
  assert.equal(queryFixture(root, { metric: 'event_count' }).value, 6);
  assert.equal(queryFixture(root, { metric: 'active_users' }).value, 3);
  assert.equal(queryFixture(root, { metric: 'event_count', account: 'Northstar' }).value, 4);
  assert.equal(queryFixture(root, { metric: 'event_count', account: 'unknown' }).value, 0);
  assert.throws(() => queryFixture(root, { metric: 'unknown' }), /Unknown fixture metric/);
  for (const sql of ['SELECT 1;', 'WITH x AS (SELECT 1) SELECT * FROM x']) assert.ok(validateReadOnlySQL(sql));
  for (const sql of ['', 'DELETE FROM items', 'SELECT 1; SELECT 2', 'WITH x AS (DELETE FROM items RETURNING *) SELECT * FROM x']) {
    assert.throws(() => validateReadOnlySQL(sql));
  }
}));

test('privacy named patterns and reviewed successful export are explicit', () => fixture((target) => {
  for (const [value, expected] of [
    ['-----BEGIN PRIVATE KEY-----', 'private key'], ['arn:aws:s3:::example-fixture', 'cloud account identifier'],
    ['customer_id: fixture-1', 'customer or employee identifier'], ['employee_id: fixture-1', 'customer or employee identifier'],
    ['slack_channel_id: fixture-channel', 'customer or employee identifier'], ['jane@example.invalid', 'email address']
  ]) assert.ok(scanText(value).includes(expected));
  const path = join(target, '.product-bench/context/product.md'); writeFileSync(path, '# Product\nLast updated: 2026-10-07\nReviewed fictional product.\n');
  assert.throws(() => sharePreview(target, 'product.md', true, false), /reviewed/);
  assert.equal(JSON.parse(sharePreview(target, 'product.md', true, true)).status, 'copied_for_review');
  assert.deepEqual(readFileSync(join(target, 'product-bench-shared/context/product.md')), readFileSync(path));
  assert.throws(() => sharePreview(target, '../product.md'), /existing/);
  const managed = join(target, '.claude/commands/pb-idea.md'); writeFileSync(managed, '# Team edit');
  const missing = join(target, '.codex/commands/pb-idea.md'); rmSync(missing);
  const report = JSON.parse(doctor(target)); assert.equal(report.ready, false); assert.ok(report.modified.includes('.claude/commands/pb-idea.md')); assert.ok(report.missing.includes('.codex/commands/pb-idea.md'));
}));

test('CLI errors name missing values, required inputs and unknown actions', () => {
  const cli = new URL('./product-bench.mjs', import.meta.url).pathname;
  for (const [args, text] of [
    [['init', '--target'], /Missing value/], [['unknown'], /Unknown action/], [['doctor', 'stray'], /Unexpected argument/],
    [['source-add'], /requires --file/], [['source-pull'], /requires --id/], [['sync-stage'], /requires --file/],
    [['sync-decide'], /requires --id and --decision/], [['analytics-save'], /requires --file/], [['analytics-run'], /requires --name/], [['analytics-dashboard'], /requires --file/]
  ]) {
    try { execFileSync(process.execPath, [cli, ...args], { stdio: 'pipe' }); assert.fail('CLI must reject invalid call'); }
    catch (error) { assert.equal(error.status, 1); assert.match(error.stderr.toString(), text); }
  }
});
