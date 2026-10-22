# Slide Schema Spec

> Contract for decks using this renderer. Author approved content as JSON before HTML rendering; optional collaboration labels reuse schema identities. Template geometry does not prescribe a brand, product framework or narrative.

---

All typography, palette, marks, surface treatments and optional eyebrow decoration inherit approved brand context. Legacy template names containing `forest` denote a dark treatment only. These contracts preserve geometry and copy limits without imposing their sample visual styling.

## Top-level structure

```json
{
  "deck": {
    "title": "string — deck title for the cover slide",
    "client": "string | null",
    "cobrand": "string | null — partner/client name for co-brand lockup",
    "type": "pitch | sales | partner | qbr",
    "sender": "email — appears in footer",
    "theme": "no-nav-strip | nav-strip",
    "page_numbers": true,
    "date": "YYYY-MM-DD",
    "version": 1
  },
  "slides": [ /* slide objects, ordered */ ]
}
```

---

## Slide object

```json
{
  "id": "S01",
  "template": "string — full dotted key from slide-types.md, e.g. 'bigStat·numeral', 'cover·A', 'quoteWall·B'. Never bare (no 'bigStat' alone). Never with a separate variant field.",
  "surface": "canvas | dark | forest — forest is a legacy alias for dark",
  "section": "string — section label for header right slot (e.g. 'Section 1 · Macro')",
  "act": "string | number | null — optional task-specific narrative grouping",
  "content": { /* template-specific fields — see per-template content contracts below */ },
  "speaker_note": "string — one sentence for the presenter. What to say, not what the slide shows."
}
```

**Template naming rule:** `template` is always the full dotted key. `bigStat·numeral` not `bigStat` + variant. `cover·A` not `cover` + variant. HTML authoring uses this exact string to look up the block; the export helper validates schema/DOM slide identities.

---

## Per-template content contracts

Only the fields listed per template are valid. Do not add fields the renderer doesn't consume.

### `cover` (variants A, B, C, D, E)

```json
{
  "headline": "string — max 12 words",
  "subtitle": "string — max 10 words | null",
  "meta": "string — date + confidentiality line | null",
  "cobrand_label": "string — shown top-right on covers when used | null"
}
```

### `divider`

```json
{
  "section_number": "string — e.g. '01', '02'",
  "section_title": "string — max 4 words"
}
```

### `bigStat·numeral`

```json
{
  "eyebrow": "string",
  "number": "string — e.g. '42%', '$12M', '3×'",
  "kicker": "string — max 12 words",
  "source": "string — source line, 8–9pt display"
}
```

### `bigStat·eras`

```json
{
  "eyebrow": "string",
  "headline": "string — max 16 words",
  "number": "string",
  "number_label": "string — what the number is",
  "source": "string",
  "eras": [
    { "label": "string", "value": "string", "alarm": false },
    { "label": "string", "value": "string", "alarm": false },
    { "label": "string", "value": "string", "alarm": true }
  ]
}
```

### `heroMetric` (sample dark treatment)

```json
{
  "number": "string",
  "rule_width": 72,
  "label": "string — max 10 words",
  "subtext": "string — source or context | null"
}
```

### `multiStat`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "subhead": "string — max 12 words | null",
  "stats": [
    { "number": "string", "description": "string — max 8 words", "alarm": false }
  ],
  "source": "string"
}
```

Note: 3–4 stats only. `alarm: true` renders the number in `var(--alarm)`.

### `statGrid` (variants: `forest`, `canvas`)

```json
{
  "eyebrow": "string",
  "section_number": "string — e.g. '03'",
  "anchor_title": "string — max 12 words, left column",
  "cells": [
    { "eyebrow": "string", "number": "string", "body": "string — max 10 words", "alarm": false }
  ]
}
```

Note: exactly 4 cells (2×2 grid).

### `curveZone`

```json
{
  "eyebrow": "string",
  "headline": "string — max 18 words",
  "subhead": "string — max 12 words | null",
  "zone_label": "string — e.g. 'COST-LEAK ZONE'",
  "zone_sublabel": "string — e.g. 'tokens & licenses paid, outcomes unmeasured' | null",
  "stages": ["Experimenting", "Adopting", "Mastering", "Leading"]
}
```

Note: SVG inline — no external asset required.

### `liftCurve`

```json
{
  "eyebrow": "string",
  "headline": "string — max 16 words",
  "subhead": "string — max 12 words | null",
  "lift_label": "string — label on the lift callout box",
  "product_label": "string — label on the upper curve",
  "today_label": "string — label on the dashed lower curve",
  "zone_label": "COST-LEAK ZONE",
  "stages": ["Experimenting", "Adopting", "Mastering", "Leading"]
}
```

### `gapBars`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "subhead": "string — max 10 words | null",
  "groups": [
    {
      "label": "string",
      "sublabel": "string | null",
      "bars": [
        { "value_pct": 60, "label": "60%", "color": "t700" },
        { "value_pct": 40, "label": "40%", "color": "t300" }
      ]
    }
  ],
  "legend": [
    { "color": "t700", "label": "Speed-positive" },
    { "color": "t300", "label": "Quality-positive" }
  ],
  "source": "string"
}
```

