// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync, realpathSync, symlinkSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { init, doctor, update } from './installer.mjs';
import { installContent, contentSource } from './upstream-content.mjs';
import { createUpstreamImport } from './upstream-import.mjs';
import { checkContentSetup } from './scripts/check-content-setup.mjs';

function fixture(fn) {
  const root = mkdtempSync(join(tmpdir(), 'pb-content-'));
  const upstream = join(root, 'upstream'), target = join(root, 'target');
  mkdirSync(upstream); mkdirSync(target);
  const git = (...args) => execFileSync('git', ['-C', upstream, ...args], { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] }).trim();
  git('init', '-b', 'main'); git('config', 'user.name', 'Fixture'); git('config', 'user.email', 'fixture@example.invalid');
  for (const file of contentSource.required_files) {
    mkdirSync(join(upstream, file, '..'), { recursive: true });
    writeFileSync(join(upstream, file), '# fixture\n');
  }
  writeFileSync(join(upstream, 'scripts/install-skills.py'), `import os, sys\nfrom pathlib import Path\nroot=Path(__file__).resolve().parents[1]\ntarget=Path(sys.argv[2])\nfor host in ['.agents','.claude']:\n for name,path in [('content-engine','.'),('blog','skills/blog'),('editorial-draft','skills/editorial-draft')]:\n  link=target/host/'skills'/name\n  link.parent.mkdir(parents=True,exist_ok=True)\n  if not link.is_symlink(): link.symlink_to(root/path,target_is_directory=True)\n`);
  git('add', '.'); git('commit', '-m', 'fixture');
  init({ target, brainDir:'team/brain', apply:true });
  const config = join(target,'team/brain/config.json');
  writeFileSync(config, JSON.stringify({ ...JSON.parse(readFileSync(config)), content_source:{repository:upstream,branch:'main'} }));
  try { return fn({ root, upstream, target, git }); } finally { rmSync(root,{recursive:true,force:true}); }
}

test('content preview does not install; apply links all pipeline components on both hosts', () => fixture(({target,git}) => {
  const preview=installContent(target);
  assert.equal(preview.status,'preview_only');
  assert.equal(existsSync(preview.path),false);
  const result=installContent(target,true);
  assert.equal(result.status,'installed'); assert.equal(result.revision,git('rev-parse','HEAD'));
  for(const host of ['.agents','.claude']) for(const [name,path] of Object.entries(contentSource.skills)) {
    assert.equal(realpathSync(join(target,host,'skills',name)),realpathSync(join(result.path,path)));
  }
  assert.equal(JSON.parse(doctor(target)).integrations.content.status,'installed');
}));

test('setup import oracle rejects handoff-only claims, unrelated edits and missing links', () => fixture(({target,upstream}) => {
  const configPath = join(target, 'team/brain/config.json');
  const configBefore = JSON.parse(readFileSync(configPath, 'utf8'));
  delete configBefore.content_source;
  writeFileSync(configPath, JSON.stringify(configBefore));
  const cli = join(target, 'team/brain/runtime/product-bench.mjs');
  const run = (...args) => execFileSync(process.execPath, [cli, ...args, '--target', target], {encoding:'utf8'});
  const check = (evidence = '') => checkContentSetup({target, repository:upstream, configBefore, evidence});
  assert.equal(JSON.parse(run('doctor')).integrations.content.status, 'not_configured');
  assert.ok(check().includes('Approved content source was not configured'));
  writeFileSync(configPath, JSON.stringify({...configBefore, content_source:{repository:upstream,branch:'main'}}));
  assert.equal(JSON.parse(run('content-install')).status, 'preview_only');
  assert.ok(check().includes('Content pipeline installation and native links are not verified'));
  assert.equal(JSON.parse(run('content-install','--apply')).status, 'installed');
  run('doctor');
  assert.ok(check().includes('No successful content import apply'));
  const evidence = `node ${cli} content-install --target .\nnode ${cli} content-install --target . --apply\nnode ${cli} doctor --target .`;
  assert.deepEqual(check(evidence), []);
  writeFileSync(configPath, JSON.stringify({...configBefore, content_source:{repository:upstream}}));
  assert.deepEqual(check(evidence), [], 'Omitting the optional branch must accept its main default');
  writeFileSync(configPath, JSON.stringify({...configBefore, output_dir:'wrong', content_source:{repository:upstream,branch:'main'}}));
  assert.ok(check(evidence).includes('Content setup changed unrelated configuration'));
  rmSync(join(target, '.agents/skills/editorial-draft'));
  assert.ok(check(evidence).includes('Content pipeline installation and native links are not verified'));
}));

