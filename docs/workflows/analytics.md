## Procedure

Resolve `brain_dir` and output location from `.product-bench-install.json`; read `<brain_dir>/config.json` analytics settings and declared metric/constraint context. Read the seven installed analytics guides for nontrivial questions: question definition, schema, denominators, retention, funnels, segmentation and reporting. The supported runtime is `node <brain_dir>/runtime/product-bench.mjs <action> --target <repo> ...`. Use the **actual installation target** for every action; never create a shadow install to bypass permissions. Fixture data is fictional and demonstrates mechanics only.

### Shared query pipeline

1. Identify decision, metric, actor, event, segment/cohort, unit, window/timezone, exclusions and comparator. Ask only ambiguity that changes the result. Separate event counts, distinct people and accounts; define active/activated from reviewed behavior, not login by default.
2. Inspect actual schema and instrumentation before SQL: types, event meaning, business-event vs ingestion time, joins, identity mapping, deleted/test/bot records, partitions and nested fields. Missing access stays unchecked. A prose constraint document is not proof a column exists.
3. Use supported provider: fixture, BigQuery, PostgreSQL or PostHog. Verify configured credentials/access in this session without printing secrets. Live SQL must be one `SELECT`/`WITH` statement. Use least-privilege read-only source credentials; the SQL validator is not a substitute for those permissions. Partition-filter relevant tables, bound dates, cap output (normally LIMIT 1000 or less), avoid unnecessary personal rows. BigQuery config enforces `max_bytes`; PostgreSQL runs a read-only transaction with 30-second timeout; PostHog queries the configured HTTPS origin. Do not invent `--force`, legacy cache flags, dry-run cost estimation or provider authentication commands.
4. Execute through the installed runtime and capture actual command/query, provider, execution timestamp, data freshness and returned output. Runtime does not automatically write Markdown run records; save a requested report beneath the configured output directory and keep actual result provenance. Do not claim cache-control flags or automatic visualizations exist.
5. Report answer, numerator/denominator, counts, uncertainty, instrumentation limits and decision implication. A count is a count, not a rate: the fixture `active_users` result's `denominator` is the number of event rows inspected, not a population denominator; label it event rows and do not divide distinct users by it. Zero eligible denominator -> unavailable/null, not 0%. A truncation/LIMIT affects interpretation. Compare like-for-like cohort definitions; activity is not outcome and association is not causation.

### Seven modes and supported commands

- **ask:** execute `analytics --provider fixture --metric active_users|event_count|activation_rate|schema [--from date --to date --account ID]`, or live `analytics --provider bigquery|postgres|posthog --sql-file <file>` (`--sql` is also supported). Live SQL must carry its own date/account filters; runtime `--from/--to/--account` filter only the fixture and **do not bind live SQL**.
- **save:** create a reviewed definition JSON with `name`, `description`, `provider`, and fixture `metric` or live `sql`; run `analytics-save --file <definition.json>`. Names use lowercase letters/digits/hyphens starting with a letter, at most 64 characters. The runtime refuses overwrite of an existing name. Verify `analytics-list` on this same target, then `analytics-run --name <name>` once. Saved definitions live in `<brain_dir>/analytics/saved`; do not claim arbitrary extra schema/metric-reference fields are persisted by the runtime. Put extended methodology in the accompanying reviewed report/description.
- **run:** inspect the saved definition and execute `analytics-run --name <name>`. Each invocation actually queries the provider; an old pasted result is not a rerun. Inspect whether fixed SQL window needs a reviewed revision before comparing periods.
- **list:** run `analytics-list`, show actual names/descriptions/provider/metric/save time, and identify suitable bundles without inventing definitions.
- **dashboard:** review a JSON `{"definitions":["name-a","name-b"]}` and run `analytics-dashboard --file <file>`. Definitions execute sequentially; consolidate one business question. Audit time windows inside live SQL, cohort units, denominator compatibility and per-query execution times. `from/to` metadata alone cannot enforce a shared live SQL window. Summarize sections, two or three cross-section takeaways, anomalies and unavailable slices. Visuals may be produced from actual results with available tools, with source timestamps and no credentials in client code; no implicit scheduling.
- **schema:** fixture uses `analytics --provider fixture --metric schema`. Live schema inspection uses a verified read-only catalog query or actual configured provider capability; no separate `analytics-schema` action exists. Show verified field/type/meaning/partition/freshness/access limits, and unresolved instrumentation.
- **account-health:** a portable one-account diagnostic **orchestrated by this workflow**, not a new CLI action. Resolve an identifier to one actual account using scoped schema; zero matches stops, multiple matches requires disambiguation. Review applicable dimensions and available source mappings before querying. All unavailable or inapplicable dimensions are explicit; do not impose AI-coding tables on another product.

### Visualization when it helps the decision

Use actual returned rows: time plus a numeric measure -> time-series line/bar; group distribution -> horizontal bar; one aggregate -> compact stat/table; unrelated multiple columns -> sortable table. Include the readable source rows, unit, metric definition, query execution time and data-through time. Show null/unavailable as a gap, never a zero; label truncated or sampled results. For dashboards, keep each section's window/denominator visible and use tabs/collapsing only when they improve reading. Use one stable artifact title when updating a session visual and put freshness inside it. No client-side credentials or live external fetches: embed only approved shareable result rows. A requested visual is an assistant-produced artifact, not an `--artifact` runtime flag or a configured auto-refresh loop. A later refresh must actually rerun the query.

