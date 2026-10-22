<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, technical-constraints.md, metrics.md, brand-voice.md, decisions-log.md]
capabilities: []
-->

# /pb-spec

Create a concise build contract for people and agents.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Hypothesis, chosen behavior, constraints | Eight-section concise build contract: problem, bet, scope, behavior, acceptance/evals, success metrics, constraints, and decisions |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Keep rationale short but sufficient.
2. Specify states and contracts; avoid prescribing mechanism.
3. Link the evidence and decisions needed to build.
4. Run review-spec or equivalent independent review before calling the spec ready.

## Build contract

Start from a selected hypothesis or equivalent decision. State the user-visible change. Define actors, triggers, inputs, outputs, states, errors, permissions, and retention where they affect behavior. Include acceptance examples for the main path and a failure or boundary path. Link constraints to their source.

Separate product behavior, interface content, integration contracts, and evaluation/rollout checks. Leave mechanism open unless a verified constraint forces it. Finish with unresolved decisions and evidence needed to close them. Keep the document concise; do not expand it into a full PRD. Run review-spec or equivalent independent review before calling it ready. An unavailable or failed review leaves it a draft.

## Procedure

Create a concise, eight-section build contract that a product reviewer can understand and an engineer or agent can execute. Compression removes repeated justification, never required behavior. Read the configured context, output directory, existing artifacts, and project writing guidance before drafting. Apply the project's voice guidance when present; otherwise use short, direct prose, concrete nouns, and dense verification tables. Do not impose another company's voice rules.

1. Locate the hypothesis, evidence, scope decision, and related specifications. Distill their problem and causal bet instead of inventing fresh validation. If absent, recommend `pb-hypothesis` or `pb-scope-check`; the user may choose to supply the decision directly or proceed with clearly labeled assumptions. Infrastructure may use a sourced rationale instead of a falsifiable user bet. These are useful dependencies, not mandatory command rituals.
2. Preserve the scope verdict's **IN, DEFERRED, OUT, and CUT** meanings. Deferred means later with a trigger, not never. Every cut records its consequence. When no scope artifact exists, make the cut explicit with the user; this command includes a scope check rather than sending them away solely for a missing file.
3. For a new or substantially changed UI, link a prototype or other actual design artifact and distill its flow and states. Offer `pb-prototype` when needed. Reused surfaces require only a reference and the delta. If the user proceeds without a prototype, label the visual decisions provisional; never imply a co-design session happened. A design-spec companion holds reasoning, not duplicate build requirements.
4. For headless or data work, show data availability, downstream consumers, concrete input-to-output rows, provenance, uncertainty-to-resolution behavior, and reprocessing guarantees. Put settled technical constraints in section 7, not mechanism disguised as user behavior.
5. Write pass/fail acceptance criteria for every in-scope behavior, including lower-priority stories. Explicitly cover empty, disabled, unavailable, loading, partial, permission, below-threshold, and computed-to-empty reversion states where relevant. Ratios require zero-denominator, empty-numerator, and missing-baseline behavior. Define named terms before using them; reuse verified existing product labels rather than inventing competing metric names.
6. Keep three contracts separate: **ACs** verify deterministic behavior before launch; **evals** gate model judgment before launch and belong inside ACs; **success metrics** measure user outcomes after launch. For AI judgment specify output and abstention, labeled/held-out data, rubric, threshold, and failure handling. Generative user-facing output also needs an authorized representative-data dry-run and inspection gate. No AI judgment means no gratuitous eval block.
7. Give every success metric an instrumentation name, definition, target or explicit missing target, measurement window, and activity/outcome/guardrail classification. State attribution limits for impact claims; correlation alone cannot support causality. Distinguish a proposed event from verified instrumentation.
8. Link prior decisions with a one-line summary so the artifact remains intelligible when the linked context is unavailable. Enumerate unresolved assumptions, owners, and due gates. Check sibling specs for conflicting ownership of fields, settings, surfaces, and metrics.
9. Review functional completeness, behavior-versus-mechanism, consistency, platform/data impact, strongest counterargument, and actual customer value. Add regression for changed behavior. Use independently delegated reviewers when available and authorized; feed the artifact and relevant context rather than the author's argument. Otherwise perform an explicitly labeled manual lens review, without claiming independence. Save findings separately. Escalate high-stakes privacy, enterprise, or novel work to a broader review.
10. When shortening or recutting a source specification, extract its load-bearing fields, enum/nullability contracts, states, thresholds, windows, events, eval gates, and scope boundaries. Classify each as PRESENT, TRACEABLY CUT, or LOST; reverse-check new claims against the source. Seek two independent reviewers if available; otherwise label the manual preservation check and its limitation. Fix every silent loss and unsupported addition before calling the recut complete.

Save the spec and separate review beneath the configured output directory. Link companion artifacts through portable paths or URLs. Offer to move a reviewed artifact and its prototype/eval companions into the user's chosen tracked documentation location; do not invent another repository, commit, or publication requirement.

### Preflight: catch the failures compression hides

Put material warnings in the front matter with an exact affected requirement, source, or term. Check persona and constraint freshness against the configured policy; all relevant state/formula branches; instrumentation name and verification status; mechanism leaking into behavioral ACs; an absent AI quality floor; opaque decision/hypothesis references; provisional bet/scope; missing prototype for a consequential UI change; undefined terms or competing dashboard labels; and sibling ownership conflicts. Missing artifacts warn and make the corresponding decision provisional rather than forcing a command ritual. An existing artifact does not prove its content is current or consistent.

When producing or consuming a new derived signal, declare the signal, its provenance, downstream owners/consumers, and compatibility with existing product-wide settings and views. Follow actual approved ownership constraints; record unresolved ownership before claiming the contract is ready. Do not assume the source product's control-plane or reporting architecture exists here.

