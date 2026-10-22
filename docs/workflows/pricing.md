## Procedure

Design or assess pricing through customer value, buying predictability, incentives, and business sustainability. Read configured offers/capabilities, user and willingness-to-pay evidence, buyer architecture, competitors, metrics, and known costs. Separate pricing objectives from a price guess. Apply project voice guidance to buyer-facing copy.

1. Name the objective: adoption, revenue, expansion, retention, repositioning, or another explicit goal. Trace who receives value, who pays, when first value occurs, and procurement constraints. Do not require a free tier or impose another company's role-based upgrade path.
2. Compare candidate value metrics for alignment with value, bill predictability, ease of verification, growth, incentives, and cost exposure. Check whether a metric discourages the behavior the product needs. Prefer a defensible primary unit; hybrid models must explain both units and customer comprehension.
3. Design only the tiers justified by segments and capabilities. For each, name audience, included features, limits, upgrade trigger, billing unit/period/currency, minimums, and overage behavior. Explain the purpose of a free offer if proposed. Security/compliance/support commitments are verified capabilities or proposed scope, not automatic enterprise entitlements. Do not invent a contractual promise.
4. Verify current competitive benchmarks through dated authoritative sources when access permits. Normalize currency, period, per-unit basis, annual-versus-monthly billing, minimum seats/usage, feature differences, and public-versus-custom rates. Never transplant stale sample prices or infer undisclosed enterprise prices. Compare equivalent offers, not headline numbers alone.
5. Anchor willingness to pay in sourced research or deal evidence with persona, sample/window, purchase authority, verbatim if supplied, and confidence. A competitor price is not the customer's WTP; stated intent is weaker than actual purchase behavior. Missing evidence means a provisional range/test, not a confident final price.
6. Model representative low/typical/high usage bills and contribution economics using verified cost assumptions. Separate customer bill, revenue, variable cost, and margin; mark missing inputs rather than deriving false precision. Test edge cases such as inactive users, shared accounts, seasonal volume, overages, and cancellation/refunds where relevant.
7. Propose experiments with assumption, ethical exposure/design, decision threshold, owner, duration, and guardrail. Avoid deceptive promises or surprise charges. For changes to existing pricing, cover grandfathering/migration, communication, and churn risk. Recommend a specific model/value metric/entry offer or identify the evidence preventing a final decision.
8. Save under configured output. Recommend `pb-uxr` for WTP research and align `pb-gtm` messaging/upgrade triggers. Offer a reviewable pricing/context update; do not alter billing, run experiments, contact buyers, or promise prices without authorization.

### Decision detail and buyer-facing clarity

For every value-metric candidate state how a buyer verifies usage and the boundary cases that create bill disputes. A flat price may be predictable but cap expansion; a per-active-user unit needs an actual active definition and may discourage invitation. Explain why the recommended metric wins against the strongest alternative under this product's objective. If proposing a free offer, say what genuine first value stays free, what usage/capability boundary triggers an upgrade, and how that boundary corresponds to added customer value. Free is an acquisition investment with cost exposure, not a default requirement.

Write tier differences as actual included capability and numerical limit proposals with evidence status; name retention/access behavior after a limit, downgrade or cancellation when relevant. Separate an upgrade prompt from a new charge. Competitive positioning says what the normalized model communicates (premium/at-market/value-oriented) and why, without using an unverified benchmark as permission to set a price.

The recommendation explicitly names **primary model, value metric, entry price/range or missing-data decision, billing unit/currency/period, free limit if any, and the single most consequential pricing call**. What-to-watch rows tie a signal to competing explanations and the next diagnostic check: low conversion may reflect poor activation or buyer access, not only a too-generous free tier; churn may follow missing value, not only price. Thresholds are proposed until supported. Provide a WTP interview probe and GTM upgrade-trigger handoff; do not claim the research was scheduled.

## Output template

```markdown
# Pricing Strategy: [Product / offer]
Date: [date] | Objective: [goal] | Status: [provisional / recommended]

## Value Metric

**Record 1**

| Field | Value |
|---|---|
| Candidate | [unit] |
| Value alignment | [reason] |
| Buyer predictability | [assessment] |
| Growth / incentives | [behavior encouraged] |
| Cost risk / evidence | [verified/gap] |

Recommendation: [primary unit + rationale].

## Tiers & Limits

**Record 1**

| Field | Value |
|---|---|
| Tier / audience | [offer] |
| Price basis / currency / billing period | [proposal or existing] |
| Includes / limits | [verified capability] |
| Upgrade trigger | [value threshold] |
| Overage / minimum / commitment | [policy/open issue] |

Free-offer purpose if applicable: [strategic role].

## Competitive Benchmarks

**Record 1**

| Field | Value |
|---|---|
| Competitor / source date | [official source] |
| Comparable offer | [scope] |
| Normalized price basis | [rate or undisclosed] |
| Minimums / caveats | [limitations] |
| Implication | [position] |


## Willingness to Pay

**Record 1**

| Field | Value |
|---|---|
| Persona / purchase authority | [role] |
| Signal | [stated or behavioral] |
| Source / verbatim / sample | [source] |
| Confidence / limits | [strength] |


## Bills & Economics
[Low/typical/high examples; revenue vs variable cost; assumptions, margin and missing inputs.]

## Experiments & Migration

**Record 1**

| Field | Value |
|---|---|
| Assumption | [pricing bet] |
| Test / cohort | [proposed test] |
| Decision signal | [threshold or open] |
| Guardrail | [risk] |
| Owner / window | [owner] |

Existing-customer transition: [policy/options if relevant].

## Recommendation & What to Watch
[Model, unit, entry price/range, free limit if any, highest-impact decision.]
[Conversion/churn/expansion/sales-friction signals, interpretation limits, revisit trigger.]
```

## Worked example

**Fictional example with invented numbers: an appointment tool considers per-booking pricing.** A fictional $30-per-location monthly offer is compared with $0.50 per confirmed appointment: at 20, 60, and 200 appointments the latter produces $10, $30, and $100 bills. The analysis observes that usage pricing could penalize the very adoption the tool encourages and create unpredictable seasonal bills. It recommends testing a flat location price with explicit limits. Those prices are arithmetic fixtures, not market benchmarks or WTP evidence. A supplied willingness-to-pay interview would remain stated intent until an authorized purchase test provides stronger evidence. Cost/margin analysis stays open if message-delivery costs are unknown.

## Quality checks

The objective, buyer, value metric, capabilities, and upgrade trigger align. Benchmarks are dated and normalized; WTP evidence is distinct from assumptions. Worked bill arithmetic matches the model. Unknown costs/price targets remain explicit. Pricing changes address existing users and guardrails. The recommendation takes a position proportional to evidence.

## Anti-patterns

Do not say “charge more” without a model, copy stale benchmark prices, sell unavailable compliance features, interpret competitor price as WTP, confuse revenue with margin, promise an unapproved contract, invent survey quotes, or recommend surprise overages that contradict the intended adoption behavior.
