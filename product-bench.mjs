#!/usr/bin/env node
// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { run } from './cli.mjs';

run(process.argv.slice(2)).catch((error) => {
  process.stderr.write(`Product Bench: ${error.message}\n`);
  process.exitCode = 1;
});
