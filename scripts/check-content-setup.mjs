// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { doctor } from '../installer.mjs';

// Check resulting files and successful tool calls, never a model's completion claim.
export function checkContentSetup({ target, repository, branch = 'main', configBefore, evidence = '' }) {
  const failures = [];
  const metadata = JSON.parse(readFileSync(join(target, '.product-bench-install.json'), 'utf8'));
  const config = JSON.parse(readFileSync(join(target, metadata.brain_dir, 'config.json'), 'utf8'));
  if (config.content_source?.repository !== repository || (config.content_source?.branch || 'main') !== branch) {
    failures.push('Approved content source was not configured');
  }
  const { content_source: ignoredBefore, ...before } = configBefore;
  const { content_source: ignoredAfter, ...after } = config;
  if (!isDeepStrictEqual(before, after)) failures.push('Content setup changed unrelated configuration');
  const status = JSON.parse(doctor(target)).integrations.content;
  if (status.status !== 'installed' || !status.revision || status.repository !== repository) {
    failures.push('Content pipeline installation and native links are not verified');
  }
  const commands = evidence.split(/\n|&&|;/);
  if (!commands.some(line => /product-bench\.mjs[^\n]*\bcontent-install\b/.test(line) && !/--apply\b/.test(line))) {
    failures.push('No successful content import preview');
  }
  if (!commands.some(line => /product-bench\.mjs[^\n]*\bcontent-install\b[^\n]*--apply\b/.test(line))) {
    failures.push('No successful content import apply');
  }
  if (!/product-bench\.mjs[^\n]*\bdoctor\b/.test(evidence)) failures.push('No successful content doctor check');
  return failures;
}
