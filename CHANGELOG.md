## v2.6.3 — Curator Control Room Redesign
- Added a dedicated Control Room landing view with a purple laboratory door and concise substitute-curator orientation.
- Organized the Curator into Collections & Publishing, Discovery Engine, Diagnostics, and Settings departments.
- Renamed Research Lab to Discovery Engine while preserving the existing Combo Lookup tool.
- Consolidated future AI analysis, metadata review, collection discovery, and safeguarded bulk operations under the Discovery Engine.
- Preserved existing Curator collection, publishing, import/export, diagnostics, and cloud connection behavior.
- Added a visible Curator v2.6.3 version marker.

# v2.6.2 — Curator Navigation Restoration

- Restored the development-mode **Curator** launcher on Home and routed it to the Museum Archive.
- Confirmed Museum Archive as the Curator landing page.
- Kept the Curator Control Room entry in Museum Archive and centered its button text vertically and horizontally.
- Removed the hidden **Open Curator Control Room** shortcut from the mashup editor.
- Added `PROJECT_MAP.md` as the repository architecture and navigation map.
- Updated visible version labels, Curator export metadata, build metadata, release manifest, README, project log, and NEXT STEPS to v2.6.2.

# v2.6.1 — Curator Foundation Hotfix

- Removed `gobo718.github.io` from automatic Curator-launcher approval so ordinary public visitors do not see Curator controls.
- Preserved deliberate Curator activation through `?curator=1`, remembered curator mode, and approved local/development hosts.
- Added prominent Museum Archive access to the Curator control room and its primary navigation.
- Updated visible version labels and Curator backup metadata to v2.6.1.
- Updated the living NEXT STEPS roadmap.

# v2.6.0 — Curator Explorer Foundation

See `V2.6.0_CURATOR_EXPLORER_FOUNDATION_CHANGELOG.md`.

# v2.5.6 — Engineering Pass 2.6: Performance & Scalability

- Added cached canonical row IDs, ingredient indexes, search indexes, and newest-release analysis.
- Consolidated discovery eligibility work while preserving live progress semantics.
- Added repeatable performance benchmarking and regression coverage.
- Preserved all user-facing behavior.

# v2.5.5 — Engineering Pass 2.5: Discovery Engine

- Centralized discovery selection in `mashup-discovery.js`.
- Preserved Home, Explorer, and detail-page discovery policies.
- Added deterministic regression coverage and engineering documentation.

# Billy Labs Changelog

## v2.5.4 — Engineering Pass 2.4: Mashup Resolution
- Centralized exact pair-to-row resolution in the canonical mashup engine.
- Added a cached canonical-ID index and full 147,000-row resolution verification.
- Preserved presentation-only fallbacks for unresolved authored profile/demo pairs.

## v2.5.3 — Engineering Pass 2.3: Search Architecture

- Added `mashup-search.js` as the shared search and row-ordering contract.
- Routed Explorer, emoji detail search, Collection Book emoji search, and Curator exact ingredient lookup through the shared module.
- Preserved each surface's existing searchable fields, ordering, filtering, pagination, and empty-state copy.
- Added search architecture regression tests.
- No mashup records, canonical IDs, storage data, Worker routes, or public navigation were changed.


- Consolidated storage, repository, cloud client, sync, and device identity stabilization.
- Expanded infrastructure regression coverage.
- Preserved existing storage keys, data shapes, cloud routes, Worker behavior, UI, and features.
- Updated current release markers to v2.5.0.
- Added consolidated engineering report and detailed pass changelog.

---

# Billy Labs v2.4.3a — Curator Access Patch

- Restored a visible Curator launcher on the Home page for the development site.
- Curator mode now persists after visiting with `?curator=1`.
- Restored Curator access on mashup pages and moved the floating button above bottom navigation.
- Preserved all v2.4.3 Home polish and Curator Research Lab behavior.

## v2.4.2 — Focused Discovery Cleanup

