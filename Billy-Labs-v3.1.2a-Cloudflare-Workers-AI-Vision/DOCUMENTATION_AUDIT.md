# Billy Labs Documentation Audit

**Reviewed baseline:** v2.6.2  
**Scope:** Every Markdown file in the uploaded repository, including Worker documentation.  
**Classification key:**

- **Canonical:** active source of truth for its stated domain
- **Current reference:** accurate and useful, but narrower than a canonical project guide
- **Historical:** records completed work; do not use as the current roadmap
- **Superseded:** replaced by a newer document or by implemented behavior
- **Needs revision:** contains useful information but presents stale or conflicting current status
- **Brainstorm:** ideas only; not approved scope

## Executive Findings

1. The repository has strong subsystem documentation but no single current project-wide source of truth. `BILLY_LABS_CANONICAL_GUIDE.md` now fills that gap.
2. The newest reliable implementation status is v2.6.2, with Museum Archive as the Curator landing page and Laboratory identified as the next major release.
3. The original Curator implementation roadmap is no longer usable as a version-number schedule. Its planned v2.6.0–v2.6.2 meanings conflict with actual released v2.6.0–v2.6.2 work.
4. The Data Bible and database schema remain valuable canonical design specifications, but the metadata/AI/review/audit platform they describe is mostly not implemented.
5. `PROJECT.MD`, `Billy_Labs_Master_Plan_Updated.md`, `PROJECTLOG.md`, and parts of `README.md` contain stale “current phase/current version” language.
6. `CHANGELOG.md` is useful but structurally messy: duplicate headings, repeated version numbers for distinct historical work, and chronology that is not consistently ordered.
7. The v2.0 architecture audit is historical. Several major risks it identified were fixed, while a smaller set remains active technical debt.
8. Engineering Pass reports and behavior contracts are the strongest technical records in the repository and should remain preserved as historical/canonical subsystem evidence.

## Current Canonical Set

### Project orientation

| File | Status | Notes |
|---|---|---|
| `BILLY_LABS_CANONICAL_GUIDE.md` | Canonical | Integrated current state, remaining work, authority order, and recommended sequence. |
| `PROJECT_MAP.md` | Canonical | Current page, navigation, Curator flow, and file-responsibility map. |
| `BAD.md` | Canonical process rule | Evidence-based loop breaker and status-reporting standard. |
| `V2.6.2_CURATOR_NAVIGATION_RESTORATION_CHANGELOG.md` | Current reference | Precise current-release change record. |
| `CURATOR_EXPLORER_BEHAVIOR_CONTRACT.md` | Canonical subsystem contract | Active Museum Archive behavior invariants. |

### Curator platform design

| File | Status | Notes |
|---|---|---|
| `Billy_Labs_Curator_Data_Bible_v1.0.md` | Canonical specification | Governs metadata philosophy, AI authority, review, batch safety, locking, and audit principles. |
| `Billy_Labs_Curator_Database_Schema_v1.0.md` | Canonical pre-implementation design | Long-term metadata schema; not evidence that tables are implemented. |
| `Billy_Labs_Curator_Implementation_Roadmap_v1.2.md` | Needs revision | Engineering-pass workflow remains useful; numbered feature schedule is obsolete. |

### Technical subsystem contracts

All `ENGINEERING_PASS_2.*_BEHAVIOR_CONTRACT.md` files remain canonical for the invariants they define. Reports, regression checklists, technical-debt files, and future-extension files remain current technical references unless contradicted by later implementation.

## Files Requiring Revision

### `README.md`

**Status:** Needs revision.

Current and useful:
- v2.6.2 identity
- Museum Archive description
- Laboratory named as next major release
- Curator navigation restoration summary

Problems:
- Says “Curator Foundation hotfix built on v2.6.0,” which describes v2.6.1 more than v2.6.2.
- “What changed” mixes v2.6.1 and v2.6.2 work.
- Should link to the canonical guide and documentation audit.

### `PROJECT.MD`

**Status:** Needs revision.

Useful:
- Browse/Learn/Collect/Progress pillars
- Collections own rarity
- Collection Manager as single source of truth
- ZIP workflow and narrow-change rule

Stale:
- Calls Phase 2 Collections & Trophies the current phase without acknowledging later infrastructure and Curator Archive work.
- Calls Collection Manager the first milestone even though the first functional manager and Collection Book already exist.

### `Billy_Labs_Master_Plan_Updated.md`

**Status:** Needs revision.

