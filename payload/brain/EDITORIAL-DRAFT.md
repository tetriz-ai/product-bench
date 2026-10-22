# Imported content pipeline handoff

Product Bench supplies reviewed facts, approved sources, public-use permissions,
voice and output paths. Content Engine owns its full pipeline: Editorial Draft ← Blog
← Content Engine. Product Bench does not bundle these skill implementations.

## Resolve the actual upstream

Read doctor.integrations.content and its recorded repository, branch, revision and
skill links. Normal runs use that checkout without fetching. If not configured,
ask for the approved Content Engine clone URL; set `content_source.repository` and
optional `content_source.branch` in `<brain_dir>/config.json`. Do not guess an owner
or repository. This is a dependency location, not another team-voice questionnaire.
Preview `node <brain_dir>/runtime/product-bench.mjs content-install --target .`, then
apply the requested import with `--apply`. Import fetches the current configured
branch (default main), records the commit, and links all three native skills for
Claude Code and Codex. Import never scans, drafts, posts or schedules. Existing
clean imports refresh on `update --apply`; edited or rewritten histories stay protected.

Discover entrypoints through the host's installed skill/plugin catalog or actual
`.agents/skills/{content-engine,blog,editorial-draft}/SKILL.md` (Codex) and
`.claude/skills/{content-engine,blog,editorial-draft}/SKILL.md` (Claude Code).
Read the selected actual skill and referenced guides; resolve sibling resources
through its real upstream root. A mention here is not installation or execution.
Missing/unhealthy imports leave delegated phases pending. Do not silently substitute
a generic writer. Source preparation can continue without claiming engine execution.

## Caller inputs

Resolve the brain directory from `.product-bench-install.json`. Supply only declared
reviewed context, the exact authorized source scope, `<brain_dir>/runtime/payload/brain/VOICE.md`
and `context/brand-voice.md`, plus current preset/format choices and approvals. Team
voice overrides generic prose defaults; evidence and public-use permissions outrank
presets. Supply absolute config, bank/theme/archive and output paths in the caller
repository. Keep cwd there. Never write user state into the imported checkout.
Reuse existing Content Engine config; propose missing fields from reviewed inputs
and ask only for missing operational choices. No separate Editorial Draft setup interview.

## Dispatch

- `/pb-blog`: invoke imported Blog; it invokes its sibling Editorial Draft. Forward
  new/review-existing intent, evidence, outline decisions, voice and destination.
- `/pb-content-engine`: invoke imported Content Engine with the exact selected mode
  and arguments. Its root skill routes the canonical command and planning guides.
- `/pb-content-engine-weekly`: invoke its weekly guide; stop at the review packet and queue.
- Optional requested refinement for battlecards, briefs, narrative, sales scripts or
  changelogs: invoke imported Editorial Draft directly, forwarding the calling command's
  approved structure, preset and reviewer selection. Preserve all facts and caveats.

Respect the upstream approval, evidence, reviewer and publication contracts. Report
the recorded upstream revision, actual resource reads, execution method, output paths
and pending checks. Initial installation is not authorization for live sources,
delivery, scheduling, publication or Git actions.
