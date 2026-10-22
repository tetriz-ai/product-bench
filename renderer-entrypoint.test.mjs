// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

test('renderer CLI writes the document when launched through a filesystem alias', () => {
  const target = mkdtempSync(join(tmpdir(), 'pb-render-entry-'));
  try {
    const source = join(target, 'input.md');
    const output = join(target, 'output.html');
    const alias = join(target, 'render-alias.mjs');
    writeFileSync(source, '# Fictional recovery guide\n\nCompleted rows are preserved.\n');
    symlinkSync(fileURLToPath(new URL('./render-document.mjs', import.meta.url)), alias);
    execFileSync(process.execPath, [alias, '--input', source, '--output', output, '--title', 'Fictional alias render'], { stdio: 'pipe' });
    const html = readFileSync(output, 'utf8');
    assert.match(html, /<title>Fictional alias render<\/title>/);
    assert.match(html, /<h1>Fictional recovery guide<\/h1>/);
    assert.match(html, /Completed rows are preserved\./);
    execFileSync(process.execPath, ['--input-type=module', '-e', `import(${JSON.stringify(new URL('./render-document.mjs', import.meta.url).href)})`], { stdio: 'pipe' });
    execFileSync(process.execPath, ['--input-type=module', '-'], { input: `import(${JSON.stringify(new URL('./render-document.mjs', import.meta.url).href)})`, stdio: 'pipe' });
  } finally { rmSync(target, { recursive: true, force: true }); }
});
