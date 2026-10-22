// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, chmodSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { init } from './installer.mjs';
import { workflows } from './workflows.mjs';
import { functionalCases, functionalSetup } from './scripts/mode-functional-cases.mjs';

test('content fixtures supply dated independent evidence and actual approved writing sources', () => {
  const scan = functionalCases.find(c => c.id === 'content-engine--scan');
  assert.equal(scan.timeoutMs, 1200000);
  const records = scan.files['fixtures/signals.jsonl'].trim().split('\n').map(line => JSON.parse(line));
  const unique = new Map(records.map(row => [row.native_id, row]));
  for (const id of ['s1','s2','s6']) {
    const row = unique.get(id);
    assert.ok(row.excerpt.length > 30);
    assert.ok(new Date(row.published_at) <= new Date());
    assert.ok(Date.now() - new Date(row.published_at) < 7 * 86400000);
    assert.match(row.url, /^https:\/\/.*\.example\.invalid\//);
  }
  assert.notEqual(unique.get('s1').source, unique.get('s2').source);
  assert.equal(records.filter(row => row.native_id === 's1').length, 2);
  assert.equal(unique.get('s3').theme_id, 'T0');
  assert.ok(Date.now() - new Date(unique.get('s4').published_at) > 7 * 86400000);
  const brief = functionalCases.find(c => c.id === 'content-engine--write').files['fixtures/brief.md'];
  for (const id of ['s1','s2','s6']) assert.ok(brief.includes(unique.get(id).url));
  assert.match(brief, /STRONG/);
});

test('pipeline checks require successful reads of each selected upstream component', () => {
  const scenario = { required:[], requiredReads:[/blog\/SKILL\.md/, /editorial-draft\/SKILL\.md/] };
  assert.equal(checkOutput(scenario,'draft','read editorial-draft/SKILL.md').length,1);
  assert.deepEqual(checkOutput(scenario,'draft','read blog/SKILL.md\nread editorial-draft/SKILL.md'),[]);
});

test('setup import smoke case requires actual reads of all three upstream skills', () => {
  const scenario = cases.find(c => c.id === 'setup-content-import');
  assert.equal(scenario.prepare, 'content-setup');
  const answer = 'Verified installed Content Engine, Blog and Editorial Draft at recorded revision.';
  assert.equal(checkOutput(scenario, answer).length, 3);
  assert.deepEqual(checkOutput(scenario, answer, 'read content-engine/SKILL.md\nread blog/SKILL.md\nread editorial-draft/SKILL.md'), []);
});
import { cases, checkOutput, toolEvidence, codexAccessError } from './scripts/host-workflow-cases.mjs';
import { checkFunctionalArtifacts } from './scripts/check-functional-artifacts.mjs';
import { validCitationRepresentation, validSignalBank, buzzExecution } from './scripts/functional-artifacts.mjs';

test('full setup oracle requires all context, real source registry and first-spec handoff',()=> {
  const target=mkdtempSync(join(tmpdir(),'pb-setup-oracle-'));
  try {
    init({target,brainDir:'team/brain',apply:true});
    mkdirSync(join(target,'fixtures'));mkdirSync(join(target,'team/brain/outputs'));
    writeFileSync(join(target,'fixtures/setup-source.json'),functionalSetup.files['fixtures/setup-source.json']);
    writeFileSync(join(target,'fixtures/setup-context.json'),functionalSetup.files['fixtures/setup-context.json']);
    for(const [file,facts] of Object.entries(functionalSetup.setupContext))writeFileSync(join(target,'team/brain/context',file),facts);
    const cli=join(target,'team/brain/runtime/product-bench.mjs');
    execFileSync(process.execPath,[cli,'source-add','--target',target,'--file','fixtures/setup-source.json'],{cwd:target});
    writeFileSync(join(target,'team/brain/outputs/first.md'),'# Product Spec\n'+Array.from({length:8},(_,i)=>`## ${i+1}. Section\nContract\n`).join(''));
    const check=()=>checkFunctionalArtifacts({host:'claude',scenario:functionalSetup,target,artifact:'Fictional setup',evidence:`node ${cli} analytics --metric activation_rate`,transcript:''});
    assert.deepEqual(check(),[]);
    writeFileSync(join(target,'team/brain/context/users.md'),'Context not built');
    assert.ok(check().includes('Approved setup facts missing in users.md'));
    writeFileSync(join(target,'team/brain/sources.json'),JSON.stringify({schema_version:1,sources:[]}));
    assert.ok(check().includes('Approved setup source was not registered'));
  } finally {rmSync(target,{recursive:true,force:true});}
});

test('independent-review artifact oracle verifies the actual host for all required lenses',()=> {
  const target=mkdtempSync(join(tmpdir(),'pb-review-oracle-'));
  try {
    mkdirSync(join(target,'team/brain/outputs'),{recursive:true});
    const reviews=['customer','devil','functional','scope-altitude','platform-data','measurement','engineering','engineering-handoff','naive-reader','consistency','regression','legal-privacy'].map((lens,i)=>({lens,host:'claude',pid:i+1,sources:[],exit_code:0,fresh_process:true}));
    writeFileSync(join(target,'team/brain/outputs/execution.json'),JSON.stringify({concurrency:1,reviews}));
    const scenario=functionalCases.find(c=>c.id==='review-spec--default');
    assert.deepEqual(checkFunctionalArtifacts({host:'claude',scenario,target,artifact:'Findings',evidence:'node team/brain/runtime/review-lenses.mjs --host claude'}),[]);
    assert.ok(checkFunctionalArtifacts({host:'claude',scenario,target,artifact:'Findings'}).includes('No successful native reviewer adapter execution'));
    assert.ok(checkFunctionalArtifacts({host:'codex',scenario,target,artifact:'Findings'}).includes('Required real independent lens receipts incomplete'));
  } finally {rmSync(target,{recursive:true,force:true});}
});

test('Buzz classifications use selected scanner executions, not unrelated capability caveats',()=> {
  const event=(command,exit_code,aggregated_output)=>JSON.stringify({type:'item.completed',item:{type:'command_execution',command,exit_code,aggregated_output}});
  const hn=event('python buzz-scan.py --platform hn --peek',0,'Scanning Hacker News\n0 fresh candidates');
  assert.equal(buzzExecution(hn,'hn').positive_execution,'tested-empty-scan');
  assert.equal(buzzExecution(event("python -c \"subprocess.run(['python','buzz-scan.py','--platform','reddit','--peek'])\"",0,'Scanning Reddit\n0 fresh candidates\nreddit feeds: 2/2 ok'),'reddit').positive_execution,'tested-empty-scan');
  assert.equal(buzzExecution(hn+'\n'+JSON.stringify({type:'item.completed',item:{type:'agent_message',text:'PH_API_TOKEN is UNVERIFIED'}}),'hn').positive_execution,'tested-empty-scan');
  const ph=event('python buzz-ph-scan.py --peek',1,'Missing Product Hunt API token.');
  assert.equal(buzzExecution(ph,'ph').lanes[0].status,'missing-token');
  assert.equal(buzzExecution(ph,'ph').positive_execution,'unverified');
  assert.equal(buzzExecution(event('python buzz-scan.py --mode brands --peek',0,'Brand monitor:\n[reddit-brand] combined search rss failed: invalid XML'),'brands').positive_execution,'unverified');
  assert.equal(buzzExecution(event('python fixtures/transport.py buzz-scan.py --platform hn --peek',0,'SYNTHETIC HTTP TRANSPORT:\nScanning Hacker News\n1 fresh candidates'),'hn').positive_execution,'tested-synthetic-dry-run');
  assert.equal(buzzExecution(event('python buzz-ph-scan.py --peek',0,'{"exit_code":1}\nMissing Product Hunt API token.'),'ph').lanes[0].status,'missing-token');
  assert.equal(buzzExecution(event('python buzz-scan.py --platform reddit --peek',0,'Scanning Reddit\nreddit feeds: 1/2 ok'),'reddit').positive_execution,'unverified');
  const loop=event('python wrapper.py',0,[JSON.stringify({lane:'ph',argv:['python','buzz-ph-scan.py','--peek'],exit_code:1}),'Missing Product Hunt API token.',JSON.stringify({lane:'hn',argv:['python','buzz-scan.py','--platform','hn'],exit_code:0}),'Scanning Hacker News\n0 fresh candidates',JSON.stringify({lane:'reddit',argv:['python','buzz-scan.py','--platform','reddit'],exit_code:0}),'Scanning Reddit\n0 fresh candidates\nreddit feeds: 2/2 ok'].join('\n'));
  assert.deepEqual(buzzExecution(loop,'daily').lanes,[{lane:'ph',status:'missing-token'},{lane:'hn',status:'empty'},{lane:'reddit',status:'empty'}]);
  const printed=event("python -c \"script='buzz-ph-scan.py' if lane=='ph' else 'buzz-scan.py'\"",0,'ph 0 SYNTHETIC HTTP TRANSPORT: no network\nScanning Product Hunt\n1 fresh PH candidates\nhn 0 SYNTHETIC HTTP TRANSPORT: no network\nScanning Hacker News\n1 fresh candidates\nreddit 0 SYNTHETIC HTTP TRANSPORT: no network\nScanning Reddit\n1 fresh candidates\nreddit feeds: 2/2 ok');
  assert.equal(buzzExecution(printed,'daily').positive_execution,'tested-synthetic-dry-run');
  assert.equal(buzzExecution(event('python fixtures/transport.py buzz-scan.py --mode brands',0,'SYNTHETIC HTTP TRANSPORT: no network\nBrand monitor:\nours: 1 mention'),'brands').positive_execution,'tested-synthetic-dry-run');
});

test('artifact assertions accept provenance wrappers and source IDs but reject duplicate or altered records', () => {
  const row={prompt_id:'ACP-001',prompt_version:'1',first_party_cited:true,brand_mentioned:true,accuracy_status:'accurate'};
  assert.equal(validCitationRepresentation([row]),true);
  assert.equal(validCitationRepresentation([{observation:row,provenance:{}}]),true);
  assert.equal(validCitationRepresentation([row,row]),false);
  assert.equal(validCitationRepresentation([{...row,first_party_cited:false}]),false);
  const signals=[{signal_id:'SIG-001',native_id:'s1'},{signal_id:'SIG-002',native_id:'s2'}];
  assert.equal(validSignalBank(signals),true);
  assert.equal(validSignalBank([...signals,signals[0]]),false);
  assert.equal(validSignalBank([{id:'s1'},{id:'s1'}]),false);
});

test('functional matrix has an explicit case and assertions for every mode with no fallback coverage', () => {
  const expected=workflows.flatMap(w=>Object.keys(w.modes).map(mode=>`${w.name}/${mode}`)).sort();
  assert.equal(expected.length,79);
  assert.deepEqual(functionalCases.map(c=>`${c.workflow}/${c.mode}`).sort(),expected);
  assert.equal(new Set(functionalCases.map(c=>c.id)).size,79);
  for(const scenario of functionalCases){assert.ok(scenario.request.length>60,scenario.id);assert.ok(scenario.required.length,scenario.id);assert.ok(scenario.artifact,scenario.id);assert.ok(checkOutput(scenario,'Mode completed successfully.').length,scenario.id);}
  assert.ok(functionalCases.find(c=>c.id==='analytics--save').expected==='analytics-save');
  assert.ok(functionalCases.find(c=>c.id==='sync-context--default').allowedContext.includes('product.md'));
  assert.ok(functionalCases.find(c=>c.id==='blog--default').expected==='editorial');
  assert.ok(functionalCases.find(c=>c.id==='prototype--default').expected==='prototype');
});

test('real-host cases retain coverage for restored modes and only reference supported workflows', () => {
  assert.deepEqual(cases.map(({ id }) => id), ['setup-content-import', 'setup', 'spec', 'analytics', 'blog', 'battlecard', 'cluster', 'inventory', 'competitor-gaps', 'refresh-plan', 'citation', 'onboarding-plain', 'onboarding-partner', 'roadmap', 'buzz']);
  for (const scenario of cases) if (scenario.workflow === 'setup') assert.match(readFileSync(new URL('./payload/commands/pb-setup.md', import.meta.url), 'utf8'), /guided setup/);
  else assert.ok(workflows.find(({ name }) => name === scenario.workflow)?.modes[scenario.mode], scenario.id);
  assert.deepEqual(Object.keys(workflows.find(({ name }) => name === 'content-engine').modes).sort(), ['scan', 'cluster', 'brief', 'write', 'inventory', 'competitor-gaps', 'refresh-plan'].sort());
  assert.equal(workflows.some(({ name }) => name === 'prd' || name === 'review-prd'), false);
});

test('host smoke checks reject reassuring prose without actual workflow outputs', () => {
  for (const scenario of cases) assert.ok(checkOutput(scenario, 'Everything is ready and all checks passed.').length, scenario.id);
  const analytics = cases.find(({ id }) => id === 'analytics');
  const answer = 'Fictional fixture: numerator 2, denominator 3, value 2/3.';
  assert.ok(checkOutput(analytics, answer).includes('No recorded analytics CLI execution'));
  assert.deepEqual(checkOutput(analytics, answer, 'node team/brain/runtime/product-bench.mjs analytics --metric activation_rate'), []);
  const blog = cases.find(({ id }) => id === 'blog');
  const handoff = 'Editorial Draft: .agents/skills/editorial-draft/SKILL.md; outline supplied; reviewers not run.';
  assert.ok(checkOutput(blog, handoff).includes('No recorded Editorial Draft skill read'));
  assert.deepEqual(checkOutput(blog, handoff, 'read .agents/skills/editorial-draft/SKILL.md'), []);
});

test('host tool evidence requires a completed successful call, not a claim in the answer', () => {
  const command = 'node team/brain/runtime/product-bench.mjs analytics --metric activation_rate';
  const jsonl = (events) => events.map((event) => JSON.stringify(event)).join('\n');
  assert.equal(toolEvidence(jsonl([{ type: 'item.completed', item: { type: 'agent_message', text: command } }])), '');
  assert.equal(toolEvidence(jsonl([{ type: 'item.completed', item: { type: 'command_execution', command, exit_code: 1 } }])), '');
  assert.equal(toolEvidence(jsonl([{ type: 'item.completed', item: { type: 'command_execution', command, exit_code: 0 } }])), command);
  const call = { type: 'assistant', message: { content: [{ type: 'tool_use', id: 'tool-1', name: 'Read', input: { file_path: '.claude/skills/editorial-draft/SKILL.md' } }] } };
  const result = (is_error) => ({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: 'tool-1', is_error }] } });
  assert.equal(toolEvidence(jsonl([call])), '');
  assert.equal(toolEvidence(jsonl([call, result(true)])), '');
  assert.equal(toolEvidence(jsonl([call, result(false)])), 'read .claude/skills/editorial-draft/SKILL.md');
  const skill={type:'assistant',message:{content:[{type:'tool_use',id:'tool-1',name:'Skill',input:{skill:'editorial-draft'}}]}};
  assert.equal(toolEvidence(jsonl([skill,result(true)])), '');
  assert.match(toolEvidence(jsonl([skill,result(false)])), /editorial-draft\/SKILL\.md/);
});

