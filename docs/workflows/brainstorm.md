## Procedure

Resolve the context and draft output directories from the repo-root `.product-bench-install.json`; use the preamble's reviewed context and explicitly supplied evidence. Preserve the original problem statement. Name the audience, intended outcome, constraint, and decision horizon. If facts are missing, brainstorm with labeled assumptions; do not present hypothetical pain as research.

### Default: diverge wide, converge hard

1. Reframe the problem three ways: the supplied framing, the user's behavior/job, and a business or positioning framing. Do not smuggle a favored feature into the problem.
2. Independently apply four forcing lenses, producing at least two or three ideas per lens: product (what pain/value?), design (what mental model/friction?), engineering (what can existing capabilities make cheap?), and GTM (what distribution or positioning does this unlock?). Add different personas, surfaces, mechanisms and ambitions; include quick wins and at least one uncomfortable longer bet.
3. Generate **15–20 distinct one-sentence ideas** before ranking. Cluster by mechanism or unmet need, never by whether you like them. If most ideas are variations on one UI, diverge again. Tag proposed capabilities that do not exist.
4. Compare clusters on user value, evidence, feasibility and business fit. Use the actual reviewed product/constraints when converging. Pick **one** recommended path, compare it with the strongest alternative, and explain why this audience and stage favor it. Do not call a preference validation.
5. Describe a buildable two-week version (or explicitly flag a different realistic timebox). Before recommending engineering commitment, compare cheap pretotypes: manual service/Mechanical Turk, landing page, paper/clickable prototype, and Wizard of Oz. Choose one with audience, measurement, cost, timebox, success and stop criteria; distinguish interest from realized value.
6. Identify a good rejected alternative and the condition that would revive it. Route the recommended path to `pb-hypothesis`; offer a dated parking lot beneath the configured output directory. Propose a roadmap exclusion only if it is an actual team decision. No automatic context writes or permanent backlog expansion.

### OST: opportunities before solutions

For `ost`, replace the 15–20-idea layout with an Opportunity–Solution Tree. Start with a desired user/business outcome, metric and horizon when known. Map **5–8 unmet needs**, with affected persona, frequency/severity, dated source and evidence strength (weak/moderate/strong/confirmed). Opportunities describe struggles, not feature requests. Include a counterintuitive branch only when evidence or an explicit assumption supports it.

Generate two or three solution hypotheses per viable opportunity. Score desirability (users care), viability (business outcome), and feasibility (test within the constraint), each 1–5 with a short reason; numerical totals are decision aids, not measured truth. Recommend one opportunity branch; keep solution commitments loose. Map its desirability, viability and feasibility assumptions to confidence, disconfirming evidence and cheapest test. If all opportunity evidence is weak, recommend `pb-uxr pre` before a build decision. Hand the top solution and assumption map to `pb-hypothesis`.

### Make divergence and the OST auditable

Default cluster comparison includes idea count, strongest member, key evidence, and trade-off; the counts must reconcile to the numbered idea list. Test range across personas, surfaces, mechanisms, and quick-win versus longer bets before ranking. Include at least one genuinely early idea in the revisit list, not only near runners-up. Give each parked idea an explicit review trigger; propose a next-sprint review and a 60-day disposition review when the project has no policy. Disposition means reviewed promote/park/discard, never automatic deletion.

In OST, preserve an actual short participant quote and source when available; otherwise use a clearly marked paraphrase or assumption, never quote-shaped invention. Desirability asks whether enough of the relevant users experience this need; viability asks whether addressing it changes the business outcome; feasibility asks whether a **test**, not a production system, fits about two sprints. Show a total alongside the three component scores and evidence strength. A weak-evidence branch with a high score is still weak evidence. Explain the selected branch in two or three concrete sentences and name the condition that would move the runner-up ahead. The next `pb-hypothesis` input includes the selected solution, actual need evidence, and riskiest assumption, so it need not re-derive the tree.

