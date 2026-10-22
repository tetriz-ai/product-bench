# Examples

| You want | Example |
|---|---|
| Inspect an installation and fictional analytics | [inspect-install](inspect-install/) |
| Preserve a team-reviewed command during updates | [protect-team-edits](protect-team-edits/) |
| Render a complete fictional spec with explicit gaps | [render-spec](render-spec/) |

Requirements: Node.js 22 or newer, npm, and `tar` on your PATH.
Run all examples from the repository root with `node scripts/run-examples.mjs`.
Each example builds a local npm tarball with lifecycle scripts disabled and an empty temporary cache.
It extracts that artifact and runs its shipped command entrypoints against fictional inputs.
Tarballs, installed context, and HTML output are deleted when the example finishes.
No account or network is needed.
The runner compares standard output with the final text block without normalization.
