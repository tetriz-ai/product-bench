# Product Bench contributor guide

## What this is

Product Bench installs reviewed product context, workflows, skills, and freshness
hooks for Claude Code and Codex. Tool-dependent workflows require actual host access.

## Layout

- Root `*.mjs`: local CLI, installer, analytics, source-sync, and review adapters.
- Root `*.test.mjs`: offline contract and installation tests.
- `workflows.mjs`, `details.mjs`, `docs/workflows/`: canonical workflow instructions.
- `generate.mjs`: generates `payload/commands/` and the command reference.
- `payload/brain/`: starter context and configuration; preserve team-owned copies.
- `payload/skills/`: installed skills and local resources, including third-party SEO.
- `docs/`: analytics/source setup, third-party inventory, and fictional artifacts.
- `examples/`: runnable offline installation, preservation, and rendering examples.
- `scripts/`: install smoke, examples runner, and compatibility entrypoints.
- `.github/assets/`: banner SVGs and a generated offline demo.

## Commands

Node.js 22 is the floor. CI runs Node.js 22, 24, and 26.
The repository uses dependency-free package and generated-content checks.

```sh
npm ci
npm run check
npm test
npm run test:install
node scripts/run-examples.mjs
```

Regenerate after changing workflow instructions:

```sh
npm run generate
```

## Contract to keep

- Preserve reviewed team context and edited managed files (`core.test.mjs`).
- Keep all bundled skill resources on both hosts (`command-depth.test.mjs`).
- Keep 37 workflows and 79 modes (`check-package.mjs`, `core.test.mjs`).
- Keep failed or partial source fetches unchecked (`core.test.mjs`).
- Keep Buzz and Content Engine imports optional, locally inspectable, and safe on edits or rewritten history
  (`upstream-buzz.test.mjs`, `upstream-content.test.mjs`). Doctor must not fetch or execute engines.
- Analytics fixtures are fictional; live queries require read-only configuration
  (`core.test.mjs`). Tests use temporary repositories and fake host CLIs.

## Making a change

A behavior change needs a meaningful regression test that fails before and passes
after. Put cases beside the relevant root test suite. Record user-visible behavior
under `Unreleased` in `CHANGELOG.md`; wording and maintenance need no entry.
Edit canonical workflows and regenerate; do not edit generated command bodies.
CI runs the checks above. The examples runner executes each example README's shell
block and compares standard output with its final text block without normalization.
Examples must use stable fictional inputs and no credentials or remote services.
Link new examples in `examples/README.md` using `name/` or `name/README.md`.
Link workflow artifacts in `docs/`.

Edit `payload/commands/pb-setup.md` and `payload/commands/pb-_preamble.md` directly; these hand-maintained files are excluded from generation.

## Do not

- Overwrite reviewed context or locally edited commands during installation/update.
- Treat a healthy installation as verified analytics, connector, or model execution.
- Remove SEO attribution, the Apache license, or shared resource references.
- Guess a Buzz repository or run a live service in offline tests.
- Publish or change repository history without explicit release approval.
