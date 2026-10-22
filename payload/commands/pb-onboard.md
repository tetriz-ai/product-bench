<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, decisions-log.md, roadmap.md, brand-voice.md, competitors.md, stakeholders.md, technical-constraints.md, gtm.md, metrics.md]
capabilities: []
-->

# /pb-onboard

Orient a teammate to an already configured Product Bench.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Role, team, and first task | Role-specific command tour, context/access status, and a first artifact or concrete next action |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Read GETTING-STARTED.md and COMMANDS.md from the configured brain directory; explain invocation in the current host.
2. Read the existing repository context and show stale or absent facts; teammates use the same reviewed files through the normal Git workflow.
3. Recommend workflows for the role, with inputs, outputs, and example prompts across product, GTM, sales, and analytics.
4. Follow the selected workflow for a first task when its prerequisites are met; route missing context or analytics configuration to pb-setup.

## Teammate access and first use

Context is reviewed team knowledge shared directly in the repository. Read the existing context files and report actual missing or stale facts. Teammates receive approved changes through the normal Git workflow and use the same context directory; no separate share or import is needed. Installation preserves existing context and shared configuration while adding local runtime files. If reviewed changes have not been committed or pulled, explain that concrete Git step; do not confuse it with missing business evidence or add another review gate. Source credentials and tool access still need verification in this session.

Use the role and first task to select a few commands, explain what to bring and what each produces, and begin the chosen workflow without repeating supplied answers. For orientation only, leave copyable example prompts and links to the installed guides. Describe analytics as fictional demo, verified live source, unchecked, or deferred; keep spec prerequisites and review gates explicit.

## Procedure

Orient a teammate to an already configured Product Bench and the complete shared product context. This is a role-specific guided tour, not a second setup restricted to the teammate's first task. Normalize PM/product manager, designer/UX, engineer/developer, and business/marketing/GTM/sales/content. Use the supplied role; ask only if it is unclear enough to change the tour. A first task is optional until orientation is complete.

Resolve the brain directory from the repo-root `.product-bench-install.json`. Read the current installed `<brain_dir>/runtime/payload/brain/GETTING-STARTED.md` and `<brain_dir>/runtime/payload/brain/COMMANDS.md`, plus any team-owned root guide notes, the declared context, and current configuration/status needed to explain available workflows. Use actual installed commands and modes; use only installed scripts, current commands, approved paths, and verified command counts.

### 1. Explain access and actual readiness

Reviewed context is shared directly in the repository. Teammates get it through ordinary Git access/clone/pull; there is no reviewed-summary sharing layer or separate context import step. Installation preserves existing reviewed context and shared configuration while adding local runtime files. If reviewed changes remain uncommitted/unpulled, name that concrete Git step; do not mislabel it as missing business data or create another review gate.

Explain which parts are repository knowledge and which are local credentials/runtime/output. Verify tools/source access in this session instead of inheriting another teammate's authentication. Report stale/absent context by observation date and topic, and distinguish missing business evidence from an unconfigured capability. Read the full declared context before routing into one task.

### 2. Product, people, and decisions tour

**Product in 60 seconds:** At most about 200 words covering what it does, whom it helps, current substitute, verified difference, and shipped vs proposed capability. Do not repeat an outdated acquisition motion, retired name, or unverified “unique moat” from an old command.

**Who we build for:** Use current research to explain actual persona groups/subtypes, their goals, strongest dated evidence/quotes, constraints, and relevant differences in buying/usage. Names and verbatims require the appropriate shared-context permission; anonymized research can be concrete without exposing identities. Distinguish observation from inference. Include the cross-cutting product/trust/adoption rules actually established here rather than importing another company's rules.

**Decisions worth knowing:** Curate up to 5 decisions most likely to constrain the teammate's work or be reargued: what was decided, why, evidence, owner/date, and revisit condition. Read actual declared decision/roadmap evidence; a blank log means a gap, not invented history. Link approved specs only when explicitly available in scope.

### 3. Explain the operating system and all major capabilities