### `gapDelta`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "rows": [
    {
      "label": "string",
      "sublabel": "string | null",
      "top_bar": { "width_pct": 60, "label": "60% sample A", "color": "t700" },
      "bottom_bar": { "width_pct": 40, "label": "40% sample B", "color": "t300" },
      "gap": { "start_pct": 40, "width_pct": 20, "label": "SAMPLE GAP · 20 pp" }
    }
  ]
}
```

### `matrix`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "columns": [
    { "label": "string", "sublabel": "string | null", "win": false }
  ],
  "rows": [
    {
      "capability": "string — max 6 words",
      "cells": [ "full | half | none" ]
    }
  ]
}
```

Note: `win: true` marks an evidenced advantage where appropriate. Up to 5 rows.

### `compareCols`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "subhead": "string | null",
  "columns": [
    {
      "name": "string",
      "sublabel": "string | null",
      "win": false,
      "items": [ { "text": "string", "cant": false } ],
      "verdict": "string",
      "verdict_win": false
    }
  ]
}
```

Note: exactly 3 columns. `win: true` marks an evidenced advantage where appropriate; it is not automatically assigned to any product.

### `quoteWall·A` (1 big + 4 small)

```json
{
  "headline": "string — max 12 words",
  "big_quote": { "text": "string — max 30 words", "name": "string", "role": "string" },
  "small_quotes": [
    { "text": "string — max 20 words", "attribution": "string" }
  ]
}
```

Note: exactly 4 small quotes.

### `quoteWall·B` (5 equal)

```json
{
  "eyebrow": "string",
  "headline": "string — max 12 words",
  "quotes": [
    { "text": "string — max 20 words", "attribution": "string — role · org" }
  ]
}
```

Note: exactly 5 quotes.

### `quoteWall·C` (3×2 grid, 6 quotes)

```json
{
  "headline": "string — max 12 words",
  "quotes": [
    { "text": "string — max 15 words", "attribution": "string" }
  ]
}
```

Note: exactly 6 quotes.

### `quoteWall·D` (single editorial + rings + stat)

```json
{
  "quote": "string — max 35 words",
  "name": "string",
  "role": "string",
  "context_eyebrow": "string — e.g. 'Pilot cohort'",
  "context_value": "string — e.g. '6/6'",
  "context_description": "string — max 8 words"
}
```

### `quoteWall·E` (sample dark full-bleed, single)

```json
{
  "quote": "string — max 25 words",
  "name": "string",
  "role": "string"
}
```

### `statement·canvas`

```json
{
  "eyebrow": "string",
  "headline": "string — max 20 words",
  "subhead": "string — max 14 words | null",
  "bullets": [
    { "text": "string — max 15 words" }
  ]
}
```

Note: 0–3 bullets. Omit `bullets` key entirely if none.

### `statement·forest·big`

```json
{
  "headline": "string — max 10 words, large display",
  "subhead": "string — max 12 words | null",
  "source": "string — VERIFY tag if unconfirmed | null"
}
```

### `statement·forest·bullets`

```json
{
  "tag": "string | null — e.g. 'IN-PERSON', renders as alarm pill",
  "headline": "string — max 12 words",
  "bullets": [
    { "text": "string — max 18 words" }
  ]
}
```

### `steps`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "subhead": "string — max 12 words | null",
  "steps": [
    { "number": "01", "label": "string — max 3 words", "description": "string — max 8 words", "good": false }
  ]
}
```

