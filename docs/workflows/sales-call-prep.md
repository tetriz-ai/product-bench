## Procedure

Produce an operational meeting brief, not a background research essay. Support discovery, demo, evaluation, closing, and champion-prep. Parse the mode, account, attendee names/roles, meeting source, prior conversations, materials already shared, deal detail, known objections, and an optional preferred angle. Default to discovery when unspecified.

Resolve the brain directory from `.product-bench-install.json`, use the configured output directory, and read only declared context. Account research stays in local operational output; durable reviewed summaries, not raw personal profiles, belong in shared context.

### 1. Grouped input gate

Show what was parsed and ask once for missing inputs that materially change the meeting. If enough context is already supplied, proceed without requiring a “go.” Use a concise grouped prompt:

```text
Parsed: account [...], attendees [...], type [...], angle [chosen/auto-rank].
Useful gaps: meeting source, prior touchpoints, material already sent,
known objections, decision stage, profile links or pasted public content.
I can proceed with the available information; these gaps will shape discovery questions.
```

For evaluation or closing with no prior touchpoints, visibly mark that late-stage assumptions require confirmation. Continue with a gaps-first prep rather than pretending to know the buying process. If neither an account nor an attendee can be resolved unambiguously, ask for a company or profile link; do not research a guessed namesake.

### 2. Internal account memory first

Search declared stakeholder/account, user, product, competitor, and GTM context for the company and attendees. Prior account records and dated verbatims anchor the brief; external research fills gaps and discrepancies rather than replacing them. Extract:

- Current deal state, prior commitments, champion, economic buyer, evaluator, and decision process.
- User language and observed pains that match this attendee, including contradictions.
- Product capabilities and limitations relevant to the meeting.
- Competitor already under evaluation, incumbent purchase, and the champion's stake in that decision.
- Approved proof matching the account's use case and segment, not the largest available number.
- Any documented boundary or hypothesis in declared context that the meeting should test.

If the prospect is itself a tracked competitor, flag that relationship at the top. If a named competitor's entry is over 180 days old, recommend refreshing the relevant battlecard, without auto-running another command. Do not repeat a previous pitch angle when the record shows the buyer already rejected it.

### 3. Prior conversations and external research, best effort

Use configured meeting/CRM connectors only when available and within approved scope. Pull dated prior conversations and exact quotes where authorized. If unavailable, use supplied notes and say what could not be retrieved. Never claim that a connected service ran merely because its name appears in configuration.

For each attendee, check current role, public work, recent role changes, and up to about 5 relevant recent posts or talks. For the account, check its official site and roughly the last 6 months of relevant news, business model, size, stage, and publicly evidenced technical signals. Independent lookups can run in parallel; identity resolution and dependent retrieval remain sequential. Prefer current primary sources and record the observation date. Do not turn a role title into a psychological profile.

Public profile fallback: user-supplied text/screenshot → available authorized profile/CRM source → public search and company biography → explicitly labeled role-based hypothesis. A paste establishes what the profile says, not the person's current buying intent. Use an available browser through its applicable workflow only when access is authorized; do not promise ephemeral cookies, launch a specific browser integration, bypass authentication/rate limits, or imply LinkedIn access is bundled. If access fails, continue with the gap. Bound any paid enrichment to the configured allowance; when none is set, use the available non-paid evidence and identify the optional enrichment instead of creating charges.

#### Requested profile fetch and enrichment bounds

Treat `--linkedin-fetch` or “fetch these profiles” as a request to try the actually available authorized profile/browser capability, not evidence that a provider exists. For a larger attendee list, identify whether supplied public profile content or an authorized fetch would fill material gaps; an unavailable connector never blocks preparation. Match each URL to the intended attendee before retrieval, bound a run to five profiles by default, and respect the available provider's rate and session rules. Stop that source on verification challenges or rate limits and mark remaining profiles unverified. Do not promise no persisted cookies or a fresh sign-in unless the selected capability demonstrably supports it. Report the method used per attendee; a live profile verifies its content, not inferred buying intent.

