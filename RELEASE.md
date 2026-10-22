# Releases

Product Bench follows Semantic Versioning. Before 1.0, a minor release may change CLI options, workflow modes, context schemas, host integration, or output formats. Patch releases preserve those contracts.

## Validate a release

Run from a fresh checkout of the candidate revision with Node.js 22 or later:

```sh
npm ci
npm run check
npm test
npm run test:install
node scripts/run-examples.mjs
npm audit --omit=dev
```

CI runs regression checks on Node.js 22, 24, and 26, the examples, renderer/browser checks, dependency auditing, and secret scans of the tree and Git history. Follow [renderer verification](docs/RENDERER-VERIFICATION.md) for the optional Python environment. [Testing](docs/TESTING.md) separates offline checks from opt-in agent and live-provider checks.

Review all files and Git refs included in the release. Preserve [third-party notices](THIRD-PARTY-NOTICES.md) and licenses. First-party material is MIT-licensed, Copyright 2026 Workloom Solutions Private Limited.

## Publish a version

1. Keep `package.json` and both root version entries in `package-lock.json` identical.
2. Move the release entries from Unreleased into a changelog section named for the version and publication date. Leave an empty Unreleased section above it.
3. Test the exact candidate and its packed install. Merge the preparation PR and require passing hosted CI on the final revision.
4. Create the matching `vVERSION` tag and GitHub release in `tetriz-ai/product-bench`, using that changelog section as the release notes. Test any attached tarball before uploading it.
5. Verify the release, tag revision, downloads, installation instructions, and CI results.

The npm `private: true` guard remains enabled. GitHub releases do not publish this package to npm.

## Optional integrations

Content Engine and Buzz Engine are imported separately. Public installation instructions use their `tetriz-ai` clone URLs and `main` branches; those repositories must be accessible before users can import them. A local approved clone also works. The default configuration leaves both imports unset.

Verify Content Engine's complete Blog → Editorial Draft pipeline and Buzz's native skill links after upgrading either dependency. Imports record exact revisions and preserve local edits or rewritten upstream histories. Importing does not authorize scans, writing, posting, or scheduling.

Installation health does not establish source permissions, context accuracy, live analytics access, or model quality. Optional Python dependencies retain their own licenses; see the [dependency notices](THIRD-PARTY-NOTICES.md#optional-python-renderers).

Dependency updates are reviewed manually. CI audits npm dependencies and scans for secrets. Repository visibility, branch protections, vulnerability alerts and other GitHub settings are managed separately from version preparation.
