<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, technical-constraints.md, brand-voice.md, metrics.md, roadmap.md]
capabilities: []
-->

# /pb-premortem

Find credible failure paths before committing.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Plan, launch, or decision | Failure scenarios, early signals, mitigations, owners, and revisit triggers |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Imagine a specific failed outcome.
2. Separate likely failures from dramatic but implausible ones.
3. Turn the strongest scenarios into checks or scope decisions.



## Procedure

Resolve Product Bench context/output paths from `.product-bench-install.json`. Read the supplied plan/spec/launch brief and reviewed user/product/technical constraints; use metric/team context only when declared. State today's date, planned launch horizon, intended outcome, and an imagined failure **six months after launch** (adapt if the initiative requires another horizon). Commit to a concrete failed outcome: describe what happened, to whom, and why it hurt. These are hypothetical scenarios, not predictions or observed customer facts.

### Explore five failure classes

Identify specific mechanisms in all relevant classes; do not force a risk where it does not apply:

1. **Adoption:** users never discover/try it, the extra action outweighs value, the beneficiary and required actor differ, or the product reaches the wrong persona.
2. **Value delivery:** users try it but the output is late, irrelevant, hard to act on or fails their actual job; an attractive metric masks missing value.
3. **Technical/data:** stale or missing data, permission exposure, incorrect output, scaling/integration failure, partial states or recovery gaps.
4. **GTM/commercial:** buyer lacks proof, packaging/pricing does not fit, activation never becomes payment/retention, claims outrun shipped behavior, or sales/support cannot explain limits.
5. **Organizational/process:** absent owner, hidden dependency, delayed handoff, uninstrumented success criteria or a launch gate nobody operates.

For every failure, state a concrete trigger -> mechanism -> consequence, root cause, evidence/assumption, likelihood and impact with rationale, and prevention. “Users don't adopt” is an outcome; “coordinators do not see warnings because they only work from messaging and warnings require a new login” is a mechanism. Keep speculative risks labeled and preserve credible counterevidence.

### Rank and choose responses

Rank the top three by **likelihood × impact**, using an explicitly defined ordinal scale (for example low=1, medium=2, high=3); clarify that products of ordinal scores are a sorting aid, not estimated loss. Break ties by exposure, reversibility and detection delay. Do not rank dramatic catastrophes above every likely failure solely for drama.

Classify top risks using the source framework: **Tiger** (high probability/high impact: mitigate before commitment; reconsider launch if unresolved), **Paper Tiger** (likely/low impact: monitor; do not create a disproportionate blocker), **Elephant** (unlikely/high impact: write and rehearse a contingency). Medium combinations need an explained proportional response; do not force a false category. The label guides action, not rhetoric.

### Convert stories into gates

For each top risk define prevention, accountable owner (actual if known; otherwise `[OWNER NEEDED]`), phase, verification evidence, leading indicator and threshold. Separate **pre-build**, **pre-launch**, and **first one-to-two weeks after launch**. Verify instrumentation/permissions against real constraints; mark missing measurement as a readiness gap, not an operational gate. A feature flag is useful only if supported; otherwise choose an actual rollout/reversal mechanism. Include a concrete rollback/pause/escalation condition and who makes it.

Identify top risks missing from the spec and label their severity for `pb-review-spec`. A proposed blocker needs consequence and remedy; only policy/contract-supported gates are mandatory, otherwise recommend them for user decision. State the one factor most likely to flip the failure into success. Save the requested draft to the configured output directory. Provide a paste-ready owner checklist for the tracker and an analytics verification proposal; sending it to people or editing trackers needs authorization. Do not pretend a drafted checklist was assigned or instrumented.

### Show the moment of failure, then make prevention verifiable

