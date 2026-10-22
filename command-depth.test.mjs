// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, chmodSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { init, update } from './installer.mjs';

function fixture(fn) {
  const target = mkdtempSync(join(tmpdir(), 'pb-depth-'));
  try { return fn(target); } finally { rmSync(target, { recursive: true, force: true }); }
}

test('installed workflow recommendations resolve to real Product Bench commands', () => fixture((target) => {
  init({ target, brainDir: 'team/brain', apply: true });
  for (const host of ['.claude', '.codex']) {
    const commands = join(target, host, 'commands');
    const known = new Set(readdirSync(commands).map(file => file.replace(/\.md$/, '')));
    const skillHost = host === '.codex' ? '.agents' : host;
    const paths = [...readdirSync(commands).filter(file => file.endsWith('.md')).map(file => join(commands, file)),
      ...['grill-me', 'plain-english'].map(name => join(target, skillHost, 'skills', name, 'SKILL.md'))];
    const missing = paths.flatMap(path => [...new Set(readFileSync(path, 'utf8').match(/\bpb-[a-z][a-z0-9-]*\b/g) || [])]
      .filter(name => !known.has(name)).map(name => ({file: path, command: name})));
    assert.deepEqual(missing, [], `${host} recommends unavailable commands`);
  }
}));

test('every bundled skill resource reaches both host installs and upgrades preserve local edits', () => fixture((target) => {
  init({ target, brainDir: 'team/brain', apply: true });
  const source = fileURLToPath(new URL('./payload/skills/', import.meta.url));
  const catalog = JSON.parse(readFileSync(new URL('./payload/skill-catalog.json', import.meta.url), 'utf8'));
  assert.deepEqual(readdirSync(source).sort(), catalog.skills.map((skill) => skill.name).sort());
  function verify(dir, relative = '') {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = join(relative, entry.name);
      if (entry.isDirectory()) verify(join(dir, entry.name), file);
      else for (const host of ['.agents/skills', '.claude/skills']) {
        assert.deepEqual(readFileSync(join(target, host, file)), readFileSync(join(source, file)), `${host}/${file}`);
      }
    }
  }
  verify(source);
  assert.deepEqual(readFileSync(join(target, 'team/brain/runtime/THIRD-PARTY-NOTICES.md')),
    readFileSync(new URL('./THIRD-PARTY-NOTICES.md', import.meta.url)));
  assert.deepEqual(readFileSync(join(target, 'team/brain/runtime/docs/THIRD-PARTY-PROVENANCE.json')),
    readFileSync(new URL('./docs/THIRD-PARTY-PROVENANCE.json', import.meta.url)));
  const customized = join(target, '.agents/skills/plain-english/SKILL.md');
  writeFileSync(customized, '# Reviewed team preset\n');
  update(target, true);
  assert.equal(readFileSync(customized, 'utf8'), '# Reviewed team preset\n');
  assert.deepEqual(readFileSync(join(target, '.claude/skills/plain-english/SKILL.md')), readFileSync(join(source, 'plain-english/SKILL.md')));
}));

