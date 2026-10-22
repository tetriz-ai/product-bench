# CLI reference

Run `node product-bench.mjs help` from this checkout. Installed repositories use
`node <brain_dir>/runtime/product-bench.mjs help`, with the directory recorded in
`.product-bench-install.json`. `help` is the supported action; `--help` is not a flag.

Every action accepts `--target DIR` (default: the current directory). JSON/file
paths supplied to `--file` or `--sql-file` resolve from the current working directory.
Unsupported option names, including options belonging to another action, are rejected.
Value options need their following value. Boolean options are listed below.

| Action | Required input | Optional options |
|---|---|---|
| `help` | None | None |
| `init` | Existing target directory | `--brain-dir DIR`, `--yes` |
| `doctor` | Installed target | None |
| `update` | Installed target | `--apply` |
| `uninstall` | Installed target | `--yes` |
| `share` | Installed target | `--files FILE,FILE`, `--apply`, `--reviewed` |
| `content-install` | Installed target and configured/recorded `content_source`; imports Content Engine, Blog and Editorial Draft | `--apply` |
| `buzz-install` | Installed target and configured/recorded source for import | `--apply` |
| `source-add` | `--file source.json` | None |
| `source-pull` | `--id SOURCE` | None |
| `sync-stage` | `--file batch.json` | None |
| `sync-decide` | `--id PROPOSAL`, `--decision accepted\|rejected` | `--applied` |
| `sync-status` | Installed target | None |
| `analytics` | Fixture: `--metric`; live: `--sql` or `--sql-file` | `--provider`, `--from`, `--to`, `--account` |
| `analytics-save` | `--file definition.json` | None |
| `analytics-list` | Installed target | None |
| `analytics-run` | `--name NAME` | `--from`, `--to`, `--account` |
| `analytics-dashboard` | `--file dashboard.json` with `definitions` array | `--from`, `--to`, `--account` |

`--yes`, `--apply`, `--applied`, `--reviewed`, and `--json` are boolean tokens.
`--json` is accepted for compatibility but does not select an output format.
Action-specific formats remain the same with or without it.

## Results and failures

- `help` prints usage. `init` prints an installation preview and, after confirmation,
  an applied summary. Noninteractive installation/removal needs `--yes`.
- `doctor` prints JSON with missing/modified files, recorded-date freshness, source
  health, and local Buzz and Content Engine status. `ready` is managed-file health, not business-context
  completeness or proof of a working provider.
- `update` previews by default. `--apply` updates unchanged managed files and skips
  edits. It preflights destinations before writing and preserves reviewed context.
- `uninstall` prints a preview and asks before removing unchanged managed files.
  It keeps context and local edits. `--yes` confirms that removal.
- `share` is an optional export. Applying needs both `--apply` and `--reviewed`.
  Named privacy findings or unfilled context block copying. The screen has limited
  patterns; inspect the exact files before approving an export.
- Buzz preview/apply returns JSON. An unset source returns `not_configured` and the
  exact configuration path. No import executes the engine, configures credentials,
  posts, schedules, or commits. See the [Buzz procedure](../payload/commands/pb-buzz.md).
- Source actions return JSON registrations, proposals, checkpoints, or pending state.
  Accepting requires an already applied reviewed edit and `--applied`; the CLI does
  not edit context for that attestation. See [source contracts](SOURCES.md).
- Analytics actions return JSON, with fictional fixture fields or live request/result
  metadata. PostgreSQL CSV remains in `result_csv`. See [analytics contracts](ANALYTICS.md).
- Rejected input or operational failure exits nonzero and prints its reason to standard
  error. A failed/partial source pull cannot advance the reviewed checkpoint.

## Adapter entry points

These are separate installed executables, not new main CLI actions. Replace the
bracketed paths with supplied files and the recorded runtime directory.

- Review: `node <brain_dir>/runtime/review-lenses.mjs --host claude --input artifact.md --out reviews --lenses functional,naive-reader --parallel 1`.
  Codex uses `--host codex`. Optional `--skeptic` launches eligible follow-up reviews;
  repeat `--evidence FILE` only for explicitly approved supporting evidence.
- Render Markdown: `node <brain_dir>/runtime/render-document.mjs --input artifact.md --output artifact.html --title 'Reviewed artifact'`.
  The supported subset includes headings, paragraphs, lists, tables, links, and code.
- Freshness hook: `node <brain_dir>/runtime/freshness-hook.mjs --host claude` or
  `--host codex`, receiving the host's hook input on standard input. Installation
  registers it without replacing unrelated host settings.

Optional Python/PDF runtimes and their arguments are documented in the installed
[visual document](../payload/skills/visual-doc-creation/SKILL.md) and
[slide](../payload/skills/slide-deck/SKILL.md) skills.

`content-install` follows the Buzz preview/apply contract, using `content_source.repository`
and optional `.branch` in the brain config. It records the branch's resolved revision
and links all three upstream skills for both hosts without executing them. Missing
configuration returns `not_configured`; edited checkout, unexpected origin, foreign
skill or rewritten history blocks replacement. Updates do not install an absent
optional engine. `doctor.integrations.content` inspects only local files and links.

`doctor.hooks` reports Claude Code and Codex registration separately from `ready`, which remains managed-file health. `update` previews and repairs missing owned hook registrations while retaining unrelated settings. Malformed hook settings are rejected before lifecycle writes. For connector failure or partial pagination, `sync-stage` with an enabled source ID and explicit `complete:false` exits nonzero and clears only its last-checked health timestamp.
