# Rendering principles

This resource describes HTML-to-PDF mechanics. Typography, palette, icon style, cover treatment, chapter organization, chart emphasis and quantity of callouts are document choices. Use reviewed context and explicit task instructions; otherwise produce a clearly labeled neutral preview. Do not turn the bundled layouts into a brand policy.

## Content and layout authority

Preserve the requested content journey and verified facts. A layout class such as `pillar-opener`, `gs-team`, `aidlc-fig`, or `stat-callout` is a legacy compatibility name for geometry, not a product framework, team credential, chart methodology or mandatory design treatment. Use those classes only when the authored document calls for the corresponding layout.

The bundled fonts are system fonts. A reviewed brand can override tokens and font families through [BRAND-CONFIG.md](BRAND-CONFIG.md). Do not import fonts or reuse logos from unrelated outputs. Font-family declarations alone do not load a font. Supply reviewed local `@font-face` declarations or the supported flow `font_url` when needed, then verify loading and PDF embedding.

## Flow layout

[flow_renderer.py](flow_renderer.py) converts Markdown using Python Markdown's `extra`, `tables`, and `sane_lists` extensions. It writes inspectable HTML beside the PDF. [brand-system.css](brand-system.css) supplies A4 pagination, figure, table, card, callout, and optional furniture styles.

By default the engine preserves source headings without adding a cover, contact block, inferred section icons, sentence emphasis or chapter breaks. Those treatments are opt-in `FlowConfig` inputs. Ordinary browser pagination still occurs as content grows.

- `numbered_section_bands=True` gives two-digit numbered H2 headings a band and break before them. `pillar_icons` maps author-selected numeric prefixes to supplied registry names.
- `enable_icons=True` applies `section_icons` matches to H3 headings using the supplied registry. Unmatched headings stay plain. Use `icon_registry_path` for reviewed name-to-SVG-child JSON; without it labels stay plain. Approved custom SVGs and other task-appropriate symbols are allowed.
- `page_break_h2` lists exact heading texts for explicit breaks. `callout_labels` and `subhead_labels` select bold-led paragraph conversions. Their defaults are empty.
- `label_body_split_threshold` is zero by default. A positive word count enables first-sentence emphasis in explicit `.label-body` paragraphs.
- `show_cover` and `show_contact` independently enable optional furniture. They do not remove the author's source title or content.
- `pillar_nav=None` gives an identity header; `"off"` disables the header. A list of at most five labels enables contextual navigation through PDF variant rendering and stitching. Longer lists fall back to the identity header. This is an implementation capacity, not a limit on document structure.

Contextual navigation discovers section ownership through numbered openers in extracted PDF text. A page with an opener owns that section; later pages inherit it. Pages before the first opener have no active section. A custom heading convention needs an adapted mapping, with actual output verification. Do not flatten variant rendering silently when extending the renderer.

### Markdown inside HTML

Python Markdown treats raw HTML blocks as opaque unless explicitly enabled. Put `markdown="1"` on each custom-class `<div>` containing Markdown image syntax, lists or prose that needs parsing. Nesting an enabled outer div does not replace enabling the relevant inner div. Plain HTML children need no Markdown attribute. The engine separately pre-renders Markdown inside native `<td>` elements.

```html
<div class="brand-logo-row" markdown="1">

![Reviewed mark](demo-logo-example.svg)

</div>
```

### Images and figures

Images referenced by `dash-*` or `demo-*` filenames resolve under `assets_dir` (source directory by default) and embed as base64. Required missing images fail. Other authored paths remain browser-resolved: use absolute local paths or embed them, and confirm they load before export. Prefixes are compatibility conventions, not evidence of a live screenshot.

An embedded image followed by an italic paragraph becomes a figure/caption. Captions should identify source, capture window and any illustrative/redacted status needed to interpret the content. Keep metric methodology near actual metrics.

The `.dash-img` class supplies aspect-preserving sizing. Logo rows need their existing `.dash-img` overrides because ordinary screenshot dimensions are unsuitable for wordmarks. `.brand-logo-row`, `.gs-connectors`, and `.gs-team` have these overrides. `.no-border` removes a border; it does not enable Markdown parsing. Preserve source aspect ratio, inspect at printed scale, and adjust height/width constraints where the task needs more detail.

