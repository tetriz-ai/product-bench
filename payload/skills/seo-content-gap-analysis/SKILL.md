---
name: seo-content-gap-analysis
description: 'Find content gaps: topics and keywords competitors cover that you don''t,
  with editorial calendar. 内容缺口/选题规划'
license: Apache-2.0
metadata:
  product-bench-modifications: "Adapted host frontmatter, local resources/context, provider boundaries, and explicitly synthetic examples; retain upstream attribution and benchmark notices. See THIRD-PARTY-NOTICES.md.; reserved-domain fictional teaching subjects and scoped benchmark license notice"
  author: aaron-he-zhu
  version: 6.0.0
  geo-relevance: medium
  tags:
  - seo
  - geo
  - content-gaps
  - topic-analysis
  - content-strategy
  - editorial-calendar
  - competitive-gap
  - content-opportunities
  - 内容缺口
  - コンテンツギャップ
  - 콘텐츠갭
  - brechas-contenido
  triggers:
  - find content gaps
  - content opportunities
  - topic analysis
  - content strategy gaps
  - editorial calendar
  - untapped topics
  - what am I missing
  - topics to cover
  - what do competitors write about
  - what should I cover next
  - topics I haven't written about
  - they cover this but I don't
  - what topics am I missing
  - what content should I create
  - 内容缺口分析
  - 选题规划
  - 内容机会
  - 竞品话题
  - 缺什么内容
  - 竞品写了什么
  - 还应该写什么
  - コンテンツギャップ
  - コンテンツ機会
  - 콘텐츠 갭 분석
  - 콘텐츠 기회
  - brechas de contenido
  - oportunidades de contenido
  - lacunas de conteúdo
  - content gab analysis
  compatibility: 'Claude Code ≥1.0, skills.sh marketplace, ClawHub marketplace, Vercel
    Labs skills ecosystem. No system packages required. Optional: MCP network access
    for SEO tool integrations.'
  homepage: https://github.com/aaron-he-zhu/seo-geo-claude-skills
  when_to_use: Use when finding content gaps between two domains, discovering missing
    topics, or identifying coverage holes versus competitors.
  argument-hint: <your domain> <competitor domain>
---

## Product Bench integration

This bundled skill includes its full procedure and local supporting resources. Resolve product, audience, brand voice, and output/state locations from the caller and `.product-bench-install.json`; references to `CLAUDE.md` or upstream `memory/` describe the upstream context/state convention, not an additional canonical store to create automatically. Respect the invoking workflow's scope, approvals, and write boundary. In the blog workflow, Editorial Draft remains the writing engine; this skill supplies the requested SEO research or checks.

Tool placeholders such as `~~SEO tool`, `~~analytics`, `~~search console`, or `~~AI monitor` are optional provider categories, not installed APIs. Use only actually available authorized tools or supplied data. Separate measured/provider data, supplied estimates, qualitative judgments, and unmeasured fields; never fill missing metrics, scores, monitoring results, or citations from examples. Numeric examples in supporting resources are illustrative. A completed rubric assessment may report its actual evidence and scoring, but it is not a search-provider measurement.

Local skill/resource links use the bundled copies. Shared contracts, complete CORE-EEAT/CITE benchmark definitions, connector specifications, wiki specification and wiki-lint execution instructions are bundled once under `seo-memory-management/upstream-shared/` and linked locally. Read the relevant reference before its dependent procedure. `/seo:wiki-lint` is a source command instruction contract, available through the bundled memory skill; it is not a registered Product Bench host command or executable collector. Upstream hook configuration is retained as reference material and is not automatically installed or active. Do not claim that an upstream command, provider adapter, hook or automated collector ran without actually executing an available authorized implementation.


# Content Gap Analysis


