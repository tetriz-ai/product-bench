# /pb-setup — guided setup and first use

Read `pb-_preamble.md`, but treat unfilled context as the reason for this workflow rather than a blocker. Read the install config to resolve `brain_dir`.

## Introduce the system

Read the current installed guides at `<brain_dir>/runtime/payload/brain/GETTING-STARTED.md` and `<brain_dir>/runtime/payload/brain/COMMANDS.md`. Root brain guides are team-owned and preserved by updates; read any team notes there as supplemental context without treating older dependency instructions as current or overwriting those files. Explain that Product Bench can write specs, plan launches, prepare sales conversations and documents, research users and competitors, and answer analytics questions. Show the short workflow map from the guide, including examples and how to invoke commands in the current host. Do this before collecting context; do not make users finish a company questionnaire to discover what they can do.

Explain the setup sequence: build and review the full company context, configure sources and capabilities, then ask what the user wants to accomplish first. A stated task can be remembered for the handoff, but must not narrow context collection. Do not ask the user to choose a first task yet.

## Build the full company context

Cover all ten areas: product, users, technical constraints, competitors, stakeholders, roadmap, decisions, GTM, metrics, and brand/voice. Setup builds the shared foundation for every workflow, regardless of the user's role or anticipated first task. For each area, use this order:

1. Ask which host-repository paths may be inspected. Scan approved code, docs, schemas, and past artifacts. Cite file paths and lines for proposed facts. Do not scrape `.env`, secrets, raw customer datasets, or unrelated personal files.
2. Discover available MCP tools that could supply missing evidence. Name the source, scope, and intended target context file. Ask which sources the user authorizes. If a requested source is not connected, give tool-specific connection steps when known and leave it unchecked.
3. Offer to read user-pointed files or folders. If they live outside the repository, explain that teammates will need a shared source or a reviewed summary.
4. Ask targeted questions for remaining gaps. Do not use the fictional demo as company truth.
5. Show a proposed context diff with a source and observation date for every factual statement. Mark assumptions and missing data. Ask the user to review before writing each area.
6. Register every approved recurring source in `<brain_dir>/sources.json`. Use `node <brain_dir>/runtime/product-bench.mjs source-add --target . --file <source-json>`; the file must contain `id`, `kind`, `scope`, `targets`, and optionally `capability`, `server_hint`, `cadence_days`, and `owner`. Do not store credentials. For an MCP source, store a logical capability and optional server hint, then test actual availability in each agent session.
7. Run `doctor`. Suggest `/pb-sync-context` only after at least one source is configured; suggest `/pb-compound` for a single manually supplied learning.

Context is shared team knowledge stored directly in the repository. Review every proposed context diff before writing; approved context is ready for the normal Git workflow without a separate sharing step. Keep credentials and raw sensitive data outside context. Runtime files, generated outputs, sync state, and machine-specific install metadata stay gitignored. Do not commit or push without authorization.

Keep a coverage checklist for all ten areas, recording reviewed facts, remaining questions, source status, and the next step for each gap. Do not skip an area because it is unrelated to a first task. If evidence or access is unavailable, ask the remaining targeted questions and leave explicit unknowns; mark an area deferred only when the user defers it. Do not fabricate completeness.

### Collect the inputs that make outputs specific

Use the following as a coverage rubric, not a questionnaire to dump on the user. Extract what approved sources already answer, then ask only consequential gaps in small related batches. Keep source pointers and contrary evidence. These are reusable company facts; a particular deal or feature is still scoped in its command.

| Context area | Capture for command quality | How it will be used |
| --- | --- | --- |
| Product | Customer job, current workflow, shipped vs proposed behavior, differentiating mechanism, limitations, substitutes, and proof | Specs describe real behavior; sales and content use defensible claims. |
| Users | Segments, job and trigger, pain and workaround, desired outcome, adoption friction, anonymized permitted verbatims, and counterexamples | Hypotheses and research connect an observed problem to an outcome. |
| Technical constraints | Verified architecture and interfaces, permissions and data boundaries, instrumentation, scale, reliability limits, and unresolved questions | Build contracts cover feasible behavior without inventing a stack. |
| Competitors | Named alternatives including doing nothing, buyer fit, strengths and weaknesses, observed capabilities, source/date, confidence, and switch costs | Competitive research supports honest field scripts and proof questions. |
| Stakeholders | Buyer/user/champion/approver roles, buying process, evaluation criteria, recurring objections, proof permissions, and owner roles | Sales commands pick an angle and a next step for the actual buying path. |
| Roadmap | Outcomes, committed vs optional bets, capacity evidence, dependencies, owners by role, and revisit triggers | Sequencing shows opportunity cost without invented dates. |
| Decisions | Question, alternatives, choice, evidence, rationale, status, and supersession/revisit condition | Commands don't re-argue settled decisions or mistake old choices for current ones. |
| GTM | Beachhead, customer trigger, positioning, acquisition/sales motion, operating channels, approved message/CTA, launch goals, and enablement gaps | Launch plans and editorial briefs use channels the team can operate. |
| Metrics | Formula, numerator/denominator, actor/event, cohort/window, baseline and source, quality guardrails, access, gaps, and owner | Analytics, evals, pricing, and specs distinguish measurements from guesses. |
| Brand/voice | Audience-specific tone, preferred/retired terms, prohibited claims, approved proof permissions, good/bad examples, spoken scripts, and permitted visual assets | Every command applies reviewed voice and shows concrete, usable writing. |

