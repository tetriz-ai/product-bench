// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { init, doctor } from './installer.mjs';
import { addSource, pullLocalSource, syncStatus, decideProposal } from './sync-state.mjs';
function fixture(fn) { const root = mkdtempSync(join(tmpdir(), 'pb-source-')); init({ target: root, brainDir: '.product-bench', apply: true }); try { fn(root); } finally { rmSync(root, { recursive: true, force: true }); } }
const manual = { id: 'notes', kind: 'manual', targets: ['product.md'] };
for (const kind of ['repo', 'local']) {
  test(`${kind} directory scan keeps ordinary siblings and excludes hidden entries and nested symlinks`, () => fixture((root) => {
    const notes = join(root, 'notes'); mkdirSync(notes); mkdirSync(join(notes, '.hidden')); writeFileSync(join(notes, '.hidden/note.md'), 'Excluded fixture.'); writeFileSync(join(notes, '.hidden.md'), 'Excluded fixture.');
    for (const name of ['vendor', 'node_modules', 'dist', 'build', 'ordinary']) { mkdirSync(join(notes, name, 'deep'), { recursive: true }); writeFileSync(join(notes, name, 'deep/note.md'), 'Approved fictional fixture.'); }
    writeFileSync(join(notes, 'visible.md'), 'Approved sibling.'); mkdirSync(join(notes, 'empty'));
    writeFileSync(join(root, 'outside.md'), 'Outside approved notes.'); mkdirSync(join(root, 'outside-dir')); writeFileSync(join(root, 'outside-dir/note.md'), 'Outside approved notes.');
    symlinkSync(join(root, 'outside.md'), join(notes, 'linked.md')); symlinkSync(join(root, 'outside-dir'), join(notes, 'linked-directory')); symlinkSync(join(root, 'missing.md'), join(notes, 'dangling.md'));
    addSource(root, { ...manual, kind, scope: 'all approved notes', paths: [kind === 'repo' ? 'notes' : notes] });
    assert.equal(pullLocalSource(root, 'notes').added, 6); const citations = syncStatus(root).proposals.map((x) => x.citation);
    for (const name of ['vendor', 'node_modules', 'dist', 'build', 'ordinary']) assert.ok(citations.some((x) => x.endsWith(`/notes/${name}/deep/note.md`) || x === `file:notes/${name}/deep/note.md`));
    assert.ok(citations.some((x) => x.endsWith('/notes/visible.md') || x === 'file:notes/visible.md')); assert.equal(citations.length, 6); assert.equal(syncStatus(root).sources[0].state.reviewed_cursor, null);
  }));
  test(`${kind} UTF-8 BOM accepts and truncation fails without advancing reviewed checkpoints`, () => fixture((root) => {
    const path = join(root, 'note.md'); writeFileSync(path, Buffer.from([239,187,191,65])); addSource(root, { ...manual, kind, scope: 'one approved file', paths: [kind === 'repo' ? 'note.md' : path] }); assert.equal(pullLocalSource(root, 'notes').added, 1);
    decideProposal(root, syncStatus(root).proposals[0].id, 'rejected'); const before = syncStatus(root).sources[0].state;
    writeFileSync(path, Buffer.from([226,130])); assert.throws(() => pullLocalSource(root, 'notes'), /valid UTF-8/); const after = syncStatus(root).sources[0].state;
    assert.equal(after.observed_cursor, before.observed_cursor); assert.equal(after.reviewed_cursor, before.reviewed_cursor); assert.deepEqual(after.file_versions, before.file_versions); assert.equal(JSON.parse(doctor(root)).sources[0].status, 'unchecked');
  }));
  test(`${kind} approved empty directory records a complete no-change checkpoint`, () => fixture((root) => {
    mkdirSync(join(root, 'empty')); addSource(root, { ...manual, kind, scope: 'approved empty folder', paths: [kind === 'repo' ? 'empty' : join(root, 'empty')] });
    const result = pullLocalSource(root, 'notes'); assert.equal(result.added, 0); assert.equal(result.pending, 0); assert.match(result.observed_cursor, /^full-scan-sha256:/); assert.equal(result.reviewed_cursor, result.observed_cursor);
  }));
}
test('positive numeric string cadence retains its supported normalized value', () => fixture((root) => { assert.equal(addSource(root, { ...manual, cadence_days: '14' }).cadence_days, 14); }));
