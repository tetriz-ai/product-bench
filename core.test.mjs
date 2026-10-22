// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, chmodSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { init, doctor, update, uninstall, sharePreview } from './installer.mjs';
import { addSource, stageObservation, decideProposal, syncStatus, pullLocalSource } from './sync-state.mjs';
import { queryFixture, validateReadOnlySQL, saveAnalyticsDefinition, listAnalyticsDefinitions, runAnalyticsDefinition, runAnalyticsDashboard } from './analytics.mjs';
import { workflows } from './workflows.mjs';
import { renderMarkdown } from './render-document.mjs';
import { fileURLToPath } from 'node:url';

const bin = fileURLToPath(new URL('./product-bench.mjs', import.meta.url));

function tempRepo(fn) {
  const target = mkdtempSync(join(tmpdir(), 'product-bench-test-'));
  try { return fn(target); }
  finally { rmSync(target, { recursive: true, force: true }); }
}

test('all supported workflows have a portable contract', () => {
  assert.equal(workflows.length, 37);
  assert.equal(new Set(workflows.map((item) => item.name)).size, 37);
  for (const item of workflows) {
    assert.ok(item.purpose);
    assert.ok(item.steps.length);
    for (const mode of Object.values(item.modes)) { assert.ok(mode.input); assert.ok(mode.output); }
  }
});

test('review adapter isolates lenses and records real process completion', () => tempRepo((target) => {
  init({ target, brainDir: '.product-bench', apply: true });
  const mockBin = join(target, 'mock-bin'); mkdirSync(mockBin);
  const mockCli = join(mockBin, 'claude');
  writeFileSync(mockCli, `#!${process.execPath}\nprocess.stdin.resume();process.stdin.on('end',()=>process.stdout.write(JSON.stringify({is_error:false,result:'Independent fixture review'})));\n`);
  chmodSync(mockCli, 0o755);
  writeFileSync(join(target, 'spec.md'), '# Fictional spec\n');
  const adapter = fileURLToPath(new URL('./review-lenses.mjs', import.meta.url));
  execFileSync(process.execPath, [adapter, '--host', 'claude', '--input', 'spec.md', '--out', 'reviews', '--parallel', '7'], { cwd: target, env: { ...process.env, PATH: `${mockBin}:${process.env.PATH}` } });
  const receipt = JSON.parse(readFileSync(join(target, 'reviews/execution.json'), 'utf8'));
  assert.equal(receipt.reviews.length, 7);
  assert.equal(new Set(receipt.reviews.map((review) => review.pid)).size, 7);
  assert.ok(receipt.reviews.every((review) => review.exit_code === 0 && review.fresh_process));
  assert.ok(receipt.reviews.every((review) => readFileSync(join(target, 'reviews', review.artifact), 'utf8') === 'Independent fixture review'));
}));

test('document rendering preserves heading boundaries and escapes raw markup', () => {
  const html = renderMarkdown('# Title\nFixture disclosure\n\n## Ask\nReview this draft.\n\n- **Proof** [source](../../evidence/account.md)\n\n<script>alert(1)</script>');
  assert.ok(html.includes('<h1>Title</h1>\n<p>Fixture disclosure</p>'));
  assert.ok(html.includes('<h2>Ask</h2>\n<p>Review this draft.</p>'));
  assert.ok(html.includes('<li><strong>Proof</strong> <a href="../../evidence/account.md">source</a></li>'));
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
});

