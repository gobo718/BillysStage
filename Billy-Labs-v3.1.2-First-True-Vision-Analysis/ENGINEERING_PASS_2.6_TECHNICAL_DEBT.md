# Engineering Pass 2.6 — Technical Debt

- Full-inventory unseen discovery remains linear because eligibility depends on mutable progress state.
- Search indexes increase browser memory usage; precise cross-device memory profiling remains future work.
- Cache invalidation is intentionally absent because release inventory arrays are immutable snapshots.
- Explorer favorites filtering still creates a temporary candidate array before text search.
- Build-time generated ingredient and search indexes may become worthwhile if the inventory grows far beyond 147,000 rows.
- Browser-level interaction profiling on low-memory Android hardware remains recommended before major visual expansion.
