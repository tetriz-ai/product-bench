// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const index = readFileSync(new URL('../examples/README.md', import.meta.url), 'utf8');
const names = [...index.matchAll(/\[[^\]]+\]\(([a-z-]+)\/(?:README\.md)?\)/g)].map((match) => match[1]).sort();
const folders = readdirSync(new URL('../examples/', import.meta.url), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
assert.deepEqual(names, folders, 'Example index must list every example exactly once');
for (const name of names) {
  const readme = readFileSync(new URL(`../examples/${name}/README.md`, import.meta.url), 'utf8');
  const command = readme.match(/```sh\n([^]*?)\n```/)?.[1];
  const output = [...readme.matchAll(/```text\n([^]*?)\n```/g)].at(-1)?.[1];
  assert.ok(command && output, `${name} needs a command and expected output`);
  const actual = execFileSync('/bin/sh', ['-eu', '-c', command], { cwd: root, encoding: 'utf8' });
  assert.equal(actual, output + '\n', `${name} output must match its README`);
  process.stdout.write(`${name}: passed\n`);
}
