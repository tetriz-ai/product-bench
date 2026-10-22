// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, lstatSync, realpathSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkDestination } from './path-safety.mjs';
import { scanText } from './privacy.mjs';
import { buzzStatus, refreshBuzz } from './upstream-buzz.mjs';
import { contentStatus, refreshContent } from './upstream-content.mjs';

const packageRoot = dirname(fileURLToPath(import.meta.url));
const configName = '.product-bench-install.json';
const markerStart = '<!-- product-bench:start -->';
const markerEnd = '<!-- product-bench:end -->';

function exactDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}
function hash(bytes) { return createHash('sha256').update(bytes).digest('hex'); }
function readJSON(path) { return JSON.parse(readFileSync(path, 'utf8')); }
function filesUnder(root, prefix = '') {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const name = join(prefix, entry.name);
    return entry.isDirectory() ? filesUnder(join(root, entry.name), name) : [name];
  });
}
function within(target, subpath) {
  if (isAbsolute(subpath)) throw new Error('The Product Bench directory must be relative to the target repo');
  const abs = resolve(target, subpath);
  const rel = relative(target, abs);
  if (!rel || rel === '..' || rel.startsWith(`..${sep}`)) throw new Error('The Product Bench directory must be a non-root path inside the target repo');
  if (!/^[A-Za-z0-9._/-]+$/.test(rel.replaceAll('\\', '/'))) throw new Error('The Product Bench directory may contain only letters, digits, dots, underscores, hyphens and slashes');
  return rel;
}
function copyPlan(brainDir) {
  const plan = [];
  for (const file of readdirSync(packageRoot).filter((name) => name.endsWith('.mjs') && !name.endsWith('.test.mjs') && !['generate.mjs', 'check-package.mjs'].includes(name))) {
    plan.push({ source: join(packageRoot, file), dest: join(brainDir, 'runtime', file) });
  }
  // Keep prior installed entrypoints working when an existing installation updates.
  for (const name of ['product-bench', 'freshness-hook']) {
    const source = join(packageRoot, 'scripts', `legacy-${name}.mjs`);
    plan.push({ source, dest: join(brainDir, 'runtime/bin', `${name}.mjs`) });
    plan.push({ source, dest: join(brainDir, 'runtime/scripts', `legacy-${name}.mjs`) });
  }
  for (const group of ['payload']) {
    for (const file of filesUnder(join(packageRoot, group))) {
      plan.push({ source: join(packageRoot, group, file), dest: join(brainDir, 'runtime', group, file) });
    }
  }
  for (const file of filesUnder(join(packageRoot, 'docs/analytics'))) {
    plan.push({ source: join(packageRoot, 'docs/analytics', file), dest: join(brainDir, 'runtime/docs/analytics', file) });
  }
  plan.push({ source: join(packageRoot, 'package.json'), dest: join(brainDir, 'runtime/package.json') });
  plan.push({ source: join(packageRoot, 'THIRD-PARTY-NOTICES.md'), dest: join(brainDir, 'runtime/THIRD-PARTY-NOTICES.md') });
  for (const file of ['CLI.md', 'SOURCES.md', 'ANALYTICS.md']) plan.push({ source: join(packageRoot, 'docs', file), dest: join(brainDir, 'runtime/docs', file) });
  for (const file of ['LICENSE', 'NOTICE', 'CODE_OF_CONDUCT.md']) plan.push({ source: join(packageRoot, file), dest: join(brainDir, 'runtime', file) });
  plan.push({ source: join(packageRoot, 'docs/THIRD-PARTY-PROVENANCE.json'), dest: join(brainDir, 'runtime/docs/THIRD-PARTY-PROVENANCE.json') });
  for (const file of filesUnder(join(packageRoot, 'payload/brain'))) {
    plan.push({ source: join(packageRoot, 'payload/brain', file), dest: join(brainDir, file), userOwned: true });
  }
  for (const file of filesUnder(join(packageRoot, 'payload/commands'))) {
    for (const host of ['.claude/commands', '.codex/commands']) {
      plan.push({ source: join(packageRoot, 'payload/commands', file), dest: join(host, file) });
    }
  }
  for (const file of filesUnder(join(packageRoot, 'payload/skills'))) {
    for (const host of ['.claude/skills', '.agents/skills']) {
      plan.push({ source: join(packageRoot, 'payload/skills', file), dest: join(host, file) });
    }
  }
  return plan;
}
function managedBlock(brainDir, host) {
  return `${markerStart}\nProduct Bench is installed at \`${brainDir}/\`. For Product Bench workflows, read \`${brainDir}/OPERATING-SYSTEM.md\` and \`${brainDir}/config.json\`. Context is shared in the repository; review proposed facts before writing them. Credentials and raw sensitive data must stay outside context. ${host === 'codex' ? 'Codex workflow files are in `.codex/commands/`; read the matching file and shared preamble when invoked.' : 'Claude Code workflow files are in `.claude/commands/`.'}\n${markerEnd}`;
}
function repositoryIgnore(target, brainDir) {
  const path = join(target, '.gitignore');
  const prior = existsSync(path) ? readFileSync(path, 'utf8') : '';
  const prefix = `/${brainDir.replaceAll('\\', '/')}`;
  // Retire the blanket rule written by earlier installers; preserve other rules.
  const lines = prior.split(/\r?\n/).filter((line) => line !== `${prefix}/`);
  while (lines.at(-1) === '') lines.pop();
  for (const rule of [`${prefix}/runtime/`, `${prefix}/outputs/`, `${prefix}/state/`, `${prefix}/integrations/`, `/${configName}`]) {
    if (!lines.includes(rule)) lines.push(rule);
  }
  return `${lines.join('\n')}\n`;
}
function appendBlock(path, block, apply) {
  const prior = existsSync(path) ? readFileSync(path, 'utf8') : '';
  if (prior.includes(markerStart)) return false;
  if (apply) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, `${prior}${prior && !prior.endsWith('\n') ? '\n' : ''}\n${block}\n`);
  }
  return true;
}
function removeBlock(path) {
  if (!existsSync(path)) return;
  const old = readFileSync(path, 'utf8');
  const begin = old.indexOf(markerStart), end = old.indexOf(markerEnd);
  if (begin < 0 || end < 0) return;
  writeFileSync(path, `${old.slice(0, begin)}${old.slice(end + markerEnd.length)}`.trimEnd() + '\n');
}
function hookCommand(brainDir, host) {
  return `node "$(git rev-parse --show-toplevel)/${join(brainDir, 'runtime/bin/freshness-hook.mjs').replaceAll('\\', '/')}" --host ${host}`;
}
function hookSettings(target, host) {
  const path = join(target, host === 'claude' ? '.claude/settings.json' : '.codex/hooks.json');
  let settings = {};
  if (existsSync(path)) {
    try { settings = readJSON(path); }
    catch { throw new Error(`Cannot safely merge non-JSON host settings: ${path}`); }
  }
  if (!settings || typeof settings !== 'object' || Array.isArray(settings) || (Object.hasOwn(settings, 'hooks') && (!settings.hooks || typeof settings.hooks !== 'object' || Array.isArray(settings.hooks)))) throw new Error(`Cannot safely merge host settings: ${path}`);
  const event = host === 'claude' ? 'UserPromptSubmit' : 'SessionStart';
  if (settings.hooks && Object.hasOwn(settings.hooks, event)) {
    const entries = settings.hooks[event];
    if (!Array.isArray(entries) || entries.some((entry) => !entry || typeof entry !== 'object' || Array.isArray(entry) || !Array.isArray(entry.hooks) || entry.hooks.some((hook) => !hook || typeof hook !== 'object' || Array.isArray(hook) || (Object.hasOwn(hook, 'command') && typeof hook.command !== 'string')))) throw new Error(`Cannot safely merge host hooks: ${path}`);
  }
  return { path, settings, event };
}
function prepareHook(target, brainDir, host, remove = false) {
  const { path, settings, event } = hookSettings(target, host);
  const command = hookCommand(brainDir, host);
  const registered = settings.hooks?.[event]?.some((entry) => entry.hooks.some((hook) => hook.command === command));
  if ((remove && !registered) || (!remove && registered)) return { path, changed: false };
  settings.hooks ||= {};
  settings.hooks[event] ||= [];
  if (remove) {
    settings.hooks[event] = settings.hooks[event].map((entry) => ({ ...entry, hooks: entry.hooks.filter((hook) => hook.command !== command) })).filter((entry) => entry.hooks.length);
  } else if (!settings.hooks[event].some((entry) => entry.hooks.some((hook) => hook.command === command))) {
    settings.hooks[event].push({ ...(host === 'codex' ? { matcher: 'startup|resume|clear|compact' } : {}), hooks: [{ type: 'command', command }] });
  }
  const contents = JSON.stringify(settings, null, 2) + '\n';
  return { path, contents, changed: remove && !existsSync(path) ? false : !existsSync(path) || readFileSync(path, 'utf8') !== contents };
}
function writeHook(plan) {
  if (!plan.changed) return;
  mkdirSync(dirname(plan.path), { recursive: true });
  writeFileSync(plan.path, plan.contents);
}
function hookHealth(target, brainDir, host) {
  try {
    const { settings, event } = hookSettings(target, host);
    const command = hookCommand(brainDir, host);
    return { status: settings.hooks?.[event]?.some((entry) => entry.hooks.some((hook) => hook.command === command)) ? 'registered' : 'missing' };
  } catch (error) { return { status: 'invalid', reason: error.message }; }
}
function linkedPath(target, path) {
  let current = path;
  while (current !== target) {
    try { if (lstatSync(current).isSymbolicLink()) return true; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
    current = dirname(current);
  }
  return false;
}

export function init({ target, brainDir, apply = false }) {
  target = resolve(target);
  brainDir = within(target, brainDir);
  if (existsSync(join(target, configName))) throw new Error('Already installed; use update or doctor');
  const plan = copyPlan(brainDir);
  if (plan.length === 0) throw new Error('Package payload is empty');
  const destinations = [...plan.map(({ dest }) => dest), 'CLAUDE.md', 'AGENTS.md', '.claude/settings.json', '.codex/hooks.json', '.gitignore', configName];
  for (const dest of destinations) checkDestination(target, join(target, dest));
  // A teammate may install into a clone containing team context and identical commands.
  const collisions = plan.filter(({ source, dest, userOwned }) => !userOwned && existsSync(join(target, dest)) && hash(readFileSync(join(target, dest))) !== hash(readFileSync(source))).map(({ dest }) => dest);
  if (collisions.length) throw new Error(`Existing files would be overwritten: ${collisions.join(', ')}`);
  const hooks = ['claude', 'codex'].map((host) => prepareHook(target, brainDir, host));
  const summary = `Install ${plan.length} managed files into ${target}; shared repository context: ${brainDir}/context; add marked instructions to CLAUDE.md and AGENTS.md; ignore local runtime, outputs, sync state, and install metadata.`;
  if (!apply) return summary;
  const owned = {};
  for (const { source, dest, userOwned } of plan) {
    const bytes = readFileSync(source);
    const out = join(target, dest);
    if (userOwned && existsSync(out)) continue;
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, bytes);
    if (!userOwned) owned[dest] = hash(bytes);
  }
  appendBlock(join(target, 'CLAUDE.md'), managedBlock(brainDir, 'claude'), true);
  appendBlock(join(target, 'AGENTS.md'), managedBlock(brainDir, 'codex'), true);
  hooks.forEach(writeHook);
  const ignore = join(target, '.gitignore');
  writeFileSync(ignore, repositoryIgnore(target, brainDir));
  const config = { schema_version: 1, package_version: readJSON(join(packageRoot, 'package.json')).version, brain_dir: brainDir, owned, context_storage: 'repository' };
  writeFileSync(join(target, configName), JSON.stringify(config, null, 2) + '\n');
  return `${summary}\nNext: open Claude Code and run /pb-setup, or ask Codex to run pb-setup. Local runtime: node ${brainDir}/runtime/product-bench.mjs doctor --target .`;
}

