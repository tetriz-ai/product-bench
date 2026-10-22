// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
// Shared workflow guidance embedded in generated command files.
export const details = {
  onboard: `## Teammate access and first use

Context is reviewed team knowledge shared directly in the repository. Read the existing context files and report actual missing or stale facts. Teammates receive approved changes through the normal Git workflow and use the same context directory; no separate share or import is needed. Installation preserves existing context and shared configuration while adding local runtime files. If reviewed changes have not been committed or pulled, explain that concrete Git step; do not confuse it with missing business evidence or add another review gate. Source credentials and tool access still need verification in this session.

Use the role and first task to select a few commands, explain what to bring and what each produces, and begin the chosen workflow without repeating supplied answers. For orientation only, leave copyable example prompts and links to the installed guides. Describe analytics as fictional demo, verified live source, unchecked, or deferred; keep spec prerequisites and review gates explicit.`,
  buzz: `## Upstream import and handoff

Resolve the installed import and recorded commit from doctor.integrations.buzz. Normal runs use that checkout without fetching. Setup/import resolves the configured branch (default main); product-bench update previews upstream changes, and update --apply refreshes clean imports. If doctor reports not_configured, ask for the approved engine clone URL and set buzz_source.repository plus optional buzz_source.branch in <brain_dir>/config.json. Do not guess a repository. Existing imports retain their recorded source. If absent but configured, preview node <brain_dir>/runtime/product-bench.mjs buzz-install --target . and explain its upstream repository/branch and resolved commit; apply the requested import with --apply. A modified, mismatched, or unavailable checkout is a blocker; require the canonical upstream engine before executing Buzz.

Read the imported README and SETUP plus commands/buzz-init.md for init, commands/buzz.md for hn/reddit/ph/brands, or commands/buzz-daily.md for daily. In Codex, follow the imported SKILL.md host adapter and use the upstream native skill. In Claude, resolve each CLAUDE_PLUGIN_ROOT reference to the quoted absolute import path and follow the same upstream command. If the upstream plugin is loaded, use its humanizer agent; otherwise supply agents/humanizer.md and the upstream dispatch inputs to a fresh host agent session. Missing delegation tools leave required drafts incomplete. Keep the working directory at the user's repository. Upstream /buzz calls reuse its command file, not another PB workflow.

Use reviewed product, GTM, and voice context as input to proposed Buzz configuration; collect missing channel/account/timezone inputs without inventing them. Preserve an existing buzz/config.yaml unless replacement is explicitly requested. The import's command bodies, rubrics, voice, humanizer and scanners are the only implementation. Execute the selected canonical mode directly; do not maintain a second pipeline.

Forward the requested mode and arguments. Default scans and daily runs to --dry-run until Slack delivery is explicitly authorized; the initial import does not authorize posting, scheduling, committing, pushing or merging. Configure recurring runs only when requested. Platform posting stays manual under the upstream contract. Report the upstream revision and actual output paths.`,
  'content-engine': `## Source boundaries

Carry the approved source scope through scan, brief and write. Persist the signal bank and brief for later modes. A citation or quotation in an approved source does not authorize opening its linked source file. If proof is missing within the approved scope, label the gap rather than expanding the read scope. Read only declared context dependencies.`,

  'design-spec': `## Verification artifacts

If you deliver an executable check, run its final saved version from the documented working directory after all edits. Resolve source paths relative to the script's actual saved location, or accept an explicit input path. Save the real command and result; an earlier scratch run does not verify a subsequently moved or edited script.`,

  'grill-me': `## Sequential interrogation

Ask one consequential question, wait for its answer, then resolve that branch before asking the next. A complete retrospective table does not establish that an interrogation occurred. Keep an ordered question/answer record with answer sources. When an answer is unavailable, mark the unresolved dependency and stop or choose the next independent branch.`,
  analytics: `## Execution guide

For ask, restate the decision and define actor, event, cohort, window, unit, exclusions, and comparison. Read the verified schema and metric definitions. Execute through the configured adapter and report the query, provider, timestamp, numerator, denominator, and limitations. The fixture is fictional and cannot answer a real product question.

For save, inspect the definition and use analytics-save with the actual installation target. Verify it appears in analytics-list for that same target and can be run there; do not create a shadow installation to bypass a missing permission. For run, use analytics-run; never reuse a pasted old result. For list, use analytics-list. For dashboard, run a reviewed list of definitions with one window, then reconcile units and denominators. For schema, verify field meanings against instrumentation. For account-health, define diagnostic dimensions and sources first; mark missing dimensions unavailable. Read the seven analytics guides for nontrivial work. Never paste raw personal records into summaries.`,

  compound: `## Learning deposit

Identify the event that changed understanding, its observation date, source, scope, and uncertainty. Search existing context for the claim before editing. Prepare the smallest diff that preserves contradictions and does not count duplicate retellings as independent evidence.

Show proposed context edits and which Last updated dates would change; a decision-log entry only if a real decision was made; and a command-learning proposal only if the workflow should behave differently next time. Ask for review before writing. A successful source check alone does not refresh a context timestamp.`,

  'sync-context': `## Source sync procedure

Read the registry and sync-status. For a repo or local source with explicit paths, run source-pull; inspect each changed file before proposing factual context. For MCP or web, verify the capability works in this session and that its approved scope still applies. Fetch every page. Use an overlap window for incremental feeds or a full-scan hash without cursors. A failed or partial fetch stays unchecked.

Stage a complete batch with stable object ID, version, citation, date, target, and summary. Before editing any context, persist the exact proposed diff in the output directory and display its contents in a separate tool result or message before the edit. Writing a diff file alone is not a displayed preview. Show pending proposals grouped by target and source, including contradictions and removals. Review each separately. Apply an accepted context diff first, then mark it accepted with sync-decide --applied. Reject irrelevant proposals explicitly. Leave unresolved ones pending. End with changed context files, actual freshness dates, unavailable sources, and command drift candidates.`,

  spec: `## Build contract

Start from a selected hypothesis or equivalent decision. State the user-visible change. Define actors, triggers, inputs, outputs, states, errors, permissions, and retention where they affect behavior. Include acceptance examples for the main path and a failure or boundary path. Link constraints to their source.

Separate product behavior, interface content, integration contracts, and evaluation/rollout checks. Leave mechanism open unless a verified constraint forces it. Finish with unresolved decisions and evidence needed to close them. Keep the document concise; do not expand it into a full PRD. Run review-spec or equivalent independent review before calling it ready. An unavailable or failed review leaves it a draft.`,

  'review-spec': `## Review lenses

Read the artifact, its evidence, and relevant context. Apply the required customer, functional, platform-data, scope-altitude, measurement, devil, engineering, engineering-handoff, naive-reader, and consistency lenses independently. The cold reader gets the artifact alone. For an improvement, add regression risk. Add GTM and support readiness when the launch scope calls for them.

For each finding, cite a passage or missing section, severity, consequence, and correction. Separate defects from preferences. Preserve conflicting advice in a conflict map. In default mode, run each lens in a fresh independent session; in auto mode, run the independent sessions concurrently. Save each original finding and execution receipts before synthesizing. Do not reuse a reviewer conversation across lenses. An installed CLI adapter is available: node <brain_dir>/runtime/review-lenses.mjs --host claude|codex --input <artifact.md> --out <output-dir>/lenses --lenses customer,functional,platform-data,scope-altitude,measurement,devil,engineering,engineering-handoff,naive-reader,consistency --skeptic --parallel 1 (default) or --parallel 7 (auto). Add regression and conditional risk lenses to the explicit list when applicable; use repeatable --evidence FILE for specifically approved supporting artifacts. The adapter's legacy seven-lens default is not the complete command review plan. This requires the chosen authenticated host CLI and permission to invoke it. Read execution.json and each lens artifact; any failed reviewer leaves the gate incomplete. Never treat a fabricated parallelism claim as a receipt. Tie the readiness verdict to unresolved severe findings.`,

  'sales-call-prep': `## Demonstration and proof

For demo, run the supplied shipped behavior with representative inputs and persist expected/actual results. Clearly label proposed behavior as a concept; do not imply it was shipped or demonstrated earlier. For evaluation, attach actual verification evidence where available, distinguishing observed permissions from desired rules and future tests. Missing proof remains a blocker, not a claim of successful verification.`,

  'sales-doc': `## Document preview

Deliver correctly rendered Markdown/HTML or an available configured document format. For basic headings, paragraphs, lists, tables, links and code, the installed dependency-free renderer is available: node <brain_dir>/runtime/render-document.mjs --input <source.md> --output <document.html>. A heading ends at its line break; do not accidentally render the following paragraph as part of the heading. For one-pager, create a printable single-page layout with readable text and a concrete ask. Inspect the actual rendered layout with an available preview tool and save the preview receipt. Parsing HTML structure alone is not a visual preview. If the host lacks preview tools, hand the file to the configured review/preview stage and keep layout verification pending until that stage runs. Do not claim a PDF, page count or screenshot inspection without evidence.`,

  strategy: `## Strategy procedure

Define horizon, business objective, target customer, and alternatives. Summarize dated product and market evidence. Describe the customer's job and the current substitute. State the advantage the team can credibly build, the choices it will make, and opportunities it will decline.

For each bet, include mechanism, capability, evidence, leading signal, failure signal, cost, and dependency. Tie GTM to the chosen customer and verified behavior. Show a plausible counterstrategy and a trigger for revisiting the plan.`,

  gtm: `## Launch plan

Confirm what has shipped or is committed and which claims have proof. Choose a primary buyer and use case. Write positioning around problem, substitute, differentiated mechanism, proof, and limitation. Map the buying process and channels the team can operate.

Sequence preparation, limited validation, launch, and follow-up. Assign owners and evidence. Define acquisition, activation, and learning measures with units and windows. Prepare objections, sales enablement, support readiness, and feedback intake appropriate to launch size. Mark unverified proof as needing data; never fabricate testimonials or traction.`,

  uxr: `## Research procedure

For pre, state the decision, learning objective, participant criteria, consent handling, neutral questions, probes, and synthesis plan. Avoid leading participants toward a feature answer.

For post, separate participant statements, observed behavior, and analyst inference. Preserve source pointers and dates while removing identifying details from shared summaries. Describe themes with supporting and contradicting cases. For journey, map stages, goals, actions, friction, workarounds, and evidence gaps. End with the next research or product decision, and deposit durable learning through compound.`
};
