# Functional coverage

## Content dependency setup — 2026-10-15

Ordinary setup previews introduced Content Engine, Blog and Editorial Draft on both
Claude Code and Codex without a prompt naming those dependencies or a preinstalled
engine. Both explained the missing source and import/deferral path. One Codex
answer initially failed an overly strict same-line matcher; regrading its retained
answer and tool evidence confirmed the offer was present. The corrected matcher
has regression coverage; original receipts remain separate from that regrade.

The separate `setup-content-import` case passed on both hosts against an approved
local checkout of the real upstream engine. Each fresh installation began without
`content_source` or an engine. The host configured the source, previewed and applied
the actual import, ran doctor and read all three linked native skill entrypoints.
The oracle verified installed links, recorded revision and unchanged unrelated
configuration. Protected company context remained unchanged. Final instructions
passed in fresh runs after the upgrade-safe guide path was added.

Offline regressions cover malformed installed guide headings, preserved team-owned
guides with a current runtime copy, and setup-oracle rejection of missing imports,
missing execution evidence, unrelated config edits and broken links. Explicitly
selecting the import case without an approved source reported blocked for both
hosts without agent execution. The complete suite passed 141 tests with zero skips,
including actual browser/rendering checks; packed-install smoke and all three
runnable examples passed.

These are focused setup checks using fictional company context. They do not rerun
the full earlier mode matrix or certify live providers, content quality or publishing.
See [testing](TESTING.md) for reproduction and source configuration.

## Imported content pipeline — 2026-10-14

The architecture change was verified on Claude Code and Codex with the real
proposed upstream skills and complete synthetic evidence. All nine affected modes
passed on both hosts: Blog; Content Engine scan, cluster, inventory, competitor-gaps,
refresh-plan, brief and write; and the weekly review. The checks require saved
artifacts, preserved caller inputs and successful reads of selected upstream guides.
The completed runs also passed the final resource-read assertions. Timeout retries
used fresh temporary installs; failed attempts remain separate from passing receipts.

Standalone Content Engine also completed the full Content Engine → Blog → Editorial Draft
writing chain on both hosts without a Product Bench installation. Native dry-runs
passed on both hosts with files outside `working/` unchanged. Actual drafts, evidence
ledgers and same-session editorial findings were saved; no independent-agent claim
or external publication was made.

Offline validation: 138 Product Bench tests passed on Node 22 and 26, including
actual renderer/browser checks; 434 Content Engine and 152 scanner tests passed on
Python 3.9. Packed installation, both repositories' runnable examples, upstream
lint/type checks and all three native skill validations passed. Import tests cover
preview/apply, recorded revisions, both host links, protected updates, missing-link
repair and safe retirement of legacy Editorial Draft copies. Live providers, delivery
and output quality are separate from these synthetic functional checks.

See [testing](TESTING.md) for `PB_CONTENT_REPOSITORY` and the longer content-case
timeout. The full earlier mode matrix below remains the 2026-10-13 baseline;
this change reran the affected content modes rather than claiming a new full-matrix run.

## Earlier full workflow matrix — 2026-10-13

All 79 workflow modes plus full setup completed functional verification on both
Claude Code and Codex: **80/80 per host**. This result includes focused reruns and
artifact rechecks after correcting test assertions; original failed receipts and
transcripts were retained. The matrix below is a functional-contract check over
explicit fictional inputs, not an editorial quality score.

Hosts: Claude Code 2.1.296; Codex CLI 0.162.1. The upstream main revision was unchanged
during the run. Test implementation and reproduction steps are in
[the testing guide](TESTING.md) and [the case registry](../scripts/mode-functional-cases.mjs).

- Full setup wrote all ten approved context areas, registered its source, executed
  fixture analytics, and saved the selected first spec after context setup.
- Analytics save/run/list/dashboard/schema and context compound/sync checked actual
  persisted definitions, approved changes and reviewed checkpoints.
- Writing used installed Editorial Draft; finished drafts and editorial reviews were saved.
- All six commercial-document modes produced branded HTML and actual PDFs in both hosts.
- Prototype browser checks exercised completion and in-progress permission revocation.
- Both spec-review modes ran all 12 applicable lenses in fresh host processes, with
  sequential/default and parallel/auto execution and isolated cold-reader input.
