<!-- Generated from workflows.mjs. Edit workflows.mjs, details.mjs, or docs/workflows/ and regenerate. -->
<!-- .meta
context_deps: [product.md, competitors.md, gtm.md, users.md, brand-voice.md]
capabilities: [web or user-provided answers]
-->

# /pb-ai-citation-monitor

Measure whether AI answers cite the product for stable buyer questions.

## Before proceeding

Read and follow `pb-_preamble.md` in this host's command directory. Resolve the Product Bench directory from the repo-root `.product-bench-install.json`; never assume it is `.product-bench`. The user's instructions and host permissions take priority.

## Mode contracts

| Mode | Input | Output |
|---|---|---|
| setup | Brand, domains, buyer questions, surfaces, and period | Versioned prompt set and sampling protocol |
| record | Surface, exact prompt, timestamp, raw answer, citations | Append-only observation with source and run metadata |
| report | Period and recorded observations | Citation and mention rates with denominators, examples, and caveats |
| recalibrate | Prompt drift or buyer-question change | Proposed prompt-set changes without rewriting prior observations |

If no mode is named, use `setup`. Ask only for missing information that changes a consequential decision. Never invent context or claim that an unavailable integration ran.

## Workflow

1. Keep prompts stable within a reporting period.
2. Separate raw observations from interpretation.
3. Never infer search visibility from a single answer.



## Procedure

Resolve context/output paths from `.product-bench-install.json`. Measure **visibility under recorded conditions**, not SEO rank, sentiment, prompt volume or the causal effect of content. No collector, sanitizer or report script is bundled for this command: use supplied CSV/JSON observations and concrete validation below, or available authorized answer-surface tools. Do not claim an unavailable engine ran.

### Resolve monitoring and reporting skills

Read the installed `seo-rank-tracker` for stable monitoring panels, comparable deltas and change investigations, and `seo-performance-reporter` for sourced reporting and evidence-backed handoffs. Their complete procedures and local references are bundled in `payload/skills/`; optional rank/search/analytics/AI-monitor providers are separate integrations. These skills supply execution guidance, not a bundled collector or proof that a live provider ran. This command's observation schema, eligibility formulas and storage contract take precedence over a generic skill's rank or citation KPI definition. In particular, visibility under these recorded conditions remains distinct from search rank.

If either skill is missing from the selected host installation, report the installation gap and keep its delegated pass pending. Use supplied validated observations without inventing provider results. Reporting may recommend a narrow SEO follow-up, but does not automatically invoke content-editing skills.

### Setup: stable buyer-question panel

Apply `seo-rank-tracker`'s stable-panel and monitoring discipline to this command's buyer-question registry. Confirm actual brand, verified first-party domain/subdomains, competitors, surfaces, locale, repetitions and cadence. Propose about 25 buyer questions unless the user chooses another size, covering problem discovery, category discovery, solution evaluation, comparison and branded/entity understanding. Generic questions must not plant the brand. Version a prompt registry with `prompt_id` (ACP-001 etc.), `prompt_version`, exact text, category, target persona, primary entity, active-from and retired-on. Show config/registry/change-log proposals before writing reviewed shared definitions. Keep raw evidence in the configured local output; propose only sanitized shareable observations for repo storage. Setup creates **no fabricated baseline**.

### Record: one answer, one row

Require an approved registry/config. Supported path is supplied observations; live consumer-browser collection is experimental and requires actually available tools. Use a fresh conversation per prompt, exact unchanged text, each configured surface/repetition. Record visible model/version or unknown, locale, sign-in/web settings, timestamps and evidence. Do not infer inaccessible surface results. During live collection checkpoint each validated observation to local staging before the next prompt. Resume only exact missing cells; protect existing staging from accidental replacement.

Use this canonical CSV header (also the field contract for JSON rows):

