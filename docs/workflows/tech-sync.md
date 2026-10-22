## Procedure

Resolve context/output paths from `.product-bench-install.json`. Define the approved repository/source, actual lookback period or commit range, components and technical-context baseline. Use registered source scope and available read capabilities; no hard-coded organization/repository, stack, subagent file or eval platform is assumed. Inspect code/change evidence before proposing constraint updates. If scope is absent, obtain the consequential repository/path choice rather than searching broadly.

### Reconcile engineering reality

Read relevant commits, merged PR diffs and current source for dependencies/build/runtime, integration/connector behavior, data flow/processing cadence, schema/API contracts, flags/rollout, authentication/authorization, permissions/privacy/retention and model/prompt/scoring logic. Select applicable categories from this product; do not impose a queue, framework or language. Trace what actually changed and whether it is merged, deployed, tested or merely proposed. A dependency name proves presence, not a capability's operational readiness.

For every discrepancy compare a documented claim with exact file/line/commit or primary engineering evidence. State old/new behavior, affected product assumption, integration/data/permission impact and necessary action. Distinguish confirmed absence, unavailable repo and inconclusive inspection. Preserve a good existing constraint when the new source cannot be checked. Map changed assumptions to actual supplied/in-scope specs and hypotheses; do not sweep unrelated repositories for references. A flagged affected spec needs the obsolete assumption and consequence, not just its filename.

Model/prompt/output-schema changes trigger review of `pb-evals` contract coverage, dataset experiments and calibration/nonregression policy. Show actual evidence of the gate or its missing verification. Do not import another company's mandatory thresholds or assume a merged change is compliant. Rollout and recovery mechanisms must be read, not guessed from familiar patterns.

### Optional evaluation health sync

When a configured platform/source is authorized and accessible, inspect existing evaluator/dataset definitions, approved thresholds, sample/uncertainty policy and calibration cadence; then fetch complete current records:

- Dataset item/labeled/held-out counts against actual minimum **per evaluator**, version and real/synthetic split when available.
- Latest evaluable pass/fail/uncertain/N/A counts and sample window; human agreement is separate from pass rate.
- Comparable prior period and delta in **percentage points**, or the actual score's defined units. Never mix a 0–1 ratio, 0–10 score and percent threshold.
- Annotation backlog, calibration/experiment timestamp, relevant model/prompt/contract versions and regression target.

Classify **healthy** only if adequate coverage/dataset, approved alignment/quality thresholds and current calibration all hold; **warning** for overdue calibration or inadequate data; **blocked** for observed gate failure/regression; **not configured**, **pending feature**, or **unchecked** for missing setup/access. Unknown coverage is not healthy. Separate platform transport failure from low evaluator quality: a failed API check preserves existing health content/date, marks unchecked and does not fail independent code reconciliation. Missing labels cannot be manufactured from automatic scores.

Prepare a concise health evidence table as part of the draft or a proposed edit to existing relevant metrics/constraints context; no standalone `health.md`, eval registry or API secrets are assumed. Use configured secret mechanisms without printing credentials; no private platform env-variable contract is required by Product Bench.

### Review and durable updates

Produce paste-ready exact changes to technical constraints plus any relevant metric/context updates. Display old/new text, source and affected behavior before writing reviewed context. If registered observations are being synced, use `pb-sync-context` supported staging/acceptance procedure; do not bypass pending-state rules with a direct overwrite. Re-read approved saved edits; only changed reviewed context gets a new freshness date. Keep failures and missing evidence explicit. Offer to update affected specs only within existing authorization; report what was actually inspected/written. No automatic messages, tickets, credential setup, commits or pushes.

## Output template

```markdown
# Technical reconciliation: [scope/date]
Repositories/paths and commits reviewed: [actual range]
Previous context date: ... | Drift: confirmed / none found in inspected scope / unchecked
Access/coverage limits: ...
## Changes to document
| Field | Value |
|---|---|
| Component | |
| Old claim | |
| Verified new behavior/source | |
| Shipped status | |
| Product/spec impact | |
| Action | |
## Proposed context diff
[Exact section-level patch; provenance; freshness change]
## Affected artifacts
| Field | Value |
|---|---|
| Spec/hypothesis | |
| Stale assumption | |
| Consequence | |
| Severity/action | |
## Evaluation health [if applicable]
| Field | Value |
|---|---|
| Feature/evaluator | |
| Dataset/held-out N | |
| Quality/uncertainty | |
| Human agreement/N | |
| Calibration/version | |
| Status/reason | |
Annotation backlog: [actual or unavailable]
Model-contract changes and gate evidence: ...
## Result and next action
[Verified applied changes, pending diffs, unchecked sources, responsible owner if known]
```

## Worked example

**Fictional code reconciliation:** current docs say availability imports run hourly; an approved merged change schedules them every six hours. The report cites the actual fictional scheduling file/commit and marks deployment unverified until release evidence exists. A spec promising “current within an hour” has a stale dependency and needs an explicit product decision. A related model schema adds optional `availability_source`; propose a presence/faithfulness eval row, not a generic quality score. The eval provider cannot be reached, so health is unchecked and prior quality claims/dates remain unchanged. The technical diff is displayed and awaiting review; no successful sync or deployment is claimed.

## Quality checks

- Technical claims cite inspected source/range and separate merged, deployed, tested and proposed states.
- Affected artifacts name the actual invalidated assumption and consequence.
- Eval health distinguishes pass rate, human alignment, coverage, calibration and units.
- Access failure preserves prior knowledge and is disclosed; unknown is never healthy.
- Reviewed diffs and sync pending-state semantics govern durable context/freshness.

## Anti-patterns

- Copying a private stack, repo name or platform key convention into a generic workflow.
- Reading PR titles alone, assuming merged means deployed, or calling uninspected components existing.
- Comparing thresholds with different units or automatically labeled traces with human calibration labels.
- Resetting health/freshness after an outage or silently overwriting pending reviewed updates.
- Invoking nonexistent subagent/scripts, editing specs/trackers or creating incidents without authorization.
