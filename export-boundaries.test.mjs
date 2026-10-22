// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, symlinkSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { init, sharePreview } from './installer.mjs';
const today = new Date().toISOString().slice(0, 10);
function fixture(fn) { const root = mkdtempSync(join(tmpdir(), 'pb-export-')); init({ target: root, brainDir: '.product-bench', apply: true }); try { fn(root); } finally { rmSync(root, { recursive: true, force: true }); } }
const context = (root, file = 'product.md') => join(root, '.product-bench/context', file);
const output = (root, file = 'product.md') => join(root, 'product-bench-shared/context', file);
const content = (body, date = today) => `# Product\nLast updated: ${date}\n${body}\n`;
for (const [name, body] of [['bold', '**Unknown.**'], ['quote', '> Unknown.'], ['ordered', '1. Unknown.'], ['fenced', '```\nUnknown.\n```']]) test(`share blocks ${name} exact placeholder context`, () => fixture((root) => {
  writeFileSync(context(root), content(body)); assert.throws(() => sharePreview(root, 'product.md', true, true), /Sharing blocked/); assert.equal(existsSync(output(root)), false);
}));
test('named placeholders normalize stacked Markdown, every named token and list styles', () => fixture((root) => {
  for (const token of ['Unknown.', 'TBD', 'TODO!', 'Not yet known', 'Not set.', 'None.', 'N/A']) for (const body of [token, `* ${token}`, `+ ${token}`, `- ${token}`, `2) ${token}`, `> - **${token}**`, `> 1. _${token}_`, `\`${token}\``, `~~${token}~~`, `---\n${token}\n***`, `- - -\n${token}\n_ _ _`, `\`\`\` text\n${token}\n\`\`\``, `~~~text\n${token}\n~~~`]) {
    writeFileSync(context(root), content(body)); assert.throws(() => sharePreview(root, 'product.md', true, true), /Sharing blocked/, body); assert.equal(existsSync(output(root)), false);
  }
  writeFileSync(context(root), ''); assert.throws(() => sharePreview(root, 'product.md', true, true), /Sharing blocked/);
}));
test('older reviewed dates and meaningful prose/code copy exact bytes through a safe internal path', () => fixture((root) => {
  mkdirSync(join(root, '.product-bench/context/nested')); const bytes = content('The fictional delivery date remains unknown.\n\n```js\nconst unknown = "fixture";\n```', '2026-01-01'); writeFileSync(context(root, 'nested/product.md'), bytes);
  mkdirSync(join(root, 'approved-exports')); symlinkSync(join(root, 'approved-exports'), join(root, 'product-bench-shared'));
  const result = JSON.parse(sharePreview(root, 'nested/product.md', true, true)); assert.equal(result.status, 'copied_for_review'); assert.deepEqual(readFileSync(output(root, 'nested/product.md')), Buffer.from(bytes));
}));
test('share selection and collisions preflight every chosen output without replacing existing files', () => fixture((root) => {
  for (const file of ['product.md', 'users.md']) writeFileSync(context(root, file), content('Reviewed fictional evidence.'));
  assert.throws(() => sharePreview(root, 'missing.md', true, true), /Only existing/); assert.equal(existsSync(output(root)), false);
  mkdirSync(join(root, 'product-bench-shared/context'), { recursive: true }); writeFileSync(output(root, 'users.md'), 'User-owned existing export.');
  for (const selected of ['users.md', 'product.md,users.md']) { assert.throws(() => sharePreview(root, selected, true, true), /Shared file exists/); assert.equal(existsSync(output(root)), false); assert.equal(readFileSync(output(root, 'users.md'), 'utf8'), 'User-owned existing export.'); }
}));

for (const [name, body] of [['bold', '**Unknown**.'], ['italic', '_Unknown_.'], ['inline code', '`Unknown`.'], ['stacked', '> - **Unknown**.']]) test(`share blocks exact ${name} placeholders with punctuation outside wrappers`, () => fixture((root) => {
  writeFileSync(context(root), content(body)); assert.throws(() => sharePreview(root, 'product.md', true, true), /Sharing blocked/); assert.equal(existsSync(output(root)), false);
}));
for (const label of ['c++', 'c#', 'javascript title="fixture.js"']) test(`share blocks named placeholders under punctuated fence ${label}`, () => fixture((root) => {
  writeFileSync(context(root), content(`\`\`\`${label}\nUnknown.\n\`\`\``)); assert.throws(() => sharePreview(root, 'product.md', true, true), /Sharing blocked/); assert.equal(existsSync(output(root)), false);
}));
test('wrapper punctuation and fence forms retain exact named-token screening', () => fixture((root) => {
  for (const token of ['uNkNoWn', 'TBD', 'TODO', 'Not yet known', 'Not set', 'None', 'N/A']) for (const body of [`*${token}*.`, `__${token}__!`, `**_${token}_**.`, `***${token}.***`, `> > + **${token}**!`, `\`${token}\` .`, `~~~c++ title=fixture\n${token}.\n~~~`, `\`\`\` js\n${token}!\n\`\`\``]) {
    writeFileSync(context(root), content(body)); assert.throws(() => sharePreview(root, 'product.md', true, true), /Sharing blocked/, body); assert.equal(existsSync(output(root)), false);
  }
}));
test('every named-token prose prefix and meaningful wrapped/fenced code stays eligible and byte-exact', () => fixture((root) => {
  for (const token of ['Unknown', 'TBD', 'TODO', 'Not yet known', 'Not set', 'None', 'N/A']) for (const body of [`${token} delivery details remain tracked.`, `**${token} delivery details remain tracked.**`, `*${token} delivery details remain tracked.*`, `__${token} delivery details remain tracked.__`, `\`${token} delivery details remain tracked.\``, `> > - **${token} delivery details remain tracked.**`]) {
    const bytes = content(body); writeFileSync(context(root), bytes); assert.deepEqual(JSON.parse(sharePreview(root, 'product.md', false, true)).missing, []); sharePreview(root, 'product.md', true, true); assert.deepEqual(readFileSync(output(root)), Buffer.from(bytes)); rmSync(output(root));
  }
  for (const body of ['```c++\nint unknown = 1;\n```', '```c# title=fixture\nvar unknown = 1;\n```', '~~~javascript title=fixture\nconst unknown = 1;\n~~~', '```const unknown = 1;```', '`const unknown = 1;`']) {
    const bytes = content(body); writeFileSync(context(root), bytes); sharePreview(root, 'product.md', true, true); assert.deepEqual(readFileSync(output(root)), Buffer.from(bytes)); rmSync(output(root));
  }
}));
