Build a local npm tarball, then run its renderer entrypoint to save a synthetic eight-section spec as HTML and check that evidence gaps remain visible. This demonstrates the Markdown renderer; it does not execute acceptance tests or validate product outcomes. Requirements: Node.js 22 or newer, npm, and `tar` on your PATH; generated files are deleted afterward.

```sh
node examples/render-spec/run.mjs
```

```text
Rendered fictional spec: 8 sections; evidence gaps preserved
```