Note: 3–5 steps. `good: true` renders the step circle in `var(--positive)`.

### `stepsGrid` (2×2 card grid)

```json
{
  "eyebrow": "string",
  "headline": "string — max 10 words",
  "cards": [
    { "number": "01", "title": "string — max 5 words", "body": "string — max 15 words", "dark": false }
  ]
}
```

Note: exactly 4 cards. `dark: true` on one card uses the approved dark surface.

### `stepsVertical`

```json
{
  "eyebrow": "string",
  "anchor_title": "string — left column, max 8 words",
  "anchor_body": "string — left column, max 20 words | null",
  "steps": [
    {
      "number": "1",
      "color": "t700 | t500 | t300",
      "title": "string — max 5 words",
      "body": "string — max 15 words",
      "chip": "string — e.g. 'Week 1–2' | null"
    }
  ]
}
```

Note: exactly 3 steps.

### `milestoneTimeline`

```json
{
  "eyebrow": "string",
  "headline": "string — max 12 words",
  "milestones": [
    {
      "label": "string — e.g. 'Day 1'",
      "title": "string — max 4 words",
      "position": "above | below",
      "active": false,
      "future": false
    }
  ]
}
```

Note: 4–5 milestones. Alternating above/below.

### `cascade`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "subhead": "string — max 12 words | null",
  "steps": [
    { "label": "string — max 3 words" }
  ],
  "note": "string — max 15 words | null"
}
```

Note: 3–6 steps.

### `lifecycleLoop`

```json
{
  "eyebrow": "string",
  "headline": "string — max 16 words",
  "subhead": "string — max 12 words | null",
  "stages": [
    { "label": "string", "gap": false }
  ],
  "tools": [
    { "label": "string", "sublabel": "string", "gap": false }
  ]
}
```

Note: stage with `gap: true` renders in `var(--alarm)`.

### `layered`

```json
{
  "eyebrow": "string",
  "headline": "string — max 12 words",
  "layers": [
    { "label": "string", "sublabel": "string | null", "dark": false }
  ]
}
```

Note: exactly 3 layers. Middle layer `dark: true` = approved dark background.

### `persona`

```json
{
  "eyebrow": "string",
  "headline": "string — max 12 words",
  "subhead": "string — max 10 words | null",
  "cards": [
    {
      "role": "IC | EM | CTO",
      "sees": "string — max 15 words",
      "cannot_see": "string — max 12 words"
    }
  ],
  "trust_line": "string — e.g. 'Trust flows up: IC → EM → CTO' | null"
}
```

Note: exactly 3 cards.

### `governanceGrid`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "features": [
    {
      "category": "string — e.g. 'ACCESS'",
      "title": "string — max 3 words",
      "description": "string — max 15 words",
      "prevents": "string — max 5 words"
    }
  ]
}
```

Note: exactly 5 features.

### `dashboard`

```json
{
  "eyebrow": "string",
  "headline": "string — max 12 words",
  "subhead": "string — max 10 words | null",
  "image_path": "string — path to screenshot PNG | null",
  "illustrative": true
}
```

Note: if `image_path` is null, renders the MacBook mockup with a labeled placeholder. Always set `illustrative: true` unless a real customer screenshot is provided.

### `imageText·A` (left image 58% + right text)

```json
{
  "eyebrow": "string",
  "headline": "string — max 12 words",
  "body": "string — max 30 words",
  "image_path": "string | null",
  "stats": [
    { "number": "string", "label": "string — max 8 words", "alarm": false }
  ]
}
```

### `imageText·B` (full-bleed background)

```json
{
  "eyebrow": "string",
  "headline": "string — max 10 words",
  "body": "string — max 20 words | null",
  "image_path": "string | null"
}
```