Useful:
- Curator philosophy and phase concepts
- Design → Review → Implement → Test → Release workflow

Stale:
- Calls Data Bible the current phase and “Create Data Bible” the next action even though Data Bible, schema, roadmap, infrastructure passes, and Curator Archive foundation are already present.

### `Billy_Labs_Curator_Implementation_Roadmap_v1.2.md`

**Status:** Partially superseded; needs replacement.

Keep:
- Responsibility-based Engineering Pass strategy
- Stability and regression rules
- Conceptual Curator capability sequence

Do not use:
- Feature-to-version mapping. It predicts v2.6.0 AI Suggestions, v2.6.1 Review Queue, and v2.6.2 Batch Operations, while actual releases used those numbers for Museum Archive and navigation work.

Recommended replacement:
- Capability milestones without fixed release numbers until scheduled.

### `PROJECTLOG.md`

**Status:** Needs revision.

Problems:
- Contains multiple top-level project-log headings.
- Contains an embedded “Current Version v2.0.1” section that is no longer current.
- Phase-status and next-milestone text is stale.
- Later v2.6.2 entry is appended rather than fully reconciling older current-state language.

Preserve as history after removing or clearly labeling stale “current” sections.

### `CHANGELOG.md`

**Status:** Current historical record, needs structural cleanup.

Problems:
- Duplicate `# Changelog` headings.
- Multiple historical entries use v2.4.2 for different work.
- v2.4.3a and v2.4.3aa ordering/history is difficult to follow.
- Entries are not consistently chronological.

Do not discard content. Normalize it into one newest-first chronology and preserve provenance notes.

### `PROJECT_VISION.md`

**Status:** Historical vision with one current design appendix.

Still canonical in spirit:
- Playful museum rather than database
- Discovery, collection, research, update detection, mobile accessibility
- GitHub/repository as permanent memory
- v2.4 discovery/progression separation

Historical only:
- Early gallery filenames
- First-version and immediate-next-step lists
- Public 100-card browsing as the primary experience

Recommended action:
- Keep as project-origin history, but add a banner directing current implementation work to the canonical guide.

### `docs/audit.md`

**Status:** Historical architecture audit with partially unresolved debt.

Resolved or substantially addressed since v2.0:
- Shared storage facade
- Repository abstraction
- Reduced direct domain-state `localStorage` access
- Cloud Worker/D1 foundation
- Device identity and sync framework
- Automated regression tests
- Canonical identity centralization
- Search, resolver, discovery, and performance architecture

Still relevant:
- Large executable-JavaScript inventory
- Embedded page-controller logic
- Implicit global script dependency order
- Mixed public/Curator responsibilities in some pages
- Need for further low-memory performance work

Add a historical banner rather than rewriting the original audit.

## Historical and Superseded Planning/Handoff Files

| File | Classification | Reason |
|---|---|---|
| `Billy_Labs_Master_Plan.md` | Superseded | Replaced by updated master plan, which itself now needs revision. |
| `Billy_Labs_Curator_Implementation_Roadmap_v1.0.md` | Superseded | Replaced by v1.2. |
| `V2.4_CANONICAL_UI_UPDATE.md` | Historical | Captures an earlier approved UI direction; later navigation/layout releases changed details. |
| `V2.4.2_LAYOUT_UPDATE.md` | Historical | Implemented layout decision record. |
| `V2.4.3_FINAL_HOME_POLISH_HANDOFF.md` | Historical handoff | Branch-specific work order, not current guidance. |
| `V2.5.0_PROJECT_STABILIZATION_CHANGELOG.md` | Historical | Records documentation packaging. |
| All `V2.5.*_CHANGELOG.md` files | Historical | Completed release records. |
| `V2.6.0_CURATOR_EXPLORER_FOUNDATION_CHANGELOG.md` | Historical/current lineage | Foundation release, superseded operationally by hotfixes. |
| `V2.6.1_CURATOR_FOUNDATION_HOTFIX_CHANGELOG.md` | Historical/current lineage | Important provenance, superseded by v2.6.2. |

## Engineering Pass Documentation Classification

### Pass 1 — Infrastructure

| Files | Status |
|---|---|
| `ENGINEERING_PASS_1.1_STORAGE_REPORT.md` | Historical verified report |
| `ENGINEERING_PASS_1.2_REPOSITORY_REPORT.md` | Historical verified report |
| `ENGINEERING_PASS_1.3_CLOUD_REPORT.md` | Historical verified report |
| `ENGINEERING_PASS_1.4_SYNC_IDENTITY_REPORT.md` | Historical verified report |
| `ENGINEERING_PASS_1_INFRASTRUCTURE_REPORT.md` | Historical consolidated report |
| Matching v2.5.0 changelogs | Historical release records |

