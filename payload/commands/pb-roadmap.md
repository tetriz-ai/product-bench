<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, roadmap.md, metrics.md, competitors.md, technical-constraints.md, brand-voice.md]
capabilities: []
-->

# /pb-roadmap

Sequence bets around outcomes and constraints.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Candidate bets, capacity, objectives | Now/Next/Later with outcomes, dependencies, evidence, and revisit dates |
| status | Existing specs, lifecycle metadata, and measured outcomes | Stage-age health, stalls, outcome-review candidates, missing data, and triage actions |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Do not imply dates from unknown capacity.
2. Separate committed work from options.
3. For status, inspect actual lifecycle dates and evidence; thresholds prompt review, never automatic archival.
4. Make opportunity cost visible.



## Procedure

Support two distinct modes: **default** sequences candidate bets into NOW/NEXT/LATER; **status** audits the lifecycle of existing specifications without generating a new roadmap. Read the configured roadmap, product/personas, evidence, competitive context, metrics, technical constraints, capacity, and artifact locations. Apply project writing voice where supplied.

### Default: prioritization and sequencing

1. Frame the outcome and horizon, prior commitments, candidate work, and strategic growth direction (existing/new products × existing/new markets when useful). Check research/competitive freshness; older than thirty days is a prompt to revalidate consequential claims, not proof they are wrong.
2. Assess signal strength, revenue/retention/user impact, dependencies, time to first value, risk, and opportunity cost. Compare plausible alternatives explicitly. Do not invent quantitative scores, revenue, or dates from missing evidence.
3. Calibrate scope against verified capacity. Capacity older than thirty days or never sampled stays UNKNOWN, and every date estimate gets an explicit assumption/gap. Prefer observed delivery history and actual team availability; code line counts alone are not a reliable productivity denominator. Read user-supplied throughput definitions rather than hardcoding a sampling scheme.
4. Record the directional bets, confidence, evidence, and falsifiers. Every NOW item maps to a bet, explicit user signal, or necessary operational/safety rationale; flag unexplained items `[NEEDS BELIEF]` or `[NEEDS EVIDENCE]` rather than inventing a hypothesis ID.
5. NOW contains concrete deliverables, measurable outcomes, owners, and success signals. Existing authorized commitments are distinct from newly **proposed** commitments; generating a roadmap does not itself commit engineering. NEXT names learning/dependency gates and risks. LATER says why later rather than never and what pulls it forward.
6. Name genuine attractive work being declined, with a reason and revisit trigger. Explain the hardest trade-off and its sacrifice. Save beneath configured output, propose reviewed context/decision updates, and recommend owner alignment rather than contacting stakeholders or creating tickets automatically.

### Status: lifecycle health

1. Inventory specifications in the user's configured tracked documentation and draft locations; do not assume a legacy PRD directory. Read stage, last stage-change date, exposure/feature flag if present, outcome data, and lifecycle notes. Missing/invalid/future dates and unknown stages are data gaps, never zero-day healthy items. Use calendar-day arithmetic with the current date and clear timezone/date assumptions.
2. Use project-configured thresholds when available; otherwise label these proposed **review heuristics**: Draft >14 days; In Review >7; Approved >21; In Dev >28; Validate >90; Shipped has no stall threshold. Strictly greater-than means an item on the threshold is not yet stalled.
3. Flag exceeded stages for triage and suggest an action grounded in notes; do not infer a cause without evidence. Validate >90 days is a **review candidate for missing outcome evidence**, not automatic evidence of failure. Inspect available results before suggesting disable, collect data, or extend with an owner and near-term deadline. Do not change a flag, archive a spec, or declare a kill decision from elapsed time alone.
4. Report healthy items, stalls, outcome-review candidates, missing data, and evidence limits separately. More than three simultaneous stalls triggers a portfolio-triage recommendation before adding work. Save the status report, keeping it separate from a new sequencing decision.

### Preserve initiative-level reasoning and status arithmetic

Default NOW/NEXT entries keep growth direction (Ansoff) when meaningful, so different kinds of bets do not hide beneath feature names. NOW explains why the deliverable creates the proposed outcome; NEXT states the actual learning from NOW that would justify starting it. The no-list includes politically plausible stakeholder requests and their sacrifice, not obviously irrelevant work. At the end propose alignment on NOW ownership/scope and deliberate communication of declined requests with the recorded rationale. These are reviewable handoff drafts, not a claim that engineering committed or stakeholders were contacted.

