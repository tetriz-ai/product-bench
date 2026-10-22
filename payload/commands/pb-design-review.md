<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, brand-voice.md]
capabilities: [design source optional]
-->

# /pb-design-review

Audit a design against user goals and requirements.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Design artifact, spec, audience | Evidence-backed usability and consistency findings with priorities |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Inspect actual screens or files.
2. Separate observed defects from preference.
3. Identify spec-design gaps and accessibility risks.



## Procedure

Audit the actual design and its agreement with the product spec. Read configured context and the linked artifact, recording what could be inspected. Use an available design connector, prototype/browser view, supplied screenshots, or exported frames according to host permissions. Never name connector operations as completed unless they ran. If only screenshots are available, distinguish visual observations from interaction, keyboard, screen-reader, and responsive behavior that cannot be verified.

1. Inventory inspected screens, components, role variants, and states; record source version/date when available. Derive behavior only from visible design or verified interaction. Mark missing/loading/error states “not designed” rather than inventing them.
2. Score seven dimensions from 0–10 using specific evidence: layout/hierarchy; typography/readability; color/contrast; spacing/alignment; interaction states; accessibility; responsiveness. A 10 needs supporting coverage; a 3 indicates major barriers or missing coverage. Use **UNVERIFIED** instead of a numeric score when evidence is insufficient. Averages include only verified scores and show the denominator, never conceal unknown dimensions.
3. Inspect hierarchy and focal points, type scale/line-height/truncation, semantic color and contrast, spacing/grouping, hover/active/focus/disabled/loading/empty/error/success states, keyboard/reading order/labels/targets, and mobile/tablet/desktop overflow. Use the project's actual design system; do not impose a generic aesthetic. Treat applicable accessibility standards as configured requirements and distinguish measured contrast from visual guesses.
4. Extract each screen's purpose, entry points, components/actions, exact visible labels, and every designed state. Follow main and edge interaction flows where possible. Separate observed behavior, missing design, and proposed fix.
5. Compare **both directions**: designed but absent from the spec, and specified but absent from the design. Locate the precise screen and spec requirement for each gap. When no spec is supplied, report a design-only review and list contract questions; do not imply a completed gap check.
6. Surface implicit choices requiring explicit product/design decisions: pagination vs continuous loading, permissions, deletion recovery, empty-state CTA, data freshness, defaults, or role visibility. Recommend a resolution with its user consequence, owner, and severity; do not silently ratify it.
7. Prioritize the top three changes by user impact, then provide the complete findings and coverage summary. Save a separate review artifact under the configured output directory; avoid mutating the design or spec without authorization.

### Scoring anchors and inspection evidence


**Record 1**

| Field | Value |
|---|---|
| Dimension | Layout & hierarchy |
| Strong evidence for 9–10 | Primary action and information order are obvious across inspected screens |
| Major gap around 3 | Competing focal points obscure the task |
| Required inspection | Actual frame, content order, grouping, focal points |


**Record 2**

| Field | Value |
|---|---|
| Dimension | Typography & readability |
| Strong evidence for 9–10 | Readable at normal size with consistent hierarchy and handling of long strings |
| Major gap around 3 | Clipped labels, tiny type, ambiguous headings |
| Required inspection | Rendered type, line-height, truncation and representative long content |


**Record 3**

| Field | Value |
|---|---|
| Dimension | Color & contrast |
| Strong evidence for 9–10 | Measured applicable contrast passes and semantic colors stay consistent |
| Major gap around 3 | Contrast failures or color-only meaning |
| Required inspection | Measured foreground/background pairs and stated requirement |


**Record 4**

| Field | Value |
|---|---|
| Dimension | Spacing & alignment |
| Strong evidence for 9–10 | Consistent product tokens and grouping reinforce related tasks |
| Major gap around 3 | Uneven spacing separates related elements |
| Required inspection | Verified tokens and inspected spacing/alignment |


**Record 5**

| Field | Value |
|---|---|
| Dimension | Interaction states |
| Strong evidence for 9–10 | Relevant hover/focus/disabled/loading/empty/error/success states and recovery are present |
| Major gap around 3 | Default screen only |
| Required inspection | Designed state inventory; interactive checks for claims about behavior |


**Record 6**

| Field | Value |
|---|---|
| Dimension | Accessibility |
| Strong evidence for 9–10 | Required labeling, focus, reading order, targets and keyboard paths are verified |
| Major gap around 3 | Major barriers to required access paths |
| Required inspection | Interactive/accessibility evidence; a screenshot alone is insufficient |


**Record 7**

| Field | Value |
|---|---|
| Dimension | Responsiveness |
| Strong evidence for 9–10 | Required breakpoints and overflow paths are covered with representative content |
| Major gap around 3 | Required smaller surfaces absent or broken |
| Required inspection | Actual breakpoint frames or resize checks, not inference from desktop |


These are anchors for judgment, not proof of certification. Coverage gaps qualify the score; insufficient evidence means UNVERIFIED. Cite the applicable accessibility target and verified product requirements rather than treating one hardcoded target size or reading pattern as universal.

## Output template

