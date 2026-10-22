// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync, lstatSync, realpathSync } from 'node:fs';
import { join, resolve, relative, sep, isAbsolute, parse } from 'node:path';

import { checkDestination, installedRoot } from './path-safety.mjs';

function load(target) {
  const root = installedRoot(target);
  const sourcesPath = checkDestination(target, join(root, 'sources.json'));
  const statePath = checkDestination(target, join(root, 'state/sync.json'));
  return { root, sourcesPath, statePath, sources: JSON.parse(readFileSync(sourcesPath, 'utf8')), state: JSON.parse(readFileSync(statePath, 'utf8')) };
}
function ownState(states, id) { return Object.hasOwn(states, id) ? states[id] : null; }
function save(path, value) { writeFileSync(path, JSON.stringify(value, null, 2) + '\n'); }
function digest(value) { return createHash('sha256').update(value).digest('hex').slice(0, 16); }
function validateSource(source) {
  if (!source || !/^[a-z][a-z0-9_-]*$/.test(source.id || '')) throw new Error('Source id must be lowercase letters, digits, hyphens or underscores');
  if (!['repo', 'local', 'mcp', 'manual', 'web'].includes(source.kind)) throw new Error('Source kind must be repo, local, mcp, manual or web');
  if (!Array.isArray(source.targets) || source.targets.length === 0 || source.targets.some((x) => !/^[a-z0-9-]+\.md$/.test(x))) throw new Error('Source targets must be context markdown filenames');
  if (source.kind === 'mcp' && !source.capability) throw new Error('MCP source needs a logical capability');
  if (!source.scope && !['manual'].includes(source.kind)) throw new Error('Source needs an approved read scope');
  const cadence = Object.hasOwn(source, 'cadence_days') ? source.cadence_days : 30;
  if (!['number', 'string'].includes(typeof cadence) || cadence === '' || !Number.isInteger(Number(cadence)) || Number(cadence) < 1) throw new Error('Source cadence_days must be a positive integer');
  if (source.paths && (!Array.isArray(source.paths) || source.paths.some((path) => typeof path !== 'string' || !path.trim()))) throw new Error('Source paths must be nonempty strings');
  return { id: source.id, kind: source.kind, scope: source.scope || 'user supplied', paths: source.paths || [], capability: source.capability || null, server_hint: source.server_hint || null, targets: source.targets, cadence_days: Number(cadence), owner: source.owner || null, enabled: source.enabled !== false };
}

export function addSource(target, source) {
  const data = load(target), clean = validateSource(source);
  if (data.sources.sources.some((item) => item.id === clean.id)) throw new Error(`Source already exists: ${clean.id}`);
  if (clean.targets.some((name) => !existsSync(checkDestination(target, join(data.root, 'context', name))))) throw new Error('Source target must be an existing context file');
  if (clean.kind === 'local' && clean.paths.some((path) => !isAbsolute(path))) throw new Error('Local source paths must be absolute');
  if (clean.kind === 'repo' && clean.paths.some((path) => isAbsolute(path))) throw new Error('Repo source paths must be relative');
  data.sources.sources.push(clean);
  save(data.sourcesPath, data.sources);
  return clean;
}

export function stageObservation(target, batch) {
  const data = load(target);
  const source = data.sources.sources.find((item) => item.id === batch.source_id && item.enabled);
  if (!source) throw new Error('Source is missing or disabled');
  if (batch.complete !== true) {
    if (batch.complete === false && ownState(data.state.sources, source.id)?.last_checked_at != null) {
      data.state.sources[source.id].last_checked_at = null;
      save(data.statePath, data.state);
    }
    throw new Error('Stage only a complete paginated fetch; partial pages invalidate health without advancing a cursor');
  }
  if (!Array.isArray(batch.items)) throw new Error('Batch needs an items array');
  if (!batch.cursor) throw new Error('Batch needs a source cursor or full-scan content hash');
  const sourceState = ownState(data.state.sources, source.id) || { observed_cursor: null, reviewed_cursor: null, last_checked_at: null };
  let added = 0;
  for (const item of batch.items) {
    if (!item.object_id || !item.version || !item.target || !item.citation || !item.summary) throw new Error('Each proposal needs object_id, version, target, citation and summary');
    if (!source.targets.includes(item.target)) throw new Error(`Target ${item.target} is not approved for ${source.id}`);
    const id = digest(`${source.id}\0${item.object_id}\0${item.version}\0${item.target}`);
    if (data.state.proposals.some((proposal) => proposal.id === id)) continue;
    data.state.proposals.push({ id, source_id: source.id, cursor: batch.cursor, object_id: item.object_id, version: item.version, target: item.target, citation: item.citation, summary: item.summary, observed_at: item.observed_at || new Date().toISOString(), status: 'pending', decision_at: null });
    added++;
  }
  sourceState.observed_cursor = batch.cursor;
  sourceState.last_checked_at = new Date().toISOString();
  if (batch.file_versions) sourceState.file_versions = batch.file_versions;
  data.state.sources[source.id] = sourceState;
  if (!data.state.proposals.some((proposal) => proposal.source_id === source.id && proposal.status === 'pending')) sourceState.reviewed_cursor = batch.cursor;
  save(data.statePath, data.state);
  return { source_id: source.id, added, observed_cursor: sourceState.observed_cursor, reviewed_cursor: sourceState.reviewed_cursor, pending: data.state.proposals.filter((proposal) => proposal.source_id === source.id && proposal.status === 'pending').length };
}

