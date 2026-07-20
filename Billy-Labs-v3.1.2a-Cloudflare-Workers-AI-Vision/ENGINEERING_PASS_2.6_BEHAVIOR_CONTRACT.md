# Engineering Pass 2.6 — Behavior Contract

1. Performance changes must not change canonical mashup IDs.
2. Cached resolution must return the original inventory row.
3. Ingredient lookup must preserve source-row order and include duplicate-ingredient rows once.
4. Empty-query search must return an independent array.
5. Search indexing must preserve existing substring matching and searchable fields.
6. Discovery must evaluate current seen and exclusion state on every selection.
7. Random selection must preserve candidate ordering and random-index semantics.
8. Newest discovery must continue using the lexicographically greatest `YYYYMMDD` release date.
9. Cached collection results exposed publicly must be copied when callers previously received a fresh array.
10. Inventory arrays are treated as immutable release snapshots after loading.
