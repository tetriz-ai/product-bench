<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, stakeholders.md, gtm.md, brand-voice.md, users.md, competitors.md, technical-constraints.md]
capabilities: [document renderer optional]
-->

# /pb-sales-doc

Build a customer-facing commercial document.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| one-pager | Buyer, problem, verified proof | One-page summary and ask |
| leave-behind | Meeting outcome and next step | Concise follow-up document |
| defensive | Specific objection and evidence | Evidence-led response document |
| pitch | Buyer and strategic angle | Vision-led document with claims checked |
| onboarding-guide-design-partner | Design-partner goal, verified product navigation, roles, and setup prerequisites | Collaborative onboarding guide with checkpoints, feedback loop, and recovery steps |
| onboarding-guide-plain | Customer goal, verified product navigation, roles, and setup prerequisites | Self-serve onboarding guide with task sequence, verified setup, checkpoints, and recovery steps |

If no mode is named, use `one-pager`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Use the team’s approved voice, permitted assets, and configured document theme.
2. Never insert unverified product claims or figures.
3. Preview PDF or document layout before delivery.

## Document preview

Deliver correctly rendered Markdown/HTML or an available configured document format. For basic headings, paragraphs, lists, tables, links and code, the installed dependency-free renderer is available: node <brain_dir>/runtime/render-document.mjs --input <source.md> --output <document.html>. A heading ends at its line break; do not accidentally render the following paragraph as part of the heading. For one-pager, create a printable single-page layout with readable text and a concrete ask. Inspect the actual rendered layout with an available preview tool and save the preview receipt. Parsing HTML structure alone is not a visual preview. If the host lacks preview tools, hand the file to the configured review/preview stage and keep layout verification pending until that stage runs. Do not claim a PDF, page count or screenshot inspection without evidence.

## Procedure

Build new customer-facing material: one-pager, leave-behind, defensive response, or vision-led pitch. The optional onboarding-guide-design-partner and onboarding-guide-plain tracks below preserve operational setup-document behavior when those modes are requested. Confirm account/person, intended reader, deal stage, pain, decision/CTA, materials already sent, approved proof, and delivery format. Accept legacy `build --type ...` input as mode selection where supported; do not run a different command merely to parse a flag.

Resolve the brain directory from `.product-bench-install.json`, read declared product, account, GTM, brand-voice, and operational constraints when relevant, and use the configured output directory. The configured brand/theme and reviewed context are authoritative. Use only approved claims, typography, contacts, and templates. The installed `visual-doc-creation` and `slide-deck` engines provide portable rendering mechanics using the reviewed brand inputs.

### 1. Input gate and authority

Group missing inputs in one prompt. Identify the sender/contact from supplied input or approved context. A prose draft can proceed with a visibly pending contact, but a customer-ready rendered artifact cannot contain a placeholder or guessed email. Confirm required contact before final rendering if the theme requires it. Ask only when missing input affects a consequential choice; already supplied inputs do not need another approval round.

Read available approved master templates and prior-build/account records only when they are in the declared/approved scope. If no approved account/master template exists, use the neutral structures below with the installed rendering skill; template absence does not make the bundled engine unavailable. Inventory claims before drafting: shipped vs roadmap, evidence/method, reference permission, limitation, pricing validity, and account-specific assumptions.

If the recipient bought/championed an incumbent or personalization would challenge their prior decision, recommend the defensive/generic track and explain why. Do not silently override an explicitly selected mode. Generic presentation lets the reader assess fit without diagnosing their organization on weak evidence.

### 2. Apply visible personalization toggles

Show which account-specific elements are applied and the evidence authorizing each. Do not fetch or reuse logos outside approved source scope or invent a maturity score.


**Record 1**

| Field | Value |
|---|---|
| Element | Title / cover |
| Generic | Product and intended use |
| Personalized | Account + product, if appropriate |
| Defensive | Generic product/problem title |


**Record 2**

| Field | Value |
|---|---|
| Element | Logo |
| Generic | Approved product logo |
| Personalized | Approved account logo if permitted |
| Defensive | Product only |


**Record 3**

| Field | Value |
|---|---|
| Element | Opener |
| Generic | Segment problem |
| Personalized | Known account problem, cited |
| Defensive | Neutral workflow problem |


**Record 4**