- Replaced the public thumbnail-browser navigation with Surprise Me, Newly Created, and a reserved Billy’s Lab entry.
- Surprise Me now opens a random undiscovered mashup directly.
- Newly Created presents one mashup at a time, keeps release dates newest-first, and randomizes within each release date.
- Removed public Home thumbnail browsing, quick category buttons, Continue Exploring, and Related Mashups thumbnails.
- Preserved all classifications, category metadata, collections, progression logic, and reward foundations.
- Included the working public cloud configuration for live Blurblets.
- Updated the visible website version to v2.4.2.

## v2.4.2 — Live Blurblet Publishing
- Added public Worker endpoint for retrieving published curator blurblets.
- Added publish-key-protected Curator endpoint for immediate D1 publishing.
- Mashup pages now prefer live cloud blurblets when the API is configured.
- Retained the downloadable JavaScript file as a safe manual fallback.
- Added BUILDINFO.json release lineage metadata.
- Updated the visible website version to v2.4.2.

## v2.4.2 — Device Identity Foundation
- Added stable anonymous device IDs stored locally.
- Added opt-in Worker device registration and D1 devices migration.
- Added masked identity and registration state to Diagnostics.
- Progress sync can use the device ID as its anonymous user ID.
- Updated the visible website version to v2.4.2.

## v2.4.2 — Progress Cloud Sync

- Added a unified Worker endpoint for seen and favorite progress.
- Added a persistent, batched sync queue with online retry.
- Added local/cloud union merging for progress restoration.
- Kept the favorites endpoint backward compatible.
- Expanded Diagnostics with queued batch count.
- Updated the visible website version to v2.4.2.

## v2.2.5 — Cloud Sync Framework

- Added a generic local-first SyncManager with repository registration and explicit sync states.
- Registered Favorites as the first sync-capable repository.
- Added a diagnostics page for app version, API mode, Worker reachability, D1 binding, and sync status.
- Sync remains disabled until explicitly configured; no automatic data transmission was added.
- Updated the visible website version to v2.2.5.

## v2.2.5 — Favorites Cloud Vertical Slice

- Added the first end-to-end cloud persistence path for mashup favorites.
- Added GET and PUT Worker endpoints backed by the existing D1 `mashup_progress` table.
- Added a browser cloud API client that remains disabled until an API URL is explicitly configured.
- Extended the progress repository with explicit push, pull, and fetch operations for cloud favorites.
- Added Worker and browser-client tests for the new path.
- Updated the visible site version and curator backup metadata to v2.2.5.
- The normal website remains local-first and does not transmit data automatically.

## v2.2.3 — D1 Schema Foundation

- Added the first versioned D1 migration under `worker/migrations/0001_initial.sql`.
- Defined cloud-ready tables for accounts, settings, mashup progress, blurblet votes, collections, collection membership, and curator blurblets.
- Added the `DB` binding configuration and local/remote migration commands.
- Updated the Worker health response to report API version, schema version, and D1 binding availability.
- Updated the visible website version and curator backup metadata to v2.2.3.
- The public site remains local-first; no user data is transmitted to Cloudflare in this release.

## v2.2.2 — Cloudflare Worker Scaffold

- Added a deployable Cloudflare Worker project under `worker/`.
- Added `GET /api/health`, structured JSON 404 responses, and CORS preflight handling.
- Added Worker tests without connecting production storage or D1.
- Restored the visible website release number and updated it to v2.2.2.
- Updated curator backup filenames and metadata to the current release number.
- No mashup rules, saved data, or user-facing behavior changed.

# Changelog

## v2.2.1 — Storage Adapter Foundation
- Added a swappable storage-adapter layer beneath `BillyStorage`.
- Added local-storage and in-memory adapters.
- Repositories and page controllers remain unchanged and local-first.
- Added adapter-switching regression tests.
- No visual or user-facing behavior changes.

## v2.2.0 — Repository Foundation

- Added `billy-repositories.js`, a single domain-oriented data-access layer for settings, Explorer state, Profile votes, progress, collections, and curator content.
- Removed remaining direct `BillyStorage` access from page controllers.
- Preserved the v2.1.3 interface, local-first behavior, collection filtering, and blurblet-only publishing workflow.
- Added repository contract tests.

## v2.1.3 — Blurblet-Only Publishing

