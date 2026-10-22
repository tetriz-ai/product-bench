## Procedure

Turn an initiative into a spoken 3-minute executive story grounded in a specific user moment. Confirm the audience, initiative or approved spec, decision the story supports, and whether the experience is shipped, proposed, or speculative. The human story leads; the business decision and supporting evidence land after the experience earns them.

Resolve the brain directory from `.product-bench-install.json`; read declared user, product, metric, decision, and voice context; save under the configured output directory. Use actual approved research where available. If the scene is composite or fictional, say so before the story. Never attribute invented quotes, actions, feelings, or results to a real participant.

1. **Select a scene with evidence.** Identify a person/role, time pressure, tool or workflow, goal, and exact failure. Use a dated observation or quote where permission permits. A role-based assumption is not a research finding. Anonymize real people when appropriate and preserve the source pointer separately.
2. **Make the friction visible.** Describe the clicks, search, manual workaround, missing information, delay, or tradeoff. The scene should be specific enough to visualize. Avoid making the person helpless to exaggerate the product's value. Describe the current substitute fairly.
3. **Show the product moment step by step.** Write what the person does, sees, and decides. Name the first useful difference, using verified behavior from product context. Separate shipped capability from a proposed concept. Account for a meaningful limitation or boundary when it affects the scene.
4. **Pay off the original tension.** Return to the same person and decision. Show what changes in the business moment, rather than claiming that they merely “feel empowered.” Proposed outcomes remain expected outcomes, not customer results. Do not attach a numerical benefit without a traceable measurement.
5. **Build the evidence case after the scene.** Cover validated pain, willingness to pay or an explicitly labeled proxy, segment urgency, and credible advantage. Do not manufacture TAM, a moat, or willingness to pay just to complete a row. Add the best counterargument, adoption burden, and the next validation that would change the decision.
6. **Write the portable line and pre-handle objections.** The one-line version names the persona, capability, and outcome in ordinary language. Include exact responses to likely competitive, adoption, and evidence objections. Each response should concede valid concerns and name a next test or verified proof.
7. **Rehearse and review.** Aim for roughly 360–450 spoken words in the story, allowing pauses; adapt to the actual presenter. Read the scene aloud, remove tangents, and check that the first beat's promise pays off. An optional writing reviewer can assess pacing, voice, completeness, and unsupported claims; apply the rubric manually if absent without inventing a review receipt. Save the story, evidence case, and unresolved assumptions together.

### Voice

Use the approved brand voice. Default to active, concrete language and 1–2 sentences per paragraph, 3 at most. Use zero em-dashes. Avoid “many users struggle,” “transformative,” “crucial,” “seamless,” and significance announcements. Let the scene carry the emotion. State the product's contribution directly rather than “This isn't about X. It's about Y.” Keep terminology consistent and scripts speakable.

## Output template

```markdown
# Narrative: [Initiative]
Audience: [role/context] | Decision supported: [ask]
Experience: [shipped/proposed] | Scene: [observed/anonymized/composite/fictional]

## The story
### The moment
[Specific person, day or event, goal, tool, pressure; 3–5 short sentences.]

### The friction
[Exact breakdown and current workaround; evidence pointer where applicable.]

### The product moment
[What they do and see, in sequence; shipped vs proposed stated.]

### The after
[Payoff at the same business moment; observed result or expected outcome labeled.]

## Why this matters
| Signal | Evidence and date | Uncertainty / next test |
|---|---|---|
| User pain | [verbatim/observed behavior] | |
| Willingness to pay | [actual signal or proxy label] | |
| Segment urgency | [trigger and relevant segment] | |
| Advantage | [mechanism, proof, limitation] | |

## One-line version
“[Capability] helps [persona] [concrete outcome].”

## Potential objections
| Exact objection | Speakable response | Proof or validation needed |
|---|---|---|

## Decision and next evidence
[Specific ask, owner, open assumption, next test.]
```

## Worked example

Fictional illustration only. All product behavior below is a proposed concept, not a shipped claim.

**Moment:** “Tuesday's handoff starts in 10 minutes. Mira, an operations lead, opens the import spreadsheet. Two account IDs appear twice.”

**Friction:** “She checks the export against yesterday's list. She can find the duplicate rows; she can't tell which one the importer will keep.”

**Product moment:** “In the proposed preview, Mira sees both duplicate rows with the conflict marked. She chooses the source row and reviews the resulting change before applying it.”

**After:** “In the handoff, she can explain which row was selected and why. Whether this saves time needs a test with real import tasks.”

**One-line version:** “The proposed preview lets operations leads resolve conflicting rows before an import changes an account.”

Weak: “Our revolutionary solution empowers teams with effortless data quality.” Better: “Mira sees the conflicting rows and chooses the record to keep.” The latter is still a concept here, so do not present it as a customer experience.

## Optional writing refinement

If the user asks “refine with editorial-draft” or requests a writing review, read `<brain_dir>/runtime/payload/brain/EDITORIAL-DRAFT.md` and resolve the actual installed Editorial Draft skill automatically. No separate configuration or repeated voice setup is needed. If absent, report the missing dependency and leave the requested refinement pending. When installed, reuse the approved draft and evidence in refinement mode: skip repeated style interviews, research, and outline phases; run the selected reviewers and polish. Suggested preset: **Conversational Authority, confident spoken storytelling**. Selected review jobs: Hitchcock for pacing; Voice for consistency; Completeness for opening-promise payoff; canonical AI-pattern detection and Detector. Read and execute the selected actual reviewer files and canonical polish instructions; do not simulate reviewer execution. Preserve the original claims, caveats, sources, and command structure through the edit.

If unavailable, disclose that fact and apply those exact checks directly; distinguish manual review from independent reviewer execution. Do not strip story pacing to meet a generic brevity score, or shorten spoken responses until their meaning breaks. Record material changes and any pending independent-review requirement.

## Quality checks

- The opening shows a specific person and a specific event; the ending resolves the same tension.
- All real names and verbatims have evidence and appropriate permission; composite scenes are labeled.
- The workflow accurately distinguishes shipped behavior from concepts and roadmap.
- The business case follows the scene and is evidence, not a second sales pitch.
- Missing willingness-to-pay, market, or outcome data remains visible.
- A spoken rehearsal fits roughly 3 minutes and every script is usable aloud.

## Anti-patterns

Opening with market-size abstractions; invented customer quotes; false urgency; an idealized workflow with no limitation; a feature catalog between the before and after; asserting business impact from a plausible story; treating a narrative as validation; theatrical adjectives; repeating the conclusion after the decision and ask.