export function decideProposal(target, id, decision, applied = false) {
  const data = load(target);
  const proposal = data.state.proposals.find((item) => item.id === id);
  if (!proposal) throw new Error(`Unknown proposal: ${id}`);
  if (proposal.status !== 'pending') throw new Error('Proposal already reviewed');
  if (!['accepted', 'rejected'].includes(decision)) throw new Error('Decision must be accepted or rejected');
  if (decision === 'accepted' && !applied) throw new Error('Apply the reviewed context diff first, then pass --applied');
  proposal.status = decision;
  proposal.decision_at = new Date().toISOString();
  const sourceState = ownState(data.state.sources, proposal.source_id);
  if (!data.state.proposals.some((item) => item.source_id === proposal.source_id && item.status === 'pending')) sourceState.reviewed_cursor = sourceState.observed_cursor;
  save(data.statePath, data.state);
  return { id, decision, reviewed_cursor: sourceState.reviewed_cursor };
}

export function syncStatus(target) {
  const data = load(target);
  return { sources: data.sources.sources.map((source) => ({ ...source, state: ownState(data.state.sources, source.id) || null })), proposals: data.state.proposals.filter((item) => item.status === 'pending') };
}

function directSourcePath(path) {
  path = resolve(path);
  // Canonicalize only the OS aliases, never user-controlled source ancestors.
  if (process.platform === 'darwin') {
    for (const alias of ['/tmp', '/var', '/etc']) {
      if (path !== alias && !path.startsWith(`${alias}/`)) continue;
      if (lstatSync(alias).isSymbolicLink() && realpathSync(alias) === `/private${alias}`) path = `/private${path}`;
    }
  }
  let current = parse(path).root;
  for (const part of relative(current, path).split(sep)) {
    current = join(current, part);
    if (lstatSync(current).isSymbolicLink()) throw new Error(`Symlink source ancestor requires a direct, reviewed path: ${current}`);
  }
  return path;
}

function localFiles(path, limit = 500) {
  if (lstatSync(path).isSymbolicLink()) throw new Error(`Symlink source path requires a direct, reviewed file path: ${path}`);
  if (statSync(path).isFile()) return [path];
  if (!statSync(path).isDirectory()) throw new Error(`Unsupported source path: ${path}`);
  const files = [];
  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue;
      const full = join(directory, entry.name);
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile()) {
        files.push(full);
        if (files.length > limit) throw new Error(`Source contains more than ${limit} files; narrow its scope`);
      }
    }
  };
  walk(path);
  return files;
}

export function pullLocalSource(target, id) {
  const data = load(target);
  const source = data.sources.sources.find((item) => item.id === id && item.enabled);
  if (!source || !['repo', 'local'].includes(source.kind)) throw new Error('source-pull requires an enabled repo or local source');
  try {
    if (!source.paths?.length) throw new Error('Repo and local sources need explicit paths in sources.json');
    if (source.targets.length !== 1) throw new Error('source-pull needs exactly one context target per source');
    const root = resolve(target);
    const files = source.paths.flatMap((path) => {
      const resolved = source.kind === 'repo' ? resolve(root, path) : resolve(path);
      if (!existsSync(resolved)) throw new Error(`Source path is missing: ${path}`);
      if (source.kind === 'repo' && (isAbsolute(path) || relative(realpathSync(root), realpathSync(resolved)).startsWith(`..${sep}`) || relative(realpathSync(root), realpathSync(resolved)) === '..')) throw new Error(`Repo source path escapes target: ${path}`);
      directSourcePath(resolved);
      return localFiles(resolved);
    });
    const previous = ownState(data.state.sources, id)?.file_versions || {};
    const current = Object.create(null);
    const observations = files.map((file) => {
      const relativePath = source.kind === 'repo' ? relative(root, file).replaceAll('\\', '/') : file;
      if (statSync(file).size > 1024 * 1024) throw new Error(`Source file exceeds 1 MiB; narrow its scope: ${relativePath}`);
      const bytes = readFileSync(file);
      if (bytes.includes(0)) throw new Error(`Binary source file is not supported: ${relativePath}`);
      try { new TextDecoder('utf-8', { fatal: true }).decode(bytes); }
      catch { throw new Error(`Source file must be valid UTF-8 text: ${relativePath}`); }
      const hash = createHash('sha256').update(bytes).digest('hex');
      const generation = previous[relativePath]?.hash === hash ? previous[relativePath].generation : (previous[relativePath]?.generation || 0) + 1;
      current[relativePath] = { hash, generation };
      if (previous[relativePath]?.hash === hash) return null;
      return { object_id: relativePath, version: `${hash}:${generation}`, target: source.targets[0], citation: `file:${relativePath}`, summary: `Approved source changed: ${relativePath}. Inspect the file and propose a cited context diff.` };
    }).filter(Boolean);
    for (const [path, old] of Object.entries(previous)) {
      if (current[path]) continue;
      if (old.hash === 'deleted') { current[path] = old; continue; }
      const generation = old.generation + 1;
      current[path] = { hash: 'deleted', generation };
      observations.push({ object_id: path, version: `deleted:${generation}`, target: source.targets[0], citation: `file:${path}`, summary: `Approved source was removed: ${path}. Review whether the context still has valid support.` });
    }
    const inventory = Object.entries(current).sort(([a], [b]) => a.localeCompare(b)).map(([path, value]) => `${path}\0${value.hash}`);
    const cursor = `full-scan-sha256:${createHash('sha256').update(inventory.join('\n')).digest('hex')}`;
    return stageObservation(target, { source_id: id, cursor, complete: true, items: observations, file_versions: current });
  } catch (error) {
    // A failed fetch invalidates health without acknowledging unreviewed observations.
    const current = load(target);
    const sourceState = ownState(current.state.sources, id) || { observed_cursor: null, reviewed_cursor: null };
    sourceState.last_checked_at = null;
    current.state.sources[id] = sourceState;
    save(current.statePath, current.state);
    throw error;
  }
}
