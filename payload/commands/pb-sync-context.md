<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, technical-constraints.md, roadmap.md, brand-voice.md, competitors.md, stakeholders.md, gtm.md, metrics.md]
capabilities: [registered sources optional]
-->

# /pb-sync-context

Review changes from registered sources and keep context current.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Source registry and optional source/time filter | Cited proposals, selective decisions, updated health, and command-drift proposals |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Run doctor and list approved sources.
2. Fetch complete pages with overlap; use full-scan hashes when change cursors are absent.
3. Stage proposals through the sync-state CLI before editing context.
4. Apply accepted diffs before marking proposals accepted; unresolved proposals remain pending.
5. A source outage remains unchecked and never refreshes content.

## Source sync procedure

Read the registry and sync-status. For a repo or local source with explicit paths, run source-pull; inspect each changed file before proposing factual context. For MCP or web, verify the capability works in this session and that its approved scope still applies. Fetch every page. Use an overlap window for incremental feeds or a full-scan hash without cursors. A failed or partial fetch stays unchecked.

Stage a complete batch with stable object ID, version, citation, date, target, and summary. Before editing any context, persist the exact proposed diff in the output directory and display its contents in a separate tool result or message before the edit. Writing a diff file alone is not a displayed preview. Show pending proposals grouped by target and source, including contradictions and removals. Review each separately. Apply an accepted context diff first, then mark it accepted with sync-decide --applied. Reject irrelevant proposals explicitly. Leave unresolved ones pending. End with changed context files, actual freshness dates, unavailable sources, and command drift candidates.

## Procedure

Resolve `brain_dir` and output from `.product-bench-install.json`. Run `node <brain_dir>/runtime/product-bench.mjs doctor --target <repo>` and `sync-status --target <repo>`; read `<brain_dir>/sources.json` and existing pending state. A sync is a **complete scoped observation plus selective reviewed updates**, not permission to read all linked sources or rewrite the whole context library. Honor source scope, enabled state, capabilities, period and declared context dependencies.

### Observe registered sources completely

For repo/local sources with explicit approved paths run `source-pull --target <repo> --id <source-id>`; inspect each changed file before interpreting it. The runtime records complete full-scan versions and pending observations, not an automatically applied factual diff. Local paths are absolute; repo paths relative. Its scope/path guards are intentional; do not replace a rejected symlink with an unauthorized broader scan.

For approved MCP/web/manual sources use an actually available logical capability or supplied material. Read all authorized pages, not just a search snippet; preserve object/version/date and exact citation. Incremental sources need an overlap window for edits/late arrivals; no cursor -> full-scan content hash. Fetch every page before setting complete=true. For a failed or partial fetch, call the existing `sync-stage` with `{"source_id":"<registered-id>","complete":false}`. Its expected nonzero result invalidates health only, leaving proposals and observed/reviewed cursors unchanged. Do not stage a fake complete batch. A citation/link inside an allowed document does not expand scope to the linked source. Run independent authorized reads concurrently where available, then inspect all results; no invented tool names or claimed source access.

Classify findings: interviews/notes -> user pain/behavior and safe verbatims; buyer calls -> stakeholders; competitor public primary sources -> competitors; approved code/merged changes -> technical constraints; actual internal decisions/shipped evidence -> product/roadmap/decisions. Deduplicate repeated primary signals across transcripts, docs and chat. Preserve contradictions/removals and evidence strength. A merge proves code landed, not necessarily deployment or customer availability.

### Optional internal capacity/workstream reconciliation

When explicitly registered engineering/project sources cover it, reconcile capacity and workstream evidence within their approved scope:

- Review all relevant merged PRs in a stated window and define code/config/doc exclusions before calculating counts. `active_contributors` = distinct authors; `PRs/week` = eligible merged PRs / (window_days/7); typical changed lines = mean additions+deletions; cycle time = **median** merge_time-create_time (label median honestly); weekly line throughput = PRs/week × mean changed lines. These are rough delivery indicators, not productivity or forecast guarantees. Record bots/generated files/squashes/review delays and proposed assumptions; place ownership/capacity in existing roadmap/stakeholder conventions, not an invented config schema.
- Fetch all authorized project/issue pages, map actual statuses/versions/assignees, deduplicate stable item IDs, and show blocked/in-progress/planned workstreams. Do not equate issue closure with shipped product. Product vs engineering-task filters are explicit reviewed rules; use only reviewed inclusion/exclusion rules and explain unfamiliar items.
- Roadmap reconciliation shows added/removed/moved/status-changed items with stable links. Preserve shipped history and unrelated human notes. If source access fails, keep existing knowledge and mark unchecked; a fallback needs independently authorized scope.

Synthesize product state only from reviewed or proposed evidence: active bets, direction decisions, actual shipped milestones, constraints, exclusions. Do not treat pending proposals as accepted truth.

### Stage actual proposals with supported runtime

