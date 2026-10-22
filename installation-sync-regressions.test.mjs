// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, symlinkSync, existsSync, readFileSync, writeFileSync, renameSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { init, doctor } from './installer.mjs';
import { addSource, pullLocalSource, decideProposal, syncStatus } from './sync-state.mjs';

function fixture(fn) {
  const root = mkdtempSync(join(tmpdir(), 'product-bench-regression-'));
  const host = join(root, 'host');
  mkdirSync(host);
  try { fn(host, root); } finally { rmSync(root, { recursive: true, force: true }); }
}

for (const destination of ['brain', '.claude', 'AGENTS.md']) {
  test(`install rejects external symlink at ${destination} before writing`, () => fixture((host, root) => {
    const outside = join(root, 'outside');
    if (destination === 'AGENTS.md') writeFileSync(outside, 'Outside instructions\n');
    else mkdirSync(outside);
    symlinkSync(outside, join(host, destination));
    assert.throws(() => init({ target: host, brainDir: destination === 'brain' ? 'brain/context' : '.product-bench', apply: true }), /symlink|escapes/i);
    assert.equal(existsSync(join(host, '.product-bench-install.json')), false);
    assert.equal(existsSync(join(host, '.product-bench')), false);
    assert.equal(existsSync(join(host, 'CLAUDE.md')), false);
    if (destination === 'AGENTS.md') assert.equal(readFileSync(outside, 'utf8'), 'Outside instructions\n');
    else assert.equal(existsSync(join(outside, destination === 'brain' ? 'context' : 'commands')), false);
  }));
}

test('installed analytics includes all seven referenced guides', () => fixture((host) => {
  init({ target: host, brainDir: '.product-bench', apply: true });
  for (const name of ['01-question', '02-schema', '03-denominators', '04-retention', '05-funnels', '06-segmentation', '07-report']) {
    const guide = join(host, '.product-bench/runtime/docs/analytics', `${name}.md`);
    assert.match(readFileSync(guide, 'utf8'), /^# [1-7]\. /);
  }
  assert.equal(JSON.parse(doctor(host)).ready, true);
}));

test('failed source fetch becomes unchecked without advancing reviewed state and recovers', () => fixture((host) => {
  init({ target: host, brainDir: '.product-bench', apply: true });
  const notes = join(host, 'notes'); mkdirSync(notes); writeFileSync(join(notes, 'note.md'), 'Fictional version one');
  addSource(host, { id: 'notes', kind: 'repo', scope: 'notes only', paths: ['notes'], targets: ['product.md'] });
  pullLocalSource(host, 'notes');
  decideProposal(host, syncStatus(host).proposals[0].id, 'rejected');
  const before = syncStatus(host).sources[0].state;
  renameSync(notes, join(host, 'notes-away'));
  assert.throws(() => pullLocalSource(host, 'notes'), /Source path is missing/);
  assert.equal(JSON.parse(doctor(host)).sources[0].status, 'unchecked');
  const failed = syncStatus(host).sources[0].state;
  assert.equal(failed.reviewed_cursor, before.reviewed_cursor);
  assert.equal(failed.observed_cursor, before.observed_cursor);
  assert.deepEqual(failed.file_versions, before.file_versions);
  renameSync(join(host, 'notes-away'), notes);
  assert.equal(pullLocalSource(host, 'notes').added, 0);
  assert.equal(JSON.parse(doctor(host)).sources[0].status, 'checked');
}));

test('future context is unavailable while today remains fresh', () => fixture((host) => {
  init({ target: host, brainDir: '.product-bench', apply: true });
  const path = join(host, '.product-bench/context/product.md');
  const today = new Date().toISOString().slice(0, 10);
  const future = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
  writeFileSync(path, `# Product\nLast updated: ${future}\nFictional product.\n`);
  assert.notEqual(JSON.parse(doctor(host)).freshness['product.md'].status, 'fresh');
  writeFileSync(path, `# Product\nLast updated: ${today}\nFictional product.\n`);
  assert.equal(JSON.parse(doctor(host)).freshness['product.md'].status, 'fresh');
}));
