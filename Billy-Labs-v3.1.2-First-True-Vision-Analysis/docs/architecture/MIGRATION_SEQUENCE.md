# Evidence-Based Migration Sequence

## Stage 3A — Boundary scaffolding

- Add actual module directories and manifests without moving runtime files.
- Add manifest validation.
- Add boundary exception ledger.
- Add import/reference scanning tests.
- Define public/private namespace conventions.

## Stage 3B — Engine service extraction

- Move `worker/` to `engine/service/worker/` with deployment compatibility preserved.
- Move identity, storage, repository, cloud, and sync modules behind stable exports.
- Keep compatibility wrappers at old paths.
- Run all existing tests plus new path/deployment checks.

## Stage 3C — Data contracts

- Define canonical item identity.
- Split collection mechanics from Billy collection definitions.
- Define Curator draft and Published Record schemas.
- Update Museum to consume only published projections.

## Stage 3D — Curator isolation

- Move Curator UI.
- Extract archive behavior from `explorer.html`.
- Extract editing behavior from `mashup.html`.
- Re-home diagnostics as Curator UI backed by Engine services.

## Stage 3E — Museum isolation

- Move visitor pages/scripts/styles.
- Replace old global dependencies with Engine public exports and Billy content adapters.
- Confirm navigation and direct links remain stable.

## Stage 3F — Game content isolation

- Move emoji, profile, collection, blurblet, lore, and game configuration data.
- Add Billy-specific event mappings and adapters.
- Verify Engine has no Billy-specific runtime dependencies.

## Stage 3G — Packaging and task-specific workspaces

Generate packages from the canonical repository:

- Museum + Engine public runtime + Billy content
- Curator + Engine admin/runtime + Billy content
- Engine-only
- Full integration build

Each package receives a generated manifest and checksums.

## Stage 3H — Final contract enforcement

- Remove obsolete wrappers.
- Close or document every boundary exception.
- Validate every manifest.
- Run full regression and deployment checks.
- Produce Billy-testable v3 candidate.
