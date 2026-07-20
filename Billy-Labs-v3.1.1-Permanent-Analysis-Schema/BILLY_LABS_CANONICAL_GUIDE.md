# Billy Labs Canonical Project Guide

**Documentation baseline reviewed:** Billy Labs v2.6.2 — Curator Navigation Restoration  
**Purpose:** One current orientation document for what Billy Labs is, what is already built, what remains, and which older documents should not be treated as current implementation plans.

## 1. What Billy Labs Is

Billy Labs is a living museum and progression experience built around completed Emoji Kitchen mashups. Its four enduring goals are:

1. Browse
2. Learn
3. Collect
4. Progress

The public experience should feel playful, surprising, and collectible rather than like a technical database. The internal Curator experience exists to maintain the museum's authored data, publishing workflow, collections, future metadata, and future AI-assisted review.

The repository/project name is **BillysLab**. “Emoji Kitchen Explorer” describes the subject and early app identity, not the canonical repository name. **MASHPEDITION** is a future-facing brand direction, not the current implementation name in this build.

## 2. Current Canonical Release

The current verified application release represented by this repository is:

**v2.6.2 — Curator Navigation Restoration**

Its canonical navigation flow is:

1. Home contains a development-mode Curator launcher.
2. The launcher opens `explorer.html`.
3. `explorer.html` is now the internal **Museum Archive**, not a visitor Explorer destination.
4. Museum Archive provides inventory search, status filters, inspection, and editor handoff.
5. Museum Archive links to `curator/index.html`, the **Curator Control Room**.
6. Mashup pages retain mashup-specific Curator editing but no longer contain a second hidden Control Room shortcut.

`PROJECT_MAP.md` is the fastest current file-location reference.

## 3. What Is Already Built

### Public museum foundation

The museum phase is substantially complete:

- Home and canonical mashup detail surfaces
- Daily Pick
- Direct random and newest discovery paths
- Favorites and seen/unseen progress foundations
- Blurblets and public blurblet display
- Studio and Gallery surfaces
- Collection Book and individual collection pages
- Profile prototype and Trophy Room prototype
- Shared public bottom navigation
- Mobile-oriented presentation

The old thumbnail-heavy public Explorer is no longer a public discovery surface. Thumbnail grids are primarily intended for personal collection and selected profile contexts.

### Collection foundation

The first collection architecture exists:

- Permanent collection IDs
- Private drafts
- Explicit publishing
- Versioned public snapshots
- Collection membership editing
- Context-preserving collection creation from mashup pages
- Public Collection Book
- Canonical progress identity shared across both ingredient pages
- Hide-empty-slots view

Collections, not individual mashups, are the canonical home of rarity unless a separate mashup-rarity system is deliberately introduced later.

### Progression foundation

The shared progress system already supports foundational seen/favorite state and is intended to drive points and future progression. Public-facing prototypes exist for profile and Trophy Room, but the full reward ecosystem is not complete.

The documented reward taxonomy is:

- **Collections:** what exists in the museum
- **Trophies:** historical collection completion and museum history
- **Achievements:** site and discovery milestones
- **Badges:** community participation
- **Stickers:** decorative souvenirs
- **Stars:** reserved until they have a distinct purpose
- **Hidden recognitions:** rare or secret acknowledgements
- **Temporary powers:** time-limited changes to what a visitor can perceive or do

The guiding design rule is: **Wonder is more valuable than information.** The site must not lie, but it does not need to reveal every secret.

### Curator and publishing foundation

Current Curator capabilities include:

- Collection administration
- Ingredient research
- Local Curator drafts and notes
- Bundled published data
- Live blurblet publishing through Worker/D1
- Import/export and backup foundations
- Museum Archive inventory search
- Missing, Draft, Published, and Recently Added filters
- Mashup inspector and editor handoff
- Curator mode activation on approved development contexts or through deliberate activation

### Infrastructure and cloud foundation

Engineering Passes 1 and 2 established and tested:

- Storage facade and adapters
- Repository abstraction
- Browser cloud API client
- Synchronization manager
- Anonymous device identity
- Cloudflare Worker scaffold and deployed API direction
- D1 migrations for initial storage, device identity, and live blurblet publishing
- Canonical mashup identity
- Full-inventory data validation
- Shared search architecture
- Exact mashup resolver
- Shared discovery engine
- Performance caches and repeatable benchmarks
- Automated browser-side and Worker regression tests

### Canonical identity and inventory invariants

These are non-negotiable:

- Mashup identity is an unordered normalized pair.
- Reversed ingredient order resolves to the same mashup.
- Duplicate ingredients remain valid and distinct, such as `🐷|🐷`.
- Release date, artwork URL, display names, and release batch are metadata, not identity.
- Current validation reports 147,000 structurally valid, canonically unique rows.
- Current metadata covers 619 ingredients.
- Current validation includes 413 duplicate-ingredient mashups.

## 4. What Is Not Yet Complete

### Next public progression pillar: Laboratory

