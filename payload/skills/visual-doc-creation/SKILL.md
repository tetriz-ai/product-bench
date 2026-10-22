---
name: visual-doc-creation
description: Render branded prose PDFs, one-pagers, leave-behinds, release notes, and table-based trial reports using fixed-page or flowing HTML with actual PDF verification. Reuse reviewed team brand inputs; do not use for slide decks.
---

# Visual document creation

Render prose documents with the bundled fixed-page, flow, and table-report engines. Reuse reviewed team brand inputs through [BRAND-CONFIG.md](BRAND-CONFIG.md); neutral defaults support previews.

Read [PRINCIPLES.md](PRINCIPLES.md) for rendering mechanics; consult [DECISIONS.md](DECISIONS.md) for engine constraints and [HEURISTICS.md](HEURISTICS.md) when choosing a layout. [README.md](README.md) maps the bundled resources. All design choices come from reviewed context or the explicit task; neutral defaults are preview styling.

## Choose the rendering path

| Path | Use when | Source/engine |
|---|---|---|
| Fixed-page | Explicit page geometry and high layout control | Copy [TEMPLATE.html](TEMPLATE.html) and [fixed-page.css](fixed-page.css) to the output directory (or inline its CSS), replace neutral content slots, and render with print margins zero. |
| Flow | Any length, screenshots, unknown page count | Markdown → [flow_renderer.py](flow_renderer.py) + [brand-system.css](brand-system.css). Import `FlowConfig` and `render_flow_doc` for build wrappers. |
| Trial findings | Dense tables with a strict one-page target or explicit continuation breaks | Contract markdown → [build_trial_report.py](build_trial_report.py) + [fixed-page.css](fixed-page.css), with machine fit checking before PDF rendering. |

Only the rendering paths listed above are bundled. Use their documented contracts and report unavailable rendering capabilities.

## Prerequisites and flow execution

Use an existing environment with `markdown`, `pypdf`, and Python Playwright plus Chromium. [requirements.txt](requirements.txt) declares dependencies. If installation is needed, follow the workspace's environment conventions; browser installation may require network access. A successful import does not prove the Chromium binary can launch.

```bash
python3 <installed-skill>/flow_renderer.py --src /absolute/source.md \
  --output /absolute/output.pdf --brand-config /absolute/brand.json \
  --date-label 'Reviewed reporting window'
```

Library callers use `FlowConfig(brand_config='brand.json', assets_dir='assets', pillar_nav=['First', 'Second', 'Third'])`. `None` means wordmark-only header; `"off"` means no header; lists of at most five pillars enable per-page contextual highlighting via multi-pass rendering and PDF stitching. If `show_cover=True`, its first page carries no contextual nav. Use section names from the task; the legacy `pillar_nav` field does not impose a product framework.

- Markdown headings remain ordinary headings by default. Set `numbered_section_bands=True` to give `## 01 — Name` bands and breaks. Set `show_cover`/`show_contact` to enable optional furniture.
- Icons are opt-in (`enable_icons=False` by default). When enabled, only `section_icons` matches get a supplied icon; unmatched headings stay plain. No icon system is prescribed. Supply `icon_registry_path` with reviewed JSON mapping icon names to SVG child markup. No inherited icon geometry is bundled; missing registry renders plain labels. Custom authored SVGs may be used directly.
- Images named `dash-*` or `demo-*` resolve within `assets_dir` and embed as base64. Missing required images fail, rather than silently render placeholders. Preserve capture provenance and permissions. A synthetic asset is an illustration, not a live screenshot.
- Wrap image followed by italic caption to obtain an editorial figure/caption. Include source and capture window near real metrics.
- Logos must come from explicit reviewed `logo_path` and task-approved asset rows. Use only task-approved assets. The neutral mark is labeled draft-only in the default theme.
- `.gs-connectors`, `.gs-team`, `.brand-logo-row` override `.dash-img` sizing. Put markdown images on separate lines with blank lines; use `markdown="1"` on each HTML div containing markdown image syntax.
- `.no-border` removes image borders and needs `markdown="1"` when wrapping markdown.
- Parallel items can use `.pillar-cards` or native HTML tables; markdown inside `<td>` is pre-rendered. Maintain readable type when fitting a one-pager.
- A positive `label_body_split_threshold` enables first-sentence emphasis for explicit `.label-body` paragraphs; zero disables it by default. `callout_labels`, `subhead_labels`, `page_break_h2` and icon maps remain per-document `FlowConfig` inputs.

