---
name: slide-deck
description: Render slide-schema JSON through a bundled HTML Pattern Library to per-slide PNGs and a PDF, with optional authorized collaboration upload. Use for actual slide production after content and claims are approved.
---

# Slide Deck Rendering Skill

> Render approved deck content using optional layout structures. Inherit task-supplied or reviewed brand context for typography, palette, marks and surface choices. With absent brand inputs, produce neutral previews and flag the final fidelity gap; do not start a separate setup questionnaire.

---

## What this skill owns

1. **Schema → HTML** — populating Pattern Library templates from approved JSON
2. **Playwright rendering** — PNG per slide (Figma upload) + PDF (final delivery)
3. **Figma upload** — creating the collaboration file

## What this skill does NOT own

- Content planning and claims approval — use the reviewed task inputs
- New factual or product claims — require evidence from the task
- A universal brand system — adapt copied layout samples to the approved identity

---

## Pattern Library reference

Optional structural layout samples live in [Pattern-Library.html](Pattern-Library.html), bundled with this skill. Reuse reviewed brand identity/tokens using [BRAND-CONFIG.md](BRAND-CONFIG.md); the library's neutral text is structural reference only. The bundled library implements 21 concrete template keys, while [slide-types.md](slide-types.md) and [slide-schema.md](slide-schema.md) preserve the broader layout taxonomy. Before HTML authoring, inspect `data-pat-fn` keys and flag absent templates. Use a task-authorized alternate or report missing coverage; do not claim unsupported layouts were bundled or silently invent them. `bigStat·numeral·forest` is the bundled concrete block for the schema's `bigStat·numeral` forest variant.

**Canvas invariant and sample geometry:**
- Slide canvas: `width: 960px; height: 540px`
- Fonts: approved brand declarations and assets govern display, numerals and body. Neutral defaults use system fonts without network requests. Verify actual loaded and embedded fonts before claiming fidelity.
- Surfaces: `canvas` and `dark` use approved light/dark tokens. Legacy `forest` means dark only; it carries no forest palette. No surface cadence or dark cover is required.
- Dark slides get `.dark` on `.slide`; `.forest` remains a compatibility alias. Optional texture, background numerals and decorative marks need approved brand context. Use approved supplied icons when needed; arrows are diagram geometry choices, not a required identity.
The following shell dimensions are reusable starting geometry, adjustable for approved brand furniture while preserving the canvas and fit checks.

- Content area: `position: absolute; top: 68px; left: 64px; right: 64px; bottom: 42px` (with standard header + footer)
- Header: wordmark left, section label right, 1px `var(--t100)` rule at y=60
- Footer: cobrand left, page number right, 34px tall

---

## Phase 5A — Working directory

```bash
mkdir -p working/drafts/{client}/deck/slides/
cp <installed-skill>/Pattern-Library.html working/drafts/{client}/deck/_pattern-ref.html
```

Write `schema.json` (the full approved schema) to `working/drafts/{client}/deck/schema.json`.

---

## Phase 5B — Schema → HTML (`deck.html`)

