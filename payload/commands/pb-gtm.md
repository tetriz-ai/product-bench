<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, competitors.md, gtm.md, metrics.md, brand-voice.md, stakeholders.md]
capabilities: []
-->

# /pb-gtm

Design a launch and acquisition motion.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Product change, audience, business goal | ICP, positioning, channels, proof, launch sequence, and measurement |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Pick a beachhead audience.
2. Tie messages to verified capabilities.
3. Name conversion and learning signals.

## Launch plan

Confirm what has shipped or is committed and which claims have proof. Choose a primary buyer and use case. Write positioning around problem, substitute, differentiated mechanism, proof, and limitation. Map the buying process and channels the team can operate.

Sequence preparation, limited validation, launch, and follow-up. Assign owners and evidence. Define acquisition, activation, and learning measures with units and windows. Prepare objections, sales enablement, support readiness, and feedback intake appropriate to launch size. Mark unverified proof as needing data; never fabricate testimonials or traction.

## Procedure

Build a strategic launch and acquisition brief, not a generic marketing calendar. Load the configured product capabilities, personas, stakeholders/buying chain, competitor intelligence, GTM constraints, writing voice, and measurement context. The project's actual distribution and onboarding principles govern; do not impose another company's free-entry, zero-touch, or champion-to-executive funnel.

1. Choose one initial beachhead with company/context, primary role, buying trigger, current behavior, and a reason it is reachable and likely to stay. Define negative ICP and distinguish end user, champion, economic buyer, approver, and procurement roles where relevant.
2. Write a primary message of at most fifteen words and persona-specific pain→message→first-value moments. Ground every benefit in a verified capability and proof. Apply the project's voice; avoid vague superlatives, invented numeric outcomes, and unsupported competitor attacks. List tempting angles to avoid and the reason each misleads or attracts the wrong audience.
3. Choose and justify the acquisition motion from evidence. Specify entry, activation, expansion/referral when applicable, and conversion triggers. Name actual communities, search intents, partnerships, product surfaces, or distribution channels and a concrete tactic/owner; “social media” alone is not a channel. Keep channel recommendations provisional when audience evidence is missing.
4. Design a launch by exposure criteria and learning gates, not arbitrary weeks. Identify the first cohort, next cohort, general availability conditions, applicable feature flag/kill switch, rollback plan, and dependencies. Do not invent a flag or assert a tested rollback. Include messaging/product page, onboarding/empty states, support documentation, approved communication drafts, analytics, and operational readiness in the launch checklist.
5. Define activation, expansion where relevant, conversion, retention/quality guardrails, and the early leading indicator. Each metric needs definition/denominator, cohort/window, baseline/target or explicit gap, event/measurement source, verified/proposed status, and owner. Recommend launch measurement readiness as a gate; final launch policy belongs to the user, not a fabricated universal command rule.
6. Save under the configured output directory. Recommend `pb-battlecard` for relevant competitive deals, `pb-hypothesis` for a testable acquisition or retention mechanism, and `pb-analytics` for measurement gaps. Provide reviewable owner assignments and drafts; do not send messages, launch campaigns, change flags, or publish without authorization.

### Make messages and launch gates executable

The ICP includes relevant firmographic/workflow facts, prerequisites for value, stack or operating signals when relevant, purchase constraints, and the buyer's actual trigger. Distinguish the reason a segment is easy to acquire from the reason it will retain; a large accessible audience can still be a bad beachhead. For each persona write actual ready-to-say message copy alongside the pain and proof, not directions such as “[emphasize ease].” Add a short objection → response → proof-needed row for each consequential commercial objection and a draft next-step ask suitable to that buyer.

**Fictional message example:** “Review tomorrow's uncovered shifts before your team starts work.” Buyer proof: a supported sample showing the at-risk list, observation time and next action. Avoid “Never miss a shift again,” which promises an outcome the product cannot guarantee. Avoid fear-driven copy that contradicts reviewed voice or attracts a segment the team cannot serve. Internal trade-off analysis can be frank while customer-facing copy states specific supported value.

