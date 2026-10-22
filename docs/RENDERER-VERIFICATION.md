# Optional renderer verification

The basic Node suite checks Python syntax and a missing-input failure when Python
is available. It explicitly skips only artifact execution if the optional Python
packages or Chromium binary are unavailable. This does not verify rendering in a basic installation.

For offline artifact validation, use Node.js 22+, Python 3.12 and an isolated environment outside the checkout. These commands install both skills' requirements through the pinned CI resolution and install Chromium, then run the actual artifact checks:

```sh
product_bench_renderer_env=$(mktemp -d)
python3.12 -m venv "$product_bench_renderer_env"
"$product_bench_renderer_env/bin/python" -m pip install -r scripts/renderer-requirements.txt
PLAYWRIGHT_BROWSERS_PATH="$product_bench_renderer_env/browsers" "$product_bench_renderer_env/bin/python" -m playwright install chromium
PLAYWRIGHT_BROWSERS_PATH="$product_bench_renderer_env/browsers" PB_RENDERER_PYTHON="$product_bench_renderer_env/bin/python" node --test renderer-runtime.test.mjs
```

On Linux, install the browser's system dependencies with Playwright's `install --with-deps chromium` option. That may require administrative privileges. CI uses Ubuntu 24.04, installs those dependencies, and runs an explicit import/browser-launch probe before the tests. A missing prerequisite fails the job instead of passing as a skipped artifact check.

The environment variable selects that interpreter. The procedure
runs the checked-in fictional fixtures through slide, flow-document and findings
report renderers. It checks schema/DOM identity, actual PNG/PDF artifacts, extracted
text, receipt fields, canvas fit, and rejected empty/duplicate/invalid-surface,
mismatched-DOM, missing-image and overflow cases. It writes temporary outputs
outside the checkout. A browser startup failure fails the artifact gate.

To retain artifacts for inspection, run that interpreter with
`scripts/renderer-smoke.py --out` followed by an outside-checkout output directory.
Inspect the resulting slide PNG and all PDFs. These are rendering fixtures,
not evidence of model quality or execution of all 79 workflow modes. Optional
Python dependency terms and the scoped license approval are recorded in
[third-party notices](../THIRD-PARTY-NOTICES.md#optional-python-renderers) and
[release gates](../RELEASE.md). License approval and renderer execution are
separate evidence.
