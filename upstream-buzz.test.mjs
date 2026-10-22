// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, symlinkSync, renameSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { init, doctor, update } from './installer.mjs';
import { installBuzz, buzzStatus, buzzSource } from './upstream-buzz.mjs';

function fixture(run) {
  const scratch = mkdtempSync(join(tmpdir(), 'pb-buzz-'));
  try {
    const target = join(scratch, 'team'); mkdirSync(target);
    const repository = join(scratch, 'upstream'); mkdirSync(repository);
    execFileSync('git', ['init', '--quiet', '--initial-branch=main', repository]);
    const required_files = buzzSource.required_files;
    for (const file of required_files) {
      const path = join(repository, file); mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, file.endsWith('.py') ? `from pathlib import Path\nimport sys\nroot=Path(__file__).resolve().parent.parent\nlink=Path(sys.argv[2])/'.agents/skills/buzz-engine'\nlink.parent.mkdir(parents=True,exist_ok=True)\nif not link.exists(): link.symlink_to(root,target_is_directory=True)\n` : '# Upstream fixture\n');
    }
    writeFileSync(join(repository, '.gitignore'), 'local-cache/\n');
    execFileSync('git', ['add', '.'], { cwd: repository });
    execFileSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '--quiet', '-m', 'Upstream fixture'], { cwd: repository });
    const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repository, encoding: 'utf8' }).trim();
    init({ target, brainDir: 'team/brain', apply: true });
    run({ target, repository, revision, source: { repository, branch: 'main', hosts: ['claude', 'codex'], required_files } });
  } finally { rmSync(scratch, { recursive: true, force: true }); }
}

test('Buzz import previews without local changes, resolves main, records the commit, and links Codex', () => fixture(({ target, source, revision }) => {
  const preview = installBuzz(target, false, source);
  assert.equal(preview.status, 'preview_only');
  assert.equal(existsSync(preview.path), false);
  const result = installBuzz(target, true, source);
  assert.equal(result.status, 'installed');
  assert.equal(result.codex_skill, 'linked');
  assert.equal(result.revision, revision);
  assert.equal(readFileSync(join(result.path, 'commands/buzz.md'), 'utf8'), '# Upstream fixture\n');
  assert.equal(installBuzz(target, true, source).changed, false);
  assert.equal(existsSync(join(target, 'buzz/config.yaml')), false);
  const record = JSON.parse(readFileSync(join(target, 'team/brain/integrations/buzz-engine.json'), 'utf8'));
  assert.equal(record.revision, revision);
  assert.equal(record.branch, 'main');
}));

function commitChange(repository, message) {
  execFileSync('git', ['add', '.'], { cwd: repository });
  execFileSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@example.invalid', 'commit', '--quiet', '-m', message], { cwd: repository });
  return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repository, encoding: 'utf8' }).trim();
}

test('Product Bench update previews then advances clean Buzz imports while ordinary status stays local', () => fixture(({ target, repository, source, revision }) => {
  const installed = installBuzz(target, true, source);
  const recordPath = join(target, 'team/brain/integrations/buzz-engine.json');
  const priorRecord = readFileSync(recordPath, 'utf8');
  const cache = join(installed.path, 'local-cache'); mkdirSync(cache);
  writeFileSync(join(cache, 'fixture.txt'), 'Preserve ignored runtime files');
  writeFileSync(join(repository, 'commands/buzz.md'), '# Upstream fix\n');
  const next = commitChange(repository, 'Fix Buzz');
  assert.equal(buzzStatus(join(target, 'team/brain'), source).revision, revision);
  const preview = JSON.parse(update(target, false, source)).integrations.buzz;
  assert.equal(preview.revision, next);
  assert.equal(preview.current_revision, revision);
  assert.equal(preview.changed, true);
  assert.equal(readFileSync(recordPath, 'utf8'), priorRecord);
  assert.equal(readFileSync(join(installed.path, 'commands/buzz.md'), 'utf8'), '# Upstream fixture\n');
  const applied = JSON.parse(update(target, true, source)).integrations.buzz;
  assert.equal(applied.revision, next);
  assert.equal(applied.codex_skill, 'linked');
  assert.equal(readFileSync(join(installed.path, 'commands/buzz.md'), 'utf8'), '# Upstream fix\n');
  assert.equal(readFileSync(join(cache, 'fixture.txt'), 'utf8'), 'Preserve ignored runtime files');
  assert.equal(JSON.parse(readFileSync(recordPath, 'utf8')).revision, next);
}));

