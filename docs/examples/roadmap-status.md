# Roadmap Lifecycle Status: 2026-10-07

**Fictional dry draft.** This hand-authored exercise uses the invented inventory below; no repository specs were scanned and no host workflow was executed. Date-only differences use Asia/Kolkata calendar dates. Scope: fictional `docs/specs` and `working/drafts` fixtures. Threshold policy: inherited review heuristics, strictly greater-than: Draft 14; In Review 7; Approved 21; In Dev 28; Validate 90; Shipped no threshold. This is a lifecycle report, not a new roadmap.

## Health overview


**Record 1**

| Field | Value |
|---|---|
| Fictional spec | Shift warning |
| Stage | Draft |
| Last change / days | 2026-09-23 / 14 |
| Flag | Healthy at exact threshold |
| Exposure control | Not specified |
| Outcome evidence | Not yet expected; pilot plan draft |


**Record 2**

| Field | Value |
|---|---|
| Fictional spec | Bulk swap |
| Stage | In Review |
| Last change / days | 2026-09-29 / 8 |
| Flag | Stall; >7 |
| Exposure control | Unknown |
| Outcome evidence | Reviewer notes awaiting criteria clarification |


**Record 3**

| Field | Value |
|---|---|
| Fictional spec | Receipt retry |
| Stage | Approved |
| Last change / days | 2026-09-15 / 22 |
| Flag | Stall; >21 |
| Exposure control | Named staged cohort in fixture |
| Outcome evidence | No dev start recorded |


**Record 4**

| Field | Value |
|---|---|
| Fictional spec | Availability refresh |
| Stage | In Dev |
| Last change / days | 2026-09-01 / 36 |
| Flag | Stall; >28 |
| Exposure control | Proposed manual rollback, unverified |
| Outcome evidence | Fixture lifecycle note: provider credential blocked |


**Record 5**

| Field | Value |
|---|---|
| Fictional spec | Team invite |
| Stage | Draft |
| Last change / days | 2026-09-10 / 27 |
| Flag | Stall; >14 |
| Exposure control | None in draft |
| Outcome evidence | Missing owner decision |


**Record 6**

| Field | Value |
|---|---|
| Fictional spec | At-risk digest |
| Stage | Validate |
| Last change / days | 2026-07-08 / 91 |
| Flag | Outcome review candidate |
| Exposure control | Fixture `digest_cohort` toggle |
| Outcome evidence | Fictional pilot report shows intended mechanism supported; limited sample |


**Record 7**

| Field | Value |
|---|---|
| Fictional spec | Reminder copy |
| Stage | Shipped |
| Last change / days | 2026-07-08 / 91 |
| Flag | Done; no stage-age stall |
| Exposure control | Not applicable |
| Outcome evidence | Fixture release note; outcome definition still missing |


**Record 8**

| Field | Value |
|---|---|
| Fictional spec | Replacement shortlist |
| Stage | Draft |
| Last change / days | Missing / unknown |
| Flag | Data gap |
| Exposure control | Unknown |
| Outcome evidence | None supplied |


**Record 9**

| Field | Value |
|---|---|
| Fictional spec | Multi-site control |
| Stage | "Blocked" (unmapped) |
| Last change / days | 2026-09-15 / 22 |
| Flag | Unknown-stage data gap |
| Exposure control | Unknown |
| Outcome evidence | Fixture has no lifecycle mapping |


**Record 10**

| Field | Value |
|---|---|
| Fictional spec | Schedule export |
| Stage | In Review |
| Last change / days | 2026-10-09 / invalid future date |
| Flag | Data gap |
| Exposure control | Unknown |
| Outcome evidence | None supplied |


Modification dates are not substituted for last-stage-change dates. All spec names, metadata, flags and evidence are fictional fixtures, not verified implementation claims.

## Outcome review candidates

**At-risk digest:** 91 days in Validate merits review. The fictional supplied pilot report supports the limited tested mechanism, so propose a lifecycle close-out discussion with the product owner and remaining outcome limitations, rather than disable it. Do not declare rollout success from six participants. If the report were absent, propose collecting the named outcome this week, or an owner-backed two-week extension with a measurement deadline; disablement would require evidence and an explicit decision, not age alone.

## Stalls and portfolio health

Four simultaneous stalls exceed the >3 portfolio heuristic. Propose a 30-minute portfolio triage before adding work to NOW.

- Bulk swap: review stalled; fixture review note identifies unresolved acceptance criteria. Proposed action: resolve the one consequential criterion with the reviewer/owner; do not infer lack of team motivation.
- Receipt retry: approved but no start; cause unknown. Proposed action: check actual availability/dependencies before promising a start date.
- Availability refresh: fixture note explicitly says credentials blocked. Proposed action: clarify owner and permitted credential verification path; do not claim provider access exists.
- Team invite: draft lacks an owner decision. Proposed action: owner-led promote/park discussion with rationale. No archival or deletion is executed.

## Healthy and missing data

Shift warning is exactly 14 days in Draft: not stalled under >14. Reminder copy is Shipped: no age-based stall; missing outcome definition still merits documentation.

Replacement shortlist needs a real last-stage-change date. Multi-site control needs mapping of "Blocked" to the configured lifecycle or an explicit custom threshold. Schedule export needs correction of a future date before stage age can be interpreted. These three remain data gaps, not healthy items or invented zero-day ages.

## Next action

Propose portfolio triage and owner-backed metadata fixes. Keep this report separate from a new sequencing decision. No flags were changed, no people contacted, no specs archived, and no commitments invented.

## Exercise assessment

Day differences independently computed with Python date arithmetic: 14, 8, 22, 36, 27, 91 and future -2. Passes strict-boundary handling, >3 stalls trigger, actual last-stage-change requirement, outcome review versus automatic kill distinction, unknown/future data separation, and mode-specific output. This checks drafting instructions and arithmetic, not live host behavior or real portfolio health.
