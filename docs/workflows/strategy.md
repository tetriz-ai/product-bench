## Procedure

Build an opinionated strategy above the roadmap: a choice about whom to serve, how to win, and what to decline. Read the configured product, user research, competitive intelligence, stakeholder/buyer architecture, constraints, and metrics. Apply supplied project voice guidance; otherwise write direct claims and short paragraphs. Distinguish separate product lines, entry products, and platform offerings rather than imposing one strategy on all of them.

1. Establish the decision, horizon, current stage/resources, and evidence freshness. Distinguish verified current advantage from aspirational differentiation. For changing market facts, research current primary sources when permitted; otherwise state the date and limitations of supplied material.
2. Frame the problem structurally: specific persona, actual workaround, why alternatives leave it unsolved, and cost of inaction. Define one beachhead with a purchase/adoption trigger and real champion/buyer/approver chain. Do not assume a developer-led buying model or free entry product unless this project's evidence supports it.
3. State a compelling future outcome, a specific value proposition, and the mechanism that makes it credible. An “only” claim requires comparative proof; use a narrower verified statement when proof is absent. Differentiate a repeatable advantage from a hypothetical moat.
4. Choose two or three directional investment bets, each with a belief, falsifying signal, evidence/confidence, horizon, and next test. Bets are not a feature backlog. Explicitly name excluded segments and initiatives that would otherwise tempt the team.
5. Select a primary GTM motion and defend it from actual discovery, activation, buying, and expansion behavior. Name concrete channels and the action that creates sharing or referral if one exists. A viral loop is not mandatory; mark it absent rather than inventing one.
6. Choose the primary revenue/value metric and explain how payment grows with customer value. Describe any free offer's strategic purpose and paid/enterprise trigger; no universal free tier, seat model, or enterprise path. Check consistency with the proposed ICP and acquisition motion.
7. Assess competitors and substitutes honestly, including where the product loses. Identify reachable displacement segments and structural defensibility through evidence for data accumulation, network effects, switching costs, and distribution. A feature list is not a moat.
8. Integrate the canvas: do bets support the vision, does the GTM reach the ICP, and can monetization work within constraints? Take a position and label load-bearing uncertainty. Save beneath the configured output directory; propose reviewed updates to product/user/competitor/decision context through `pb-compound`, without silently rewriting strategy or contacting stakeholders. Recommend `pb-hypothesis`, `pb-gtm`, and `pb-pricing` for the corresponding next decisions.

### Canvas depth and strategy handoff

Vision is a concrete, achievable approximately three-year user/world outcome, adapted to the actual planning horizon; it is not a feature release promise. Beachhead rows preserve company/context fit, role, trigger, and buying sequence as separate fields. Each strategic bet states **mechanism, needed capability, evidence/confidence, leading signal, falsifier, investment/cost uncertainty, and dependency**. Include a plausible counterstrategy and explain why the recommended path wins under present constraints; name the evidence that would reverse that choice.

For defensibility evaluate separately: what data actually compounds; whether another user's participation increases value; what legitimate switching cost exists; and which distribution access competitors cannot readily reproduce. Score ordinary integrations honestly as replicable. Forecasted advantage remains a proposed bet with a test, never a present-tense moat.

After the canvas provide a decision-ready alignment packet: sections 3–5 (ICP/value/bets) for stakeholder discussion, section 7 for `pb-pricing`, and one IF/THEN/BECAUSE candidate per major bet for `pb-hypothesis`. Propose the smallest durable deposits: chosen bets and reasoning → decisions; segment/buyer findings → users/stakeholders; competitive changes → competitors; an explicitly adopted strategic replacement → product context. A draft alone does not supersede existing strategy. This packet is a proposed handoff, not a claim that exec alignment occurred.

## Output template

```markdown
# Product Strategy: [Product / initiative]
Prepared: [date] | Horizon: [period] | Context freshness: [warnings]

## 1. Vision
By [year], [specific user] can [meaningful outcome] because [credible contribution].

## 2. Problem Worth Solving
Who / current workaround / structural reason unsolved / cost of inaction: [sourced specifics].

## 3. Target Segment & ICP
Beachhead: [company/context, role, trigger, champion→buyer→approver chain].
Not targeting yet: [real segments + why].

## 4. Unique Value Proposition
For [ICP], [product/category] delivers [distinct outcome] through [verified mechanism].
Current advantage vs aspiration: [evidence].

## 5. Strategic Bets

**Record 1**

| Field | Value |
|---|---|
| Bet / mechanism | [directional choice] |
| Capability / dependency / investment | [needed capability; cost known/gap] |
| Belief / confidence / evidence | [source/confidence] |
| Leading signal / falsifier | [early signal; falsifier] |
| Horizon / next test | [timing] |


## 6. GTM Motion
[Primary motion and rationale; discovery channel, first value, buying/expansion trigger, sharing mechanism if real.]

## 7. Revenue Model
[Primary model/value metric; alignment with value; free-offer purpose if applicable; paid/enterprise trigger.]

## 8. Competitive Positioning

**Record 1**

| Field | Value |
|---|---|
| Competitor/substitute | [alternative] |
| Their buyer/value | [source] |
| Verified difference / our gap | [buyer consequence] |
| Reachable opportunity | [segment/trigger] |

Positioning sentence: [specific positive claim, evidence bounded].

## 9. Defensibility
[Evidence and limits for data, network effects, switching costs, distribution; absent advantages stated.]

## Say No To
| Declined initiative/segment | Why | Revisit trigger |
|---|---|---|
| [plausible alternative] | [trade-off] | [signal] |

## Open Questions
[Uncertainty, owner, evidence/test, resolution gate.]
```

## Worked example

**Fictional example: a repair-shop scheduling product.** The chosen beachhead is independent shops that already track jobs digitally but coordinate pickup times by phone. The strategy bets on fewer missed pickups, a simple customer booking link, and adoption through local trade associations. It declines multi-location franchise management for now because permissions and central billing would divert the small team from the initial bet. Payment scales by active shop rather than customer bookings to avoid discouraging usage. “Booking links drive fewer interruptions” is a hypothesis, not measured success; the next test compares interruption counts in consenting pilot shops. No network effect is claimed merely because customers share links.

## Quality checks

All nine canvas sections exist and agree; strategic choices and a credible no-list are explicit. Bets have disconfirming signals. ICP, buying chain, GTM, and pricing fit together. Present-day claims have sources, dates, and limits; no invented unique advantage, validation, customer, or stakeholder alignment. Open questions could actually change the recommendation.

## Anti-patterns

Do not list every possible market, call a feature roadmap strategy, paste another company's adoption chain into the canvas, confuse brand adjectives with a unique value proposition, declare a moat from ordinary integrations, invent a viral loop, or quietly treat a generated strategy as an approved change to company direction.
