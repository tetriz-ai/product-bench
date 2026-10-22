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