Generate a single `deck.html` file. Structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<!-- Add approved local font assets only when supplied by brand context. -->
<style>
/* Copy layout CSS from Pattern Library, then apply brand_css(load_brand(path)). */
/* Adapt sample styling and inline SVG/HTML surface treatments to approved branding. */
/* Then add: */
body { margin: 0; background: #0d0d0d; }
.slide-page { margin: 0 auto 32px; display: block; }
@media print {
  .slide-page { page-break-after: always; margin: 0; }
  body { background: white; }
}
</style>
</head>
<body>
<!-- slides injected here -->
</body>
</html>
```

For each slide in `schema.slides[]`:

1. Look up the template name in `slide-types.md`
2. Find the corresponding HTML block in the Pattern Library (search by `pat-fn` label)
3. Copy that HTML block into a `<div class="slide-page">` wrapper
4. Inject content using the field map below
5. Apply the approved surface: remove copied sample surface classes, then add `dark` for `surface: "dark"` or legacy `"forest"`; leave light slides without either class. Adapt inline contrasting ink to match.
6. Set header section label to the slide's `section` field
7. Set approved header/footer identity and contact/classification content. Use a co-brand lockup or separator only when approved; place page numbers if `deck.page_numbers: true`.

### Content field injection map

| Schema field | Pattern Library target | Notes |
|---|---|---|
| `headline` | `.h1` element | Max per slide-types.md limit |
| `eyebrow` | `.ey` element | Plain text; add a mark only when approved branding requests it |
| `number` | Display-font numeral element | `.bsn-num`, `.hm-num`, `.ms-num`, etc. |
| `subhead` | `.sub` element | |
| `source` | `.src` element | Always present if a stat appears |
| `kicker` | `.bsn-kicker` or equivalent | |
| `quotes[]` | Quote card elements | In order; each has `.text` and `.attr` |
| `bullets[]` | Bullet list items | `.stmt-bullet-t` wrapped in `.stmt-bullet` |
| `body` | `.it-body`, `.ci-panel-body`, etc. | Prose fields |
| `image_path` | Replace `.ph` placeholder div | `<img src="{path}" style="width:100%;height:100%;object-fit:cover;">` |
| `stat` | Relevant numeral element | |
| `items[]` | Grid/card/row items | Per-template structure |
| `speaker_note` | HTML comment `<!-- NOTE: ... -->` | Not rendered on slide |

### Surface-specific overrides

Use approved contrasting ink and semantic muted tokens for each surface. Adjust copied inline color treatments, including SVG text and charts, to match. Do not impose the sample dark treatment on covers or dividers.

---

## Phase 5C — PNG rendering per slide

```python
from playwright.sync_api import sync_playwright
import os, pathlib

def render_slide_pngs(html_path: str, output_dir: str):
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": 960, "height": 540})
        page.goto(f"file://{pathlib.Path(html_path).resolve()}")
        page.wait_for_load_state("networkidle")

        slides = page.query_selector_all(".slide-page")
        for i, slide in enumerate(slides):
            slide_id = f"S{i+1:02d}"
            slide.screenshot(path=f"{output_dir}/{slide_id}.png")
            print(f"Rendered {slide_id}")

        browser.close()
```

Output: `working/drafts/{client}/deck/slides/S01.png` through `S{N}.png`

---

## Phase 5D — PDF rendering

**Primary path — Chrome headless:**
```bash
cd working/drafts/{client}/deck/
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --no-pdf-header-footer --no-margins \
  --virtual-time-budget=10000 \
  --print-to-pdf="product-{client}-{type}.pdf" \
  "file://$PWD/deck.html"
```

**Fallback — Playwright:**
```python
page.pdf(
    path="product-{client}-{type}.pdf",
    width="960px", height="540px",
    print_background=True
)
```

If PDF size exceeds 15MB, offer downsampling:
```bash
gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook \
   -dNOPAUSE -dBATCH \
   -sOutputFile=product-{client}-{type}-compressed.pdf \
   product-{client}-{type}.pdf
```

---

## Phase 6 — Figma upload

**Boundary rule (enforce before sharing the link):** Figma is for comments and review only. Any pixel edits made in Figma will be silently overwritten if the HTML renderer re-renders. This is not a preference — it is a technical consequence of the PNG-fill model. Communicate this to the team before sharing the link.

### Step 1: Check collaboration authorization and capabilities
Only upload when the user explicitly requests external collaboration and the destination/source scope is authorized. Discover the currently available purpose-built Figma tools and read their applicable instructions. Do not assume legacy tool names or account sessions exist.

### Steps 2–5: Create and populate the collaboration file

Resolve account/plan context through actual tools, create the approved file, capture its real file key and URL, and upload the rendered slide PNGs as image-fill frames. Frame names must use schema `id`, template and a short headline rather than DOM integers. If the tool requires a destination node, create the frames first. Add a description pointing to the source `schema.json`, render date and slide count, explaining that pixel edits will be overwritten on re-render. A tool result or skipped phase must be reported honestly.

### Step 6: Return share link
Return the actual Figma file URL and state that PNG-fill edits are overwritten on re-render.

---

## Error handling

| Error | Action |
|---|---|
| Asset path in manifest not found | Report the missing approved asset and keep final export pending. Use labeled placeholders only in explicitly requested drafts. |
| Template name not in Pattern Library | Report the missing concrete template and return to template planning. Use a reviewed alternate only; preserve the schema taxonomy without claiming bundled coverage. |
| Playwright fails | Try Chrome headless. If both fail, output `deck.html` and instruct user to open in browser + print to PDF. |
| Figma MCP unavailable | Skip Phase 6. Provide the PNG files zipped: `slides.zip`. Note that team should open `deck.html` locally for review. |
| Schema field exceeds word limit | **Keep final export pending and return to approved copy** — do not auto-truncate. Truncating copy mid-sentence on a customer deck is worse than blocking. Report: "Slide S{N} `headline` is {X} words, limit is {Y}. Please shorten." |
| Font not loading | Use the approved brand font assets or stylesheet supplied in context. If unavailable, render a system-font preview and report the fidelity gap; the Pattern Library carries no required font provider. |

## Portable executable export

Author the schema-specific HTML using the injection map above and the full contracts in `slide-schema.md`. Schema-to-HTML authoring is instruction-driven; no universal schema compiler is bundled. [render_deck.py](render_deck.py) validates approved schema/DOM slide identities, measures canvas bounds, exports PNGs named by schema IDs and a 960×540 PDF, then checks actual PDF pages. It accepts an already authored `deck.html` and schema. Run:

```bash
python3 <installed-skill>/render_deck.py --html /absolute/deck.html \
  --schema /absolute/schema.json --out /absolute/deck-output
```

Use `data-slide-id="S01"` on each `.slide-page`; each wrapper contains exactly one `.slide`. Read [requirements.txt](requirements.txt) for dependencies. Missing rendering dependencies leave exports pending, and successful machine output does not replace visual page inspection.
