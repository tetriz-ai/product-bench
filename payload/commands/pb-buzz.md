<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, gtm.md, brand-voice.md]
capabilities: [upstream buzz-engine, Claude Code or Codex]
-->

# /pb-buzz

Use the upstream Buzz engine for community digests and brand reports.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| init | Reviewed product context and Buzz configuration inputs | Upstream Buzz setup and verified or missing prerequisites |
| hn | Hacker News lane arguments | Upstream HN digest; dry run unless delivery is authorized |
| reddit | Reddit lane arguments | Upstream Reddit digest; dry run unless delivery is authorized |
| ph | Product Hunt lane arguments | Upstream PH digest; dry run unless delivery is authorized |
| brands | Configured brands and window | Upstream brand-mention report |
| daily | Configured lanes and daily-run arguments | Upstream daily digest with lane and state results |

If no mode is named, use `init`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Verify the installed upstream commit using doctor; import upstream main with buzz-install if missing. Normal runs do not fetch updates.
2. Read the selected command, host adapter, rubrics, and agents from the imported repository; do not recreate the workflow.
3. Reuse approved Product Bench context for upstream configuration proposals; preserve existing Buzz config.
4. Respect the user’s authorization for Slack delivery, scheduling, and Git writes.

## Upstream import and handoff

Resolve the installed import and recorded commit from doctor.integrations.buzz. Normal runs use that checkout without fetching. Setup/import resolves the configured branch (default main); product-bench update previews upstream changes, and update --apply refreshes clean imports. If doctor reports not_configured, ask for the approved engine clone URL and set buzz_source.repository plus optional buzz_source.branch in <brain_dir>/config.json. Do not guess a repository. Existing imports retain their recorded source. If absent but configured, preview node <brain_dir>/runtime/product-bench.mjs buzz-install --target . and explain its upstream repository/branch and resolved commit; apply the requested import with --apply. A modified, mismatched, or unavailable checkout is a blocker; require the canonical upstream engine before executing Buzz.

Read the imported README and SETUP plus commands/buzz-init.md for init, commands/buzz.md for hn/reddit/ph/brands, or commands/buzz-daily.md for daily. In Codex, follow the imported SKILL.md host adapter and use the upstream native skill. In Claude, resolve each CLAUDE_PLUGIN_ROOT reference to the quoted absolute import path and follow the same upstream command. If the upstream plugin is loaded, use its humanizer agent; otherwise supply agents/humanizer.md and the upstream dispatch inputs to a fresh host agent session. Missing delegation tools leave required drafts incomplete. Keep the working directory at the user's repository. Upstream /buzz calls reuse its command file, not another PB workflow.

Use reviewed product, GTM, and voice context as input to proposed Buzz configuration; collect missing channel/account/timezone inputs without inventing them. Preserve an existing buzz/config.yaml unless replacement is explicitly requested. The import's command bodies, rubrics, voice, humanizer and scanners are the only implementation. Execute the selected canonical mode directly; do not maintain a second pipeline.

Forward the requested mode and arguments. Default scans and daily runs to --dry-run until Slack delivery is explicitly authorized; the initial import does not authorize posting, scheduling, committing, pushing or merging. Configure recurring runs only when requested. Platform posting stays manual under the upstream contract. Report the upstream revision and actual output paths.

## Procedure

This command is an adapter to the separately maintained Buzz Engine. Its depth lives in the imported canonical commands, platform rubrics, voice rules, humanizer, and scanners. Read them before executing; do not replace them with this summary or reconstruct a local engine.

