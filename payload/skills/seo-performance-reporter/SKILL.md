---
name: seo-performance-reporter
description: 'Generate SEO/GEO dashboards: rankings, traffic, backlinks, AI visibility
  for stakeholders. SEO报告/绩效仪表盘'
license: Apache-2.0
metadata:
  product-bench-modifications: "Adapted host frontmatter, local resources/context, provider boundaries, and explicitly synthetic examples; retain upstream attribution and benchmark notices. See THIRD-PARTY-NOTICES.md."
  author: aaron-he-zhu
  version: 6.0.0
  geo-relevance: medium
  tags:
  - seo
  - geo
  - seo-reporting
  - performance-report
  - kpi-dashboard
  - traffic-report
  - monthly-report
  - stakeholder-report
  - SEO报告
  - SEOレポート
  - SEO리포트
  - informe-seo
  triggers:
  - generate SEO report
  - performance report
  - traffic report
  - SEO dashboard
  - SEO analytics
  - monthly report
  - report to stakeholders
  - monthly SEO report
  - show me my SEO results
  - present SEO results to my boss
  - report to my boss
  - monthly SEO summary
  - how are my SEO metrics
  - how is my SEO performing
  - SEO报告
  - 绩效仪表盘
  - 流量报告
  - 数据看板
  - 出SEO报告
  - 汇报给老板
  - 看看数据
  - 月报
  - 出月报
  - 周报
  - SEOレポート
  - パフォーマンスレポート
  - SEO 리포트
  - 성과 보고서
  - informe SEO
  - reporte de rendimiento
  - relatório SEO
  - SEO repoort
  compatibility: 'Claude Code ≥1.0, skills.sh marketplace, ClawHub marketplace, Vercel
    Labs skills ecosystem. No system packages required. Optional: MCP network access
    for SEO tool integrations.'
  homepage: https://github.com/aaron-he-zhu/seo-geo-claude-skills
  when_to_use: Use when generating SEO performance reports, traffic summaries, ranking
    reports, or stakeholder-facing dashboards.
  argument-hint: <domain> [date range]
---

## Product Bench integration

This bundled skill includes its full procedure and local supporting resources. Resolve product, audience, brand voice, and output/state locations from the caller and `.product-bench-install.json`; references to `CLAUDE.md` or upstream `memory/` describe the upstream context/state convention, not an additional canonical store to create automatically. Respect the invoking workflow's scope, approvals, and write boundary. In the blog workflow, Editorial Draft remains the writing engine; this skill supplies the requested SEO research or checks.

Tool placeholders such as `~~SEO tool`, `~~analytics`, `~~search console`, or `~~AI monitor` are optional provider categories, not installed APIs. Use only actually available authorized tools or supplied data. Separate measured/provider data, supplied estimates, qualitative judgments, and unmeasured fields; never fill missing metrics, scores, monitoring results, or citations from examples. Numeric examples, sample domains, and audit findings in this skill and its resources are invented illustrations, not observations about a real client. A completed rubric assessment may report its actual evidence and scoring, but it is not a search-provider measurement.

Local skill/resource links use the bundled copies. Shared contracts, complete CORE-EEAT/CITE benchmark definitions, connector specifications, wiki specification and wiki-lint execution instructions are bundled once under `seo-memory-management/upstream-shared/` and linked locally. Read the relevant reference before its dependent procedure. `/seo:wiki-lint` is a source command instruction contract, available through the bundled memory skill; it is not a registered Product Bench host command or executable collector. Upstream hook configuration is retained as reference material and is not automatically installed or active. Do not claim that an upstream command, provider adapter, hook or automated collector ran without actually executing an available authorized implementation.


# Performance Reporter


