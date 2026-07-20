# Pass 2.4 Regression Checklist

- [x] Direct-order pair resolves.
- [x] Reversed-order pair resolves to the same row.
- [x] Duplicate-ingredient pair resolves.
- [x] Canonical ID resolves.
- [x] Missing pair returns `null`.
- [x] Incomplete pair returns `null`.
- [x] Index size equals the 147,000-row inventory.
- [x] Every inventory row resolves in both orders.
- [x] Mashup detail page consumes shared resolution.
- [x] Home community content consumes shared exact resolution before fallback.
- [x] Profile content consumes shared exact resolution before fallback.
- [x] Existing browser and Worker suites pass.
