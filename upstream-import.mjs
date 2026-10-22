// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { execFileSync } from 'node:child_process';
import { existsSync, lstatSync, readlinkSync, realpathSync, readFileSync, writeFileSync, mkdirSync, mkdtempSync, renameSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

// One safe checkout/update implementation shared by optional upstream engines.
export function createUpstreamImport(defaultSource, { id, label, configKey, action, installer, skills, previewMessage, requireLinks = false, legacyFiles = {} }) {

  function git(root, args) {
    return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', maxBuffer: 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  }

  function resolveSource(brainRoot, explicit) {
    if (explicit) return { ...defaultSource, ...explicit };
    const configPath = join(brainRoot, 'config.json');
    const configured = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8'))[configKey] : null;
    if (configured) return { ...defaultSource, repository: configured.repository, branch: configured.branch || defaultSource.branch };
    const recordPath = join(brainRoot, `integrations/${id}.json`);
    safePath(resolve(brainRoot), recordPath);
    if (existsSync(recordPath)) {
      const record = JSON.parse(readFileSync(recordPath, 'utf8'));
      if (record.repository) return { ...defaultSource, repository: record.repository, branch: record.branch || defaultSource.branch };
    }
    const path = join(brainRoot, `integrations/${id}`);
    safePath(resolve(brainRoot), path);
    if (existsSync(path)) return { ...defaultSource, repository: git(path, ['remote', 'get-url', 'origin']) };
    return defaultSource;
  }

  function notConfigured(brainRoot, source) {
    return { status: 'not_configured', repository: null, branch: source.branch, path: join(brainRoot, `integrations/${id}`),
      reason: `Set ${configKey}.repository and optional ${configKey}.branch in ${join(brainRoot, 'config.json')} to the approved ${label} repository. Then preview ${action}; no engine is run by import.` };
  }

  function safePath(target, path) {
    const rel = relative(target, path);
    if (!rel || rel === '..' || rel.startsWith(`..${sep}`)) throw new Error(`${label} import must stay inside the target repository`);
    let current = target;
    for (const part of rel.split(sep)) {
      current = join(current, part);
      if (!existsSync(current)) {
        try { lstatSync(current); } catch { continue; }
      }
      if (lstatSync(current).isSymbolicLink()) throw new Error(`${label} import cannot use a symlink destination`);
    }
  }

  function validate(root, source, expectedRevision = null, allowLegacy = false) {
    if (expectedRevision && git(root, ['rev-parse', 'HEAD']) !== expectedRevision) throw new Error(`${label} checkout does not match its recorded revision`);
    if (git(root, ['remote', 'get-url', 'origin']) !== source.repository) throw new Error(`${label} checkout has an unexpected origin`);
    if (git(root, ['status', '--porcelain'])) throw new Error(`${label} checkout has local changes; preserve or resolve them before importing`);
    for (const file of source.required_files) {
      let path = join(root, file);
      // Only installed revisions may use the old layout; incoming revisions must satisfy the current contract.
      if (allowLegacy && !existsSync(path) && legacyFiles[file]) path = join(root, legacyFiles[file]);
      safePath(root, path);
      if (!existsSync(path) || !lstatSync(path).isFile()) throw new Error(`${label} source is missing ${file}`);
    }
  }

  function checkSkillLink(target, enginePath) {
    for (const [host, entries] of Object.entries(skills)) {
      const parent = join(target, host, 'skills');
      safePath(target, parent);
      for (const [name, path] of Object.entries(entries)) {
        const link = join(parent, name);
        let entry;
        try { entry = lstatSync(link); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
        if (!entry.isSymbolicLink() || resolve(parent, readlinkSync(link)) !== resolve(enginePath, path)) {
          throw new Error(`Existing ${label} skill would be replaced; preserve it before importing`);
        }
      }
    }
  }

  function nativeLinks(target, path) {
    checkSkillLink(target, path);
    const links = Object.fromEntries(Object.entries(skills).map(([host, entries]) => [host, Object.fromEntries(Object.entries(entries).map(([name, rel]) => {
      const file = target && join(target, host, 'skills', name);
      return [name, file && existsSync(file) && lstatSync(file).isSymbolicLink() && realpathSync(file) === realpathSync(join(path, rel)) ? 'linked' : 'unchecked'];
    }))]));
    if (requireLinks && Object.values(links).some((entries) => Object.values(entries).includes('unchecked'))) throw new Error(`${label} native skill links are missing; apply the import to repair them`);
    return links;
  }

  function status(brainRoot, source, target = null) {
    const path = join(brainRoot, `integrations/${id}`);
    const recordPath = join(brainRoot, `integrations/${id}.json`);
    try {
      source = resolveSource(brainRoot, source);
      if (!source.repository) return notConfigured(brainRoot, source);
      if (!existsSync(path)) return { status: 'not_installed', repository: source.repository, branch: source.branch, path };
      safePath(resolve(brainRoot), path);
      safePath(resolve(brainRoot), recordPath);
      const record = existsSync(recordPath) ? JSON.parse(readFileSync(recordPath, 'utf8')) : null;
      validate(path, source, record?.revision);
      const revision = git(path, ['rev-parse', 'HEAD']);
      const link = target && join(target, '.agents/skills', id);
      const codexSkill = link && existsSync(link) && lstatSync(link).isSymbolicLink() && realpathSync(link) === realpathSync(path) ? 'linked' : 'unchecked';
      const skillLinks = target ? nativeLinks(realpathSync(target), realpathSync(path)) : {};
      return { status: 'installed', repository: source.repository, branch: source.branch, revision, checked_at: record?.checked_at || null, path, hosts: source.hosts, codex_skill: codexSkill, skill_links: skillLinks };
    } catch (error) {
      return { status: 'unchecked', repository: source?.repository || null, branch: source?.branch || defaultSource.branch, path, reason: error.message };
    }
  }

  function install(target, apply = false, source) {
    target = realpathSync(resolve(target));
    const config = JSON.parse(readFileSync(join(target, '.product-bench-install.json'), 'utf8'));
    const brainRoot = resolve(target, config.brain_dir);
    safePath(target, brainRoot);
    source = resolveSource(brainRoot, source);
    if (!source.repository) return notConfigured(brainRoot, source);
    if (typeof source.repository !== 'string' || !source.repository.trim() || source.repository.startsWith('-')) throw new Error(`${label} requires a valid upstream repository`);
    if (!/^[a-zA-Z0-9][a-zA-Z0-9/_-]*$/.test(source.branch || '')) throw new Error(`${label} requires a valid upstream branch`);
    const path = join(brainRoot, `integrations/${id}`);
    safePath(target, path);
    checkSkillLink(target, path);
    const recordPath = join(brainRoot, `integrations/${id}.json`);
    safePath(target, recordPath);
    let currentRevision = null;
    if (existsSync(path)) {
      const record = existsSync(recordPath) ? JSON.parse(readFileSync(recordPath, 'utf8')) : null;
      validate(path, source, record?.revision, true);
      currentRevision = git(path, ['rev-parse', 'HEAD']);
    }
    // Read the remote head without changing the installed checkout, even for previews.
    const ref = `refs/heads/${source.branch}`;
    const remote = git(target, ['ls-remote', '--heads', '--', source.repository, ref]);
    const [revision, returnedRef] = remote.split(/\s+/);
    if (!/^[a-f0-9]{40}$/.test(revision || '') || returnedRef !== ref) throw new Error(`${label} upstream branch is unavailable: ${source.branch}`);
    if (!apply) return { status: 'preview_only', repository: source.repository, branch: source.branch, current_revision: currentRevision, revision, changed: currentRevision !== revision, path, hosts: source.hosts, message: previewMessage };
    // Snapshot only declared native links. Upstream code may have other side effects,
    // which are outside this checkout/receipt/link rollback contract.
    const priorLinks = Object.entries(skills).flatMap(([host, entries]) => Object.entries(entries).map(([name, rel]) => {
      const link = join(target, host, 'skills', name);
      let prior = null;
      try { prior = readlinkSync(link); } catch (error) { if (error.code !== 'ENOENT') throw error; }
      return { link, prior, destination: resolve(path, rel) };
    }));
    const parent = dirname(path);
    mkdirSync(parent, { recursive: true });
    if (currentRevision !== revision) {
      const scratch = mkdtempSync(join(parent, `.${id}-import-`));
      try {
        const checkout = join(scratch, 'checkout');
        execFileSync('git', ['clone', '--no-local', '--no-checkout', '--', source.repository, checkout], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
        git(checkout, ['checkout', '--detach', revision]);
        validate(checkout, source, revision);
        if (currentRevision) {
          // Refuse rewritten upstream history or local commits that aren't upstream ancestors.
          try { git(checkout, ['merge-base', '--is-ancestor', currentRevision, revision]); }
          catch { throw new Error(`${label} update is not a fast-forward; installed checkout preserved`); }
          git(path, ['fetch', '--no-tags', checkout, revision]);
          // Avoid overwriting local files, including ignored files created by the engine.
          git(path, ['checkout', '--no-overwrite-ignore', '--detach', revision]);
        } else renameSync(checkout, path);
      } finally {
        rmSync(scratch, { recursive: true, force: true });
      }
    }
    try {
      execFileSync('python3', [join(path, installer), '--into', target], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      validate(path, source, revision);
      nativeLinks(target, path);
      const recordScratch = mkdtempSync(join(parent, `.${id}-record-`));
      try {
        const stagedRecord = join(recordScratch, 'record.json');
        writeFileSync(stagedRecord, JSON.stringify({ repository: source.repository, branch: source.branch, revision, checked_at: new Date().toISOString() }, null, 2) + '\n');
        renameSync(stagedRecord, recordPath);
      } finally { rmSync(recordScratch, { recursive: true, force: true }); }
    } catch (error) {
      const rollbackErrors = [];
      if (currentRevision && currentRevision !== revision) {
        try { git(path, ['checkout', '--no-overwrite-ignore', '--detach', currentRevision]); }
        catch (rollback) { rollbackErrors.push(rollback.message); }
      }
      for (const { link, prior, destination } of priorLinks) {
        try {
          let current = null;
          try { current = readlinkSync(link); } catch (readError) { if (readError.code !== 'ENOENT') throw readError; }
          if (current === prior) continue;
          if (current !== null && resolve(dirname(link), current) !== destination) throw new Error(`Cannot safely restore modified native link: ${link}`);
          if (current !== null) rmSync(link);
          if (prior !== null) { mkdirSync(dirname(link), { recursive: true }); symlinkSync(prior, link, 'dir'); }
        } catch (rollback) { rollbackErrors.push(rollback.message); }
      }
      if (!currentRevision) {
        try { rmSync(path, { recursive: true, force: true }); }
        catch (rollback) { rollbackErrors.push(rollback.message); }
      }
      if (rollbackErrors.length) throw new Error(`${label} update failed and rollback needs attention: ${error.message}; ${rollbackErrors.join('; ')}`, { cause: error });
      throw error;
    }
    return { ...status(brainRoot, source, target), previous_revision: currentRevision, changed: currentRevision !== revision };
  }

  function refresh(target, apply = false, source) {
    const config = JSON.parse(readFileSync(join(resolve(target), '.product-bench-install.json'), 'utf8'));
    const brainRoot = resolve(target, config.brain_dir);
    const current = status(brainRoot, source, target);
    if (['not_installed', 'not_configured'].includes(current.status)) return current;
    try { return install(target, apply, source); }
    catch (error) { return { ...current, status: 'skipped', changed: false, reason: error.message }; }
  }

  return { status, install, refresh };
}
