<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, users.md, brand-voice.md, technical-constraints.md]
capabilities: []
-->

# /pb-grill-me

Interrogate a plan or bet until assumptions are explicit.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| default | Plan, hypothesis, or design choice | Resolved decision tree, remaining assumptions, and next test |

If no mode is named, use `default`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Ask one consequential branch at a time.
2. Resolve dependencies before downstream choices.
3. Stop when the decision is actionable, not when all uncertainty disappears.

## Sequential interrogation

Ask one consequential question, wait for its answer, then resolve that branch before asking the next. A complete retrospective table does not establish that an interrogation occurred. Keep an ordered question/answer record with answer sources. When an answer is unavailable, mark the unresolved dependency and stop or choose the next independent branch.

## Procedure

Resolve paths from `.product-bench-install.json` and read the supplied artifact, reviewed product/user/constraint context and evidence before interviewing. This is a decision-tree interrogation: make dependencies explicit, recommend grounded answers, and get consequential open choices resolved. It is not a disguised artifact rewrite or a bulk questionnaire. Read and invoke the installed `grill-me` skill (`.agents/skills/grill-me/SKILL.md` for Codex or `.claude/skills/grill-me/SKILL.md` for Claude Code). It is bundled with Product Bench; use its actual decision-tree and turn-boundary contract with the host conversation. A missing skill is an incomplete installation, not permission to silently substitute another workflow.

### Map before drilling

Name the root decision and branches. Trace downstream dependencies; identify assumptions, factual unknowns, reversible choices and potentially irreversible consequences. Tag each node `[OPEN QUESTION]`, `[ASSUMPTION]`, `[NEEDS DATA]`, `[RESOLVED — source]`, or `[DEFERRED — reason/action]`. Already documented facts can be source-resolved without re-asking, but a recommendation cannot resolve a new user decision. Pick the branch upstream of the most choices or with the greatest consequence if wrong.

Use these starting trees, selecting relevant nodes rather than reciting every prompt:

- **Hypothesis:** who/problem/evidence; causal mechanism; numeric falsifier/window; sample and instrumentation; kill criteria; why now; capability or distribution advantage.
- **Scope/spec/improvement:** outcome metric; minimum surface; explicit exclusions; affected existing users and regression; permissions/data/integration dependencies; rollout, feature flag or other reversible mechanism; rollback and recovery.
- **Design:** entering mental model; first run vs recurring use; loading/empty/error/partial/permission states; migration of existing users; reversible vs irreversible choices.
- **Strategy/GTM/pricing:** beachhead/job; advantage against fast followers; buying committee and veto; substitute; leading indicator; disconfirming signal; capability and commercial constraints.

### One consequential question per turn

For the chosen open branch, emit one block with the branch, why it matters, recommended answer and rationale, what files/evidence were checked, and a **single specific question**. Then end the turn and wait. Never present a recommendation and silently mark it accepted. Existing explicit authorization/answers persist and may resolve a branch; do not repeatedly ask for the same decision.

On the next user answer, record the answer and source. If it resolves the branch, update the tree. If it exposes a dependent assumption, insert that child and drill it before unrelated downstream choices. If the answer is hand-wavy, name the assumption and ask a sharper consequential question; if evidence remains unavailable, offer a concrete deferral with needed evidence, owner if known and next action. A factual unknown may be deferred transparently by the assistant; an unanswered consequential user choice remains open unless the user explicitly agrees to defer. Do not turn all uncertainty into approval requests.

Resolve independent branches while data dependencies are blocked. Note tangents as new nodes rather than losing the current branch. Finish when every consequential branch is source/user-resolved or explicitly deferred with an action; do not force certainty about unknowable futures. Show the remaining consequence of each deferral. Keep an ordered answer trail so a retrospective table cannot masquerade as an interactive interrogation.

