# 2. Discover and verify schema

Inspect only approved tables or APIs. Record each field's meaning, type, event timestamp, ingestion timestamp, identity key, retention, and known gaps. Check sample rows without exporting personal data. Verify that the expected event is actually emitted in the current product version. Save schema facts in `metrics.md` with source and date.

An empty query result can mean no behavior, a renamed event, a lagged pipeline, or insufficient permission. Check each before interpreting it.
