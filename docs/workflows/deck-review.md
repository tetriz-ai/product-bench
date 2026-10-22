## Procedure

Review existing material in pitch, sales, or one-pager mode. Confirm audience, material, intended next action, and an optional target account/person (`--for company:person` or equivalent natural language). A deck that has not been supplied cannot be scored; ask for the file/content or produce a clearly labeled review checklist.

Resolve the brain directory from `.product-bench-install.json`, read declared product, buyer, competitor, GTM, and brand-voice context, and save to the configured output directory. Accept a configured design connector, local PDF/deck, images, or pasted content. Use only available tools. When reviewing pasted text, mark visual layout unassessed; do not claim to have inspected slides or screenshots. If a remote design source is inaccessible, request an export or use the supplied text without guessing visual properties.

### 1. Establish intent and inspect every page

Identify the audience's decision, story arc, factual claims, proof, competitive references, and CTA. Number every slide/section so findings can point to an exact passage. Check the actual rendered material when available: hierarchy, readable text, line breaks, crowded tables, cropped images, misleading charts, and broken fonts. Review evidence separately from persuasion; attractive slides do not make an unsupported claim credible.

### 2. Use a justified mode-weighted scorecard

Score each assessed dimension 0–10, citing at least one supporting observation and the defect that keeps it from the next band. Use 0 for an absent required element, not for something that could not be inspected. Mark unavailable evidence/layout “unassessed” and disclose the reduced coverage.


**Record 1**

| Field | Value |
|---|---|
| Dimension | Problem articulation |
| Pitch weight | 3 |
| Sales weight | 2 |
| One-pager weight | 2 |


**Record 2**

| Field | Value |
|---|---|
| Dimension | Solution clarity and differentiation |
| Pitch weight | 2 |
| Sales weight | 3 |
| One-pager weight | 3 |


**Record 3**

| Field | Value |
|---|---|
| Dimension | Market-size credibility |
| Pitch weight | 3 |
| Sales weight | 1 |
| One-pager weight | 0 |


**Record 4**

| Field | Value |
|---|---|
| Dimension | Traction and evidence quality |
| Pitch weight | 3 |
| Sales weight | 2 |
| One-pager weight | 2 |


**Record 5**

| Field | Value |
|---|---|
| Dimension | Narrative flow and structure |
| Pitch weight | 2 |
| Sales weight | 2 |
| One-pager weight | 3 |


**Record 6**

| Field | Value |
|---|---|
| Dimension | Visual design and readability |
| Pitch weight | 1 |
| Sales weight | 2 |
| One-pager weight | 3 |


**Record 7**

| Field | Value |
|---|---|
| Dimension | Competitive positioning |
| Pitch weight | 2 |
| Sales weight | 3 |
| One-pager weight | 1 |


**Record 8**

| Field | Value |
|---|---|
| Dimension | Ask clarity |
| Pitch weight | 3 |
| Sales weight | 2 |
| One-pager weight | 2 |


Weighted mean = sum(score × mode weight) / sum(assessed mode weights). Exclude zero-weight and unassessed dimensions, but display them and coverage; do not hide a missing required dimension by marking it unassessed. A score cannot override a blocking factual or confidentiality error.

Bands: 9–10 exceptional evidence and execution; 7–8 strong with minor changes; 5–6 usable only after material fixes; 3–4 fundamental gaps; 1–2 major rework; 0 absent required content. These are editorial judgments, not validated conversion or fundraising benchmarks. Do not invent DocSend/YC/Sequoia statistics to support them.

### 3. Apply the mode-specific tests

**Pitch:** Check purpose in one sentence; specific problem; solution/how it works; why now; market sizing with methodology; honest competition; demonstrable product; business model with verified economics; team/problem fit; financial plan and ask tied to milestones/runway. These are a useful investor-deck structure, not a claim that every investor requires exactly 10 slides. Test whether the core story is understandable in about 3 minutes, whether traction reflects real usage/revenue rather than vanity, and whether team experience explains fit.

**Sales:** Can the prospect explain the value to their boss? Does the material address the account's actual top objections? Can the key workflow be shown in about 5 minutes? Does it handle the known substitute honestly? Is social proof relevant to the buyer's use case, size, and segment? Is there a specific low-friction next action? Distinguish actual demo proof from a proposed illustration.

**One-pager:** Can the core message be absorbed in 90 seconds? Does the eye follow problem → solution → proof → ask? Is the framing right for this audience? Is there one primary action? Could a champion forward it without adding the missing explanation? Apply the configured house style and check readability at normal print/display size. Do not cram a multipage leave-behind into tiny text to call it a one-pager.

For vision-led pitch/sales material, add an altitude test: each beat states the worldview or outcome before the mechanism; each capability is tied to the change it enables; the reader cannot reconstruct the story as a feature catalog. Check hook → pitch → closure and flag abrupt jumps from strategic outcome to configuration detail. Treat a do-it-yourself alternative respectfully: discuss maintenance effort and changing conditions where evidenced, not buyer incompetence. Check chart language matches its geometry, terminology does not collide with the audience's vocabulary, and a borrowed category label is not falsely claimed as our invention.

