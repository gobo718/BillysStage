# Billy Labs Project Map

## Purpose

This file is the quick architectural map for locating pages, navigation, shared systems, and Curator entry points. Check it before asking where a feature lives.

## Public Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Main public landing page, Daily Pick, discovery actions, and development-mode Curator launcher. |
| Mashup Detail | `mashup.html` | Canonical mashup view, sharing, favorites, collection draft membership, and the development-mode mashup editor. |
| Studio | `studio.html` | Blurblet writing and submission workflow. |
| Gallery | `blurblets.html` | Public blurblet browsing. |
| Collection Book | `collection-book.html` | Collection browsing and progress views. |
| Collection | `collection.html` | Individual collection view. |
| Profile | `profile.html` | Visitor profile and progression surface. |
| Trophy Room | `trophy-room.html` | Trophies, points, and progression rewards. |
| Emoji | `emoji.html` | Base emoji detail. |
| Dispatches | `dispatches.html` | Museum/news content. |
| Diagnostics | `diagnostics.html` | Build and runtime diagnostics. |

## Curator Flow

1. `index.html` contains `#curatorLauncher`.
2. The launcher appears only in development mode, on an approved development host, or after `?curator=1` activates Curator mode.
3. The launcher points to `explorer.html`, the **Museum Archive**.
4. `explorer.html` is the Curator landing page for inventory search, Recently Added, Missing Blurblets, inspection, and editor handoff.
5. The **Curator Control Room** button in Museum Archive points to `curator/index.html`.
6. `curator/index.html` contains collection administration, ingredient research, cloud settings, import/export, and publishing tools.
7. `mashup.html` retains the development-mode mashup editor, but does not contain a second hidden Control Room shortcut.

## Navigation

- `bottom-nav.js` creates the shared floating public navigation.
- Museum Archive is marked with `body[data-page="archive"]`; its floating bottom navigation is hidden to keep archive controls unobstructed.
- The development-mode Curator launcher is implemented directly in `index.html`, not in `bottom-nav.js`.

## Core Data and Behavior

| File | Responsibility |
|---|---|
| `emoji-data.js` | Canonical Emoji Kitchen rows. |
| `emoji-metadata.js` | Emoji names and metadata. |
| `mashup-core.js` | Canonical mashup identity, pair parsing, and URLs. |
| `mashup-search.js` | Search helpers and ingredient lookup. |
| `mashup-discovery.js` | Random/newest discovery selection. |
| `curator-data.js` | Local Curator draft and notes data. |
| `published-curator-data.js` | Bundled published blurblets. |
| `collections-data.js` | Collection definitions and draft membership. |
| `billy-storage.js` | Storage facade. |
| `billy-repositories.js` | Repository abstraction. |
| `billy-cloud-api.js` | Worker/API communication. |
| `billy-sync-manager.js` | Synchronization orchestration. |
| `billy-device-identity.js` | Device identity. |
| `progress-engine.js` | Seen items, points, and progression state. |

## Canonical Documentation

- `BILLY_LABS_CANONICAL_GUIDE.md`: integrated current state, remaining work, and documentation authority order.
- `DOCUMENTATION_AUDIT.md`: classification of every Markdown document and conflict-resolution notes.
- `BAD.md`: mandatory loop-breaker and evidence check for work/status claims.

## Release Files

- `BUILDINFO.json`: machine-readable current release metadata.
- `RELEASE-MANIFEST.txt`: concise release identity and baseline.
- `CHANGELOG.md`: current release summary followed by history.
- `PROJECTLOG.md`: chronological project record.
- `Billy_Labs_NEXT_STEPS_v0.1.docx`: living release roadmap.
- `README.md`: current build overview.

## Release Rule

Every successful release must update the visible on-site version, build metadata, changelog, roadmap, and archive filename. The newest verified working build becomes the canonical baseline unless Billy explicitly says otherwise.
