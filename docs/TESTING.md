# Testing Product Bench

Run tests against the current `main` before changing behavior, then repeat the
relevant checks on a feature branch. Installation checks, mocked host protocols,
real workflow execution and live integration access are separate evidence.

## Offline checks

```sh
npm ci
npm run test:ci
node scripts/run-examples.mjs
```

The suite covers installation/update preservation, reviewed shared context,
source-sync failures and checkpoints, analytics fixtures/provider protocols,
export screening, optional Buzz and Content Engine imports, command/skill resources on both hosts,
and reviewer isolation/failure handling. Package checks validate all 37 generated
workflows, 79 mode contracts and 24 bundled skills; setup is an additional guided
command. Mock host processes verify protocol handling, not model quality.

The renderer tests execute actual PNG/PDF/text/receipt validation when the Python
dependencies and Playwright Chromium are available. Follow
[renderer verification](RENDERER-VERIFICATION.md). A browser startup failure fails
the artifact check; unavailable dependencies produce an explicit skip.

## Real Claude Code and Codex smoke checks

These checks are opt-in and use your existing authenticated host CLI. They can
consume subscription usage or API credit. Each outer Claude process has a USD 1.50
API budget cap; independent reviewer subprocesses consume additional host usage.
They are not part of `npm test` or automatic CI.

Run from the checkout. Use a new empty output directory for every run:

Keep generated transcripts, receipts and artifacts outside the checkout, or under
the gitignored `test-results/` directory (for example `--out test-results/run-1`).
Reusable test source and the coverage documentation remain tracked.

```sh
npm run test:hosts -- --host both --out /tmp/product-bench-host-results
```

For a focused rerun:

```sh
npm run test:hosts -- --host codex --cases spec,analytics --out /tmp/product-bench-focused-results
```

The runner creates separate fictional installations for each host/case, uses a
custom brain directory, reads the installed workflow, and saves the prompt,
transcript, answer, stderr and receipt outside the checkout. Fresh processes avoid
conversation carryover. Claude uses native slash commands; Codex reads the
matching installed command file through its repository instructions.

Fourteen cases cover complete setup, concise spec/scope handling, actual fixture
analytics, Editorial Draft handoff, battlecards, Content Engine cluster/inventory/
competitor-gaps/refresh-plan, citation-monitor setup, both onboarding variants,
roadmap stage-age boundaries and unconfigured Buzz. The analytics and skill cases
require successful tool-call evidence; claims in model prose do not satisfy that
check. Inline-only runs must preserve reviewed context and supplied corpus files.

A separate `setup-content-import` smoke case starts with no configured content
source and no imported engine. The host must configure the approved source itself,
preview/apply the real import, rerun doctor, and read all three linked skills.
The oracle checks actual config preservation and installed links as well as
successful tool calls; a prose completion claim cannot pass. Supply the approved
Content Engine clone URL or local Git checkout through `PB_CONTENT_REPOSITORY`
and optionally `PB_CONTENT_BRANCH` (default `main`):

```sh
npm run test:hosts -- --host both --cases setup-content-import --out /tmp/product-bench-content-setup
```

This case permits only the requested local dependency configuration/import;
company context is protected and no scanner, writer or provider is run. With an
approved source it also joins the default smoke selection; without one, explicitly
selecting it reports blocked. Other content tests can still preinstall their
dependency to isolate writing behavior. This case is separate from the 160-case
every-mode matrix.

Attempted-case receipts record the host version, Git revision, dirty-tree status, time,
process exit and failed output contracts. Authentication failures are blocked,
not passed; remaining cases for that host are not attempted. Timeouts and missing
or malformed answers fail. Read `results.json` and inspect the actual answers and
traces before treating a run as evidence. Temporary installations are retained at
the paths in receipts for investigation; remove them when no longer needed.

These are deterministic smoke checks over selected synthetic outputs, not a
complete 79-mode quality evaluation. Blog stops at the engine handoff; citation
monitor stops at setup; Buzz stops before importing/running an engine. No collector,
live analytics, delivery, scheduling, publication, Git write, or independent
review is claimed by these cases. Real provider/account checks need separately
authorized access and representative inputs. Private transcripts remain local.

## Every-mode functional checks

The functional suite has explicit inputs and assertions for all 79 modes, plus
setup, on each host: 160 cases in total. Run it separately from the smaller smoke
suite. These runs write actual artifacts in isolated fictional installations;
they can take several hours and consume host subscription usage.

```sh
npm run test:hosts -- --host both --suite functional --parallel 4 --out /tmp/product-bench-functional-results
```