**What to write:** “Late gap discovery happens before replacement outreach; test whether earlier notice changes outreach.” **Avoid:** “Build a notification center to improve engagement.” The first identifies a causal uncertainty; the second sneaks in a solution and an undefined result.

## Output template

Default:

```markdown
# Brainstorm: [problem]
## Problem reframes
Original: ... | User behavior: ... | Business/positioning: ...
## Lens coverage
Product: ...; Design: ...; Engineering: ...; GTM: ...
## Ideas by cluster
### [Mechanism/theme]
1. [Distinct idea] — [one sentence; evidence/assumption where needed]
[Continue to 15–20 ideas across genuinely different clusters.]
## Cluster comparison
| Field | Value |
|---|---|
| Cluster / idea count | |
| Strength | |
| Weakness | |
| Evidence/constraint | |
| Best idea | |
## Recommended path
One choice; why it beats the runner-up; fit to this audience/stage.
Two-week testable version; intentionally excluded scope.
## Pretotypes
| Field | Value |
|---|---|
| Type | |
| What to fake | |
| What we learn | |
| Cost/time | |
| Threshold/stop rule | |
Chosen pretotype: [one; exact audience, measurement and decision]
## Revisit later
[Idea; reason excluded; revisit trigger/date]
## Next action
[Candidate hypothesis; unresolved evidence; suggested owner]
```

OST:

```markdown
# OST: [desired outcome]
Outcome: [metric, baseline if known, horizon]
## Opportunities
[5–8 needs; persona; frequency; severity; actual quote/paraphrase/source; strength]
## Solution space
| Field | Value |
|---|---|
| Opportunity | |
| Solution A | |
| Solution B | |
| Solution C | |
## Opportunity scoring
| Field | Value |
|---|---|
| Need | |
| Desirability | |
| Viability | |
| Feasibility | |
| Total | |
| Evidence strength / rationale | |
## Recommended branch
[One branch; runner-up; condition that changes the choice]
## Assumption map
| Field | Value |
|---|---|
| Assumption | |
| Type | |
| Confidence | |
| Falsifier | |
| Cheapest test | |
## Next decision
[Research or hypothesis; evidence needed before build]
```

## Worked example

**Fictional miniature illustrating convergence, not a full 15-idea output:** a volunteer scheduling product wants fewer uncovered shifts. Reframes: fill slots; help coordinators detect fragile coverage; reduce last-minute service cancellations. Idea clusters include early reminders, easier swaps, coordinator-assisted matching, and reducing shift commitments. The design lens suggests a one-tap swap request; the GTM lens suggests an organization-led invitation loop; engineering suggests a manual digest before any matching algorithm. Choose the **manual at-risk-shift digest**, not an algorithm, because the first uncertainty is whether coordinators can act on earlier warnings. Two-week version: one coordinator cohort, a weekly human-prepared list, no automated assignment. Pretotype: six fictional coordinators receive manually prepared warnings; measure warnings acted on within 48 hours, with a proposed success threshold of four of six. These are proposed experiment numbers, not research results. Revisit matching only if coordinators act but cannot find replacements. An OST need would be “coordinators discover shortages too late,” not “coordinators need a digest.”

## Quality checks

- Default includes 15–20 genuinely distinct ideas, all four lenses, different mechanisms and ambition levels.
- One recommendation explains the strongest alternative and actual context fit.
- A pretotype tests the riskiest assumption and has a measurable stop rule; a landing-page signup is not proof of ongoing use.
- OST separates outcome, needs, solutions and assumptions; evidence strength survives scoring.
- The artifact stays compact: one sentence per divergent idea, deeper explanation only for the chosen path and its test.

## Anti-patterns

- Starting with a dashboard and inventing problems to justify it.
- A shortlist masquerading as convergence, or scoring unsupported assumptions as established facts.
- Twenty cosmetic variants of one solution; safe ideas only; excluding GTM from the lens pass.
- Requiring an engineering build before testing whether anyone values the outcome.
- Writing a parking lot, roadmap commitment, or hypothesis log without reviewed authorization.