For nonlocal collected batches, write JSON beneath configured output:

```json
{
  "source_id":"approved-source-id",
  "complete":true,
  "cursor":"provider-cursor-or-full-scan-hash",
  "items":[{
    "object_id":"stable-provider-object-id",
    "version":"source-version-or-hash",
    "target":"users.md",
    "citation":"exact-source-pointer",
    "summary":"new claim, uncertainty and relevance",
    "observed_at":"ISO timestamp"
  }]
}
```

Run `sync-stage --target <repo> --file <batch.json>`. Source must exist/enabled; target must be approved for it. Runtime deduplicates source/object/version/target and persists pending proposals. `observed_cursor` means complete fetch; `reviewed_cursor` advances only when no pending proposals remain. Do not call staging acceptance or a source check context freshness.

### Preview and selectively apply

Persist **exact context diff** beneath configured output, then display its full proposed changes in a tool result/message **before editing**. A summary or hidden saved diff alone is not review. Group by target/source; show new/corroborated/corrected/removed claims, provenance, contradictions and date changes. Offer selective decisions and preserve undecided proposals. Incorporate plain language without expanding or changing accepted meaning; no external readability skill required.

For accepted proposals: apply reviewed context diff, verify content and then run `sync-decide --target <repo> --id <proposal-id> --decision accepted --applied`. The runtime requires the attestation; the assistant must actually perform and verify the edit, not use `--applied` as a bypass. Reject irrelevant proposals with `--decision rejected`; unresolved stay pending. A write failure leaves proposal pending. Update freshness only in changed context content, not on source-check success.

### Command drift and close-out

Compare affected canonical command behavior with changed evidence: audience, metric, voice, capability, assumptions, obsolete claims and references. Propose specific command edits separately, with review reason; do not silently modify generated workflows or falsely update review dates. Report source coverage/access errors, actual changed files/freshness, pending/rejected IDs, observed/reviewed cursor state and drift candidates. `sync-status` is actual operational state; no nonexistent health dashboard writer is assumed. Git actions and messaging need authorization.

## Output template

```markdown
# Context sync: [period / actual execution time]
## Source coverage
| Field | Value |
|---|---|
| Source/scope | |
| Complete/unchecked | |
| Cursor/hash | |
| Objects/pages | |
| Error/limit | |
## Proposed diffs [display before edit]
[Exact patch per target, citation/date, corroboration and contradiction]
## Decisions and state
| Field | Value |
|---|---|
| Proposal ID | |
| Target | |
| Accepted/applied / rejected / pending | |
| Evidence | |
Observed/reviewed cursors: [actual sync-status]
## Context changes
[Actual verified content changes and freshness dates; no-op unchanged]
## Command drift
[Specific canonical behavior proposal; separate approval]
Next action: [unresolved source/evidence/review; optional authorized Git work]
```

## Worked example

**Fictional registered notes source:** a complete two-page fetch finds a new coordinator pain quote and a repeated copy of an old interview. Stage only the new independent signal with stable object/version/citation. Observed cursor advances; reviewed remains behind while the diff is pending. Display a users-context diff that preserves the old contrary signal. After the user accepts and the saved edit is verified, mark that proposal accepted with `--applied`. A separate competitor source failed, so it remains unchecked and its context date unchanged. A successful fetch with zero semantic context changes updates observation state only; it does not make old user claims freshly validated.

## Quality checks

- Approved scope, actual capabilities, full pages/overlap and source versions are verifiable.
- Raw observation, proposed fact, reviewed edit and cursor state remain distinct.
- Exact diff is persisted **and displayed** before context changes.
- Applied edits precede accepted state; failures/undecided proposals remain pending.
- Freshness reflects real reviewed content updates; capacity and workstream summaries retain limitations.

## Anti-patterns

- Reading linked sources beyond registered scope or calling unavailable connectors.
- First-page-only fetch marked complete; source outage represented as no changes.
- Accepting proposals before applying their diff, or asserting `--applied` without an edit.
- Replacing roadmap history with a raw board dump; confusing PR throughput with individual productivity.
- Resetting freshness/health after mere fetches, auto-committing or sending a sync digest without authorization.

## Plain-English readability dependency

Run the bundled `plain-english` skill on the proposed changed context sections before writing them. Resolve BLOCKER findings before the write. Apply only its permitted mechanical fix tiers automatically; surface meaning changes for review and preserve the original approved facts. Resolve `.agents/skills/plain-english/SKILL.md` for Codex or `.claude/skills/plain-english/SKILL.md` for Claude Code. Execute its structural lints, fix tiers, and actual sibling Editorial Draft Hemingway, Clarity, and AI-pattern resources with internal-document exemptions. A missing bundled plain-english skill is an installation gap. Its Editorial Draft reviewer dependency comes from the optional Content Engine import; if absent, leave reviewer passes pending while reporting completed structural checks.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
