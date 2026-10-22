# AI citation visibility: Cedar Roster / fictional 2026-10-06 panel

**Fictional dry drafting exercise; no answer surface queried, provider run or business observation.** This manually calculated report tests the command's reasoning against invented rows. It is not an initial baseline.

Mode: report | Registry: fictional panel v1 | Status: PARTIAL
Decision: finish the missing cells and resolve evidence gaps before establishing a baseline; inspect one specific material capability error now.

## Protocol and coverage

The fictional approved registry has four active prompt IDs, two fictional surfaces A/B, one repetition, locale en-US. P1/P2 are generic buyer questions, P3 is branded and P4 generic. Surfaces are experimental labels, not actual model names. The eight expected prompt×surface×repetition cells yield six observations. P4×A and P4×B are missing. Query coverage: 3/4 IDs (75%). Surface-cell and repetition coverage: 6/8 (75%). This run cannot be called COMPLETE or baseline.

Invented evidence objects are `fictional-capture-1` through `fictional-capture-6`; none is a real URL or saved response. A real report would need actual durable local evidence, recorded timestamp/model/locale/sign-in/web state and sanitization validation. All rows below are assumed schema-validated solely for the numerical exercise.


**Record 1**

| Field | Value |
|---|---|
| Row | 1 |
| Prompt/surface | P1/A |
| Mention | true |
| Owned citation | true |
| Competitor present | false |
| Description accuracy | accurate |
| Position | 1 |


**Record 2**

| Field | Value |
|---|---|
| Row | 2 |
| Prompt/surface | P1/B |
| Mention | true |
| Owned citation | false |
| Competitor present | true |
| Description accuracy | materially_inaccurate |
| Position | 2 |


**Record 3**

| Field | Value |
|---|---|
| Row | 3 |
| Prompt/surface | P2/A |
| Mention | true |
| Owned citation | unknown |
| Competitor present | true |
| Description accuracy | incomplete |
| Position | unordered/blank |


**Record 4**

| Field | Value |
|---|---|
| Row | 4 |
| Prompt/surface | P2/B |
| Mention | false |
| Owned citation | false |
| Competitor present | true |
| Description accuracy | no brand description |
| Position | blank |


**Record 5**

| Field | Value |
|---|---|
| Row | 5 |
| Prompt/surface | P3/A |
| Mention | false |
| Owned citation | false |
| Competitor present | false |
| Description accuracy | no brand description |
| Position | blank |


**Record 6**

| Field | Value |
|---|---|
| Row | 6 |
| Prompt/surface | P3/B |
| Mention | unknown |
| Owned citation | true |
| Competitor present | unknown |
| Description accuracy | unverifiable |
| Position | blank |


Row 3 has a usable mentioned description with a missing core answer; its citation field is unresolved because a citation marker is visible but the link target was not captured. Row 6's preserved fragment has a verified-owned citation target, but brand text/description cannot be reliably read. Unknown is not false. These fields need separate eligibility; the collection is partial and evidence limitations remain prominent.

## Metrics


**Record 1**

| Field | Value |
|---|---|
| Metric | Brand mention rate |
| Numerator | 3 true |
| Denominator/N | 5 mention-reviewed rows |
| Current | 60% |
| Comparable prior | unavailable |
| Limits | Row 6 unknown; 2 missing cells |


**Record 2**

| Field | Value |
|---|---|
| Metric | First-party citation rate |
| Numerator | 2 true |
| Denominator/N | 5 citation-reviewed rows |
| Current | 40% |
| Comparable prior | unavailable |
| Limits | Row 3 unknown; no mention-to-citation substitution |


**Record 3**

| Field | Value |
|---|---|
| Metric | Correct-description rate |
| Numerator | 1 accurate mentioned description |
| Denominator/N | 2 mentioned descriptions reviewed accurate/materially_inaccurate |
| Current | 50% |
| Comparable prior | unavailable |
| Limits | Row 3 incomplete excluded; row 6 unverifiable excluded |


**Record 4**

| Field | Value |
|---|---|
| Metric | Citation share among tracked vendors |
| Numerator | 2 owned-cited rows |
| Denominator/N | 5 rows definitely owned-cited or naming/citing configured competitor |
| Current | 40% |
| Comparable prior | unavailable |
| Limits | Rows 1,2,3,4,6; row 5 neither; not share of voice |


**Record 5**

| Field | Value |
|---|---|
| Metric | Mean ordinal mention position |
| Numerator | 1+2 |
| Denominator/N | 2 ordered mentioned rows |
| Current | 1.5 |
| Comparable prior | unavailable |
| Limits | Unordered row 3 excluded, N explicit |


**Record 6**

| Field | Value |
|---|---|
| Metric | Query coverage |
| Numerator | 3 IDs |
| Denominator/N | 4 active IDs |
| Current | 75% |
| Comparable prior | unavailable |
| Limits | P4 absent on both surfaces |


**Record 7**

| Field | Value |
|---|---|
| Metric | Surface/repetition coverage |
| Numerator | 6 cells |
| Denominator/N | 8 expected cells |
| Current | 75% |
| Comparable prior | unavailable |
| Limits | One configured repetition, no hidden averaging |


## Demand-weighted generic sensitivity

Invented provisional weights P1=4 and P2=2, constructed from bounded versioned 1–5 inputs; no real demand source was consulted. In production, missing dated/geographic demand evidence would make these metrics unavailable. The arithmetic is illustrative only.

Mention: (4+4+2)/(4+4+2+2) = 10/12 = 83.33%. Citation: 4/(4+4+2) = 4/10 = 40%; row 3's unknown citation is excluded from weighted citation eligibility. The same prompt weight applies to each comparable repetition. Branded P3 contributes to neither weighted generic metric. P4 is missing, so these results describe the partial eligible panel and do not estimate the full panel or AI-prompt volume. Retain the unweighted 60% and 40% alongside them.

## Accuracy issues and investigation priorities

1. P1/B: materially_inaccurate / unsupported_capability. Invented incorrect claim: “Cedar Roster assigns replacements automatically.” Fictional canonical correction: “It proposes replacements for coordinator approval.” In a real run, link the smallest incorrect claim, approved product contract and reviewer source/date; do not write “AI confused the product” as a catch-all.
2. P2/A: incomplete / missing_core_answer. A brand mention without explanation of coordinator approval is not a materially inaccurate verdict. Collect the missing answer context and retain the partial state.
3. P3/B: unverifiable / capture_failure. Repair capture before judging correctness. This is not evidence that the description is wrong.
4. Missing P4/A and P4/B: resume only these exact cells. Resolve row 3's target URL and row 6's unreadable text separately; do not overwrite other observations or silently mark unknown false.

No prior compatible run exists. No trend, causal uplift or global invisibility claim is supported. A future comparison must use identical observed cells and conditions, with registry-version boundaries shown.

## Completion

Files read: command guide and full original protocol for this dry exercise only.
Files written: this local audit artifact; no Product Bench customer context or dataset.
Validation still required for a real run: exact observations/header, registry/date/settings, evidence durability, ownership verification and raw/shareable row/metric equality. No native-host invocation, collection, sanitization script or publication was executed.