test('updates retire managed commands while preserving local edits', () => tempRepo((target) => {
  init({ target, brainDir: '.product-bench', apply: true });
  const configPath = join(target, '.product-bench-install.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  const retired = ['deck', 'contribution-score', 'contribution-score-debug', 'prodinsights', 'trial-report', 'reviewer-bottleneck', 'prd', 'review-prd', 'buzz-daily', 'buzz-hn-comment-rubric', 'buzz-ph-comment-rubric', 'buzz-reddit-comment-rubric'];
  const brainConfigPath = join(target, '.product-bench/config.json');
  const brainConfig = JSON.parse(readFileSync(brainConfigPath, 'utf8'));
  const specRouting = { soft: ['hypothesis', 'scope-check'], custom_note: 'Preserve team routing' };
  brainConfig.routing.spec = specRouting;
  brainConfig.routing.prd = { hard: ['hypothesis'], soft: ['scope-check'] };
  writeFileSync(brainConfigPath, JSON.stringify(brainConfig));
  const reviewPath = '.codex/commands/pb-review-spec.md';
  rmSync(join(target, reviewPath)); delete config.owned[reviewPath];
  const paths = retired.flatMap((name) => ['.claude/commands', '.codex/commands', '.product-bench/runtime/payload/commands'].map((dir) => join(dir, `pb-${name}.md`)));
  for (const path of paths) {
    assert.equal(existsSync(join(target, path)), false);
    const bytes = `# Prior managed command: ${path}\n`;
    writeFileSync(join(target, path), bytes);
    config.owned[path] = createHash('sha256').update(bytes).digest('hex');
  }
  const edited = paths[0];
  writeFileSync(join(target, edited), '# Local custom deck workflow\n');
  writeFileSync(configPath, JSON.stringify(config));
  const preview = JSON.parse(update(target, false));
  assert.deepEqual(preview.skipped, [edited]);
  assert.equal(preview.removed.length, paths.length - 1);
  assert.ok(paths.every((path) => existsSync(join(target, path))));
  assert.ok(JSON.parse(readFileSync(brainConfigPath, 'utf8')).routing.prd);
  assert.ok(preview.changed.includes('.product-bench/config.json'));
  const applied = JSON.parse(update(target, true));
  assert.deepEqual(applied.removed, preview.removed);
  assert.equal(readFileSync(join(target, edited), 'utf8'), '# Local custom deck workflow\n');
  assert.ok(applied.removed.every((path) => !existsSync(join(target, path))));
  const after = JSON.parse(readFileSync(configPath, 'utf8'));
  assert.ok(applied.removed.every((path) => !(path in after.owned)));
  assert.equal(after.owned[edited], config.owned[edited]);
  const routing = JSON.parse(readFileSync(brainConfigPath, 'utf8')).routing;
  assert.equal(routing.prd, undefined);
  assert.deepEqual(routing.spec, specRouting);
  assert.match(readFileSync(join(target, reviewPath), 'utf8'), /Review lenses/);
  assert.ok(existsSync(join(target, '.claude/commands/pb-sales-doc.md')));
  assert.ok(existsSync(join(target, '.codex/commands/pb-deck-review.md')));
}));

test('install preserves host instructions and shared context', () => tempRepo((target) => {
  writeFileSync(join(target, 'AGENTS.md'), '# Existing team instructions\n');
  mkdirSync(join(target, '.claude'), { recursive: true });
  writeFileSync(join(target, '.claude/settings.json'), JSON.stringify({ permissions: { allow: ['Read'] } }));
  assert.match(init({ target, brainDir: 'team/brain', apply: false }), /team\/brain/);
  init({ target, brainDir: 'team/brain', apply: true });
  assert.match(readFileSync(join(target, 'AGENTS.md'), 'utf8'), /Existing team instructions/);
  const hostSettings = JSON.parse(readFileSync(join(target, '.claude/settings.json'), 'utf8'));
  assert.deepEqual(hostSettings.permissions.allow, ['Read']);
  assert.equal(hostSettings.hooks.UserPromptSubmit.length, 1);
  const ignore = readFileSync(join(target, '.gitignore'), 'utf8');
  assert.ok(!ignore.split('\n').includes('/team/brain/'));
  assert.ok(ignore.includes('/team/brain/runtime/'));
  assert.equal(JSON.parse(doctor(target)).context_storage, 'repository');
  assert.equal(JSON.parse(doctor(target)).ready, true);
  assert.equal(JSON.parse(doctor(target)).freshness['product.md'].status, 'missing');
  writeFileSync(join(target, 'team/brain/context/product.md'), '# Product\nLast updated: 2026-09-24\n');
  assert.equal(JSON.parse(doctor(target)).ready, true);
  assert.equal(JSON.parse(doctor(target)).freshness['product.md'].status, 'fresh');
  const hookOutput = execFileSync(process.execPath, [join(target, 'team/brain/runtime/bin/freshness-hook.mjs'), '--host', 'codex'], { cwd: target, input: '{}', encoding: 'utf8' });
  assert.match(hookOutput, /Product Bench context check/);
  assert.match(update(target, false), /"changed": \[\]/);
  const result = JSON.parse(uninstall(target, true));
  assert.equal(result.context_preserved, 'team/brain');
  assert.match(readFileSync(join(target, 'AGENTS.md'), 'utf8'), /Existing team instructions/);
  assert.equal(JSON.parse(readFileSync(join(target, '.claude/settings.json'), 'utf8')).hooks.UserPromptSubmit.length, 0);
}));

test('a teammate clone uses reviewed context directly and can install its local runtime', () => tempRepo((target) => {
  const author = join(target, 'author'); mkdirSync(author);
  execFileSync('git', ['init', '--quiet', author]);
  init({ target: author, brainDir: 'team/brain', apply: true });
  const context = '# Team product\nLast updated: 2026-10-05\nReviewed repository evidence.\n';
  writeFileSync(join(author, 'team/brain/context/product.md'), context);
  const trackedCandidates = execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: author, encoding: 'utf8' }).split('\n');
  assert.ok(trackedCandidates.includes('team/brain/context/product.md'));
  assert.ok(trackedCandidates.includes('team/brain/config.json'));
  assert.ok(!trackedCandidates.includes('.product-bench-install.json'));
  assert.ok(!trackedCandidates.some((file) => file.startsWith('team/brain/runtime/') || file.startsWith('team/brain/state/')));
  execFileSync('git', ['add', '.'], { cwd: author });
  execFileSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '--quiet', '-m', 'Reviewed team context'], { cwd: author });
  const teammate = join(target, 'teammate');
  execFileSync('git', ['clone', '--quiet', author, teammate]);
  const sharedConfig = readFileSync(join(teammate, 'team/brain/config.json'), 'utf8');
  init({ target: teammate, brainDir: 'team/brain', apply: true });
  assert.equal(readFileSync(join(teammate, 'team/brain/context/product.md'), 'utf8'), context);
  assert.equal(readFileSync(join(teammate, 'team/brain/config.json'), 'utf8'), sharedConfig);
  assert.equal(JSON.parse(doctor(teammate)).ready, true);
  assert.equal(execFileSync('git', ['status', '--porcelain'], { cwd: teammate, encoding: 'utf8' }), '');
}));

