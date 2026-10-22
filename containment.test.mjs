// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, symlinkSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { init, uninstall } from './installer.mjs';
import { addSource, stageObservation, decideProposal, pullLocalSource } from './sync-state.mjs';
import { saveAnalyticsDefinition } from './analytics.mjs';

const source = { id: 'notes', kind: 'manual', targets: ['product.md'] };
const definition = { name: 'events', provider: 'fixture', metric: 'event_count' };
function fixture(fn) {
  const scratch = mkdtempSync(join(tmpdir(), 'pb-containment-'));
  const target = join(scratch, 'repo'), outside = join(scratch, 'outside');
  mkdirSync(target); mkdirSync(outside);
  try { init({ target, brainDir: 'team/brain', apply: true }); fn({ target, outside }); }
  finally { rmSync(scratch, { recursive: true, force: true }); }
}
function redirect(target, path, outside, dangling = false) {
  const local = join(target, path), external = join(outside, 'redirected');
  if (dangling) rmSync(local, { recursive: true, force: true });
  else renameSync(local, external);
  symlinkSync(external, local);
  return external;
}
const blocked = /escapes target|dangling symlink|relative to target|non-root path/;

for (const path of ['.claude', 'CLAUDE.md', 'AGENTS.md', '.claude/settings.json', '.codex/hooks.json', '.product-bench-install.json']) {
  test(`uninstall rejects external ${path} before any teardown`, () => fixture(({ target, outside }) => {
    const command = join(target, '.codex/commands/pb-idea.md');
    const bytes = readFileSync(command);
    const external = redirect(target, path, outside);
    const metadata = existsSync(join(target, '.product-bench-install.json'));
    assert.throws(() => uninstall(target, true), blocked);
    assert.deepEqual(readFileSync(command), bytes);
    assert.ok(existsSync(external));
    assert.equal(existsSync(join(target, '.product-bench-install.json')), metadata);
  }));
}
for (const path of ['CLAUDE.md', '.claude/settings.json', '.claude']) {
  test(`uninstall rejects dangling ${path} before any teardown`, () => fixture(({ target, outside }) => {
    redirect(target, path, outside, true);
    assert.throws(() => uninstall(target, true), blocked);
    assert.ok(existsSync(join(target, '.codex/commands/pb-idea.md')));
  }));
}
test('uninstall rejects tampered owned traversal before deleting files', () => fixture(({ target, outside }) => {
  const metadata = join(target, '.product-bench-install.json'), config = JSON.parse(readFileSync(metadata));
  writeFileSync(join(outside, 'keep'), 'outside');
  config.owned['../outside/keep'] = 'not-matching';
  writeFileSync(metadata, JSON.stringify(config));
  assert.throws(() => uninstall(target, true), blocked);
  assert.ok(existsSync(join(target, '.claude/commands/pb-idea.md')));
}));
for (const dangling of [false, true]) for (const path of ['team/brain/sources.json', 'team/brain/state', 'team/brain/state/sync.json', '.product-bench-install.json']) {
  test(`source writes reject ${dangling ? 'dangling' : 'external'} ${path}`, () => fixture(({ target, outside }) => {
    redirect(target, path, outside, dangling);
    assert.throws(() => addSource(target, source), blocked);
  }));
}
for (const operation of ['stage', 'decide', 'pull']) {
  test(`${operation} refuses redirected sync state`, () => fixture(({ target, outside }) => {
    addSource(target, { ...source, kind: 'repo', scope: 'approved missing path', paths: ['missing.md'] });
    const external = redirect(target, 'team/brain/state/sync.json', outside);
    const before = readFileSync(external);
    const actions = {
      stage: () => stageObservation(target, { source_id: 'notes', cursor: 'v1', complete: true, items: [] }),
      decide: () => decideProposal(target, 'none', 'rejected'),
      pull: () => pullLocalSource(target, 'notes'),
    };
    assert.throws(actions[operation], blocked);
    assert.deepEqual(readFileSync(external), before);
  }));
}
for (const dangling of [false, true]) for (const path of ['team/brain/analytics/saved', 'team/brain/analytics/saved/events.json', 'team/brain/config.json']) {
  test(`analytics refuses ${dangling ? 'dangling' : 'external'} ${path}`, () => fixture(({ target, outside }) => {
    mkdirSync(join(target, 'team/brain/analytics/saved'), { recursive: true });
    if (path.endsWith('events.json')) writeFileSync(join(target, path), '{}');
    const external = redirect(target, path, outside, dangling);
    assert.throws(() => saveAnalyticsDefinition(target, definition), blocked);
    if (!dangling && path.endsWith('saved')) assert.equal(existsSync(join(external, 'events.json')), false);
  }));
}
for (const operation of ['source', 'analytics']) for (const brainDir of ['../outside', '/tmp', '.']) {
  test(`${operation} rejects metadata brain path ${brainDir}`, () => fixture(({ target }) => {
    const path = join(target, '.product-bench-install.json'), config = JSON.parse(readFileSync(path));
    config.brain_dir = brainDir; writeFileSync(path, JSON.stringify(config));
    assert.throws(() => operation === 'source' ? addSource(target, source) : saveAnalyticsDefinition(target, definition), blocked);
  }));
}
test('approved external local-source reads and ordinary analytics writes remain supported', () => fixture(({ target, outside }) => {
  const path = join(outside, 'approved.md'); writeFileSync(path, 'Approved evidence');
  addSource(target, { ...source, kind: 'local', scope: 'approved external evidence', paths: [path] });
  assert.equal(pullLocalSource(target, 'notes').added, 1);
  assert.equal(saveAnalyticsDefinition(target, definition).name, 'events');
}));
for (const host of ['claude', 'codex']) test(`${host} installed hook finds a custom brain root from nested cwd`, () => fixture(({ target }) => {
  execFileSync('git', ['init', '-q', target]);
  const nested = join(target, 'src/nested'); mkdirSync(nested, { recursive: true });
  const settings = JSON.parse(readFileSync(join(target, host === 'claude' ? '.claude/settings.json' : '.codex/hooks.json')));
  const command = settings.hooks[host === 'claude' ? 'UserPromptSubmit' : 'SessionStart'][0].hooks[0].command;
  const run = (cwd) => execFileSync('/bin/sh', ['-c', command], { cwd, input: '{}', encoding: 'utf8' });
  const root = run(target), child = run(nested);
  assert.match(root, /Product Bench context check/);
  assert.equal(child, root);
}));
