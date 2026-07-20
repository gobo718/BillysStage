# Engineering Pass 2.2 — Future Extension Points

## Data imports
Any future Emoji Kitchen data importer should run the validator before replacing the public inventory.

## Curator Studio
Curator publishing should validate canonical IDs and required content before export. The static validator already defines those invariants.

## Collections and Profiles
Future collection/profile editors should distinguish between:

- canonical inventory references, which must resolve; and
- decorative or fictional pair concepts, which must be explicitly typed rather than silently stored as inventory IDs.

## Diagnostics
`DATA_INTEGRITY_REPORT.json` can later feed the Diagnostics page without coupling the core inventory to UI code.

## CI
The command `node tools/data-integrity-validator.js` is ready to become a CI release gate.
