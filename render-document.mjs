// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
// Dependency-free renderer for the documented Markdown subset used by sales documents.
import { readFileSync, writeFileSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
function inline(text) {
  return escape(text).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (all, label, href) => /^(?:https?:|\.\.?\/|[\w/-]+(?:\.[\w]+)?(?:#.*)?$|#)/i.test(href) && !/^(?:javascript|data):/i.test(href) ? `<a href="${href}">${label}</a>` : label);
}
export function renderMarkdown(markdown, title = 'Product Bench document') {
  const blocks = [], lines = markdown.replaceAll('\r\n', '\n').split('\n');
  let paragraph = [], list = null, code = null;
  const flush = () => { if (paragraph.length) { blocks.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; } if (list) { blocks.push(`</${list}>`); list = null; } };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^```/.test(line)) { flush(); if (code) { blocks.push(`<pre><code>${escape(code.join('\n'))}</code></pre>`); code = null; } else code = []; continue; }
    if (code) { code.push(line); continue; }
    if (!line.trim()) { flush(); continue; }
    const heading = /^(#{1,6})\s+(.+)$/.exec(line);
    if (heading) { flush(); blocks.push(`<h${heading[1].length}>${inline(heading[2])}</h${heading[1].length}>`); continue; }
    if (/^\s*(?:---+|\*\*\*+)\s*$/.test(line)) { flush(); blocks.push('<hr>'); continue; }
    if (line.includes('|') && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || '')) {
      flush(); const cells = (row) => row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => inline(cell.trim()));
      blocks.push(`<table><thead><tr>${cells(line).map((cell) => `<th>${cell}</th>`).join('')}</tr></thead><tbody>`); i++;
      while (i + 1 < lines.length && lines[i + 1].includes('|') && lines[i + 1].trim()) blocks.push(`<tr>${cells(lines[++i]).map((cell) => `<td>${cell}</td>`).join('')}</tr>`);
      blocks.push('</tbody></table>'); continue;
    }
    const item = /^\s*(?:([-*])|\d+\.)\s+(.+)$/.exec(line);
    if (item) { if (paragraph.length) { blocks.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; } const tag = item[1] ? 'ul' : 'ol'; if (list !== tag) { if (list) blocks.push(`</${list}>`); blocks.push(`<${tag}>`); list = tag; } blocks.push(`<li>${inline(item[2])}</li>`); continue; }
    if (list) { blocks.push(`</${list}>`); list = null; } paragraph.push(line.trim());
  }
  flush(); if (code) blocks.push(`<pre><code>${escape(code.join('\n'))}</code></pre>`);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title><style>@page{size:Letter;margin:.5in}*{box-sizing:border-box}body{margin:0;color:#14213d;background:#e8eeff;font:10.5pt/1.4 Arial,Helvetica,sans-serif}.sheet{width:7.5in;max-width:100%;margin:24px auto;background:white;padding:0}h1{font-size:20pt;margin:0 0 8px}h2{font-size:12pt;margin:14px 0 5px}h3{font-size:11pt}p{margin:0 0 8px}ul,ol{padding-left:20px;margin:5px 0 9px}li{margin:2px 0}table{border-collapse:collapse;width:100%;font-size:9pt;margin:8px 0}th,td{text-align:left;padding:4px;border-bottom:1px solid #c8d0de}a{color:#14213d;overflow-wrap:anywhere}pre{white-space:pre-wrap}h1,h2,h3{break-after:avoid}@media print{body{background:white}.sheet{margin:0;max-width:none}}</style></head><body><main class="sheet">${blocks.join('\n')}</main></body></html>\n`;
}
function isCliEntry() {
  if (!process.argv[1]) return false;
  try { return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url)); }
  catch { return false; }
}
if (isCliEntry()) {
  const args = process.argv.slice(2), option = (name) => args[args.indexOf(name) + 1];
  if (!args.includes('--input') || !args.includes('--output')) throw new Error('Use --input source.md --output document.html');
  writeFileSync(option('--output'), renderMarkdown(readFileSync(option('--input'), 'utf8'), args.includes('--title') ? option('--title') : 'Product Bench document'));
}
