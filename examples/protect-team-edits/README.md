Build a local npm tarball, then use its CLI to update an installation after editing a managed command. The updater keeps the team-reviewed file; temporary files are deleted afterward. Requirements: Node.js 22 or newer, npm, and `tar` on your PATH.

```sh
node examples/protect-team-edits/run.mjs
```

```text
Team-reviewed command preserved
```