```text
run_at,run_date,prompt_id,prompt_version,prompt_text,category,target_persona,primary_entity,surface,model_version,locale,signed_in,web_enabled,repetition,brand_mentioned,brand_mention_position,first_party_cited,first_party_citation_urls,competitors_mentioned,total_vendors_mentioned,description_accurate,response_excerpt,evidence_url_or_path,reviewer_notes,accuracy_status,accuracy_issue_type,incorrect_claim,expected_claim
```

Rules: booleans true/false/blank genuinely unknown; mention position is ordinal among named vendors, blank if absent/unordered; exact first-party URLs and canonical competitor names are semicolon-separated; vendor total counts distinct entities. A **mention is not a citation**: first_party_cited requires a visible link/citation to a verified owned domain. Excerpt is an audit aid, not durable evidence by itself. Save complete available evidence locally and disclose ephemeral links.

Accuracy: `accurate`, `materially_inaccurate`, `incomplete`, `unverifiable`. Legacy `description_accurate=true` maps to accurate, false to materially_inaccurate, blank to incomplete/unverifiable or no description. A mentioned answer with no review remains unreviewed; do not invent a verdict. Issue types: `entity_confusion`, `wrong_owner`, `unsupported_capability`, `missing_core_answer`, `capture_failure`; accurate has no issue, incomplete requires missing_core_answer, unverifiable requires capture_failure. Every material inaccuracy needs the smallest precise incorrect claim, canonical expected correction and reviewer note/source. Avoid a catch-all note combining possible errors.

Validate registry text/version/category/persona/entity, active/retired dates at the run date, configured surfaces/repetitions, parseable timestamps/dates and unique `(run_date,prompt_id,prompt_version,surface,repetition)` cell. Verify citation URLs against domain ownership; a true citation without URL needs a clear capture explanation and missing-evidence flag. Show expected/observed/missing cells. Complete coverage can become COMPLETE; user-accepted partial runs remain PARTIAL with missing cells and durable staging. Never call a partial run the baseline.

Before proposing repo datasets, manually or through an explicitly available sanitizer remove account-bound chat URLs, local raw paths, email/identity markers, unapproved personalization and non-first-party evidence/share URLs while preserving metric fields and public owned-domain citation URLs. Record omitted evidence as redacted/local-only, not durable public proof; preserve original evidence privately for authorized review. Compare row counts and all metric inputs before/after. If identity appears inside an evidentiary excerpt, stop for human review rather than silently altering its meaning. No bundled sanitizer exists; do not invoke a legacy script. A read-only/preview request suppresses writes; any supported live collection still needs an honest record of what was queried.

### Report: formulas and audit trail

Use validated shareable datasets when they exist; raw evidence supports review, not an alternative unexplained denominator. Define eligible observations as validated usable captures; disclose excluded/unknown fields and missing surfaces. Use metric-specific reviewed eligibility for unknown booleans, never count unknown as false. Report numerator/denominator/sample next to every rate:

| Metric | Definition |
|---|---|
| Brand mention rate | mention=true rows / eligible mention-reviewed observations |
| First-party citation rate | cited=true rows / eligible citation-reviewed observations |
| Correct-description rate | accurate mentioned descriptions / mentioned descriptions reviewed as accurate or materially_inaccurate |
| Citation share among tracked vendors | first-party-cited rows / rows citing first-party or naming/citing a configured competitor |
| Mean mention position | mean of nonblank ordinal position; show N |
| Query coverage | active prompt IDs observed at least once / active prompt IDs |
| Surface coverage | observed prompt×surface cells / expected prompt×surface cells; show repetition coverage separately |
| Demand-weighted mention/citation | sum of eligible generic observation weights with true outcome / sum of eligible generic observation weights |

Demand weight = **bounded demand band × ICP relevance × commercial intent × differentiation**, each input a versioned 1–5 judgment. Record dated search-demand source, geography, representative keyword and scores. Search demand is a proxy, **not AI-prompt volume**; retain unweighted results. Exclude branded prompts from generic weighting; use verified first-party search evidence for branded entity demand, not ambiguous third-party brand-volume estimates. Apply the same prompt weight to each comparable repetition; unbalanced panels require a balanced-cell comparison rather than silent overweighting.

