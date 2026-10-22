#!/usr/bin/env node
// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { doctor } from './installer.mjs';

if (process.argv.includes('--host') && process.argv[process.argv.indexOf('--host') + 1] === 'codex') {
  // Codex sends a hook payload through stdin; consume it before responding.
  for await (const _chunk of process.stdin) { /* intentionally ignored */ }
}
try {
  let target = process.cwd();
  while (!existsSync(join(target, '.product-bench-install.json')) && dirname(target) !== target) target = dirname(target);
  const report = JSON.parse(doctor(target));
  const stale = Object.entries(report.freshness).filter(([, value]) => value.status !== 'fresh').map(([file, value]) => `${file}: ${value.status}`);
  const sources = report.sources.filter((source) => source.status !== 'checked' || source.pending).map((source) => `${source.id}: ${source.status}${source.pending ? `, ${source.pending} pending` : ''}`);
  const message = [...stale, ...sources].length ? `Product Bench context check: ${[...stale, ...sources].join('; ')}. Run pb-sync-context or pb-setup before relying on affected claims.` : '';
  if (!message) process.exit(0);
  if (process.argv.includes('codex')) process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: message } }) + '\n');
  else process.stdout.write(message + '\n');
} catch (error) {
  process.stderr.write(`Product Bench freshness check unavailable: ${error.message}\n`);
  process.exitCode = 0;
}