These document completed stabilization and remain trustworthy evidence of architectural intent and compatibility constraints.

### Pass 2.1 — Canonical Identity

- Report: current technical reference
- Behavior contract: canonical invariant
- Regression checklist: current release-safety reference
- Technical debt: current until resolved
- Future extension points: advisory
- Changelog: historical

### Pass 2.2 — Data Integrity

Same classification pattern. Its key verified figures—147,000 rows, 619 ingredients, 413 duplicate-ingredient rows—remain the current documented inventory facts for this build.

### Pass 2.3 — Search Architecture

Same classification pattern. Shared search behavior should not be reimplemented page-by-page.

### Pass 2.4 — Mashup Resolution

Same classification pattern. All exact mashup lookup and URL construction should route through canonical resolver/core APIs.

### Pass 2.5 — Discovery Engine

Same classification pattern. Surface-specific discovery policy is preserved while shared mechanics remain centralized.

### Pass 2.6 — Performance and Scalability

Same classification pattern. Caches assume immutable release inventory arrays. Full unseen discovery remains intentionally live and linear.

## Curator Explorer Documentation Classification

| File | Status | Notes |
|---|---|---|
| `CURATOR_EXPLORER_FOUNDATION_REPORT.md` | Current technical reference | Explains why the old Explorer was repurposed in place. |
| `CURATOR_EXPLORER_BEHAVIOR_CONTRACT.md` | Canonical | Active Archive invariants. |
| `CURATOR_EXPLORER_REGRESSION_CHECKLIST.md` | Current | Minimum release checks. |
| `CURATOR_EXPLORER_TECHNICAL_DEBT.md` | Current | Auth, live status, rendering, and deferred tools. |
| `CURATOR_EXPLORER_FUTURE_EXTENSION_POINTS.md` | Current advisory | Valid backlog, not committed release scope. |

## Other Files

| File | Status | Notes |
|---|---|---|
| `IDEAS.md` | Brainstorm | Preserve ideas; none are approved merely by appearing here. |
| `worker/README.md` | Current subsystem reference | Worker-local setup and operation only; not project-wide status. |

## Conflicts Resolved by This Audit

### Public Explorer versus Museum Archive

Older documents describe Explorer as a public browsing page. Current v2.6.2 behavior wins: `explorer.html` is the private Curator Museum Archive and is absent from visitor bottom navigation.

### “Current phase” conflicts

Several documents claim different current phases because they were written at different times. Current release status wins:

- Museum foundation: complete
- Collection/progression foundation: partly implemented
- Infrastructure/engine stabilization: complete through Engineering Pass 2.6
- Curator Archive foundation: complete through v2.6.2
- Next named major release: Laboratory
- Full trophies/rewards and full Curator metadata/AI platform: still pending

### Curator roadmap version conflicts

The conceptual capability order remains useful, but version numbers in Roadmap v1.2 are void. Actual release history owns released version numbers.

### Rarity ownership

`PROJECT.MD` and later architecture decisions agree: collections receive rarity. Mashup rarity is not implied.

### Canonical identity

All later engineering contracts agree: normalized unordered pair, multiplicity preserved, metadata excluded from identity.

## Recommended Documentation Cleanup

1. Keep this audit and the canonical guide at repository root.
2. Add a one-line status banner to stale/historical documents.
3. Rewrite `README.md` as a concise current entry point.
4. Replace the Curator roadmap's release-number schedule with capability milestones.
5. Normalize `CHANGELOG.md` into one chronology.
6. Convert `PROJECTLOG.md` into history only; remove embedded stale “Current Version” claims.
7. Update `PROJECT.MD` to reflect Laboratory and the actual current progression/Curator state.
8. Add the final Laboratory design and reward architecture to Markdown so they do not remain only in conversations or spreadsheets.

## Review Evidence

The audit inspected all 72 Markdown files present before this consolidation. Two new files and `BAD.md` were then added:

- `BILLY_LABS_CANONICAL_GUIDE.md`
- `DOCUMENTATION_AUDIT.md`
- `BAD.md`

No application HTML, JavaScript, CSS, Worker code, database migration, inventory data, or version metadata was changed.