1. Resolve `brain_dir` from `.product-bench-install.json`, then the import through `node <brain_dir>/runtime/product-bench.mjs doctor --target <repo>`. Read its recorded commit and host link status. If `not_configured`, obtain the approved engine clone URL and set `buzz_source.repository` plus optional `buzz_source.branch` in `<brain_dir>/config.json`; do not guess a repository. Existing imports keep their recorded source. If configured but missing, preview `buzz-install --target .`, then apply the requested import with `--apply`. Setup imports the configured branch (default `main`); ordinary runs use the installed commit. Resolve an edited or incompatible import before execution.
2. For `init`, read the upstream README, SETUP, host adapter, and `commands/buzz-init.md`. Build the configuration proposal from reviewed product, GTM, and voice context; collect platform lanes, timezone, delivery destination, permitted sources, and credentials through the upstream setup. Preserve an existing configuration and show the proposed changes. Record which prerequisites were actually verified.
3. For `hn`, `reddit`, `ph`, or `brands`, read `commands/buzz.md` and the selected platform's referenced rubrics and agents. For `daily`, also read `commands/buzz-daily.md`. Forward the arguments, window, and source restrictions unchanged. Let canonical Phase 0 load the project `buzz/config.yaml`, `buzz/voice.md` (or upstream template fallback), lane rubric and `buzz/learnings/<lane>.md`, including applicable House rules. Project learnings may tighten hard limits, never relax them; do not edit imported engine files to customize a team's voice. Keep the project as the working directory so config/state/output belongs to it. If the request is unclear, select a lane using the user's intent rather than running every platform.
4. Execute using the current host adapter. Codex follows the imported root `SKILL.md`. Claude resolves plugin-root tokens to the imported path and follows the canonical command body. Read referenced files and supply the canonical humanizer instructions to a fresh agent when required. Never claim humanization ran if delegation was unavailable; preserve the draft as incomplete.
5. Use the upstream pipeline's scan, selection, drafting, review, state, and delivery rules. Keep `--dry-run` as the default until the user authorizes delivery. Platform reply posting remains governed by upstream's manual-posting rules. Configuring a destination is not authorization to send, schedule, or commit.
6. Report the actual lane results, upstream commit, output paths, and incomplete steps. Keep skipped lanes distinct from successful empty scans. Leave scheduling to explicitly requested upstream setup; don't invent Codex scheduler parity.

## Output template

The imported command owns the digest, brand report, configuration, and lane-specific output schemas. Return its artifacts without reformatting away required content. A short PB execution receipt accompanies them:

```markdown
# Buzz handoff receipt
Mode: <init | hn | reddit | ph | brands | daily>
Engine: <repository, branch, installed commit>
Host adapter: <Claude | Codex, verified path>
Window and source scope: <actual selection>
Execution: <completed | partial | blocked>
Artifacts: <actual paths, or none>
Review: <required upstream checks and real completion>
Delivery: <dry-run | explicitly authorized destination and actual result>
State: <actual upstream changes, or none>
Remaining prerequisite: <specific step, if any>
```

For `init`, show configuration and prerequisite status. Platform modes deliver the upstream digest. `brands` delivers the upstream mention report. `daily` includes lane-by-lane success, empty, failure, and skipped states. No receipt can substitute for the required output or review.

## Worked example

Fictional request: “Scan Hacker News for our configured buyer topics and make a draft PDF.” The adapter reads the installed `commands/buzz.md`, HN rubric, and required humanizer instructions, then forwards `hn --dry-run --pdf` in the user's repository. It reports the actual saved digest and PDF paths only if those files were produced.

If the import exists but a required humanizer cannot be invoked, the result says “Draft incomplete: required humanizer did not run,” keeps any upstream draft, and lists the missing capability. It does not invent a polished digest, post a reply, or say that a scheduler was installed. This illustration contains no real scan or platform result.

## Quality checks

- The installed revision and canonical files match the recorded import, with the current host adapter available.
- The selected upstream lane, rubrics, and agents were read and followed, including voice and platform rules.
- Product context informs configuration and relevance without becoming unsupported promotional copy.
- Dry-run, delivery, state, and scheduling outcomes match actual execution. Required review failures remain visible.
- No Buzz source, rubric, or agent is maintained as a second implementation inside Product Bench.

## Anti-patterns

- Treating a thin wrapper as permission to omit the upstream command's detailed workflow.
- Fetching the latest engine during every scan, silently replacing local edits, or calling an unchecked import current.
- Translating obsolete PB `scan/judge/draft` modes into a newly duplicated pipeline.
- Filling missing credentials, brand configuration, platform results, or agent receipts with plausible text.
- Calling a dry-run a delivered digest, or assuming setup authorizes recurring posts.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