> **[SEO & GEO Skills Library](https://github.com/aaron-he-zhu/seo-geo-claude-skills)** · 20 skills for SEO + GEO · [ClawHub](https://clawhub.ai/u/aaron-he-zhu) · [skills.sh](https://skills.sh/aaron-he-zhu/seo-geo-claude-skills)
> **System Mode**: This research skill follows the shared [Skill Contract](../seo-memory-management/upstream-shared/references/skill-contract.md) and [State Model](../seo-memory-management/upstream-shared/references/state-model.md).


Identifies content opportunities by analyzing gaps between a site's content and competitors'. Surfaces missing topics, untapped keywords, and content formats worth creating.

**System role**: Research layer skill. It turns market signals into reusable strategic inputs for the rest of the library.

## When This Must Trigger

Use this when the conversation involves any of these situations — even if the user does not use SEO terminology:

Use this whenever the task needs reusable market intelligence that should influence strategy, not just an ad hoc answer.

- Planning content strategy and editorial calendar
- Finding quick-win content opportunities
- Understanding where competitors outperform you
- Identifying underserved topics in your niche
- Expanding into adjacent topic areas
- Prioritizing content creation efforts
- Finding GEO opportunities competitors miss

## What This Skill Does

1. **Keyword Gap Analysis**: Finds keywords competitors rank for that you don't
2. **Topic Coverage Mapping**: Identifies topic areas needing more content
3. **Content Format Gaps**: Reveals missing content types (videos, tools, guides)
4. **Audience Need Mapping**: Matches gaps to audience journey stages
5. **GEO Opportunity Detection**: Finds AI-answerable topics you're missing
6. **Priority Scoring**: Ranks gaps by impact and effort
7. **Content Calendar Creation**: Plans gap-filling content schedule

## Quick Start

Start with one of these prompts. Finish with a short handoff summary using the repository format in [Skill Contract](../seo-memory-management/upstream-shared/references/skill-contract.md).

### Basic Gap Analysis

```
Find content gaps between my site [URL] and [competitor URLs]
```

```
What content am I missing compared to my top 3 competitors?
```

### Topic-Specific Analysis

```
Find content gaps in [topic area] compared to industry leaders
```

```
What [content type] do competitors have that I don't?
```

### Audience-Focused

```
What content gaps exist for [audience segment] in my niche?
```

## Skill Contract

**Expected output**: a prioritized research brief, evidence-backed findings, and a short handoff summary ready for `memory/research/`.

- **Reads**: user goals, target market inputs, available tool data, and prior strategy from [CLAUDE.md](../seo-memory-management/upstream-shared/CLAUDE.md) and the shared [State Model](../seo-memory-management/upstream-shared/references/state-model.md) when available.
- **Writes**: a user-facing research deliverable plus a reusable summary that can be stored under `memory/research/`.
- **Promotes**: durable keyword priorities, competitor facts, entity candidates, and strategic decisions to `CLAUDE.md`, `memory/decisions.md`, and `memory/research/`; hand canonical entity work to `entity-optimizer`.
- **Next handoff**: use the `Next Best Skill` below when the findings are ready to drive action.

## Data Sources

> **Note:** All integrations are optional. This skill works without any API keys — users provide data manually when no tools are connected.

> See [CONNECTORS.md](../seo-memory-management/upstream-shared/CONNECTORS.md) for tool category placeholders.

**With ~~SEO tool + ~~search console + ~~analytics + ~~AI monitor connected:**
Automatically pull your site's content inventory from ~~search console and ~~analytics (indexed pages, traffic per page, keywords ranking), competitor content data from ~~SEO tool (ranking keywords, top pages, backlink counts), and AI citation patterns from ~~AI monitor. Keyword overlap analysis and gap identification can be automated.

**With manual data only:**
Ask the user to provide:
1. Your site URL and content inventory (list of published content with topics)
2. Competitor URLs (3-5 sites)
3. Your current traffic and keyword performance (if available)
4. Known content strengths and weaknesses
5. Industry context and business goals

Proceed with the full analysis using provided data. Note in the output which metrics are from automated collection vs. user-provided data.

## Instructions

When a user requests content gap analysis:

1. **Define Analysis Scope**

   Clarify parameters:

   ```markdown
   ### Analysis Parameters

   **Your Site**: [URL]
   **Competitors to Analyze**: [URLs or "identify for me"]
   **Topic Focus**: [specific area or "all"]
   **Content Types**: [blogs, guides, tools, videos, or "all"]
   **Audience**: [target audience]
   **Business Goals**: [traffic, leads, authority, etc.]
   ```

2. **Audit Your Existing Content**

   Document total indexed pages, content by type and topic cluster, top performing content, and content strengths/weaknesses.

3. **Analyze Competitor Content**

   For each competitor: document content volume, monthly traffic, content distribution by type, topic coverage vs. yours, and unique content they have.

4. **Identify Keyword Gaps**

   Find keywords competitors rank for that you do not. Categorize into High Priority (high volume, achievable difficulty), Quick Wins (lower volume, low difficulty), and Long-term (high volume, high difficulty). Include keyword overlap analysis.

5. **Map Topic Gaps**

   Create a topic coverage comparison matrix across all competitors. For each missing topic cluster, document business relevance, competitor coverage, opportunity size, sub-topics, and recommended pillar/cluster approach.

6. **Identify Content Format Gaps**

   Compare format distribution (guides, tutorials, comparisons, case studies, tools, templates, video, infographics, research) against competitors and industry averages. For each gap, assess effort and expected impact.

7. **Analyze GEO/AI Gaps**

   Identify topics where competitors get AI citations but you do not. Document missing Q&A content, definition/explanation content, and comparison content. Score each by traditional SEO value and GEO value.

8. **Map to Audience Journey**

   Compare funnel stage coverage (Awareness, Consideration, Decision, Retention) against competitor averages. Detail specific gaps at each stage.

9. **Prioritize and Create Action Plan**

   Produce a final report with: Executive Summary, Prioritized Gap List (Tier 1 Quick Wins, Tier 2 Strategic Builds, Tier 3 Long-term), Content Calendar, and Success Metrics.

   > **Reference**: See [references/analysis-templates.md](references/analysis-templates.md) for detailed templates for each step.

## Validation Checkpoints

### Input Validation
- [ ] Your content inventory is complete or representative sample provided
- [ ] Competitor URLs identified (minimum 2-3 competitors)
- [ ] Analysis scope defined (specific topics or comprehensive)
- [ ] Business goals and priorities clarified

### Output Validation
- [ ] Every recommendation cites specific data points (not generic advice)
- [ ] Gap analysis compares like-to-like content (topic clusters to topic clusters)
- [ ] Priority scoring based on measurable criteria (volume, difficulty, business fit)
- [ ] Content calendar maps gaps to realistic timeframes
- [ ] Source of each data point clearly stated (~~SEO tool data, ~~analytics data, ~~AI monitor data, user-provided, or estimated)

## Example

> **Reference**: See [references/example-report.md](references/example-report.md) for a complete example analyzing SaaS marketing blog gaps vs. crm-a.example.invalid and crm-b.example.invalid.

## Advanced Analysis

### Competitive Cluster Comparison

```
Compare our topic cluster coverage for [topic] vs top 5 competitors
```

### Temporal Gap Analysis

```
What content have competitors published in the last 6 months that we haven't covered?
```

### Intent-Based Gaps

```
Find gaps in our [commercial/informational] intent content
```

## Tips for Success

1. **Focus on actionable gaps** - Not all gaps are worth filling
2. **Consider your resources** - Prioritize based on ability to execute
3. **Quality over quantity** - Better to fill 5 gaps well than 20 poorly
4. **Track what works** - Measure gap-filling success
5. **Update regularly** - Gaps change as competitors publish
6. **Include GEO opportunities** - Don't just optimize for traditional search



### Save Results

After delivering findings to the user, ask:

> "Save these results for future sessions?"

If yes, write a dated summary to `memory/research/content-gap-analysis/YYYY-MM-DD-<topic>.md` containing:
- One-line headline finding
- Top 3-5 actionable items
- Open loops or blockers
- Source data references

If any findings should influence ongoing strategy, recommend promoting key conclusions to `memory/hot-cache.md`.

## Reference Materials

- [Analysis Templates](references/analysis-templates.md) — Detailed templates for each analysis step (inventory, competitor content, keyword gaps, topic gaps, format gaps, GEO gaps, journey, prioritized report)
- [Gap Analysis Frameworks](references/gap-analysis-frameworks.md) — Content audit matrices, funnel mapping, and gap prioritization scoring methodologies
- [Example Report](references/example-report.md) — Complete example analyzing SaaS marketing blog gaps vs. crm-a.example.invalid and crm-b.example.invalid

## Next Best Skill

- **Primary**: [seo-content-writer](../seo-content-writer/SKILL.md) — turn missing topics into a draft or content roadmap.