export function doctor(target) {
  target = resolve(target);
  const path = join(target, configName);
  if (!existsSync(path)) throw new Error('Product Bench is not installed');
  const config = readJSON(path);
  const missing = [], modified = [];
  for (const [file, expected] of Object.entries(config.owned)) {
    const absolute = join(target, file);
    if (!existsSync(absolute)) missing.push(file);
    else if (hash(readFileSync(absolute)) !== expected) modified.push(file);
  }
  const sourcesPath = join(target, config.brain_dir, 'sources.json');
  const sources = existsSync(sourcesPath) ? readJSON(sourcesPath).sources || [] : [];
  const brainRoot = join(target, config.brain_dir);
  const brainConfig = readJSON(join(brainRoot, 'config.json'));
  const freshness = {};
  for (const file of filesUnder(join(brainRoot, 'context'))) {
    if (!file.endsWith('.md')) continue;
    const contents = readFileSync(join(brainRoot, 'context', file), 'utf8');
    const value = contents.match(/^Last updated:\s*(.+)$/im)?.[1]?.trim() || 'never';
    const timestamp = exactDate(value) ? Date.parse(`${value}T00:00:00Z`) : NaN;
    const ageDays = Number.isFinite(timestamp) ? Math.floor((Date.now() - timestamp) / 86400000) : null;
    freshness[file] = { last_updated: value, age_days: ageDays, status: ageDays === null ? 'missing' : ageDays < 0 ? 'invalid' : ageDays > brainConfig.freshness_days ? 'stale' : 'fresh' };
  }
  const statePath = join(brainRoot, 'state/sync.json');
  const state = existsSync(statePath) ? readJSON(statePath) : { sources: {}, proposals: [] };
  const sourceHealth = sources.map((source) => {
    const last = Object.hasOwn(state.sources, source.id) ? state.sources[source.id]?.last_checked_at : null;
    const checked = typeof last === 'string' && exactDate(last.slice(0, 10)) ? Date.parse(last) : NaN;
    const age = Number.isFinite(checked) && checked <= Date.now() ? Math.floor((Date.now() - checked) / 86400000) : null;
    return { id: source.id, kind: source.kind, status: age === null ? 'unchecked' : age > source.cadence_days ? 'overdue' : 'checked', pending: state.proposals.filter((item) => item.source_id === source.id && item.status === 'pending').length };
  });
  return JSON.stringify({ hooks: Object.fromEntries(['claude', 'codex'].map((host) => [host, hookHealth(target, config.brain_dir, host)])), files: Object.keys(config.owned).length, missing, modified, freshness, sources: sourceHealth, integrations: { buzz: buzzStatus(brainRoot, undefined, target), content: contentStatus(brainRoot, undefined, target) }, context_storage: config.context_storage || 'legacy-local', ready: missing.length === 0 && modified.length === 0 }, null, 2);
}