For paid enrichment, estimate people/company lookups before executing, reuse known records, and stay within the user's configured allowance. If the request exceeds that allowance, use the authorized non-paid fallback and identify the unmet enrichment need; explicit authorization may change the allowance. Do not silently multiply lookups for repeated attendees or declare success from a connected-but-tool-less service.

### 4. Rank buyer-specific angles

Use configured buyer archetypes, not fixed engineering/AI/people-operations personas. Rank candidate angles by the attendee's actual responsibility, observed pain, meeting stage, prior response, and verified product fit. Render the top 2 unless a chosen angle or evidence clearly warrants only one. A role-based inferred angle is LOW confidence. Each angle must include a short reason, exact opening probe, and one-sentence bridge to a verified capability. The probe should uncover a consequential decision; it should not fish for agreement with our pitch.

Respect mode-specific meeting flow:

| Mode | Opening and working segment | Walk-away ask |
|---|---|---|
| discovery | Confirm current workflow, pain, consequence, current substitute, and who owns the problem. Test a hypothesis using neutral probes. | Permission for a specific next validation, with owner and date. |
| demo | Confirm the use case, show one relevant shipped workflow, invite the buyer to evaluate the result, then discuss limitations. | Agreed next test with representative input and success criteria. |
| evaluation | Review agreed criteria, actual verification evidence, implementation/security gaps, and decision participants. | Owner/date for each unresolved criterion and the decision checkpoint. |
| closing | Confirm remaining commercial/legal/procurement blockers, approved commitments, decision authority, and rollout readiness. | A concrete decision or blocker-resolution step; no invented concessions. |
| champion-prep | Equip the champion to explain the problem, proof, tradeoff, objection response, and buying path to others. | Internal meeting/decision plan, attendees, approved materials, and feedback loop. |

For demo, execute the supplied shipped behavior with representative inputs where the available capability and scope permit, persisting expected/actual results. If not executed, show a planned demo path and label it unverified. Proposed behavior is a concept. For evaluation, attach actual results where available; desired permission rules and future tests are not observed verification. Missing proof stays an open evaluation criterion.

### 5. Assemble with confidence and brevity

Tag substantive account/person/pain claims HIGH, MEDIUM, or LOW with short source IDs. HIGH: direct dated evidence that supports this exact claim. MEDIUM: indirect or incomplete evidence. LOW: role/company heuristic or unverified hypothesis. Facts about a role can be HIGH while an angle inferred from that role remains LOW. If over half the consequential claims are LOW, move Open gaps to the top and label the doc a sparse-data discovery framework.

Length targets: one attendee about 1 page; 2–3 about 1.5 pages; 4+ about 2–2.5 pages. Keep TL;DR to 4 bullets of at most 15 words each; each full angle to 80 words; opening probe to 40 words; bridge to 25 words; each objection plus response to 40 words; each attendee to 6 bullets of 20 words; company snapshot to 5 bullets of 15 words; land mines to 3; gaps to 4. Do not show empty sections or “no match found” bullets. Evidence can be a short appendix.

### 6. Review and handoff

Read every script aloud. Delete sentences that do not affect what the seller asks, shows, or decides. Confirm the mode's walk-away ask and prevent repetition of already-shared material. Save the prep and source pointers. Recommend using TL;DR and angles before the call, objections and land mines during it, and a reviewed learning deposit after it. Do not post, email, enrich shared context, or schedule a follow-up merely because it is recommended.

### Voice

Apply configured brand voice. Default to conversational, professional, concrete scripts with active verbs, short sentences, zero em-dashes, and no “seamless,” “transformative,” “leverage,” or negative parallelism. Scripts beat long explanations of why they work. Do not replace useful uncertainty with confident buyer modeling.

## Output template

