// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync, renameSync, symlinkSync, lstatSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { init, update, uninstall, doctor } from './installer.mjs';
import { addSource, stageObservation, syncStatus, pullLocalSource } from './sync-state.mjs';
import { analyticsQuery, queryFixture } from './analytics.mjs';

function fixture(fn) {
  const root = mkdtempSync(join(tmpdir(), 'pb-launch-contract-'));
  const target = join(root, 'target'); mkdirSync(target);
  try { return fn({root,target}); } finally { rmSync(root,{recursive:true,force:true}); }
}
function installed(target) { init({target,brainDir:'team/brain',apply:true}); }
function tree(root) {
  return Object.fromEntries(readdirSync(root,{recursive:true,withFileTypes:true}).filter(e=>!e.isDirectory()).map(e=>{
    const path=join(e.parentPath,e.name); return [path.slice(root.length),e.isSymbolicLink()?'link':readFileSync(path).toString('base64')];
  }));
}
for(const ancestor of [false,true]) test(`upgrades and removals preserve internally symlinked managed ${ancestor?'ancestor':'leaf'} paths`,()=>fixture(({target})=>{
  installed(target);
  const dest='.claude/commands/pb-idea.md', out=join(target,dest), original=join(target,'team-owned');
  if(ancestor) renameSync(dirname(out),original); else {mkdirSync(original);renameSync(out,join(original,'pb-idea.md'));}
  symlinkSync(ancestor?original:join(original,'pb-idea.md'),ancestor?dirname(out):out);
  const old='old managed bytes\n'; writeFileSync(join(original,'pb-idea.md'),old);
  const metadata=join(target,'.product-bench-install.json'), config=JSON.parse(readFileSync(metadata));
  config.owned[dest]=createHash('sha256').update(old).digest('hex');writeFileSync(metadata,JSON.stringify(config));
  assert.ok(JSON.parse(update(target,false)).skipped.includes(dest));
  assert.ok(JSON.parse(update(target,true)).skipped.includes(dest));
  assert.equal(readFileSync(join(original,'pb-idea.md'),'utf8'),old);
  assert.ok(JSON.parse(uninstall(target,true)).retained.includes(dest));
  assert.equal(readFileSync(join(original,'pb-idea.md'),'utf8'),old);
}));
for(const host of ['claude','codex']) for(const bad of [null,{hooks:[null]}, {hooks:{}}, {hooks:[{command:12}]}]) test(`hook preflight rejects malformed ${host} ${JSON.stringify(bad)} without partial lifecycle changes`,()=>fixture(({target})=>{
  const path=join(target,host==='claude'?'.claude/settings.json':'.codex/hooks.json'),event=host==='claude'?'UserPromptSubmit':'SessionStart';
  mkdirSync(dirname(path),{recursive:true});writeFileSync(path,JSON.stringify({hooks:{[event]:[bad]}}));
  const before=tree(target);assert.throws(()=>init({target,brainDir:'team/brain',apply:true}),/host.*hooks|host.*settings/);assert.deepEqual(tree(target),before);
  rmSync(path);installed(target);writeFileSync(path,JSON.stringify({hooks:{[event]:[bad]}}));
  const prior=tree(target);assert.throws(()=>update(target,true),/host.*hooks|host.*settings/);assert.deepEqual(tree(target),prior);
  assert.throws(()=>uninstall(target,true),/host.*hooks|host.*settings/);assert.deepEqual(tree(target),prior);
}));
test('partial fetch invalidates health only while malformed complete batches preserve state',()=>fixture(({target})=>{
  installed(target);addSource(target,{id:'notes',kind:'manual',targets:['product.md']});
  stageObservation(target,{source_id:'notes',cursor:'complete',complete:true,items:[{object_id:'n',version:'1',target:'product.md',citation:'manual:n',summary:'Review'}]});
  const before=syncStatus(target);assert.throws(()=>stageObservation(target,{source_id:'notes',complete:false,items:[]}),/complete|partial/);
  const after=syncStatus(target);assert.equal(after.sources[0].state.last_checked_at,null);
  assert.deepEqual(after.proposals,before.proposals);assert.equal(after.sources[0].state.observed_cursor,'complete');assert.equal(after.sources[0].state.reviewed_cursor,before.sources[0].state.reviewed_cursor);
  assert.equal(JSON.parse(doctor(target)).sources[0].status,'unchecked');
  stageObservation(target,{source_id:'notes',cursor:'ok',complete:true,items:[]});const healthy=readFileSync(join(target,'team/brain/state/sync.json'),'utf8');
  assert.throws(()=>stageObservation(target,{source_id:'notes',cursor:'bad',complete:true,items:[{}]}));assert.equal(readFileSync(join(target,'team/brain/state/sync.json'),'utf8'),healthy);
}));
for(const kind of ['repo','local']) test(`${kind} source ancestor replacement is rejected and direct approved reads remain valid`,()=>fixture(({root,target})=>{
  installed(target);const directory=join(target,'notes');mkdirSync(directory);writeFileSync(join(directory,'note.md'),'first');
  addSource(target,{id:'notes',kind,scope:'reviewed notes',paths:[kind==='repo'?'notes/note.md':join(directory,'note.md')],targets:['product.md']});
  pullLocalSource(target,'notes');const prior=syncStatus(target);
  renameSync(directory,join(target,'moved'));symlinkSync(join(target,'moved'),directory);
  assert.throws(()=>pullLocalSource(target,'notes'),/symlink|escapes/i);
  const after=syncStatus(target);assert.equal(after.sources[0].state.last_checked_at,null);assert.equal(after.sources[0].state.observed_cursor,prior.sources[0].state.observed_cursor);
  const external=join(root,'approved.md');writeFileSync(external,'approved');addSource(target,{id:'direct',kind:'local',scope:'approved file',paths:[external],targets:['product.md']});
  assert.equal(pullLocalSource(target,'direct').added,1);
  addSource(target,{id:'missing',kind:'local',scope:'future file',paths:[join(root,'missing.md')],targets:['product.md']});
}));
test('installed analytics fixture rejects external links while low-level fixture API permits explicit roots',async()=>{
  const root=mkdtempSync(join(tmpdir(),'pb-fixture-contract-'));const target=join(root,'target');mkdirSync(target);
  try{installed(target);const external=join(root,'fixture');mkdirSync(join(external,'analytics'),{recursive:true});writeFileSync(join(external,'analytics/example-events.json'),'[]');
    const input=join(target,'team/brain/analytics/example-events.json');rmSync(input);symlinkSync(join(external,'analytics/example-events.json'),input);
    assert.equal(queryFixture(external,{metric:'event_count'}).value,0);
    await assert.rejects(analyticsQuery(target,{metric:'event_count'}),/symlink|escapes/i);
  }finally{rmSync(root,{recursive:true,force:true});}
});
test('doctor reports hook health and update deliberately repairs registration without changing unrelated settings',()=>fixture(({target})=>{
  installed(target);assert.equal(JSON.parse(doctor(target)).hooks.claude.status,'registered');
  const claude=join(target,'.claude/settings.json'),codex=join(target,'.codex/hooks.json');
  const unrelated={permissions:{allow:['Read']},hooks:{UserPromptSubmit:[{hooks:[{type:'command',command:'echo custom'}]}]}};
  writeFileSync(claude,JSON.stringify(unrelated));rmSync(codex);
  const report=JSON.parse(doctor(target));assert.equal(report.ready,true);assert.equal(report.hooks.claude.status,'missing');assert.equal(report.hooks.codex.status,'missing');
  const before=tree(target),preview=JSON.parse(update(target,false));assert.ok(preview.changed.includes('.claude/settings.json'));assert.deepEqual(tree(target),before);
  update(target,true);const next=JSON.parse(readFileSync(claude));assert.deepEqual(next.permissions,unrelated.permissions);assert.deepEqual(next.hooks.UserPromptSubmit[0],unrelated.hooks.UserPromptSubmit[0]);
  assert.equal(JSON.parse(doctor(target)).hooks.codex.status,'registered');assert.deepEqual(JSON.parse(update(target,false)).changed,[]);
}));

test('hook removal preserves unrelated prompt hooks and files without an owned registration',()=>fixture(({target})=>{
  installed(target);const path=join(target,'.claude/settings.json');
  const settings={permissions:{allow:['Read']},hooks:{UserPromptSubmit:[{matcher:'custom',hooks:[{type:'prompt',prompt:'Review the request'}]}]}};
  const contents=JSON.stringify(settings);writeFileSync(path,contents);
  uninstall(target,true);assert.equal(readFileSync(path,'utf8'),contents);
}));

test('macOS standard /tmp source alias remains a supported direct approved path',()=>fixture(({target})=>{
  installed(target);
  // Other platforms use their actual temporary root. macOS explicitly exercises
  // /tmp, whose system symlink is distinct from a user-controlled ancestor.
  const temporary=mkdtempSync(join(process.platform==='darwin'?'/tmp':tmpdir(),'pb-source-alias-'));
  try{const file=join(temporary,'note.md');writeFileSync(file,'reviewed fixture');
    addSource(target,{id:'alias',kind:'local',scope:'approved file',paths:[file],targets:['product.md']});
    assert.equal(pullLocalSource(target,'alias').added,1);
  }finally{rmSync(temporary,{recursive:true,force:true});}
}));
