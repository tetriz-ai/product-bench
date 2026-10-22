<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
# Product Bench command reference

Start with [GETTING-STARTED.md](GETTING-STARTED.md) for product, GTM, sales, and analytics paths. Run /pb-setup for guided first use or /pb-onboard for a teammate's tour.

In Claude Code, use /pb-<name> followed by a mode and your request. In Codex, ask the agent to read .codex/commands/pb-<name>.md and follow it for your task. If no mode is named, the first listed mode is the default. These are agent workflows, not local CLI subcommands.

## /pb-ai-citation-monitor

Measure whether AI answers cite the product for stable buyer questions.

| Mode | Bring | Receive |
| --- | --- | --- |
| setup | Brand, domains, buyer questions, surfaces, and period | Versioned prompt set and sampling protocol |
| record | Surface, exact prompt, timestamp, raw answer, citations | Append-only observation with source and run metadata |
| report | Period and recorded observations | Citation and mention rates with denominators, examples, and caveats |
| recalibrate | Prompt drift or buyer-question change | Proposed prompt-set changes without rewriting prior observations |

## /pb-analytics

Answer product questions from a verified read-only data source.

| Mode | Bring | Receive |
| --- | --- | --- |
| ask | Question, time window, segment, and configured source | Result, query or API request, data timestamp, methodology, and limitations |
| save | Named verified query or report definition | Reusable definition with metric and schema references |
| run | Saved definition and time window | Fresh result with execution record |
| list | Configured saved definitions | Names, descriptions, and source requirements |
| dashboard | Named group of saved definitions | One report with consistent window and denominators |
| schema | Source and dataset | Verified fields, types, access limits, and freshness |
| account-health | Account identifier and configured diagnostic dimensions | Dimension-by-dimension diagnostic; unavailable dimensions explicitly marked |

## /pb-battlecard

Prepare a sourced competitive brief for a specific deal.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Competitor, buyer, and deal context | Field battlecard with exact pitch/objection scripts, honest wins/losses, proof questions, deal strategy, and prohibited claims |

## /pb-blog

Write an evidence-backed article with a reviewable editorial trail.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Topic, reader, angle, length, and available sources | Outline, sourced draft, metadata, and claim checklist |

## /pb-brainstorm

Explore multiple solutions before choosing one.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Problem, audience, constraints | Divergent ideas from product, design, engineering, and GTM lenses, then selection criteria |
| ost | Outcome, opportunities, evidence | Opportunity-solution tree with assumption tests |

## /pb-brief

Create a short stakeholder pre-read.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Decision, audience, deadline, evidence | One-page context, recommendation, tradeoffs, ask, and owner |

## /pb-buzz

Use the upstream Buzz engine for community digests and brand reports.

| Mode | Bring | Receive |
| --- | --- | --- |
| init | Reviewed product context and Buzz configuration inputs | Upstream Buzz setup and verified or missing prerequisites |
| hn | Hacker News lane arguments | Upstream HN digest; dry run unless delivery is authorized |
| reddit | Reddit lane arguments | Upstream Reddit digest; dry run unless delivery is authorized |
| ph | Product Hunt lane arguments | Upstream PH digest; dry run unless delivery is authorized |
| brands | Configured brands and window | Upstream brand-mention report |
| daily | Configured lanes and daily-run arguments | Upstream daily digest with lane and state results |

## /pb-changelog

Turn a verified shipped change into customer release notes.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Shipped change and release evidence | User-facing change, who benefits, how to use it, limitations |

## /pb-competitor

Research a competitor and identify a defensible response.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Competitor and strategic question | Sourced teardown, buyer implications, and response options |

## /pb-compound

Deposit a learning so future workflows improve.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Learning event and its source | Small proposed context changes, corroboration, and command-drift call |

## /pb-content-engine

Turn market signals into reusable content themes.

| Mode | Bring | Receive |
| --- | --- | --- |
| scan | Approved sources, topics, period | Deduplicated signal bank with citations |
| cluster | Signal bank and existing theme inventory | Evidence-based clusters with intent, demand, duplicates, and novelty decisions |
| inventory | Approved published content and product claims | Content inventory, verification gaps, and ranked action candidates |
| competitor-gaps | Approved competitor content, search questions, and own inventory | Sourced buyer-question gaps with fit and proof requirements |
| refresh-plan | Existing content, changed evidence, and review priorities | Prioritized refresh plan with claim changes, owner, effort uncertainty, and success check |
| brief | Selected signals and audience | Theme brief with angle, proof, counterpoint, and formats |
| write | Approved brief and format | Sourced draft and publication checklist |

## /pb-content-engine-weekly

Run the weekly content review.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | This week’s signal bank and priorities | Ranked themes, draft queue, and rejected ideas with reasons |

## /pb-deck-review

Review a deck or one-pager for accuracy and persuasion.

| Mode | Bring | Receive |
| --- | --- | --- |
| pitch | Pitch deck and audience | Slide-level narrative and claim review |
| sales | Sales deck and account context | Buyer-specific gaps and suggested edits |
| one-pager | One-pager and audience | Clarity, proof, CTA, and layout recommendations |

## /pb-design-review

Audit a design against user goals and requirements.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Design artifact, spec, audience | Evidence-backed usability and consistency findings with priorities |

## /pb-design-spec

Record the reasoning behind a surface decision.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Surface, design alternatives, evidence, and prototype | Governing principle, decisions and alternatives, per-decision evidence, assumptions, revisit triggers, and status history |

## /pb-evals

Design and operate quality evaluation for AI features.