test('update previews and migrates legacy context ignores without changing reviewed context', () => tempRepo((target) => {
  execFileSync('git', ['init', '--quiet', target]);
  init({ target, brainDir: 'team/brain', apply: true });
  const contextPath = join(target, 'team/brain/context/product.md');
  const context = '# Reviewed team context\nLast updated: 2026-10-05\n';
  writeFileSync(contextPath, context);
  writeFileSync(join(target, '.gitignore'), 'node_modules/\n/team/brain/\ncustom-local/\n');
  const configPath = join(target, '.product-bench-install.json');
  const config = JSON.parse(readFileSync(configPath, 'utf8'));
  delete config.context_storage; config.context_shared = false;
  writeFileSync(configPath, JSON.stringify(config));
  writeFileSync(join(target, 'AGENTS.md'), '# Team instructions\n<!-- product-bench:start -->\nLegacy private-context instructions\n<!-- product-bench:end -->\n');
  assert.ok(JSON.parse(update(target)).changed.includes('.gitignore'));
  assert.ok(readFileSync(join(target, '.gitignore'), 'utf8').includes('/team/brain/\n'));
  update(target, true);
  assert.equal(readFileSync(contextPath, 'utf8'), context);
  const ignore = readFileSync(join(target, '.gitignore'), 'utf8');
  assert.ok(ignore.includes('custom-local/\n'));
  assert.ok(!ignore.split('\n').includes('/team/brain/'));
  assert.ok(execFileSync('git', ['ls-files', '--others', '--exclude-standard'], { cwd: target, encoding: 'utf8' }).includes('team/brain/context/product.md'));
  assert.equal(JSON.parse(doctor(target)).context_storage, 'repository');
  const instructions = readFileSync(join(target, 'AGENTS.md'), 'utf8');
  assert.ok(instructions.includes('# Team instructions'));
  assert.ok(instructions.includes('Context is shared in the repository'));
  assert.ok(!instructions.includes('Legacy private-context instructions'));
  assert.deepEqual(JSON.parse(update(target)).changed, []);
}));

test('install fails safely on collisions and escaping paths', () => tempRepo((target) => {
  assert.throws(() => init({ target, brainDir: '../outside', apply: false }), /inside/);
  mkdirSync(join(target, '.claude/commands'), { recursive: true });
  writeFileSync(join(target, '.claude/commands/pb-spec.md'), 'user-owned');
  assert.throws(() => init({ target, brainDir: '.product-bench', apply: true }), /overwritten/);
  assert.equal(readFileSync(join(target, '.claude/commands/pb-spec.md'), 'utf8'), 'user-owned');
}));

test('install checks hook settings before writing any files', () => tempRepo((target) => {
  mkdirSync(join(target, '.codex'), { recursive: true });
  writeFileSync(join(target, '.codex/hooks.json'), '{ invalid json');
  assert.throws(() => init({ target, brainDir: '.product-bench', apply: true }), /non-JSON host settings/);
  assert.equal(readFileSync(join(target, '.codex/hooks.json'), 'utf8'), '{ invalid json');
  assert.throws(() => readFileSync(join(target, '.product-bench-install.json')), /ENOENT/);
}));

