# Engineering Pass 2.3 — Search Behavior Contract

## Inputs

- A list of mashup rows or catalog items.
- A user query that may contain whitespace, emoji, text, or dates.
- Optional page-specific text accessors and sort context.

## Outputs

- A new array containing matching items.
- A new sorted array when a supported sort mode is requested.
- No mutation of the source array.

## Invariants

1. Query matching is case-insensitive and trims outer whitespace.
2. An empty query returns every source item in source order.
3. Search does not render HTML, read the DOM, or manage pagination.
4. Pages decide which fields are searchable.
5. Exact ingredient lookup compares complete emoji strings, not substring text.
6. Sorting never changes canonical identity or mashup data.
7. Search results remain ordinary mashup rows consumable by `BillyMashups`.
