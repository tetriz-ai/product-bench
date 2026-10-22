## Procedure

Resolve the configured Product Bench context/output directories from `.product-bench-install.json`. An idea is a structured **deposit before validation**, not a committed roadmap item. Start with the user's one-liner; if absent, ask for it. Search supplied/reviewed product context and existing idea artifacts before asking questions already answered.

### Sharpen substance before metadata

Ask missing consequential questions **one at a time**, adapting to each reply. Preserve answers as you go; do not hand the user an eleven-question form.

1. Paraphrase the idea in one or two sentences and check the shape when ambiguous.
2. What would the user actually see or do differently? Name the smallest surface: interaction, notification, report, API or workflow. “A platform” is not a surface.
3. Is this an observed problem or a proposed solution? For a solution, expose the underlying problem; for a problem, leave the solution open if unknown.
4. Name one explicit scope exclusion.
5. Why did this surface now? Identify the real change or trigger.

Route a concrete improvement to shipped behavior with a baseline to `pb-improve`; route a fully formed testable bet to `pb-hypothesis`. If problem/surface remain shapeless, offer a **theme note** with a next evidence question instead of pretending it is a feature. Do not lose a promising raw thought because it is early.

Then capture beneficiary (use this product's actual personas), source and observation date, evidence/counterevidence, theme, promotion trigger and adjacency. A promotion trigger must be actionable: a specified independent customer signal, dependency becoming available, or dated review with a learning objective. “When we have time” is not a trigger. Read existing artifacts for adjacency rather than asking the user to remember their paths.

### Deduplicate and connect evidence

Use the existing reviewed idea backlog/registry if configured; otherwise search the configured output directory and propose a draft entry there. Search both wording and underlying problem/theme. For a clear duplicate, propose adding a dated corroboration note to the existing entry; count distinct primary sources rather than repetitions. For partial overlap, explain what is shared and what differs, then resolve merge/link/separate with the user. If already a live hypothesis, route the new signal to `pb-compound` for that hypothesis rather than creating a competing idea.

Propose cross-file learning through `pb-compound`, explaining why: participant evidence -> user context; buyer objection -> stakeholder context; competitor change -> competitor context; verified feasibility discovery -> technical constraints. External report statistics need a source/date and a reference in the idea; do not create an unconfigured context file or claim to have read undeclared context. A strategic shift is a proposal for `pb-strategy`, not an automatic rewrite. Update the theme index only as part of reviewed backlog changes.

### Draft, review, and promotion

Fill every entry field; use “none yet” or `[NEEDS DATA]` instead of blank invented metadata. Inspect current IDs before proposing next IDEA-NNN. Present the sharpened entry, duplicate decision, exact destination and cross-file diffs. Honor existing save authorization; otherwise request review before changing shared knowledge. Save drafts beneath the configured output directory. Git actions require separate user authorization and the repository's PR workflow.

Close with the promotion trigger and next review date. Suggest a quarterly sweep: stale captured ideas with no new evidence after 180 days should be parked or discarded **with reviewed rationale**, not silently deleted. When promoted, link the hypothesis and retain traceability; do not leave two live copies with inconsistent status. Three or more independent ideas in a theme suggest a `pb-brainstorm ost` or strategy pass, not proof of market demand.

### Deposit mechanics and writing standard

A reviewed registry change places a new entry at the top of its Entries section, uses the next verified ID, and updates its actual `Last updated` header. A corroboration deposit retains the existing ID and adds source/date rather than pretending the idea is new. Existing source occurrences and independent primary sources are different counts. Where two or more entries share a meaningful theme, propose a theme-index update; three or more are a prompt for discovery, not proof of demand. Promotion marks the idea promoted and links its hypothesis; retire a redundant live backlog copy through the project's reviewed maintenance policy while preserving traceability.

Use a sharpened title describing the user-visible change, not “AI platform” or “collaboration idea.” Keep the raw thought in its own field so the interpretation can be checked. The close-out says exactly what will graduate this entry to `pb-hypothesis`, which signal is still missing, and where the deposit lives. For evidence from an external report, retain the publication/date/statistic definition and its reference even when the project has no separate market-signals file.

**Write:** “Suggest three eligible replacements to a coordinator after a cancellation.” **Avoid:** “Automate volunteer management.” Explicit exclusion: do not assign or contact replacements. Promotion trigger: a third independent coordinator describes the same replacement-search delay and an availability-data audit confirms the suggested candidates can be current. These are fictional example criteria, not discovered signals.

## Output template

```markdown
# IDEA-[next verified ID]: [sharpened title]
Status: [captured / theme / parked / promoted / discarded]
Captured: [date] | Owner: [supplied or open] | Theme: [actual theme]
## Shape
Raw thought: ...
Beneficiary: [persona/cohort]
Underlying problem: ...
Smallest visible surface: [or pre-shape]
Explicitly out of scope: ...
Why now: [trigger, not invented urgency]
## Signal
Origin/source/date: ...
Supporting evidence: [distinct sources; strength]
Counterevidence/gaps: ...
## Adjacency and duplication
[Existing idea/hypothesis/feature links; merge/link/separate rationale]
## Promotion
Trigger: [observable condition]
Next learning step: [test/research question]
Review/revisit: [date or trigger]
## Deposit proposal
[Actual destination; exact backlog change; any proposed compound changes]
```

## Worked example

**Fictional dialogue:** “Could we match volunteers automatically?” Shape check reveals the user means **show coordinators three eligible replacements for an uncovered shift**, not automatically assign someone. The problem is finding availability fast; scope excludes contacting volunteers without consent. Trigger: a coordinator mentioned two late cancellations in a supplied fictional note. Evidence is one source, weak; no general demand claim. Existing backlog contains “replacement list,” so propose updating that entry with the narrower eligibility idea and the dated signal. Promotion trigger: three independent coordinators describe the same bottleneck and can supply availability with permission. Next action: interview two more coordinators. The entry remains captured; it does not enter the committed roadmap or become a claimed market need.

## Quality checks

- A vague one-liner becomes a clear problem/surface or an honestly labeled theme note.
- Substance precedes metadata; already supplied answers are reused.
- Duplicate search covers both terminology and theme, with real source counts.
- Promotion trigger states evidence or dependency, and the next step advances that trigger.
- Cross-file updates are concrete reviewed proposals; the idea status reflects evidence, not enthusiasm.

## Anti-patterns

- Depositing the raw one-liner with a persona label and calling it scoped.
- Asking a fixed questionnaire even when answers exist, or inferring user agreement from silence.
- Treating a stakeholder request as validated demand; counting retellings as new evidence.
- Creating a second backlog because no hard-coded legacy path exists.
- Making a roadmap commitment, shared-context edit, commit or push during idea capture without authorization.
