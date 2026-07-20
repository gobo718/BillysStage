# Billy Labs v2.0.0 Architecture Audit

**Audited build:** `Billy-Labs-v2.0.0-Collection-Update-1.zip`  
**Release label:** Billy Labs v2.0.0 — The Collection Update  
**Audit date:** 2026-07-17  
**Purpose:** Document the application as it actually exists before introducing a shared data layer, Cloudflare Workers, D1, accounts, or synchronization.

---

## 1. Executive Summary

Billy Labs v2.0.0 is a functional browser-only application built from static HTML pages, shared global JavaScript modules, inline page controllers, a large canonical mashup dataset, and `localStorage`.

The current build is more modular than a typical static prototype. It already has shared modules for:

- canonical mashup identity;
- progress and favorites;
- collection storage;
- action-button feedback;
- Billyisms;
- hidden-category definitions;
- achievement definitions.

However, the application does not yet have a unified data-access layer. Some pages use the shared modules, while others read or write `localStorage` directly. This is the main architectural issue that should be fixed before Cloudflare synchronization is added.

The safest next step is not a backend rewrite. It is a local-only refactor that introduces a single storage gateway while preserving all current behavior.

### Overall readiness

| Area | Assessment |
|---|---|
| Static deployment | Ready |
| Canonical mashup identity | Good foundation |
| Shared progress model | Good foundation, incomplete encapsulation |
| Collections | Functional draft/publish foundation |
| Offline operation | Fully local |
| Cloud synchronization | Not ready until direct storage calls are centralized |
| Accounts | Not implemented |
| Community systems | Definitions/plans only |
| Automated tests | Not present |
| Build pipeline | Not present |
| Data payload efficiency | Needs attention |

---

## 2. Project Inventory

### Top-level files

| File | Approximate size | Current responsibility |
|---|---:|---|
| `index.html` | 21 KB | Public home page, Daily Pick, shortcuts, progress summary |
| `explorer.html` | 25 KB | Search, filters, paging, random discovery, unseen discovery |
| `mashup.html` | 19 KB | Mashup detail, copy, favorite, curator editing |
| `collection-book.html` | 15 KB | Public collection album and per-emoji discovery pages |
| `collection.html` | 9 KB | Unicode release collection view |
| `emoji.html` | 14 KB | Individual emoji profile |
| `dispatches.html` | 3 KB | Static dispatches page |
| `curator/index.html` | 5 KB | Collection control room, import/export, publishing |
| `emoji-data.js` | 21 MB | Canonical Emoji Kitchen mashup rows and image URLs |
| `emoji-metadata.js` | 109 KB | Emoji names, code points, releases, categories, subgroups |
| `mashup-core.js` | 935 B | Canonical unordered mashup identity and detail URLs |
| `progress-engine.js` | 1.8 KB | Seen/favorite state and legacy migration |
| `collections-data.js` | 2 KB | Collection schema, migration, persistence |
| `action-ui.js` | 3 KB | Shared copy feedback and blurblet alignment |
| `billyisms.js` | 614 B | Curated mashup blurblets |
| `hidden-categories.js` | 344 B | Hidden-category configuration foundation |
| `achievements.js` | 202 B | Achievement configuration foundation |
| `PROJECTLOG.md` | 6.6 KB | Release history and architectural decisions |
| `RELEASE-MANIFEST.txt` | 500 B | v2.0.0 release summary |

---

## 3. Current Runtime Architecture

Billy Labs currently uses a page-controller architecture.

Each HTML page contains:

1. its own CSS;
2. one or more shared scripts;
3. a substantial inline script that controls that page.

Shared modules expose APIs through `window`.

### Shared globals

| Global | Owner | Purpose |
|---|---|---|
| `window.EMOJI_KITCHEN_DATA` | `emoji-data.js` | Entire mashup dataset |
| `window.EMOJI_PROFILE_METADATA` | `emoji-metadata.js` | Emoji metadata |
| `window.BillyMashups` | `mashup-core.js` | Canonical IDs and detail URLs |
| `window.BillyProgress` | `progress-engine.js` | Seen/favorite state |
| `window.BillyCollections` | `collections-data.js` | Collection state |
| `window.BillyActionUI` | `action-ui.js` | Shared action feedback |
| `window.BILLYISMS` | `billyisms.js` | Curated blurblets |
| `window.BILLY_HIDDEN_CATEGORIES` | `hidden-categories.js` | Hidden-category rules |
| `window.BILLY_ACHIEVEMENTS` | `achievements.js` | Achievement definitions |