test('Buzz import preserves edited checkouts and reports them unchecked', () => fixture(({ target, source }) => {
  const installed = installBuzz(target, true, source);
  const command = join(installed.path, 'commands/buzz.md');
  writeFileSync(command, '# Local edits\n');
  assert.equal(buzzStatus(join(target, 'team/brain'), source).status, 'unchecked');
  assert.throws(() => installBuzz(target, true, source), /local changes/);
  assert.equal(readFileSync(command, 'utf8'), '# Local edits\n');
  const report = JSON.parse(update(target, true, source)).integrations.buzz;
  assert.equal(report.status, 'skipped');
  assert.match(report.reason, /local changes/);
  commitChange(installed.path, 'Local committed customization');
  const committed = JSON.parse(update(target, true, source)).integrations.buzz;
  assert.equal(committed.status, 'skipped');
  assert.match(committed.reason, /recorded revision/);
  assert.equal(readFileSync(command, 'utf8'), '# Local edits\n');
}));

test('earlier pinned imports without a record adopt branch updates and record the resolved commit', () => fixture(({ target, repository, source }) => {
  const installed = installBuzz(target, true, source);
  const record = join(target, 'team/brain/integrations/buzz-engine.json');
  rmSync(record);
  writeFileSync(join(repository, 'commands/buzz.md'), '# Fix after pinned install\n');
  const next = commitChange(repository, 'New upstream fix');
  const result = JSON.parse(update(target, true, source)).integrations.buzz;
  assert.equal(result.revision, next);
  assert.equal(JSON.parse(readFileSync(record, 'utf8')).revision, next);
  assert.equal(readFileSync(join(installed.path, 'commands/buzz.md'), 'utf8'), '# Fix after pinned install\n');
}));

test('a failing upstream link installer rolls back code and preserves the previous revision record', () => fixture(({ target, repository, source, revision }) => {
  const installed = installBuzz(target, true, source);
  const record = join(target, 'team/brain/integrations/buzz-engine.json');
  const priorRecord = readFileSync(record, 'utf8');
  writeFileSync(join(repository, 'scripts/install-codex.py'), 'raise SystemExit("Fixture installer failure")\n');
  commitChange(repository, 'Broken installer');
  const result = JSON.parse(update(target, true, source)).integrations.buzz;
  assert.equal(result.status, 'skipped');
  assert.equal(buzzStatus(join(target, 'team/brain'), source).revision, revision);
  assert.equal(readFileSync(record, 'utf8'), priorRecord);
  assert.equal(readFileSync(join(installed.path, 'commands/buzz.md'), 'utf8'), '# Upstream fixture\n');
}));

test('upstream fetch failure and missing adapter files preserve the installed engine', () => fixture(({ target, repository, source, revision }) => {
  const installed = installBuzz(target, true, source);
  rmSync(join(repository, 'SKILL.md'));
  commitChange(repository, 'Invalid adapter change');
  const invalid = JSON.parse(update(target, true, source)).integrations.buzz;
  assert.equal(invalid.status, 'skipped');
  assert.match(invalid.reason, /missing SKILL.md/);
  assert.equal(buzzStatus(join(target, 'team/brain'), source).revision, revision);
  renameSync(repository, repository + '-offline');
  const offline = JSON.parse(update(target, true, source)).integrations.buzz;
  assert.equal(offline.status, 'skipped');
  assert.equal(readFileSync(join(installed.path, 'commands/buzz.md'), 'utf8'), '# Upstream fixture\n');
}));

test('upstream history rewrites never replace the installed Buzz commit', () => fixture(({ target, repository, source, revision }) => {
  installBuzz(target, true, source);
  execFileSync('git', ['checkout', '--quiet', '--orphan', 'replacement'], { cwd: repository });
  const replacement = commitChange(repository, 'Rewritten history');
  execFileSync('git', ['branch', '-f', 'main', replacement], { cwd: repository });
  const report = JSON.parse(update(target, true, source)).integrations.buzz;
  assert.equal(report.status, 'skipped');
  assert.match(report.reason, /fast-forward/);
  assert.equal(buzzStatus(join(target, 'team/brain'), source).revision, revision);
}));

