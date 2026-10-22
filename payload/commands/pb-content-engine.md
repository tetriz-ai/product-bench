<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, competitors.md, gtm.md, brand-voice.md]
capabilities: [imported content-engine required, web or MCP optional]
-->

# /pb-content-engine

Turn market signals into reusable content themes.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| scan | Approved sources, topics, period | Deduplicated signal bank with citations |
| cluster | Signal bank and existing theme inventory | Evidence-based clusters with intent, demand, duplicates, and novelty decisions |
| inventory | Approved published content and product claims | Content inventory, verification gaps, and ranked action candidates |
| competitor-gaps | Approved competitor content, search questions, and own inventory | Sourced buyer-question gaps with fit and proof requirements |
| refresh-plan | Existing content, changed evidence, and review priorities | Prioritized refresh plan with claim changes, owner, effort uncertainty, and success check |
| brief | Selected signals and audience | Theme brief with angle, proof, counterpoint, and formats |
| write | Approved brief and format | Sourced draft and publication checklist |

If no mode is named, use `scan`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Use configured sources only.
2. Do not treat discussion volume as demand.
3. Preserve original source links and evidence strength.

## Source boundaries

Carry the approved source scope through scan, brief and write. Persist the signal bank and brief for later modes. A citation or quotation in an approved source does not authorize opening its linked source file. If proof is missing within the approved scope, label the gap rather than expanding the read scope. Read only declared context dependencies.

## Upstream handoff

Read `<brain_dir>/runtime/payload/brain/EDITORIAL-DRAFT.md` for dependency resolution and
the caller-input contract. Resolve doctor.integrations.content and its recorded
commit. Invoke the actual imported **Content Engine** instructions; read their selected
guide, templates, examples, reviewer resources and anti-patterns in full. The upstream
owns the implementation. Product Bench supplies reviewed context and permissions.

Forward the exact selected mode: scan, cluster, inventory, competitor-gaps, refresh-plan, brief or write. Carry source scope unchanged between modes. Reuse supplied approvals and reviewed team voice. Keep the working directory
and durable state in the user's repository; engine resources resolve under the
imported checkout. Missing or unhealthy imports leave delegated execution pending.
Do not silently substitute a generic writer or claim a review/metric/tool ran.

Report the upstream revision, approved read/write scope, actual outputs, partial
failures and pending decisions. Publication, delivery, scheduling and Git actions
require the authorization stated by the user and the upstream workflow.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
