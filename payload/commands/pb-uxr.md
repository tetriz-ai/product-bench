<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [users.md, product.md, brand-voice.md, stakeholders.md]
capabilities: []
-->

# /pb-uxr

Plan or synthesize user research.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| pre | Learning objective, audience, assumptions | Discussion guide, recruitment criteria, and analysis plan |
| post | Consented notes or transcript and research question | Findings with quotes or paraphrases, contradictions, strength, and follow-ups |
| journey | Evidence across user stages | Journey map with pain points, moments of value, and gaps |

If no mode is named, use `pre`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Separate participant words from analyst inference.
2. Respect consent and redact personal details.
3. Deposit durable findings through compound.

## Research procedure

For pre, state the decision, learning objective, participant criteria, consent handling, neutral questions, probes, and synthesis plan. Avoid leading participants toward a feature answer.

For post, separate participant statements, observed behavior, and analyst inference. Preserve source pointers and dates while removing identifying details from shared summaries. Describe themes with supporting and contradicting cases. For journey, map stages, goals, actions, friction, workarounds, and evidence gaps. End with the next research or product decision, and deposit durable learning through compound.

## Procedure

Resolve context and output paths from `.product-bench-install.json`; read the reviewed dependencies and supplied notes. Detect `pre` from a learning objective/upcoming interview, `post` from one session's notes or transcript, and `journey` from multiple sessions or an explicit journey request. An explicit mode wins; clarify ambiguous inputs rather than synthesizing an interview that never occurred. Confirm consent, permitted use and redaction before handling participant material. Do not reproduce unnecessary identifiers in a shared artifact.

### Pre: discussion guide

State the product decision, hypothesis and what would count as a strong **YES and NO**. Define participant criteria and gaps in the sample; select actual personas rather than imposing job titles from another product. Plan neutral warm-up (about five minutes), behavioral probes (20–30), optional concept test (about ten), and close (about five); adapt to the time available. Ask for a recent concrete episode, the trigger, steps, workaround, cost and alternatives. Give each major probe a conditional follow-up. Separate behavior questions from solution reactions: showing a mockup too early contaminates the problem interview.

For a concept test, identify the artifact and ask “walk me through what you think this is” and “when would you reach for it?” Avoid pitching or asking whether they would love it. Specify recording consent, note-taker, observed behaviors to watch, and how answers will be coded against the decision. Recruitment messages or calendar sends are drafts unless separately authorized.

### Post: one-session synthesis

Preserve source pointers/timestamps, observation date, relevant participant role/context, current tools/workflow and session format (duration, concept shown or not). Separate **exact participant words**, paraphrase, observed behavior and analyst inference. Do not fill missing background from stereotypes. Use one section per distinct problem, in the participant's language: current solution, pain severity with basis, consequence and evidence. Do not merge different needs solely because the same feature might address them.

For each shown concept, classify reaction as strong yes / conditional yes / indifferent / no, with actual evidence, adoption condition and concern. Capture willingness-to-pay signals separately from usability enthusiasm; distinguish explicit budget/payment action, hypothetical interest and no evidence. Preserve the participant's actual priority ordering or state that none was elicited. Check each starting hypothesis as supported/weakened/invalidated/inconclusive **for this session**, not universally confirmed. Include contradictions, new signals, watch-outs, roadmap implications and follow-up probes. Nominate four to six archival quotes only when present and safe; fewer actual quotes beats invented completeness.

### Journey: cross-session pattern

Use three or more relevant sessions where possible; list actual session count, persona, recruitment scope and confidence limits. For fewer sessions, provide a provisional journey with explicit evidence gaps, not a representative map. Build one journey per materially distinct persona. Adapt stages to the real workflow; awareness, consideration, onboarding, recurring use, expansion and disengagement are prompts, not universal stages. For each stage capture goal/action, emotional state if evidenced, touchpoint, friction, workaround, intensity and product opportunity. Link every pattern to supporting and contradicting sessions. Do not infer an emotion from a click alone.

Identify the biggest **observed** drop-off and first-value/aha moment, or mark them unmeasured. Compare divergent persona journeys when evidence supports it. Recommendations should name the next decision and the evidence required; a small qualitative sample reveals mechanisms rather than population prevalence.

After `post`/`journey`, prepare a `pb-compound` deposit: safe verbatims/user findings, buyer signals or objections, hypothesis evidence and actual decisions. Display proposed reviewed-context changes before writing. Synthesis does not authorize transcript distribution, automatic context updates or a roadmap change. Save only the requested draft beneath the configured output directory.

### Question craft and synthesis granularity

A pre guide includes at least two neutral warm-up questions and a set of distinct core probes covering trigger, recent episode, workaround, consequence, alternatives, and trade-off. Adapt the number to the available interview time; depth beats a scripted interrogation. For example: “Walk me through the last time someone cancelled a shift.” If they found a replacement quickly: “What made that one easy?” If they could not: “What happened between the first message and the eventual decision?” Avoid “Would reminders make that easier?” until the problem episode is understood.