| Mode | Bring | Receive |
| --- | --- | --- |
| design | AI feature, complete per-call input/system/output contract and representative inputs | Deterministic checks, per-variable rubrics, dataset/labeling plan, calibration thresholds, and ship gate |
| review | Eval design, traces, or measured results | Validity, trace failure taxonomy, evaluator coverage, and gap review |
| report | Measured runs and baselines | Ship/hold/fix recommendation with uncertainty |
| calibrate | Human labels and judge results | Agreement, disagreement patterns, and rubric revisions |

## /pb-grill-me

Interrogate a plan or bet until assumptions are explicit.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Plan, hypothesis, or design choice | Resolved decision tree, remaining assumptions, and next test |

## /pb-gtm

Design a launch and acquisition motion.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Product change, audience, business goal | ICP, positioning, channels, proof, launch sequence, and measurement |

## /pb-hypothesis

Turn a belief into a testable product bet.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Belief and triggering observation | Who, problem, evidence, expected outcome, falsifier, and test |

## /pb-idea

Capture a broad idea without pretending it is validated.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Raw idea and source | Scoped idea, beneficiary, problem, alternatives, next learning step |

## /pb-improve

Specify a measured improvement to an existing feature.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Existing behavior, baseline, user signal | Delta spec, acceptance criteria, regression risks, rollout, and metric |

## /pb-market-scan

Assess external forces around a market decision.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Market and decision | Sourced macro trends, industry structure, scenarios, and strategic implications |

## /pb-narrative

Build an executive story for a product decision.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Audience, decision, evidence | Situation, tension, recommendation, proof, and ask |

## /pb-onboard

Orient a teammate to an already configured Product Bench.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Role, team, and first task | Role-specific command tour, context/access status, and a first artifact or concrete next action |

## /pb-premortem

Find credible failure paths before committing.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Plan, launch, or decision | Failure scenarios, early signals, mitigations, owners, and revisit triggers |

## /pb-pricing

Design or assess a pricing model.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Buyer, value metric, costs, current offers | Pricing options, unit economics, willingness-to-pay evidence, risks, and test plan |

## /pb-prototype

Build a small testable representation of a proposed behavior.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Spec, audience, key flow | Clickable prototype or explicit low-fidelity equivalent with test prompts |

## /pb-review-spec

Stress-test a spec with independent review lenses.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Spec or improvement spec | Lens findings, conflicts, severity, decisions, and revision list |
| auto | Spec and all configured lenses | Complete parallel lens review and conflict map |

## /pb-roadmap

Sequence bets around outcomes and constraints.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Candidate bets, capacity, objectives | Now/Next/Later with outcomes, dependencies, evidence, and revisit dates |
| status | Existing specs, lifecycle metadata, and measured outcomes | Stage-age health, stalls, outcome-review candidates, missing data, and triage actions |

## /pb-sales-call-prep

Prepare a buyer-specific conversation.

| Mode | Bring | Receive |
| --- | --- | --- |
| discovery | Account and attendees | Questions, hypotheses, and opening probes |
| demo | Account and use case | Demonstration path and evidence to validate |
| evaluation | Evaluation stage and criteria | Proof plan and risks |
| closing | Decision process and blockers | Close plan and open commitments |
| champion-prep | Champion and internal buying path | Enablement notes and stakeholder map |

## /pb-sales-doc

Build a customer-facing commercial document.

| Mode | Bring | Receive |
| --- | --- | --- |
| one-pager | Buyer, problem, verified proof | One-page summary and ask |
| leave-behind | Meeting outcome and next step | Concise follow-up document |
| defensive | Specific objection and evidence | Evidence-led response document |
| pitch | Buyer and strategic angle | Vision-led document with claims checked |
| onboarding-guide-design-partner | Design-partner goal, verified product navigation, roles, and setup prerequisites | Collaborative onboarding guide with checkpoints, feedback loop, and recovery steps |
| onboarding-guide-plain | Customer goal, verified product navigation, roles, and setup prerequisites | Self-serve onboarding guide with task sequence, verified setup, checkpoints, and recovery steps |

## /pb-scope-check

Challenge scope before committing to a build.

| Mode | Bring | Receive |
| --- | --- | --- |
| expand | Proposal and evidence | Case for broader scope and extra cost |
| selective | Proposal and must-win outcome | Minimum valuable slice and exclusions |
| hold | Proposal and uncertainty | Reasons to defer and next evidence |
| reduce | Proposal and constraints | Smaller scope with protected user outcome |

## /pb-spec

Create a concise build contract for people and agents.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Hypothesis, chosen behavior, constraints | Eight-section concise build contract: problem, bet, scope, behavior, acceptance/evals, success metrics, constraints, and decisions |

## /pb-strategy

Build a product strategy with explicit bets.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Product and strategic question | Vision, ICP, differentiated choice, bets, capabilities, GTM, metrics, and risks |

## /pb-sync-context

Review changes from registered sources and keep context current.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Source registry and optional source/time filter | Cited proposals, selective decisions, updated health, and command-drift proposals |

## /pb-tech-sync

Reconcile documented constraints with code and engineering sources.

| Mode | Bring | Receive |
| --- | --- | --- |
| default | Approved repositories, period, components | Verified changes, affected specs, unknowns, and proposed context updates |

## /pb-uxr

Plan or synthesize user research.

| Mode | Bring | Receive |
| --- | --- | --- |
| pre | Learning objective, audience, assumptions | Discussion guide, recruitment criteria, and analysis plan |
| post | Consented notes or transcript and research question | Findings with quotes or paraphrases, contradictions, strength, and follow-ups |
| journey | Evidence across user stages | Journey map with pain points, moments of value, and gaps |