Write rollout cohorts as eligibility/exposure → learning measure → expansion gate → reversal condition. Optional proposed weeks may aid coordination but do not replace the gate or imply a capacity commitment. Handoff contains persona messaging for design/product surfaces, proof and objection cards for sales, support limits/recovery, feedback intake, tracker-ready checklist owners, and analytics definitions. Missing instrumentation is a named launch-readiness decision, never a fabricated GA policy or completed event. Use `pb-battlecard` where competitor objections matter and `pb-hypothesis` to test the proposed acquisition or retention motion.

## Output template

```markdown
# GTM Plan: [Launch / segment expansion]
Date: [date] | Goal: [outcome] | Evidence freshness: [warnings]

## 1. Beachhead Segment
[Company/context, first role, trigger, present behavior, reachability, retention/referral reason.]

## 2. ICP & Buying Architecture
[Company fit, individual user/champion/buyer/approver, purchase constraints.]
Negative ICP: [explicit exclusions + reasons].

## 3. Messaging Architecture
Primary message: [≤15 words]

**Record 1**

| Field | Value |
|---|---|
| Persona | [role] |
| Specific pain | [source] |
| Message | [claim] |
| First-value moment | [observable event] |
| Proof / gap | [verified source] |

Avoided angles: [tempting claim + why inaccurate/unhelpful].

**Record 1**

| Field | Value |
|---|---|
| Objection | [buyer concern] |
| Actual response copy | [supported explanation] |
| Proof needed | [demo/source/gap] |
| Next-step ask | [specific action] |


## 4. Channels & Acquisition Motion
[Entry → activation → expansion if relevant → conversion; source or assumptions.]

**Record 1**

| Field | Value |
|---|---|
| Channel | [concrete channel] |
| Why reaches ICP | [evidence] |
| Specific tactic | [action] |
| Owner | [role/unassigned] |
| Test / stop signal | [learning] |

Not pursuing: [channel/motion constraints and reasons].

## 5. Launch Plan
[Type, first cohort, expansion gates, GA readiness, applicable exposure control/rollback.]

**Record 1**

| Field | Value |
|---|---|
| Readiness item | [product page/onboarding/support/comms/analytics/rollback] |
| Owner | [owner] |
| Status / evidence | [verified or proposed] |
| Gate | [condition] |


## 6. Success Metrics

**Record 1**

| Field | Value |
|---|---|
| Metric / definition | [activation/conversion/guardrail] |
| Cohort / window | [denominator and period] |
| Baseline → target | [value or NEEDS DATA] |
| Instrumentation status | [event/source] |
| Owner | [owner] |

Early leading indicator: [one observable signal and decision it informs].

## Open Decisions & Next Action
[Consequential gaps, owner, evidence needed, reviewable next step.]
```

## Worked example

**Fictional example: an invoice organizer launches a recurring-reminder feature.** Beachhead: freelancers with several repeat clients who already use the organizer. Message: “Send scheduled invoice reminders without tracking each due date.” First value is reviewing and enabling a verified reminder schedule, not merely signing up. The first cohort opts into a test with reminders initially visible as drafts; sending requires explicit customer approval. The acquisition tactic is an existing in-product overdue-invoice prompt, not an assumed public developer community. Success includes reminders enabled, on-time payment movement, and an unwanted-reminder complaint guardrail. Targets stay `[NEEDS DATA]` until baseline and event status are established.

## Quality checks

The launch has a specific audience, truthful persona messages, concrete channels, named triggers, readiness gates, and instrumentation. User, champion, and buyer are not automatically identical. Metrics distinguish discovery from value. Unsupported market/channel claims and pending rollback checks are visible. No campaign or external message is represented as sent.

## Anti-patterns

Do not substitute a content calendar for a GTM strategy, use “everyone” as ICP, claim activation from registration alone, assume every product must be PLG, hardcode weeks/flag names, invent customer results, or imply that drafting a launch plan authorizes publishing it.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
