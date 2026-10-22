<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, technical-constraints.md, metrics.md, brand-voice.md]
capabilities: []
-->

# /pb-improve

Specify a measured improvement to an existing feature.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Existing behavior, baseline, user signal | Delta spec, acceptance criteria, regression risks, rollout, and metric |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Establish the baseline before proposing changes.
2. Name existing users who could be harmed.
3. Name unchanged boundaries where needed to prevent regression or accidental scope expansion.



## Procedure

Write a surgical, evidence-led delta for behavior that already ships. The distinction from `pb-spec` is **a verified before and a defined change**, not small effort or a short document. Large changes to existing behavior still need a complete improvement contract. Net-new capabilities or no known current state usually benefit from `pb-spec`; never invent a baseline to make the command fit.

1. Load the actual signal: user observation, analytics result, support pattern, competitive comparison, or internal report. Identify source/date, sample/window, and strength. A single anecdote remains weak evidence, not a validated pattern. Separate reported pain from a chosen fix.
2. Establish the current behavior and metric definition, baseline value, cohort, period, and instrumentation. If absent, describe the observed qualitative delta and mark quantitative success planning `[NEEDS DATA]`; recommend evidence gathering rather than pretending the improvement is measurable. State what cannot be finalized until the baseline is verified.
3. Resolve decision branches before drafting: exact before/after, any new signal definitions and formula domains, minimum meaningful scope, who currently benefits, regression risk, dependencies, exposure/kill switch, rollback, and platform-wide consumers/settings affected. Recommend answers and reuse supplied context. Invoke the bundled `grill-me` skill through `pb-grill-me`, inheriting the candidate improvement and context. Read its actual instructions and preserve its turn boundaries; a missing skill is an incomplete installation. Branches are resolved or explicitly deferred with evidence/owner; trivial or explicitly skipped interrogation is recorded with a reason.
4. Describe **Before, After, and Unchanged boundaries** precisely. Enumerate affected surfaces instead of “all screens.” Choose the smallest meaningful change that tests the bet, not every adjacent improvement.
5. Give every changed behavior a functional requirement and observable acceptance criteria, including lower-priority changes. Cover default, empty, thin-data, partial/loading, error/unavailable, permissions, reversion, and recovery. Preserve data contracts, thresholds, and grouping/idempotency when relevant. Keep mechanism out of FR/ACs unless it is a verified constraint.
6. Define success as a delta over the measured baseline with window, event/metric name, attribution limits, and a guardrail. Define each guardrail's rollback threshold/window and the action/owner. Proposed events remain explicitly proposed. Add model-evaluation gates inside acceptance when the delta changes AI judgment: behavior/abstention, dataset, rubric, threshold, and failure handling; generative outputs require an authorized representative-data inspection.
7. Review engineering/buildability, measurement, regression/silent majority, platform/data impact, and altitude. Add design for UX changes; privacy, positioning, and strategy lenses when the change triggers them. Use actual delegated reviewers where available; otherwise label manual lens review. Keep decision tree and review findings in a separate audit artifact, not appended to the implementation contract.
8. Save the improvement spec and separate review beneath the configured output directory. Verify instrumentation status and the agreed kill switch before calling it ready for implementation. Offer a reviewed tracked-document handoff through the user's repository workflow; do not prescribe a second repository or push without authorization.

### Decision-tree evidence discipline

Map open branches and their dependencies before drafting the verdict/contract. Read already approved sources before asking a question. Resolve a branch from an explicit supplied answer or a named source, never merely from the author's recommendation. For a consequential choice needing the user, show the branch, why it matters, recommended answer, and what was checked; wait for the answer before advancing its dependent branches. A deferred branch records reason, missing evidence, owner, and next action; it is not a disguised resolution. Keep the resolved/deferred tree with the review trail. Honor an explicit `--skip-grill` or equivalent request and record the skip; never fabricate an interrogation receipt or require the user to repeat existing answers.

## Output template

```markdown
# Improvement Spec: [Existing feature] — [Precise delta]

## Signal
Type/source/date: [specific evidence]
Pattern and urgency: [sample/window; weak-signal warning if needed]

## Current State
Behavior/user moment: [verified present experience]
Baseline: [metric definition, value, cohort, period, source or NEEDS DATA]
Cost of doing nothing: [evidence or labeled assumption]

## The Change
Before: [observable behavior]
After: [observable delta]
Unchanged / boundary: [adjacent behavior explicitly preserved]
Edge cases: [inputs, missing data, formula domains, roles]

## Functional Requirements & Acceptance Criteria

**Record 1**

| Field | Value |
|---|---|
| ID | FR-1 |
| Required observable behavior | [change] |
| Pass/fail test | [input → expected result] |
| Priority | [priority] |

[AI eval gate only where model judgment changes.]

## Surfaces & States

**Record 1**

| Field | Value |
|---|---|
| Surface | [enumerated surface] |
| Default | [response] |
| Empty/thin-data | [response] |
| Partial/loading | [response] |
| Error/unavailable | [response] |
| Permission/recovery/reversion | [response] |


## Success & Rollback

**Record 1**

| Field | Value |
|---|---|
| Metric / definition | [metric] |
| Baseline | [measured value] |
| Target delta | [delta or open decision] |
| Window/cohort | [window] |
| Instrumentation status | [event, verified/proposed] |
| Guardrail / rollback action | [threshold, owner, action] |


## Regression Risk

**Record 1**

| Field | Value |
|---|---|
| Current user segment | [segment] |
| Relied-on behavior | [existing benefit] |
| Risk | [harm] |
| Mitigation / test | [protection] |

Silent-majority check: [who might find the change worse].

## Constraints & Exposure
[Verified constraints/dependencies, data contract, justified estimate if requested, exposure/kill switch and validation gate. No invented rollout percentages.]

## Out of Scope & Open Decisions
[Real adjacent exclusions + reconsideration triggers. Unresolved item, owner, evidence, due gate.]
```

## Worked example

**Fictional example with invented fixture measurements: a file organizer changes its existing retry flow.** Current retry clears the user's filename; a fictional supplied test reports 12% abandonment among 100 interrupted uploads. After: retry preserves the filename and completed chunk state. Unchanged: folder selection and sharing permissions. FR-1 tests interruption followed by retry preserves edits; FR-2 tests permission revocation shows a disabled action and performs no write. The outcome target is an explicitly proposed reduction of abandonment from 12% to 8% over the agreed test window using `upload_retry_completed`; the event is marked proposed until verified. Successful upload rate is a guardrail with a user-approved rollback threshold, not an invented universal threshold. Existing users who intentionally restart uploads are the silent-majority risk; retain an explicit Restart action. No claim refers to a real customer or measured production baseline.

## Quality checks

The signal and current state are sourced, the delta is precise, all changed behavior is buildable, and all relevant states are defined. Baselines and instrumentation are verified or openly missing. Each guardrail has a rollback condition. The decision tree distinguishes settled from deferred. Review has a truthful completion/independence status. Effort never excuses deleting behavior contracts.

## Anti-patterns

Do not write “improve UX” as the change, turn large existing-surface work into a net-new spec by size alone, fabricate a baseline, use absolute aspirations instead of baseline deltas, ignore satisfied current users, prescribe queues or SQL as user-facing ACs, claim unavailable interrogation/review skills ran, or omit the unchanged scope boundary that prevents creep.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