| Field | Value |
|---|---|
| Element | Buyer language |
| Generic | “the team” |
| Personalized | “your team” where supported |
| Defensive | “the team” / neutral noun phrases |


**Record 5**

| Field | Value |
|---|---|
| Element | Tool order |
| Generic | Alphabetical / neutral |
| Personalized | Verified relevant tool first |
| Defensive | Alphabetical / neutral |


**Record 6**

| Field | Value |
|---|---|
| Element | Position on a framework |
| Generic | No diagnostic marker |
| Personalized | Only evidence-based and appropriate |
| Defensive | No marker or scored account diagnosis |


**Record 7**

| Field | Value |
|---|---|
| Element | Proof |
| Generic | Relevant approved proof |
| Personalized | Account-fit proof |
| Defensive | Evidence without attacking incumbent |


**Record 8**

| Field | Value |
|---|---|
| Element | Contact / distribution |
| Generic | Configured rules |
| Personalized | Configured account rules |
| Defensive | Configured rules |


No founder verbatim, customer statistics, or “most organizations” bands are inserted unless approved and evidenced. Conceptual frameworks explain dimensions and movement; they do not pretend to measure the prospect. Record applied toggles for review.

### 3. Draft by mode

**One-pager:** One reader, one main problem, one clear outcome, a concise explanation of the mechanism, relevant verified proof, material limitation, and one primary ask. Aim for a genuine readable page. Put deeper implementation or feature detail behind a link, not in tiny type.

**Leave-behind:** A forwardable record of the buyer's decision after a conversation. Include context, outcome, relevant workflow, proof, objections, implementation/security dependencies, and next step with owner/date. Do not replay the whole pitch or assume a fixed 10–15-page length. Use enough pages for the decision; label missing meeting outcomes rather than fabricating them.

**Defensive:** Lead with the legitimate concern or incumbent decision, then a neutral use-case explanation and evidence-led comparison/test. Sweep second-person diagnostics, maturity markers, dismissive competitor claims, and invented founder personalization. Use neutral tool ordering and omit implied account weaknesses. A specific objection can be quoted when supplied; generic collateral should remain generic. Offer coexistence or validation where supported; do not promise a switch.

**Pitch, vision-led:** Start from the strategic thesis, target persona, approved numbers, and the decision, rather than cloning the feature template. When delegation is available and permitted, use a fresh first-draft session with only those inputs, deliberately withholding the existing feature catalog. Preserve its draft and receipt before editing. If separate drafting is unavailable, create a thesis-only outline first and disclose that the isolated-draft step was not performed; do not call a second pass independent.

Use hook → pitch → closure: the change in the reader's world; what outcome becomes possible and the evidence; why the proposed mechanism can sustain it and the offer. State the outcome before mechanism, connect every capability to a shift, and keep each beat at a consistent altitude. If a reader can reconstruct the document as a feature checklist, rework it. Do-it-yourself comparison should discuss evidenced maintenance/decay costs without insulting the buyer's team. A “continuous loop” is an advantage only if the product actually supports it. Real figures need sample/window/comparison/method in the sentence or adjacent accessible evidence; anonymize actual trial data only with permission. Never relabel internal testing as customer trials. Borrowed terms are lenses, not claimed inventions. Match chart language to geometry and audit terminology for audience collisions.

**Onboarding guides, when requested:** Plain mode is setup-only; design-partner mode adds only verified program offer, eligibility, terms, support, and consent before the same setup instructions. Verify program size and trial duration from reviewed context. Before every build verify navigation, roles/permissions, connector scope, seat/license rules, supported platforms, prerequisites, and product availability against declared constraints and approved live product documentation/source. A prior PDF is not the source of truth for those details. Use one master with clearly marked program-only/common blocks where useful. Each step states actor, exact action/location, expected result, checkpoint, common failure, and recovery/contact. Skip logo/maturity personalization. If the product cannot be verified, deliver a draft with pending accuracy checks, not an operationally ready guide.

### Mode-specific artifact spines

The mode changes the reader's journey, not just its title. Use these neutral spines when no approved master is available; adapt to the product's real framework and use only verified product pillars.

