// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { checkDestination, installedRoot } from './path-safety.mjs';

function setup(target) {
  const root = installedRoot(target);
  const config = JSON.parse(readFileSync(checkDestination(target, join(root, 'config.json')), 'utf8')).analytics;
  return { root, config };
}

function safeName(name) {
  if (!/^[a-z][a-z0-9-]{0,63}$/.test(name || '')) throw new Error('Definition name must be lowercase letters, digits and hyphens');
  return name;
}
function savedDir(target) { return checkDestination(target, join(setup(target).root, 'analytics/saved')); }

export function saveAnalyticsDefinition(target, definition) {
  const name = safeName(definition.name);
  const provider = definition.provider || setup(target).config.provider;
  if (!['fixture', 'bigquery', 'postgres', 'posthog'].includes(provider)) throw new Error('Unsupported analytics provider');
  if (provider === 'fixture' && !['schema', 'event_count', 'active_users', 'activation_rate'].includes(definition.metric)) throw new Error('Fixture definition needs a known metric');
  if (provider !== 'fixture') validateReadOnlySQL(definition.sql || '');
  const clean = { name, description: String(definition.description || ''), provider, metric: provider === 'fixture' ? definition.metric : null, sql: provider === 'fixture' ? null : definition.sql, saved_at: new Date().toISOString() };
  const dir = savedDir(target);
  const path = checkDestination(target, join(dir, `${name}.json`));
  mkdirSync(dir, { recursive: true });
  try { readFileSync(path); throw new Error(`Definition already exists: ${name}`); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  writeFileSync(path, JSON.stringify(clean, null, 2) + '\n');
  return clean;
}

export function listAnalyticsDefinitions(target) {
  const dir = savedDir(target);
  let names;
  try { names = readdirSync(dir).filter((name) => name.endsWith('.json')); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  return names.map((name) => JSON.parse(readFileSync(checkDestination(target, join(dir, name)), 'utf8'))).map(({ name, description, provider, metric, saved_at }) => ({ name, description, provider, metric, saved_at }));
}

export async function runAnalyticsDefinition(target, name, options = {}) {
  const definition = JSON.parse(readFileSync(checkDestination(target, join(savedDir(target), `${safeName(name)}.json`)), 'utf8'));
  const result = await analyticsQuery(target, { ...options, provider: definition.provider, ...(definition.provider === 'fixture' ? { metric: definition.metric } : { sql: definition.sql }) });
  return { name, executed_at: new Date().toISOString(), provider: definition.provider, result };
}

export async function runAnalyticsDashboard(target, names, options = {}) {
  if (!Array.isArray(names) || !names.length) throw new Error('Dashboard needs a nonempty definitions array');
  const results = [];
  for (const name of names) results.push(await runAnalyticsDefinition(target, name, options));
  return { executed_at: new Date().toISOString(), from: options.from || null, to: options.to || null, results };
}

export function validateReadOnlySQL(sql) {
  const trimmed = sql.trim().replace(/;\s*$/, '');
  if (!/^(?:SELECT|WITH)\b/i.test(trimmed)) throw new Error('Only SELECT or WITH queries are allowed');
  if (trimmed.includes(';')) throw new Error('Multiple statements are not allowed');
  if (/\b(?:INSERT|UPDATE|DELETE|MERGE|CREATE|ALTER|DROP|TRUNCATE|GRANT|REVOKE|CALL|COPY|EXPORT|EXECUTE)\b/i.test(trimmed)) throw new Error('Potentially modifying SQL is not allowed');
  return trimmed;
}

export function queryFixture(root, { metric, from = '0000-01-01', to = '9999-12-31', account = null }) {
  const events = JSON.parse(readFileSync(join(root, 'analytics/example-events.json'), 'utf8'));
  for (const date of [from, to]) {
    const parsed = new Date(`${date}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) throw new Error('Fixture windows require exact calendar dates YYYY-MM-DD');
  }
  if (from > to) throw new Error('Fixture window range is reversed');
  const rows = events.filter((row) => row.at.slice(0, 10) >= from && row.at.slice(0, 10) <= to && (!account || row.account === account));
  if (metric === 'schema') return { columns: ['at', 'account', 'user', 'event'], fictional: true };
  if (metric === 'event_count') return { value: rows.length, denominator: rows.length, fictional: true };
  if (metric === 'active_users') return { value: new Set(rows.map((row) => row.user)).size, denominator: rows.length, fictional: true };
  if (metric === 'activation_rate') {
    const signedUp = new Set(rows.filter((row) => row.event === 'signed_up').map((row) => row.user));
    const activated = new Set(rows.filter((row) => row.event === 'activated').map((row) => row.user));
    const numerator = [...signedUp].filter((user) => activated.has(user)).length;
    return { value: signedUp.size ? numerator / signedUp.size : null, numerator, denominator: signedUp.size, fictional: true };
  }
  throw new Error(`Unknown fixture metric: ${metric}`);
}

export async function analyticsQuery(target, options) {
  const { root, config } = setup(target);
  const provider = options.provider || config.provider;
  if (provider === 'fixture') {
    checkDestination(target, join(root, 'analytics/example-events.json'));
    return queryFixture(root, options);
  }
  const sql = options['sql-file'] ? readFileSync(resolve(options['sql-file']), 'utf8') : options.sql;
  if (!sql) throw new Error('Live analytics requires --sql or --sql-file');
  const safeSQL = validateReadOnlySQL(sql);
  if (provider === 'bigquery') {
    const project = config.project;
    if (!project) throw new Error('Set analytics.project in Product Bench config');
    const maxBytes = Number(config.max_bytes || 1073741824);
    const args = ['query', '--use_legacy_sql=false', '--format=json', `--project_id=${project}`, `--maximum_bytes_billed=${maxBytes}`, safeSQL];
    const output = execFileSync('bq', args, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    return { provider, query: safeSQL, result: JSON.parse(output), max_bytes: maxBytes };
  }
  if (provider === 'postgres') {
    if (!process.env.PGHOST || !process.env.PGUSER) throw new Error('Set PGHOST and PGUSER; use a read-only database role');
    const statement = `BEGIN READ ONLY; SET LOCAL statement_timeout = '30s'; ${safeSQL}; ROLLBACK;`;
    const output = execFileSync('psql', ['--no-psqlrc', '--csv', '--set=ON_ERROR_STOP=1', '--command', statement], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    return { provider, query: safeSQL, result_csv: output };
  }
  if (provider === 'posthog') {
    const project = config.project;
    const host = config.host || 'https://us.posthog.com';
    const token = process.env.POSTHOG_PERSONAL_API_KEY;
    if (!project || !token) throw new Error('Set analytics.project and POSTHOG_PERSONAL_API_KEY');
    if (!/^https:\/\/[a-z0-9.-]+$/i.test(host)) throw new Error('PostHog host must be a HTTPS origin');
    const response = await fetch(`${host}/api/projects/${encodeURIComponent(project)}/query/`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query: { kind: 'HogQLQuery', query: safeSQL } }) });
    if (!response.ok) throw new Error(`PostHog query failed: HTTP ${response.status}`);
    return { provider, query: safeSQL, result: await response.json() };
  }
  throw new Error(`Unsupported analytics provider: ${provider}`);
}
