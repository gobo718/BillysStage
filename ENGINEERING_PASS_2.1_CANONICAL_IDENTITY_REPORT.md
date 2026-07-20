# Engineering Pass 2.1 — Canonical Identity Report

## Release
Billy Labs v2.5.1

## Baseline
`Billy-Labs-v2.5.0-engineering-pass-1-infrastructure-complete.zip`

## Scope
Canonical mashup identity only: ID creation, normalization, URL transport, progress storage, collection membership, curator records, blurblet publishing, and public identity consumers.

## Finding
Billy Labs already had one sound canonical storage identity in `mashup-core.js`: an order-independent pair joined by `|`. Duplicate-ingredient mashups were correctly preserved as two components, such as `😀|😀`.

The audit found consumer drift rather than a defective canonical ID:

- Profile and Blurblet Gallery generated legacy `emoji1` / `emoji2` URLs.
- The mashup page accepted only `left` / `right`, making those generated links fail.
- Home, Explorer, and Mashup pages contained independent `[left, right].sort().join('|')` identity builders.
- Native JavaScript sorting disagreed with the canonical comparator for 24,178 rows in the current dataset, so those bypasses could address different curator or cloud records.

## Changes made

- Kept the established canonical ID algorithm and stored ID format unchanged.
- Expanded `BillyMashups` to expose:
  - `parseId(value)`
  - `pairFromSearch(search)`
  - the documented separator
- Made `buildUrl()` normalize its URL values.
- Added compatibility intake for legacy `emoji1` / `emoji2` links.
- Replaced all raw pair sorting used as identity with `BillyMashups.id()`.
- Updated Profile and Blurblet Gallery to use `BillyMashups.buildUrl()`.
- Added a dedicated canonical identity regression suite.

## Dataset verification

- Mashup rows: 147,000
- Unique canonical IDs: 147,000
- Canonical collisions: 0
- Duplicate-ingredient mashups: 413
- Exact duplicate rows: 0

## Compatibility

Preserved:

- canonical `emoji|emoji` storage values
- existing progress, favorites, collection members, curator records, and cloud IDs
- order-independent identity
- duplicate-ingredient identity
- current `left` / `right` URLs
- old `emoji1` / `emoji2` inbound links

No stored-data migration was required.

## Architecture health
Healthy after correction. Identity creation and URL creation now have one public authority: `window.BillyMashups`.