- Added **Update Blurblet Only** to the mashup Curator panel.
- Saving a mashup now keeps its blurblet and collection memberships private as drafts.
- Publishing a blurblet does not publish or alter any collection draft.
- Added a dedicated public blurblet dataset (`published-curator-data.js`) that excludes private curator notes.
- Blurblet-only publishing downloads the updated public dataset for replacement on the separately hosted public site.

## v2.1.2 — Hide Empty Slots

- Added a remembered **Hide empty slots** option to individual My Collection emoji pages.
- When enabled, album pages show only discovered mashups and remove all undiscovered placeholders.
- Preserved the complete album view as the default for users who want to see missing slots.
- Routed Profile community-vote persistence through the shared BillyStorage gateway, removing the final direct page-level localStorage access.
- No mashup identity, eligibility, discovery, collection membership, or navigation behavior changed.

## v2.1.1 — Profile Navigation & Blurblet Context

- Replaced the Home-page My Collection quick link with My Profile.
- Removed the floating Profile shortcut.
- Made the Profile Collection card open My Collection while preserving direct Top 8 mashup links.
- Added the referenced mashup image and ingredient pair to My Best IMHO and Community Blurblet Vote.

# Changelog

## 2026-07-16

- Created GitHub repository.
- Added PROJECT_VISION.md.
- Added IDEAS.md.
- Imported the Emoji Kitchen backend database.
- Built the first HTML browser showing the newest 100 mashups.
- Planned pagination, collections, achievements, and discovery modes.

## v2.4.2 — Live Blurblet Activation
- Added a public cloud configuration bootstrap.
- Added Curator Settings for Worker URL, publish key, health testing, and one-time public config generation.
- Added live D1 blurblet retrieval to the homepage Daily Pick.
- Kept mashup-page live retrieval and manual publishing fallback intact.
- Updated Worker activation instructions and visible site version.

## v2.4.2 — Navigation & Home Layout Polish
- Expanded the persistent bottom navigation to six destinations: Home, Lab, Studio, Gallery, Profile, and Trophies.
- Kept the Daily Pick blurblet right-aligned beneath the four action buttons and allowed the Daily Pick card to grow naturally with its content.
- Replaced the three discovery tiles with two equal, slightly squarer cards: yellow Surprise Me and green Newly Created.
- Kept Surprise Me and Newly Created side-by-side on mobile and aligned their two columns with the action-button grid above.
- Stacked the Vote on a Blurblet and Write a Blurblet cards vertically at full width.
- Removed the separate Billy’s Lab discovery tile; Lab remains available in persistent navigation.


## v2.4.3aa — Final Home Polish + Curator Combo Lookup
- Tightened Daily Pick card spacing beneath short blurblets.
- Made the Home blurblet card directly editable.
- Added Submit confirmation with Submit Now, Studio handoff, and Cancel draft preservation.
- Added Curator → Research Lab → Combo Lookup for all mashups containing a selected emoji.
- Updated visible and internal version references to v2.4.3aa.

## v2.5.1 — Engineering Pass 2.1: Canonical Identity
- Preserved the established canonical mashup ID format while removing independent identity builders.
- Fixed Profile and Blurblet Gallery detail links and retained legacy URL compatibility.
- Added a canonical identity contract and regression suite.

## v2.5.2 — Engineering Pass 2.2: Data Integrity

Added a repeatable integrity gate for the 147,000-row mashup inventory and its 619 ingredient metadata records. The audit found no core inventory defects. Five unique unresolved profile/demo pair concepts remain unchanged and are reported as warnings rather than silently rewritten.

## v3.0.0 Stage 3B — Engine Service Extraction
- Established canonical Engine ownership for storage, identity, sync, repositories, cloud API, and Worker services.
- Preserved historical browser and Worker entry paths with compatibility delegation.
- Added compatibility tests while retaining current runtime behavior and visible v2.6.4 application label pending a user-verified v3 release.

## v3.0.0 Stage 3C — Data Contracts

- Added canonical typed item identity contracts.
- Split Engine collection mechanics from BillysLab collection definitions and storage adapters.
- Split Curator draft records from public published projections.
- Added versioned JSON schemas and compatibility tests.
- Preserved existing browser paths, storage keys, and visible behavior.
