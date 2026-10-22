# Slide Types — Template Taxonomy

> Optional structural choices for approved deck content. Template keys are exact schema identifiers; examples do not prescribe a brand or narrative. Counts and copy limits describe these geometries, not every possible deck.

---

## How to pick a template

1. **What is the communicative intent?** (growth, comparison, set, hero metric, sequence, etc.)
2. **How many content items?** (one stat vs. four, one quote vs. six)
3. **What surface fits approved brand context?** (`canvas` = light, `dark` = dark; legacy `forest` means dark only).

Group layouts by communicative intent, then choose geometry that fits the reviewed content. Surface, typography, marks and decorations come from approved brand context. The operator numbers below are taxonomy labels, not a required presentation framework.

---

## Template index

### Foundation — optional opening, transitions and closing

| Template | Use when | Surface | Slides per deck |
|---|---|---|---|
| `cover` | Opening slide | brand choice | 1 |
| `divider` | Section transition | dark | 1 per section |
| `indexForest` | Contents page, bold decks | dark | 0–1 |
| `indexGrid` | Contents page, 6 sections | canvas | 0–1 |
| `close·A` | Strong closing statement, minimal | dark | 0–1 |
| `close·B` | Closing with numbered action list | canvas | 0–1 |
| `close·C` | 3-column close: argument + proof + CTA | canvas | 0–1 |
| `close·D` | Personal close with quote + thank you | dark | 0–1 |

Use a cover, closing slide or section divider when the requested format and narrative benefit from it; no fixed counts are required.

---

### Numbers that land — operator 09 (Hero) + 01 (Growth)

| Template | Use when | Surface | Content |
|---|---|---|---|
| `bigStat·numeral` | One stat IS the slide — 42%, $12M, 3× | canvas or dark | 1 number + kicker + source |
| `bigStat·eras` | One big number + era timeline | canvas | number + band + 3 eras |
| `heroMetric` | Maximum impact, one oversized number centred | canvas or dark | number + label + subtext |
| `multiStat` | 3–4 stats of equal weight | canvas | 3–4 stat objects |
| `statGrid·forest` | 4 stats in 2×2, section anchor left | dark | anchor text + 4 cells |
| `statGrid·canvas` | 4 stats in 2×2, lighter treatment | canvas | anchor text + 4 cells |

**Picking between them:**
- One stat that deserves the whole slide → `bigStat·numeral` or `heroMetric`
- One stat + historical context → `bigStat·eras`
- Multiple stats at equal weight → `multiStat` (≤4 stats) or `statGrid` (exactly 4)

---

### Charts — operator 01 (Growth) + 07 (Flow) + 11 (Positioning)

| Template | Use when | Content |
|---|---|---|
| `curveZone` | Adoption curve + shaded cost-leak zone | stages (4) + zone label |
| `liftCurve` | Two trajectories: today vs. with Product | stages (4) + lift label + curve labels |
| `gapBars` | Grouped vertical bars comparing two metrics by cohort | groups (2–4) + legend + source |
| `gapDelta` | Horizontal paired bars + alarm gap bridge | rows (2–4) |
| `magnitude` | Horizontal scale bars comparing time/cost | rows (4–6) |
| `funnel` | Tapering bars showing adoption funnel | rows (4) |
| `twoByTwo` | 2×2 positioning matrix with dots | x-axis + y-axis + points (2–5) |
| `chartInsights` | Any chart + "Insights" interpretation panel right | chart image + 2–3 paragraphs |
| `stepsBarChart` | Stage icons + bar chart showing distribution | stages (4) + bars (4) |

**When to use `chartInsights`:** when the chart needs interpretation and you don't want the audience guessing the "so what." Put the chart in the left 65% and the interpretation in the right panel.

---

### Comparison — operator 03

| Template | Use when | Content |
|---|---|---|
| `matrix` | Capability comparison (✓/○/✗ marks) | columns (3) + rows (4–6) |
| `compareCols` | "What each observer sees" — 3 side-by-side | columns (exactly 3) + verdict per column |
| `layered` | Technology stack / hierarchy (3 layers) | layers (exactly 3) |
| `partnershipMirror·V2` | Two parties contributing different things | left column + right column |

**Rule:** `matrix` for feature presence/absence. `compareCols` for scenario-based "who sees what." `layered` for platform stack hierarchy.

---

### Quotes — operator 08 (Set)

| Template | Use when | Content |
|---|---|---|
| `quoteWall·A` | One voice dominates, four support | 1 big quote + 4 small cards |
| `quoteWall·B` | Five voices, equal weight, horizontal | 5 quotes |
| `quoteWall·C` | Six voices, grid format | 6 quotes |
| `quoteWall·D` | One voice, high editorial weight + context stat | 1 quote + rings visual + 1 stat |
| `quoteWall·E` | One voice, maximum impact, dark full-bleed | 1 quote |

**Picking between them:**
- Best single quote that summarises everything → `quoteWall·E` (dark, big)
- Want one lead voice + supporting voices → `quoteWall·A`
- All voices equally important → `quoteWall·B` or `C`
- One voice needs a supporting data point → `quoteWall·D`

**Quote sourcing rule:** use the reviewed evidence supplied for this task; label synthetic quotes "Illustrative." Never fabricate attribution.

---

### Process — operator 02 (Sequence) + 06 (Cycle)