test('Buzz import rejects missing required upstream files before publishing the checkout', () => fixture(({ target, source }) => {
  const broken = { ...source, required_files: [...source.required_files, 'missing.md'] };
  assert.throws(() => installBuzz(target, true, broken), /missing/);
  assert.equal(existsSync(join(target, 'team/brain/integrations/buzz-engine')), false);
}));

test('Buzz import refuses an existing foreign skill and symlink parents', () => fixture(({ target, source, repository }) => {
  const parent = join(target, '.agents/skills'); mkdirSync(parent, { recursive: true });
  mkdirSync(join(parent, 'buzz-engine'));
  assert.throws(() => installBuzz(target, true, source), /Existing Buzz skill/);
  assert.equal(existsSync(join(target, 'team/brain/integrations/buzz-engine')), false);
  rmSync(join(target, '.agents'), { recursive: true });
  symlinkSync(repository, join(target, '.agents'));
  assert.throws(() => installBuzz(target, true, source), /symlink/);
}));

test('optional Buzz imports are absent from the packaged payload and reported independently by doctor', () => fixture(({ target }) => {
  const report = JSON.parse(doctor(target));
  assert.equal(report.integrations.buzz.status, 'not_configured');
  assert.equal(report.ready, true);
  assert.equal(existsSync(join(target, '.claude/commands/pb-buzz-daily.md')), false);
  assert.match(readFileSync(join(target, '.codex/commands/pb-buzz.md'), 'utf8'), /Upstream import and handoff/);
}));

function configureSource(target, source) {
  const path = join(target, 'team/brain/config.json');
  const config = JSON.parse(readFileSync(path, 'utf8'));
  config.buzz_source = { repository: source.repository, branch: source.branch };
  writeFileSync(path, JSON.stringify(config));
}

test('Buzz without a configured source stays optional and gives a local setup path', () => fixture(({ target }) => {
  const report = JSON.parse(doctor(target));
  assert.equal(report.integrations.buzz.status, 'not_configured');
  assert.match(report.integrations.buzz.reason, /buzz_source.*config\.json/);
  assert.equal(report.ready, true);
  assert.equal(installBuzz(target, false).status, 'not_configured');
  assert.equal(JSON.parse(update(target, true)).integrations.buzz.status, 'not_configured');
}));

test('Buzz reads configured repository, while explicit caller source takes precedence', () => fixture(({ target, source, revision }) => {
  configureSource(target, source);
  assert.equal(installBuzz(target, true).revision, revision);
  configureSource(target, { ...source, repository: join(target, 'unavailable-repository') });
  assert.equal(installBuzz(target, true, source).revision, revision);
  assert.throws(() => installBuzz(target, true), /unexpected origin/);
}));

test('recorded Buzz imports update without reconfiguration and doctor never fetches', () => fixture(({ target, repository, source, revision }) => {
  const installed = installBuzz(target, true, source);
  renameSync(repository, repository + '-offline');
  const local = JSON.parse(doctor(target)).integrations.buzz;
  assert.equal(local.status, 'installed');
  assert.equal(local.revision, revision);
  renameSync(repository + '-offline', repository);
  writeFileSync(join(repository, 'commands/buzz.md'), '# Recorded-source update\n');
  const next = commitChange(repository, 'Recorded-source update');
  assert.equal(JSON.parse(update(target, true)).integrations.buzz.revision, next);
  writeFileSync(join(installed.path, 'commands/buzz.md'), '# Reviewed local edit\n');
  const guarded = JSON.parse(update(target, true)).integrations.buzz;
  assert.equal(guarded.status, 'skipped');
  assert.match(guarded.reason, /local changes/);
}));

test('recordless Buzz imports use their local origin without forced reconfiguration', () => fixture(({ target, repository, source }) => {
  installBuzz(target, true, source);
  rmSync(join(target, 'team/brain/integrations/buzz-engine.json'));
  writeFileSync(join(repository, 'commands/buzz.md'), '# Recordless-source update\n');
  const next = commitChange(repository, 'Recordless-source update');
  assert.equal(JSON.parse(update(target, true)).integrations.buzz.revision, next);
}));