test('Codex access errors are classified from host failure events, not artifact claims', () => {
  assert.match(codexAccessError(JSON.stringify({ type: 'turn.failed', error: { message: 'HTTP 401 Unauthorized' } })), /401/);
  assert.match(codexAccessError(JSON.stringify({ type: 'error', message: 'HTTP 403: access denied' })), /403/);
  assert.equal(codexAccessError(JSON.stringify({ type: 'item.completed', item: { type: 'agent_message', text: '401 Unauthorized' } })), '');
  assert.equal(codexAccessError(JSON.stringify({ type: 'turn.failed', error: { message: 'Unexpected internal error' } })), '');
  assert.equal(codexAccessError([JSON.stringify({ type: 'error', message: '401 Unauthorized' }), JSON.stringify({ type: 'turn.completed' })].join('\n')), '');
});

test('spec smoke rejects expanded PRD structure even when scope and reviewer caveats are present', () => {
  const scenario = cases.find(({ id }) => id === 'spec');
  const contract = '# Draft\n## 1. Problem\n## 2. Hypothesis\n## 3. Scope\nDEFERRED: collaboration until 20 teams. CUT: emails.\n## 4. Behavior\nPermission revocation denies retry; idempotent.\n## 5. Acceptance Criteria\n## 6. Success Metrics\n## 7. Constraints\n## 8. Open Decisions\nReview pending.';
  assert.deepEqual(checkOutput(scenario, contract), []);
  assert.deepEqual(checkOutput(scenario, contract.replace('20 teams', '20 distinct teams')), []);
  assert.ok(checkOutput(scenario, contract.replace('20 teams', '21 teams')).length);
  assert.ok(checkOutput(scenario, contract + '\n## 9. Milestones\n').includes('Expected 8 numbered main sections'));
});

