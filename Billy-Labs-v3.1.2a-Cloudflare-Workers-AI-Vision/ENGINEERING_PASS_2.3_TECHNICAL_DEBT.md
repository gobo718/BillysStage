# Engineering Pass 2.3 — Technical Debt

## Deferred intentionally

- Search has no alias dictionary or synonym support.
- Search has no fuzzy matching, token weighting, or relevance ranking.
- Mashup names remain searched in their stored underscore form; page behavior was preserved rather than broadened.
- The 147,000-row inventory is scanned in memory for each query.
- Search state is persisted only where the existing page already persisted it.

## Why deferred

Pass 2.3 establishes one authoritative pipeline without redefining results. Ranking, aliases, indexing, and performance belong in later product or performance work after the present behavior is locked by tests.
