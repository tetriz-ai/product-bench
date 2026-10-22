<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, brand-voice.md]
capabilities: []
-->

# /pb-changelog

Turn a verified shipped change into customer release notes.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Shipped change and release evidence | User-facing change, who benefits, how to use it, limitations |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Confirm shipped state.
2. State behavior, not implementation trivia.
3. Do not promise unshipped availability.



## Procedure

Turn verified shipped changes into customer-facing release notes. Parse the release/window, candidate changes, user audience, rollout status, source scope, and optional PDF/screenshots. A planned spec, closed ticket, merged commit, or familiar feature name alone does not prove the behavior is deployed and available to a particular customer.

Resolve the brain directory from `.product-bench-install.json`, read declared product/user/brand voice, and save in the configured output directory. Prefer release manifests, actual code/merged change evidence, rollout controls, and verified behavior from approved sources. If unavailable, produce a clearly labeled draft with shipment/availability gaps.

1. **Retrieve the complete release scope.** When using an available issue/project/release API, inspect total count and pagination before accepting the returned list as complete. Query all pages or explicitly report partial coverage. Respect approved source paths; linked material outside scope needs its own authorization. Do not introduce a required GitHub CLI dependency when release evidence can come from another approved source.
2. **Verify shipped behavior and mechanism.** For each candidate, check implementation/merged evidence and actual rollout availability. For products not developed with PRs, accept equivalent deployment/release evidence. A closed ticket with no implementation reference is unresolved, not proof that nothing shipped. Read the relevant actual specification or implementation before describing what a metric or feature does; titles can be ambiguous. Distinguish a fix, improvement, new capability, and user-visible infrastructure effect.
3. **Make a release ledger.** Record customer behavior, source/date, deployment/rollout status, eligible role/plan/platform, how to access it, metric method, and material caveats. Label missing information `[NEEDS DATA]`. A comparative benchmark needs a shipped comparison mechanism and valid evidence; an internal baseline must not become an industry benchmark. Roadmap remains separate.
4. **Order by customer value.** Lead with the change most likely to affect the reader's work or decision, not ticket number, build sequence, or engineering ownership. Keep minor improvements concise. Include infrastructure only when a user-visible consequence is known.
5. **Draft the usable entry.** Say what the user can now do, why it matters, how to start, who has access, and genuine constraints. Use 2–3 short sentences for the main change; add 3–5 verb-led steps only when interaction needs explanation. Limitations describe current behavior, not internal QA narration. Do not manufacture a limitation or “coming next” filler. An approved near-term commitment may appear separately, clearly future-facing.
6. **Review claims and voice.** Every number needs method/source accessible near the claim. Check availability language, terminology, customer approvals, and accidental disclosure in captions/alt text/assets. Apply available writing checks for economy, clarity, voice, platform fit, and AI patterns; use the same rubric manually if no writing skill exists, without claiming a tool score.
7. **Optional rendered/PDF track.** Check actual renderer, preview capability, screenshot access, and font/image inspection availability before starting. Missing screenshot access does not authorize mockups presented as live captures. For a requested PDF, read and invoke `<brain_dir>/runtime/payload/skills/visual-doc-creation/SKILL.md` and `PRINCIPLES.md`, using its actual flow-doc path and reviewed brand inputs from `BRAND-CONFIG.md`. Preserve the two-pass full-bleed override when needed and verify the resulting PDF and isolated header/footer fonts. Check real Python/Playwright/Chromium dependencies; missing dependencies leave PDF execution pending and must not silently trigger a generic renderer substitute. No private build wrapper, browser session, or login is assumed. If screenshots are requested, verify the correct live product/page and capture date, and respect its read-only scope. Ask the user to handle authentication through the applicable browser workflow when needed.
8. **Asset integrity and final handoff.** Use approved synthetic/demo accounts where possible. For real accounts, remove unapproved identifiers in pixels, titles, captions, alt text, code paths, text areas, and filenames. Label redacted or illustrative data honestly; never slightly perturb real metrics and present the replacements as real product evidence. A transformed screenshot is an illustration with original provenance kept privately, not a live metric result. Confirm any redaction in the captured output because a reactive UI can re-render. Crop from actual element bounds with padding and recheck after edits. Describe the product path/date in captions without unapproved account names. Inspect actual rendered pages for orphaned sections, clipping, image readability, and header/footer font fallback; PDF header/footer fonts may render separately from body fonts. Save source, release ledger, artifact, and actual preview receipt. Missing checks stay pending; do not claim PDF/page count or visual inspection without evidence.

