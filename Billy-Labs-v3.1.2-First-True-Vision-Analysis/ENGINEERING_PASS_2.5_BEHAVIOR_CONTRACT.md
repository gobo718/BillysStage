# Engineering Pass 2.5 — Discovery Behavior Contract

1. Discovery operates only on supplied valid inventory rows.
2. Random selection returns `null` for an empty pool.
3. Exclusions are applied before unseen preference.
4. Unseen preference falls back to the eligible pool unless the caller explicitly treats exhaustion as completion.
5. Newest discovery is based on the lexicographically greatest normalized release date.
6. Selection within an eligible pool is uniform through one random-index operation.
7. Callers may inject a deterministic random function for testing.
8. Discovery never invents, resolves, or substitutes mashup rows.
