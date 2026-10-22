## Procedure

Capture why a substantial surface decision took its current form. The prototype shows the interface; the product spec owns the build contract; this companion preserves design reasoning. Read the user's configured product/persona context, design references, and decisions. Apply the project's writing voice when supplied, keeping prose brief and the decision table dense.

1. Choose **net-new** or **revamp**. Net-new rows compare plausible alternatives. Revamp rows identify the actual prior surface and each deliberate divergence; do not describe a redesigned screen as though it never existed.
2. State one governing principle that can decide the placement or treatment of a previously unseen element. If it cannot be stated, record the unresolved design question and keep status Exploring rather than inventing a vague principle.
3. Record every load-bearing choice as **call, alternatives rejected, specific evidence, and revisit trigger**. Cite evidence for this decision, not blanket research about the feature. A taste-based or untested choice is `[ASSUMPTION]`, never a fabricated research finding.
4. Separate resolved decisions, falsifiable assumptions, and questions needing an owner. Give each assumption a test or signal that would disprove it. Mirror build-relevant assumptions into the companion spec's open decisions when that artifact exists.
5. Link the actual prototype/frame or mark conceptual with no artifact. Do not redraw the interface in prose. Use configured output locations and portable links; do not strand the reasoning in a personal directory.
6. Assign Exploring, Aligned, Locked, or Superseded status. Preserve the history of changed locked decisions with a superseding row or new record and a backlink, rather than silently replacing the reasoning.
7. Keep a bounded feature's reasoning short enough to scan on one screen. Multi-surface IA changes can require more decisions, not longer justifications per row. Offer a design review or companion product spec where necessary; do not manufacture their completion.

### Preflight and durable handoff

Surface material warnings above the artifact, not a boilerplate list: stale persona/decision evidence under the configured freshness policy; a principle that cannot decide a new element; a decision without evidence or a revisit trigger; claimed research that cannot be found; build-contract content in this reasoning document; or a local-only artifact link that readers cannot open. Move unsupported calls to the assumptions table and name what would resolve them. A conceptual document may have no prototype, but must say so instead of claiming an inspected design. Missing principle keeps the document Exploring and the principle decision open; do not mark it Aligned or Locked.

When this establishes a durable principle or reveals a new user pain, propose the smallest reviewed decision/persona update through `pb-compound`. Before tracked-document handoff, link this reasoning companion from spec section 4, mirror build-relevant assumptions into section 8 with owners, and bundle the actual prototype where needed. Keep source, decisions, and supersession history together in the user's chosen repository location.

## Output template

```markdown
# Design Spec: [Surface / decision]
> Flavor: [net-new | revamp of linked current surface]
> Companion spec: [link or not yet written]
> Prototype: [portable link or none, conceptual]
> Status: [Exploring / Aligned / Locked / Superseded-by link]
> Updated: [date]

## 1. Frame
[Surface, persona, and decision resolved; three short sentences.]

## 2. Governing Principle
[One applicable rule; brief explanation of its boundaries.]

## 3. Key Decisions

**Record 1**

| Field | Value |
|---|---|
| Decision | [choice] |
| Was [revamp only] | [live starting point] |
| Call | [resolution] |
| Alternatives rejected + why | [credible option] |
| Evidence | [source or ASSUMPTION] |
| Revisit if | [observable trigger] |


## 4. Assumptions to Validate

**Record 1**

| Field | Value |
|---|---|
| Assumption | [design bet] |
| Current basis | [basis] |
| How to disprove | [test/signal] |
| Owner / due gate | [owner or unassigned] |


## 5. Artifact
[Prototype/frame link, or explicitly unavailable.]

## 6. Open Questions / Asks
- [Specific decision needing an answer] — [owner or unassigned]

## 7. Status & History
[Current status. Dated append-only changes, rationale, and supersession links.]
```

## Worked example

**Fictional example: a scheduling tool reorganizes availability settings.** Principle: “Put recurring rules beside recurring availability; put one-off exceptions beside the affected date.” A revamp decision moves holiday overrides from global preferences to the calendar. The rejected alternative keeps everything in one form; the stated basis is an explicitly fictional supplied usability observation about finding a date exception, not claimed real research. Revisit if users routinely need to edit multiple calendars together. Whether users understand the new label remains `[ASSUMPTION]`, tested with a short navigation task. The companion spec owns save behavior and acceptance criteria; the design spec holds only this rationale.

## Quality checks

Every resolved row has a call, actual alternative, per-choice evidence status, and reopen trigger. The principle decides something concrete. Revamps show what changed. Open assumptions have disproof tests. Status and links are portable; no silent rewriting of locked history. Missing research or prototypes remain explicit.

## Anti-patterns

Do not add user stories, ACs, success metrics, instrumentation, rollout, or screen-by-screen prose. Do not use “make it clean” as a governing principle, invoke generic UX research as evidence for every decision, bury an assumption in a confident call, or invent a designer's approval. Route build contract detail to `pb-spec` and observable visual truth to the prototype.