### 4. Personalize from evidence, not stereotypes

If a target account/person is supplied, read matching declared stakeholder context first. Fill authorized gaps with current public sources when available. Extract buying signals, objections, stage, criteria, and responsibilities. Mark inferred concerns as assumptions. Produce:

- Slides/sections to emphasize, tied to an actual priority.
- Sections to de-emphasize or move to appendix, with a reason.
- Relevant referenceable case study, or `[NEEDS DATA]` when none fits.
- Exact objection and where/how to address it.
- Current wording → buyer-specific replacement, preserving factual meaning.

A job title alone does not justify a claim about pain, budget, or readiness. Do not invent a case study to make personalization look complete.

### 5. Review style and rendering standards

Use configured brand typography, sizes, colors, naming, approved founder/origin copy, disclaimers, footer/contact rules, and asset policy. Missing house style is a setup gap. Use only approved fonts and phrases for final delivery. Use a neutral readable theme if generating an example and label it provisional. Check sender contact for customer-facing material; no placeholders in final delivery. Approved images should be embedded or correctly linked; text-only “VISUAL HERE” placeholders mean the artifact is incomplete. Check platform availability and roadmap claims against verified product context. Inspect DOCX footer borders and PDF clipping only when the actual rendered format is available.

Rewritten copy uses configured voice; default to short paragraphs, positive direct claims, zero em-dashes, specific evidence, and no “innovative,” “transformative,” “seamless,” or “game-changer.” Keep necessary caveats. Do not rewrite a supplied direct quotation as though it were still verbatim.

### 6. Prioritize and hand off

For each section state what works, what fails, its effect on the audience's decision, and a concrete fix. Rank the top 3 changes by impact, not cosmetic preference. Deliver a readiness verdict tied to unresolved factual, narrative, and visual issues: ready for the stated audience, needs named changes, or not ready. “Ready” never means automatically authorized to send. Save the review and inspection limitations. Propose reviewed context updates for new account intelligence rather than writing them silently.

## Output template

```markdown
# Deck review: [Material]
Mode: [pitch/sales/one-pager] | Audience: [role/account]
Material inspected: [file/version/pages or text-only]
Coverage limitations: [unavailable visual/evidence checks]

## Scorecard
| Field | Value |
|---|---|
| Dimension | |
| Score | |
| Weight | |
| Evidence and reason | |
Weighted mean: [formula result] | Coverage: [assessed dimensions]
Blocking issues: [unsupported claim, permission problem, or none found]

## Slide-by-slide / section review
### [Number]: [Title]
Works: [specific observation]
Gap: [specific passage/missing element and consequence]
Fix: [exact copy, structural move, source needed, or layout correction]

## Top 3 improvements
1. [Exact change + why it affects the decision]
2. [...]
3. [...]

## Personalization [only when requested]
Target and evidence: [role, actual priority, confidence/source]
Emphasize / de-emphasize: [sections and reasons]
Proof fit: [approved case or missing data]
Objection: “[Exact words]” → [specific revision]
Current: “[Copy]”
Suggested: “[Buyer-specific copy]”

## Competitive check
[Named verified competitor/substitute; accurate claim, limitation, source date.]

## Verdict and next action
[Readiness, unresolved severe issues, owner/action; no implied sending.]
```

## Worked example

Fictional illustration only. A text-only sales deck for the fictional product Beacon says, “Reduce onboarding time by 50%,” without a study, and ends “Learn more.”

**Evidence quality: 2/10.** The claimed reduction lacks a population, comparison window, and source. A verified workflow description could support a higher score, but it cannot validate the percentage.

**Ask clarity: 3/10.** “Learn more” names no next action. Suggested replacement: “Book a 30-minute review of one representative onboarding task.” `[FICTIONAL PROPOSAL]`

**Visual design:** Unassessed; only text was supplied.

**Top improvement:** Remove the unsupported percentage or supply approved evidence with method. Replace it with the precise shipped behavior if verified. Do not lower the percentage to make it sound plausible.

Weak fix: “Make it more compelling.” Better fix: “Move the verified workflow example before the integration list so the buyer sees the outcome before setup detail.” This requires an actual verified example.

## Quality checks

- All supplied pages/sections are covered and findings identify exact passages.
- Scores have reasons and correct mode weights; unassessed dimensions and coverage are visible.
- Unsupported figures, irrelevant social proof, roadmap claims, and outdated competitor statements are surfaced.
- Personalization uses real account evidence with explicit uncertainty.
- Suggested edits preserve truth and include exact copy or an executable action.
- Verdict reflects severe unresolved issues and actual visual inspection, not just the weighted average.

## Anti-patterns

Unexplained 7/10 scores; score inflation; invented benchmark authority; generic “make it compelling” feedback; persona stereotypes; feature-list rewrites for a vision-led pitch; PDF-layout claims from pasted text; hardcoded founder copy or fonts; replacing facts with stronger unsourced claims; automatically sending reviewed material.