In status mode distinguish **last stage change** from the file modification time; editing prose yesterday does not reset lifecycle age. Normalize recognized stage labels to the configured lifecycle, retaining the original value, and keep unknown labels as data gaps. Feature flags/exposure controls come from the actual spec text or configured registry, not an assumed naming prefix. Show exact date and days for each item so boundary cases can be checked. If lifecycle notes name a blocking dependency, quote/paraphrase the relevant note; otherwise cause is unknown.

**Fictional boundary example at 2026-10-07:** Draft since 2026-09-23 is 14 days and not stalled under >14; In Review since 2026-09-29 is 8 days and needs triage under >7. Validate since 2026-07-08 is 91 days and merits outcome review; existing positive outcome data changes the recommended action to a lifecycle close-out discussion, not disablement. A Draft with no last-change date stays a data gap. Shipped has no stall threshold but missing outcome/metadata may still require documentation. Use the user's date/timezone consistently and state the date-only arithmetic assumption.

## Output template

```markdown
# Roadmap: [Horizon / theme] [default mode]
Status: [proposed plan / user-authorized commitments distinguished]
Context / capacity freshness: [sources and caveats]

## Strategic Framing & Growth Direction
[Outcome and strategic choice; current resource assumptions.]

## Strategic Bets

**Record 1**

| Field | Value |
|---|---|
| Bet | [direction] |
| Belief | [causal claim] |
| Confidence / evidence | [source] |
| Falsifying signal | [signal] |


## NOW
For each: [commitment status; why now; outcome; concrete deliverable; bet/source; success metric; owner; dependency; Ansoff if relevant; date only with capacity assumption].

## NEXT
For each: [why next; learning/dependency gate; deliverable/outcome; owner; Ansoff if relevant; risk].

## LATER
[Item, why later, pull-forward trigger.]

## Explicitly NOT Doing
| Plausible initiative | Reason / sacrifice | What changes our mind |
|---|---|---|
| [item] | [trade-off] | [signal] |

## Hardest Trade-off & Open Decisions
[Named tension; evidence, owner, resolution gate.]
```

```markdown
# Roadmap Lifecycle Status: [date] [status mode]
Scope: [artifact locations scanned] | Threshold policy: [configured / review heuristics]

## Health Overview

**Record 1**

| Field | Value |
|---|---|
| Spec | [link] |
| Stage | [verified/unknown] |
| Last change / days | [date/days or missing] |
| Flag | [healthy/stall/review/data gap] |
| Exposure control | [verified name or absent] |
| Outcome evidence | [source/gap] |


## Outcome Review Candidates
[Validate >90d: result evidence, proposed collect/disable/extend decision, owner; never automatic kill.]

## Stalls & Portfolio Health
[Exceeded thresholds, evidenced notes, proposed unblock/capacity/scope/archive discussion.]

## Healthy / Missing Stage Data
[Separate lists; unknown dates not treated as healthy.]
Next action: [specific triage/evidence task].
```

## Worked example

**Fictional example: a membership product chooses between failed-payment recovery and badges.** Supplied support signals favor payment recovery; badges move to LATER with an engagement-evidence trigger. NOW proposes a retry flow and measurable recovery outcome, but no delivery week is promised because team capacity is unknown. The no-list includes a plausible custom invoicing request with its opportunity cost. In status mode, a fictional spec has been in Validate for 95 days but already has outcome evidence: flag it for closing its lifecycle record, not killing a successful feature. Another Draft lacks a stage-change date and is listed as missing data rather than healthy.

## Quality checks

Default produces outcomes, deliverables, dependencies, evidence, owners, actual sacrifices, and capacity-qualified timing. Proposed work never masquerades as an approved commitment. Status inventories real artifacts, computes correct days, applies explicit thresholds, and distinguishes missing data from health. Recommendations do not execute lifecycle actions.

## Anti-patterns

Do not publish a feature wishlist as strategy, make dates from unknown capacity, assign imaginary owners, treat code throughput as universal capacity, invent evidence for NOW, use the no-list for irrelevant strawmen, generate a new roadmap when status was requested, or kill/archive work solely because its stage age crosses a heuristic.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
