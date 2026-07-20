# Curator Explorer Foundation Report

## Objective
Repurpose the unused public Explorer as a private curator inventory workspace without rebuilding its mature 147,000-row browser.

## Audit finding
The shared bottom navigation was the only active public entry point to Explorer. The page already loaded canonical identity, shared search, shared discovery, private curator drafts, and published curator content. This made an in-place conversion safer than a replacement implementation.

## Implemented foundation
- Public navigation entry removed.
- Page identity changed to Billy Labs Curator / Museum Archive.
- Visitor discovery controls replaced with curator workflow shortcuts.
- Status filtering uses `BillyCuratorData.draftList()` and `BillyCuratorData.listPublished()`.
- Recently Added uses the shared discovery engine's newest inventory date.
- Cards expose Missing, Draft, or Published state.
- Inspector links to the existing mashup editor using `curator=1`.

## Preserved behavior
Search fields, newest/oldest sorting, pagination, direct mashup links, canonical IDs, and the underlying inventory remain unchanged.
