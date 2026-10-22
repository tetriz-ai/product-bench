<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, brand-voice.md, technical-constraints.md]
capabilities: [browser or rendering runtime optional]
-->

# /pb-prototype

Build a small testable representation of a proposed behavior.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Spec, audience, key flow | Clickable prototype or explicit low-fidelity equivalent with test prompts |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Prototype the riskiest interaction first.
2. Use approved or generic visual assets.
3. Mark simulated data as fictional.



## Procedure

Co-design a clickable artifact that exposes behavior and edge states before they become acceptance criteria. Read configured context, scope decisions, design-system references, and output locations. This is for user-facing surfaces, not headless data work; `pb-spec` can use input/output examples for those.

1. Check reuse first. An unchanged existing surface may need only a link and specified delta. Prototype genuinely new or materially altered interactions, respecting the agreed IN scope and flagging requested OUT items.
2. Do not build an elaborate interface from a one-line request without resolving consequential unknowns. Reuse answers already supplied. Work through short decision clusters with a recommendation: screens and entry points; primary flow click by click; each non-happy state; roles and permissions; recovery and reversion. Ask the user only where the choice changes behavior or scope. Record explicitly deferred decisions instead of burying assumptions in the artifact.
3. Enumerate empty/no-data, below-threshold, loading/in-progress, partial, error/unavailable, disabled/no-permission, success, and computed-to-empty states per relevant screen. Explain which do not apply. Sketch role differences and the state transitions between them, not merely separate static cards.
4. Load the actual product design system from user-configured references or a permitted connected library. Reuse verified tokens and component patterns; distinguish product and marketing systems. Do not hardcode a framework, filesystem location, or another product's token namespace. If no authoritative system is accessible, explain the gap and offer a clearly provisional structural wireframe using simple neutral styling. Mark unverified token choices; do not claim production fidelity.
5. Build one artifact appropriate to the user's request and available tools: a self-contained clickable HTML file when practical, or a frame/prototype through an available design integration. Simulate data and actions clearly. Do not connect credentials, send requests, deploy, or mutate production just to make a prototype realistic.
6. Verify the main flow and at least one error/recovery path through an available browser or design viewer. Check role controls, state selectors, keyboard focus, responsive overflow, and every state agreed in the session. If browser tools are unavailable, provide a labeled manual interaction checklist and distinguish static inspection from actual clicks.
7. Return the artifact link and a 3–5 step UX flow plus the complete state coverage list. List deferred behavior and why. Feed this into `pb-spec` section 4 and state ACs; offer `pb-design-review` for substantial new surfaces and `pb-design-spec` when the reasoning warrants a durable companion.
8. Save under the configured output directory. Before the user shares a spec, make sure its prototype link is accessible to the intended reader: a tracked repository artifact in the same proposed documentation change or an accessible design URL. Do not leave a reviewed build contract pointing at a local ignored scratchfile; do not commit or publish without authorization.

## Output template

```markdown
# Prototype Handoff: [Feature]
Artifact: [HTML path / design URL]
Status: [co-designed / provisional pending named decisions]
Scope source: [decision link or supplied scope]
Design-system source: [verified reference / provisional wireframe]
Simulated: [data/actions not production integrations]

## Primary Flow
1. [Entry and user intent]
2. [Action]
3. [Result / next destination]

## State & Role Coverage

**Record 1**

| Field | Value |
|---|---|
| Screen | [screen] |
| State / role | [empty/loading/error/etc.] |
| Trigger | [condition] |
| Visible response | [behavior] |
| Recovery / transition | [next step] |
| Verified how | [actual check or unverified] |


## Decisions & Deferred Items

**Record 1**

| Field | Value |
|---|---|
| Decision | [choice] |
| Resolution / assumption | [status] |
| Alternatives / consequence | [trade-off] |
| Revisit or evidence needed | [trigger] |


## Handoff
[Spec and reasoning companion links/next action; portable artifact location.]
```

## Worked example

**Fictional example: a team calendar adds booking conflict recovery.** The user supplied the happy path, so the co-design conversation focuses on whether a held slot may expire while someone fills the form. Recommend preserving typed details and showing alternative slots; explicitly agree the behavior before building. The HTML prototype includes empty availability, loading, selected slot, expired slot, permission denied, and confirmed states. Clicking Confirm in the expired state shows recovery without discarding the form. All data and confirmations are simulated. If no real design system is accessible, label the artifact a provisional wireframe, not a production-quality calendar design. Handoff lists each state for a future spec AC.

## Quality checks

The artifact reflects agreed decisions and IN scope; every covered state is discoverable and the primary action works in the inspected prototype. Real design-system claims cite verified sources. Role variants and recovery paths exist, not just the happy screen. Handoff coverage matches actual artifact content. Links can be made portable for the target repository audience.

## Anti-patterns

Do not make a polished one-shot screen that hides unresolved interactions, prototype a headless feature just to follow a ritual, invent production tokens, confuse screenshots with clickable behavior, claim a browser test that did not run, silently add deferred features, or simulate success while presenting it as a live integration.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
