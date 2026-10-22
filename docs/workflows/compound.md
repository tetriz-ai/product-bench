## Procedure

Resolve Product Bench context/output paths from `.product-bench-install.json`. Capture a learning soon after an interview, call, competitor change, decision, shipped milestone, engineering discovery or workflow failure. A deposit records **what changed in understanding**, with observation date/source and confidence; it does not merely accumulate transcripts or promote suggestions to decisions.

### Classify and deduplicate

Read declared current target context before proposing edits; preserve structure and the existing claim's history. Route user pain/behavior/safe quote -> `users.md`; buyer relationship/objection -> `stakeholders.md`; competitor change -> `competitors.md`; actual direction/tradeoff decision -> `decisions-log.md` with the smallest relevant `product.md` change; shipped state -> product/roadmap only with release evidence; verified constraint/integration -> `technical-constraints.md`; measured outcome -> `metrics.md`; GTM/voice learning -> `gtm.md`/`brand-voice.md` when it truly changes reviewed guidance. Do not create unconfigured extra context files: attach sourced report evidence to the relevant existing context, with an artifact link if needed. Ownership stays in reviewed stakeholders/roadmap conventions.

Search for overlapping wording and underlying claim. New user signal starts weak (one independent source); two supports -> moderate; three or four -> strong; five or more traceable independent sources -> confirmed **within the stated population and method**, not universal truth. Named identities are not required in shared summaries; safe source IDs preserve provenance. Multiple retellings of one interview are one source. Counterevidence is retained and can weaken confidence rather than silently being overwritten. Competitor changes distinguish confirmation from contradiction and include source/date. A third-party report includes publisher, date, sample/method, geography, statistic denominator and applicability; its statistic is not a product/customer result.

### Draft the smallest useful update

Separate exact participant quote, paraphrase, observed behavior and inference; paraphrases never gain quotation marks. Preserve consent/privacy in shared knowledge. For a decision use decision, options/tradeoff, reason, owner if known and revisit trigger; a candidate recommendation is not a decision-log event. Product changes state what shipped/changed and proof, rather than copying a complete spec.

Prepare exact before/after diff, provenance and proposed freshness changes. Keep readability concrete and economical: plain words, source links, one claim per entry, short consequence. An external plain-English skill is optional; this explicit procedure works without one. Re-read edits for lost scope/uncertainty. Compare word delta and justify net added context; a one-line insight should not become 200 words of generic prose. Material semantic or length-expanding changes need review, even when cosmetic fixes are allowed.

### Source-shaped entries inside existing targets

Use these shapes when the existing target has no more specific convention. Preserve its structure; the snippets are entry formats, not permission to create extra files.

```markdown
**Research signal [safe source ID]** — [observation date; population]
Quote: "[exact approved verbatim]" [omit if unavailable]
Observed behavior: [what the source actually reports]
Insight: [bounded inference; distinct from behavior]
Strength: [rating] ([N] independently originating sources)
Sources / counterevidence: [safe IDs, dates and pointers]
Tags: [actual persona / problem]
```

```markdown
**[Competitor] — [date]**
Change: [confirmed public behavior or explicitly unverified claim]
Source: [exact primary URL and observed/published date]
Prior observation: [confirms / contradicts / no prior entry]
Implication: [hypothesis for this product, not a proved buyer conclusion]
```

For a third-party report in the relevant declared context, retain publisher/title/date, geography, sample/method and each statistic's numerator/denominator, the permitted sales/GTM use, caveat and related artifacts. Deduplicate by report/source identity; append a sourced new subsection to its existing entry rather than cloning the whole report. For a decision retain date, subject, options/tension, actual call, reasoning, known owner and revisit trigger. These richer source records make future commands auditable without requiring full transcripts in every context file.

### Review, write and verify

Display the proposed changes **before writing** shared context, naming each target and reason. Honor existing authorization; otherwise request review. Separate accepted, rejected and pending proposals; no all-or-nothing pressure. Apply accepted diffs and verify actual saved content/source links. Update `Last updated` only on context content that really changed; inspecting or successfully fetching a source does not refresh facts. A no-op deposit changes no timestamp. Keep failed/unreviewed updates pending and report them honestly.

Check command drift separately: does the learning change audience, evidence gate, language, metric, scope or behavior of a command? Offer a specific reusable pattern -> action proposal with scope/date, not a generic slogan. Avoid creating an unsupported `command-learnings.yaml` engine. A simple one-off correction belongs in the artifact/context; durable workflow behavior may require a reviewed canonical command edit. Do not modify generated commands directly or claim the preamble automatically consumes an unconfigured rule.

Finish with actual deposited targets, corroboration changes, pending proposals, readability delta and next action. Draft/save authorization never silently authorizes commits, pushes, PRs or messaging. If Git work is explicitly requested, follow repository PR policy rather than source-specific automatic commits.

## Output template

```markdown
# Learning deposit: [event/date]
Source/observation date/scope: ... | Consent/redaction: ...
## Classification and evidence
| Field | Value |
|---|---|
| Claim | |
| Existing match | |
| Independent sources/strength | |
| Counterevidence | |
| Target/reason | |
## Proposed reviewed diff
[Exact before/after or patch for each context target]
Freshness: [only targets that will actually change]
## Command-learning proposal
Pattern: [observable recurring condition]
Action: [specific bounded behavior]
Affected command: [or none; separate from context deposit]
## Result
Applied: [actual verified targets or none]
Pending/rejected: ...
Readability/word delta: [actual comparison]
Next action: [decision/research/approved Git step]
```

## Worked example

**Fictional signal:** a second independently interviewed coordinator reports finding replacements through private messages. Current user context holds one dated source. Propose adding the second safe source reference and updating strength weak (1) -> moderate (2), preserving a contrary participant who uses an existing shared roster. The analyst inference “availability discovery may be the bottleneck” stays separate from the exact quote. The deposit changes users, not the committed roadmap; no product decision occurred. A repeated workflow failure—counting email opens as successful replacement—supports a separate command proposal to require an action event when testing the hypothesis. Without review acceptance, both diffs remain proposals and no freshness date changes.

## Quality checks

- Learning has source/date/scope and genuinely changes understanding.
- Independent corroboration and contradictions are preserved; quotes remain exact/safe.
- Targets already exist and are declared; entry structure matches the current file.
- Exact diff is displayed, accepted changes verified, freshness tied to real content changes.
- Reusable command behavior is specific and separate from one-off factual context.

## Anti-patterns

- Dumping full notes into product context, inventing quotes or promoting enthusiasm to decisions.
- Counting repeated summaries as independent sources or replacing contradictory evidence with a cleaner story.
- Resetting freshness after a successful check or no-op edit.
- Claiming a nonexistent skill/hook applied a readability or learning rule.
- Auto-committing, publishing or messaging because “compound” was invoked.

## Plain-English readability dependency

Run the bundled `plain-english` skill on the proposed changed context sections before writing them. Resolve BLOCKER findings before the write. Apply only its permitted mechanical fix tiers automatically; surface meaning changes for review and preserve the original approved facts. Resolve `.agents/skills/plain-english/SKILL.md` for Codex or `.claude/skills/plain-english/SKILL.md` for Claude Code. Execute its structural lints, fix tiers, and actual sibling Editorial Draft Hemingway, Clarity, and AI-pattern resources with internal-document exemptions. A missing bundled plain-english skill is an installation gap. Its Editorial Draft reviewer dependency comes from the optional Content Engine import; if absent, leave reviewer passes pending while reporting completed structural checks.
