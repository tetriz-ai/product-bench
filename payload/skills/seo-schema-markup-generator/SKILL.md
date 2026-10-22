---
name: seo-schema-markup-generator
description: Generate JSON-LD structured data for FAQ, HowTo, Article, Product, LocalBusiness
  rich results. Schema标记/结构化数据
license: Apache-2.0
allowed-tools: WebFetch
metadata:
  product-bench-modifications: "Adapted host frontmatter, local resources/context, provider boundaries, and explicitly synthetic examples; retain upstream attribution and benchmark notices. See THIRD-PARTY-NOTICES.md.; reserved-domain fictional teaching subjects and scoped benchmark license notice"
  author: aaron-he-zhu
  version: 6.0.0
  geo-relevance: medium
  tags:
  - seo
  - structured-data
  - json-ld
  - rich-results
  - faq-schema
  - howto-schema
  - product-schema
  - article-schema
  - schema-org
  - 结构化数据
  - 構造化データ
  - 스키마마크업
  - datos-estructurados
  triggers:
  - add schema markup
  - generate structured data
  - JSON-LD
  - rich snippets
  - FAQ schema
  - schema.org
  - structured data markup
  - add FAQ rich results
  - I want star ratings in Google
  - product markup
  - recipe schema
  - add structured data to my page
  - how to add schema markup
  - how to get rich snippets
  - 结构化数据
  - Schema标记
  - JSON-LD生成
  - 富摘要
  - 添加结构化数据
  - 要星级评分
  - 搜索结果要好看
  - 構造化データ
  - スキーママークアップ
  - リッチリザルト
  - 스키마 마크업
  - 구조화 데이터
  - datos estructurados
  - marcado schema
  - dados estruturados
  - shema markup
  - structred data
  compatibility: 'Claude Code ≥1.0, skills.sh marketplace, ClawHub marketplace, Vercel
    Labs skills ecosystem. No system packages required. Optional: MCP network access
    for SEO tool integrations.'
  homepage: https://github.com/aaron-he-zhu/seo-geo-claude-skills
  when_to_use: Use when generating JSON-LD structured data, Schema.org markup, or
    rich snippet markup for a page.
  argument-hint: <page URL or content type>
---

## Product Bench integration

This bundled skill includes its full procedure and local supporting resources. Resolve product, audience, brand voice, and output/state locations from the caller and `.product-bench-install.json`; references to `CLAUDE.md` or upstream `memory/` describe the upstream context/state convention, not an additional canonical store to create automatically. Respect the invoking workflow's scope, approvals, and write boundary. In the blog workflow, Editorial Draft remains the writing engine; this skill supplies the requested SEO research or checks.

Tool placeholders such as `~~SEO tool`, `~~analytics`, `~~search console`, or `~~AI monitor` are optional provider categories, not installed APIs. Use only actually available authorized tools or supplied data. Separate measured/provider data, supplied estimates, qualitative judgments, and unmeasured fields; never fill missing metrics, scores, monitoring results, or citations from examples. Numeric examples, sample domains, and audit findings in this skill and its resources are invented illustrations, not observations about a real client. A completed rubric assessment may report its actual evidence and scoring, but it is not a search-provider measurement.

Local skill/resource links use the bundled copies. Shared contracts, complete CORE-EEAT/CITE benchmark definitions, connector specifications, wiki specification and wiki-lint execution instructions are bundled once under `seo-memory-management/upstream-shared/` and linked locally. Read the relevant reference before its dependent procedure. `/seo:wiki-lint` is a source command instruction contract, available through the bundled memory skill; it is not a registered Product Bench host command or executable collector. Upstream hook configuration is retained as reference material and is not automatically installed or active. Do not claim that an upstream command, provider adapter, hook or automated collector ran without actually executing an available authorized implementation.


# Schema Markup Generator

