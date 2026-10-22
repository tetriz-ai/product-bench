// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
// Opt-in real model execution; never runs from npm test or CI automatically.
import { spawn, execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { init } from '../installer.mjs';
import { cases, checkOutput, toolEvidence, codexAccessError } from './host-workflow-cases.mjs';
import { functionalCases, functionalSetup } from './mode-functional-cases.mjs';
import { buzzExecution } from './functional-artifacts.mjs';
import { checkFunctionalArtifacts } from './check-functional-artifacts.mjs';
import { checkContentSetup } from './check-content-setup.mjs';

const args = process.argv.slice(2);
if (args.includes('--help')) {
  console.log('Usage: node scripts/host-workflow-smoke.mjs --host claude|codex|both --out DIRECTORY [--suite smoke|functional] [--parallel 1..4] [--cases IDS]\nOpt-in paid host execution using fictional fixtures; receipts and temporary installs are retained in --out. Functional includes every mode plus setup.');
  process.exit(0);
}
if (args.length % 2 || args.some((v, i) => i % 2 === 0 && !['--host', '--out', '--cases', '--suite', '--parallel'].includes(v))) throw new Error('Use --help for supported options');
const options = Object.fromEntries(Array.from({ length: args.length / 2 }, (_, i) => [args[i * 2], args[i * 2 + 1]]));
if (!['claude', 'codex', 'both'].includes(options['--host']) || !options['--out']) throw new Error('--host and --out are required');
const suite = options['--suite'] || 'smoke';
if (!['smoke','functional'].includes(suite)) throw new Error('Unknown suite');
const catalog = suite === 'functional' ? [functionalSetup,...functionalCases] : cases;
const concurrency = Number(options['--parallel'] || '1');
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 4) throw new Error('--parallel must be 1..4');
const selected = options['--cases'] ? options['--cases'].split(',') : catalog.filter(c => c.prepare !== 'content-setup' || process.env.PB_CONTENT_REPOSITORY).map(({ id }) => id);
if (!selected.length || new Set(selected).size !== selected.length || selected.some((id) => !catalog.some((c) => c.id === id))) throw new Error('Unknown or duplicate case');
const out = resolve(options['--out']);
mkdirSync(out, { recursive: true });
if (readdirSync(out).length) throw new Error('--out must be empty; previous receipts must not be reused');
const repo = fileURLToPath(new URL('../', import.meta.url));
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim();
const dirty = !!execFileSync('git', ['status', '--porcelain'], { cwd: repo, encoding: 'utf8' }).trim();
const results = [];
function contextSnapshot(target, allowed=[]) {
  const dir = join(target, 'team/brain/context');
  return JSON.stringify(readdirSync(dir).filter(file=>!allowed.includes(file)).sort().map((file) => [file, createHash('sha256').update(readFileSync(join(dir, file))).digest('hex')]));
}
const tasks=[], blockedHosts=new Set();
for (const host of options['--host'] === 'both' ? ['claude', 'codex'] : [options['--host']]) {
  let version;
  try { version = execFileSync(host, ['--version'], { encoding: 'utf8' }).trim(); }
  catch { results.push({ host, status: 'blocked', error: 'Host CLI unavailable' }); continue; }
  for (const scenario of catalog.filter(({ id }) => selected.includes(id))) tasks.push({host,scenario,version});
}
async function runCase({host,scenario,version}) {
    if (blockedHosts.has(host)) {results.push({host,case:scenario.id,status:'blocked',failures:['Host access blocked; not attempted']});return;}
    const contentSetup = scenario.prepare === 'content-setup';
    if (contentSetup && !process.env.PB_CONTENT_REPOSITORY) {
      results.push({host,case:scenario.id,status:'blocked',failures:['Set PB_CONTENT_REPOSITORY to the approved Content Engine source; setup import was not attempted']});return;
    }
    const folder = join(out, `${host}-${scenario.id}`); mkdirSync(folder);
    const target = mkdtempSync(join(tmpdir(), `pb-${host}-${scenario.id}-`));
    init({ target, brainDir: 'team/brain', apply: true });
    const today = new Date().toISOString().slice(0, 10);
    for (const name of readdirSync(join(target, 'team/brain/context'))) {
      writeFileSync(join(target, 'team/brain/context', name), `# ${name.replace('.md', '')}\nLast updated: ${today}\n\nFictional approved test evidence: Cedar Tasks is a shared checklist product for operations leads. It preserves completed import rows and resumes pending rows. No offline mode or AI classification. Voice: plain, concrete, calm; no invented statistics, brand colors or fonts. No live integrations are verified. No independent review has run.\n`);
    }
    for (const [file, content] of Object.entries(scenario.files || {})) {
      mkdirSync(dirname(join(target,file)), { recursive: true });
      writeFileSync(join(target, file), content);
    }
    const cli=join(target,'team/brain/runtime/product-bench.mjs');
    const local=(...args)=>execFileSync(process.execPath,[cli,...args,'--target',target],{cwd:target,encoding:'utf8'});
    const configBefore = JSON.parse(readFileSync(join(target, 'team/brain/config.json'), 'utf8'));
    if (process.env.PB_CONTENT_REPOSITORY && !contentSetup) {
      const cfgPath=join(target,'team/brain/config.json'), cfg=JSON.parse(readFileSync(cfgPath,'utf8'));
      cfg.content_source={repository:process.env.PB_CONTENT_REPOSITORY,branch:process.env.PB_CONTENT_BRANCH||'main'};
      writeFileSync(cfgPath,JSON.stringify(cfg,null,2)); local('content-install','--apply');
    }
    if(scenario.prepare==='analytics') local('analytics-save','--file','fixtures/definition.json');
    if(scenario.prepare==='source') local('source-add','--file','fixtures/source.json');
    if(scenario.prepare==='buzz') {
      const cfgPath=join(target,'team/brain/config.json'),cfg=JSON.parse(readFileSync(cfgPath,'utf8'));cfg.buzz_source={repository:process.env.PB_BUZZ_REPOSITORY,branch:'main'};writeFileSync(cfgPath,JSON.stringify(cfg,null,2));local('buzz-install','--apply');
      if(process.env.PB_BUZZ_FIXTURE==='1') {
        writeFileSync(join(target,'fixtures/buzz-fixture-transport.py'),readFileSync(join(repo,'scripts/buzz-fixture-transport.py')));
        writeFileSync(join(target,'fixtures/buzz-thread.txt'),'SYNTHETIC captured thread, approved for drafting tests; no live post exists.\nOriginal question: How do you resume a CSV import without duplicating completed rows? Row A completed and B failed. I track row IDs before retrying B. How do you handle revoked import permissions?\nReply 1: Keep a durable completed-row checkpoint and check permission before every retry.\nReply 2: CSV row numbers can shift after edits, so I use stable IDs.\nOpen follow-up from original poster: What is the smallest recovery check I can test before adding a queue?\n');
      }
      if(scenario.mode!=='init') {
        const engine=join(target,'team/brain/integrations/buzz-engine');mkdirSync(join(target,'buzz'),{recursive:true});
        const prep=`import yaml,sys\np=sys.argv[1]; c=yaml.safe_load(open(p)); c['product'].update(name='Cedar Tasks',never_mention=['Cedar Tasks'],own_domains=['cedar.example.invalid'],relevance_pillars=['CSV imports','import recovery']);c['state']['commit']='none';c['slack'].update(channel_id='TEST_NO_DELIVERY',channel_name='test-no-delivery');c['schedule']['weekdays_only']=False;c['keywords']={'precise':['CSV import'],'broad':['data import'],'watch':[],'persona_pain':['interrupted imports']};c['subreddits']=[{'name':'programming','tier':1,'barrier':'low'}];c['brand_monitor'].update(our_brand='ours',brands={'ours':['Cedar Tasks'],'competitor':['QueuePad']});yaml.safe_dump(c,open(sys.argv[2],'w'),sort_keys=False)\n`;
        execFileSync(process.env.PB_RENDERER_PYTHON||'python3',['-c',prep,join(engine,'templates/buzz.config.yaml'),join(target,'buzz/config.yaml')]);
        writeFileSync(join(target,'buzz/voice.md'),readFileSync(join(engine,'templates/voice.md'),'utf8')+'\nProject voice: plain, concrete and helpful. Never mention Cedar Tasks or its domain in community drafts.\n');
      }
    }
    const contextBefore = contextSnapshot(target,scenario.allowedContext);
    const functionalInstructions = `This is a functional test, not an inline preview. All fixture data is fictional and approved. Execute the selected mode and save the main artifact at team/brain/outputs/artifact.md. Where the request says outputs/, use team/brain/outputs/. Writing artifacts there is authorized; writing fixture context is authorized ONLY for ${JSON.stringify(scenario.allowedContext||[])} with the exact supplied facts, after displaying the proposed diff. Preserve other context and input files. Read the actual installed skills. No network research, delivery, scheduling, Git writes or credential inspection, except explicitly authorized Buzz public scanner reads. Required fresh reviewer CLI calls are authorized for review-spec; required upstream humanizers are authorized for Buzz. Editorial personas run in this session and must be labeled as such. Available Python: ${process.env.PB_RENDERER_PYTHON||'python3'}. For rendering use that interpreter and actual installed renderer skills/Playwright, not a mock. Answer with artifact paths and real execution status; do not stop at an outline or handoff unless this mode explicitly requires a proposal/interview. Unavailable required integrations remain UNVERIFIED.\n`;
    // A changed context is team-owned and must stay intact throughout evaluation.
    const command = host === 'claude' ? `/pb-${scenario.workflow}` : `Read .codex/commands/pb-${scenario.workflow}.md and follow it.`;
    const fixtureBuzz = scenario.prepare==='buzz'&&process.env.PB_BUZZ_FIXTURE==='1' ? '\nSupplemental positive-path test: ALL candidates and network responses are SYNTHETIC. Execute the unmodified upstream scanner through fixtures/buzz-fixture-transport.py: Python fixtures/buzz-fixture-transport.py <upstream scanner path> <normal scanner arguments>. This replaces HTTP transport only and blocks undeclared URLs. Never invoke scanners directly or make live network calls. Ground drafts in fixtures/buzz-thread.txt and the supplied synthetic candidate text; no real post exists at these fixture URLs. Run actual judging, native humanizers where required, saved drafts and digest, including an actual PDF for daily. Label all artifacts SYNTHETIC; no live-provider verification or delivery is claimed.\n' : '';
    const setupInstructions = `Approved dependency source: ${JSON.stringify({repository:process.env.PB_CONTENT_REPOSITORY,branch:process.env.PB_CONTENT_BRANCH||'main'})}. Run the installed setup's content capability step in this temporary project. You may edit only content_source in the brain config and use the installed content-install preview/apply CLI. Git fetching/cloning that approved source and invoking its installer are authorized. Preserve company context and all other config. Read the linked native skills with tools. Answer inline in at most 900 words with real status; do not execute their writing or scanning workflows. No credential inspection, external delivery, scheduling, publication, commits or delegated agents.`;
    const prompt = `${command} ${scenario.mode === 'default' ? '' : scenario.mode}\n${scenario.request}${fixtureBuzz}\n\n${contentSetup?setupInstructions:suite==='functional'?functionalInstructions:'This is an authorized smoke test using only fictional data in this temporary repository. Resolve the custom brain directory from installation metadata. Run preamble checks and read required local instructions using tools. Answer inline in at most 900 words, do not write files. No browser/network research, external delivery, installs, credential inspection, Git writes, or delegated agents. For editorial personas label a same-session review honestly. Respect the requested stopping point; do not ask for permission already given or claim unexecuted reviews/tools.'}\n`;
    writeFileSync(join(folder, 'prompt.txt'), prompt);
    const argv = host === 'claude'
      ? ['-p', '--output-format', 'stream-json', '--verbose', '--no-session-persistence', '--setting-sources', 'project', '--strict-mcp-config', '--mcp-config', '{"mcpServers":{}}', '--tools', suite==='functional'?'Read,Bash,Skill,Write,Edit,Agent':contentSetup?'Read,Bash,Write,Edit':'Read,Bash,Skill', '--allowedTools', 'Read', 'Bash(node *)', 'Skill', ...(suite==='functional'||contentSetup?['Write','Edit','Bash(python*)',`Bash(${process.env.PB_RENDERER_PYTHON||'python3'} *)`]:[]), ...(scenario.prepare==='buzz'?['Agent','--plugin-dir',join(target,'team/brain/integrations/buzz-engine')]:[]), '--max-budget-usd', '1.50']
      : ['exec', '--ephemeral', '--ignore-user-config', '--skip-git-repo-check', ...(suite==='functional'||contentSetup?['--approve-for-me']:['-s','read-only']), '-c', 'model_reasoning_effort="medium"', '--json', '-o', join(folder, 'answer.md'), '-'];
    const started = new Date().toISOString();
    console.log(`${host}/${scenario.id}: starting`);
    const result = await new Promise((done) => {
      const child = spawn(host, argv, { cwd: target, env: { ...process.env, CLAUDECODE: '' }, stdio: ['pipe', 'pipe', 'pipe'] });
      let stdout = '', stderr = '', timedOut = false;
      child.stdin.on('error', () => {}); child.stdin.end(prompt);
      child.stdout.on('data', (part) => { stdout += part; writeFileSync(join(folder, 'transcript.jsonl'), stdout); });
      child.stderr.on('data', (part) => { stderr += part; writeFileSync(join(folder, 'stderr.log'), stderr); });
      let killTimer;
      const timer = setTimeout(() => { timedOut = true; child.kill('SIGTERM'); killTimer = setTimeout(() => child.kill('SIGKILL'), 5000); }, scenario.timeoutMs || (scenario.expected==='review'?1200000:suite==='functional'?600000:300000));
      child.on('error', (error) => { clearTimeout(timer); clearTimeout(killTimer); done({ code: -1, error: error.message, stdout }); });
      child.on('close', (code) => { clearTimeout(timer); clearTimeout(killTimer); done({ code, stdout, timedOut }); });
    });
    let answer = '', blocked = false;
    try {
      if (host === 'claude') {
        const terminal = result.stdout.split('\n').filter(Boolean).map((line) => JSON.parse(line)).findLast((event) => event.type === 'result');
        if (!terminal || terminal.is_error) {
          blocked = terminal?.api_error_status === 401 || terminal?.api_error_status === 403;
          throw new Error(terminal?.result || 'Missing host result');
        }
        answer = terminal.result || ''; writeFileSync(join(folder, 'answer.md'), answer);
      } else {
        const accessError = codexAccessError(result.stdout);
        if (accessError) { blocked = true; throw new Error(accessError); }
        answer = readFileSync(join(folder, 'answer.md'), 'utf8');
      }
    } catch (error) { result.error = error.message; }
    let evidence = '';
    try { evidence = toolEvidence(result.stdout); } catch (error) { result.error ||= `Invalid host transcript: ${error.message}`; }
    let artifact=answer;
    if(scenario.artifact) try{artifact=readFileSync(join(target,'team/brain/outputs/artifact.md'),'utf8');}catch{artifact='';result.error||='Main artifact was not written';}
    const failures = blocked ? [] : checkOutput(scenario, artifact, evidence);
    if (contentSetup) {
      try { failures.push(...checkContentSetup({target,repository:process.env.PB_CONTENT_REPOSITORY,branch:process.env.PB_CONTENT_BRANCH||'main',configBefore,evidence})); }
      catch (error) { failures.push(`Content setup verification failed: ${error.message}`); }
    }
    if (contextBefore !== contextSnapshot(target,scenario.allowedContext)) failures.push('Host changed protected context');
    if(suite==='functional') failures.push(...checkFunctionalArtifacts({host,scenario,target,folder,repo,evidence,artifact,transcript:result.stdout,local}));
    for (const [file, original] of Object.entries(scenario.files || {})) {
      try { if (readFileSync(join(target, file), 'utf8') !== original) failures.push(`Host changed supplied ${file} during a planning-only test`); }
      catch { failures.push(`Host removed supplied ${file}`); }
    }
    if (result.code !== 0 || result.error || result.timedOut || !answer.trim()) failures.unshift(result.timedOut ? 'Host execution timed out' : result.error || `Host exit ${result.code}`);
    const buzz=scenario.expected==='buzz'?buzzExecution(result.stdout,scenario.mode):null;
    const positive=buzz?.positive_execution||scenario.positive||'tested';
    const receipt = { host, case: scenario.id, workflow: scenario.workflow, mode: scenario.mode, suite, version, revision, dirty_tree: dirty, cwd: target, started_at: started, finished_at: new Date().toISOString(), exit_code: result.code, status: blocked ? 'blocked' : failures.length ? 'failed' : 'passed', positive_execution:positive, ...(buzz?{buzz_lanes:buzz.lanes}:{}), failures };
    results.push(receipt); writeFileSync(join(folder, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
    writeFileSync(join(out, 'results.json'), JSON.stringify({ revision, dirty_tree: dirty, results }, null, 2) + '\n');
    console.log(`${host}/${scenario.id}: ${receipt.status}${failures.length ? ` (${failures.join('; ')})` : ''}`);
    if (blocked) {
      blockedHosts.add(host);
    }
}
let cursor=0;
await Promise.all(Array.from({length:concurrency},async()=>{while(cursor<tasks.length)await runCase(tasks[cursor++]);}));
writeFileSync(join(out, 'results.json'), JSON.stringify({ revision, dirty_tree: dirty, results }, null, 2) + '\n');
if (results.some(({ status }) => status !== 'passed')) process.exitCode = 1;