The newest release documentation identifies **v2.7.0 — Laboratory** as the next major release. The Laboratory should become the primary intentional mashup-combination experience rather than restoring a general public Explorer.

Repository documentation does not yet contain a complete canonical Laboratory specification. Before implementation, the final interaction rules, reward behavior, duplicate handling, and progression connections should be written into the repository.

### Full trophy and reward implementation

Still needed:

- Living, version-aware trophies
- Complete Trophy Room behavior and personalization
- Collection reward and point calculations wired through the progress engine
- Achievements
- Badges
- Stickers and secret inventory behavior
- Temporary museum powers
- Hidden recognitions and shrouded displays
- Reward reveal and notification flows

### Full Curator metadata platform

The Data Bible and database schema are approved design specifications, but their complete platform is not implemented. Still needed:

- Curator metadata repository and D1 tables
- Manual metadata editor
- Controlled vocabularies
- Source versus depicted categories
- Field-level validation
- AI suggestions stored separately from verified metadata
- Review queue with accept/edit/reject/defer lifecycle
- Safe batch operations with preview, scope count, confirmation, undo, and audit integration
- Record and field locking
- Immutable audit history
- AI rescans that flag possible errors without silently overwriting curator data
- Ideas Engine for exhibits, collections, achievements, statistics, and research findings

### Curator Explorer expansion

Explicitly deferred from the v2.6 foundation:

- Dashboard mission cards
- Museum Health indicators
- Saved and pinned filters
- Rich history and reaction information in the inspector
- Google catalog comparison reports
- Collection and exhibit assignment
- Bulk tagging and batch actions
- Curator analytics and priority scoring

### Security and authorization

Curator access is still a browser-mode convention rather than real authenticated authorization. This is acceptable for private development but must not be mistaken for a secure production permission system.

Future authenticated accounts, permissions, moderation, synchronized progress, and leaderboards require a deliberate account architecture rather than extending query-parameter Curator mode.

### Remaining technical debt

The most important unresolved engineering debt documented across the repository is:

- Large inventory data is still shipped as executable JavaScript.
- Significant page-controller logic remains embedded in HTML.
- Global dependency order remains script-order dependent.
- Full-inventory unseen discovery remains linear because it depends on live progress state.
- Search indexes trade memory for responsiveness and need low-memory Android profiling.
- Curator published-status filtering currently relies on locally available published data rather than a fully live batched status source.
- Curator Archive still renders 100 cards per page rather than virtualizing.
- Some authored profile/demo references intentionally point to absent mashups.

## 5. Canonical Development Rules

Every work package should:

1. Begin from the newest verified working ZIP.
2. Inspect the repository before proposing edits.
3. Modify only the assigned subsystem unless compatibility requires more.
4. Preserve unrelated behavior and visual design.
5. Keep canonical IDs and stored-data compatibility intact.
6. Add or update regression coverage where behavior changes.
7. Update visible and internal version references for an actual release.
8. Produce a complete versioned ZIP and detailed changelog.
9. Treat the newest successful build as the next canonical baseline unless Billy explicitly says otherwise.

For uncertain work status, follow `BAD.md`.

## 6. Documentation Authority Order

When documents conflict, use this order:

1. Current verified build behavior and tests
2. Current release documents (`PROJECT_MAP.md`, v2.6.2 changelog, `BUILDINFO.json`, release manifest)
3. Newest explicit canonical specifications
4. Newer dated/versioned design decisions
5. Older planning documents
6. Historical audits and handoffs
7. Brainstorm files

A newer document does not automatically win when it is explicitly exploratory, a handoff for an abandoned branch, or contradicted by the verified application.

## 7. Immediate Recommended Work Sequence

1. Write and approve a canonical Laboratory specification in the repository.
2. Implement Laboratory as the next public progression pillar without restoring general public thumbnail browsing.
3. Connect Laboratory activity to collection/progression rewards.
4. Complete collection point calculations and first living-trophy vertical slice.
5. Replace the obsolete Curator implementation version schedule with a capability-based roadmap.
6. Begin Curator metadata database implementation only from the approved Data Bible/schema, with locking, review, and audit safety designed in from the start.
7. Add authentication before exposing powerful Curator operations beyond private development.

## 8. Documents to Use Most Often

- `BILLY_LABS_CANONICAL_GUIDE.md` — current integrated orientation
- `PROJECT_MAP.md` — file and navigation map
- `BAD.md` — loop-breaking and evidence requirements
- `Billy_Labs_Curator_Data_Bible_v1.0.md` — canonical Curator metadata principles
- `Billy_Labs_Curator_Database_Schema_v1.0.md` — pre-implementation metadata schema design
- `CURATOR_EXPLORER_BEHAVIOR_CONTRACT.md` — current Museum Archive invariants
- Engineering Pass behavior contracts — subsystem invariants
- Current changelog and release manifest — release identity

Use `DOCUMENTATION_AUDIT.md` to determine which older files are historical, superseded, or still partially useful.
