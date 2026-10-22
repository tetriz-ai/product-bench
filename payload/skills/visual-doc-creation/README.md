# Visual document rendering resources

A portable Markdown/HTML-to-PDF toolkit with neutral preview styling and task-supplied branding. It contains no company decision history or required product architecture.

| Resource | Purpose |
|---|---|
| [SKILL.md](SKILL.md) | Entry point, rendering routes and CLI contracts |
| [PRINCIPLES.md](PRINCIPLES.md) | Pagination, images, fonts, fit, full bleed and file-size mechanics |
| [DECISIONS.md](DECISIONS.md) | General renderer constraints |
| [HEURISTICS.md](HEURISTICS.md) | Optional layout selection guidance |
| [BRAND-CONFIG.md](BRAND-CONFIG.md) | Reuse reviewed identity, typography and tokens |
| [TEMPLATE.html](TEMPLATE.html) | Neutral fixed-page starter; copy before adaptation |
| [brand-system.css](brand-system.css) / [fixed-page.css](fixed-page.css) | Neutral layout primitives and compatibility aliases |
| [flow_renderer.py](flow_renderer.py) | Flowing Markdown renderer and library configuration |
| [build_trial_report.py](build_trial_report.py) | Contract-based table report with fit check |
| [brand_config.py](brand_config.py) / [brand-config.example.json](brand-config.example.json) | Configuration loader and neutral example |
| [requirements.txt](requirements.txt) | Python dependencies; Playwright also needs Chromium |
| [assets/neutral-mark.svg](assets/neutral-mark.svg) | Draft mark |

Legacy CSS/config names remain for source compatibility. They denote layout geometry only. Finished source, asset provenance and verification belong beside each output. Ordinary builds do not mutate installed skill defaults or append private design history here.
