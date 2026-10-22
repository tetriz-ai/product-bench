## Procedure

Build a field reference for the person in the competitive conversation. Establish the competitor, buyer role, use case, deal stage, evaluation criteria, and incumbent/challenger status. If only a competitor is supplied, produce a general card and mark the buyer-specific strategy provisional. Ask one grouped question for missing deal details that change the recommendation; do not require a completed CRM record.

Resolve the brain directory from the repo-root `.product-bench-install.json`, then read the declared context and approved brand voice. Use the configured output directory. Gather competitor intelligence, shipped product capabilities, referenceable customer proof, pricing/packaging boundaries, and account objections. Keep internal strategy separate from prospect-facing scripts.

1. **Build an evidence ledger.** For every comparison record capability, buyer consequence, source, observation date, and confidence. HIGH means directly verified within 90 days; MEDIUM means direct evidence 91–180 days old or corroborated but incomplete evidence; LOW means older or unverified. A recent summary of an old claim does not renew its date. Label unknown cells `[NEEDS DATA]`, not a red cross. Verify current public competitor claims when browsing is available; otherwise disclose the verification gap.
2. **Choose the deal thesis.** Identify the single buyer outcome for which the product is a good fit. Explain the necessary conditions and the buyer who benefits. A capability lead without a relevant buyer consequence is not a reason to win. Identify where the competitor is the better choice, including price, ecosystem, maturity, migration cost, or required functionality.
3. **Draft speakable scripts.** Write a respectful 30-second response to the competitor mention, followed by 3 real or explicitly anticipated objections. Each response starts by acknowledging the valid concern, names a concrete difference, and offers a verifiable next step. Add the fear behind the objection and the approved proof supporting the answer. Scripts are exact words, not advice such as “stress our differentiation.” Read them aloud and cut any phrase an AE would stumble over.
4. **Design fair diagnostic questions.** Ask questions that expose decision criteria and gaps in alternatives: “Who can validate this result?” or “How would your team recover if the import fails?” Avoid planted accusations and questions that assert an unverified competitor weakness. The answer should be useful even if it favors the competitor.
5. **Map the buying path.** Identify the likely champion, economic buyer, technical evaluator, and the person defending the incumbent. Separate known relationships from role-based assumptions. For displacement, name a plausible switch trigger, best-fit account, migration burden, and only an actually available migration offer. Include a coexistence or no-switch route when appropriate.
6. **Stress-test before handoff.** Check the competitor's strongest response, each unsupported superlative, any outdated comparison, and each proof permission. Apply the quality checklist below; an available separate reviewer can challenge the scripts, but a self-check must never be described as independent review. Save the card with its evidence ledger and unresolved claims. Propose any new durable intelligence for reviewed context incorporation rather than silently updating context. Suggest collecting the exact objections and outcomes after the next deal.

### Voice and writing discipline

Use the approved voice and naming from brand-voice context. Until configured, use plain, respectful, specific language: active verbs, short spoken sentences, sentence case, zero em-dashes, and no “seamless,” “transformative,” “game-changing,” or “leverage.” State positive claims directly. Avoid “They show the past; we predict the future,” “It's not about X, it's about Y,” and “We're like them but better.” Factual limitations still belong in the card; this rule prohibits rhetorical framing, not honest comparisons.

Keep the main card scannable in a live call, normally 1–2 pages. Put source detail in an appendix. Do not add sections merely to fill a template; preserve the honest losses and next-step tests even when shortening.

## Output template

