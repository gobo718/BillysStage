## v2.4.0 — Live Blurblet Publishing
Billy Labs can now publish an individual curator blurblet directly through the Worker into D1. The public mashup page reads the published value from the cloud when configured, while static-file publishing remains available as a fallback.

## v2.4.0 — Device Identity Foundation
Built the first anonymous identity layer from the verified v2.2.6 baseline. Identity remains local unless cloud registration is deliberately invoked.

## v2.4.0 — Progress Cloud Sync

Built again from the verified v2.2.5 baseline. Added the first unified progress synchronization path for seen and favorite mashups, with batching, offline retention, merge behavior, Worker/D1 support, diagnostics, and regression coverage.

## v2.2.5 — Cloud Sync Framework

Built the reusable sync orchestration layer and a developer diagnostics surface. Favorites now proves the registration contract while remaining local-first and opt-in.

## v2.2.5 — Favorites Cloud Vertical Slice

- Connected one real domain—favorites—from the browser repository boundary through the Worker to D1.
- Kept cloud access explicit and inactive by default, preserving the current local-first behavior.
- Established the request/validation/CORS pattern that later progress and account APIs can reuse.

## v2.2.3 — D1 Schema Foundation

- Established schema version 1 as a Wrangler-managed SQL migration.
- Preserved canonical mashup IDs as text so unordered pairs and duplicate-ingredient mashups remain valid.
- Designed user-owned progress, settings, votes, and collections for future accounts and synchronized progress.
- Added curator draft and published blurblet fields without exposing private notes through the public site.
- Configured the Worker for a `DB` binding; the real Cloudflare database ID still must be inserted after database creation.
- Next milestone: create the D1 database and connect the first repository/API route.

## v2.2.2 — Cloudflare Worker Scaffold

- Created the first deployable Cloudflare Worker boundary for Billy Labs.
- The scaffold exposes a health endpoint and predictable JSON/CORS behavior, but deliberately has no database binding yet.
- Added isolated Worker tests so API development can proceed without changing the static site.
- Reinstated a visible, release-synchronized website version marker; the current site now displays v2.2.2.
- Next architectural milestone: define the D1 schema and bind it to the Worker.

## v2.2.1 — Storage Adapter Foundation
- Inserted a swappable raw-persistence adapter beneath BillyStorage.
- Kept localStorage active by default and added an in-memory test adapter.
- Verified repositories continue working across adapter changes.

# Project Log

## v2.2.0 — Repository Foundation

- Promoted v2.1.3 as the sole development baseline.
- Added a shared repository facade so page controllers no longer own storage keys.
- Routed Collection view settings, Explorer state, and Profile voting through repositories.
- Kept domain storage modules local-first in preparation for later Worker/D1 adapters.

# Billy Labs Project Log

## v2.1.2 — Hide Empty Slots
- Added a persistent Hide empty slots view option to individual Collection album pages.
- The filtered view renders only discovered mashups and shows a clear empty state when none have been discovered.
- Preserved the full shrouded-slot album view as the default.
- Moved Profile Blurblet vote persistence behind BillyStorage.
- No mashup data, progress rules, or collection calculations changed.


## v2.0.1 — Storage Foundation
- Added `billy-storage.js` as the single low-level gateway for browser persistence.
- Added `curator-data.js` to own curator blurblets and private-note storage.
- Routed progress and collection persistence through `BillyStorage`.
- Removed direct domain-state `localStorage` access from page controllers.
- Kept Explorer search and paging state device-local through the shared storage gateway.
- Stopped writing legacy progress keys after migration. Legacy values are still read and normalized.
- Updated Curator backup metadata and filenames to v2.0.1.
- Added regression tests for canonical identity, duplicate ingredients, progress migration, favorites, collections, and curator entries.
- Added the v2.0.0 architecture audit to `docs/audit.md`.
- No mashup eligibility, collection behavior, visual design, or discovery behavior was intentionally changed.

## v2.0.0 — The Collection Update
- Added the first public Collection Book at `collection-book.html`.
- Organized Kitchen-compatible base emoji into familiar emoji-keyboard categories and order.
- Every canonical mashup appears on both ingredient emoji pages without duplicating stored progress.
- Collection pages reveal discovered mashups and shroud undiscovered ones.
- Added per-emoji and overall completion progress, completed-page badges, search, and direct mashup links.
- Added My Collection to the public homepage.
- Added cache-busted shared script references for the 2.0.0 release.

## v1.9.2b — Final UI Polish

- Surprise Me now opens a selected mashup directly.
- Standardized optical blurblet alignment across the app.
- Verified branded Copy Emojis and Favorite buttons in all mashup views.
- Added success feedback to copy actions.
- Added persistent Favorite/Favorited button states.

## v1.9.2a — Branded Action Buttons

- Changed **Copy emojis** to a pink gradient drawn from the Explorer wordmark.
- Changed **Favorite** to a peach gradient drawn from the Explorer wordmark.
- Applied the same styling to Billy’s Daily Pick and the mashup detail view opened by **View in Explorer**.
- No JavaScript, storage, collection, or discovery behavior changed.


## v1.9.2 — Daily Pick Resilience Hotfix

- Restored Billy’s Daily Pick on the public home page.
- Made the Daily Pick render independently of progress and favorites storage.
- Added safe fallbacks so a storage migration or progress-engine error cannot hide the entire feature.
- Preserved the v1.9.1 discovery repair and public/dev Curator separation.

## Current Version
v2.0.1 — Storage Foundation

## Phase Status
- Phase 1 — Museum: complete
- Phase 2 — Progression: foundation active
- Collection Manager: first functional release
- Collection Book: first public release
- Living trophies, Trophy Room, achievements, badges, stickers, powers, and community systems: planned