test('battlecard checks recognize explicit competitor advantage and objection motive without fixed headings', () => {
  const scenario = cases.find(({ id }) => id === 'battlecard');
  const artifact = '30-second pitch\nCedar Tasks resumes rows. QueuePad is the better fit when offline import is required.\nFear: switching creates unnecessary work.\nProhibited claims: unsupported superiority.';
  assert.deepEqual(checkOutput(scenario, artifact), []);
  assert.ok(checkOutput(scenario, artifact.replace('QueuePad is the better fit when offline import is required.', 'Offline imports matter.')).length);
  assert.ok(checkOutput(scenario, artifact.replace('Fear: switching creates unnecessary work.', 'Response: switch now.')).length);
});

test('setup accepts the technical-area label but rejects invented installed skill counts', () => {
  const scenario = cases.find(({ id }) => id === 'setup');
  const preview = 'Product, users, competitors, stakeholders, roadmap, GTM, metrics, brand voice, decisions; fictional fixture; write a spec directly.\n| Technical | Permissions and architecture |\n20 SEO skills installed. Content Engine includes Blog and Editorial Draft; content-install is deferred.';
  assert.deepEqual(checkOutput(scenario, preview), []);
  assert.ok(checkOutput(scenario, preview.replace('20 SEO', '19 SEO')).some((failure) => failure.includes('differs from catalog')));
  assert.deepEqual(checkOutput(scenario, preview.replace('20 SEO', '**20** `seo-*`')), []);
  assert.deepEqual(checkOutput(scenario, preview.replace('Content Engine includes Blog and Editorial Draft; content-install is deferred.', 'Content Engine, Blog and Editorial Draft: unconfigured.\nContent setup offers import now or explicit deferral.')), []);
  assert.ok(checkOutput(scenario, preview.replace('20 SEO', '**19** `seo-*`')).some((failure) => failure.includes('differs from catalog')));
  assert.ok(checkOutput(scenario, preview.replace('| Technical | Permissions and architecture |', '')).length);
});

