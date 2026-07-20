# Billy Labs v3 — Stage 3C Data Contracts

## Scope

Define canonical item identity, separate collection mechanics from Billy-specific collection definitions, define explicit Curator draft and published-record contracts, and ensure public Museum consumers receive published projections only.

## Completed

- Added a typed canonical item identity contract preserving duplicate ingredient pairs.
- Extracted generic collection normalization and projection mechanics into the Engine.
- Moved Billy-specific collection defaults and storage migration into game content adapters.
- Defined separate Curator draft and published record factories.
- Prevented private notes from entering published projections.
- Added versioned JSON schemas for draft records, published records, and public collections.
- Preserved `collections-data.js` and `curator-data.js` as compatibility loaders.
- Added contract and compatibility tests.

## Intentionally unchanged

- No page layout, visible wording, navigation, collection rules, publishing buttons, cloud routes, storage keys, or visible app version changed.
- Curator UI organization remains deferred.
- No account or onboarding functionality was implemented.
