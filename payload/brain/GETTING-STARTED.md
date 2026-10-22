# Getting started with Product Bench

Start with `/pb-setup`. It introduces the available workflows, builds and reviews the full company context across all ten areas, and walks through source and capability configuration, including analytics. Then it asks what you want to accomplish first: write a spec, plan a launch, prepare a buyer conversation, explore analytics, or another task. Missing evidence stays explicit; context collection is not restricted to the first task.

## Run a command

In Claude Code, type the slash command followed by your request, such as `/pb-gtm Plan a launch for <feature> aimed at <buyer>`. In Codex, say `Read .codex/commands/pb-gtm.md and follow it to plan a launch for <feature> aimed at <buyer>`. The mode name is part of your request, not a separate CLI subcommand.

The local `product-bench` CLI handles installation, context-source state, and analytics execution. Agent workflows such as spec writing run in Claude Code or Codex. Resolve this folder from the repo-root `.product-bench-install.json`; examples below use `<brain_dir>` as a placeholder to replace with that path. Drafts go under `output_dir` from this folder's `config.json`.

## Choose a path after setup

| Outcome | Start here | Continue with | What you get |
| --- | --- | --- | --- |
| Develop an idea and write a spec | `/pb-idea Describe <idea> for <user>` | `/pb-hypothesis`, `/pb-scope-check selective`, `/pb-spec`, `/pb-review-spec` | A testable bet, concise build contract, and independent review |
| Design and test the behavior | `/pb-design-spec Document <design and decisions>` | `/pb-prototype`, `/pb-design-review` | Interaction states, rationale, and a testable representation |
| Research a product decision | `/pb-uxr pre Plan research for <decision>` | `/pb-uxr post`, `/pb-compound` | Research plan, evidence synthesis, and durable learnings |
| Plan a launch or acquisition motion | `/pb-gtm Plan <launch> for <buyer> toward <goal>` | `/pb-pricing`, `/pb-content-engine brief`, `/pb-blog` | Positioning, channels, launch sequence, measures, and content |
| Prepare for a buyer conversation | `/pb-sales-call-prep discovery Prepare for <account/use case>` | `/pb-sales-call-prep demo`, `/pb-battlecard` | Questions, demo path, objections, and competitive proof |
| Create sales material | `/pb-sales-doc one-pager Explain <verified value> to <buyer>` | `/pb-sales-doc leave-behind`, `/pb-deck-review sales` | A buyer-specific document and claim/layout review |
| Understand product performance | `/pb-analytics ask Explore <question> over <window>` | `schema`, `save`, `run`, `dashboard` modes | Executed analysis with methodology and reusable definitions |
| Set direction and priorities | `/pb-strategy Assess <bet> for <horizon>` | `/pb-roadmap`, `/pb-premortem` | Strategic choices, sequencing, and failure checks |

You can ask for a spec directly: `/pb-spec Specify <feature> using <hypothesis or decision>`. Hypothesis and scope-check are soft prerequisites under the default routing; absent artifacts produce a warning. `/pb-scope-check selective` helps choose the minimum useful scope. Keep the spec concise, with missing evidence labeled. Run `/pb-review-spec` or equivalent independent review before calling it ready. Review uses an authenticated host CLI, and unavailable reviewers leave the gate pending.

GTM needs a target buyer, business goal, verified capabilities, and launch scope. Sales needs deal context and proof relevant to that buyer. Approved summaries are enough to begin; web research, CRM, meeting sources, and document preview tools depend on what is connected in your agent session. Setup records what was actually verified and what remains unchecked.

## Make drafts sound like your team

Setup reviews your audience, terminology, approved claims, and writing examples in `context/brand-voice.md`, along with competitive proof, buying dynamics, and measurement definitions. Bring a few permitted examples and explain what you like or want to avoid. If you have none, setup can propose a short calibration draft from reviewed facts. Shared [writing rules](runtime/payload/brain/VOICE.md) supply defaults until your team reviews its own voice.

Each workflow’s canonical guide includes its reasoning steps, output template, fictional worked example, quality checks, and common mistakes. Writing and content-planning commands read their full guides from the imported Content Engine pipeline. Those examples teach the form; your actual output uses your reviewed context and task evidence. Detailed procedures should produce the right artifact for the audience: a field battlecard with usable scripts, a one-page brief, or a concise spec. They do not require long documents.

## Import the content pipeline

Setup offers to import the pipeline or record an explicit deferral after reviewing
company context. You can also ask `/pb-setup` to configure just this capability. On upgrades, the
current installed guide is `runtime/payload/brain/GETTING-STARTED.md`; your
team-owned root guide and company context are preserved.
Product Bench delegates to Content Engine, which contains the full Blog workflow
and Editorial Draft writing/editorial resources. None of those three skills is bundled
with Product Bench. There is no additional Editorial Draft account or voice interview.

Import requires Git, `python3` (Python 3.9+ for Content Engine), and access to the
approved upstream repository. Merge this key into this folder's `config.json`,
keeping the existing settings and replacing the URL placeholder:

```json
{
  "content_source": {
    "repository": "<Content Engine Git clone URL>",
    "branch": "main"
  }
}
```

From your project directory, replace `<brain_dir>` with the installed brain path:

```sh
node <brain_dir>/runtime/product-bench.mjs content-install --target .
node <brain_dir>/runtime/product-bench.mjs content-install --target . --apply
node <brain_dir>/runtime/product-bench.mjs doctor --target .
```

