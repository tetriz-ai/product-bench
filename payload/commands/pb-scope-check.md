<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, technical-constraints.md, brand-voice.md, roadmap.md, metrics.md]
capabilities: []
-->

# /pb-scope-check

Challenge scope before committing to a build.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| expand | Proposal and evidence | Case for broader scope and extra cost |
| selective | Proposal and must-win outcome | Minimum valuable slice and exclusions |
| hold | Proposal and uncertainty | Reasons to defer and next evidence |
| reduce | Proposal and constraints | Smaller scope with protected user outcome |

If no mode is named, use `expand`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. State the user outcome being protected.
2. Name the cost of each scope choice.
3. Make exclusions explicit.



## Procedure

Invoke the bundled `grill-me` skill through `pb-grill-me` when reaching the decision-tree interrogation phase, inheriting the candidate artifact, reviewed context, and prior answers. Read its actual installed instructions on this host; do not simulate availability or repeat resolved choices.

Challenge the scope before committing to a build. Preserve the threshold of user value while confronting both gold-plating and cuts that make the bet untestable. Read the configured hypothesis/evidence, current roadmap, persona context, and technical constraints; resolve artifact locations through installation configuration.

1. Load the causal bet and candidate items. Locate a referenced hypothesis and related spec where supplied. If absent, recommend hypothesis work but continue exploration with an explicitly provisional bet when the user chooses; do not invent a validated hypothesis.
2. Apply the selected lens, keeping its distinct question:
   - **selective** (default): smallest version that changes the must-win outcome; define the minimum value threshold, what can wait without losing signal, and minimum-versus-full effort.
   - **expand**: adjacent value worth modest additional effort, ignored personas, integration/data leverage, and credible competitor alternatives. The original “under 20% more effort” is a useful comparison question, not permission to invent estimates or a universal cutoff; identify the user's actual effort budget.
   - **hold**: opportunity cost now versus later, evidence strength, alternative use of capacity, and what waiting can teach that building cannot. Take a position and name a revisit trigger.
   - **reduce**: core bet in one sentence, user-value work versus internal comfort, manual/concierge alternatives, and each proposed cut's consequence. Do not shrink below the threshold that tests the bet.
3. Interrogate consequential branches: minimum meaningful surface, protected behavior, current-user regression, dependencies, exposure/rollback needs, and downstream platform/data consumers. Recommend one answer at a time when user input is needed. Use a real installed interrogation skill if available; otherwise do the decision tree directly. Reuse existing answers. Record resolved/deferred branches, evidence needed, and next action; an explicitly requested skip is noted, not presented as a completed conversation.
4. Classify items into **IN**, **DEFERRED**, **OUT**, and, where previously included items were removed, **CUT**. Every item traces to the bet or a necessary safety constraint. Deferred includes a pull-forward trigger and risk of waiting; OUT includes a reason and reconsideration signal; CUT includes the user consequence. Do not collapse these categories.
5. Compare scoped and full effort using verified capacity/constraints. If unknown, state rough assumptions or leave estimates unverified, never invent team-weeks. Weigh loss of value against saved effort, not just item count.
6. Recommend proceed, adjust, or hold with the reason, remaining uncertainty, and next decision. Save the verdict under the configured output directory. Suggest brainstorm when the solution remains open, prototype for a meaningful UI, or spec when the solution is ready. The verdict should flow into `pb-spec` scope; do not force the user to duplicate the conversation.

### Decision-tree evidence discipline

Map open branches and their dependencies before drafting the verdict/contract. Read already approved sources before asking a question. Resolve a branch from an explicit supplied answer or a named source, never merely from the author's recommendation. For a consequential choice needing the user, show the branch, why it matters, recommended answer, and what was checked; wait for the answer before advancing its dependent branches. A deferred branch records reason, missing evidence, owner, and next action; it is not a disguised resolution. Keep the resolved/deferred tree with the review trail. Honor an explicit `--skip-grill` or equivalent request and record the skip; never fabricate an interrogation receipt or require the user to repeat existing answers.

## Output template

```markdown
# Scope Check: [Feature]
Mode: [selective / expand / hold / reduce]
Bet: [source link + summary or provisional exploration]

## Core Bet & Value Threshold
[One causal sentence; minimum meaningful user outcome and evidence strength.]

## IN
| Item | Why essential to the bet / safety | Effort + source/assumption |
|---|---|---|
| [behavior] | [reason] | [estimate or unknown] |

## DEFERRED

**Record 1**

| Field | Value |
|---|---|
| Item | [item] |
| Why it can wait | [reason] |
| Risk of waiting | [consequence] |
| Pull-forward trigger | [signal] |


## OUT
| Item | Reason | What would change the decision |
|---|---|---|
| [item] | [reason] | [signal] |

## CUT [when applicable]
| Previously included item | Why removed | Consequence / protected behavior |
|---|---|---|
| [item] | [reason] | [trade-off] |

## Effort & Opportunity Cost
[Scoped vs full vision; capacity source or explicit uncertainty; value preserved/lost.]

## Decision Tree & Open Questions

**Record 1**

| Field | Value |
|---|---|
| Branch | [decision] |
| RESOLVED / DEFERRED | [status] |
| Resolution or evidence needed | [answer or gap] |
| Owner / next action | [owner/command] |


## Recommendation
[Proceed / adjust / hold; clear rationale, revisit trigger, next action.]
```

## Worked example

**Fictional example: a membership app proposes cancellation recovery.** Selective mode keeps an immediate cancellation action and a single optional reason question IN, because the core bet is learning why members leave without blocking them. A personalized retention offer is DEFERRED until the team has a consented reason dataset and evidence that offers help. Mandatory agent contact is OUT because it defeats self-service; reconsider only with a verified policy obligation. In reduce mode, a previously proposed multi-step survey is CUT, with the consequence that learning is less detailed but cancellation friction remains low. Hold mode asks whether resolving billing errors would produce more value now; no imaginary effort or churn baseline is used.

## Quality checks

Each IN item protects a user outcome or required safety constraint. Every deferred item has a reason, risk, and pull-forward signal. Every cut states its consequence. The lens actually matches the requested mode. Estimates cite assumptions. The recommendation takes a position without disguising uncertainty as certainty. The next spec can reuse the buckets unchanged.

## Anti-patterns

Do not equate smallest with valuable, label every nice-to-have deferred without a trigger, expand on imagined cheap effort, cut all error/permission handling to save time, call an untested bet validated, treat hold as indecision, or claim an unavailable grill session happened. Do not replace the user's chosen scope with an unreviewed recommendation.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