### Dependency direction

```text
emoji-data.js ───────────────────────────────┐
emoji-metadata.js ──────────────────────────┤
                                             ├─> page controllers
mashup-core.js ─> progress-engine.js ───────┤
       │                                     │
       └────────────> collections-data.js ───┘

action-ui.js ────────────────────────────────> home + mashup UI
billyisms.js ───────────────────────────────> home + mashup UI
```

The dependency chain is implicit. Script order matters, but there is no loader or validation that required globals exist.

---

## 4. Page Ownership

## `index.html`

Owns:

- home-page rendering;
- Billy’s Daily Pick;
- copy feedback;
- favorite button state;
- navigation shortcuts;
- current explorer-state resume link.

Dependencies:

- `emoji-data.js`
- `mashup-core.js`
- `action-ui.js`
- `progress-engine.js`
- `collections-data.js`
- `billyisms.js`

Direct storage access still present:

- `billy-curator-entries-v1`
- legacy `ek-favorites`
- `ek-explorer-state`

The Daily Pick code correctly attempts to remain resilient when progress storage fails, but it bypasses the shared progress API when mirroring favorites into the legacy key.

---

## `explorer.html`

Owns:

- search;
- filtering;
- result paging;
- result rendering;
- Surprise Me;
- Show Me Something New;
- explorer-state persistence;
- result metrics;
- curator blurblet lookup.

Dependencies:

- `emoji-data.js`
- `mashup-core.js`
- `progress-engine.js`
- `collections-data.js`
- `hidden-categories.js`
- `achievements.js`

Direct storage access:

- `billy-curator-entries-v1`
- `ek-explorer-state`
- `ek-last-page`

The Explorer is the largest active page controller and the most important integration point for a future data layer.

---

## `mashup.html`

Owns:

- locating a mashup row from URL parameters;
- mashup detail display;
- marking the mashup seen;
- favoriting;
- image copying;
- emoji copying;
- public blurblet display;
- curator notes;
- draft collection membership.

Dependencies:

- `emoji-data.js`
- `billyisms.js`
- `hidden-categories.js`
- `achievements.js`
- `mashup-core.js`
- `action-ui.js`
- `progress-engine.js`
- `collections-data.js`

Direct storage access:

- `billy-curator-entries-v1`

This page mixes public behavior and curator behavior in two inline controllers. Curator controls are hidden on ordinary public hosts, but the code and storage logic still ship publicly.

---

## `collection-book.html`

Owns:

- category organization;
- per-emoji album pages;
- discovered/shrouded rendering;
- overall progress;
- per-page completion;
- search.

Dependencies:

- `emoji-data.js`
- `emoji-metadata.js`
- `mashup-core.js`
- `progress-engine.js`

This is the cleanest new v2.0.0 page in terms of storage behavior because it uses `BillyProgress` rather than accessing progress keys directly.

---

## `collection.html`

Owns:

- Unicode-version collection rendering.

Dependencies:

- `emoji-data.js`
- `emoji-metadata.js`

It does not load `mashup-core.js` or `progress-engine.js`, so it currently behaves as a canonical-data view rather than a personalized collection view.

---

## `emoji.html`

Owns:

- emoji metadata profile;
- related mashup display;
- links to Unicode collections;
- inferred metadata fallbacks.

Dependencies:

- `emoji-data.js`
- `emoji-metadata.js`

It does not currently use shared progress or canonical URL helpers.

---

## `curator/index.html`

Owns:

- collection creation;
- editing;
- duplication;
- deletion;
- draft membership;
- publishing;
- JSON backup/export;
- JSON import;
- progress backup.

Dependencies:

- `mashup-core.js`
- `collections-data.js`
- optional `BillyProgress`

The control room is functional but implemented as a compact inline script. It should be separated into its own module before its responsibilities expand.

---

## 5. Storage Audit

### Current keys

