// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
const rules = [
  ['private key', /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/i],
  ['credential assignment', /\b(?:api[_-]?key|secret|password|token|webhook)["']?\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{12,}/i],
  ['email address', /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i],
  ['cloud account identifier', /\b(?:arn:aws:[^\s]+|\d{12})\b/i],
  ['customer or employee identifier', /\b(?:customer[_-]?id|employee[_-]?id|slack[_-]?(?:user|channel)[_-]?id)\s*[:=]\s*\S+/i]
];

export function scanText(contents) {
  return rules.flatMap(([name, regex]) => regex.test(contents) ? [name] : []);
}