```markdown
# Design Review: [Feature]
Source: [URL/path, version/date if available]
Inspection: [tools/material inspected; limitations]
Companion spec: [link or none]

## Scorecard

**Record 1**

| Field | Value |
|---|---|
| Dimension | Layout & hierarchy |
| Score / UNVERIFIED | [0–10] |
| Specific evidence | [frame/element] |
| Coverage limitation | [limitation] |


**Record 2**

| Field | Value |
|---|---|
| Dimension | Typography & readability |
| Score / UNVERIFIED | [...] |
| Specific evidence | [...] |
| Coverage limitation | [...] |


**Record 3**

| Field | Value |
|---|---|
| Dimension | Color & contrast |
| Score / UNVERIFIED | [...] |
| Specific evidence | [...] |
| Coverage limitation | [...] |


**Record 4**

| Field | Value |
|---|---|
| Dimension | Spacing & alignment |
| Score / UNVERIFIED | [...] |
| Specific evidence | [...] |
| Coverage limitation | [...] |


**Record 5**

| Field | Value |
|---|---|
| Dimension | Interaction states |
| Score / UNVERIFIED | [...] |
| Specific evidence | [...] |
| Coverage limitation | [...] |


**Record 6**

| Field | Value |
|---|---|
| Dimension | Accessibility |
| Score / UNVERIFIED | [...] |
| Specific evidence | [...] |
| Coverage limitation | [...] |


**Record 7**

| Field | Value |
|---|---|
| Dimension | Responsiveness |
| Score / UNVERIFIED | [...] |
| Specific evidence | [...] |
| Coverage limitation | [...] |

Average: [verified scores only; N/7 dimensions]

## Top Three Fixes
1. [Location, concrete change, user consequence, severity]

## Screen Inventory & Specs

**Record 1**

| Field | Value |
|---|---|
| ID | S1 |
| Screen / role variant | [name] |
| Purpose / entry | [task] |
| Primary action | [action] |
| Designed states / missing states | [coverage] |

### S1: [Screen / role variant]
Purpose: [User task this screen supports]
Entry points: [Observed route or link; otherwise unverified]


**Record 1**

| Field | Value |
|---|---|
| Component | [control] |
| Designed / observed action | [click/hover/focus response, when verified] |
| Evidence | [frame or interaction receipt] |
| Missing behavior or proposed fix | [gap] |



**Record 1**

| Field | Value |
|---|---|
| State | Default |
| Trigger | [condition] |
| Visible result | [designed response] |
| Recovery / next transition | [next step] |
| Evidence status | [source] |


**Record 2**

| Field | Value |
|---|---|
| State | Loading / partial |
| Trigger | [condition] |
| Visible result | [response or not designed] |
| Recovery / next transition | [transition] |
| Evidence status | [source/gap] |


**Record 3**

| Field | Value |
|---|---|
| State | Empty / below-threshold |
| Trigger | [condition] |
| Visible result | [response or not designed] |
| Recovery / next transition | [next action] |
| Evidence status | [source/gap] |


**Record 4**

| Field | Value |
|---|---|
| State | Error / unavailable |
| Trigger | [condition] |
| Visible result | [response or not designed] |
| Recovery / next transition | [retry/recovery] |
| Evidence status | [source/gap] |


**Record 5**

| Field | Value |
|---|---|
| State | Disabled / permission |
| Trigger | [role/condition] |
| Visible result | [response or not designed] |
| Recovery / next transition | [appropriate action] |
| Evidence status | [source/gap] |


**Record 6**

| Field | Value |
|---|---|
| State | Success / reversion |
| Trigger | [condition] |
| Visible result | [response or not designed] |
| Recovery / next transition | [next state] |
| Evidence status | [source/gap] |


Exact copy: [UI element] → “[Inspected label]”.
Open questions: [Implicit choice, effect, decision owner].
[Repeat this screen block for every inspected screen; mark genuinely irrelevant states not applicable with a reason.]

## Flows & Component Notes
[Happy/edge paths; new/reused components; verified design-token deviations.]

## Designed but Not Specified

**Record 1**

| Field | Value |
|---|---|
| Item | [item] |
| Screen | [S1] |
| Gap / consequence | [missing contract] |
| Proposed action / owner | [resolution] |


## Specified but Not Designed

**Record 1**

| Field | Value |
|---|---|
| Requirement | [behavior] |
| Spec reference | [section/AC] |
| Missing design | [frame/state] |
| Proposed action / owner | [resolution] |


## Implicit Decisions Needing Agreement
[Decision, current design implication, user consequence, owner.]

## Coverage & Next Action
[Inspected screens/states, unverified areas, gap counts, prioritized decision.]
```

## Worked example

**Fictional example: a document organizer's mobile mockup.** The deletion screen shows an undo toast, but the spec requires permanent deletion confirmation. Report this as a concrete designed/spec mismatch rather than declaring either correct. A screenshot supports a typography finding about clipped filenames, but cannot verify keyboard order, focus restoration, or whether Undo works. Mark those UNVERIFIED and ask for an interactive artifact. The spec mentions network-failure recovery with no matching frame; the reverse gap check requests that state. The top fix is to resolve deletion semantics before polishing spacing.

## Quality checks

Every score has visible or measured evidence; unknowns stay unknown. Both gap directions run when a spec is supplied. Missing states and implicit choices are explicit. Exact copy is quoted from the inspected source. Accessibility compliance is not inferred from a pretty frame. Coverage counts refer only to inspected material.

## Anti-patterns

Do not treat a default desktop frame as a complete responsive design, invent metadata/connector access, apply arbitrary aesthetic rules, score unavailable interactions as passing, rewrite the design while reviewing, or generate an imagined spec and then claim it matches the design.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
