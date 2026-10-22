Build a local npm tarball, then use its CLI to install into a temporary repository with a custom context path, inspect health, and query fictional events. Requirements: Node.js 22 or newer, npm, and `tar` on your PATH. No credentials or network calls are needed.

```sh
node examples/inspect-install/run.mjs
```

```text
Installation ready: true
Optional Buzz: not_configured
Fictional analytics: {"value":1,"numerator":3,"denominator":3,"fictional":true}
```
