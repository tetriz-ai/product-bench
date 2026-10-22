// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { execFileSync } from 'node:child_process';
import { mkdtempSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Pack locally with an empty cache. Exercise the same entrypoints shipped in releases.
export function packedCLI() {
  const scratch = realpathSync(mkdtempSync(join(tmpdir(), 'pb-example-pack-')));
  const cleanup = () => rmSync(scratch, { recursive: true, force: true });
  try {
    const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const result = JSON.parse(execFileSync(npm, ['pack', '--ignore-scripts', '--json', '--pack-destination', scratch], {
      cwd: fileURLToPath(new URL('../', import.meta.url)), encoding: 'utf8',
      env: { ...process.env, npm_config_cache: join(scratch, 'npm-cache') },
    }));
    const [pack] = Array.isArray(result) ? result : Object.values(result);
    execFileSync('tar', ['-xzf', join(scratch, pack.filename), '-C', scratch]);
    const run = (entry, args, cwd = scratch) => execFileSync(process.execPath, [join(scratch, 'package', entry), ...args], { cwd, encoding: 'utf8' });
    return { run, cleanup, scratch };
  } catch (error) { cleanup(); throw error; }
}