function failedWithStatusOne(error) {
  assert.equal(error.code === 'ETIMEDOUT' || Boolean(error.signal), false, `Fake-host runner did not finish within its bounded test budget: ${error.message}`);
  assert.equal(error.status, 1, `Expected access-refusal exit status 1: ${error.message}`);
  return true;
}

test('fake-host failure assertion distinguishes refusal from timeout and unexpected exit', () => {
  assert.equal(failedWithStatusOne(Object.assign(new Error('refusal'), { status: 1 })), true);
  for (const properties of [{ code: 'ETIMEDOUT', signal: 'SIGTERM', status: null }, { signal: 'SIGKILL', status: null }, { status: 2 }]) {
    assert.throws(() => failedWithStatusOne(Object.assign(new Error('synthetic runner failure'), properties)), /bounded test budget|exit status 1/);
  }
});

test('real-host runner records access refusal as blocked and does not retry every workflow', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'pb-host-blocked-'));
  try {
    const bin = join(scratch, 'bin'); mkdirSync(bin);
    const count = join(scratch, 'calls.txt');
    writeFileSync(join(bin, 'claude'), `#!${process.execPath}\nif(process.argv.includes('--version')){console.log('mock claude');process.exit(0);}require('node:fs').appendFileSync(${JSON.stringify(count)},'call\\n');process.stdin.resume();process.stdin.on('end',()=>console.log(JSON.stringify({type:'result',is_error:true,api_error_status:403,result:'Synthetic organization access refused'})));\n`);
    chmodSync(join(bin, 'claude'), 0o755);
    const out = join(scratch, 'out');
    const env = { ...process.env, PATH: `${bin}:${process.env.PATH}` };
    // This protocol test must never inherit approved live-engine sources.
    for (const key of Object.keys(env)) if (/^PB_(?:CONTENT|BUZZ)_/.test(key)) delete env[key];
    const script = fileURLToPath(new URL('./scripts/host-workflow-smoke.mjs', import.meta.url));
    assert.throws(() => execFileSync(process.execPath, [script, '--host', 'claude', '--cases', 'setup,spec,analytics', '--out', out], { env, stdio: 'pipe', timeout: 90000 }), failedWithStatusOne);
    const results = JSON.parse(readFileSync(join(out, 'results.json'))).results;
    assert.equal(results.length, 3);
    assert.ok(results.every(({ status }) => status === 'blocked'));
    assert.match(results[0].failures.join(' '), /organization access refused/);
    assert.equal(readFileSync(count, 'utf8'), 'call\n');
    assert.throws(() => execFileSync(process.execPath, [script, '--host', 'claude', '--out', out], { env, stdio: 'pipe', timeout: 30000 }), failedWithStatusOne);
    assert.equal(readFileSync(count, 'utf8'), 'call\n', 'old receipts cannot produce a second invocation or a false pass');
    for (const row of results) if (row.cwd) rmSync(row.cwd, { recursive: true, force: true });
  } finally { rmSync(scratch, { recursive: true, force: true }); }
});