### Account-health diagnostic depth

Use the following transferable dimensions as an applicability checklist; adapt their names and measures to the configured product:

| Dimension | Question and evidence guard |
|---|---|
| Account metadata/warmup | When did real connection/first activity start? Separate provisioned-row date from live-value exposure |
| Source/connector freshness | Is each expected feed current relative to its verified production cadence? |
| Identity linkage | What fraction of relevant identities is mapped? Missing bridge limits joins, not every product action |
| Adoption funnel | Eligible team -> invited -> joined -> connected -> first value; explicit population at each step |
| Live processing freshness | Distinguish live activity from imported history; cohort eligibility and latest ingestion both matter |
| Processing/scoring completeness | Eligible accepted records pending beyond actual job delay; filtered/ineligible/in-flight is not failed |
| Client/session health | Heartbeat/update signal when available; row creation time is not current heartbeat |
| Capture integrity | Compare client health, upload/ingestion stream and independent work signal; distinguish capture gaps from inactivity |
| Core work/outcome snapshot | Relevant operational events/outcomes over a known window, not assumed code commits |
| Task/work-management snapshot | Sync volume/freshness; absent per-person rollups are unavailable, not zero |
| Attribution/coverage | Live eligible outcomes with valid matching / eligible outcomes after processing delay; avoid backfill dilution |
| Engagement/value snapshot | Actual active people and meaningful surface events; headline volume may be historical import |
| Automation/test noise | Excluded bot/test/service accounts; remaining noise and mapping limits |

Classify a dimension as **finding**, **snapshot/meta**, **unavailable**, or **not applicable**. Findings are specific observed conditions with actual cutoff and query source; do not fabricate a universal health score or traffic-light threshold. Empty verified finding results mean no finding at that timestamp; failed query means unavailable. Cutoffs must reflect measured cadence (consider at least two cycles), warmup and processing delay. Snapshot counts are context, not incidents.

Measure recency on the correct axis: business time for user activity, ingestion time for pipeline freshness, heartbeat update for capture health. Split imported backfill from live usage before calling adoption healthy; exclude fresh in-flight rows when judging processing failure. Reconcile live cohort/attribution denominators. If capture disappears while an independent work signal continues, investigate a capture blind spot; healthy client with no uploads may reflect genuine product/workflow differences and remains ambiguous. Account linkage gaps can make independent checks impossible; disclose that blind spot. Query all partitions spanning the window, including calendar boundaries; do not hard-code a now-stale quarter.

Run fresh queries and retain per-query timestamps; the header carries first/last execution time and a race-condition caveat. Re-run transient findings before declaring an incident. Compare a prior report only if the same account, cohorts, cutoffs and sources are compatible. This is diagnostic output: no automatic remediation, external posts, scheduling or account changes.

## Output template

```markdown
# Analytics: [business question or account health]
Provider/status: [verified live / fictional fixture / unavailable]
Window/timezone; cohort; unit; exclusions: ...
Executed at: ... | Data through: ... | Actual query/definition: ...
## Results
| Field | Value |
|---|---|
| Metric/dimension | |
| Value | |
| Numerator | |
| Denominator | |
| Timestamp | |
| Status/limits | |
## Interpretation
[Decision implication; comparison; anomalies without causal overclaim]
## Account health [if selected]
Connection/first-value basis: ... | Warmup: ...
Snapshot caveat: findings can self-resolve; re-query before incident.
Findings: [query/source, cutoff basis, actual rows, per-query timestamp]
Snapshots: [applicable diagnostic context]
Unavailable/not applicable: [dimension and reason]
Prior comparison: [compatible deltas or no comparator]
## Caveats and next questions
[Sample/unit issues; capture/instrumentation gaps; next decision]
Report/run evidence: [actual configured path if saved]
```

## Worked example

**Fictional fixture illustration:** five distinct users have ten events; three signed up and two of those activated. Active users is five (event-row count ten is not a person denominator). Activation is **2/3**, restricted to signed-up users; an activation without signup does not inflate that cohort. For a fictional account diagnostic, 900 imported records and 20 live records cannot be called 920 current uses. A quiet capture stream with an active independent scheduling-work signal is a capture-risk hypothesis, not automatic churn. A 20-minute-old pending record on a verified hourly processing job is in-flight, not failed. Any unsupported connector/identity/capture dimensions are unavailable, not invented zeros.

## Quality checks

- Every number has a real executed source, cohort, window, unit and denominator; fixture is labeled fictional.
- Live schema and credentials are verified without exposing secrets; queries stay read-only and bounded.
- Save/list/run use one actual target; a saved definition is rerun and its limitations retained.
- Dashboard SQL windows and units are reconciled, not merely labeled consistent.
- Account health separates warmup, live/backfill, processing delay, capture ambiguity and unobserved dimensions.

## Anti-patterns

- Guessing fields/provider project, copying private account queries, or passing unsupported cache/cost flags.
- Treating fixture results as business evidence, ingestion time as user activity, or backfill as adoption.
- Counting filtered inputs or recent in-flight rows as pipeline failures.
- Calling absent data churn, a stale client-row creation timestamp heartbeat failure, or linkage gaps universal blockers.
- Posting reports, modifying account data or promising scheduled refresh without authorization/runtime support.
