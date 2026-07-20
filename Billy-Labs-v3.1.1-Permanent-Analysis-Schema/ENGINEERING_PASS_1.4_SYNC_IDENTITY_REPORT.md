# Engineering Pass 1.4 — Sync & Identity Report

## Scope

Reviewed and modified only:

- `billy-sync-manager.js`
- `billy-device-identity.js`
- `tests/sync-manager.test.js`
- `tests/device-identity.test.js`

The Pass 1.3 cloud release was used as the baseline.

## Architecture assessment

The sync and identity subsystem was already correctly separated from UI code.
The sync manager owns repository registration, sync state, persistent queueing,
manual synchronization, and online auto-flush. Device identity owns anonymous
local identity creation and optional cloud registration.

No redesign was necessary.

## Changes made

### Sync manager

- Reorganized the module into constants, state helpers, adapter validation,
  configuration, registration, queueing, synchronization, and flushing.
- Added explicit internal constants for API version, queue key, default status,
  and default configuration.
- Replaced repeated repository lookup logic with one validation helper.
- Extracted the flush operation from the concurrency guard, making retry and
  disabled behavior easier to audit.
- Expanded compressed one-line branches and object construction.
- Added the read-only `queueKey` diagnostic property.
- Incremented the internal module version from 2 to 3.

### Device identity

- Reorganized identity creation, normalization, persistence, masking, and
  registration into clearly separated helpers.
- Added explicit constants for API version, persistence key, and ID prefix.
- Consolidated new-identity persistence through the existing save helper.
- Expanded UUID and random-byte fallback generation for readability.
- Preserved the existing anonymous ID format and storage key.
- Incremented the internal module version from 1 to 2.

## Compatibility preserved

The following remain unchanged:

- Queue storage key: `billy.sync.queue.v1`
- Device storage key: `billy.device.identity.v1`
- Sync state string values
- Queue batching by repository name
- Queue item structure
- Public sync methods and arguments
- Public identity methods and arguments
- Device ID prefix and masking behavior
- Cloud registration request payload
- Registration result shape
- Error messages used by callers
- Online auto-flush behavior

No user-facing page, style, navigation, Worker endpoint, D1 migration, or stored
application data was changed.

## Test improvements

The sync tests now cover:

- Registration and state transitions
- Queue batching and latest-payload behavior
- Disabled flush behavior
- Failed flush retention and attempt counting
- Unknown repositories and incomplete adapters

The identity tests now cover:

- Stable anonymous identity creation
- Existing key and ID format
- Replacement of invalid persisted values
- Registration configuration requirements
- Registration payload and persisted timestamps

## Verification

All browser-side project tests passed.

All eight Cloudflare Worker tests passed.

## Deferred work

- Conflict-resolution policy remains intentionally domain-specific.
- Authentication and account-bound identity remain future features.
- Additional queue backoff policy should be introduced only when actual cloud
  traffic requires it.

## Recommendation

The sync and anonymous identity boundary is ready to support future metadata
repositories without further stabilization work.
