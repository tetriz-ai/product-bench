# Context source setup

Product Bench discovers possible evidence in this order: user-approved repository paths, available MCP capabilities, user-pointed local files, then targeted questions. The user chooses the scope. A source registry entry records *where to look*, not a credential or proof that the source is currently connected.

## Register a source

Save this fictional example as `source.json` outside committed outputs:

```json
{
  "id": "research_notes",
  "kind": "mcp",
  "scope": "Only the approved research-notes folder",
  "capability": "search and read research documents",
  "server_hint": "team's document connector",
  "targets": ["users.md", "product.md"],
  "cadence_days": 14,
  "owner": "product team"
}
```

Run `node .product-bench/runtime/product-bench.mjs source-add --target . --file source.json`. Kinds: `repo`, `local`, `mcp`, `manual`, `web`. A repository or local source uses `scope` to name approved paths. An MCP source uses a logical `capability`; the agent checks whether a matching tool is connected in the current session and asks to connect it when missing. A source can be disabled in `sources.json` without deleting its history.

For a repository source, add `"paths": ["docs/product"]` with paths relative to the target repository and exactly one context target. For a local source, add absolute `paths` that the user explicitly approved. Run `source-pull --target . --id <source-id>` to hash those files and stage change or deletion proposals. It skips hidden directories and nested symlinks, rejects NUL-containing or invalid UTF-8 files and files over 1 MiB. Each approved directory is limited to 500 files as a deliberate safety boundary; narrow the registered scope when the cap is exceeded. Approved paths must be direct: symlinks at the leaf or any user-controlled ancestor are rejected on every pull, including an ancestor replaced after registration. Standard macOS `/tmp`, `/var`, and `/etc` aliases are accepted only when they resolve to their standard `/private` locations. Directly approved absolute external files remain supported. It never copies file contents into the sync state. The agent then reads changed files in scope and proposes the actual context diff. For MCP and web sources, the agent uses its connected tools and stages a complete batch as below.

## Sync a source

Run `/pb-sync-context` or ask Codex to use that workflow. The agent must collect all pages in scope, keep an overlap window for incremental cursors, or compute a full-scan content hash when no cursor exists. It prepares one complete batch with stable object IDs, versions, citations, target context files, and short summaries. Example:

```json
{
  "source_id": "research_notes",
  "cursor": "full-scan-sha256:fictional-example",
  "complete": true,
  "items": [{
    "object_id": "note-42",
    "version": "2026-09-01",
    "target": "users.md",
    "citation": "mcp://research-notes/note-42",
    "summary": "Participants needed a clearer setup checklist"
  }]
}
```

Stage with `sync-stage --target . --file batch.json`. Inspect proposals with `sync-status`. Review each source document and the proposed context diff. After applying an accepted diff, run `sync-decide --target . --id <id> --decision accepted --applied`. Reject an irrelevant proposal with `--decision rejected`. The reviewed cursor advances only after no proposals remain pending. For a failed or partial connector fetch, report the attempt through `sync-stage` with `{"source_id":"research_notes","complete":false}`. This deliberately exits nonzero and clears only the source health timestamp. It does not stage partial items or advance observed/reviewed cursors, and `doctor` shows the source as unchecked. Other malformed batches leave successful state unchanged. Do not refresh context timestamps after a failed or partial fetch.

Context files record `Last updated: YYYY-MM-DD` only when their facts actually change. A source check with no changes updates source health but does not make old context fresh.

Approved ordinary subdirectories, including `vendor`, `node_modules`, `dist`, and
`build`, are scanned within the explicit scope. Hidden entries and symlinks are
excluded. Cadence defaults to 30 days only when omitted; supplied values must be
positive integers. Stored state contains hashes, references and review metadata,
not source file contents.
