// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { readFileSync } from 'node:fs';
import { createUpstreamImport } from './upstream-import.mjs';

export const buzzSource = JSON.parse(readFileSync(new URL('./payload/buzz-source.json', import.meta.url), 'utf8'));
const engine = createUpstreamImport(buzzSource, {
  id: 'buzz-engine', label: 'Buzz', configKey: 'buzz_source', action: 'buzz-install',
  installer: 'scripts/install-codex.py', skills: { '.agents': { 'buzz-engine': '.' } },
  previewMessage: 'Refreshes upstream files and links its native Codex skill; does not run Buzz, configure credentials, post, or schedule anything.'
});
export const buzzStatus = engine.status;
export const installBuzz = engine.install;
export const refreshBuzz = engine.refresh;