test('content update previews then refreshes upstream; local changes and rewritten history are preserved', () => fixture(({target,upstream,git}) => {
  const first=installContent(target,true);
  writeFileSync(join(upstream,'SKILL.md'),'# new\n');git('add','.');git('commit','-m','new');
  const preview=JSON.parse(update(target,false));assert.equal(preview.integrations.content.revision,git('rev-parse','HEAD'));
  assert.equal(readFileSync(join(first.path,'SKILL.md'),'utf8'),'# fixture\n');
  assert.equal(JSON.parse(update(target,true)).integrations.content.status,'installed');
  writeFileSync(join(first.path,'SKILL.md'),'# local\n');
  assert.equal(JSON.parse(update(target,true)).integrations.content.status,'skipped');
  assert.equal(readFileSync(join(first.path,'SKILL.md'),'utf8'),'# local\n');
  execFileSync('git',['-C',first.path,'checkout','--','SKILL.md']);
  git('checkout','--orphan','replacement');git('add','.');git('commit','-m','replacement');git('branch','-M','main');
  assert.match(JSON.parse(update(target,true)).integrations.content.reason,/not a fast-forward/);
}));

test('import refuses foreign skill directories and symlinked destinations before mutation', () => fixture(({target}) => {
  const link=join(target,'.claude/skills/blog');mkdirSync(link);writeFileSync(join(link,'notes'),'mine');
  assert.throws(()=>installContent(target,true),/replaced|preserve/);
  assert.equal(existsSync(join(target,'team/brain/integrations/content-engine')),false);
  rmSync(link,{recursive:true});symlinkSync('/tmp',join(target,'team/brain/integrations'));
  assert.throws(()=>installContent(target,true),/symlink/);
}));

test('doctor detects a missing native pipeline link and update repairs it', () => fixture(({target}) => {
  installContent(target,true);
  rmSync(join(target,'.claude/skills/blog'));
  assert.equal(JSON.parse(doctor(target)).integrations.content.status,'unchecked');
  assert.equal(JSON.parse(update(target,true)).integrations.content.status,'installed');
  assert.ok(existsSync(join(target,'.claude/skills/blog/SKILL.md')));
}));

test('upgrades retire only unchanged managed legacy writing files and preserve custom edits', () => fixture(({target}) => {
  const metaPath=join(target,'.product-bench-install.json');const meta=JSON.parse(readFileSync(metaPath));
  const paths=['.agents/skills/articleforge/SKILL.md','.claude/skills/articleforge/SKILL.md','team/brain/runtime/payload/skills/articleforge/SKILL.md'];
  for(const path of paths){mkdirSync(join(target,path,'..'),{recursive:true});writeFileSync(join(target,path),'old');meta.owned[path]=createHash('sha256').update('old').digest('hex');}
  writeFileSync(metaPath,JSON.stringify(meta));writeFileSync(join(target,paths[1]),'my edit');
  update(target,false);assert.ok(paths.every(path=>existsSync(join(target,path))));
  update(target,true);
  assert.equal(existsSync(join(target,paths[0])),false);assert.equal(existsSync(join(target,paths[2])),false);
  assert.equal(readFileSync(join(target,paths[1]),'utf8'),'my edit');
  assert.equal(installContent(target,true).status, 'installed');
  assert.equal(readFileSync(join(target,paths[1]),'utf8'),'my edit');
}));

test('legacy retirement never follows an internal symlink into caller-owned files', () => fixture(({target}) => {
  const metaPath=join(target,'.product-bench-install.json');const meta=JSON.parse(readFileSync(metaPath));
  const original=join(target,'my-writing');mkdirSync(original);writeFileSync(join(original,'SKILL.md'),'old');
  symlinkSync(original,join(target,'.agents/skills/articleforge'));
  meta.owned['.agents/skills/articleforge/SKILL.md']=createHash('sha256').update('old').digest('hex');
  writeFileSync(metaPath,JSON.stringify(meta));update(target,true);
  assert.equal(readFileSync(join(original,'SKILL.md'),'utf8'),'old');
}));

test('zero-exit installer without native links fails the CLI and leaves no receipt or partial links', () => fixture(({target,upstream,git}) => {
  writeFileSync(join(upstream,'scripts/install-skills.py'),`import sys\nfrom pathlib import Path\nroot=Path(__file__).resolve().parents[1]\nlink=Path(sys.argv[2])/'.agents/skills/content-engine'\nlink.symlink_to(root,target_is_directory=True)\n`);
  git('add','.');git('commit','-m','incomplete installer');
  const cli=join(target,'team/brain/runtime/product-bench.mjs');
  let failure;try{execFileSync(process.execPath,[cli,'content-install','--target',target,'--apply'],{encoding:'utf8',stdio:'pipe'});}catch(error){failure=error;}
  assert.ok(failure,'Incomplete import must exit nonzero');assert.equal(failure.status,1);assert.match(failure.stderr,/native skill links are missing/);
  assert.equal(existsSync(join(target,'team/brain/integrations/content-engine.json')),false);
  assert.equal(existsSync(join(target,'team/brain/integrations/content-engine')),false);
  assert.equal(existsSync(join(target,'.agents/skills/content-engine')),false);
}));