| Key | Owner today | Contents | Classification | Future destination |
|---|---|---|---|---|
| `billy-progress-seen-v1` | `progress-engine.js` | Canonical mashup IDs | User state | D1 + local cache |
| `billy-progress-favorites-v1` | `progress-engine.js` | Canonical mashup IDs | User state | D1 + local cache |
| `ek-seen` | migration compatibility | Legacy seen IDs | Legacy | Remove after migration window |
| `ek-favorites` | migration compatibility and home mirror | Legacy favorite IDs | Legacy | Remove after migration window |
| `billy-collections-v1` | `collections-data.js` | Collection records, drafts, published snapshots | User/curator state | D1 + local cache |
| `billy-curator-entries-v1` | several pages | Blurblets and private notes keyed by mashup | Curator content | D1 canonical curator tables |
| `billy-curator-exhibits-v1` | collection migration | Legacy exhibit names | Legacy | Remove after migration window |
| `ek-explorer-state` | home + Explorer | Search/filter state | Device UI state | Keep local |
| `ek-last-page` | Explorer | Current result page | Device UI state | Keep local |

### Important distinction

Not every local value should synchronize.

#### Should synchronize

- seen mashup IDs;
- favorites;
- collections;
- collection membership;
- published collection snapshots;
- curator blurblets;
- curator private notes, if the curator account is cloud-backed.

#### Should remain device-local

- current search;
- current result page;
- temporary UI state;
- animation state;
- cached query results.

#### Should be derived

- completion percentages;
- collection totals;
- seen totals;
- favorite totals;
- category completion;
- completed-page badges.

---

## 6. Canonical Mashup Identity

`mashup-core.js` establishes the correct core rule:

- normalize both emoji using NFC;
- sort the pair deterministically;
- join the canonical pair with `|`;
- retain duplicate ingredients.

Examples:

```text
🐷 + 🥓 = 🥓|🐷
🥓 + 🐷 = 🥓|🐷
🐷 + 🐷 = 🐷|🐷
```

This is a strong foundation and should remain the application-level identity rule.

### Concern

The current comparator converts each emoji to a hyphenated code-point string and uses `localeCompare`. It is deterministic in normal browsers, but persistence would be safer if the comparison were explicitly numeric rather than locale-sensitive.

Recommended future rule:

1. normalize to NFC;
2. expand into arrays of integer code points;
3. compare integer arrays lexicographically;
4. serialize the canonical pair.

This change should only be made with migration tests because existing IDs already depend on the present implementation.

---

## 7. Data Ownership

### Canonical data

Owned by the application:

- mashup ingredient pair;
- mashup name;
- source date;
- image URL;
- emoji metadata;
- Billyisms;
- hidden-category definitions;
- achievement definitions;
- published curator content.

### User state

Owned by a user:

- seen;
- favorites;
- personal collections;
- future profile and reward state.

### Curator state

Owned by an authorized curator:

- collection drafts;
- private mashup notes;
- publication actions;
- collection versions.

### Derived data

Should not be separately persisted unless cached:

- completion percentages;
- counts;
- category progress;
- completed status;
- discovery totals.

---

## 8. Main Architectural Risks

## 8.1 Direct `localStorage` access bypasses shared modules

This is the most important issue.

Although `BillyProgress` and `BillyCollections` exist, several pages still read or write storage directly. A cloud adapter cannot reliably synchronize state while those bypasses remain.

Examples include:

- Explorer state;
- curator entries;
- legacy favorites;
- page position.

UI-only state can continue using local storage, but user and curator data must go through a shared gateway.

---

## 8.2 The 21 MB dataset is loaded as executable JavaScript

`emoji-data.js` is approximately 21 MB and consists of one extremely long line.

Consequences:

- every page that loads it must download, parse, and execute the full dataset;
- pages cannot request only the rows they need;
- browser parse time and memory use are higher than necessary;
- cache invalidation replaces the whole payload;
- source control diffs are effectively unusable;
- a future API cannot paginate or filter efficiently without duplicating the dataset elsewhere.

This is not an emergency for the static version, but it is the largest performance and scalability constraint.

Recommended progression:

1. keep the file during the storage refactor;
2. add a dataset-access module;
3. later split canonical data into API/queryable storage or indexed static shards;
4. preserve an offline cache.

---

## 8.3 Page logic is embedded in HTML

Most active behavior lives in large inline scripts.

Consequences:

- difficult unit testing;
- repeated helper logic;
- HTML and application logic change together;
- browser caching cannot independently cache controllers;
- dependency ownership is less clear.

The Explorer, home page, mashup detail, and Collection Book should eventually receive dedicated controller modules.

---

## 8.4 Global dependency order is implicit

Modules assume globals already exist.

For example, `progress-engine.js` calls `BillyMashups.id()` during initialization. If script order changes, initialization fails.

Recommended near-term improvement:

- add defensive dependency checks;
- document required load order;
- later adopt ES modules.