Preview shows the configured branch head; apply fetches the branch head and records
its exact revision. Verify `integrations.content.status: installed`, its revision
and all three skill links for both hosts. Read the selected actual skill and guides;
[the handoff](runtime/payload/brain/EDITORIAL-DRAFT.md) explains passing reviewed voice,
evidence, source permissions and output paths. Caller configuration, signal banks,
themes and drafts stay in this repository. Each teammate imports locally from the
shared source configuration.

Normal runs use the recorded commit; `update --apply` refreshes clean imports.
An unset source, missing prerequisite, edited checkout or failed fetch remains an
explicit blocker. If deferred, unrelated workflows and plain-English structural
checks can continue; delegated content and Editorial Draft reviewer passes stay pending.
Importing does not scan, publish, deliver or schedule.

## Set up analytics

Choose a fictional demo, a live provider, or defer analytics. The default `fixture` needs no credentials and teaches the flow with fictional events; it cannot measure your product.

```sh
node <brain_dir>/runtime/product-bench.mjs analytics --target . --metric activation_rate
```

For live data, review changes to the `analytics` object in this folder's `config.json`, preserving other settings. Never put credentials in that file or context. Supported providers are:

| Provider | Config fields | Local access required |
| --- | --- | --- |
| BigQuery | `provider: "bigquery"`, `project`, `max_bytes` | Installed/authenticated `bq` CLI and read-only access to the selected dataset |
| PostgreSQL | `provider: "postgres"` | Installed `psql`; `PGHOST`, `PGUSER`, and database/auth settings in the local environment or credential manager; read-only database role |
| PostHog | `provider: "posthog"`, `project`, `host` | `POSTHOG_PERSONAL_API_KEY` in the local environment, with read-only query access; use your project's HTTPS origin |

Choose a dataset and question, verify schema and field meanings through authorized tools or supplied schema, and review a single SELECT/WITH query. Use aggregate results, a bounded window and row limit; use provider permissions and cost controls. The CLI SQL check is not a security boundary. Run the approved query from the host repository:

```sh
node <brain_dir>/runtime/product-bench.mjs analytics --target . --sql-file ./approved-query.sql
```

Verify execution, provider, data timestamp, units, numerator/denominator, and limitations before calling live analytics ready. `doctor` alone does not verify live access. If a tool or credential is missing, record the remaining step and continue another path. Live adapters remain experimental integrations requiring verification in your environment.

Then ask `/pb-analytics save` to save a verified definition, `list` to discover saved reports, `run` for fresh results, or `dashboard` for a group with a consistent window. `account-health` requires configured diagnostic dimensions and their sources; it does not automatically connect a CRM. The seven guides in [runtime/docs/analytics/](runtime/docs/analytics/) explain schemas, funnels, retention, segmentation, and reporting.

## Connect Buzz from its upstream repository

For optional Buzz, set `buzz_source.repository` to the approved engine clone URL in `<brain_dir>/config.json`; `buzz_source.branch` defaults to `main`. No repository is configured by default. `doctor` reports `not_configured` with the exact setup path. Existing imports retain their recorded repository and branch.

`/pb-buzz init` imports the Buzz engine from the configured upstream branch and records its commit, reuses reviewed Product Bench context
for its configuration proposal, and follows upstream setup. Then use
`/pb-buzz hn --dry-run --pdf` (or ph/reddit/brands/daily). In Codex, ask the agent to
follow pb-buzz; the imported native skill can also be invoked as `$buzz-engine`.

The upstream repo owns all commands, rubrics, humanizer, scanners, and scheduling guidance.
The local import needs repository access and is reported by `doctor`. Each teammate imports
it separately. `product-bench update` checks for upstream fixes; `update --apply` refreshes
clean imports and preserves edited or incompatible checkouts. Normal Buzz runs use the
installed version without fetching. Missing imports or tools are explicit blockers, not a fallback to duplicated
PB logic. Initial setup and scans do not authorize Slack posts or recurring schedules.

## Find your next command

[COMMANDS.md](COMMANDS.md) lists every workflow's purpose, modes, inputs, and outputs. `/pb-onboard` gives a role-specific tour and first actions for a teammate. To revisit missing context or configure analytics later, rerun `/pb-setup` with that goal.

Use `/pb-compound` after a learning event; use `/pb-sync-context` for registered sources. Context is shared in the repository. Review context changes before saving and review drafts before publishing.

## Use context with your team

Context under `<brain_dir>/context/` is the team's shared repository knowledge. Every proposed change is reviewed before it is written. Commit reviewed context alongside the product work using your normal Git workflow; teammates receive and use the same files when they pull. There is no separate share, export, or import step.

Teammates clone or pull the repository and install Product Bench using the team's brain directory. Installation preserves existing context and configuration and adds the local runtime. Run `/pb-onboard` for a role-specific tour; setup is needed only for new context, sources, or capabilities. Source credentials and connections remain local and must work in each agent session.

Runtime files, generated outputs, sync state, and machine-specific install metadata are gitignored. Context, shared configuration, and source definitions are eligible for version control. Keep credentials, raw transcripts, and raw customer datasets outside context; save reviewed insights and source pointers instead. Writing approved context does not automatically commit or push it.

For older installations, `product-bench update` previews removal of the installer's blanket brain ignore rule; `update --apply` replaces it with the local-file rules and preserves context. Check your repository's other ignore rules if context still does not appear in Git. Workflows read `<brain_dir>/context/` directly.
