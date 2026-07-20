# BillysLab v3 Architecture Blueprint

## Target model

BillysLab remains one canonical repository while becoming one game consumer of an independently bounded Engine.

```text
repository/
├── engine/
├── games/
│   └── billyslab/
│       ├── museum/
│       ├── curator/
│       ├── content/
│       └── config/
├── integration/
├── tests/
├── tools/
├── docs/
└── release/
```

## Intended directory tree

```text
engine/
├── MODULE.json
├── contracts/
│   ├── identity/
│   ├── storage/
│   ├── progression/
│   ├── collections/
│   ├── publishing/
│   ├── onboarding/
│   ├── permissions/
│   └── events/
├── platform/
│   ├── identity/
│   ├── storage/
│   ├── repositories/
│   ├── cloud/
│   └── sync/
├── systems/
│   ├── progression/
│   ├── collections/
│   ├── achievements/
│   ├── publishing/
│   └── onboarding/
├── service/
│   └── worker/
└── tools/

games/billyslab/
├── MODULE.json
├── museum/
│   ├── MODULE.json
│   ├── pages/
│   ├── scripts/
│   ├── styles/
│   └── adapters/
├── curator/
│   ├── MODULE.json
│   ├── pages/
│   ├── scripts/
│   ├── styles/
│   └── adapters/
├── content/
│   ├── MODULE.json
│   ├── emoji/
│   ├── collections/
│   ├── blurblets/
│   ├── profiles/
│   ├── lore/
│   └── assets/
└── config/
    ├── progression/
    ├── achievements/
    ├── onboarding/
    └── event-mappings/

integration/
├── museum-engine/
├── curator-engine/
└── publishing-pipeline/

tests/
├── unit/
├── contracts/
├── boundaries/
├── integration/
└── regression/

docs/
├── architecture/
├── contracts/
├── operations/
└── history/

release/
├── manifests/
├── checksums/
└── verification/
```

## Existing-file treatment

### Move substantially unchanged after boundary scaffolding exists

- `worker/` -> `engine/service/worker/`
- `billy-device-identity.js` -> `engine/platform/identity/`
- `billy-storage.js` -> `engine/platform/storage/`
- `billy-storage-adapters.js` -> `engine/platform/storage/`
- `billy-repositories.js` -> `engine/platform/repositories/`
- `billy-cloud-api.js` and `billy-cloud-config.js` -> `engine/platform/cloud/`
- `billy-sync-manager.js` -> `engine/platform/sync/`
- `tools/data-integrity-validator.js` -> `engine/tools/`
- `tools/performance-benchmark.js` -> `engine/tools/`

### Move only after public APIs are wrapped

- `progress-engine.js` -> `engine/systems/progression/`
- `mashup-core.js` -> split generic identity/resolution mechanics from Billy-specific terminology/configuration
- `mashup-search.js` -> generic search engine plus Billy data adapter
- `mashup-discovery.js` -> generic discovery service plus Billy eligibility rules

### Museum placement

- Visitor-facing pages and UI scripts move under `games/billyslab/museum/`.
- `explorer.html` cannot move intact until archive/Curator behavior is removed.
- `mashup.html` cannot be declared Museum-only until editing behavior is extracted.

### Curator placement

- `curator/index.html` and Curator-only scripts move under `games/billyslab/curator/`.
- Curator archive functionality currently living in `explorer.html` moves here.
- Editing behavior currently living in `mashup.html` moves here.
- Diagnostics ownership is resolved as either Curator UI backed by Engine diagnostics, or a repository support page excluded from Museum navigation.

### BillysLab content placement

- `emoji-data.js`
- `emoji-metadata.js`
- `profile-data.js`
- Billy-specific collection definitions extracted from `collections-data.js`
- versioned public records extracted from `published-curator-data.js`

## Required interfaces before movement

1. Storage repository interface.
2. Device identity interface.
3. Cloud API client interface.
4. Sync manager interface.
5. Canonical item identity contract.
6. Progress event contract.
7. Collection definition versus collection state contract.
8. Curator draft record contract.
9. Published record contract.
10. Publication command/result contract.
11. Diagnostics provider contract.
12. Onboarding task/state/event contracts (reserved only).

## Boundary resolutions

### `explorer.html`

Split into:

- Museum explorer/laboratory route, if still needed publicly.
- Curator archive and metadata browsing route.

No Curator controls remain in the Museum route.

### `mashup.html`

Retain public mashup viewing in Museum. Move editing, draft, publication, and development-only controls to a Curator route or Curator component.

### `diagnostics.html`

Preferred ownership: Curator UI consuming Engine diagnostics services. It should not be a general Museum page.

### `collections-data.js`

Split into:

- Engine collection schema, eligibility, completion, and point mechanics.
- BillysLab collection definitions, names, rarity labels, member lists, presentation, and lore.

### Curator data

Split into three explicit stages:

```text
Curator Draft Record
        ↓ validate/approve
Publication Command
        ↓ transform/version
Published Museum Record
```

Museum reads only the final record.

## Compatibility approach

During migration, compatibility wrappers may preserve existing global names and script paths. Wrappers must:

- be documented,
- delegate to the new owner,
- contain no new business logic,
- have a planned removal stage.

## Completion definition

The modular architecture is complete when:

- every production file has one owner,
- mixed-boundary files have been split,
- manifests validate,
- forbidden cross-imports fail automated checks,
- Museum does not consume Curator drafts,
- Engine has no Billy-specific runtime imports,
- existing behavior passes regression tests,
- the user-environment verification is complete.