Post synthesis preserves each concept reaction separately, including any condition that changes a conditional yes to a no. A WTP row records a genuine price/budget anchor only if elicited, currency/period if stated, and whether the participant controls spending. Priorities are the participant's ordering, never the analyst's roadmap ordering. For each candidate archive quote include its source pointer and proposed persona/pain destination. For product implications distinguish **accelerate / deprioritize / new bet to consider**, with an evidence limitation and the next validation question for each; one session does not approve a roadmap.

Journey tables should cover the evidenced discovery-to-recurring-value path, not just purchase stages. Spell out the aha moment as trigger → action → experienced value → evidence; “dashboard viewed” is not automatically value. Compare persona divergence in a separate stage × persona table when journeys actually differ. If expansion or churn is unobserved, mark that stage as a research gap instead of filling in a conventional lifecycle story.

## Output template

Pre:

```markdown
# Discussion guide: [topic] — [persona]
Decision/learning objective: ...
Hypothesis: ...
Strong YES: [specific episode/behavior] | Strong NO: [disconfirming case]
Participants/sample gaps: ...
## Warm-up [time]
[Neutral role/workflow/context questions]
## Core probes [time]
[Recent episode question] — follow-up if [condition]: ...
[Workaround/cost/alternative probe] — follow-up: ...
## Optional concept test [time]
[Artifact; interpretation/task; adoption conditions; no sales pitch]
## Close [time]
[Missed topic; who else experiences it; referral if appropriate]
## Logistics and analysis
[Consent; recording; note-taker; behavioral signals; coding/decision rule]
```

Post:

```markdown
# Session synthesis: [safe participant ID] — [role/date]
Background: [relevant workflow, tools, session format; unknowns labeled]
## Problems [repeat separately]
[Participant-language problem]
Current solution: ... | Severity/basis: ... | Consequence: ...
Evidence: [exact safe quote/source; observation; inference clearly separated]
## Concept reactions
| Field | Value |
|---|---|
| Concept | |
| Reaction | |
| Evidence | |
| Adoption condition | |
| Concern | |
## Willingness to pay
| Field | Value |
|---|---|
| Capability | |
| Signal strength/type | |
| Evidence | |
| Budget anchor if explicit | |
## Participant priorities
[Actual ranking, or not elicited]
## Hypothesis check
| Field | Value |
|---|---|
| Hypothesis | |
| Session result | |
| Supports | |
| Contradicts/missing | |
## New signals and watch-outs
[Signal; evidence; implication; uncertainty]
## Archive candidates
[Safe actual quotes, source pointers, proposed persona/pain destination]
## Product implications and next probes
[Consider accelerating/deprioritizing/new bet; evidence needed]
## Compound proposal
[Exact reviewed changes; no automatic write]
```

Journey:

```markdown
# Journey: [persona] — [date; actual N sessions]
Scope/confidence: [sample limitations, source list]
| Field | Value |
|---|---|
| Stage | |
| Goal/action | |
| Emotion/evidence | |
| Touchpoint | |
| Pain/workaround | |
| Opportunity | |
| Sources/countercases | |
Biggest drop-off: [stage, friction, evidence or unmeasured]
First-value moment: [trigger/behavior, evidence or hypothesis]
Persona divergence: [stage-specific differences, if observed]
Next decision/research: [owner if known, missing evidence]
```

## Worked example

**Fictional notes:** participant P-07 says, “I text three people and wait for someone to reply” when a volunteer cancels. The supplied fictional transcript marks this at 12:08. Observation: the participant demonstrated a group-message workaround. Inference: response latency may be the bottleneck. The synthesis keeps those separate, rates severity medium because one session described a delay without missed service, and records **WTP: not elicited**. A suggested neutral next probe is “Tell me about the last cancellation nobody filled; what happened next?” A concept reaction “useful if availability is current” is conditional interest, not a payment signal. Two sessions describing texting are enough to form a follow-up question; a journey from those two is labeled provisional, with expansion/churn stages unobserved. The quote is fictional and must never be archived as a real participant finding.

## Quality checks

- Each mode has its own decision-oriented structure; pre includes disconfirming answers and follow-ups.
- Post separates quote, paraphrase, behavior and inference, preserving provenance and contradictions.
- Feature enthusiasm is not willingness to pay; absent pricing or priority evidence is stated.
- Journey discloses actual sample and avoids population claims or invented emotions/stages.
- Archival content is consent-compatible, safe and reviewed before entering shared context.

## Anti-patterns

- “Would you use our amazing feature?” or a concept pitch before understanding current behavior.
- Polishing a paraphrase into quotation marks; inventing four archive quotes to fill a template.
- Calling one supportive interview confirmed demand, or treating all participants as interchangeable.
- Merging distinct pains into the product's preferred feature taxonomy.
- Automatically posting transcripts, modifying personas or committing roadmap changes after synthesis.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
