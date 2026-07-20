# Engineering Pass 2.3 — Search Architecture Report

## Scope

Reviewed text-search and ingredient-lookup behavior in Explorer, emoji detail pages, Collection Book, metadata collection pages, and Curator Research Lab.

## Finding

Search behavior had grown into three independent substring matchers plus one exact ingredient lookup. The implementations were small and functional, but each page owned normalization and matching directly. This created a future drift risk: adding aliases, fuzzy matching, or indexing would have required separate edits across multiple surfaces.

## Changes

- Added `mashup-search.js`, a rendering-independent shared contract.
- Centralized query normalization, substring matching, mashup-row search, generic item search, row sorting, and exact ingredient containment.
- Routed all current user-facing search surfaces through the shared module.
- Kept page-specific searchable fields and presentation outside the module.

## Architecture health

**Good.** Search mechanics now have one authority without coupling the engine to DOM rendering or UI copy.

## Behavior preserved

- Explorer searches emoji, raw mashup name, compact date, and formatted date.
- Explorer favorites-only and unseen-first behavior is unchanged.
- Emoji pages search the same four row fields and preserve newest, oldest, and name sorts.
- Collection Book searches emoji glyph, official name, and subgroup.
- Curator Research Lab remains an exact ingredient lookup.
- Existing result order, pagination, empty states, and links remain unchanged.