test('sync keeps proposals pending until reviewed and applied', () => tempRepo((target) => {
  init({ target, brainDir: '.product-bench', apply: true });
  addSource(target, { id: 'research', kind: 'mcp', capability: 'search and read interview notes', scope: 'approved research folder', targets: ['users.md'], cadence_days: 14 });
  const first = stageObservation(target, { source_id: 'research', cursor: 'page-a', complete: true, items: [{ object_id: 'note-1', version: 'v1', target: 'users.md', citation: 'mcp://notes/1', summary: 'A user struggled with setup' }] });
  assert.equal(first.reviewed_cursor, null);
  assert.equal(first.pending, 1);
  const second = stageObservation(target, { source_id: 'research', cursor: 'page-b', complete: true, items: [{ object_id: 'note-1', version: 'v1', target: 'users.md', citation: 'mcp://notes/1', summary: 'A user struggled with setup' }] });
  assert.equal(second.added, 0);
  assert.equal(second.reviewed_cursor, null);
  const id = syncStatus(target).proposals[0].id;
  assert.throws(() => decideProposal(target, id, 'accepted'), /--applied/);
  const done = decideProposal(target, id, 'rejected');
  assert.equal(done.reviewed_cursor, 'page-b');
}));

test('repo source pull notices changes, deletion, and a reverted version', () => tempRepo((target) => {
  init({ target, brainDir: '.product-bench', apply: true });
  mkdirSync(join(target, 'notes'));
  const note = join(target, 'notes', 'research.md');
  writeFileSync(note, 'Version A');
  addSource(target, { id: 'notes', kind: 'repo', scope: 'notes only', paths: ['notes'], targets: ['users.md'] });
  assert.equal(pullLocalSource(target, 'notes').added, 1);
  assert.equal(pullLocalSource(target, 'notes').added, 0);
  writeFileSync(note, 'Version B');
  assert.equal(pullLocalSource(target, 'notes').added, 1);
  writeFileSync(note, 'Version A');
  assert.equal(pullLocalSource(target, 'notes').added, 1);
  rmSync(note);
  assert.equal(pullLocalSource(target, 'notes').added, 1);
  assert.equal(pullLocalSource(target, 'notes').added, 0);
  assert.equal(syncStatus(target).proposals.length, 4);
}));

test('share blocks unfilled and sensitive context', () => tempRepo((target) => {
  init({ target, brainDir: '.product-bench', apply: true });
  assert.throws(() => sharePreview(target, 'product.md', true, true), /blocked/);
  writeFileSync(join(target, '.product-bench/context/product.md'), '# Product\nLast updated: 2026-09-24\nContact: someone@example.com\n');
  assert.match(sharePreview(target, 'product.md'), /email address/);
  assert.throws(() => sharePreview(target, 'product.md', true, true), /blocked/);
}));

test('analytics fixture is explicitly fictional and live SQL is guarded', () => tempRepo((target) => {
  init({ target, brainDir: '.product-bench', apply: true });
  const root = join(target, '.product-bench');
  assert.deepEqual(queryFixture(root, { metric: 'activation_rate' }), { value: 1, numerator: 3, denominator: 3, fictional: true });
  assert.throws(() => validateReadOnlySQL('DELETE FROM events'), /Only SELECT/);
  assert.throws(() => validateReadOnlySQL('SELECT * FROM x; DROP TABLE x'), /Multiple/);
}));

test('saved analytics definitions run without a live provider', async () => {
  const target = mkdtempSync(join(tmpdir(), 'product-bench-test-'));
  try {
    init({ target, brainDir: '.product-bench', apply: true });
    saveAnalyticsDefinition(target, { name: 'activation', description: 'Fictional activation', provider: 'fixture', metric: 'activation_rate' });
    assert.equal(listAnalyticsDefinitions(target)[0].name, 'activation');
    assert.equal((await runAnalyticsDefinition(target, 'activation')).result.value, 1);
    assert.equal((await runAnalyticsDashboard(target, ['activation'])).results.length, 1);
    assert.throws(() => saveAnalyticsDefinition(target, { name: 'activation', provider: 'fixture', metric: 'event_count' }), /already exists/);
  } finally { rmSync(target, { recursive: true, force: true }); }
});

test('CLI installs both hosts in a fresh Git repository', () => tempRepo((target) => {
  execFileSync('git', ['init', '--quiet', target]);
  const install = execFileSync(process.execPath, [bin, 'init', '--target', target, '--yes'], { encoding: 'utf8' });
  assert.match(install, /Next: open Claude Code/);
  assert.match(readFileSync(join(target, '.claude/commands/pb-spec.md'), 'utf8'), /Build contract/);
  assert.match(readFileSync(join(target, '.codex/commands/pb-spec.md'), 'utf8'), /Build contract/);
  const report = JSON.parse(execFileSync(process.execPath, [bin, 'doctor', '--target', target], { encoding: 'utf8' }));
  assert.equal(report.ready, true);
  assert.equal(report.freshness['users.md'].status, 'missing');
  const status = execFileSync('git', ['status', '--short', '--ignored'], { cwd: target, encoding: 'utf8' });
  assert.match(status, /!! \.product-bench\//);
}));
