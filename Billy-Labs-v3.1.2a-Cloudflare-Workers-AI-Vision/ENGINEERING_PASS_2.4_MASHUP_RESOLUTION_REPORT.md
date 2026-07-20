# Engineering Pass 2.4 — Mashup Resolution Report

## Scope
Audit how ingredient pairs become concrete rows in `EMOJI_KITCHEN_DATA`, including reversed pairs, duplicate ingredients, missing pairs, URL requests, and authored demo/profile references.

## Finding
Exact pair resolution was repeated as linear full-array scans in the mashup page, Home community content, and profile rendering. The comparisons were correct but had no shared contract, no reusable index, and no explicit distinction between production resolution and decorative fallback behavior.

## Changes
- Expanded `mashup-core.js` from identity API v2 to identity-and-resolution API v3.
- Added `buildResolutionIndex(rows)`, `resolve(rows,left,right)`, `resolveId(rows,id)`, and `has(rows,left,right)`.
- Resolution is canonical, order-independent, duplicate-safe, NFC-normalized, exact, and returns `null` for missing or incomplete pairs.
- Resolution indexes are cached per dataset array with `WeakMap` and retain the original dataset row as the source of truth.
- Routed mashup detail, Home community content, and profile exact lookups through the shared resolver.
- Preserved profile/demo ingredient fallback only after exact resolution fails. It remains presentation substitution, not proof that the authored pair exists.
- Routed emoji-page detail URLs through the canonical URL builder.

## Inventory proof
All 147,000 rows resolve to themselves in both ingredient orders. The index contains 147,000 entries, matching the unique canonical-ID count established in Pass 2.2. Duplicate-ingredient rows resolve normally.

## Compatibility
No dataset rows, canonical IDs, stored progress keys, URLs, favorites, collections, blurblets, or cloud records were migrated or rewritten.

## Recommendation
Use `BillyMashups.resolve` or `resolveId` for every future exact mashup lookup. Never treat fuzzy, ingredient-only, or authored-demo substitution as canonical resolution.