## v1.9.1 — Collection Control Room Foundation

### Added
- `mashup-core.js`: one canonical, unordered two-item mashup ID. Duplicate ingredients remain valid (`🐷|🐷`). Release date is metadata, never identity.
- `progress-engine.js`: shared seen/favorite storage with migration from legacy date-based IDs.
- `collections-data.js`: permanent collection IDs, draft data, published snapshots, version numbers, points, tier, secret flag, banner reference, notes, and member lists.
- Curator Collection Control Room with create, edit, duplicate, delete, backup, import, draft membership editing, and explicit publishing.
- Versioned publishing: public data changes only when the curator publishes a draft. Further edits remain private until the next publication.
- Context-preserving collection creation from a mashup page. The current mashup becomes member #1 automatically.
- Versioned backup filenames and metadata.

### Modified
- `mashup.html`: canonical seen/favorite progress, collection draft membership, context-preserving creation, and clearer draft/publish language.
- `curator/index.html`: replaced the simple entry list with the museum control room.

### Migration
- Legacy seen and favorite IDs are normalized into canonical pair IDs.
- Legacy exhibits become collection drafts on first load.
- Existing blurblets and private mashup notes remain in the curator entry store.

## Architectural Decisions

### Canonical Mashup Identity
A mashup is identified by a normalized two-item pair. Order does not matter; multiplicity does.

- `🥓 + 🐷` and `🐷 + 🥓` are the same mashup.
- `🐷 + 🐷` is a valid unique mashup.
- Dates, image URLs, names, and release batches are metadata.

### Curator
The Curator is the museum control room, not a separate duplicate management product. Its eventual sections are Mashups, Collections, Trophies, Import/Export, and Settings.

### Collections
- Permanent IDs never change when names change.
- Editing happens in a private draft.
- Publishing creates a new immutable public version snapshot.
- A veteran may earn historical trophy levels tied to versions completed while active. A newcomer begins with the current version and cannot retroactively earn retired version trophies.

### Reward Ecosystem
- Collections: what exists in the museum.
- Trophies: historical collection completion and museum history.
- Achievements: site milestones, such as first mashup viewed or first collection completed.
- Badges: community participation, such as voting and writing blurblets.
- Stars: intentionally reserved until they have a unique purpose.
- Stickers: playful decorative souvenirs placed anywhere in a Trophy Room.
- Hidden recognitions: rare acknowledgements whose category may remain unknown until encountered.

### Mystery and Discovery
- Unknown recognitions may appear only as shapeless shadows.
- A player may eventually earn a shrouded trophy case without outsiders knowing its contents or item count.
- Hidden rewards still contribute points, so score can imply that something unseen happened.
- Stickers owned by another visitor remain invisible unless the viewer owns them too.
- Temporary museum powers can alter perception without granting ownership. Example: **Curator's Sight**, which reveals unowned sticker silhouettes for one hour.
- Goofy easter eggs matter. Example: clicking the Lightning Puppy's nose three times can award a cute sticker and an intentionally arbitrary number of points.
- Sticker totals and complete secret inventories should not be disclosed.

### Guiding Principle
**Wonder is more valuable than information.** Billy Labs should never lie, but it does not need to reveal everything.

## Next Milestones
1. Test and refine collection draft/publish workflow with real curation.
2. Refine the Collection Book with real-world testing.
3. Add collection rewards and points calculations to the shared progress engine.
4. Implement living, version-based trophies.
5. Build the Trophy Room shell and personalization model.

## 2026-07-17 — Corrected v1.9.1 build provenance

This package was rebuilt from the verified v1.8.0 foundation branch rather than the older v1.7.2d branch. The v1.8.0 public site behavior and working Discovery flow are retained. Curator controls remain hidden on ordinary public hosts and are available on development hosts or with the explicit `?curator=1` query parameter.

### v1.9.2b final polish completion
- Blurblets now keep normal document flow, wrap to any needed number of lines, and use the optical right-edge alignment on phones as well as larger screens.
- Billy’s Daily Pick **View in Explorer** button now opens the selected mashup detail directly instead of a one-result Explorer page.

## Profile Prototype
- Added `profile.html`, `profile.css`, `profile.js`, and `profile-data.js`.
- Added a responsive Fellow profile with avatar, Birth Form, mashup-linked Blurblets, Community Blurblet voting, ranked/latest Blurblets, rotating Microflex, Top 8, awards, and Trophy Room doorway.
- Added `blurblets.html` and `trophy-room.html` prototype destinations.
- Added a Profile shortcut to the home page.
- Voting is locally functional through `localStorage`; public accounts and server-backed community data remain future infrastructure.


## 2026-07-18 — v2.1.1 Profile navigation and Blurblet context
- Home Quick Links now routes to My Profile instead of directly to My Collection.
- Removed the floating Profile button from Home.
- Profile Collection card opens My Collection; Top 8 items remain independently clickable.
- My Best IMHO and Community Blurblet Vote now display the mashup each Blurblet references.

## 2026-07-18 — v2.4.0 Live Blurblet Activation
Completed the final connection layer between Curator, the deployed Worker, D1, and public blurblet display. The deployment still requires a one-time Cloudflare setup, but subsequent blurblet updates do not require a Billy Labs rebuild.

## v2.6.2 — Curator Navigation Restoration

- Restored the development-mode Home Curator launcher as the entry to Museum Archive.
- Established `explorer.html` as the Curator landing page and retained the Control Room as an Archive destination.
- Removed the hidden Control Room shortcut from `mashup.html`.
- Added `PROJECT_MAP.md` and synchronized release documentation and visible version metadata.