Do not convert the entire project to modules during the first data-layer refactor.

---

## 8.5 Legacy keys are still actively written

`progress-engine.js` migrates legacy values into new keys, which is appropriate. However, replacement methods also write legacy keys, and the home page writes `ek-favorites` directly.

This prevents the legacy layer from ever being retired.

Recommended policy:

- read old keys during a defined migration period;
- write only new keys;
- mark migration complete;
- remove legacy writes after verification.

---

## 8.6 Public and curator responsibilities share pages

`mashup.html` includes curator editing code and private-note storage logic.

The controls are gated by hostname or `?curator=1`, but this is only interface gating. It is not security.

That is acceptable for a local static curator tool, but it cannot become the authorization model for a cloud backend.

Future cloud rule:

- the Worker validates curator authorization;
- the browser never decides whether a write is allowed;
- public and private curator payloads use separate endpoints.

---

## 8.7 No automated regression coverage

The project has no visible test suite.

The highest-risk behaviors are:

- unordered canonical identity;
- duplicate ingredient identity;
- legacy migration;
- favorite persistence;
- seen persistence;
- Surprise Me direct routing;
- unseen selection;
- collection draft/publish separation;
- published-version immutability;
- Collection Book progress calculations.

These should receive tests before backend work begins.

---

## 9. Cloud Readiness by Module

| Module/page | Readiness | Required work |
|---|---|---|
| `mashup-core.js` | High | Add tests; consider comparator stability later |
| `action-ui.js` | High | No backend dependency |
| `billyisms.js` | High | Later move to curated content source if desired |
| `hidden-categories.js` | High | Configuration only |
| `achievements.js` | High | Empty foundation |
| `progress-engine.js` | Medium | Replace internal storage with adapter |
| `collections-data.js` | Medium | Replace storage with repository; formalize versions |
| `collection-book.html` | Medium-high | Mostly consumes shared progress already |
| `collection.html` | High | Canonical-data view only |
| `emoji.html` | High | Canonical-data view only |
| `index.html` | Medium | Remove direct user-state storage calls |
| `explorer.html` | Medium-low | Separate controller and UI-state storage from user data |
| `mashup.html` | Medium-low | Separate public controller from curator controller |
| `curator/index.html` | Low for cloud | Requires real authorization and API-backed writes |
| `emoji-data.js` | Low for scale | Add query layer and later replace monolithic delivery |

---

## 10. Proposed Local Data Layer

The first implementation should remain entirely local.

Introduce:

```text
billy-storage.js
billy-data.js
```

### `BillyStorage`

Low-level device persistence:

```js
BillyStorage.get(key, fallback)
BillyStorage.set(key, value)
BillyStorage.remove(key)
BillyStorage.transaction(callback)
```

This owns JSON parsing, error handling, quota failures, and future IndexedDB support.

### `BillyData`

Domain-level access:

```js
BillyData.progress.markSeen(left, right)
BillyData.progress.hasSeen(left, right)
BillyData.progress.toggleFavorite(left, right)
BillyData.progress.getSnapshot()

BillyData.collections.list()
BillyData.collections.get(id)
BillyData.collections.saveDraft(collection)
BillyData.collections.publish(id)

BillyData.curator.getEntry(mashupId)
BillyData.curator.saveEntry(mashupId, entry)

BillyData.ui.getExplorerState()
BillyData.ui.saveExplorerState(state)
```

The UI should not know whether the implementation is:

- `localStorage`;
- IndexedDB;
- a Cloudflare Worker;
- D1;
- or an offline queue.

### Compatibility

During the first refactor, existing globals may remain:

```js
window.BillyProgress = BillyData.progress;
window.BillyCollections = BillyData.collections;
```

That keeps the change narrow and avoids rewriting every caller at once.

---

## 11. Recommended Migration Sequence

## Step 1 — Freeze the baseline

- Preserve the uploaded ZIP unchanged.
- Create a working copy.
- Record a checksum.
- Do not combine this refactor with visual changes.

## Step 2 — Add regression tests

Test at minimum:

- canonical unordered pair;
- duplicate ingredients;
- legacy progress migration;
- favorite toggle;
- seen state;
- collection migration;
- collection draft/publish;
- Surprise Me routing;
- Show Me Something New eligibility.

## Step 3 — Add `BillyStorage`

Centralize safe reads and writes while still using `localStorage`.

No page behavior should change.

## Step 4 — Route shared modules through `BillyStorage`

Update:

- `progress-engine.js`;
- `collections-data.js`.

## Step 5 — Remove direct domain-state access from pages

Replace direct access to:

- `billy-curator-entries-v1`;
- legacy favorite state.

Keep Explorer UI state local, but route it through a UI-state repository for consistency.

## Step 6 — Extract page controllers

Suggested files:

```text
home-page.js
explorer-page.js
mashup-page.js
collection-book-page.js
curator-page.js
```

This can happen incrementally.

## Step 7 — Introduce an async-compatible repository interface

Cloud calls are asynchronous. Current storage APIs are synchronous.

Before connecting Cloudflare, provide async methods or a readiness phase:

```js
await BillyData.ready
await BillyData.progress.markSeen(left, right)
```

The app may continue rendering from the local cache immediately and synchronize afterward.

## Step 8 — Build Worker and D1 schema

Only after all domain writes pass through the repository.

## Step 9 — Add authentication and synchronization

- anonymous local state;
- sign-in;
- first-login merge;
- revision tracking;
- queued offline writes;
- conflict handling.

---

## 12. Suggested Cloudflare Boundary

### Static Pages

Continue serving:

- HTML;
- CSS;
- shared frontend modules;
- static icons and branding.

### Worker API

Suggested first endpoints:

```text
GET    /api/v1/me/progress
PUT    /api/v1/me/progress/seen/:mashupId
DELETE /api/v1/me/progress/seen/:mashupId
PUT    /api/v1/me/favorites/:mashupId
DELETE /api/v1/me/favorites/:mashupId

GET    /api/v1/me/collections
POST   /api/v1/me/collections
PATCH  /api/v1/me/collections/:id
DELETE /api/v1/me/collections/:id
POST   /api/v1/me/collections/:id/publish
```

Curator endpoints should be separate and role-protected.

### D1

First synchronized tables should be limited to:

- users;
- user seen state;
- user favorites;
- collections;
- collection members;
- collection versions.

Do not begin groups, events, comments, notifications, or moderation in the first backend slice.

---

## 13. Performance Recommendations

### Immediate

- Keep cache-busting consistent.
- Avoid loading `emoji-data.js` on pages that do not need the full dataset.
- Add loading/error fallbacks when dataset globals are absent.
- Measure load and parse time on the user’s actual Android device.

### Later

Replace the monolithic dataset with one of:

1. static category/date shards;
2. compressed JSON fetched on demand;
3. Worker API queries backed by D1;
4. a generated local index plus lazy detail payloads.

The best final design may be hybrid:

- small static search/index metadata;
- lazy image/detail data;
- D1 for canonical query support;
- local cache for offline browsing.

---

## 14. Documentation Corrections

The planning documents describe future systems broadly, but the current codebase is much narrower.

The code currently implements:

- local discovery progress;
- favorites;
- curated collection drafts and publishing;
- public Collection Book;
- static canonical data;
- curator import/export.

The code does **not** currently implement:

- users or authentication;
- profiles;
- cloud synchronization;
- groups;
- events;
- notifications;
- moderation;
- community feeds;
- real rewards or trophy logic;
- server APIs;
- D1.

Future documents should remain clearly labeled as design plans rather than current architecture.

This audit should be treated as the source of truth for the as-built v2.0.0 application.

---

## 15. Concrete Next Deliverable

The next code deliverable should be a narrow internal refactor:

```text
Billy-Labs-v2.0.1-Storage-Foundation
```

It should:

- add `billy-storage.js`;
- route progress storage through it;
- route collection storage through it;
- add a curator-entry repository;
- stop page controllers from writing user/curator domain keys directly;
- preserve all current appearance and behavior;
- include migration and regression tests;
- update `PROJECTLOG.md`;
- produce a new release ZIP.

It should **not**:

- add login;
- connect Cloudflare;
- redesign pages;
- alter mashup eligibility;
- change Collection Book behavior;
- add Trophy Room or community features;
- reorganize the entire repository.

---

## 16. Final Assessment

Billy Labs is ready to begin backend preparation, but not ready to connect directly to D1.

The project already has the right conceptual foundations:

- canonical mashup identity;
- separated progress and collection modules;
- explicit collection drafts and published snapshots;
- strong release provenance;
- a working local-first experience.

The immediate engineering job is to make the existing boundaries real by ensuring every domain read and write passes through one data layer. Once that is complete, Cloudflare becomes an implementation choice beneath the application rather than a rewrite of the application itself.
