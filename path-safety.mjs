// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { lstatSync, realpathSync, readFileSync } from 'node:fs';
import { isAbsolute, join, relative, resolve, sep } from 'node:path';

function outside(path) { return path === '..' || path.startsWith(`..${sep}`) || isAbsolute(path); }

// Preflight both lexical paths and existing links, including dangling leaf links.
// This is a filesystem containment check, not a lock against concurrent path swaps.
export function checkDestination(target, destination) {
  target = resolve(target);
  destination = resolve(destination);
  const path = relative(target, destination);
  if (outside(path)) throw new Error(`Destination escapes target: ${destination}`);
  const boundary = realpathSync(target);
  let current = target;
  for (const part of path.split(sep).filter(Boolean)) {
    current = join(current, part);
    let entry;
    try { entry = lstatSync(current); }
    catch (error) { if (error.code === 'ENOENT') break; throw error; }
    if (!entry.isSymbolicLink()) continue;
    let resolved;
    try { resolved = realpathSync(current); }
    catch { throw new Error(`Cannot safely access a dangling symlink: ${current}`); }
    if (outside(relative(boundary, resolved))) throw new Error(`Destination symlink escapes target: ${current}`);
  }
  return destination;
}

export function installedRoot(target) {
  target = resolve(target);
  const metadata = checkDestination(target, join(target, '.product-bench-install.json'));
  const install = JSON.parse(readFileSync(metadata, 'utf8'));
  if (typeof install.brain_dir !== 'string' || !install.brain_dir || isAbsolute(install.brain_dir)) throw new Error('Product Bench directory must be relative to target');
  const root = checkDestination(target, resolve(target, install.brain_dir));
  if (root === target) throw new Error('Product Bench directory must be a non-root path inside target');
  return root;
}
