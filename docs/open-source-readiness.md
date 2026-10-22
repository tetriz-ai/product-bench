# Release validation

Use the checks in [RELEASE.md](../RELEASE.md) for each candidate. Product Bench ships a Node.js CLI, managed workflows, blank context templates, bundled skills, and fictional examples. The package's `files` list defines its tarball contents; packed-install tests exercise that artifact.

Keep credentials, personal session data, generated host-test outputs, caches and raw review logs outside the distribution. Preserve the licenses and [copied-file inventory](THIRD-PARTY-PROVENANCE.json). Optional upstream engines and Python renderers keep their own notices.

## Evidence boundaries

[Functional coverage](FUNCTIONAL-TEST-COVERAGE.md) records synthetic workflow tests for Claude Code and Codex. Synthetic results do not verify model quality, live provider access, customer facts, or Windows support. Local checks do not establish a successful hosted CI run.

Run secret scans on the final publication tree and intended history. Review the exact candidate, generated files, documentation, examples and media before release. Raw scanner results and independent review reports belong outside the distribution.

Product Bench's name clearance and contributor roster consent are confirmed by the maintainer. Release validation still requires passing checks on the final revision and verification of the installed optional engines. Public distribution uses `tetriz-ai/product-bench`; source preparation and a public import are separate operations.
