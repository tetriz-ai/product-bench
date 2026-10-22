// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { workflows, expectedWorkflowCount } from './workflows.mjs';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const errors = [];
const names = workflows.map((item) => item.name);
const skillCatalog = JSON.parse(readFileSync(join(root, 'payload/skill-catalog.json'), 'utf8'));
const skillNames = skillCatalog.skills.map((skill) => skill.name);
if (new Set(skillNames).size !== skillNames.length) errors.push('Duplicate skill catalog entry');
for (const skill of skillCatalog.skills) {
  if (!existsSync(join(root, 'payload', skill.entrypoint))) errors.push(`Missing bundled skill: ${skill.name}`);
}
const bundledSkillNames = readdirSync(join(root, 'payload/skills')).sort();
if (JSON.stringify(bundledSkillNames) !== JSON.stringify([...skillNames].sort())) errors.push('Bundled skills differ from skill catalog');
if (names.length !== expectedWorkflowCount || new Set(names).size !== expectedWorkflowCount) errors.push('Workflow count or uniqueness mismatch');
for (const file of readdirSync(join(root, 'payload/commands'))) {
  if (file.startsWith('pb-') && file.endsWith('.md') && !['pb-_preamble.md', 'pb-setup.md', ...names.map((name) => `pb-${name}.md`)].includes(file)) errors.push(`Uncataloged command: ${file}`);
}
for (const workflow of workflows) {
  const file = join(root, 'payload/commands', `pb-${workflow.name}.md`);
  if (!existsSync(file)) { errors.push(`Missing command: ${workflow.name}`); continue; }
  const content = readFileSync(file, 'utf8');
  for (const [mode, contract] of Object.entries(workflow.modes)) {
    if (!content.includes(`| ${mode} |`) || !contract.input || !contract.output) errors.push(`Missing mode contract: ${workflow.name}/${mode}`);
  }
  for (const dependency of workflow.context) {
    if (!existsSync(join(root, 'payload/brain/context', `${dependency}.md`))) errors.push(`Missing context dependency: ${workflow.name}/${dependency}`);
  }
}
const banned = /(?:-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b|\b(?:customer[_-]?id|employee[_-]?id)\s*[:=]\s*\S+)/i;
for (const workflow of workflows) {
  const content = readFileSync(join(root, 'payload/commands', `pb-${workflow.name}.md`), 'utf8');
  if (banned.test(content)) errors.push(`Sensitive identifier in ${workflow.name}`);
}
if (errors.length) {
  process.stderr.write(errors.join('\n') + '\n');
  process.exitCode = 1;
} else {
  process.stdout.write(`Package checks passed: ${expectedWorkflowCount} commands, ${workflows.reduce((count, item) => count + Object.keys(item.modes).length, 0)} mode contracts, and ${skillNames.length} bundled skills.\n`);
}
