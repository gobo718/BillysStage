# Engineering Pass 2.1 — Canonical Identity Behavior Contract

## Inputs
Two emoji strings representing the ingredients in a mashup.

## Canonical output
`BillyMashups.id(left, right)` returns exactly two normalized emoji components separated by `|`.

## Invariants

1. Ingredient order does not change identity.
2. Duplicate ingredients remain two ingredients: `A + A` becomes `A|A`.
3. Existing canonical IDs must remain stable.
4. Display order and URL order may preserve the data row order; stored identity must not depend on display order.
5. Features must consume `BillyMashups.id()` rather than sorting or concatenating pairs independently.
6. New mashup links must be created with `BillyMashups.buildUrl()`.
7. The mashup page must continue accepting legacy `emoji1` / `emoji2` links.
8. Canonical identity is opaque to downstream features. They may store it but must not redefine it.

## Public API

- `normalizeEmoji(value)`
- `canonicalPair(left, right)`
- `id(left, right)`
- `parseId(value)`
- `buildUrl(mashup, base?)`
- `pairFromSearch(search)`
- `open(mashup)`

## Consumers

- progress and favorites
- Collection Book and curator collections
- curator blurblets and cloud-published blurblets
- Home, Explorer, Mashup, Profile, and Blurblet Gallery links
- future Laboratory, Profiles, Trophies, and account sync
