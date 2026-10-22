<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [users.md, product.md, brand-voice.md, metrics.md, technical-constraints.md]
capabilities: []
-->

# /pb-hypothesis

Turn a belief into a testable product bet.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Belief and triggering observation | Who, problem, evidence, expected outcome, falsifier, and test |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Ask forcing questions for missing evidence.
2. Separate observation from prediction.
3. Choose a cheap falsification path.



## Procedure

Invoke the bundled `grill-me` skill through `pb-grill-me` when reaching the decision-tree interrogation phase, inheriting the candidate artifact, reviewed context, and prior answers. Read its actual installed instructions on this host; do not simulate availability or repeat resolved choices.

Resolve `brain_dir` and the draft output location from `.product-bench-install.json`. Load the declared reviewed context, plus the user's candidate belief and supplied evidence. This workflow creates a **testable bet**, not validation. Reuse existing answers and source references rather than replaying an interview.

### Ground the belief

Answer six forcing questions, reading available evidence before asking:

| Question | Required grounding |
|---|---|
| Who exactly has this problem? | A specific persona/cohort from reviewed user context; never invent a named participant |
| What is their principal struggle? | A dated observation, actual quote or metric; no invented verbatim |
| How do we know it is real? | Source, independent evidence count, strength and counterevidence |
| What is the non-obvious insight? | Causal explanation or distinguishing behavior; tag inference |
| Why now? | Actual trigger/change; if unknown, say so |
| Why this team/product? | Credible capability, data or distribution advantage; assumptions remain explicit |

If the persona, problem or evidence cannot be grounded, show the missing answers and offer `pb-uxr pre` for a research plan, `pb-uxr post` for supplied research evidence, or a verified `pb-analytics ask` test. Do not label an unsupported belief evidence-backed. When the user explicitly wants a speculative hypothesis, continue as an **exploratory draft** with missing grounding and proposed measurements, never as a ready bet. A structured IF/THEN/BECAUSE input skips already answered questions, not evidence checks.

### Drill consequential branches

Unless `--skip-grill` is requested, follow the concrete sequential procedure in `pb-grill-me`: map dependencies, use existing context answers, then ask **one consequential unanswered question per turn** with a recommendation and reason. Wait for the user before resolving it; record explicit deferrals. No external skill installation is required. Cover falsifiability, sample adequacy, selection bias, metric/instrumentation, kill criteria, why-now and capability dependencies. Return to formulation only when every consequential branch is resolved by cited evidence or user answer, or explicitly deferred with evidence/action. Skipping the grill does not remove open questions.

### Formulate and design the test

Write **IF** a specific exposure/intervention occurs, **THEN** a numeric measurable result follows for the named cohort within a window, **BECAUSE** of a causal mechanism. Separate supporting observation from the predicted effect. Specify metric definition, actor/event, numerator/denominator, exclusions, baseline/control where possible, target and failure threshold, timeframe, sample and recruitment. Distinguish a feasibility pilot from a test powered to establish an effect; explain limitations instead of inventing statistical certainty. Name the verified provider/event only when known; otherwise mark required instrumentation `[NEEDS DATA]` and suggest `pb-analytics schema`.

Define a falsifier and an inconclusive outcome: a missing event or insufficient sample is not a failed hypothesis. Identify confounders, assumptions and counterevidence. Prefer a cheapest valid test within four weeks; if it cannot fit, reduce the bet or explicitly explain the longer dependency. Assign owner and decision date when supplied, otherwise leave them open. Recommend an action for confirmed, weakened, falsified and inconclusive outcomes.

Present the complete draft and a proposed log row. Show the exact destination and proposed context/log changes before writing reviewed knowledge. Honor authorization already given; otherwise offer save/discard. Use the configured draft location until canonical promotion is authorized. If an existing hypothesis registry exists, inspect it before assigning the next HYP-ID; do not invent a parallel registry. Saving never implicitly authorizes a commit, push or PR.

### Keep the bet reusable by the next command