When embedded in `pb-hypothesis`, `pb-spec` or `pb-improve`, inherit prior inputs and return the resolved tree to the caller. Turn boundaries still apply; do not continue drafting the parent's next phase after asking the question. Standalone, output a paste-ready tree and next-step routing. Draft or shared-context writes follow the preamble's reviewed authorization; there is no automatic write or commit.

### Embedded turn boundaries and constructive pressure

When a parent command invokes this workflow, output the initial dependency tree **alone**, then end that turn. In the next turn ask the first branch question and stop. This preserves the source skill's deliberate separation between mapping the problem and interviewing about a choice. A source-backed factual branch may already be resolved in the opening tree; a novel user decision is not resolved by the assistant's recommendation. Do not write artifacts from an embedded grill: return the tree to the caller, which owns the draft and save flow.

Push back once on a thin answer with a sharper falsifying question. Example: “They will use it” becomes “Which observed action shows they will check a warning before the shift, and what result would make you drop this delivery channel?” If the evidence is still absent, retain the assumption and concrete evidence task; do not call agreement evidence. When an explicit user deferral is needed for a consequential choice, ask for that deferral instead of silently accepting it. In a design tree include recovery from permission loss as well as first-run, loading, empty, error and partial-data states. In a scope tree ask whether a new signal changes existing reporting or downstream decisions when relevant.

## Output template

Opening map:

```text
Root: [decision]
├── [upstream decision] — [OPEN QUESTION]
│   ├── [evidence dependency] — [NEEDS DATA]
│   └── [dependent scope] — [ASSUMPTION]
└── [documented constraint] — [RESOLVED — source/section/date]
```

One interaction turn:

```markdown
**Branch:** [single consequential choice]
**Why this matters:** [what depends on it]
**Recommended answer:** [proposal + evidence-based reason]
**What I checked:** [actual paths/sections/sources; inference explicitly labeled]
**Question:** [one specific question]
```

Stop immediately after that question. Closing artifact:

```markdown
## Resolved decision tree
[Final tagged tree, including honest remaining open dependencies]
## Decisions and answer trail
| Field | Value |
|---|---|
| Order | |
| Branch/question | |
| Answer | |
| Source/user turn | |
| Consequence | |
## Deferred / needs evidence
| Field | Value |
|---|---|
| Branch | |
| Why deferred | |
| Evidence needed | |
| Action/owner | |
| Revisit trigger | |
## What this unblocks
[Ready next step: spec/improve/research/analytics/decision deposit]
## Limits
[What remains blocked; risks the team explicitly accepts]
```

## Worked example

**Fictional scope review:** a plan says “automatically replace cancelled volunteers.” The tree starts with authorization, availability freshness, replacement selection and notification behavior. Reviewed fictional constraints already say assignments require coordinator confirmation, so that node is source-resolved. Highest-leverage open branch: whether the first release recommends candidates or contacts them. The turn proposes **recommendations only**, because it avoids contacting unavailable people, cites the constraint, and asks “Should the first release stop at coordinator-reviewed recommendations?” It stops there. A user reply “yes” resolves that choice; the assistant then asks about availability freshness in the next turn. No reply means the first choice remains open. If freshness data is unavailable, the close-out lists the required data audit and a manual fallback proposal rather than claiming the branch was decided.

## Quality checks

- Tree and interrogation order reflect dependencies, not arbitrary template order.
- Documented facts have real sources; user choices have real answers or explicit deferrals.
- Exactly one consequential question is asked in a turn, with a grounded recommendation.
- The ordered answer trail matches the conversation; no invented interviews or acceptance.
- Close-out states what is unblocked and what a deferred dependency still blocks.

## Anti-patterns

- Five questions in one message, or multiple branch blocks before waiting.
- Marking the assistant's preferred choice resolved without the user's answer.
- Asking about a known file/schema instead of reading it; citing a file never inspected.
- Accepting “TBD” without an evidence/action node, or declaring all future uncertainty resolved.
- Continuing the calling command's drafting phase after asking an unanswered consequential question.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
