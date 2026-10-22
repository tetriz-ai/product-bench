// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { packedCLI } from '../packed-cli.mjs';
const packed = packedCLI();
const target = join(packed.scratch, 'team');
try {
  mkdirSync(target);
  packed.run('product-bench.mjs', ['init', '--target', target, '--brain-dir', 'team/context', '--yes']);
  const path = join(target, '.claude/commands/pb-idea.md');
  const reviewed = '# Team-reviewed idea workflow\n';
  writeFileSync(path, reviewed);
  const report = JSON.parse(packed.run('product-bench.mjs', ['update', '--target', target, '--apply']));
  assert.ok(report.skipped.includes('.claude/commands/pb-idea.md'));
  assert.equal(readFileSync(path, 'utf8'), reviewed);
  process.stdout.write('Team-reviewed command preserved\n');
} finally { packed.cleanup(); }
