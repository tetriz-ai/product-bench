// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
// Independent host CLI reviews. Every lens starts a fresh process with no prior conversation.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { defaultLenses, lensMandates, skepticLenses, reviewPrompt } from './review-prompts.mjs';
const args = process.argv.slice(2);
const option = (key, fallback) => args.includes(key) ? args[args.indexOf(key) + 1] : fallback;
const host = option('--host');
const input = resolve(option('--input'));
const out = resolve(option('--out'));
const concurrency = Number(option('--parallel', '1'));
if (!['claude', 'codex'].includes(host) || !Number.isInteger(concurrency) || concurrency < 1 || concurrency > 7) throw new Error('Use --host claude|codex --input FILE --out DIRECTORY --parallel 1..7');
mkdirSync(out, { recursive: true });
const brain = JSON.parse(readFileSync('.product-bench-install.json', 'utf8')).brain_dir;
const lenses = option('--lenses', defaultLenses.join(',')).split(',');
if (!lenses.length || new Set(lenses).size !== lenses.length || lenses.some((lens) => !lensMandates[lens])) throw new Error('Use --lenses with unique supported lens names');
const evidencePaths = args.flatMap((value, index) => value === '--evidence' ? [args[index + 1]] : []);
if (evidencePaths.some((path) => !path || path.startsWith('--'))) throw new Error('--evidence requires a file path');
// Read only declared company context and explicitly supplied task evidence.
const contextNames = ['product.md', 'users.md', 'metrics.md', 'technical-constraints.md', 'command-learnings.md', 'brand-voice.md', 'decisions-log.md'];
if (lenses.some((lens) => ['gtm', 'executive', 'customer'].includes(lens))) contextNames.push('gtm.md', 'stakeholders.md', 'competitors.md');
const paths = [...new Set([...contextNames.map((name) => join(brain, 'context', name)).filter(existsSync), ...evidencePaths])];
const sources = lenses.every((lens) => lens === 'naive-reader') ? [] : paths.map((path) => ({ path, content: readFileSync(path, 'utf8') }));
const artifact = readFileSync(input, 'utf8');
const skepticRequested = args.includes('--skeptic');
const jobs = lenses.map((lens) => ({ lens, phase: 'review' }));
const receipts = [];
let cursor = 0;
async function worker() {
  while (cursor < jobs.length) {
    const { lens, phase } = jobs[cursor++];
    const name = phase === 'skeptic' ? `${lens}-skeptic` : lens;
    if (resolve(join(out, `${name}.md`)) === input) throw new Error('Review output would overwrite the input artifact');
    // A rerun must not reuse an old result when the current CLI returns no file.
    for (const suffix of ['.md', '-transcript.jsonl', '-stderr.log']) rmSync(join(out, `${name}${suffix}`), { force: true });
    const prompt = reviewPrompt(lens, artifact, sources, phase === 'skeptic');
    writeFileSync(join(out, `${name}-prompt.txt`), prompt);
    const cliArgs = host === 'claude' ? ['-p', '--output-format', 'json', '--no-session-persistence', '--setting-sources', '', '--strict-mcp-config', '--mcp-config', '{"mcpServers":{}}', '--tools', ''] : ['exec', '--ephemeral', '--ignore-user-config', '--skip-git-repo-check', '-s', 'read-only', '--json', '-o', join(out, `${name}.md`), '-'];
    const started = new Date().toISOString();
    const result = await new Promise((done) => {
      const child = spawn(host, cliArgs, { stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, CLAUDECODE: '' } });
      child.stdin.on('error', () => {}); child.stdin.end(prompt);
      let stdout = '', stderr = '';
      child.stdout.on('data', (data) => { stdout += data; writeFileSync(join(out, `${name}-transcript.jsonl`), stdout); });
      child.stderr.on('data', (data) => { stderr += data; writeFileSync(join(out, `${name}-stderr.log`), stderr); });
      const timer = setTimeout(() => child.kill('SIGTERM'), 240000);
      child.on('error', (error) => { clearTimeout(timer); done({ code: -1, pid: child.pid, error: error.message, stdout }); });
      child.on('close', (code) => { clearTimeout(timer); done({ code, pid: child.pid, stdout }); });
    });
    if (host === 'claude' && result.code === 0) {
      try { const terminal = JSON.parse(result.stdout); if (terminal.is_error) result.code = -1; else writeFileSync(join(out, `${name}.md`), terminal.result); }
      catch (error) { result.code = -1; result.error = error.message; }
    }
    const resultPath = join(out, `${name}.md`);
    if (result.code === 0 && (!existsSync(resultPath) || !readFileSync(resultPath, 'utf8').trim())) {
      result.code = -1; result.error = 'Reviewer returned no artifact';
    }
    if (phase === 'review' && skepticRequested && skepticLenses.has(lens) && result.code === 0 && /^Verdict:\s*VERIFIED-CLEAN\s*$/m.test(readFileSync(resultPath, 'utf8'))) jobs.push({ lens, phase: 'skeptic' });
    receipts.push({ lens, phase, sources: lens === 'naive-reader' ? [] : sources.map((source) => source.path), host, pid: result.pid, started_at: started, finished_at: new Date().toISOString(), exit_code: result.code, error: result.error, fresh_process: true, artifact: `${name}.md` });
    writeFileSync(join(out, 'execution.json'), JSON.stringify({ schema_version: 1, input, concurrency, skeptic_requested: skepticRequested, sources: sources.map((source) => source.path), reviews: receipts }, null, 2) + '\n');
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
if (receipts.some((row) => row.exit_code !== 0)) process.exitCode = 1;
console.log(JSON.stringify({ completed: receipts.filter((row) => row.exit_code === 0).length, planned: jobs.length, out }));
