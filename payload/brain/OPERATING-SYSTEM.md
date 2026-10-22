# Product Bench operating system

This folder belongs to the installing team. The public package supplies workflows; this folder holds your evidence and decisions. Treat anything unfilled as unknown. Never use fictional examples as claims about your company.

## First use

Run `/pb-setup` in Claude Code or ask Codex to run the Product Bench setup workflow. Learn the workflow map, build the full company context across all ten areas from approved sources, review cited changes, and configure sources and capabilities. Then choose and begin your first task. Read [GETTING-STARTED.md](GETTING-STARTED.md) for product, GTM, sales, analytics, and teammate-sharing paths; [COMMANDS.md](COMMANDS.md) lists every mode's inputs and outputs. `/pb-onboard` provides a later role-specific tour. A clean `doctor` checks installation health, not live analytics or context readiness.

Context is reviewed team knowledge shared directly in the repository. Commit approved context through the normal Git workflow; teammates pull and use those same context files. Installation preserves existing team context. No separate sharing or import step is needed.

## Working loop

1. Start a task with the shared preamble. Read only the command's declared context files. Surface stale, missing, or unsupported context.
   Apply the current shared writing rules in `runtime/payload/brain/VOICE.md` and the reviewed `context/brand-voice.md`. Follow the command's detailed procedure, output template, and quality checks; use its fictional examples for form only.
2. Use `/pb-compound` after a learning event. Keep a source and date for every new fact.
3. Run `/pb-sync-context` weekly or before major decisions. It proposes changes from registered sources and waits for selective review.
4. Review command drift when context changes. Store reusable execution lessons in `context/command-learnings.md`.

## Privacy

Context changes require review before writing and are eligible for version control. Repo scan and MCP access require explicit source scope. Do not store credentials, raw transcripts, raw customer datasets, or personal contact details in context. Describe the reviewed insight and keep a source pointer. Runtime files, generated outputs, sync state, and machine-specific install metadata stay gitignored. Commit and push only when authorized through the team's normal Git workflow.

## Context files

`product.md`, `users.md`, `technical-constraints.md`, `competitors.md`, `stakeholders.md`, `roadmap.md`, `decisions-log.md`, `gtm.md`, `metrics.md`, and `brand-voice.md` are the team-owned context. The demo is separate. A file with `Last updated: never` is missing context, not fresh context.

The brand example under `examples/` is fictional and should be replaced with approved team examples during setup.