test('writing adapters resolve imported skills on both hosts without a second voice interview', () => fixture((target) => {
  init({ target, brainDir: 'team/brain', apply: true });
  const adapter = readFileSync(join(target, 'team/brain/runtime/payload/brain/EDITORIAL-DRAFT.md'), 'utf8');
  assert.match(adapter, /host's installed skill\/plugin catalog/);
  assert.match(adapter, /Do not silently substitute/);
  assert.match(adapter, /context\/brand-voice\.md/);
  assert.match(adapter, /content_source\.repository/);
  for (const host of ['.claude', '.codex']) {
    for (const name of ['blog','content-engine','content-engine-weekly']) {
      const command = readFileSync(join(target, host, `commands/pb-${name}.md`), 'utf8');
      assert.match(command, /runtime\/payload\/brain\/EDITORIAL-DRAFT\.md/);
      assert.match(command, /doctor\.integrations\.content/);
      assert.match(command, /actual imported/);
    }
    const setup = readFileSync(join(target, host, 'commands/pb-setup.md'), 'utf8');
    assert.match(setup, /requires no separate configuration questionnaire/);
    assert.equal(existsSync(join(target, host === '.codex' ? '.agents' : host, 'skills/editorial-draft')), false);
  }
}));

test('fresh installs expose usable content setup and analytics sections without patch residue', () => fixture((target) => {
  init({ target, brainDir: 'team/brain', apply: true });
  const guide = readFileSync(join(target, 'team/brain/GETTING-STARTED.md'), 'utf8');
  assert.doesNotMatch(guide, /^\+(?:$|[+#`A-Za-z])/m);
  for (const heading of ['Import the content pipeline', 'Set up analytics']) {
    assert.ok(guide.split('\n').includes(`## ${heading}`), `${heading} must be a real Markdown heading`);
  }
  for (const host of ['.claude', '.codex']) {
    const setup = readFileSync(join(target, host, 'commands/pb-setup.md'), 'utf8');
    assert.match(setup, /content-install --target \. --apply/);
    assert.match(setup, /content_source\.repository/);
    const preamble = readFileSync(join(target, host, 'commands/pb-_preamble.md'), 'utf8');
    assert.doesNotMatch(preamble, /Product Bench installs Editorial Draft/);
    for (const workflow of ['compound', 'sync-context', 'review-spec']) {
      const command = readFileSync(join(target, host, `commands/pb-${workflow}.md`), 'utf8');
      assert.doesNotMatch(command, /missing skill or reviewer resource is an incomplete installation/);
      assert.match(command, /optional Content Engine import/);
    }
  }
  const teamGuide = join(target, 'team/brain/GETTING-STARTED.md');
  writeFileSync(teamGuide, '# Reviewed team onboarding notes\n');
  update(target, true);
  assert.equal(readFileSync(teamGuide, 'utf8'), '# Reviewed team onboarding notes\n');
  assert.equal(readFileSync(join(target, 'team/brain/runtime/payload/brain/GETTING-STARTED.md'), 'utf8'), guide);
  for (const host of ['.claude', '.codex']) {
    assert.match(readFileSync(join(target, host, 'commands/pb-setup.md'), 'utf8'), /runtime\/payload\/brain\/GETTING-STARTED\.md/);
  }
}));

test('upgrades preview retirement of inherited icon assets and preserve local customizations', () => fixture((target) => {
  init({ target, brainDir: 'team/brain', apply: true });
  const installPath = join(target, '.product-bench-install.json');
  const config = JSON.parse(readFileSync(installPath, 'utf8'));
  const copies = ['.claude/skills', '.agents/skills', 'team/brain/runtime/payload/skills']
    .map((dir) => join(dir, 'visual-doc-creation/assets/line-icons.json'));
  const old = '{"legacy":"imported icon geometry"}\n';
  for (const file of copies) {
    writeFileSync(join(target, file), old);
    config.owned[file] = createHash('sha256').update(old).digest('hex');
  }
  writeFileSync(installPath, JSON.stringify(config));
  writeFileSync(join(target, copies[1]), '{"reviewed":"team-owned asset"}\n');
  update(target, false);
  assert.ok(copies.every((file) => existsSync(join(target, file))));
  update(target, true);
  assert.equal(existsSync(join(target, copies[0])), false);
  assert.equal(existsSync(join(target, copies[2])), false);
  assert.equal(readFileSync(join(target, copies[1]), 'utf8'), '{"reviewed":"team-owned asset"}\n');
  const updated = JSON.parse(readFileSync(installPath, 'utf8'));
  assert.equal(updated.owned[copies[0]], undefined);
  assert.equal(updated.owned[copies[2]], undefined);
}));

test('both hosts receive usable battlecard guidance and shared voice at a custom brain path', () => fixture((target) => {
  init({ target, brainDir: 'team/brain', apply: true });
  for (const host of ['.claude', '.codex']) {
    const card = readFileSync(join(target, host, 'commands/pb-battlecard.md'), 'utf8');
    assert.match(card, /30-second pitch/i);
    assert.match(card, /Where they win/);
    assert.match(card, /Why they ask/);
    assert.match(card, /What not to say/);
    assert.match(card, /MEDIUM.*91[–-]180/);
    assert.match(card, /Fictional illustration only/);
    const preamble = readFileSync(join(target, host, 'commands/pb-_preamble.md'), 'utf8');
    assert.match(preamble, /runtime\/payload\/brain\/VOICE\.md/);
  }
  assert.match(readFileSync(join(target, 'team/brain/runtime/payload/brain/VOICE.md'), 'utf8'), /negative parallelism/);
}));

test('depth upgrade refreshes managed commands and runtime defaults while preserving reviewed team voice and edited commands', () => fixture((target) => {
  init({ target, brainDir: 'team/brain', apply: true });
  const installPath = join(target, '.product-bench-install.json');
  const config = JSON.parse(readFileSync(installPath, 'utf8'));
  const managed = '.claude/commands/pb-battlecard.md';
  const edited = '.codex/commands/pb-battlecard.md';
  const defaults = 'team/brain/runtime/payload/brain/VOICE.md';
  for (const path of [managed, edited, defaults]) {
    const old = '# Earlier installed procedure\n';
    writeFileSync(join(target, path), old);
    config.owned[path] = createHash('sha256').update(old).digest('hex');
  }
  writeFileSync(join(target, edited), '# Team-customized battlecard\n');
  const voicePath = join(target, 'team/brain/context/brand-voice.md');
  const voice = '# Reviewed voice\nLast updated: 2026-10-07\nUse approved customer vocabulary.\n';
  writeFileSync(voicePath, voice);
  writeFileSync(installPath, JSON.stringify(config));
  const preview = JSON.parse(update(target));
  assert.ok(preview.changed.includes(managed));
  assert.ok(preview.changed.includes(defaults));
  assert.ok(preview.skipped.includes(edited));
  assert.equal(readFileSync(join(target, managed), 'utf8'), '# Earlier installed procedure\n');
  update(target, true);
  assert.match(readFileSync(join(target, managed), 'utf8'), /Where they win/);
  assert.match(readFileSync(join(target, defaults), 'utf8'), /negative parallelism/);
  assert.equal(readFileSync(join(target, edited), 'utf8'), '# Team-customized battlecard\n');
  assert.equal(readFileSync(voicePath, 'utf8'), voice);
}));

test('selected review lenses run cold and skeptical sessions with scoped evidence and distinct receipts', () => fixture((target) => {
  init({ target, brainDir: 'team/brain', apply: true });
  const bin = join(target, 'bin'); mkdirSync(bin);
  const cli = join(bin, 'claude');
  writeFileSync(cli, `#!${process.execPath}\nprocess.stdin.resume();process.stdin.on('end',()=>process.stdout.write(JSON.stringify({is_error:false,result:'Verdict: VERIFIED-CLEAN\\nChecked the supplied artifact; this is a mock reviewer.'})));\n`);
  chmodSync(cli, 0o755);
  writeFileSync(join(target, 'spec.md'), '# Review fixture\nScope: import preview only.\n');
  writeFileSync(join(target, 'team/brain/context/product.md'), '# Product\nReviewed company fact: IMPORT_PREVIEW_SUPPORTED\n');
  mkdirSync(join(target, 'evidence'));
  writeFileSync(join(target, 'evidence/unrelated.md'), 'UNAUTHORIZED_UNRELATED_EVIDENCE');
  writeFileSync(join(target, 'approved-proof.md'), 'EXPLICITLY_SUPPLIED_PROOF');
  const adapter = fileURLToPath(new URL('./review-lenses.mjs', import.meta.url));
  execFileSync(process.execPath, [adapter, '--host', 'claude', '--input', 'spec.md', '--out', 'reviews', '--parallel', '2', '--lenses', 'functional,naive-reader', '--evidence', 'approved-proof.md', '--skeptic'], { cwd: target, env: { ...process.env, PATH: `${bin}:${process.env.PATH}` } });
  const receipt = JSON.parse(readFileSync(join(target, 'reviews/execution.json'), 'utf8'));
  assert.equal(receipt.reviews.length, 3);
  assert.equal(new Set(receipt.reviews.map((row) => row.pid)).size, 3);
  assert.ok(receipt.reviews.every((row) => row.exit_code === 0 && row.fresh_process));
  assert.equal(receipt.reviews.filter((row) => row.phase === 'skeptic').length, 1);
  assert.deepEqual(receipt.reviews.find((row) => row.lens === 'naive-reader').sources, []);
  const normal = readFileSync(join(target, 'reviews/functional-prompt.txt'), 'utf8');
  const cold = readFileSync(join(target, 'reviews/naive-reader-prompt.txt'), 'utf8');
  const skeptic = readFileSync(join(target, 'reviews/functional-skeptic-prompt.txt'), 'utf8');
  assert.match(normal, /IMPORT_PREVIEW_SUPPORTED/);
  assert.match(normal, /EXPLICITLY_SUPPLIED_PROOF/);
  assert.doesNotMatch(normal, /UNAUTHORIZED_UNRELATED_EVIDENCE|All supplied facts are fictional/);
  assert.doesNotMatch(cold, /IMPORT_PREVIEW_SUPPORTED|EXPLICITLY_SUPPLIED_PROOF/);
  assert.match(skeptic, /load-bearing assumption/);
}));

test('a reviewer rerun cannot reuse a stale clean artifact when the current process produces no result', () => fixture((target) => {
  init({ target, brainDir: 'team/brain', apply: true });
  const bin = join(target, 'bin'); mkdirSync(bin);
  const cli = join(bin, 'codex');
  writeFileSync(cli, `#!${process.execPath}\nprocess.stdin.resume();process.stdin.on('end',()=>process.exit(0));\n`);
  chmodSync(cli, 0o755);
  writeFileSync(join(target, 'spec.md'), '# Review fixture\n');
  mkdirSync(join(target, 'reviews'));
  writeFileSync(join(target, 'reviews/functional.md'), 'Verdict: VERIFIED-CLEAN\nEarlier result.\n');
  const adapter = fileURLToPath(new URL('./review-lenses.mjs', import.meta.url));
  assert.throws(() => execFileSync(process.execPath, [adapter, '--host', 'codex', '--input', 'spec.md', '--out', 'reviews', '--lenses', 'functional'], { cwd: target, env: { ...process.env, PATH: `${bin}:${process.env.PATH}` }, stdio: 'pipe' }));
  const receipt = JSON.parse(readFileSync(join(target, 'reviews/execution.json'), 'utf8'));
  assert.equal(receipt.reviews[0].exit_code, -1);
  assert.match(receipt.reviews[0].error, /no artifact/);
  assert.equal(existsSync(join(target, 'reviews/functional.md')), false);
}));
