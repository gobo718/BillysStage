# Engineering Pass 2.3 — Future Extension Points

Future search improvements should extend `BillySearch` rather than add page-local matchers.

Suitable additions include:

- searchable aliases and common names;
- tokenized matching;
- fuzzy matching;
- relevance scoring;
- a precomputed search index;
- category and metadata filters;
- Laboratory ingredient suggestions;
- Curator Studio research filters.

Rendering, pagination, result cards, and page-specific copy should remain outside the search module.