| Template | Use when | Content |
|---|---|---|
| `steps` | 3–5 numbered stages on a rail | steps (3–5) |
| `stepsGrid` | 4 principles/steps as cards in 2×2 | cards (4) |
| `stepsVertical` | 3 stages with more content per stage | steps (3) |
| `milestoneTimeline` | Horizontal roadmap / rollout plan | milestones (4–5) |
| `cascade` | Sequential steps with arrows | steps (3–6) |
| `lifecycleLoop` | Plan-to-ship loop with gap flagged | stages (5–6) + tools row |
| `phaseArrows` | 3 delivery phases with checklist per phase | phases (3) + checklists |
| `workstreamRows` | 4–6 workstreams with description | rows (4–6) |

**Picking between them:**
- Ordered stages of equal weight → `steps`
- Stages with more prose per step → `stepsVertical`
- Principles or "how it works" cards → `stepsGrid`
- Time-based roadmap → `milestoneTimeline`
- Technical signal cascade → `cascade`
- Full lifecycle view → `lifecycleLoop`

---

### Statements — operator 09

| Template | Use when | Surface |
|---|---|---|
| `statement·canvas` | Claim + optional bullets, working slide | canvas |
| `statement·forest·big` | One oversized claim, impact beat | dark |
| `statement·forest·bullets` | Sensitive/in-person content + bullets | dark |

---

### Evidence — operator 10

| Template | Use when | Content |
|---|---|---|
| `dashboard` | Product screenshot in MacBook frame | screenshot path or null (renders placeholder) |
| `imageText·A` | Left image + right text + stats | image + headline + body + 2 stats |
| `imageText·B` | Full-bleed section opener with image | image + headline + body |
| `imageText·C` | Right image + left text | image + headline + body + stats |
| `thread` | Running quote badge across related slides | Optional 3-slide set: `thread·1`, `thread·2`, `thread·3` |

**Rule:** `dashboard` always sets `illustrative: true` unless an actual customer screenshot is provided and confirmed. Never render a fabricated dashboard.

---

### People — operator 08

| Template | Use when | Content |
|---|---|---|
| `team·A` | Four-person team strip | 4 people, reviewed content |
| `team·B` | Expert / interviewee grid | 6 people, photo circles + role |
| `peopleGrid·forest` | Same as team·B, dark surface | 6 people |
| `persona` | IC / EM / CTO role cards | 3 role cards |

**Rule for `team·A`:** use reviewed team content in approved order. Do not invent people, employers, or credentials. The four-slot geometry does not determine a real team size.

---

### Governance

| Template | Use when | Content |
|---|---|---|
| `governanceGrid` | Five governance or security features | 5 feature cards with category, title, description, prevents |

The five-card geometry can present reviewed governance or security features. Feature names, claims and placement come from the task; the layout supplies no security framework or product capabilities.

---

### Diagrams — operator 04 (Composition)

| Template | Use when | Content |
|---|---|---|
| `triangleLoop` | 3 interlocked forces | 3 arm labels + centre label |
| `circleLoop` | Cycle of 3 stages | 3 nodes + centre label |
| `vennLoop` | 3 overlapping capabilities | 3 circles + right checklist |
| `connectedDonut` | Hub + 3 satellite components | hub + 3 satellite cards |
| `hubSpoke4` | Centre platform + 4 outcomes | centre + 4 satellite circles |
| `diamondPrinciples` | 5 design principles | 5 diamonds + description circles |
| `insightsImplications` | Insight → design implication pairs | header bands + 5 row pairs |

**Example layout uses:** `triangleLoop` (three related forces), `vennLoop` (overlapping capabilities), `hubSpoke4` (four outcomes). Supply labels from reviewed task content.

---

## Content limits summary

| Element | Hard limit |
|---|---|
| Slide headline | 18 words max (14 preferred) |
| Subhead / lede | 12 words max |
| Bullet text | 15 words max |
| Quote (big) | 35 words max |
| Quote (small) | 20 words max |
| Stat kicker | 12 words max |
| Source line | No limit — 8–9pt display |
| Speaker note | 1 sentence |
| Steps per steps template | 3–5 |
| Stats per multiStat | 3–4 |
| Cells per statGrid | exactly 4 |
| Quotes per quoteWall·B | exactly 5 |
| Quotes per quoteWall·C | exactly 6 |

---

## Surface choices

`canvas` uses the approved light surface and ink; `dark` uses the approved dark surface and contrasting ink. `forest` in legacy keys, classes or surface values is a compatibility alias for dark, not a forest palette. The table records sample treatments; covers, dividers and body slides can use either surface when the approved identity supports it. No alternation or cadence is mandatory. Neutral previews use slate and system fonts without external font fetches.

---

## Template selection anti-patterns

**Don't:**
- Use `heroMetric` (dark full-bleed number) for anything other than a single oversized stat — it reads as an impact beat, not a supporting slide
- Stack two `quoteWall` slides back to back — vary the format
- Use `matrix` for more than 6 rows — it becomes unreadable
- Put prose body copy on a `bigStat` slide — the number should dominate
- Use `dashboard` with `illustrative: false` unless a real screenshot exists at the specified path
- Add closing slides that do not serve the requested narrative

**Do:**
- Choose surfaces and rhythm from approved brand context and the content
- Use `chartInsights` whenever a chart needs interpretation (it forces the "so what")
- Place a team slide where it supports the reviewed narrative
- Use `cascade` for a reviewed sequence or dependency chain

All numbers and framework labels in this schema reference are fictional shape examples, not claims or approved company defaults.
