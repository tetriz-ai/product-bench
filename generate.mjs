// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { workflows, expectedWorkflowCount } from './workflows.mjs';
import { details } from './details.mjs';

if (workflows.length !== expectedWorkflowCount) throw new Error(`Expected ${expectedWorkflowCount} workflows, found ${workflows.length}`);
const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const out = join(root, 'payload/commands');
const checkOnly = process.argv.includes('--check');
mkdirSync(out, { recursive: true });

function procedure(name) {
  const path = join(root, 'docs/workflows', `${name}.md`);
  if (!existsSync(path)) throw new Error(`Missing canonical procedure: ${name}`);
  const content = readFileSync(path, 'utf8');
  const headings = ['blog', 'content-engine', 'content-engine-weekly'].includes(name)
    ? ['## Upstream handoff']
    : ['## Procedure', '## Output template', '## Worked example', '## Quality checks', '## Anti-patterns'];
  for (const heading of headings) {
    if (!content.includes(heading)) throw new Error(`Missing ${heading} in ${name}`);
  }
  return content.trim();
}

const catalog = `<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
# Product Bench command reference

Start with [GETTING-STARTED.md](GETTING-STARTED.md) for product, GTM, sales, and analytics paths. Run /pb-setup for guided first use or /pb-onboard for a teammate's tour.

In Claude Code, use /pb-<name> followed by a mode and your request. In Codex, ask the agent to read .codex/commands/pb-<name>.md and follow it for your task. If no mode is named, the first listed mode is the default. These are agent workflows, not local CLI subcommands.

${workflows.map((workflow) => `## /pb-${workflow.name}\n\n${workflow.purpose}\n\n| Mode | Bring | Receive |\n| --- | --- | --- |\n${Object.entries(workflow.modes).map(([name, contract]) => `| ${name} | ${contract.input} | ${contract.output} |`).join('\n')}`).join('\n\n')}
`;
const catalogPath = join(root, 'payload/brain/COMMANDS.md');
if (checkOnly) {
  if (!existsSync(catalogPath) || readFileSync(catalogPath, 'utf8') !== catalog) throw new Error('Generated command reference is out of date');
} else writeFileSync(catalogPath, catalog);

for (const workflow of workflows) {
  const modes = Object.entries(workflow.modes).map(([name, contract]) => `| ${name} | ${contract.input} | ${contract.output} |`).join('\n');
  const steps = workflow.steps.map((step, i) => `${i + 1}. ${step}`).join('\n');
  const content = `<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->\n<!-- .meta\ncontext_deps: [${workflow.context.map((name) => `${name}.md`).join(', ')}]\ncapabilities: [${workflow.capabilities.join(', ')}]\n-->\n\n# /pb-${workflow.name}\n\n${workflow.purpose}\n\n## Before proceeding\n\nRead and follow \`pb-_preamble.md\` in this host's command directory. Resolve the Product Bench directory from the repo-root \`.product-bench-install.json\`; never assume it is \`.product-bench\`. The user's instructions and host permissions take priority.\n\n## Mode contracts\n\n| Mode | Input | Output |\n|---|---|---|\n${modes}\n\nIf no mode is named, use \`${Object.keys(workflow.modes)[0]}\`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.\n\n## Workflow\n\n${steps}\n\n${details[workflow.name] || ''}\n\n${procedure(workflow.name)}\n\n## Evidence and output\n\nFor company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims \`[NEEDS DATA]\` and assumptions \`[ASSUMPTION]\`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.\n`;
  const path = join(out, `pb-${workflow.name}.md`);
  if (checkOnly) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== content) throw new Error(`Generated command is out of date: ${workflow.name}`);
  } else writeFileSync(path, content);
}