For Buzz, supply `PB_BUZZ_REPOSITORY` pointing to an approved upstream checkout.
The runner imports that checkout through the real installer and executes upstream
dry runs. Without it, the cases test the missing-engine gate and record positive
execution as unverified. Public scanner reads are allowed only for Buzz; delivery,
scheduling and Git writes remain prohibited. Provider credential or fetch failures
must remain distinct from a successful empty scan and from a drafted response.

For supplemental positive-path Buzz checks, set `PB_BUZZ_FIXTURE=1` alongside
`PB_BUZZ_REPOSITORY` and select the `buzz--*` cases. The unmodified upstream scanners
execute with synthetic HTTP responses through a test transport that rejects
undeclared URLs. The host still executes judging, drafting and native humanizers.
Receipts label synthetic execution explicitly; these runs do not verify live
credentials or provider access.

Set `PB_RENDERER_PYTHON` to a Python interpreter with the dependencies documented
in [renderer verification](RENDERER-VERIFICATION.md), including Playwright Chromium
and pypdf. Functional cases require actual PDF pages and browser interactions;
an unavailable browser is a failure, not an artifact pass.

The suite checks saved analytics definitions, context changes and sync checkpoints,
deduplicated signal banks, staged citation observations, finished writing and
editorial review, actual branded HTML/PDF files, and separate-process review-lens
receipts. Prototype checks execute retry and permission revocation in a browser
with external network requests blocked. Planning/interview modes assert their
intended stopping points rather than forcing implementation or publication.

Setup writes all ten approved context areas, registers a recurring source, runs
fixture analytics and then saves the selected first spec. The command-tour preview
remains a separate smoke case. Scope planning can exercise the documented explicit
interview skip; its artifact must record that choice and unresolved branches.

If a host's JSON stream omits native delegation events, retain the pending evidence
gate and supplement it with an observed native delegation audit tied to the same
case inputs. A model-written completion claim alone is not execution proof.

Use `--cases` with functional IDs such as `analytics--save,prototype--default` for
focused reruns. Each rerun needs a new empty output directory. Keep initial failures
and rerun receipts together when assessing coverage; do not overwrite failed runs.
Inspect integration status and saved artifacts before claiming positive execution.
Synthetic functional coverage does not establish live-provider behavior or output
quality, and a missing prerequisite does not count as a successful positive path.

See the [dated functional coverage report](FUNCTIONAL-TEST-COVERAGE.md) for the
completed two-host matrix and the limits of that execution evidence.

## Manual checks with your team

All 79 modes plus setup have synthetic functional evidence on both hosts. The following six checks assess real team inputs and judgment beyond that evidence; run the relevant workflows in both Claude Code and Codex.

1. **Fresh setup in a real repository:** confirm all ten context areas, the product/GTM/sales/analytics tour and an obvious first-task handoff. Synthetic full setup is already covered.
2. **Real spec and review:** use an actual feature and judge whether the concise spec preserves its scope and fresh reviewers find substantive gaps. Artifact creation and reviewer execution are already covered.
3. **Finished content:** inspect a full Editorial Draft blog for your team's voice, depth, claims and editing. Full drafting/review is already covered; the smaller smoke suite intentionally stops at handoff.
4. **Branded documents:** use your actual guidelines for a deck and sales document; inspect final PDFs for branding, readability and layout. Synthetic branded HTML/PDF execution is already covered.
5. **Live integrations:** verify your read-only analytics accounts, approved sources and configured Buzz providers. Synthetic/failure-path checks do not verify your credentials or real delivery; authorize delivery separately.
6. **Teammate workflow:** have another person clone, install and update in their own environment. Confirm shared context is visible and reviewed context/customizations survive. Automated preservation checks are already covered.

## Imported content pipeline checks

Writing host tests require the real Content Engine upstream, since the writing
pipeline is no longer bundled. Set `PB_CONTENT_REPOSITORY` to an approved clone URL
or local Git fixture and optionally `PB_CONTENT_BRANCH` (default `main`) before
running `scripts/host-workflow-smoke.mjs`. The harness imports that revision into
each temporary install for both hosts; it does not substitute a fake writing skill.
`upstream-content.test.mjs` covers import/update/migration safety offline. Its tiny
Git fixture tests installation mechanics only, not editorial output quality.
The standalone engine owns regression tests for its pipeline and host installer.

Content functional cases allow up to 20 minutes per host invocation, matching the
full imported guide/reviewer workload. Use lower concurrency when hosts are slow.
They provide dated synthetic signals, independent origins, duplicate/stale/spent
records and explicit theme/version/format approval; fixture URLs are never fetched.
Successful tool traces must show the selected upstream guides were actually read.