Show period/version, prompt/surface/repetition coverage, current and prior comparable levels, category/persona/surface/competitor slices, accuracy failures with evidence, and prioritized investigations. For an operator include exact missing cells, eligibility exclusions and corrections; for executives lead with the decision-relevant levels and limits, retaining the audit table. Retain the user's requested through-date/window; never imply historical runs or prior metrics exist when they do not. Compare PARTIAL only on identical cells; show prompt-version boundaries. Citation share is not “share of voice.” Descriptive change does not prove a content intervention caused improvement.

### Recalibrate: preserve comparability

Use `seo-rank-tracker`'s comparison and delta discipline when evaluating panel changes. Propose retire/add/merge/relabel when buyer needs, products or surfaces change. Never rewrite historical prompt text; use new ID/version, reason and effective date, retain old observations and report transition panels separately. Show exact reviewed definition changes before applying them. Writing reports does not authorize content publishing, posts, commits or context edits.

## Output template

```markdown
# AI citation visibility: [brand / period]
Mode: setup|record|report|recalibrate
Prompt-set/version: ... | Status: COMPLETE|PARTIAL|NOT RUN
## Protocol / registry
[Brand/domain; stable panel; settings; proposed changes if applicable]
## Coverage and evidence
[Expected/observed/missing cells; versions; capture conditions; evidence paths]
## Metrics
| Field | Value |
|---|---|
| Metric | |
| Numerator | |
| Denominator/N | |
| Current | |
| Comparable prior | |
| Limits | |
## Accuracy issues
| Field | Value |
|---|---|
| Prompt/surface | |
| Status/type | |
| Precise incorrect claim | |
| Expected claim/source | |
## Investigation priorities
[Observed signal vs hypothesis; next test, no causal claim]
## Completion
[Files read/written; validation problems; suppressed writes; next action]
```

## Worked example

**Fictional observations:** a 10-prompt, two-surface, one-repetition panel expects 20 cells; 18 are captured. Six captured answers mention the product and three cite its verified domain: 6/18 mention and 3/18 citation when those fields are known. Four mentioned descriptions are accurate, one materially inaccurate and one incomplete: correct-description is **4/5**, not 4/6. Coverage is 18/20; the run stays PARTIAL. “Product automatically assigns volunteers” is corrected against a supplied fictional contract to “product proposes replacements for coordinator approval.” A competitor appears in eight additional observations without first-party citation, giving citation share 3/11 for this fictional panel. A later 4/18 citation result is descriptive and does not establish that a new article caused the gain.

## Quality checks

- Exact schema, stable prompts, conditions, cell key and durable evidence make each result auditable.
- Mention/citation and accurate/incomplete/unverifiable are kept distinct.
- All rates carry explicit eligibility, counts and comparable panels; unknown is not false.
- Shareable datasets preserve metric fields while protecting account-bound evidence; identifiers in excerpts require review.
- Demand weights are versioned proxies with unweighted results alongside them.

## Anti-patterns

- Invented observations, model labels, citation sentiment or durable evidence claims.
- Quietly changing prompts, combining incompatible versions or presenting partial coverage as baseline.
- Treating a brand mention as a citation or incomplete capture as an inaccurate description.
- Calling weighted search demand AI usage, citation share market share, or a period delta causal uplift.
- Calling nonexistent collector/report/sanitizer scripts or automatically committing raw responses.

## Evidence and output

For company context, use the files declared in the metadata, plus supplied task artifacts and their cited evidence within approved scope. Apply the shared writing rules and reviewed team voice. Follow the command-specific output template, scaling detail to the decision and audience; a rich procedure does not require a long artifact. For factual claims, include a source path, URL, or explicit user statement with observation date. Treat fictional fixture data as fictional. Label unsupported claims `[NEEDS DATA]` and assumptions `[ASSUMPTION]`. Write drafts beneath the configured Product Bench output directory; do not publish, post, email, or commit without the user's authorization. Include decisions, evidence gaps, and the next action once in the appropriate template sections. Do not append a recap when the artifact already makes them clear.
