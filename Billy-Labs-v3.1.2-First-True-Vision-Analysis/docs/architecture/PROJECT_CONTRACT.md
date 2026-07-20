# BillysLab Project Contract

**Contract version:** 1.0.0-draft  
**Architecture target:** BillysLab v3 modularization  
**Evidence base:** Stage 0 baseline audit and Stage 1 dependency/ownership audit of `Billy-Labs-v2.6.4-curator-access-restoration.zip`

## 1. Purpose

This contract defines the ownership, dependency, data, interface, and migration rules for converting BillysLab from a coupled application into a game built on a reusable Engine boundary.

It governs architecture. It does not authorize feature expansion or behavior redesign.

## 2. Canonical source and release safety

1. The canonical production baseline remains the newest Billy-approved working build.
2. Modularization work must start from a fresh extraction of that baseline.
3. No migration stage may silently replace the canonical baseline.
4. Each working release must update both the archive filename and the version shown inside the application.
5. A migration stage is not complete until file verification, local behavior verification, and user-environment verification are reported separately.

## 3. Top-level ownership model

BillysLab is one repository with four primary ownership zones:

- **Engine** — reusable platform and game-system logic.
- **Museum** — public player-facing BillysLab experience.
- **Curator** — administrative, editorial, review, diagnostics, and publishing workflows.
- **BillysLab Content** — emoji data, collection definitions, terminology, lore, presentation assets, and game-specific configuration.

Repository tooling, tests, release files, and historical documentation are support zones rather than runtime modules.

## 4. One-owner rule

Every production file must have exactly one owning module.

A file may be consumed by more than one module, but ownership remains singular. Mixed-owner files are temporary migration debt and must be split or wrapped before final placement.

Known mixed-boundary debt from Stage 1:

- `explorer.html`
- `mashup.html` editing responsibilities
- `diagnostics.html`
- `collections-data.js`
- `curator-data.js` versus `published-curator-data.js`

## 5. Dependency direction

Allowed runtime dependency direction:

```text
Museum ---------> Engine
Curator --------> Engine
Museum ---------> BillysLab Content
Curator --------> BillysLab Content
BillysLab Content -> Engine contracts/configuration only
Engine ---------> no BillysLab-specific runtime code
```

Forbidden directions:

- Engine importing Museum, Curator, Billy-specific pages, lore, emoji records, or Billy-branded presentation.
- Museum importing Curator internals or draft data.
- Curator importing Museum page internals.
- Billy-specific content implementing reusable persistence, identity, sync, or progression infrastructure.

## 6. Interface rule

Cross-module behavior must pass through one of these documented mechanisms:

1. A versioned contract.
2. A public service interface.
3. A read-only data projection.
4. A documented event.
5. A game-specific adapter implementing an Engine contract.

Direct access to another module's private storage keys, mutable objects, DOM internals, or unpublished data is prohibited.

## 7. Engine eligibility rule

Logic belongs in Engine when it is reasonably reusable without knowing Billy-specific vocabulary, emoji identities, lore, branding, or page structure.

Examples:

- Device identity: Engine.
- Storage adapter: Engine.
- Sync orchestration: Engine.
- Progress event processing: Engine.
- Generic onboarding task state: Engine.
- `mashup.viewed` task definition: BillysLab Content/configuration.
- Emoji metadata: BillysLab Content.
- Museum card layout: Museum.
- Curator review screen: Curator.

## 8. Event contract rule

Engine systems should communicate through stable events rather than page-specific callbacks where practical.

Event names must be namespaced and versioned by schema. Examples:

- `identity.device.created`
- `progress.item.recorded`
- `collection.item.collected`
- `publishing.record.published`
- `onboarding.task.completed`

Billy-specific events may exist, such as `mashup.viewed`, but must be translated into generic Engine events or handled by a Billy-specific adapter.

## 9. Data ownership and publication boundary

Administrative working data and public published data are separate products.

- Curator owns draft/editing state.
- Publishing services validate and transform approved records.
- Museum consumes a read-only published projection.
- Museum must never read Curator draft storage directly.
- Published data schemas must be versioned.
- Reverting publication must create a new publication state or documented history entry rather than mutating history invisibly.

## 10. Storage rule

Storage keys, repositories, adapters, and synchronization behavior are Engine-owned.

Game modules access persistence through repository/service contracts. They may define game-specific record schemas, but may not independently invent competing storage layers.

Existing storage and sync behavior must remain compatible during migration.

## 11. Identity and accounts boundary

Identity is separate from game profile and progression.

The architecture must support:

- anonymous device identity,
- future authenticated accounts,
- account linking,
- cloud synchronization,
- permissions and roles,
- privacy and moderation,
- profile presentation,
- future leaderboards.

Only device identity and current sync foundations are active now. Other capabilities remain reserved contracts, not implementation scope.

## 12. Guided onboarding support

Guided mandatory onboarding is a reserved first-class Engine system.

The architecture must support:

- ordered or dependency-based tasks,
- mandatory tasks,
- event-driven completion,
- persistent resumable state,
- task versioning and migration,
- rewards or unlock triggers,
- context-sensitive prompts,
- account/device continuity,
- Billy-specific tutorial content supplied as configuration.

No onboarding UI or tutorial sequence is required during modularization. The requirement is architectural support and a stable contract home.

## 13. Reserved systems rule

A reserved system must have:

- an assigned layer and owner,
- a named contract location,
- known integration points,
- no premature implementation unless separately approved.

Reserved space does not justify speculative production code.

## 14. Public API stability

Each module manifest declares its exports. Anything not declared is private.

Breaking a public contract requires:

- contract version change,
- migration notes,
- affected-consumer review,
- regression tests,
- compatibility plan where current production data is involved.

## 15. Migration rules

1. Inventory and contract before movement.
2. Introduce boundaries before changing behavior.
3. Prefer wrappers and adapters over large rewrites.
4. Move one ownership zone at a time.
5. Keep routing and deployment behavior stable unless a stage explicitly targets them.
6. Preserve tests and add boundary tests before extraction.
7. Resolve mixed-boundary files before declaring the modular split complete.
8. Do not combine modularization with unrelated visual redesign or feature expansion.

## 16. Testing and verification

Every migration package must include:

- file inventory and hashes,
- changed-file list,
- contract/boundary checks,
- existing regression test results,
- new module-boundary test results,
- a Verification Report Card.

Verification categories:

- **File Verification** — files, paths, hashes, manifests, and changes inspected.
- **Local Behavior Verification** — tests and local rendered behavior checked.
- **User Environment Verification** — Billy confirms the build in the actual deployment/device environment.

If one test method fails, another valid method must be attempted before the category is marked incomplete.

## 17. Enforcement

The contract is enforced through:

- `MODULE.json` manifests,
- boundary tests,
- import/reference scans,
- schema validation,
- release review,
- the ownership matrix.

Temporary exceptions must be recorded in `BOUNDARY_EXCEPTIONS.md` with owner, reason, risk, and removal stage.
