// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { packedCLI } from '../packed-cli.mjs';
const packed = packedCLI();
const target = join(packed.scratch, 'team');
try {
  mkdirSync(target);
  packed.run('product-bench.mjs', ['init', '--target', target, '--brain-dir', 'team/context', '--yes']);
  const report = JSON.parse(packed.run('product-bench.mjs', ['doctor', '--target', target]));
  assert.equal(report.ready, true);
  assert.deepEqual(report.missing, []);
  assert.equal(report.integrations.buzz.status, 'not_configured');
  const result = JSON.parse(packed.run('product-bench.mjs', ['analytics', '--target', target, '--metric', 'activation_rate']));
  assert.deepEqual(result, { value: 1, numerator: 3, denominator: 3, fictional: true });
  process.stdout.write(`Installation ready: ${report.ready}\nOptional Buzz: ${report.integrations.buzz.status}\nFictional analytics: ${JSON.stringify(result)}\n`);
} finally { packed.cleanup(); }
