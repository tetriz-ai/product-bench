// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, chmodSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { init } from './installer.mjs';
import { analyticsQuery } from './analytics.mjs';

async function fixture(fn) {
  const root = mkdtempSync(join(tmpdir(), 'pb-provider-')); const bin = join(root, 'bin'); mkdirSync(bin);
  init({ target: root, brainDir: '.product-bench', apply: true });
  const names = ['PATH', 'PGHOST', 'PGUSER', 'POSTHOG_PERSONAL_API_KEY']; const prior = Object.fromEntries(names.map((key) => [key, process.env[key]]));
  const fetch = globalThis.fetch;
  try {
    process.env.PATH = bin; delete process.env.PGHOST; delete process.env.PGUSER; delete process.env.POSTHOG_PERSONAL_API_KEY;
    globalThis.fetch = async () => { throw new Error('Unexpected network request in offline test'); };
    await fn(root, bin);
  } finally { globalThis.fetch = fetch; for (const key of names) if (prior[key] === undefined) delete process.env[key]; else process.env[key] = prior[key]; rmSync(root, { recursive: true, force: true }); }
}
function config(root, analytics) { const path = join(root, '.product-bench/config.json'); const value = JSON.parse(readFileSync(path, 'utf8')); value.analytics = analytics; writeFileSync(path, JSON.stringify(value)); }
function fake(bin, name, root, fail = false) {
  const path = join(bin, name);
  writeFileSync(path, `#!${process.execPath}\nrequire('node:fs').writeFileSync(${JSON.stringify(join(root, 'args.json'))},JSON.stringify(process.argv.slice(2)));process.stdout.write(${JSON.stringify(name === 'bq' ? '[{"value":1}]' : 'value\n1\n')});process.exit(${fail ? 2 : 0});\n`); chmodSync(path, 0o755);
}

test('BigQuery fake receives read-only reviewed SQL and project/cost guards, with explicit failures', () => fixture(async (root, bin) => {
  config(root, { provider: 'bigquery' }); await assert.rejects(analyticsQuery(root, { sql: 'SELECT 1' }), /analytics.project/);
  config(root, { provider: 'bigquery', project: 'example-project', max_bytes: 12345 }); fake(bin, 'bq', root);
  const result = await analyticsQuery(root, { sql: 'SELECT 1;', from: '2026-01-01' });
  assert.equal(result.max_bytes, 12345); assert.deepEqual(result.result, [{ value: 1 }]);
  assert.deepEqual(JSON.parse(readFileSync(join(root, 'args.json'))), ['query', '--use_legacy_sql=false', '--format=json', '--project_id=example-project', '--maximum_bytes_billed=12345', 'SELECT 1']);
  fake(bin, 'bq', root, true); await assert.rejects(analyticsQuery(root, { sql: 'SELECT 1' }), /Command failed/);
  await assert.rejects(analyticsQuery(root, {}), /requires --sql/);
  await assert.rejects(analyticsQuery(root, { sql: 'DROP TABLE items' }), /SELECT|modifying/);
}));

test('PostgreSQL fake runs a bounded read-only transaction and propagates failures', () => fixture(async (root, bin) => {
  config(root, { provider: 'postgres' }); await assert.rejects(analyticsQuery(root, { sql: 'SELECT 1' }), /PGHOST and PGUSER/);
  process.env.PGHOST = 'fixture.invalid'; process.env.PGUSER = 'fixture'; fake(bin, 'psql', root);
  const result = await analyticsQuery(root, { sql: 'SELECT 1' }); assert.equal(result.result_csv, 'value\n1\n');
  const args = JSON.parse(readFileSync(join(root, 'args.json'))); assert.deepEqual(args.slice(0, 3), ['--no-psqlrc', '--csv', '--set=ON_ERROR_STOP=1']);
  assert.equal(args[4], "BEGIN READ ONLY; SET LOCAL statement_timeout = '30s'; SELECT 1; ROLLBACK;");
  fake(bin, 'psql', root, true); await assert.rejects(analyticsQuery(root, { sql: 'SELECT 1' }), /Command failed/);
}));

test('PostHog offline fake verifies auth/query inputs and HTTP, JSON and network failures', () => fixture(async (root) => {
  config(root, { provider: 'posthog', project: 'example project', host: 'https://analytics.example.invalid' });
  await assert.rejects(analyticsQuery(root, { sql: 'SELECT 1' }), /POSTHOG_PERSONAL_API_KEY/);
  process.env.POSTHOG_PERSONAL_API_KEY = 'fixture-only';
  let request;
  globalThis.fetch = async (url, options) => { request = { url, options }; return { ok: true, json: async () => ({ results: [[1]] }) }; };
  assert.deepEqual((await analyticsQuery(root, { sql: 'SELECT 1' })).result, { results: [[1]] });
  assert.equal(request.url, 'https://analytics.example.invalid/api/projects/example%20project/query/'); assert.equal(request.options.headers.Authorization, 'Bearer fixture-only');
  assert.deepEqual(JSON.parse(request.options.body), { query: { kind: 'HogQLQuery', query: 'SELECT 1' } });
  globalThis.fetch = async () => ({ ok: false, status: 401 }); await assert.rejects(analyticsQuery(root, { sql: 'SELECT 1' }), /HTTP 401/);
  globalThis.fetch = async () => ({ ok: true, json: async () => { throw new Error('Malformed fixture JSON'); } }); await assert.rejects(analyticsQuery(root, { sql: 'SELECT 1' }), /Malformed/);
  globalThis.fetch = async () => { throw new Error('Fixture transport unavailable'); }; await assert.rejects(analyticsQuery(root, { sql: 'SELECT 1' }), /transport/);
  config(root, { provider: 'posthog', project: 'fixture', host: 'http://analytics.example.invalid' }); await assert.rejects(analyticsQuery(root, { sql: 'SELECT 1' }), /HTTPS/);
  config(root, { provider: 'unknown' }); await assert.rejects(analyticsQuery(root, { sql: 'SELECT 1' }), /Unsupported/);
}));
