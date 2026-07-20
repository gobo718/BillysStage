# Engineering Pass 2.2 — Data Integrity Report

**Release:** Billy Labs v2.5.2  
**Baseline:** Billy Labs v2.5.1 — Engineering Pass 2.1  
**Scope:** Static mashup inventory, ingredient metadata, published curator references, and authored profile/demo pair references.

## Result

The core Emoji Kitchen inventory is structurally healthy. No production mashup records were edited or removed.

- 147,000 rows validated.
- 147,000 unique canonical mashup IDs.
- 619 unique ingredients.
- 619 complete metadata entries, with exact ingredient coverage.
- 413 valid duplicate-ingredient mashups.
- No malformed rows, blank required fields, invalid dates, exact duplicate rows, canonical duplicate IDs, non-NFC ingredients, malformed image URLs, unexpected image origins, date/path mismatches, or ingredient/path mismatches.
- No orphaned published curator records.

## Authored-reference warnings

The profile/demo content contains 16 pair references. Eight occurrences, representing five unique canonical IDs, do not exist in the current mashup inventory:

- 🦝 + ⚡
- 🐸 + 🔭
- 🌵 + 🦆
- 🦝 + 🎩
- 🌙 + 🧀

These references are creative/demo content rather than inventory records. They were not silently replaced. The validator records them as warnings so a later content pass can decide whether each should be replaced, intentionally retained as fictional, or supported by new data.

## Engineering changes

- Added `tools/data-integrity-validator.js`.
- Added `tests/data-integrity.test.js`.
- Added machine-readable `DATA_INTEGRITY_REPORT.json`.
- Updated release markers to v2.5.2.

## Recommendation

Use the validator as a release gate whenever `emoji-data.js`, `emoji-metadata.js`, profile/demo pair content, or published curator data changes.