> **[SEO & GEO Skills Library](https://github.com/aaron-he-zhu/seo-geo-claude-skills)** · 20 skills for SEO + GEO · [ClawHub](https://clawhub.ai/u/aaron-he-zhu) · [skills.sh](https://skills.sh/aaron-he-zhu/seo-geo-claude-skills)
> **System Mode**: This build skill follows the shared [Skill Contract](../seo-memory-management/upstream-shared/references/skill-contract.md) and [State Model](../seo-memory-management/upstream-shared/references/state-model.md).


This skill creates Schema.org structured data markup in JSON-LD format to help search engines understand your content and enable rich results in SERPs.

**System role**: Build layer skill. It turns briefs and signals into assets that other skills can review, publish, and monitor.

## When This Must Trigger

Use this when the conversation involves any of these situations — even if the user does not use SEO terminology:

Use this whenever the task needs a shippable asset or transformation that should feed directly into quality review, deployment, or monitoring.

- Adding FAQ schema for expanded SERP presence
- Creating How-To schema for step-by-step content
- Adding Product schema for e-commerce pages
- Implementing Article schema for blog posts
- Adding Local Business schema for location pages
- Creating Review/Rating schema
- Implementing Organization schema for brand presence
- Any page where rich results would improve visibility

## What This Skill Does

1. **Schema Type Selection**: Recommends appropriate schema types
2. **JSON-LD Generation**: Creates valid structured data markup
3. **Property Mapping**: Maps your content to schema properties
4. **Validation Guidance**: Ensures schema meets requirements
5. **Nested Schema**: Handles complex, multi-type schemas
6. **Rich Result Eligibility**: Identifies which rich results you can target

## Quick Start

Start with one of these prompts. Finish with a short handoff summary using the repository format in [Skill Contract](../seo-memory-management/upstream-shared/references/skill-contract.md).

### Generate Schema for Content

```
Generate schema markup for this [content type]: [content/URL]
```

```
Create FAQ schema for these questions and answers: [Q&A list]
```

### Specific Schema Types

```
Create Product schema for [product name] with [details]
```

```
Generate LocalBusiness schema for [business name and details]
```

### Audit Existing Schema

```
Review and improve this schema markup: [existing schema]
```

## Skill Contract

**Expected output**: a ready-to-use asset or implementation-ready transformation plus a short handoff summary ready for `memory/content/`.

- **Reads**: the brief, target keywords, entity inputs, quality constraints, and prior decisions from [CLAUDE.md](../seo-memory-management/upstream-shared/CLAUDE.md) and the shared [State Model](../seo-memory-management/upstream-shared/references/state-model.md) when available.
- **Writes**: a user-facing content, metadata, or schema deliverable plus a reusable summary that can be stored under `memory/content/`.
- **Promotes**: approved angles, messaging choices, missing evidence, and publish blockers to `CLAUDE.md`, `memory/decisions.md`, and `memory/open-loops.md`.
- **Next handoff**: use the `Next Best Skill` below when the asset is ready for review or deployment.

## Data Sources

> See [CONNECTORS.md](../seo-memory-management/upstream-shared/CONNECTORS.md) for tool category placeholders.

**With ~~web crawler connected:**
Automatically crawl and extract page content (visible text, headings, lists, tables), existing schema markup, page metadata, and structured content elements that map to schema properties.

**With manual data only:**
Ask the user to provide:
1. Page URL or full HTML content
2. Page type (article, product, FAQ, how-to, local business, etc.)
3. Specific data needed for schema (prices, dates, author info, Q&A pairs, etc.)
4. Current schema markup (if optimizing existing)

Proceed with the full workflow using provided data. Note in the output which data is from automated extraction vs. user-provided data.

## Instructions

When a user requests schema markup:

1. **Identify Content Type and Rich Result Opportunity**

   Reference the [CORE-EEAT Benchmark](../seo-memory-management/upstream-shared/references/core-eeat-benchmark.md) item **O05 (Schema Markup)** for content-type to schema mapping:

   This O05 mapping includes material from [CORE-EEAT](https://github.com/aaron-he-zhu/core-eeat-content-benchmark/tree/2a04c2f7c0010d6ed2102ff606f6032d4267b0dc), Copyright (c) 2026 Aaron, under MIT. The complete [MIT permission notice](../seo-memory-management/upstream-shared/CORE-EEAT-LICENSE) applies to this mapping alongside the library's Apache-2.0 adaptation terms.

   ```markdown
   ### CORE-EEAT Schema Mapping (O05)

   | Content Type | Required Schema | Conditional Schema |
   |-------------|----------------|--------------------|
   | Blog (guides) | Article, Breadcrumb | FAQ, HowTo |
   | Blog (tools) | Article, Breadcrumb | FAQ, Review |
   | Blog (insights) | Article, Breadcrumb | FAQ |
   | Alternative | Comparison*, Breadcrumb, FAQ | AggregateRating |
   | Best-of | ItemList, Breadcrumb, FAQ | AggregateRating per tool |
   | Use-case | WebPage, Breadcrumb, FAQ | — |
   | FAQ | FAQPage, Breadcrumb | — |
   | Landing | SoftwareApplication, Breadcrumb, FAQ | WebPage |
   | Testimonial | Review, Breadcrumb | FAQ, Person |

   *Use the mapping above to ensure schema type matches content type (CORE-EEAT O05: Pass criteria).*
   ```

   ```markdown
   ### Schema Analysis

   **Content Type**: [blog/product/FAQ/how-to/local business/etc.]
   **Page URL**: [URL]

   **Eligible Rich Results**:

   | Rich Result Type | Eligibility | Impact |
   |------------------|-------------|--------|
   | FAQ | ✅/❌ | High - Expands SERP presence |
   | How-To | ✅/❌ | Medium - Shows steps in SERP |
   | Product | ✅/❌ | High - Shows price, availability |
   | Review | ✅/❌ | High - Shows star ratings |
   | Article | ✅/❌ | Medium - Shows publish date, author |
   | Breadcrumb | ✅/❌ | Medium - Shows navigation path |
   | Video | ✅/❌ | High - Shows video thumbnail |

   **Recommended Schema Types**:
   1. [Primary schema type] - [reason]
   2. [Secondary schema type] - [reason]
   ```

2. **Generate Schema Markup**

   Based on the identified content type, generate the appropriate JSON-LD schema. Supported types: FAQPage, HowTo, Article/BlogPosting/NewsArticle, Product, LocalBusiness, Organization, BreadcrumbList, Event, Recipe, and combined multi-type schemas.

   > **Reference**: See [references/schema-templates.md](references/schema-templates.md) for complete, copy-ready JSON-LD templates for all schema types with required and optional properties.

   For each schema generated, include:
   - All required properties for the chosen type
   - Rich result preview showing expected SERP appearance
   - Notes on which properties are required vs. optional

   When combining multiple schema types on one page, wrap them in a JSON array inside a single `<script type="application/ld+json">` tag.

3. **Provide Implementation and Validation**

    ```markdown
    ## Implementation Guide

    ### Adding Schema to Your Page

    **Option 1: In HTML <head>**
    ```html
    <head>
      <script type="application/ld+json">
        [Your JSON-LD schema here]
      </script>
    </head>
    ```

    **Option 2: Before closing </body>**
    ```html
      <script type="application/ld+json">
        [Your JSON-LD schema here]
      </script>
    </body>
    ```

    ### Validation Steps

    1. **~~schema validator**
       - Test your live URL or paste code
       - Check for errors and warnings

    2. **Schema.org Validator**
       - URL: https://validator.schema.org/
       - Validates against Schema.org spec

    3. **~~search console**
       - Monitor rich results in ~~search console
       - Check Enhancements reports for issues

    ### Validation Checklist

    - [ ] JSON syntax is valid (no trailing commas)
    - [ ] All required properties present
    - [ ] URLs are absolute, not relative
    - [ ] Dates are in ISO 8601 format
    - [ ] Content matches visible page content
    - [ ] No policy violations
    ```

## Validation Checkpoints

### Input Validation
- [ ] Page URL or content provided
- [ ] Schema type appropriate for content (Article for blog, Product for e-commerce, etc.)
- [ ] All required data available (author, dates, prices, etc. depending on schema type)
- [ ] Content eligibility for rich results confirmed

### Output Validation
- [ ] JSON syntax validates (no trailing commas, proper quotes)
- [ ] All required properties present for chosen schema type
- [ ] URLs are absolute, not relative
- [ ] Dates in ISO 8601 format (YYYY-MM-DDTHH:MM:SS+00:00)
- [ ] Schema content matches visible page content exactly
- [ ] Passes ~~schema validator with no errors
- [ ] Source of each data point clearly stated (~~web crawler extraction, user-provided, or manual entry)

## Example

**User**: "Generate FAQ schema for a page about SEO with 3 questions"

**Output**:

```markdown
## FAQ Schema for SEO Page

### Schema Markup

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO (Search Engine Optimization) is the practice of optimizing websites and content to rank higher in search engine results pages (SERPs). It involves technical optimizations, content creation, and link building to increase organic visibility and drive qualified traffic to your website."
      }
    },
    {
      "@type": "Question",
      "name": "How long does SEO take to work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO typically takes 3-6 months to show significant results, though this varies based on competition, domain authority, and effort invested. New websites may take 6-12 months, while established sites with existing authority can see improvements in 1-3 months for less competitive keywords."
      }
    },
    {
      "@type": "Question",
      "name": "Is SEO better than paid advertising?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO and paid advertising serve different purposes. SEO provides sustainable, long-term traffic without per-click costs but takes time to build. Paid advertising delivers immediate results but stops when you stop paying. Most successful businesses use both: paid ads for immediate leads and SEO for long-term growth."
      }
    }
  ]
}
```

_Implementation: Wrap the above JSON-LD in `<script type="application/ld+json">...</script>` and place in `<head>` or before `</body>`. Test with ~~schema validator._

### SERP Preview

```
SEO Guide: Complete Beginner's Tutorial
site.example.invalid/seo-guide/
Learn SEO from scratch with our comprehensive guide...

▼ What is SEO?
  SEO (Search Engine Optimization) is the practice of optimizing...
▼ How long does SEO take to work?
  SEO typically takes 3-6 months to show significant results...
▼ Is SEO better than paid advertising?
  SEO and paid advertising serve different purposes...
```
```

## Schema Type Quick Reference

| Content Type | Schema Type | Key Properties |
|--------------|-------------|----------------|
| Blog Post | BlogPosting/Article | headline, datePublished, author |
| Product | Product | name, price, availability |
| FAQ | FAQPage | Question, Answer |
| How-To | HowTo | step, totalTime |
| Local Business | LocalBusiness | address, geo, openingHours |
| Recipe | Recipe | ingredients, cookTime |
| Event | Event | startDate, location |
| Video | VideoObject | uploadDate, duration |
| Course | Course | provider, name |
| Review | Review | itemReviewed, ratingValue |

## Tips for Success

1. **Match visible content** - Schema must reflect what users see
2. **Don't spam** - Only add schema for relevant content
3. **Keep updated** - Update dates and prices when they change
4. **Test thoroughly** - Validate before deploying
5. **Monitor Search Console** - Watch for errors and warnings

## Schema Type Decision Tree

> **Reference**: See [references/schema-decision-tree.md](references/schema-decision-tree.md) for the full decision tree (content-to-schema mapping), industry-specific recommendations, implementation priority tiers (P0-P4), and validation quick reference.


### Save Results

After delivering content or optimization output to the user, ask:

> "Save these results for future sessions?"

If yes, write a dated summary to `memory/content/YYYY-MM-DD-<topic>.md` containing:
- One-line description of what was created
- Target keyword and content type
- Open loops or items needing review
- Source data references

**Gate check recommended**: Run content-quality-auditor before publishing (PostToolUse hook will remind automatically).

If any findings should influence ongoing strategy, recommend promoting key conclusions to `memory/hot-cache.md`.

## Reference Materials

- [Schema Templates](references/schema-templates.md) - Copy-ready JSON-LD templates for all schema types
- [Validation Guide](references/validation-guide.md) - Common errors, required properties, testing workflow

## Next Best Skill

- **Primary**: [technical-seo-checker](../seo-technical-seo-checker/SKILL.md) — verify implementation quality and deployment readiness.