- Buzz imported the actual upstream engine. Twelve supplemental synthetic runs covered
  all six modes on both hosts, including nonempty candidates, judging, drafting,
  required native humanizers and real daily PDFs. Synthetic transport replaced HTTP
  responses only. One Codex delegation evidence gap received an additional directly
  observed native-subagent audit tied to the same case inputs.

Live HN/Reddit empty scans were also exercised. Product Hunt's live scanner reported
missing credentials; synthetic positive coverage does not verify live authentication.
No external delivery, platform posting, scheduling or publication occurred.

Offline validation: **128 tests passed, no skips**, including actual renderers;
packed-install checks and all three runnable examples passed. The 15 host-harness
regressions passed on Node 22, 24 and 26.

| Workflow | Modes exercised | Count | Claude Code | Codex |
| --- | --- | ---: | --- | --- |
| `pb-setup` | Full context → capabilities → first spec | 1 | Pass | Pass |
| `pb-ai-citation-monitor` | `setup`, `record`, `report`, `recalibrate` | 4 | Pass | Pass |
| `pb-analytics` | `ask`, `save`, `run`, `list`, `dashboard`, `schema`, `account-health` | 7 | Pass | Pass |
| `pb-battlecard` | `default` | 1 | Pass | Pass |
| `pb-blog` | `default` | 1 | Pass | Pass |
| `pb-brainstorm` | `default`, `ost` | 2 | Pass | Pass |
| `pb-brief` | `default` | 1 | Pass | Pass |
| `pb-buzz` | `init`, `hn`, `reddit`, `ph`, `brands`, `daily` | 6 | Pass | Pass |
| `pb-changelog` | `default` | 1 | Pass | Pass |
| `pb-competitor` | `default` | 1 | Pass | Pass |
| `pb-compound` | `default` | 1 | Pass | Pass |
| `pb-content-engine` | `scan`, `cluster`, `inventory`, `competitor-gaps`, `refresh-plan`, `brief`, `write` | 7 | Pass | Pass |
| `pb-content-engine-weekly` | `default` | 1 | Pass | Pass |
| `pb-deck-review` | `pitch`, `sales`, `one-pager` | 3 | Pass | Pass |
| `pb-design-review` | `default` | 1 | Pass | Pass |
| `pb-design-spec` | `default` | 1 | Pass | Pass |
| `pb-evals` | `design`, `review`, `report`, `calibrate` | 4 | Pass | Pass |
| `pb-grill-me` | `default` | 1 | Pass | Pass |
| `pb-gtm` | `default` | 1 | Pass | Pass |
| `pb-hypothesis` | `default` | 1 | Pass | Pass |
| `pb-idea` | `default` | 1 | Pass | Pass |
| `pb-improve` | `default` | 1 | Pass | Pass |
| `pb-market-scan` | `default` | 1 | Pass | Pass |
| `pb-narrative` | `default` | 1 | Pass | Pass |
| `pb-onboard` | `default` | 1 | Pass | Pass |
| `pb-premortem` | `default` | 1 | Pass | Pass |
| `pb-pricing` | `default` | 1 | Pass | Pass |
| `pb-prototype` | `default` | 1 | Pass | Pass |
| `pb-review-spec` | `default`, `auto` | 2 | Pass | Pass |
| `pb-roadmap` | `default`, `status` | 2 | Pass | Pass |
| `pb-sales-call-prep` | `discovery`, `demo`, `evaluation`, `closing`, `champion-prep` | 5 | Pass | Pass |
| `pb-sales-doc` | `one-pager`, `leave-behind`, `defensive`, `pitch`, `onboarding-guide-design-partner`, `onboarding-guide-plain` | 6 | Pass | Pass |
| `pb-scope-check` | `expand`, `selective`, `hold`, `reduce` | 4 | Pass | Pass |
| `pb-spec` | `default` | 1 | Pass | Pass |
| `pb-strategy` | `default` | 1 | Pass | Pass |
| `pb-sync-context` | `default` | 1 | Pass | Pass |
| `pb-tech-sync` | `default` | 1 | Pass | Pass |
| `pb-uxr` | `pre`, `post`, `journey` | 3 | Pass | Pass |
