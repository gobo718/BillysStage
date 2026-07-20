# Engineering Pass 2.5 — Discovery Engine Report

## Scope
Audited mashup discovery on Home, Explorer, and mashup detail pages using v2.5.4 as the baseline.

## Findings
Discovery behavior was correct but implemented independently in three pages. The implementations repeated random selection, unseen filtering, current-row exclusion, newest-date detection, and newest-group selection. Product policies intentionally differed by surface.

## Changes
Added `mashup-discovery.js`, a rendering-independent discovery authority. Home, Explorer, and mashup detail pages now consume it. Existing surface policies were preserved rather than flattened.

## Preserved policies
- Home Surprise Me prefers unseen rows, then falls back to the complete inventory.
- Explorer Surprise Me selects from the complete inventory.
- Explorer Show Me Something New selects only unseen rows and celebrates when none remain.
- Detail-page Surprise Me excludes the current row, prefers unseen rows, then falls back to other rows.
- Newly Created selects randomly from the latest release-date group.

## Verification
Thirteen browser-side test files passed, including the new deterministic discovery-engine suite. All eight Worker tests passed. Data integrity and full-inventory resolution contracts remain green.
