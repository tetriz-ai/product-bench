# Install Product Bench with an agent

Ask Claude Code or Codex in the target repository:

> I have a local checkout of Product Bench at `/path/to/product-bench`. Read its README and run `node /path/to/product-bench/product-bench.mjs init --target . --brain-dir .product-bench` from this repository. Show the preview and ask before applying if the CLI requests it. Then run `doctor` and start `pb-setup`. Inspect only repository paths I approve; ask before connecting external MCP sources.

Clone `https://github.com/tetriz-ai/product-bench.git` and check out the revision you want to install before using the instruction above. Inspect the local installer before running it.