Use original reviewed logos and artwork. If permitted, remove truly background white from raster logos, crop to the alpha bounding box, and save PNG. Do not remove white foreground marks or change third-party identity colors. SVG wrappers can contain high-resolution embedded raster data; inspect before sourcing another asset. Laptop frames, image rounding, logo rows and cards are optional layout treatments.

## Fixed pages and overflow

[TEMPLATE.html](TEMPLATE.html) is a neutral two-page starter. Work on a copy and adapt page count and structure to the requested artifact. [fixed-page.css](fixed-page.css) contains compatible A4 layout primitives. Both stylesheets are neutral defaults; append reviewed token overrides after their CSS.

A fixed `.page` is 210mm by 297mm with `overflow: hidden`. Chromium may clip content or overlap an absolutely positioned footer while returning success. Measure the last content edge against the footer top after fonts and images are ready. Also inspect horizontal overflow, table wrapping and screenshots. Fixed-page renderers should fail on detected overflow; copy edits and continuation pages usually preserve readability better than shrinking all text.

[build_trial_report.py](build_trial_report.py) implements the table-specific contract documented in [SKILL.md](SKILL.md). Its `_assert_fits()` checks every page's last body element against the footer and fails on overlap. `=== page ===` creates explicit continuation groups; supporting fine print appears on the final page. Column widths vary with table shape and header labels; verify them against actual content. Those weights are starter geometry, not universal semantic rules.

Render fixed pages with A4, zero PDF margins, and `print_background=True`. Use absolute `file://`/PDF paths. An invalid browser URL can export an error page and still exit successfully. Parse the resulting PDF for the real title and expected content.

## Full bleed in flow documents

Chromium clips overflow at the `@page` content boundary. Negative margins alone cannot create true side bleed. When a requested layout uses full-width cover or section bands, render a working HTML copy with matching CSS and Playwright side margins:

```css
@page { size: A4; margin: 16mm 0 20mm 0; }
body { padding-left: 14mm; padding-right: 14mm; }
.cover { margin-left: -14mm !important; margin-right: -14mm !important; margin-top: -16mm !important; }
h2.pillar-opener { margin-left: -14mm !important; margin-right: -14mm !important; }
```

Do not add `width: calc(100% + 28mm)` to these blocks; border-box computes their width. Preserve contextual-header variant rendering and stitching if selected. Covers and full bleed are optional design choices.

## Fonts, PDF content and visual verification

Wait for `document.fonts.ready` and image loading before measurement/export. Inspect actual page images for clipped tails, orphans, unreadable figures, missing marks and hierarchy. Parse page count and representative text with `pypdf`. A generated PDF is not proof that visual review happened.

Chromium's header/footer templates are isolated mini-documents without the body's CSS or `@font-face`. Use an available explicit system font there, or embed a deliberately supported font in that isolated context. Run `pdffonts` when available and compare actual fonts to the requested families. Unexpected Times fallback is a defect only when Times was not requested; do not declare a universal ban on a typeface. Check body and furniture separately.

## File size

Report actual bytes. Reduce size only when requested or necessary for a stated delivery limit. Work on copies, preserve alpha, and downsample only oversampled external rasters to at least twice their displayed pixel dimensions at target DPI. Browser-rendered PNGs may become larger when re-saved, so compare bytes. Optional Ghostscript compression:

```bash
gs -sDEVICE=pdfwrite -dPDFSETTINGS=/printer -dNOPAUSE -dQUIET -dBATCH \
  -sOutputFile=output-compressed.pdf output.pdf
```

Measure the result and inspect quality. Keep the smaller version only if it preserves readability and required fidelity. No percentage saving is guaranteed.

Keep source Markdown/HTML, reviewed brand input pointer, asset provenance, exported PDF, and actual verification receipt together. Mark unavailable checks pending. Rendering does not imply authorization to publish, send, upload, or modify durable context.