Use the same confidence vocabulary as the underlying research: weak / moderate / strong / confirmed, explaining what supports the label. Reserve confirmed for the scoped evidence actually established; one supportive interview cannot confirm a population claim. Persist Who / Pain / Why now as three separately named fields so `pb-spec` can use them directly without reconstructing the interview. The test plan also records exposure/delivery checks: a treatment nobody received cannot falsify the claimed mechanism.

In the decision section use an explicit result ladder: confirmed within the test's scope → proposed next test or rollout; weakened → revise the mechanism or target; falsified → stop this bet with learning; inconclusive → repair instrumentation/sample and rerun without moving thresholds. The log proposal starts **Untested**, with result and learning “none yet,” even when supporting research already exists. Distinguish a hypothesis's causal prediction from the observations that motivated it.

**Write:** “Of eligible coordinators who received a list containing an actionable gap, at least four of six request a replacement within 48 hours.” **Avoid:** “Warnings increase engagement by 30%.” The latter has no defined action, denominator, baseline, or observation window. An exploratory draft may still supply a proposed numeric threshold, clearly identified as a design choice pending evidence.

## Output template

```markdown
# Hypothesis: [short title]
Status: [exploratory draft / test-ready draft / existing status]
## Problem
Who: [cohort/source]
Pain: [observation or exact sourced quote; no quote => NEEDS VERBATIM]
Why now: [trigger/source]
## Belief and mechanism
Raw belief: ...
IF [intervention/exposure], THEN [numeric outcome, cohort, window],
BECAUSE [causal mechanism, not a restated outcome].
## Decision tree
[Resolved/source-backed branches; user answers; deferred dependencies]
## Validation plan
| Element | Definition |
|---|---|
| Metric/event/provider | [verified or required] |
| Cohort; unit; exclusions | ... |
| Baseline/control | ... |
| Success; falsification; inconclusive | ... |
| Timeframe; sample; recruitment | ... |
| Instrumentation/readiness | ... |
## Evidence and assumptions
Supports: [dated sources] | Challenges: [counterevidence]
Assumptions: [confidence, how tested, confounders]
Risk: [low/medium/high and consequence of being wrong]
## Decision and proposed log row
[Outcome => action; owner; decision date]
| Field | Value |
|---|---|
| ID | |
| Date | |
| Owner | |
| Hypothesis | |
| Status | |
| Metric/target | |
| Evidence | |
| Result | |
| Learning | |
| Draft/doc | |
## Save proposal
[Actual configured destination; reviewed changes; unresolved evidence]
```

## Worked example

**Fictional test design:** reviewed example notes describe shift coordinators finding gaps on the morning of an event. “IF six pilot coordinators receive an at-risk-shift list 72 hours earlier, THEN at least four act on one listed gap within 48 hours during a two-week pilot, BECAUSE earlier notice leaves time to recruit a replacement.” The event is **a recorded replacement request**, not opening the email. Six participants can test whether the mechanism is feasible; they cannot establish broad retention impact. Falsifier: no more than one coordinator acts despite confirmed delivery and at least one actionable gap each. Inconclusive: fewer than four have an actionable gap or delivery is unverified. Intermediate results weaken the bet and prompt follow-up research. The hypothetical numbers are proposed thresholds, not past results; the next larger test needs a baseline/control before claiming reduced cancellations.

## Quality checks

- Persona, struggle and evidence are sourced or the draft explicitly remains exploratory.
- Numeric target, window, cohort, metric definition, falsifier and inconclusive state are present.
- BECAUSE explains why the intervention should work; confounding and measurement limitations are visible.
- The decision tree has real answer sources; the assistant never accepts its own recommendation.
- Log status is Untested until evidence changes it; save/promotion honors configured destinations and review.

## Anti-patterns

- “Engagement will improve” without actor, event, denominator or timeframe.
- Calling an opinion a hypothesis when nothing could disprove it.
- Fabricating participant quotes, baseline metrics, available events or statistical power.
- Treating “no data” as failure, or changing a threshold after seeing results without documenting the change.
- Auto-committing a hypothesis or updating shared context merely because the draft was generated.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
