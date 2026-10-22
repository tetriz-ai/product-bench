// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { packedCLI } from '../packed-cli.mjs';
const packed = packedCLI();
try {
  const output = join(packed.scratch, 'spec.html');
  packed.run('render-document.mjs', ['--input', fileURLToPath(new URL('./testdata/spec.md', import.meta.url)), '--output', output, '--title', 'Fictional resumable-import spec']);
  const html = readFileSync(output, 'utf8');
  assert.match(html, /<h1>Product Spec: Resumable contact-list imports<\/h1>/);
  assert.equal((html.match(/<h2>/g) || []).length, 8);
  assert.match(html, /No real baseline/);
  process.stdout.write('Rendered fictional spec: 8 sections; evidence gaps preserved\n');
} finally { packed.cleanup(); }