### Voice

Apply approved brand voice. Default to simple words, short sentences, 1–2 sentences per paragraph, sentence-case headers, active verbs, zero em-dashes, and no hype. “You can now review the changed rows” is useful if verified. Cut “We're excited to announce,” “powerful,” “game-changing,” “we've been working hard,” and negative parallelisms. Keep a material operational caveat even if it interrupts a cleaner story.

## Output template

```markdown
# [Release/date]
Version: [when applicable] | Audience: [eligible users]

## [Feature]: [Concrete user outcome]
### What's new
[2–3 short sentences describing verified behavior.]
### How to use it [omit when unnecessary]
1. [Verb + exact verified action/location]
2. [...]
### Who can use it
[Role/plan/platform/rollout conditions, verified.]
### Limitations [only real constraints]
- [Current constraint; no internal QA backstory.]

## Also shipped
- [Improvement/fix]: [User impact and relevant access caveat.]

## Coming next [optional, approved committed item only]
- [Future item clearly labeled.]

[Verified support/contact path, if supplied.]

--- Internal package ---
Release ledger: [change, implementation, deployment, rollout, source/date]
Metric methods: [source/window/denominator/comparison/caveat]
Assets: [capture path/date, approval/redaction/illustration status]
Format/preview: [actual artifact and inspection receipt, or pending]
Open blockers: [unverified shipment/availability/approval]
```

## Worked example

Fictional illustration only. Suppose a supplied fictional release manifest confirms an import preview for administrators in a limited rollout, but gives no time-saving result.

**What's new:** “Administrators in the pilot can review changed rows before applying an import.” `[FICTIONAL VERIFIED-IN-SCENARIO FACT]`
**How to use it:** “Open Imports, choose a file, and select Preview.” This fictional path must be replaced by a verified real path before use.
**Who can use it:** Pilot administrators. Broader availability remains `[NEEDS DATA]`.
**Limitation:** “The preview excludes files larger than the supported limit.” `[NEEDS DATA: actual limit]` blocks customer-ready wording until verified.

Weak: “Live for everyone, with imports 40% faster.” Better: “Pilot administrators can review the changed rows before applying a file.” Do not infer availability or performance from the merged change.

## Quality checks

- Complete or explicitly partial release coverage; shipped and deployed state verified per change.
- The mechanism matches implementation, not merely its name or planned spec.
- Role/plan/platform and rollout conditions are accurate; unsupported benchmark claims removed.
- Main change leads with a user outcome; minor/internal work is not filler.
- Limitations state present constraints; future commitments are approved and separate.
- Assets have permission, correct provenance, no unapproved identity leaks, and honest labels.
- Rendered output is actually inspected when requested, with pending checks named.

## Anti-patterns

Ticket titles treated as deployed features; merged PRs treated as universal rollout; missing PR treated as proof of no implementation; default-page truncation; internal QA stories in user limitations; infrastructure diaries; fake comparative metrics; mock screenshots called live; perturbed numbers presented as real; inherited authenticated-session assumptions; automatic publishing or commits.

## Optional Editorial Draft refinement

When the user requests Editorial Draft refinement, read `<brain_dir>/runtime/payload/brain/EDITORIAL-DRAFT.md` and invoke the actual installed engine in refinement mode with **How-To Guide**, `company-blog` platform, the approved draft, evidence, and team voice. Skip repeated setup, discovery, and outline. Run Hemingway, Clarity, Voice, Platform, and Detector using their actual contracts, then canonical AI-pattern scrub and polish. Preserve availability, claims, links, and release-note structure. If the dependency is absent, leave the requested refinement pending; do not claim the manual checks above executed Editorial Draft.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