### `twoByTwo`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "x_axis": "string — e.g. 'In 6 months →'",
  "y_axis": "string — e.g. 'Defensible position →'",
  "points": [
    { "label": "string", "x_pct": 62, "y_pct": 22, "win": true }
  ],
  "source": "string | null"
}
```

### `partnershipMirror·V2` (two-column split)

```json
{
  "headline": "string — max 10 words",
  "left": {
    "name": "Product",
    "items": [ "string — max 12 words" ]
  },
  "right": {
    "name": "string — partner name",
    "items": [ "string — max 12 words" ]
  }
}
```

### `close·A` (sample dark centred statement)

```json
{
  "headline": "string — max 14 words",
  "body": "string — max 35 words"
}
```

### `close·B` (left statement + right action list)

```json
{
  "eyebrow": "string",
  "headline": "string — max 8 words",
  "body": "string — max 30 words",
  "actions": [
    { "text": "string — max 15 words", "dark": false }
  ]
}
```

Note: 4–6 actions. One can have `dark: true` for emphasis.

### `close·C` (3-column: argument + proof + next step)

```json
{
  "argument_title": "string — max 8 words",
  "argument_body": "string — max 35 words",
  "proof_number": "string — e.g. '3×'",
  "proof_label": "string — max 8 words",
  "proof_source": "string — VERIFY / Illustrative note",
  "next_step_title": "string — max 8 words",
  "next_step_items": [ "string — max 6 words" ],
  "cta": "string — max 6 words"
}
```

### `close·D` (sample dark: quote + thank you)

```json
{
  "quote": "string — max 20 words",
  "name": "string",
  "role": "string",
  "thank_you": "Thank you.",
  "contact": "string — e.g. 'contact@example.invalid · example.invalid'"
}
```

### `team·A` (founder strip)

```json
{
  "eyebrow": "string",
  "headline": "string — max 12 words",
  "subhead": "string — max 8 words | null",
  "founders": [
    { "name": "string", "role": "Co-founder", "company": "string — prior company" }
  ]
}
```

Note: the strip has four slots. Populate only reviewed, approved team records; choose another layout if the real team shape differs.

### `indexForest` (dark numbered contents)

```json
{
  "sections": [
    { "number": "01", "title": "string — max 6 words", "page": "string | null" }
  ]
}
```

Note: 4–5 sections.

### `indexGrid` (6-section typographic grid)

```json
{
  "sections": [
    { "number": "01", "title": "string — max 5 words", "description": "string — max 12 words", "color": "approved brand hex color" }
  ]
}
```

Note: exactly 6 sections.

---

## Additional template contracts

The following layouts extend the structural taxonomy. Check bundled HTML coverage before selecting them.

### `chartInsights`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words (rendered above the chart panel)",
  "chart_image_path": "string — path to a pre-rendered chart PNG | null (renders placeholder)",
  "chart_label": "string — label under the placeholder | null",
  "insights": [
    "string — max 30 words per insight paragraph"
  ]
}
```

Note: 2–3 insight paragraphs. Chart occupies left 65%, insights panel right 35%.

### `magnitude`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "subhead": "string — max 12 words | null",
  "rows": [
    { "label": "string — max 4 words", "width_pct": 42, "value_label": "string — e.g. '12–18 months'", "alarm": false }
  ]
}
```

Note: 4–6 rows. `alarm: true` renders label + bar in `var(--alarm)`.

### `funnel`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "subhead": "string — max 10 words | null",
  "rows": [
    { "label": "string — max 3 words", "width_pct": 100, "note": "string — max 10 words", "color": "t900 | t700 | t500 | t300" }
  ]
}
```

Note: exactly 4 rows. Width percentage tapers: 100, ~62, ~40, ~26.

