# Engineering Pass 2.1 — Technical Debt Log

## Resolved now

- Legacy URL producers that did not match mashup-page parameters.
- Independent native-sort identity builders.
- Missing identity-specific regression coverage.

## Deferred intentionally

- The existing comparator uses `localeCompare()` on code-point key strings. Changing the comparator could alter stored IDs and therefore requires a dedicated migration study, not a cleanup refactor.
- The `|` separator is safe for current emoji inputs but should remain an opaque implementation detail to features.
- The Worker validates ID shape generically rather than reproducing emoji-engine identity rules. Server-side semantic validation belongs in a later API/data-contract pass.
- Profile demo data includes fallback pair matching. Its selection behavior belongs to Mashup Resolution, not Canonical Identity.

## Prohibited drift

- Direct `[a,b].sort().join('|')`
- Direct `` `${a}|${b}` `` identity construction
- New `emoji1` / `emoji2` URL production
- Feature-specific mashup key formats