### Review jobs, separate from the eight-section contract

| Lens | Exact challenge |
|---|---|
| Functional | Does every IN story, including lower priority, have enough testable behavior for execution without PM interpretation? |
| Altitude | Can mechanism be removed or moved to section 7 without losing the behavior contract? Honor settled headless constraints. |
| Consistency | Do examples match rules, fields exist wherever used, references point to current artifacts, and arithmetic/windows agree? |
| Platform/data impact | Who owns changed settings/signals and which downstream users need compatible behavior? |
| Devil's advocate | What is the strongest case against this bet and what evidence would reverse the recommendation? |
| Customer | Would the actual intended user care enough to use this, and what burden makes them avoid it? |
| Regression [changed behavior] | Who benefits from the current behavior, what breaks, and what exposure/recovery protection applies? |

Use actual fresh reviewers with artifact and relevant approved context, not the author's persuasive account. Preserve original findings and execution receipts before synthesis. A pass depending on unstated behavior is UNVERIFIED, and an unresolved launch-critical behavior is blocking. A manual review is useful but does not complete a required independent gate. For novel, high-stakes, privacy, or enterprise/procurement work, add design, measurement, executive/GTM, privacy/legal, and handoff lenses as relevant through `pb-review-spec`; do not treat the trimmed set as universal sufficiency.

For recuts, keep each source fact and its candidate location in a preservation ledger. Two genuinely independent judges should each find zero silent LOST facts and zero unsupported additions before the independent preservation check passes. Recheck after corrections; a single author's repeated read is a manual check, not two judges.

## Output template

```markdown
# Product Spec: [Feature]
> Bet/rationale: [source + one-line summary]
> Exposure/kill switch: [when needed; decision or open issue]
> Design/prototype companion: [link or explicit missing artifact]
> Warnings: [stale context, unresolved scope, missing prototype, unverified instrumentation]

## 1. Problem
[User, specific pain, evidence, why now; a few sentences.]

## 2. Hypothesis / Rationale
[Source link + causal mechanism; numeric targets belong in section 6.]

## 3. Scope
- IN: [behavior and user value]
- DEFERRED: [item + trigger to reconsider]
- OUT: [item + reason]
- CUT: [previously included item + consequence; omit if none]

## 4. Observable Behavior
[UI artifact + happy path and state summary, or data-availability sequence + input/output examples and consumers.]

## 5. Acceptance Criteria

**Record 1**

| Field | Value |
|---|---|
| Term | [term] |
| Definition | [precise meaning] |
| Existing product equivalent | [existing label or new + reason] |
| Source/instrumentation | [verified/proposed source] |


| ID / story | Observable pass/fail condition | Test input → expected result |
|---|---|---|
| AC-1 | [required behavior] | [seeded main/edge case] |

### Evals [AI judgment only]
- Behavior and abstention: [contract]
- Golden/held-out set: [source, labeling, leakage discipline]
- Rubric and ship threshold: [scoring + gate]
- Failure handling: [fallback/escalation]
- Representative-data dry-run gate: [generative output only; authorized sample + inspection]

## 6. Success Metrics

**Record 1**

| Field | Value |
|---|---|
| Metric / definition | [outcome] |
| Baseline → target | [value or NEEDS DATA] |
| Window | [window] |
| Instrumentation / verification | [event name; existing or proposed] |
| Tier / attribution limits | [outcome; causal/correlational limits] |


## 7. Constraints & Scale
[Verified performance/platform constraints; data fields, types, enum, nullability; settled load-bearing choices. Assumptions mirrored below.]

## 8. Prior Decisions & Open Decisions
Prior: [dated link + inline summary].

**Record 1**

| Field | Value |
|---|---|
| Type | NEEDS DATA / NEEDS DECISION / ASSUMPTION |
| Decision/gap | [item] |
| Owner | [owner or unassigned] |
| Due gate | [gate] |
| Evidence needed | [source/test] |

```

## Worked example

**Fictional example: a shared checklist product adds resumable imports.** The supplied scope decision includes saved progress and excludes collaborative editing. Section 4 says: a returning importer sees completed rows and resumes unresolved rows; failed rows remain individually actionable. AC-1: uploading a file with rows A and B, completing A, then returning must show A complete and B pending. AC-2: retrying B twice produces one completed item, not duplicates. AC-3: revoking import permission disables resume with an explanation and creates no items. A headless companion example maps `{row_id: B, status: uncertain}` to a nullable result until validation resolves it; downstream counts exclude uncertain rows. The outcome is reduced abandoned imports, measured by a proposed `import_resumed` event against a verified denominator. No baseline is supplied, so the target stays `[NEEDS DATA]`. There is no model judgment and therefore no eval section.

## Quality checks

- Exactly eight main sections; short rationale, complete build contract. No milestones or delivery narrative added to pad the document.
- Every story and reachable state has testable behavior, every formula has a defined domain, every named metric/term has a definition.
- Scope traces to a decision, examples agree with rules, event names survive compression, and links include explanatory summaries.
- Existing claims and instrumentation are verified or explicitly open; no imagined user validation, review verdict, prototype, or live eval.
- A recut has zero unexplained LOST facts and zero unsupported new build claims. Review limitations are visible.

## Anti-patterns

Do not resurrect a long PRD, conflate acceptance with adoption targets, write a new bet as sourced evidence, flatten DEFERRED into OUT, remove behavioral criteria from low-priority stories, leave divide-by-zero unspecified, hardcode a queue/library as behavior, or claim a full review passed because no reviewer was available. A dense schema contract can legitimately be long; shorten its surrounding prose, not its fields.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