for (const host of ['claude', 'codex']) test(`${host} reviewer success, cold-reader scope and skeptic execution use the native protocol`, () => {
  const target = mkdtempSync(join(tmpdir(), 'pb-host-review-'));
  try {
    init({ target, brainDir: 'team/brain', apply: true });
    const bin = join(target, 'bin'); mkdirSync(bin);
    const expected = host === 'claude' ? ['-p', '--output-format', 'json'] : ['exec', '--ephemeral', '--ignore-user-config'];
    writeFileSync(join(bin, host), `#!${process.execPath}\nconst fs=require('node:fs');const args=process.argv.slice(2);if(JSON.stringify(args.slice(0,3))!==${JSON.stringify(JSON.stringify(expected))})process.exit(12);let prompt='';process.stdin.on('data',p=>prompt+=p);process.stdin.on('end',()=>{fs.appendFileSync('argv.jsonl',JSON.stringify(args)+'\\n');const text=prompt.includes('skeptical')?'Verdict: UNVERIFIED\\nA load-bearing assumption lacks evidence.':'Verdict: VERIFIED-CLEAN\\nMock protocol result, not a real review.';${host === 'claude' ? "process.stdout.write(JSON.stringify({is_error:false,result:text}));" : "fs.writeFileSync(args[args.indexOf('-o')+1],text);process.stdout.write(JSON.stringify({type:'turn.completed'})+'\\n');"}});\n`);
    chmodSync(join(bin, host), 0o755);
    writeFileSync(join(target, 'spec.md'), '# Synthetic spec\n');
    writeFileSync(join(target, 'team/brain/context/product.md'), 'APPROVED_CONTEXT');
    writeFileSync(join(target, 'proof.md'), 'APPROVED_PROOF');
    const adapter = fileURLToPath(new URL('./review-lenses.mjs', import.meta.url));
    execFileSync(process.execPath, [adapter, '--host', host, '--input', 'spec.md', '--out', 'reviews', '--lenses', 'functional,naive-reader', '--evidence', 'proof.md', '--skeptic'], { cwd: target, env: { ...process.env, PATH: bin }, timeout: 20000 });
    const receipt = JSON.parse(readFileSync(join(target, 'reviews/execution.json')));
    assert.equal(receipt.reviews.length, 3);
    assert.equal(new Set(receipt.reviews.map(({ pid }) => pid)).size, 3);
    assert.ok(receipt.reviews.every(({ host: actual, exit_code, fresh_process }) => actual === host && exit_code === 0 && fresh_process));
    assert.deepEqual(receipt.reviews.find(({ lens }) => lens === 'naive-reader').sources, []);
    const cold = readFileSync(join(target, 'reviews/naive-reader-prompt.txt'), 'utf8');
    assert.doesNotMatch(cold, /APPROVED_CONTEXT|APPROVED_PROOF/);
    assert.match(readFileSync(join(target, 'reviews/functional-prompt.txt'), 'utf8'), /APPROVED_CONTEXT/);
    assert.match(readFileSync(join(target, 'reviews/functional-skeptic-prompt.txt'), 'utf8'), /load-bearing assumption/);
    const argv = readFileSync(join(target, 'argv.jsonl'), 'utf8').trim().split('\n').map(JSON.parse);
    for (const args of argv) if (host === 'claude') assert.ok(args.includes('--no-session-persistence') && args.includes('--strict-mcp-config'));
    else assert.ok(args.includes('read-only') && args.includes('-o'));
  } finally { rmSync(target, { recursive: true, force: true }); }
});