### `stepsBarChart`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "stages": [
    { "label": "string — max 2 words", "description": "string — max 8 words" }
  ],
  "bars": [
    { "value_pct": 14, "value_label": "14%", "color": "t300 | t500 | t700 | t200" }
  ]
}
```

Note: exactly 4 stages, exactly 4 bars (one per stage). Stages + bars arrays are parallel.

### `thread·1`, `thread·2`, `thread·3`

These samples offer a consistent right-side quote badge while the left content changes. A consecutive three-slide set is optional; use the sequence the reviewed narrative needs.

```json
{
  "badge_number": "1 | 2 | 3",
  "badge_quote": "string — max 25 words",
  "badge_attribution": "string — role · org",
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "subhead": "string — max 12 words | null",
  "stats": [
    { "number": "string", "label": "string — max 8 words" }
  ]
}
```

Note: The sample badge position identifies a selected item. Choose the number and order of slides from the reviewed narrative; a three-slide sequence is optional.

### `hubSpoke4`

```json
{
  "eyebrow": "string",
  "headline": "string — max 12 words",
  "center_label": "string — max 3 words (inside hub circle)",
  "satellites": [
    { "label": "string — max 3 words", "sublabel": "string — max 5 words | null" }
  ]
}
```

Note: exactly 4 satellites (top-left, top-right, bottom-left, bottom-right).

### `triangleLoop`

```json
{
  "center_label": "string — 2 words (inside white donut, split across 2 lines)",
  "arms": [
    { "label": "string — 1 word", "sublabel": "string — max 4 words" }
  ]
}
```

Note: exactly 3 arms. Labels and sublabels come from reviewed task content; no framework labels are supplied by the layout.

### `vennLoop`

```json
{
  "circles": [
    { "label": "string — max 3 words" }
  ],
  "checklist_title": "string — max 8 words",
  "checklist_items": [
    "string — max 10 words"
  ]
}
```

Note: exactly 3 circles and 4–5 checklist items. Use approved capability labels.

### `workstreamRows`

```json
{
  "eyebrow": "string",
  "headline": "string — max 10 words",
  "rows": [
    {
      "label": "string — max 4 words",
      "color": "t700 | t500 | t300 | t200 | t100",
      "points": [
        "string — max 15 words"
      ]
    }
  ]
}
```

Note: 4–6 rows, 2 points per row.

### `phaseArrows`

```json
{
  "eyebrow": "string",
  "headline": "string — max 12 words",
  "phases": [
    {
      "label": "string — max 4 words",
      "duration": "string — e.g. '+12 months' | null",
      "dark": false,
      "checklist": ["string — max 12 words"]
    }
  ]
}
```

Note: exactly 3 phases. `dark: true` on the current/active phase uses the approved dark surface.

### `imageText·C` (right image + left text)

```json
{
  "eyebrow": "string",
  "headline": "string — max 12 words",
  "body": "string — max 30 words",
  "image_path": "string | null",
  "stats": [
    { "number": "string", "label": "string — max 8 words", "alarm": false }
  ]
}
```

### `team·B` (2-col expert/interview grid, canvas)

```json
{
  "eyebrow": "string",
  "anchor_title": "string — max 4 words (left column heading)",
  "anchor_body": "string — max 30 words",
  "people": [
    { "name": "string", "role": "string", "org": "string" }
  ]
}
```

Note: exactly 6 people (3 rows × 2 cols) in this geometry. Replace photo placeholders with approved headshots during HTML authoring; do not present placeholders as final output.

### `insightsImplications`

```json
{
  "headline": "string — max 12 words",
  "left_header": "string — e.g. 'Key Insights'",
  "right_header": "string — e.g. 'Design Implications'",
  "rows": [
    {
      "insight_title": "string — max 3 words (bolded)",
      "insight_body": "string — max 15 words",
      "implication": "string — max 18 words"
    }
  ]
}
```

Note: exactly 5 rows.

### `governanceGrid`

```json
{
  "eyebrow": "string",
  "headline": "string — max 14 words",
  "features": [
    {
      "category": "string — e.g. 'ACCESS'",
      "title": "string — max 3 words",
      "description": "string — max 15 words",
      "prevents": "string — max 5 words"
    }
  ]
}
```

Note: exactly 5 features for this geometry. Supply reviewed features and evidence; the template implies no security capabilities.

---

## Schema validation checklist

Before rendering, confirm:
- [ ] Every `template` value is a **full dotted key** present in slide-types.md (e.g. `bigStat·numeral`, not `bigStat`)
- [ ] No slide has a `variant` field — this field is invalid; the variant is encoded in `template`
- [ ] Every `template` key has a content contract defined in this file (missing contracts = rendering failure)
- [ ] Every `image_path` file exists on disk (or field is null)
- [ ] No slide has a `headline` exceeding its word limit
- [ ] `quotes[]` arrays have exactly the required count per template
- [ ] All `source` fields are present on any slide containing a stat
- [ ] `speaker_note` is present on every slide
- [ ] `deck.sender` is a valid email address
- [ ] No text field contains an em-dash (use comma, colon, or parenthesis instead)
- [ ] No banned words from `voice-dna.md`

All numbers and framework labels in this schema reference are fictional shape examples, not claims or approved company defaults.
