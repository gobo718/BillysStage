# Stage 3C Data Contracts

Stage 3C separates reusable data mechanics from BillysLab-specific definitions while preserving existing browser paths and behavior.

## Canonical item identity

`engine/contracts/data/item-identity.js` defines typed item references for mashups and base emoji. Mashup IDs continue to delegate to `BillyMashups.id`, preserving unordered pairs and duplicate-ingredient pairs such as `😀|😀`.

## Collection separation

- Engine mechanics: `engine/game/collections/collection-service.js`
- BillysLab definitions: `games/billyslab/content/collection-definitions.js`
- BillysLab storage adapter: `games/billyslab/content/collections-repository.js`
- Historical entry point: `collections-data.js`

The Engine owns normalization and public projection. BillysLab owns collection names, icons, storage keys, migration rules, and defaults.

## Curator records

- Engine contracts: `engine/game/publishing/curator-records.js`
- BillysLab repository adapter: `games/billyslab/content/curator-repository.js`
- Historical entry point: `curator-data.js`

Draft records and published records are now distinct. Published projections intentionally exclude private curator notes.

## JSON schemas

Versioned schemas live in `engine/contracts/data/` for curator drafts, published curator records, and public collection projections.

## Museum boundary

The existing public UI continues to call `BillyCuratorData.list()`. That compatibility method now resolves to the published projection only. Draft access remains explicit through `draftList()` and `getDraft()` for Curator workflows.