### Establish voice and proof before external drafts

Load `<brain_dir>/runtime/payload/brain/VOICE.md`. Explain that it supplies shared writing defaults, while `context/brand-voice.md` holds the team's choices. Ask for 2 or 3 owned or permitted examples across relevant formats, such as a release note, sales script, executive brief, or article. If none exist, draft a short calibration example from reviewed facts and have the user review its voice. Keep it labeled as a draft until accepted.

Record what makes each example work: reader, tone, vocabulary, specificity, paragraph rhythm, and claims to avoid. Capture a before/after pair, a word-for-word spoken response to a recurring objection, and the evidence behind its claim. A slogan, invented metric, or fictional sample cannot stand in for product proof. When the user defers voice, record that explicitly and use shared defaults without pretending team calibration is done.

For sales and editorial work, distinguish internal evidence from externally referenceable proof. Record the approved scope for customer quotations, references, and numerical claims; omit unapproved references from external drafts. Capture approved theme/assets and output-format preferences. On an existing installation, propose only missing sections in reviewed context instead of replacing the team's files with new templates.

## Configure sources and capabilities across the system

Distinguish reviewed context, registered sources, and verified working tools. A clean doctor report checks installation health; it does not prove company context, live analytics, or every workflow is ready.

Walk through product, GTM, sales, content, and analytics capabilities during setup, regardless of the first task. Explain requirements and verify available tools; record missing access or explicit deferrals. Collect company-level context here. Feature-specific launch details, individual deal inputs, and spec hypotheses belong to the later selected workflow.

Read the relevant installed command's detailed procedure when describing a capability. Explain its concrete output shape and quality gate, not only its name. Record a small capability matrix: workflow family, required evidence, optional tool/skill, verified availability, fallback, and remaining limitation. Browsing, independent agents, design inspection, document rendering/preview, analytics execution, and upstream engines are separate capabilities. Verify the bundled skills are present. Their instructions do not establish access to SEO data providers, browser/PDF runtimes, design connectors, or CRM integrations. Installation includes the bundled skills automatically; setup collects reviewed team inputs and checks actual external tool availability, rather than asking users to install or configure each skill. Content Engine, Blog and Editorial Draft are imported together from the approved upstream repository, following the same source/import/update flow as Buzz. Follow the dedicated content capability step below, including an explicit import offer or deferral; do not guess its source. Editorial Draft requires no separate configuration questionnaire: discover the imported skill automatically and pass command presets plus reviewed team voice through `<brain_dir>/runtime/payload/brain/EDITORIAL-DRAFT.md`. A missing engine is a software dependency, not missing team context. Blog and Content Engine LinkedIn require it for writing; other content preparation continues without it. Use a command's portable procedure only where its contract permits; leave required engine phases and tool-dependent checks pending when they cannot run.

- Product: explain `/pb-idea` → `/pb-hypothesis` → `/pb-scope-check selective` → `/pb-spec` → `/pb-review-spec`. Hypothesis and scope-check are soft prerequisites under the default spec routing; missing artifacts produce a warning. Keep specs concise and missing evidence labeled. Explain that independent spec review needs an authenticated Claude Code or Codex CLI; keep readiness pending if unavailable.
When naming bundled skills or stating their counts, read `<brain_dir>/runtime/payload/skill-catalog.json` and verify its entries in the current host's skill directory. Count all declared `seo-*` entries, including `seo-memory-management`; a missing entry is an installation gap, not a smaller bundle. Keep additional team-installed skills separate from the bundled inventory. If the inventory cannot be read, mark the count unchecked rather than guessing.

- GTM: collect the buyer segments, use cases, verified product proof, business goals, channels, and measurement definitions. Explain `/pb-gtm`, `/pb-pricing`, `/pb-content-engine`, and `/pb-blog`. GTM drafts can start with approved input; content delegation needs the import below. Configured web/MCP sources are needed only for work that depends on them.
- Sales: collect the sales motion, buyer roles, buying process, common objections, and verified proof from approved summaries or authorized sources. Explain `/pb-sales-call-prep` modes, `/pb-battlecard`, `/pb-sales-doc` modes, and `/pb-deck-review`. A CRM connection is optional; do not imply one is required or connected. Explain document preview requirements and verify available preview tools.
- Buzz: explain `/pb-buzz init` and its hn/reddit/ph/brands/daily modes. Import the current upstream main when requested and record its resolved commit, follow its setup with reviewed context, and verify both host adapters. Each teammate needs upstream repository access. Missing imports, credentials, or delegation tools remain unchecked. Configure delivery or recurring runs only when explicitly requested.
- Analytics: always explain the fictional fixture versus live data. Offer the fixture demo, live setup, or explicit deferral. Follow the analytics setup section in `<brain_dir>/runtime/payload/brain/GETTING-STARTED.md`: preview config changes, preserve unrelated settings, keep credentials outside the brain, verify the source and schema, and execute a bounded aggregate query. If access is missing, give the exact remaining steps and mark live analytics unchecked. Never use fixture output to answer a company question. Offer `/pb-analytics` ask, save, run, list, schema, dashboard, and account-health as appropriate.

