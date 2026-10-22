## Procedure

Create a decision-ready stakeholder one-pager that takes about 90 seconds to read. Confirm the topic, intended audience, exact decision or action, deadline, and constraints. If the action is missing, infer a proposed ask and label it for confirmation rather than writing a document with no decision.

Resolve the brain directory from `.product-bench-install.json` and use the configured output directory. Read the declared evidence and approved voice. Separate user observations, measures, decisions, and assumptions. Do not retrieve undeclared source files merely because a context document links to them.

1. **Define the ask first.** Name an action such as approve a pilot, allocate capacity, decide between alternatives, or unblock access. Specify the accountable recipient, deadline, requested budget/capacity where relevant, and the consequence of the decision. “Align on the opportunity” is not an ask.
2. **Choose the audience's decision frame.** Executive: outcome, cost, risk, and reversibility. Engineering: concrete behavior, constraints, tradeoffs, and scope. Investor/board: growth mechanism, durability, evidence, and capital use. Cross-functional: dependencies, ownership, and changed responsibilities. These are starting frames; use known audience priorities rather than assigning motives from title alone.
3. **Build the reasoning chain.** Present the current situation, specific problem, attainable opportunity, proposal, and why timing matters. Include the strongest credible alternative, including waiting. Distinguish an actual deadline from manufactured urgency. A quantified claim needs a source, window, unit, and method; missing evidence stays `[NEEDS DATA]`.
4. **Show the costs of being wrong.** Select the material risks, likelihood with rationale, mitigation, owner, and a stopping/revisit signal. Do not invent likelihood percentages. Explicitly identify the tradeoff being accepted.
5. **Cut for 90-second use.** Normally aim for 300–450 words, fewer where the decision is simple. Use 1–2 sentences per paragraph, with 3 as a maximum. Keep supporting depth in links to approved artifacts. If the ask becomes buried, move it next to the opening; do not add an executive summary to a brief that already is one.
6. **Review and hand off.** Check whether every sentence changes the audience's decision or action. Use an available writing reviewer for clarity, concision, and a defensible ask; when unavailable, apply these checks directly and disclose any incomplete independent review requirement. Save the brief and propose logging any resulting decision through the reviewed context workflow after the meeting. Delivery itself requires the user's authorization.

### Voice

Apply configured brand voice. Default to concrete words, active verbs, sentence case, and direct claims. Use zero em-dashes. Cut “pivotal moment,” “leverage,” “holistic,” “robust,” “align,” and filler such as “it's worth noting.” Avoid negative parallelisms such as “This isn't a tooling problem. It's a strategy problem.” State the observed problem and recommendation directly. Uncertainty should be plain, not hidden in hedging.

## Output template

```markdown
# [Topic]: one-pager for [Audience]
Decision needed: [specific action] | By: [date] | Decision owner: [role]

## The situation
[2–3 short sentences: current state and evidence.]

## The problem
[Specific failure, unmet need, or risk; quantified only with source.]

## The opportunity
[Outcome the audience values; evidence and uncertainty.]

## What we propose
[1–2 sentences: action, scope, cost/capacity, owner.]
Alternative considered: [best alternative and why this proposal is preferred.]

## Why now
[Real trigger; what changes after 30/60/90 days when relevant.]

## Risks and mitigations
| Field | Value |
|---|---|
| Risk | |
| Likelihood and basis | |
| Mitigation / owner | |
| Stop or revisit signal | |

## The ask
**[Recipient] to [specific action] by [date or milestone].**
[Budget, headcount, access, or dependency needed.]

## Supporting evidence
[Short source links/dates, open assumptions, link to full spec or analysis.]
```

## Worked example

Fictional illustration only. Imagine an internal request to test a revised onboarding checklist; no measured impact is asserted.

**Decision needed:** Approve a 2-week pilot with one implementation team. `[FICTIONAL ASSUMPTION]`

**Situation:** The team reports repeating setup questions in handoffs. `[NEEDS DATA: dated handoff examples]`

**Proposal:** Assign one owner to test the checklist on the next eligible onboarding. Record unresolved steps and time spent; compare against the prior workflow only after collecting a baseline.

**Risk:** A checklist may add work without reducing omissions. **Mitigation:** Keep it to the steps that affect completion and stop the pilot if users duplicate the same work.

**Ask:** “Approve the pilot and name its owner before the next onboarding starts.”

Weak: “We should align stakeholders to unlock seamless onboarding.” Better: “Approve a small pilot so we can measure whether the checklist reduces repeat setup questions.” Neither version may claim a reduction before evidence exists.

## Optional writing refinement

If the user asks “refine with editorial-draft” or requests a writing review, read `<brain_dir>/runtime/payload/brain/EDITORIAL-DRAFT.md` and resolve the actual installed Editorial Draft skill automatically. No separate configuration or repeated voice setup is needed. If absent, report the missing dependency and leave the requested refinement pending. When installed, reuse the approved draft and evidence in refinement mode: skip repeated style interviews, research, and outline phases; run the selected reviewers and polish. Suggested preset: **Executive Communicator, decision first**. Selected review jobs: Hemingway for the 90-second limit; Clarity for cross-functional jargon; Devil’s Advocate for whether the ask follows from the evidence. Read and execute the selected actual reviewer files and canonical polish instructions; do not simulate reviewer execution. Preserve the original claims, caveats, sources, and command structure through the edit.

If unavailable, disclose that fact and apply those exact checks directly; distinguish manual review from independent reviewer execution. Do not strip story pacing to meet a generic brevity score, or shorten spoken responses until their meaning breaks. Record material changes and any pending independent-review requirement.

## Quality checks

- The audience knows what action to take, by when, and who owns it within the first few lines.
- The recommendation follows the evidence; assumptions and the best alternative remain visible.
- The timing rationale is factual and the material tradeoff is stated.
- Numbers include derivation; a missing baseline is not treated as a result.
- A read-aloud or estimated reading-time check supports the 90-second target.
- Supporting documents stay in the appendix; the brief stands alone.

## Anti-patterns

An entire spec disguised as a brief; abstract urgency; technical detail irrelevant to the decision; an ask to “align”; a proposal with no owner; no downside or alternative; unsupported ROI; three summaries of the same point; sending or logging decisions before the user has approved the applicable action.