Describe the sequence from evidence/problem → hypothesis/decision → concise spec → independent review → implementation/learning. Use an improvement workflow when a baseline and existing behavior are known. Explain the difference between procedural depth and concise deliverables: the commands perform rich reasoning without requiring an essay.

Give a one-line purpose for each current context area: product, users, competitors, stakeholders/buying path, constraints, decisions, roadmap, metrics, GTM, and brand voice when present. Show actual freshness/gaps and where reviewed updates go. Teach the source/claim distinction: a configured connection is not verified evidence, and a successful source check does not refresh an unchanged context fact.

Explain invocation in the current host using the actual installed guide. Provide copyable examples rather than assuming a slash command or native skill UI behaves identically in Claude and Codex. Optional integrations remain optional; Buzz uses the imported upstream skill/procedures and its recorded revision, while Content Engine externalization is still pending. Do not imply an unavailable content/SEO/document skill is bundled.

Show a few role-first commands, then make discovery of the whole command guide explicit:

| Role | Learn first | Regular use / why |
|---|---|---|
| PM | `pb-hypothesis`, `pb-spec`, `pb-review-spec`, `pb-improve` | Discovery/synthesis, scope, strategy, prioritization, metrics, and learning deposits. |
| Designer | `pb-uxr`, `pb-design-review`, `pb-brainstorm` | Evidence synthesis, behavior/state review, and collaboration on specs. |
| Engineer | `pb-tech-sync`, `pb-analytics`, `pb-spec`, `pb-review-spec` | Constraint freshness, measurable behavior, engineering handoff, and evals for AI work. |
| Business | `pb-gtm`, `pb-battlecard`, `pb-sales-call-prep`, `pb-sales-doc` | Competitor research, content/blog, deck review, pricing, briefs, and changelogs. |
| Everyone | `pb-compound`, `pb-sync-context` | Reviewed deposits after learning and scoped source refresh. |

Validate every recommended command/mode against `COMMANDS.md`; adapt the table if a command is absent or renamed. Do not overwhelm one role with every command, but explicitly show that the remaining capabilities are discoverable.

### 4. Teach workflows with inputs, outputs, and limits

Use short role-relevant sequences and one concrete example each:

- **New product work:** observed problem → hypothesis → scoped concise spec → independent review → next engineering artifact. Equivalent documented evidence can satisfy a prerequisite; no forced ritual or resurrected PRD.
- **Improvement:** existing behavior + baseline → improve → regression-aware independent spec review.
- **Design:** research question/session → UXR synthesis → design review → resolved behavior/decision. Use actual image/design connector capabilities or approved exports; a missing Figma connection does not prove design review is impossible.
- **Engineering:** verified technical context → spec/acceptance examples → feasibility and handoff questions → eval/rollout checks where needed. Specs are contracts to clarify, not silent authority to implement ambiguous assumptions.
- **Competitive sales:** account/stage → call prep or battlecard → buyer-specific document → material review → authorized delivery. Exact scripts and evidence fit matter more than feature lists.
- **Content:** verify `doctor.integrations.content` first: Content Engine, Blog and Editorial Draft are imported together locally, not bundled. If missing, offer the content capability step in `/pb-setup`, reusing the shared source config; orientation alone does not authorize installation. Then follow signal/theme evidence → approved brief → blog/write → editorial/claim/layout checks → separately authorized publication. Missing imports leave delegated phases pending; no second team-voice interview is needed.
- **Analytics:** decision → verified schema/definitions → query/result with numerator/denominator/window → interpretation and next decision. Saved definitions/dashboard are reusable verified queries, not copied numbers.

For each, state what the teammate should bring, what the command produces, and its next action. Distinguish fictional analytics demo, verified live source, unchecked source, and deferred setup. Do not call fixture output business data. If live analytics is wanted but missing, route to the setup capability phase with provider/access/schema/metric inputs, not a task-only reconstruction of business context.

### 5. Review system and common mistakes

