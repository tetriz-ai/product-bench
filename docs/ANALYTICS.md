# Analytics setup

The default `fixture` provider is fictional. It supports `schema`, `event_count`, `active_users`, and `activation_rate`; it does not represent the installed team's product. Set `analytics.provider` in `<brain_dir>/config.json` to `bigquery`, `postgres`, or `posthog` for a live source. Set the provider's project or host there, but store credentials only in your local environment or normal credential manager.

Live SQL is restricted to one SELECT/WITH statement by the CLI. That check is a convenience guard, not a SQL security boundary. Use a read-only database role or token, dataset permissions, query limits, and a review of the selected fields. Avoid querying raw personal data when aggregate answers suffice.

```bash
# Fictional fixture
node .product-bench/runtime/product-bench.mjs analytics --target . --metric activation_rate

# Configured live provider
node .product-bench/runtime/product-bench.mjs analytics --target . --sql-file ./approved-query.sql
```

BigQuery uses the installed `bq` CLI and enforces `analytics.max_bytes`. PostgreSQL uses `psql` with `PGHOST`, `PGUSER`, and a read-only transaction. PostHog uses `POSTHOG_PERSONAL_API_KEY` and its query API. These adapters have no live integration test in this candidate. Verify schema, permissions, and query cost in your environment before relying on results.

The seven guides in [`analytics/`](analytics/) cover question framing, schema discovery, denominator checks, retention, funnels, segmentation, and decision reporting. The `/pb-analytics` workflow uses these principles and must cite the executed query or API request, window, data timestamp, and limitations.

Save a reviewed definition with `analytics-save --file definition.json`, list it with `analytics-list`, and rerun with `analytics-run --name <name>`. A dashboard JSON file contains `{ "definitions": ["name-one", "name-two"] }`; run it with `analytics-dashboard --file dashboard.json`. Saved definitions live under `analytics/saved/`. `--from`, `--to`, and `--account` filter the fictional fixture. Live SQL must express its own window and segment; these options do not parameterize saved live queries. Dashboard metadata does not verify that live definitions use a common window. The CLI never publishes saved definitions automatically.

Saved definition names contain 1–64 lowercase letters, digits, or hyphens and begin
with a letter. The SQL convenience guard rejects every modifying keyword even
inside a string literal, including `COPY`. It is a conservative input screen,
not a SQL parser or permission boundary. Enforce read-only access at the provider.

Installed fixture queries require `analytics/example-events.json` and its ancestors to stay inside the target repository. External or dangling symlinks are rejected before reading. The low-level `queryFixture(root, options)` API accepts an explicitly chosen fixture root for library callers.