test('failed native-link upgrade restores the usable checkout receipt and original link set', () => fixture(({target,upstream,git}) => {
  const first=installContent(target,true),record=join(target,'team/brain/integrations/content-engine.json'),prior=readFileSync(record,'utf8');
  writeFileSync(join(upstream,'scripts/install-skills.py'),`import sys\nfrom pathlib import Path\n(Path(sys.argv[2])/'.claude/skills/blog').unlink()\n`);
  git('add','.');git('commit','-m','broken link installer');
  assert.throws(()=>installContent(target,true),/native skill links are missing/);
  assert.equal(readFileSync(record,'utf8'),prior);assert.equal(execFileSync('git',['-C',first.path,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),first.revision);
  for(const host of ['.agents','.claude']) for(const [name,path] of Object.entries(contentSource.skills)) assert.equal(realpathSync(join(target,host,'skills',name)),realpathSync(join(first.path,path)));
  assert.equal(JSON.parse(doctor(target)).integrations.content.status,'installed');
}));

test('failed repair with a zero-exit no-op installer does not acknowledge a new revision', () => fixture(({target,upstream,git}) => {
  installContent(target,true);const record=join(target,'team/brain/integrations/content-engine.json'),prior=readFileSync(record,'utf8');
  rmSync(join(target,'.claude/skills/blog'));writeFileSync(join(upstream,'scripts/install-skills.py'),'# no-op\n');git('add','.');git('commit','-m','no-op installer');
  assert.throws(()=>installContent(target,true),/native skill links are missing/);assert.equal(readFileSync(record,'utf8'),prior);
  assert.equal(existsSync(join(target,'.claude/skills/blog')),false);
}));

test('content import exposes the editorial-draft entrypoint and its complete review resources', () => {
  assert.equal(contentSource.skills['editorial-draft'], 'skills/editorial-draft');
  assert.equal(contentSource.skills.articleforge, undefined);
  for (const resource of ['SKILL.md', 'integration-guide.md', 'reviews/clarity.md', 'references/external-content.md']) {
    assert.ok(contentSource.required_files.includes(`skills/editorial-draft/${resource}`));
  }
});


test('an existing legacy writing import upgrades to canonical links without losing its earlier links', () => fixture(({target,upstream,git}) => {
  const installerPath = join(upstream, 'scripts/install-skills.py');
  const canonicalInstaller = readFileSync(installerPath, 'utf8');
  const legacySource = {...contentSource, repository:upstream, required_files:contentSource.required_files.map(path => path.replaceAll('editorial-draft', 'articleforge'))};
  const legacySkills = {'content-engine':'.',blog:'skills/blog',articleforge:'skills/articleforge'};
  renameSync(join(upstream,'skills/editorial-draft'), join(upstream,'skills/articleforge'));
  writeFileSync(installerPath, canonicalInstaller.replaceAll('editorial-draft', 'articleforge'));
  git('add','.'); git('commit','-m','legacy writing layout');
  const legacy = createUpstreamImport(legacySource, {
    id:'content-engine',label:'Content Engine',configKey:'content_source',action:'content-install',
    installer:'scripts/install-skills.py',skills:{'.agents':legacySkills,'.claude':legacySkills},requireLinks:true
  });
  assert.throws(() => installContent(target, true), /source is missing skills\/editorial-draft/);
  const first = legacy.install(target, true, legacySource);
  renameSync(join(upstream,'skills/articleforge'), join(upstream,'skills/editorial-draft'));
  symlinkSync('editorial-draft',join(upstream,'skills/articleforge'));
  writeFileSync(installerPath, canonicalInstaller);
  git('add','.'); git('commit','-m','rename writing skill');
  const preview = installContent(target);
  assert.equal(preview.status, 'preview_only');
  assert.equal(execFileSync('git',['-C',first.path,'rev-parse','HEAD'],{encoding:'utf8'}).trim(),first.revision);
  const next = installContent(target, true);
  assert.equal(next.status,'installed');
  for (const host of ['.agents','.claude']) {
    assert.equal(realpathSync(join(target,host,'skills/editorial-draft')),realpathSync(join(next.path,'skills/editorial-draft')));
    assert.equal(realpathSync(join(target,host,'skills/articleforge')),realpathSync(join(next.path,'skills/editorial-draft')));
  }
}));