```markdown
# Sales call prep: [Account] | [Date]
Type: [mode] | Lead angle: [angle] | Overall confidence: [level]
[Only real warnings: sparse data, competitive account, late-stage context gap.]

## TL;DR
- Lead with: [≤15 words]
- Main pain: [≤15 words, confidence/source]
- Walk-away ask: [≤15 words]
- Top land mine: [≤15 words]

## Angles
### Lead: [Angle] [confidence]
Why: [≤20 words, source]
Probe: “[Exact opening, ≤40 words]”
Bridge: “[Verified relevant capability, ≤25 words]”
Demo moment: [demo only, actual result or planned/unverified label]
### Fallback: [Angle] [confidence]
Why: [short source-based reason]
Probe: “[Exact words]”

## Meeting flow
[Mode-specific working segment and desired decision, short.]

## Objections
- “[Actual or anticipated objection]” → “[Exact response]” [proof/test]
[0–1 for discovery unless evidence warrants more; up to 3 for later stages.]

## Attendees
### [Name/role] [confidence]
- Shapes their decision: [sourced context]
- Hook: [specific entry point]
- Avoid: [known land mine]
- Warm signal: [only if known]
- Buyer archetype: [only if supported; inference label]
- Sources: [IDs]

## Company
[Only decision-relevant facts, with confidence/source.]

## Land mines
[Max 3, each tied to evidence or an explicit assumption.]

## Sources and open gaps
Sources: [what actually ran, dates, paths/URLs; unavailable sources named]
Gaps: [max 4 discovery questions; move to top for sparse data]
Next step: [owner/date/evidence required]
```

## Worked example

Fictional illustration only. Rhea is a fictional operations director preparing an evaluation call; the only supplied fact is her role, and there are no prior notes.

**Banner:** “Sparse-data evaluation prep. Confirm previous success criteria before presenting a conclusion.”
**Lead angle:** Controlled rollout, LOW `[ASSUMPTION from role]`.
**Probe:** “What did your team need to verify in the trial, and which of those checks are still open?”
**Bridge:** “We can review each agreed check against its recorded result.” This is an offered meeting process, not a product claim.
**Walk-away ask:** “Name the owner and deadline for each open evaluation criterion.”
**Land mine:** “Do not assume the trial passed; no result has been supplied.”

Weak: “Rhea values seamless integrations, so lead with our robust platform.” Better: “Ask which integration checks remain unresolved.” The role establishes neither her priority nor our capability.

## Optional writing refinement

When requested, resolve the installed Editorial Draft skill through `<brain_dir>/runtime/payload/brain/EDITORIAL-DRAFT.md`. Use Executive Communicator with `voice.formality: 5`, refining the approved verbatim scripts only. Execute Devil’s Advocate, Clarity, Voice, and canonical AI-pattern scrub, preserving account facts, caveats, competitive unknowns, and document structure. Skip repeated setup, discovery, and outline. Report missing resources as pending rather than simulating reviews.

If unavailable, disclose that fact and apply those exact checks directly; distinguish manual review from independent reviewer execution. Do not strip story pacing to meet a generic brevity score, or shorten spoken responses until their meaning breaks. Record material changes and any pending independent-review requirement.

## Quality checks

- The doc changes the seller's questions, demonstration, or next action rather than accumulating biography.
- Prior touchpoints and known commitments dominate late-stage preparation.
- Every consequential factual or inferred claim has confidence and a source/gap label.
- Demo/evaluation receipts are actual observations; planned tests are clearly pending.
- Two angles are justified by evidence; stage-specific asks are concrete.
- Length caps hold, scripts are speakable, and absent sources do not block useful discovery preparation.

## Anti-patterns

Invented buyer intent from job title; rehearsing discovery in a closing call; unverified live-demo claims; dumping full profiles; repeating a rejected pitch; presenting a search snippet as verified procurement status; chaining other commands automatically; fictional proof points; empty sections; manufactured connector/browser capabilities; exposing raw personal data in shared context.
