<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, brand-voice.md, gtm.md]
capabilities: [imported content-engine/Blog/Editorial Draft required, web optional]
-->

# /pb-blog

Write an evidence-backed article with a reviewable editorial trail.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Topic, reader, angle, length, and available sources | Outline, sourced draft, metadata, and claim checklist |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Research search intent when browsing is available.
2. Outline before drafting; verify every product and numerical claim.
3. Delegate to imported Blog, which owns Editorial Draft writing and editorial review.



## Upstream handoff

Read `<brain_dir>/runtime/payload/brain/EDITORIAL-DRAFT.md` for dependency resolution and
the caller-input contract. Resolve doctor.integrations.content and its recorded
commit. Invoke the actual imported **Blog** instructions; read their selected
guide, templates, examples, reviewer resources and anti-patterns in full. The upstream
owns the implementation. Product Bench supplies reviewed context and permissions.

Forward topic or review-existing target, audience, angle, length, sources, approved outline, voice/preset and output paths. Reuse supplied approvals and reviewed team voice. Keep the working directory
and durable state in the user's repository; engine resources resolve under the
imported checkout. Missing or unhealthy imports leave delegated execution pending.
Do not silently substitute a generic writer or claim a review/metric/tool ran.

Report the upstream revision, approved read/write scope, actual outputs, partial
failures and pending decisions. Publication, delivery, scheduling and Git actions
require the authorization stated by the user and the upstream workflow.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