| Mode | Body order | Required evidence / boundary |
|---|---|---|
| One-pager | Outcome-led headline → buyer problem → relevant workflow/mechanism → proof → implementation boundary → one ask/contact | A reader can forward it without a verbal introduction; deeper detail stays linked. |
| Leave-behind | Meeting decision → relevant current/proposed workflow → evidence and unresolved objections → role-specific implications → implementation/dependencies → owners and next decision | Actual meeting outcomes or explicit gaps; deeper screenshots only where they explain a decision. |
| Defensive | Neutral workflow/problem → evidenced capability → fair fit/coexistence comparison → fair validation invitation | No scored buyer diagnosis, possessive rhetoric, unsupported incumbent weakness, or manufactured switch incentive. |
| Vision-led pitch | Worldview shift/hook → outcome and evidenced payoff → durable advantage and limits → offer | No catalog cloning; each mechanism earns its place through the shift it enables. |
| Plain onboarding | Audience/prerequisites → permissions/setup → connector/workflow steps → checkpoints → recovery/support | Current verified navigation, roles, availability, and dependencies; no program pitch. |
| Design-partner onboarding | Approved offer/eligibility/consent/support → same verified operational setup → agreed feedback checkpoints | Program terms are separately verified; setup instructions remain consistent across both variants. |

When a product framework groups capabilities, keep its meaning coherent: measurement outputs stay with measurement, interventions with actions, and controls with policy. Lead each group with its purpose before subfeatures. Do not split a related outcome into a floating section simply because it has a striking chart. Separate audiences' trust boundaries where the product actually supports them. This is a reasoning check, not permission to invent architecture or a branded framework.

For conceptual/positioning visuals, show axes, level definitions, and intended movement without “you are here,” confidence percentages, leakage labels, or an invented current-position bar. An evidence-backed diagnostic chart is a different artifact and must state its method. Inspect an early render before reusing the visual throughout the document. Use short noun-phrase headings that let the story scan; keep the tone helpful and avoid congratulating or challenging the buyer on assumptions.

### 4. Review prose before rendering

Run the deck-review rubric directly on the draft with its appropriate mode: one-pager, sales, or pitch. This is rubric reuse, not a claim that a nested command or independent reviewer ran. Assess problem, clarity/difference, evidence, narrative, readability, competitive accuracy, and ask; pitch adds market-size credibility. Produce a scorecard and the highest-impact fixes. Any score below 7 needs a specific explanation and proposed correction. Factual, permission, and accuracy defects block readiness irrespective of score. Operational guides prioritize a step-by-step accuracy check over persuasive-copy scores.

Show the draft and meaningful review findings. Incorporate the user's review under the current authorized flow; preserve any required separate review gate. If an optional writing reviewer is present, use it for voice and claims. If absent, apply the same checks manually and keep any required independent gate pending.

### 5. Render and inspect actual output

For requested branded PDFs, read and invoke `<brain_dir>/runtime/payload/skills/visual-doc-creation/SKILL.md` and `PRINCIPLES.md`. Use its actual flow renderer for image-rich or unknown-length documents, or its fixed-page template for short controlled documents. Reuse the reviewed brand configuration as described in the skill's `BRAND-CONFIG.md`; do not repeat setup. Its bundled trial table renderer is reserved for a requested findings report with the matching contract. Source-specific VC/onboarding wrappers are not installed; do not claim their execution.

For requested slide production, invoke `<brain_dir>/runtime/payload/skills/slide-deck/SKILL.md` after content approval. Use its full schema/taxonomy and bundled concrete Pattern Library, then actual PNG/PDF export. This is native skill invocation, not a Product Bench deck command. Unsupported concrete templates return to planning; no blanket schema-to-template coverage is implied.

For basic HTML only, `node <brain_dir>/runtime/render-document.mjs --input <source.md> --output <document.html>` remains available. It does not execute either native rendering skill or prove a PDF. If an installed skill/dependency is absent, name the missing dependency and leave rendering pending; do not silently replace the requested PDF pipeline with generic HTML. Check actual Python modules and Chromium launch before promising exports.

Use readable type, sentence-case headings, consistent theme, working links, approved real screenshots where appropriate, meaningful chart captions, and a complete contact line. Rendered screenshots must reflect actual product/platform availability. Do not deliver “VISUAL HERE” boxes as finished assets. Inspect the actual rendered layout with an available preview tool and save a receipt: page count, clipping, wrapping, font fallback, table breaks, footer, links, and embedded image quality. For fixed-height pages, inspect or measure content height against page height after every copy/figure change; a successful render can still hide overflow. Confirm image mapping by supplied filename, use original approved assets where available instead of downsampled embedded copies, and check image resolution at the rendered size. Preserve approved canonical templates and render from a working copy. Parsing HTML structure alone is not visual preview. If preview is unavailable, hand the file to the configured review/preview stage and mark layout verification pending. Never claim a PDF, single-page layout, page count, or screenshot inspection without evidence.