## Fixed-page execution

Work on a copy of `TEMPLATE.html` with its relative `fixed-page.css` beside it, or embed the CSS; keep canonical resources unchanged. Adapt optional page furniture and layout patterns to the task; replace every neutral example with verified task content and approved assets. Apply brand-token overrides after template CSS, use absolute asset paths or embed them, and wait for actual fonts before measuring. Render with Playwright `format='A4'`, zero margins, `print_background=True` or an available Chromium CLI using absolute `file://` and PDF paths. Browser process exit status alone is not proof of a valid document.

For trial findings:

```bash
python3 <installed-skill>/build_trial_report.py --md /absolute/findings.md \
  --client 'Approved audience' --brand-config /absolute/brand.json --out /absolute/findings.pdf
```

Contract: first `#` is title; first bold-led line is metadata; `> **number** | label | evidence-led sentence` creates the single headline callout (or a plain blockquote for no number); `##` introduces sections with Markdown tables and prose; `^` lines supply final-page coverage fine print, with `^ -` for bullets; final italic line supplies footer. `=== page ===` is an explicit continuation boundary. No raw HTML passthrough in trial copy.

The trial builder preserves variable column-width logic, lead-column treatment, continuation bands and last-page fine print. It measures each page's final content edge against the footer and exits nonzero on overflow. Do not bypass that check or claim fit when dependencies fail. Move less important rows to an explicit continuation, tighten sanctioned table padding, or shorten content while retaining evidence. The PDF is parsed to confirm real title content; a browser error page is a failure.

## Optional full-bleed flow bands: two passes

Chromium clips overflow at the `@page` content boundary. After `render_flow_doc()` writes the HTML, inject this after the canonical CSS and re-render with zero side margins:

```css
@page { size: A4; margin: 16mm 0 20mm 0; }
body { padding-left: 14mm; padding-right: 14mm; }
.cover { margin-left: -14mm !important; margin-right: -14mm !important; margin-top: -16mm !important; }
h2.pillar-opener { margin-left: -14mm !important; margin-right: -14mm !important; }
```

Both CSS and Playwright page margins must agree. Do not set `width: calc(100% + 28mm)`; border-box already computes the block width correctly. If contextual nav is required after this override, preserve the original variant-render/stitch process rather than flatten it silently.

## Asset normalization and size reduction

For permitted raster logos, use Pillow to convert near-white background to alpha (only when it is truly background), crop the alpha bounding box, and save PNG. Wrapped SVGs may contain an extractable high-resolution base64 raster; inspect before external sourcing. Preserve the identity and color of approved third-party marks. Use supplied finished artwork and preserve approved asset identity.

Show actual PDF size. When size reduction is requested, work on copies, preserve alpha, and downsample only oversampled external rasters to at least twice their displayed pixel dimensions at the target DPI. Skip browser-rendered PNGs: re-saving can increase size. Compare actual bytes and keep a smaller copy only if visual quality holds. Optional Ghostscript compression:

```bash
gs -sDEVICE=pdfwrite -dPDFSETTINGS=/printer -dNOPAUSE -dQUIET -dBATCH \
  -sOutputFile=output-compressed.pdf output.pdf
```

Report measured savings; no percentage guarantee. Re-render and inspect after asset changes.

## Verification and handoff

Apply the rendering checks in PRINCIPLES before handoff. Inspect actual PDF page images for clipped tails, unreadable screenshots, orphans, missing marks and inconsistent hierarchy. Check page count and content using `pypdf`; inspect body and isolated header/footer font embedding with `pdffonts` when available. Keep source markdown/HTML, brand input pointer, asset ledger, PDF and the actual verification receipt together. If PNG rendering or visual inspection is unavailable, those checks remain pending even if PDF generation succeeds.

Do not automatically publish, email, upload, modify context, or change installed skill defaults. Record new reusable decisions alongside the output for review. Final filenames use the reviewed product/document identity.
