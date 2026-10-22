// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { init, doctor, update, uninstall, sharePreview } from './installer.mjs';
import { addSource, stageObservation, decideProposal, syncStatus, pullLocalSource } from './sync-state.mjs';
import { readFileSync } from 'node:fs';
import { analyticsQuery, saveAnalyticsDefinition, listAnalyticsDefinitions, runAnalyticsDefinition, runAnalyticsDashboard } from './analytics.mjs';
import { installBuzz } from './upstream-buzz.mjs';
import { installContent } from './upstream-content.mjs';

function parse(args) {
  const [action = 'help', ...rest] = args;
  const supported = {
    help: [], init: ['brain-dir', 'yes'], doctor: [], update: ['apply'], uninstall: ['yes'],
    share: ['files', 'apply', 'reviewed'], 'buzz-install': ['apply'], 'content-install': ['apply'], 'source-add': ['file'],
    'source-pull': ['id'], 'sync-stage': ['file'], 'sync-decide': ['id', 'decision', 'applied'],
    'sync-status': [], analytics: ['metric', 'provider', 'sql', 'sql-file', 'from', 'to', 'account'],
    'analytics-save': ['file'], 'analytics-list': [], 'analytics-run': ['name', 'from', 'to', 'account'],
    'analytics-dashboard': ['file', 'from', 'to', 'account']
  };
  if (!Object.hasOwn(supported, action)) throw new Error(`Unknown action: ${action}`);
  const options = {};
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (!arg.startsWith('--')) throw new Error(`Unexpected argument: ${arg}`);
    const key = arg.slice(2);
    if (!['target', 'json', ...supported[action]].includes(key)) throw new Error(`Unsupported option for ${action}: ${arg}`);
    if (['yes', 'json', 'apply', 'applied', 'reviewed'].includes(key)) options[key] = true;
    else {
      if (!rest[i + 1] || rest[i + 1].startsWith('--')) throw new Error(`Missing value for ${arg}`);
      options[key] = rest[++i];
    }
  }
  return { action, options };
}

async function ask(question) {
  if (!stdin.isTTY) throw new Error('Use --yes for a non-interactive install');
  const rl = createInterface({ input: stdin, output: stdout });
  try { return await rl.question(question); }
  finally { rl.close(); }
}

export async function run(args) {
  const { action, options } = parse(args);
  if (action === 'help') {
    stdout.write('Usage: product-bench <init|doctor|update|uninstall|share|buzz-install|content-install|source-add|source-pull|sync-stage|sync-decide|sync-status|analytics|analytics-save|analytics-list|analytics-run|analytics-dashboard> [--target DIR] [options]\n');
    stdout.write('Use --target DIR for an installed repository. init: --brain-dir DIR --yes; update: --apply; uninstall: --yes.\nSources: --file JSON or --id SOURCE; sync-decide: --id PROPOSAL --decision accepted|rejected [--applied].\nAnalytics: --metric METRIC or --sql SQL/--sql-file FILE; --provider, --from, --to, --account; saved run: --name NAME.\nShare: --files FILE,FILE [--apply --reviewed]. Buzz/content imports: [--apply], source in brain config buzz_source / content_source.\nComplete options, results, and failures: docs/CLI.md in this checkout. help is the supported action.\n');
    return;
  }
  const target = resolve(options.target || process.cwd());
  if (action === 'content-install') { stdout.write(JSON.stringify(installContent(target, options.apply === true), null, 2) + '\n'); return; }
  if (action === 'buzz-install') { stdout.write(JSON.stringify(installBuzz(target, options.apply === true), null, 2) + '\n'); return; }
  if (action === 'init') {
    const brainDir = options['brain-dir'] || (options.yes ? '.product-bench' : (await ask('Product Bench directory inside this repo [.product-bench]: ')).trim() || '.product-bench');
    const preview = init({ target, brainDir, apply: false });
    stdout.write(`${preview}\n`);
    if (!options.yes && (await ask('Apply these changes? [y/N] ')).trim().toLowerCase() !== 'y') return;
    stdout.write(`${init({ target, brainDir, apply: true })}\n`);
    return;
  }
  if (action === 'doctor') { stdout.write(`${doctor(target)}\n`); return; }
  if (action === 'update') { stdout.write(`${update(target, options.apply === true)}\n`); return; }
  if (action === 'uninstall') {
    const preview = uninstall(target, false);
    stdout.write(`${preview}\n`);
    if (!options.yes && (await ask('Remove unchanged installed files? [y/N] ')).trim().toLowerCase() !== 'y') return;
    stdout.write(`${uninstall(target, true)}\n`);
    return;
  }
  if (action === 'share') { stdout.write(`${sharePreview(target, options.files || null, options.apply === true, options.reviewed === true)}\n`); return; }
  if (action === 'source-add') {
    if (!options.file) throw new Error('source-add requires --file JSON');
    stdout.write(JSON.stringify(addSource(target, JSON.parse(readFileSync(options.file, 'utf8'))), null, 2) + '\n');
    return;
  }
  if (action === 'source-pull') {
    if (!options.id) throw new Error('source-pull requires --id');
    stdout.write(JSON.stringify(pullLocalSource(target, options.id), null, 2) + '\n'); return;
  }
  if (action === 'sync-stage') {
    if (!options.file) throw new Error('sync-stage requires --file JSON');
    stdout.write(JSON.stringify(stageObservation(target, JSON.parse(readFileSync(options.file, 'utf8'))), null, 2) + '\n');
    return;
  }
  if (action === 'sync-decide') {
    if (!options.id || !options.decision) throw new Error('sync-decide requires --id and --decision');
    stdout.write(JSON.stringify(decideProposal(target, options.id, options.decision, options.applied === true), null, 2) + '\n');
    return;
  }
  if (action === 'sync-status') { stdout.write(JSON.stringify(syncStatus(target), null, 2) + '\n'); return; }
  if (action === 'analytics') { stdout.write(JSON.stringify(await analyticsQuery(target, options), null, 2) + '\n'); return; }
  if (action === 'analytics-save') {
    if (!options.file) throw new Error('analytics-save requires --file JSON');
    stdout.write(JSON.stringify(saveAnalyticsDefinition(target, JSON.parse(readFileSync(options.file, 'utf8'))), null, 2) + '\n'); return;
  }
  if (action === 'analytics-list') { stdout.write(JSON.stringify(listAnalyticsDefinitions(target), null, 2) + '\n'); return; }
  if (action === 'analytics-run') {
    if (!options.name) throw new Error('analytics-run requires --name');
    stdout.write(JSON.stringify(await runAnalyticsDefinition(target, options.name, options), null, 2) + '\n'); return;
  }
  if (action === 'analytics-dashboard') {
    if (!options.file) throw new Error('analytics-dashboard requires --file JSON with definitions array');
    const dashboard = JSON.parse(readFileSync(options.file, 'utf8'));
    stdout.write(JSON.stringify(await runAnalyticsDashboard(target, dashboard.definitions, options), null, 2) + '\n'); return;
  }
  throw new Error(`Unknown action: ${action}`);
}
