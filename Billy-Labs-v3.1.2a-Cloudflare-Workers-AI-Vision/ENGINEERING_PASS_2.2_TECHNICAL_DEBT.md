# Engineering Pass 2.2 — Technical Debt Log

## Deferred

### Authored demo references
Five unique profile/demo pairs are absent from the canonical inventory. Their creative intent should be reviewed during a profile/content pass rather than changed during data-integrity stabilization.

### Remote asset availability
The validator proves URL structure and ingredient/date correspondence but does not issue 147,000 network requests. Remote availability remains an external-source concern and should be checked through sampled or provider-aware monitoring, not during every local test run.

### Runtime browser storage
Draft curator records and user-created collections live in browser storage and cannot be exhaustively validated from the static release archive. Their schemas should receive dedicated runtime validation when those systems enter their own engineering passes.