### Set up the content pipeline or record its deferral

Always explain that Product Bench delegates `/pb-content-engine` and its weekly workflow to Content Engine, `/pb-blog` to its Blog skill, and writing/editorial review to Editorial Draft bundled in that same upstream repository. These three skills are not bundled with Product Bench. Offer to import them now or explicitly defer; do not wait for the user to know the dependency name. This capability step follows the full context review and does not narrow it to a first task.

1. Read `<brain_dir>/runtime/payload/brain/EDITORIAL-DRAFT.md` and run `node <brain_dir>/runtime/product-bench.mjs doctor --target .`. Inspect `integrations.content`, not only `ready`.
2. For `not_configured`, obtain the approved Content Engine clone URL if it was not supplied. Propose `content_source.repository` and optional `content_source.branch` (default `main`) in `<brain_dir>/config.json`, preserving all other settings. Reuse the reviewed URL and existing import record; never guess an organization or ask again for supplied approval. For `not_installed`, reuse that source. Import requires Git, `python3` (Python 3.9+ for Content Engine), and repository access.
3. When import is requested, preview `node <brain_dir>/runtime/product-bench.mjs content-install --target .`. Show its source, branch, resolved revision and destination. Apply the authorized import with `node <brain_dir>/runtime/product-bench.mjs content-install --target . --apply`; it fetches the branch head at apply time and records the exact commit. Initial import does not run a writer or require another Editorial Draft account/voice interview.
4. Rerun doctor. Verify `integrations.content.status` is `installed`, a recorded revision exists, and all `content-engine`, `blog`, and `editorial-draft` links for both hosts resolve. Read their actual `SKILL.md` entrypoints through `.agents/skills/` in Codex or `.claude/skills/` in Claude Code. Reuse a healthy existing import without fetching. For `unchecked`, an edited checkout, foreign skill directory, missing prerequisite or failed fetch, report the concrete blocker and preserve local files; do not call it verified or replace it with a generic writer.
5. Record content as verified, blocked with the exact remaining step, or explicitly deferred in the capability matrix and launchpad. Unrelated product/GTM/sales work can continue; delegated content modes and Editorial Draft reviewer passes remain pending without a healthy import. Bundled plain-English structural checks can still run. Pass reviewed team voice, claims, source scope and caller output paths through the shared handoff; preserve existing Content Engine configuration and keep state outside the imported checkout.

Each teammate imports the engine locally from the shared source configuration. Normal runs use the recorded revision; `update --apply` refreshes clean installed imports. Unrelated workflows do not require this import. Importing does not authorize live scanning, delivery, scheduling, publication or Git writes.

## Start the first task and leave a launchpad

If teammates will use the system, explain that they receive the reviewed context through the normal repository commit/push/pull workflow and read the same context directory directly. Installation preserves existing team context. Link the team section in GETTING-STARTED.md; do not propose an additional export/import or sharing review. Verify the relevant files rather than labeling repository storage itself [NEEDS DATA].

After covering all ten context areas and the capability setup, show the reviewed coverage checklist and remaining gaps. Then ask what the user wants to accomplish first: write a spec, plan GTM, prepare for a sale, explore analytics, or another task. If a task was already supplied, use it for the handoff now. If the user only wants setup, leave the launchpad without starting another workflow.

Once the user chooses a task, follow its installed command and preamble in this session when its prerequisites are met. Carry over approved inputs so the user does not repeat answers. Do not merely tell them to rerun that command. If a prerequisite is missing, complete the available prerequisite work or provide a ready-to-use invocation and the specific blocker. Do not start unrelated workflows or publish drafts.

Finish with a concise launchpad, even if setup was partial:

1. Coverage of all ten context areas, reviewed facts and remaining gaps, with source/tool status: verified, unchecked, or explicitly deferred; include the content import status, recorded revision or exact blocker/deferral.
2. The first artifact and its path under the configured output directory, or the exact input/access still needed to create it.
3. Three relevant next commands with concrete example prompts and expected outputs; include the spec path and make GTM, sales, and analytics discoverable.
4. Links to the current `<brain_dir>/runtime/payload/brain/GETTING-STARTED.md` and `<brain_dir>/runtime/payload/brain/COMMANDS.md`, plus any team-owned guide notes, and `/pb-onboard` for a teammate or a later command tour.
5. `/pb-compound` for new learnings and `/pb-sync-context` when sources are registered.

Do not describe deferred context or unverified integrations as completed setup. Rerunning setup should reuse reviewed context, check coverage across all ten areas, and address missing or stale facts before the task handoff. Honor an explicit request for a narrow repair without changing the full-context default for first-time setup.
