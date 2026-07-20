# Engineering Pass 2.2 — Data Integrity Behavior Contract

## Inputs

- `emoji-data.js`
- `emoji-metadata.js`
- `mashup-core.js`
- `profile-data.js`
- `published-curator-data.js`

## Required invariants

1. Every inventory row is a five-string tuple: left ingredient, right ingredient, label, release date, image URL.
2. Every row produces one unique canonical ID through `BillyMashups.id()`.
3. Duplicate-ingredient pairs are valid and must remain representable.
4. Every ingredient used by the inventory has one complete metadata record.
5. Metadata may not silently omit required descriptive fields.
6. Release dates are real calendar dates in `YYYYMMDD` form.
7. Image URLs use HTTPS, the expected Google static host, the row release date, and both ingredient code-point slugs.
8. Published curator entries must point to an existing canonical ID and contain nonblank blurblet text.
9. Authored demonstration references may be unresolved only as explicit warnings; they must never be mistaken for inventory records.

## Outputs

The validator returns a deterministic report containing:

- `ok`
- inventory summary counts
- release-date counts
- release-blocking `errors`
- nonblocking `warnings`

Any integrity error produces a nonzero command-line exit code.
