# Product Spec: Resumable contact-list imports
> Bet: supplied fictional decision D-1, 2026-10-07: preserving completed rows and filename edits should make interrupted imports easier to finish. This is a proposed bet, not validated research.
> Exposure/kill switch: `[NEEDS DECISION: product owner before exposure]`.
> Design companion: missing; existing import screen is a fixture, and its resumed-state interaction is provisional pending prototype review.
> Warnings: No real baseline, verified instrumentation, independent review, or prototype. Draft only.

## 1. Problem
An import owner returning after an interruption needs to distinguish completed contacts from rows still needing action. The supplied fictional report describes restarting the whole file and retyping its name. Frequency and impact need evidence before making an outcome claim.

## 2. Hypothesis
D-1: if the owner can resume unresolved rows with completed rows and filename edits preserved, they can finish an interrupted import with less repeated work. The user-supplied decision serves as the soft prerequisite; no hypothesis command execution is claimed.

## 3. Scope
- IN: Restore an interrupted import, preserve filename edits/completed rows, retry unresolved rows once per contact, handle permissions and unavailable sources, and expose progress states.
- DEFERRED: Cross-device resume, until session ownership and conflict handling have an approved design.
- OUT: Collaborative editing and additional source connectors; they do not test the current bet.
- CUT: Automatically retrying every failed row, because unreviewed conflicts could apply the wrong contact. Owners choose which unresolved rows to retry.

## 4. Observable behavior
The owner opens the existing Imports area and selects an interrupted import. Its filename and completed rows reappear; unresolved rows remain actionable. Retry acts on the selected unresolved row. Returning after another interruption preserves the latest verified progress. No layout fidelity is claimed without the prototype.

| Fixture input → condition | Expected observable result |
|---|---|
| Import I: row A complete, row B pending; owner returns | A stays complete; B is actionable; edited filename remains |
| Retry B twice during one outstanding attempt | One successful contact B appears, with no duplicate; second attempt is visibly disabled while pending |
| Import I has no verified source rows after access disappears | Progress becomes unavailable; previously completed contacts are not deleted; retry creates no contacts |

Consumers: import owner sees progress; contact list reflects completed contacts only. Uncertain rows contribute no completed count until a result is verified. No queue, library, or storage implementation is prescribed.

## 5. Acceptance criteria
| Term | Definition | Existing product equivalent | Source/instrumentation |
|---|---|---|---|
| Complete row | A verified contact has been applied once | Fixture import row “Complete” | Proposed `import_row_completed` |
| Unresolved row | Pending, failed, or uncertain row without a verified applied result | Fixture import statuses | Fixture contract below |
| Eligible interrupted import | Owner started an import with at least one unresolved row and then left | New reporting definition; no verified dashboard equivalent | Proposed `import_interrupted` |
| Resumed completion rate | Eligible interrupted imports completed within seven days / eligible interrupted imports | New outcome definition | Proposed interruption/completion events |
| Duplicate-contact guardrail | Successful retries creating more than one contact for the same import/row | New guardrail definition | Proposed `import_retry_duplicate` |

| ID / story | Pass/fail condition | Test input → expected result |
|---|---|---|
| AC-1 Restore | Returning preserves filename, completed rows, and unresolved row status | Edit name to “October”; complete A; leave → return shows “October,” A complete, B unresolved |
| AC-2 Retry | A retry creates at most one completed contact per import/row | Submit B twice → one B; further retry on completed B is disabled |
| AC-3 Loading | While progress loads, show loading and perform no retry | Delayed progress response → loading; retry disabled; verified result replaces loading |
| AC-4 Empty | With no imports, show an empty state and a permitted start action | Zero imports → no fictitious progress or completion percentage |
| AC-5 Partial | Completed rows remain visible while other rows load | A verified complete, B unavailable → A complete; B pending/unavailable; no guessed B result |
| AC-6 Failure/recovery | Failed retry leaves the row unresolved with a retry path and no fabricated completed contact | Failed B → failure explanation; retry allowed after recovery |
| AC-7 Permission | Revoked import permission disables mutation with an explanation | Permission revoked before retry → no contact change; display allowed access-recovery action |
| AC-8 Reversion | Lost source availability replaces stale progress with unavailable state without deleting completed contacts | Previously computed progress becomes unavailable → no stale “complete” claim; contacts A preserved |
| AC-9 Below-threshold | No arbitrary sample threshold is needed to resume one import | One pending row → actionable; reporting conclusions remain limited by sample size |
| AC-10 Formula domain | Rate has explicit zero/empty/missing-baseline handling | Zero eligible imports → “No eligible imports,” not 0%; eligible but zero completed → 0%; no baseline → baseline unavailable, no change claim |

No model judgment or generative product output is in scope, so no AI eval block applies. The deterministic tests verify the build before launch; the rate measures outcomes afterward.

## 6. Success metrics
| Metric / definition | Baseline → target | Window | Instrumentation / verification | Tier / attribution limits |
|---|---|---|---|---|
| Resumed completion rate, defined above | `[NEEDS DATA]` → target pending baseline | Seven-day completion window; eligible cohort fixed at exposure | `import_interrupted`, `import_completed`; proposed, not verified | Outcome; cohort comparison alone does not establish causality |
| Resume action count | `[NEEDS DATA]` → diagnostic only | Same eligible cohort/window | `import_resumed`; proposed | Activity, not proof of value |
| Duplicate-contact guardrail | Baseline unknown → no duplicate allowed in deterministic tests; monitored tolerance pending | Per retry and agreed observation window | `import_retry_duplicate`; proposed | Guardrail; owner and rollback rule pending before exposure |

## 7. Constraints and scale
Supplied fixture data contract: `import_id: string` and `row_id: string` are non-null; `status: pending|complete|failed|uncertain` is non-null; `contact_id: string|null` is non-null only for complete rows. A completed row's contact cannot be reapplied on retry. Filename is a non-null user-editable string. Other consumers must not count uncertain/failed rows as complete. Retention, cross-session identity, supported scale, and performance limits are unresolved; no numerical limit is invented.

## 8. Prior decisions and open decisions
Prior: D-1, 2026-10-07, supplied fixture decision: preserve progress/edits to test reduced repeated work; automatic retry was cut to protect conflict review. The pointer is fictional and its meaning is summarized here.

| Type | Decision/gap | Owner | Due gate | Evidence needed |
|---|---|---|---|---|
| NEEDS DATA | Frequency, baseline, event implementation, and contract provenance | Measurement owner, unassigned | Outcome claim / validation | Permitted logs, schema and current-state observation |
| NEEDS DECISION | Exposure, kill switch and guardrail rollback action | Product owner, unassigned | First exposure | Explicit risk decision and responsible owner |
| NEEDS DECISION | Retention, cross-session identity, scale/performance and consumer compatibility | Engineering owner, unassigned | Implementation readiness | Approved constraints and owning consumer confirmation |
| ASSUMPTION | Existing screen can express resumed/partial/unavailable states clearly | Design owner, unassigned | Build readiness | Prototype and actual state inspection |

