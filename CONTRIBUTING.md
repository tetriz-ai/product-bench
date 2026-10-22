# Contributing

## Install, test and check

The toolchain floor is Node.js 22. CI checks Node.js 22, 24 and 26. The examples require npm, `tar` and a POSIX shell. From a fresh clone:

```sh
npm ci
npm run check
npm test
npm run test:install
node scripts/run-examples.mjs
npm audit --omit=dev
```

The basic Node suite explicitly skips optional artifact checks when Python dependencies or Chromium are absent. The dedicated CI renderer job installs those prerequisites and verifies actual PDF/PNG and prototype-browser behavior. Follow [renderer verification](docs/RENDERER-VERIFICATION.md) to run the same checks locally.

Real Claude Code/Codex tests are opt-in, need authenticated host accounts, and can consume paid usage. Follow [testing](docs/TESTING.md) for smoke and all-mode runs. Keep their generated transcripts and artifacts outside version control.

## Pull requests

- A behavior change needs a meaningful regression test that fails before the change and passes afterward. Pure documentation and maintenance changes need the relevant checks rather than a token test.
- Keep commits focused, with short imperative subjects.
- Add a `CHANGELOG.md` entry for user-visible changes under Unreleased; pure refactors and wording changes need none. Use Keep a Changelog categories and the actual publication date when releasing.
- Put runnable examples under `examples/` and link them in [the index](examples/README.md). CI runs each README's command and compares its output exactly; use fixed fictional inputs. CLI examples execute the packed artifact.
- Keep fixtures synthetic. Do not commit credentials, customer data, raw execution logs, unreviewed context or generated tarballs.

## Workflow and skill changes

Edit workflow contracts in `workflows.mjs`, shared procedures in `details.mjs`, and detailed procedures in `docs/workflows/`. Regenerate the catalogued commands:

```sh
npm run generate
npm run check
```

Edit `payload/commands/pb-setup.md` and `payload/commands/pb-_preamble.md` directly. These hand-maintained files are excluded from generation. Do not edit generated command bodies.

Preserve the 37 workflows, 79 modes and all bundled skill resources. Keep runtime modules and tests at the root, installable assets under `payload/`, references under `docs/`, and development checks under `scripts/`.

Preserve each workflow's thinking sequence, templates, examples, quality gates and anti-patterns. Use reviewed context for company facts and team voice; shared writing defaults live in `payload/brain/VOICE.md`. Keep spec output concise and verify optional tools before claiming execution.

Installation and updates must preserve team-reviewed context, local customizations and existing host settings. Do not remove third-party attribution or guess an optional engine's source repository.

## Demo capture

The demo uses the actual offline example and a separately installed Pillow dependency. Follow [demo reproduction](docs/DEMO.md) for complete setup. The demo workflow uploads a GIF artifact; it does not commit generated files.

## Review

A repository maintainer reviews pull requests. [Mohit Patni](https://github.com/mohitpatni28) maintains this project. Support is best effort; no response time is promised.

## Licensing of contributions

No sign-off line or separately signed agreement is required. Contributions are offered under the project's [MIT License](LICENSE), except changes to third-party material, which retain its existing terms. Preserve upstream notices and do not imply ownership of another contributor's work. See [third-party notices](THIRD-PARTY-NOTICES.md).

Publication, repository transfer, visibility changes and history replacement follow the separate [release procedure](RELEASE.md).