> **[SEO & GEO Skills Library](https://github.com/aaron-he-zhu/seo-geo-claude-skills)** · 20 skills for SEO + GEO · [ClawHub](https://clawhub.ai/u/aaron-he-zhu) · [skills.sh](https://skills.sh/aaron-he-zhu/seo-geo-claude-skills)
> **System Mode**: This monitoring skill follows the shared [Skill Contract](../seo-memory-management/upstream-shared/references/skill-contract.md) and [State Model](../seo-memory-management/upstream-shared/references/state-model.md).


This skill creates comprehensive SEO and GEO performance reports that combine multiple metrics into actionable insights. It produces executive summaries, detailed analyses, and visual data presentations for stakeholder communication.

**System role**: Monitoring layer skill. It turns performance changes into deltas, alerts, and next actions.

## When This Must Trigger

Use this when the conversation involves any of these situations — even if the user does not use SEO terminology:

Use this whenever the task needs time-aware change detection, escalation, or stakeholder-ready visibility.

- Monthly/quarterly SEO reporting
- Executive stakeholder updates
- Client reporting for agencies
- Tracking campaign performance
- Combining multiple SEO metrics
- Creating GEO visibility reports
- Documenting ROI from SEO efforts

## What This Skill Does

1. **Data Aggregation**: Combines multiple SEO data sources
2. **Trend Analysis**: Identifies patterns across metrics
3. **Executive Summaries**: Creates high-level overviews
4. **Visual Reports**: Presents data in clear formats
5. **Benchmark Comparison**: Tracks against goals and competitors
6. **Content Quality Tracking**: Integrates CORE-EEAT scores across audited pages
7. **ROI Calculation**: Measures SEO investment returns
8. **Recommendations**: Suggests actions based on data

## Quick Start

Start with one of these prompts. Finish with a short handoff summary using the repository format in [Skill Contract](../seo-memory-management/upstream-shared/references/skill-contract.md).

### Generate Performance Report

```
Create an SEO performance report for [domain] for [time period]
```

### Executive Summary

```
Generate an executive summary of SEO performance for [month/quarter]
```

### Specific Report Types

```
Create a GEO visibility report for [domain]
```

```
Generate a content performance report
```

## Skill Contract

**Expected output**: a delta summary, alert/report output, and a short handoff summary ready for `memory/monitoring/`.

- **Reads**: current metrics, previous baselines, alert thresholds, and reporting context from [CLAUDE.md](../seo-memory-management/upstream-shared/CLAUDE.md) and the shared [State Model](../seo-memory-management/upstream-shared/references/state-model.md) when available.
- **Writes**: a user-facing monitoring deliverable plus a reusable summary that can be stored under `memory/monitoring/`.
- **Promotes**: significant changes, confirmed anomalies, and follow-up actions to `memory/open-loops.md` and `memory/decisions.md`.
- **Next handoff**: use the `Next Best Skill` below when a change needs action.

## Data Sources

> **Note:** All integrations are optional. This skill works without any API keys — users provide data manually when no tools are connected.

> See [CONNECTORS.md](../seo-memory-management/upstream-shared/CONNECTORS.md) for tool category placeholders.

**With ~~analytics + ~~search console + ~~SEO tool + ~~AI monitor connected:**
Automatically aggregate traffic metrics from ~~analytics, search performance data from ~~search console, ranking and backlink data from ~~SEO tool, and GEO visibility metrics from ~~AI monitor. Creates comprehensive multi-source reports with historical trends.

**With manual data only:**
Ask the user to provide:
1. Analytics screenshots or traffic data export (sessions, users, conversions)
2. Search Console data (impressions, clicks, average position)
3. Keyword ranking data for the reporting period
4. Backlink metrics (referring domains, new/lost links)
5. Key performance indicators and goals for comparison
6. AI citation data if tracking GEO metrics

Proceed with the full analysis using provided data. Note in the output which metrics are from automated collection vs. user-provided data.

## Instructions

When a user requests a performance report:

1. **Define Report Parameters** -- Domain, report period, comparison period, report type (Monthly/Quarterly/Annual), audience (Executive/Technical/Client), focus areas.

2. **Create Executive Summary** -- Overall performance rating, key wins/watch areas/action required, metrics at a glance table (traffic, rankings, conversions, DA, AI citations), SEO ROI calculation.

3. **Report Organic Traffic Performance** -- Traffic overview (sessions, users, pageviews, bounce rate), traffic trend visualization, traffic by source/device, top performing pages.

4. **Report Keyword Rankings** -- Rankings overview by position range, distribution change visualization, top improvements and declines, SERP feature performance.

5. **Report GEO/AI Performance** -- AI citation overview, citations by topic, GEO wins, optimization opportunities.

6. **Report Domain Authority (CITE Score)** -- If a CITE audit has been run, include CITE dimension scores (C/I/T/E) with period-over-period trends and veto status. If no audit exists, note as "Not yet evaluated."

7. **Content Quality (CORE-EEAT Score)** -- If content-quality-auditor has been run, include average scores across all 8 CORE-EEAT dimensions with trends. If no audit exists, note as "Not yet evaluated."

8. **Report Backlink Performance** -- Link profile summary, weekly link acquisition, notable new links, competitive position.

9. **Report Content Performance** -- Publishing summary, top performing content, content needing attention, content ROI.

10. **Generate Recommendations** -- Immediate/short-term/long-term actions with priority, expected impact, and owner. Goals for next period.

11. **Compile Full Report** -- Combine all sections with table of contents, appendix (data sources, methodology, glossary).

   > **Reference**: See [references/report-output-templates.md](references/report-output-templates.md) for complete output templates for all 11 report sections.

## Validation Checkpoints

### Input Validation
- [ ] Reporting period clearly defined with comparison period
- [ ] All required data sources available or alternatives noted
- [ ] Target audience identified (executive/technical/client)
- [ ] Performance goals and KPIs established for benchmarking

### Output Validation
- [ ] Every metric cites its data source and collection date
- [ ] Trends include period-over-period comparisons
- [ ] Recommendations are specific, prioritized, and actionable
- [ ] Source of each data point clearly stated (~~analytics data, ~~search console data, ~~SEO tool data, user-provided, or estimated)

## Example

**User**: "Create a monthly SEO report for hosting.example.invalid for January 2025"

**Output** (abbreviated -- full report uses templates from all 11 steps):

```markdown
# CloudHosting SEO & GEO Performance Report — January 2025

## Executive Summary — Overall Performance: Good

| Metric | Jan 2025 | Dec 2024 | Change | Target | Status |
|--------|----------|----------|--------|--------|--------|
| Organic Traffic | 52,100 | 45,200 | +15.3% | 50,000 | On track |
| Keywords Top 10 | 87 | 79 | +8 | 90 | Watch |
| Organic Conversions | 684 | 612 | +11.8% | 700 | Watch |
| Domain Rating | 54 | 53 | +1 | 55 | Watch |
| AI Citations | 18 | 12 | +50.0% | 20 | Watch |

**SEO ROI**: $8,200 invested / $41,040 organic revenue = 400%

**Immediate**: Fix 37 crawl errors on /pricing/ pages
**This Month**: Optimize mobile LCP; publish 3 AI Overview comparison pages
**This Quarter**: Build Wikidata entry for CloudHost Inc.
```

## Tips for Success

1. **Lead with insights** - Start with what matters, not raw data
2. **Visualize data** - Charts and graphs improve comprehension
3. **Compare periods** - Context makes data meaningful
4. **Include actions** - Every report should drive decisions
5. **Customize for audience** - Executives need different info than technical teams
6. **Track GEO metrics** - AI visibility is increasingly important


### Save Results

After delivering monitoring data or reports to the user, ask:

> "Save these results for future sessions?"

If yes, write a dated summary to `memory/monitoring/YYYY-MM-DD-<topic>.md` containing:
- One-line headline finding or status change
- Top 3-5 actionable items
- Open loops or anomalies requiring follow-up
- Source data references

If any findings should influence ongoing strategy, recommend promoting key conclusions to `memory/hot-cache.md`.

## Reference Materials

- [Report Output Templates](references/report-output-templates.md) — Complete output templates for all 11 report sections
- [KPI Definitions](references/kpi-definitions.md) — SEO/GEO metric definitions with benchmarks, good ranges, warning thresholds, trend analysis, and attribution guidance
- [Report Templates by Audience](references/report-templates.md) — Copy-ready templates for executive, marketing, technical, and client audiences

## Next Best Skill

- **Primary**: [alert-manager](../seo-alert-manager/SKILL.md) — turn reporting insights into ongoing monitoring rules.