Write the six-month failure story in definite past tense as a thought experiment: “Coordinators saw stale availability, requested unavailable replacements, and stopped trusting warnings.” Rank its proposed risks using the defined scale, while clearly retaining that the story is hypothetical. A risk's root cause should be one layer deeper than its outcome: stale availability may come from missing refresh ownership, not simply “bad data.” Include a credible counter-signal when available and distinguish a prevention action from a detection or recovery action.

For each top-three risk add a short narrative containing why it outranks the runner-up, action, owner, timing, and what proof would close it. Checklist items are operational only if an accountable role can verify exit evidence. “Instrumentation added” should name the verified event/query and check; “rollback ready” should name the actual reversible surface and rehearsal. In a tracker handoff retain the linked spec section and missing-gate severity, so `pb-review-spec` can assess the correction. A spec omission is not automatically a universal launch veto; explain the consequence and decision required.

**Write:** “Warnings arrive after the coordinator's outreach window; verify delivery at least 72 hours before eligible shifts in the pilot.” **Avoid:** “Users may not like notifications; monitor adoption.” The first can be checked and assigned; the second cannot drive prevention.

## Output template

```markdown
# Premortem: [initiative]
Today: [actual date] | Launch: [known/proposed] | Imagined failure: [date/horizon]
Success intended: [outcome]
Failure story: [concrete scenario, hypothetical]
## Failure modes by class
### [Adoption / value / technical-data / commercial / process]
| Field | Value |
|---|---|
| Failure mechanism | |
| Likelihood/rationale | |
| Impact/rationale | |
| Root cause | |
| Evidence/assumption | |
| Prevention | |
[Repeat for relevant classes; explain N/A briefly.]
## Top three
| Field | Value |
|---|---|
| Rank | |
| Risk | |
| L×I and scale | |
| Why above alternative | |
| Tiger/Paper Tiger/Elephant or explained response | |
## Prevention checklist
### Pre-build
- [ ] [Owner] — [action; verifiable exit evidence; due/phase]
### Pre-launch
- [ ] [Owner] — [action; rollout/reversal readiness]
### First 1–2 weeks
- [ ] [Owner] — [instrumented leading metric; threshold; response]
## Contingency and review gaps
[Trigger; rollback/pause/escalation; owner; unresolved spec gate]
## Success-flipping factor
[One specific lever and why]
## Next action
[Draft path; tracker-ready checklist; instrumentation gaps; no claimed execution]
```

## Worked example

**Fictional initiative:** a shift-warning feature shipped, but six months later coordinators still learned of gaps on event day. Adoption failure: warnings live behind a new login that coordinators seldom visit (likelihood high, impact high; **Tiger**). Pre-build mitigation: test a digest in their existing approved workflow; owner remains `[OWNER NEEDED]` until assigned. Data failure: stale availability recommends someone already committed (medium/high; proportionate validation gate). Commercial failure: warnings are marketed as guaranteed coverage, creating expectations the product cannot meet; verify claims before launch. Rare permission exposure is an **Elephant** requiring a written access-revocation/escalation plan. A proposed post-launch guardrail is fewer than half of actionable warnings viewed within 48 hours for two consecutive periods; verify the view event exists before treating it as a gate. The key success factor is actionable earlier notice, not more notifications. All probabilities and thresholds are fictional proposals, not measured outcomes.

## Quality checks

- Relevant failure classes span users, value, data, commercial motion and execution.
- Every important risk has a specific moment/mechanism, not a generic negative outcome.
- Top three ranking uses both likelihood and impact, evidence and uncertainty.
- Response matches risk class; each gate has owner, phase, proof and operational threshold.
- Unsupported instrumentation/rollout mechanisms remain open; a written mitigation is not evidence of implementation.

## Anti-patterns

- Hedging every scenario until the exercise loses its forcing function.
- Treating imagined failure as research, or inventing a customer's reaction.
- A catastrophic-risk list with no likely adoption/value failures.
- “Be careful,” “monitor adoption,” or ownerless checklists with no measurable response.
- Blocking a launch over every Paper Tiger; auto-assigning people, messaging teams or modifying trackers.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