```markdown
# Battlecard: [Product] vs [Competitor]
Updated: [date] | Use when: [buyer + deal situation]
Confidence: [overall level with material exceptions]

## One-line win
“[Outcome + differentiated mechanism + fit condition.]”

## 30-second pitch
“[Respectful acknowledgment. Specific buyer outcome. Proof or validation invitation.]”

## Where we win
| Field | Value |
|---|---|
| Criterion | |
| Our verified behavior | |
| Competitor behavior | |
| Buyer consequence | |
| Confidence/source | |

## Where they win
| Field | Value |
|---|---|
| Criterion | |
| Their advantage | |
| Our limitation | |
| Honest response / route forward | |

## Top objections
### “[Prospect's exact words, or anticipated objection label]”
Why they ask: [risk or assumption]
Response: “[Exact script]”
Proof: [approved evidence, date, and reference permission; or NEEDS DATA]
[Repeat for the 3 most consequential objections, when supported.]

## Questions to ask
- “[Fair diagnostic question]” [what the answer establishes]

## Deal strategy
Champion / evaluator / economic buyer: [known vs assumed]
Incumbent champion: [incentive; respectful approach]
Switch trigger: [event and evidence]
Migration or coexistence: [available offer, burden, limits]
Next test: [owner + evidence + decision it resolves]

## What not to say
- “[Tempting but unsupported claim]” → “[Accurate alternative]”

## Sources and open claims
[Claim IDs, paths/URLs, observation dates, freshness, missing proof.]
```

## Worked example

Fictional illustration only; these are not product claims or customer evidence. Assume a fictional product, Beacon, has a verified export preview, while the incumbent's corresponding behavior has not been checked.

**One-line win:** “Beacon lets your operations lead review the import before changing the account.” `[FICTIONAL ASSUMPTION]`

**Objection:** “We just renewed our incumbent. Why would we switch?”
**Why they ask:** Sunk cost and disruption; confirm this rather than assuming buyer dissatisfaction.
**Response:** “A switch needs a clear benefit. Let's test your highest-risk import against your current workflow, then compare the effort and failure recovery.”
**Proof:** `[NEEDS DATA: representative import result and migration estimate]`

**Where they win:** Existing team familiarity and contracted access, if confirmed by the buyer. **Handle:** “Your team already knows the current workflow. We should include training time in the comparison.”

Weak: “Their imports are unreliable and ours are seamless.” Better: “We can show the preview and recovery path with your sample. We still need to verify the incumbent's behavior.” Do not convert the unknown competitor cell into a claimed weakness.

## Optional writing refinement

If the user asks “refine with editorial-draft” or requests a writing review, read `<brain_dir>/runtime/payload/brain/EDITORIAL-DRAFT.md` and resolve the actual installed Editorial Draft skill automatically. No separate configuration or repeated voice setup is needed. If absent, report the missing dependency and leave the requested refinement pending. When installed, reuse the approved draft and evidence in refinement mode: skip repeated style interviews, research, and outline phases; run the selected reviewers and polish. Suggested preset: **Executive Communicator, conversational/professional (`voice.formality: 5` when supported)**. Selected review jobs: Devil’s Advocate for competitive counterarguments; Clarity for an AE without PM context; Voice for spoken delivery; canonical AI-pattern detection and Detector for mechanical scripts. Read and execute the selected actual reviewer files and canonical polish instructions; do not simulate reviewer execution. Preserve the original claims, caveats, sources, and command structure through the edit.

If unavailable, disclose that fact and apply those exact checks directly; distinguish manual review from independent reviewer execution. Do not strip story pacing to meet a generic brevity score, or shorten spoken responses until their meaning breaks. Record material changes and any pending independent-review requirement.

## Quality checks

- Every superiority claim has current evidence and a buyer consequence; unknowns remain unknown.
- The competitor's meaningful strengths and our disqualifying gaps are visible.
- Pitch and objection responses are usable word for word and contain no promises beyond shipped behavior or approved commitments.
- Account roles and switching triggers distinguish source-backed facts from assumptions.
- Customer names, quotes, logos, and metrics are approved for the intended audience; methodology and limitations accompany quantitative proof.
- The AE can find the lead claim, honest loss, response, and next test in seconds.

## Anti-patterns

Feature matrices with unexplained checkmarks; pretending we win every row; treating roadmap as shipped; claiming “only” without a checked comparison; insults toward the incumbent champion; invented migration offers; generic objection concepts without spoken scripts; competitor research pasted wholesale; updating context or sending the card without the applicable review/authorization.
