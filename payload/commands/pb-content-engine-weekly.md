<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [gtm.md, brand-voice.md, product.md, users.md, competitors.md, metrics.md]
capabilities: [imported content-engine required]
-->

# /pb-content-engine-weekly

Run the weekly content review.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | This week’s signal bank and priorities | Ranked themes, draft queue, and rejected ideas with reasons |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Review new signals and prior themes.
2. Avoid repeating a thesis without new evidence.
3. Keep publishing decisions human-owned.



## Upstream handoff

Read `<brain_dir>/runtime/payload/brain/EDITORIAL-DRAFT.md` for dependency resolution and
the caller-input contract. Resolve doctor.integrations.content and its recorded
commit. Invoke the actual imported **Content Engine weekly guide** instructions; read their selected
guide, templates, examples, reviewer resources and anti-patterns in full. The upstream
owns the implementation. Product Bench supplies reviewed context and permissions.

Forward period/timezone, approved sources, bank/theme locations, watermark and destination. Stop at themes and the review queue; writing remains a separate request. Reuse supplied approvals and reviewed team voice. Keep the working directory
and durable state in the user's repository; engine resources resolve under the
imported checkout. Missing or unhealthy imports leave delegated execution pending.
Do not silently substitute a generic writer or claim a review/metric/tool ran.

Report the upstream revision, approved read/write scope, actual outputs, partial
failures and pending decisions. Publication, delivery, scheduling and Git actions
require the authorization stated by the user and the upstream workflow.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
