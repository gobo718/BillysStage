# Stage 3A Test Results

## Root and architecture tests

- Tests: 26
- Passed: 26
- Failed: 0

```text
TAP version 13
# Subtest: new module boundaries contain no forbidden references
ok 1 - new module boundaries contain no forbidden references
  ---
  duration_ms: 288.967078
  type: 'test'
  ...
# Subtest: legacy runtime entry points remain present during Stage 3A
ok 2 - legacy runtime entry points remain present during Stage 3A
  ---
  duration_ms: 1.363262
  type: 'test'
  ...
# Subtest: boundary scaffolds and governance files exist
ok 3 - boundary scaffolds and governance files exist
  ---
  duration_ms: 0.692825
  type: 'test'
  ...
# Canonical identity tests passed.
# Subtest: tests/canonical-identity.test.js
ok 3 - tests/canonical-identity.test.js
  ---
  duration_ms: 449.798459
  type: 'test'
  ...
# cloud API client tests passed
# Subtest: tests/cloud-api-client.test.js
ok 4 - tests/cloud-api-client.test.js
  ---
  duration_ms: 439.321106
  type: 'test'
  ...
# Subtest: all module manifests validate and occupy their declared roots
ok 6 - all module manifests validate and occupy their declared roots
  ---
  duration_ms: 298.692263
  type: 'test'
  ...
# curator-explorer-foundation.test.js passed
# Subtest: tests/curator-explorer-foundation.test.js
ok 6 - tests/curator-explorer-foundation.test.js
  ---
  duration_ms: 421.645029
  type: 'test'
  ...
# Data integrity tests passed.
# Subtest: tests/data-integrity.test.js
ok 7 - tests/data-integrity.test.js
  ---
  duration_ms: 2092.483669
  type: 'test'
  ...
# Subtest: device identity is stable and anonymous
ok 9 - device identity is stable and anonymous
  ---
  duration_ms: 72.270626
  type: 'test'
  ...
# Subtest: invalid stored values are replaced with a valid identity
ok 10 - invalid stored values are replaced with a valid identity
  ---
  duration_ms: 1.051757
  type: 'test'
  ...
# Subtest: registration requires configured cloud API
ok 11 - registration requires configured cloud API
  ---
  duration_ms: 1.387394
  type: 'test'
  ...
# Subtest: registration persists timestamps and returns cloud result
ok 12 - registration persists timestamps and returns cloud result
  ---
  duration_ms: 3.153127
  type: 'test'
  ...
# discovery-engine.test.js passed
# Subtest: tests/discovery-engine.test.js
ok 9 - tests/discovery-engine.test.js
  ---
  duration_ms: 393.562833
  type: 'test'
  ...
# live blurblet activation tests passed
# Subtest: tests/live-blurblet-activation.test.js
ok 10 - tests/live-blurblet-activation.test.js
  ---
  duration_ms: 384.023179
  type: 'test'
  ...
# Mashup resolution tests passed.
# Full inventory resolution contract passed.
# Subtest: tests/mashup-resolution.test.js
ok 11 - tests/mashup-resolution.test.js
  ---
  duration_ms: 1997.882615
  type: 'test'
  ...
# performance-scalability.test.js passed
# Subtest: tests/performance-scalability.test.js
ok 12 - tests/performance-scalability.test.js
  ---
  duration_ms: 388.704452
  type: 'test'
  ...
# progress cloud sync tests passed
# Subtest: tests/progress-cloud-sync.test.js
ok 13 - tests/progress-cloud-sync.test.js
  ---
  duration_ms: 378.761275
  type: 'test'
  ...
# repository foundation tests passed
# Subtest: tests/repository-foundation.test.js
ok 14 - tests/repository-foundation.test.js
  ---
  duration_ms: 310.41466
  type: 'test'
  ...
# search architecture tests passed
# Subtest: tests/search-architecture.test.js
ok 15 - tests/search-architecture.test.js
  ---
  duration_ms: 310.091637
  type: 'test'
  ...
# storage adapter tests passed
# Subtest: tests/storage-adapter.test.js
ok 16 - tests/storage-adapter.test.js
  ---
  duration_ms: 231.323493
  type: 'test'
  ...
# Storage foundation tests passed.
# Subtest: tests/storage-foundation.test.js
ok 17 - tests/storage-foundation.test.js
  ---
  duration_ms: 290.456766
  type: 'test'
  ...
# Subtest: registers repositories and tracks sync state
ok 22 - registers repositories and tracks sync state
  ---
  duration_ms: 2.848914
  type: 'test'
  ...
# Subtest: batches queue entries by repository and flushes latest payload
ok 23 - batches queue entries by repository and flushes latest payload
  ---
  duration_ms: 2.137149
  type: 'test'
  ...
# Subtest: disabled flush preserves the queue
ok 24 - disabled flush preserves the queue
  ---
  duration_ms: 2.721732
  type: 'test'
  ...
# Subtest: failed flush retains item and increments attempts
ok 25 - failed flush retains item and increments attempts
  ---
  duration_ms: 1.021421
  type: 'test'
  ...
# Subtest: rejects unknown repositories and incomplete adapters
ok 26 - rejects unknown repositories and incomplete adapters
  ---
  duration_ms: 1.218698
  type: 'test'
  ...
1..26
# tests 26
# suites 0
# pass 26
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 2165.313073

```

## Worker tests

- Tests: 8
- Passed: 8
- Failed: 0

```text

> billy-labs-worker@2.4.0 test
> node --test

TAP version 13
# Subtest: health reports v2.4.0
ok 1 - health reports v2.4.0
  ---
  duration_ms: 23.79983
  type: 'test'
  ...
# Subtest: progress can be read
ok 2 - progress can be read
  ---
  duration_ms: 1.614061
  type: 'test'
  ...
# Subtest: progress can be replaced in one batch
ok 3 - progress can be replaced in one batch
  ---
  duration_ms: 1.045888
  type: 'test'
  ...
# Subtest: favorites compatibility endpoint remains available
ok 4 - favorites compatibility endpoint remains available
  ---
  duration_ms: 0.679416
  type: 'test'
  ...
# Subtest: invalid progress is rejected
ok 5 - invalid progress is rejected
  ---
  duration_ms: 0.600846
  type: 'test'
  ...
# Subtest: migration domains remain defined
ok 6 - migration domains remain defined
  ---
  duration_ms: 0.551107
  type: 'test'
  ...
# Subtest: published blurblet can be read publicly
ok 7 - published blurblet can be read publicly
  ---
  duration_ms: 0.851575
  type: 'test'
  ...
# Subtest: curator blurblet publish requires the configured key
ok 8 - curator blurblet publish requires the configured key
  ---
  duration_ms: 1.177096
  type: 'test'
  ...
1..8
# tests 8
# suites 0
# pass 8
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 141.471745

```