export function update(target, apply = false, upstreamSource, contentUpstreamSource) {
  target = resolve(target);
  const configPath = join(target, configName);
  checkDestination(target, configPath);
  if (!existsSync(configPath)) throw new Error('Product Bench is not installed');
  const config = readJSON(configPath);
  within(target, config.brain_dir);
  // Validate all destinations before the first write or managed-file retirement.
  const plan = copyPlan(config.brain_dir).filter((item) => !item.userOwned);
  const destinations = [configPath, join(target, '.gitignore'), join(target, 'CLAUDE.md'), join(target, 'AGENTS.md'), join(target, '.claude/settings.json'), join(target, '.codex/hooks.json'), join(target, config.brain_dir, 'config.json'), ...plan.map(({ dest }) => join(target, dest)), ...Object.keys(config.owned).map((dest) => join(target, within(target, dest)))];
  for (const path of destinations) checkDestination(target, path);
  const hooks = ['claude', 'codex'].map((host) => prepareHook(target, config.brain_dir, host));
  const ignorePath = join(target, '.gitignore');
  const nextIgnore = repositoryIgnore(target, config.brain_dir);
  const ignoreChanged = !existsSync(ignorePath) || readFileSync(ignorePath, 'utf8') !== nextIgnore;
  if (ignoreChanged) checkDestination(target, ignorePath);
  const changed = [], skipped = [], removed = [];
  for (const hook of hooks) if (hook.changed) { changed.push(relative(target, hook.path)); if (apply) writeHook(hook); }
  if (ignoreChanged) {
    changed.push('.gitignore');
    if (apply) writeFileSync(ignorePath, nextIgnore);
  }
  for (const [file, host] of [['CLAUDE.md', 'claude'], ['AGENTS.md', 'codex']]) {
    const path = join(target, file);
    if (!existsSync(path)) continue;
    const prior = readFileSync(path, 'utf8');
    const begin = prior.indexOf(markerStart), end = prior.indexOf(markerEnd, begin);
    if (begin < 0 || end < 0) continue;
    const next = prior.slice(0, begin) + managedBlock(config.brain_dir, host) + prior.slice(end + markerEnd.length);
    if (next === prior) continue;
    checkDestination(target, path);
    changed.push(file);
    if (apply) writeFileSync(path, next);
  }
  // Retire only package-owned, unchanged copies; keep local customizations.
  for (const name of ['deck', 'contribution-score', 'contribution-score-debug', 'prodinsights', 'trial-report', 'reviewer-bottleneck', 'prd', 'review-prd', 'buzz-daily', 'buzz-hn-comment-rubric', 'buzz-ph-comment-rubric', 'buzz-reddit-comment-rubric']) {
    for (const dir of ['.claude/commands', '.codex/commands', join(config.brain_dir, 'runtime/payload/commands')]) {
      const dest = join(dir, `pb-${name}.md`);
      const expected = config.owned[dest];
      if (!expected) continue;
      const out = join(target, dest);
      checkDestination(target, out);
      if (linkedPath(target, out)) { skipped.push(dest); continue; }
      if (existsSync(out) && hash(readFileSync(out)) !== expected) { skipped.push(dest); continue; }
      removed.push(dest);
      if (apply) { rmSync(out, { force: true }); delete config.owned[dest]; }
    }
  }
  // Retire the old bundled editorial engine only where recorded bytes still match.
  // Never follow upstream skill links or remove team customizations.
  for (const [dest, expected] of Object.entries(config.owned)) {
    const roots = ['.claude/skills/articleforge/', '.agents/skills/articleforge/', `${config.brain_dir}/runtime/payload/skills/articleforge/`];
    if (!roots.some((root) => dest.startsWith(root))) continue;
    const out = join(target, dest);
    if (linkedPath(target, out)) { skipped.push(dest); continue; }
    if (existsSync(out) && hash(readFileSync(out)) !== expected) { skipped.push(dest); continue; }
    removed.push(dest);
    if (apply) {
      rmSync(out, { force: true }); delete config.owned[dest];
      // Empty legacy directories must not shadow the imported native skills.
      let parent = dirname(out);
      const root = join(target, roots.find((root) => dest.startsWith(root)));
      while (parent.startsWith(root.replace(/\/$/, '')) && existsSync(parent) && readdirSync(parent).length === 0) {
        rmSync(parent, { recursive: true });
        parent = dirname(parent);
      }
    }
  }
  // Retire unchanged managed copies, while preserving explicitly customized assets.
  for (const dir of ['.claude/skills', '.agents/skills', join(config.brain_dir, 'runtime/payload/skills')]) {
    const dest = join(dir, 'visual-doc-creation/assets/line-icons.json');
    const expected = config.owned[dest];
    if (!expected) continue;
    const out = join(target, dest);
    checkDestination(target, out);
    if (linkedPath(target, out)) { skipped.push(dest); continue; }
    if (existsSync(out) && hash(readFileSync(out)) !== expected) { skipped.push(dest); continue; }
    removed.push(dest);
    if (apply) { rmSync(out, { force: true }); delete config.owned[dest]; }
  }
  for (const { source, dest } of plan) {
    const out = join(target, dest);
    if (linkedPath(target, out)) { skipped.push(dest); continue; }
    const current = existsSync(out) ? hash(readFileSync(out)) : null;
    const expected = config.owned[dest];
    if (current && current !== expected) { skipped.push(dest); continue; }
    const bytes = readFileSync(source), next = hash(bytes);
    if (current === next) continue;
    changed.push(dest);
    if (apply) { mkdirSync(dirname(out), { recursive: true }); writeFileSync(out, bytes); config.owned[dest] = next; }
  }
  const brainConfigPath = join(target, config.brain_dir, 'config.json');
  const brainConfig = readJSON(brainConfigPath);
  if (brainConfig.routing && Object.hasOwn(brainConfig.routing, 'prd')) {
    checkDestination(target, brainConfigPath);
    changed.push(join(config.brain_dir, 'config.json'));
    if (apply) {
      delete brainConfig.routing.prd;
      writeFileSync(brainConfigPath, JSON.stringify(brainConfig, null, 2) + '\n');
    }
  }
  if (apply) { config.package_version = readJSON(join(packageRoot, 'package.json')).version; config.context_storage = 'repository'; delete config.context_shared; delete config.shared_context_dir; writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n'); }
  const integrations = { buzz: refreshBuzz(target, apply, upstreamSource), content: refreshContent(target, apply, contentUpstreamSource) };
  return JSON.stringify({ changed, removed, skipped, integrations, applied: apply }, null, 2);
}

export function uninstall(target, apply = false) {
  target = resolve(target);
  const configPath = join(target, configName);
  checkDestination(target, configPath);
  if (!existsSync(configPath)) throw new Error('Product Bench is not installed');
  const config = readJSON(configPath), removable = [], retained = [];
  within(target, config.brain_dir);
  // Validate every potential mutation before deleting even the first managed file.
  for (const file of [...Object.keys(config.owned), 'CLAUDE.md', 'AGENTS.md', '.claude/settings.json', '.codex/hooks.json']) {
    checkDestination(target, resolve(target, file));
  }
  const hooks = ['claude', 'codex'].map((host) => prepareHook(target, config.brain_dir, host, true));
  for (const [file, expected] of Object.entries(config.owned)) {
    const out = join(target, file);
    if (linkedPath(target, out)) { retained.push(file); continue; }
    if (!existsSync(out)) continue;
    if (hash(readFileSync(out)) === expected) removable.push(file);
    else retained.push(file);
  }
  if (apply) {
    for (const file of removable) rmSync(join(target, file));
    removeBlock(join(target, 'CLAUDE.md'));
    removeBlock(join(target, 'AGENTS.md'));
    hooks.forEach(writeHook);
    rmSync(configPath);
  }
  return JSON.stringify({ removable, retained, context_preserved: config.brain_dir, applied: apply }, null, 2);
}

export function sharePreview(target, selected = null, apply = false, reviewed = false) {
  target = resolve(target);
  const configPath = join(target, configName);
  const config = readJSON(configPath);
  const root = join(target, config.brain_dir);
  const allFiles = filesUnder(join(root, 'context')).filter((name) => name.endsWith('.md'));
  const files = selected ? selected.split(',').map((name) => name.trim()) : allFiles;
  if (files.some((name) => !allFiles.includes(name))) throw new Error('Only existing context markdown files can be shared');
  const findings = files.flatMap((file) => scanText(readFileSync(join(root, 'context', file), 'utf8')).map((finding) => ({ file, finding })));
  const today = new Date().toISOString().slice(0, 10);
  const missing = files.filter((file) => {
    const contents = readFileSync(join(root, 'context', file), 'utf8');
    const date = contents.match(/^Last updated:\s*(.+)$/im)?.[1]?.trim();
    if (!exactDate(date) || date > today) return true;
    const prose = contents.split('\n').filter((line) => !/^\s*(?:#|Last updated:)/i.test(line))
      .map((line) => {
        let text = line.trim();
        if (/^([-*_])(?:\s*\1){2,}\s*$/.test(text)) return '';
        let previous;
        do {
          previous = text;
          text = text.replace(/^(?:>\s*|[-*+]\s+|\d+[.)]\s+)/, '').trim();
        } while (text !== previous);
        if (/^(?:`{3,}[^`]*|~{3,}[^~]*)$/.test(text) || /^([-*_])(?:\s*\1){2,}\s*$/.test(text)) return '';
        return text.replace(/[.!]$/, '').trim().replace(/^[*_`~]+|[*_`~]+$/g, '').trim();
      }).filter(Boolean);
    return !prose.some((line) => !/^(?:unknown|tbd|todo|not yet known|not set|none|n\/a)[.!]?$/i.test(line));
  });
  const destination = 'product-bench-shared/context';
  if (apply) {
    if (!reviewed) throw new Error('Sharing requires --reviewed after inspecting the exact files');
    if (findings.length || missing.length) throw new Error('Sharing blocked: resolve privacy findings and unfilled context first');
    for (const file of files) checkDestination(target, join(target, destination, file));
    for (const file of files) {
      const out = join(target, destination, file);
      if (existsSync(out)) throw new Error(`Shared file exists; review and remove it before replacing: ${out}`);
    }
    for (const file of files) {
      const out = join(target, destination, file);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, readFileSync(join(root, 'context', file)));
    }
  }
  return JSON.stringify({ status: apply ? 'copied_for_review' : 'preview_only', destination, files, findings, missing, message: apply ? 'Optional export copied; repository context already supports team use.' : 'Optional export only; team workflows use repository context directly. To export, inspect the exact files before using --apply --reviewed.' }, null, 2);
}
