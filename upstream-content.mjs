// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { readFileSync } from 'node:fs';
import { createUpstreamImport } from './upstream-import.mjs';

export const contentSource = JSON.parse(readFileSync(new URL('./payload/content-source.json', import.meta.url), 'utf8'));
const engine = createUpstreamImport(contentSource, {
  id: 'content-engine', label: 'Content Engine', configKey: 'content_source', action: 'content-install',
  installer: 'scripts/install-skills.py',
  legacyFiles: Object.fromEntries(contentSource.required_files.filter(path => path.startsWith('skills/editorial-draft/')).map(path => [path, path.replace('skills/editorial-draft/', 'skills/articleforge/')])), skills: { '.agents': contentSource.skills, '.claude': contentSource.skills }, requireLinks: true,
  previewMessage: 'Imports the full Content Engine -> Blog -> Editorial Draft pipeline and links all three skills for Claude Code and Codex. Does not scan, draft, configure accounts, post, or schedule.'
});
export const contentStatus = engine.status;
export const installContent = engine.install;
export const refreshContent = engine.refresh;