Explain independent review: fresh sessions receive the spec and relevant approved context without the author's conversation; findings quote the artifact; clean differs from unverified; high-stakes clean verdicts need skeptical challenge; conflicting recommendations become explicit decisions. Improvements add regression risk. Failed/missing review capability leaves readiness pending. A self-check is useful but does not satisfy an independent gate.

Common mistakes: drafting from stale facts; treating a stakeholder request as proven need; guessing metrics or shipped behavior; omitting edge/permission states; overprescribing implementation; skipping customer/devil/regression concerns; ignoring a conflict; using the same buyer pitch everywhere; treating local output as shared context; claiming optional tools ran; letting draft/decision trails become unfindable. Recommend appropriate reviewed learning deposits, not automatic context writes/commits.

### 6. This week's actions and support

Give 3–5 realistic first actions tied to the role and actual gaps: read the relevant product/user/constraint/buying context, inspect a current approved artifact, try one small command with real inputs, verify one required capability, and identify the relevant owner. Use actual ownership from declared roadmap/stakeholder/decision context; if ownership is absent, say so and request an onboarding buddy rather than invent names. A source sync should not be promised to populate team workstreams unless its configured scope actually covers them.

Only after the context/capability tour, ask which first task the teammate wants to pursue if none was supplied. If one was supplied and prerequisites are met, begin the selected workflow without reasking prior answers. If orientation only was requested, leave copyable prompts and a concrete next action. Route missing business context to setup's full-context flow; missing tools to its capability phase. Orientation does not authorize invoking setup scripts, installing hooks, or creating schedules.

## Output template

```markdown
# Product Bench onboarding: [role]
Date: [date] | Host/invocation: [actual]

## Product and users
Product in 60 seconds: [current, sourced, ≤200 words]
Who we build for: [persona/subtype, observed pain, evidence/date, uncertainty]
Key decisions: [up to 5; decision/why/revisit/source]

## How this repository works
Shared context: [actual repo path and normal Git flow]
Local capabilities: [verified/unchecked/deferred; credentials not shared]
Context map and freshness: [one line per area, gaps]
Command discovery: [installed COMMANDS/GETTING-STARTED links]

## Commands for your role
| Field | Value |
|---|---|
| Command/mode | |
| Bring | |
| Produces | |
| When to use | |
| Copyable prompt | |

## Recommended workflows
[Role-relevant sequences plus analytics/GTM/content discovery.]
Review and common mistakes: [independence, pending gates, specific watch-outs]

## First actions this week
- [Read/inspect/try/verify/owner, 3–5 concrete steps]

## Team and first task
Ownership/support: [actual owner or gap]
First task: [chosen workflow underway or specific question after full tour]
```

## Worked example

Fictional illustration only. A new business teammate joins a repository with reviewed product/users/GTM context, an unchecked analytics connector, and no first task.

**Tour:** Explain current buyers and dated objections; show the prior decisions that constrain claims. Explain that the repository context is already shared and no context export is required.
**Role commands:** Start with sales-call-prep, battlecard, sales-doc, and deck-review; show blog/content and analytics in the full guide.
**Analytics:** “The source is unchecked. Verify access and schema before using numbers in a pitch.”
**First actions:** Read buyer objections, inspect an approved sales document, try a fictional call-prep prompt, and identify the commercial owner. Then ask for the first real task.

Weak: “Pick one task so we can build only the context needed for it.” Better: “Review the shared product, buyer, decision, and capability map, then choose the first task.”

## Quality checks

- All declared context areas are reviewed before routing to the first task.
- Role recommendations and invocation match the actual installed guide and modes.
- Persona/decision claims have current evidence; missing team ownership is not invented.
- Shared repo context, local operational output, credentials, and source verification are distinct.
- Product, sales/GTM, content, and analytics capabilities are discoverable with concrete prompts.
- The tour remains readable in about 15–20 minutes; detailed sources stay linked.

## Anti-patterns

Rebuilding only task-specific context; a giant undifferentiated command list; unverified positioning, roles, or decisions; obsolete PRD commands; extra share/import gates; fixture analytics treated as live; unapproved setup scripts; fake team names; assumed connector login; automatically changing context, hooks, or schedules during orientation.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