### 6. Handoff and learning

Save accepted source, rendered artifact when produced, review findings, claim ledger, applied toggles, and preview receipt. State actual formats and incomplete checks. Propose a build-log entry containing account, mode, date, sender, version, source/artifact, and important learnings. Use the reviewed context workflow for durable updates; do not modify context, send the artifact, or commit without the applicable authorization.

### Voice

Apply approved brand voice and naming. Default to short concrete prose, active verbs, sentence case, zero em-dashes, positive direct claims, and no “leverage,” “seamless,” “transformative,” or “robust.” Replace abstract value language with a verified action/outcome. Quotes remain accurate, numbers remain sourced, and material limitations remain visible. A concise artifact can have a deep drafting and review process.

## Output template

```markdown
# [Product / account]: [Outcome or decision]
Audience: [reader] | Mode: [mode] | Status: [draft/reviewed/layout pending]

## The problem / opportunity
[Specific buyer situation; source or assumption.]

## What changes
[Verified outcome and mechanism; roadmap labeled.]

## Proof
[Approved evidence with method, date, limitations, and permission.]

## How it fits
[Relevant workflow, boundaries, setup/cost dependencies; no catalog dump.]

## Next step
[One action, owner, date/decision criterion.]
Contact: [confirmed contact before customer-ready rendering]

--- Internal build notes, excluded from customer-facing copy ---
Personalization: [applied toggles and evidence]
Claims: [source/observation/method/permission/unknowns]
Review: [mode scorecard, corrections, unresolved severe findings]
Rendered artifact: [actual path/format]
Preview: [receipt or pending stage]
Build-log proposal: [version/account/mode/date/sender/learning]
```

For a vision-led pitch, replace the standard body with hook → worldview/outcome → evidenced payoff → sustained advantage/limits → offer. For an onboarding guide, replace it with verified prerequisites → ordered steps/checkpoints → failure recovery → support, adding approved partner-program blocks only in that mode.

## Worked example

Fictional illustration only. An operations director has just renewed a competitor and asks about a fictional product's import review. No verified capability or trial metric is supplied.

**Mode recommendation:** Defensive. Explain the workflow neutrally; avoid diagnosing the buyer's current setup.
**Draft title:** “Reviewing an import before applying it.” `[FICTIONAL CONCEPT]`
**Prose:** “A review step can help a team identify conflicting rows before an import changes records. The proposed evaluation would test one representative file and compare how each workflow handles a conflict.”
**Proof:** `[NEEDS DATA: shipped preview behavior and representative test results]`
**Ask:** “Choose one sample file and an owner for the comparison.”
**Readiness:** Draft only; no shipped claim or outcome result is supported, and final rendering awaits confirmed contact and preview.

Weak: “Your team is stuck at stage 1, and our seamless platform doubles productivity.” Better: “Compare how each workflow handles the same conflicting rows.” A framework graphic should explain the dimensions, not mark the prospect's maturity without data.

## Quality checks

- The mode matches the buyer's decision, and each restored track has its own reasoning rather than one template with a new title.
- The sender/contact and final naming are confirmed; claims, pricing, founder copy, proof permissions, and platform availability are verified.
- Personalization is evidence-based; defensive copy avoids challenging the incumbent champion on assumptions.
- Vision-led copy passes altitude/reconstruction tests; operational guides pass live accuracy/checkpoint tests.
- A review scorecard exists, fixes are specific, and any required independent review is honestly recorded.
- Rendered output is actually inspected; pending format/layout checks remain visible.
- Internal claim notes are separated from customer-facing copy; delivery and context updates follow the reviewed authorized flow.

## Anti-patterns

Feature catalogs presented as vision; unsupported percentages; silently switching modes; invented client logos or founder credentials; misleading maturity markers; dense tiny one-pagers; outdated navigation in setup guides; fake rendering/preview receipts; hardcoded internal build pipelines; implied independent review; emailing a draft automatically; blindly carrying over prior templates and product claims.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
