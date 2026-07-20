# Billy Labs Engineering Pass 1.3 — Cloud Report

## Subsystem
Cloud configuration and browser API client.

## Files reviewed
- `billy-cloud-config.js`
- `billy-cloud-api.js`
- `tests/cloud-api-client.test.js`
- Relevant call sites in repositories, diagnostics, Curator Studio, device identity, Home, and mashup detail pages

## Architecture assessment
**Health:** Good

The cloud layer already had an appropriate separation:

1. `billy-cloud-config.js` supplies the deployment endpoint.
2. `billy-cloud-api.js` owns HTTP transport and endpoint construction.
3. Repositories and feature modules consume the API client rather than calling `fetch` directly.

This is compatible with future Curator metadata repositories and does not require a redesign.

## Strengths
- Public cloud configuration is separate from transport logic.
- The browser API exposes domain-oriented methods rather than raw request calls.
- Stored browser overrides take precedence over the deployed default.
- User and mashup identifiers are URL encoded.
- Collection-style values are deduplicated before upload.
- Failed HTTP responses are converted into ordinary JavaScript errors.
- The client remains optional, allowing Billy Labs to operate locally when no endpoint is configured.

## Technical debt identified
- Most implementation logic was compressed onto a few lines, making review and maintenance unnecessarily difficult.
- API version, persistence key, and standard headers were embedded as repeated literals.
- Stored configuration access was mixed into startup logic.
- The cloud configuration file did not explain its deployment role or why it should remain data-only.
- Existing cloud-client tests covered only one successful favorites request.

## Changes made
### `billy-cloud-api.js`
- Reformatted the module into auditable sections without changing endpoint behavior.
- Added named constants for the API version, local override key, and JSON request headers.
- Extracted stored-base reading into a guarded helper.
- Extracted URL construction and configuration into named helpers.
- Preserved all existing public methods, arguments, request paths, HTTP methods, request bodies, response handling, and error messages.
- Added read-only `storageKey` diagnostic metadata.
- Incremented the internal API-client version from 5 to 6.

### `billy-cloud-config.js`
- Added documentation describing the file as replaceable deployment data.
- Preserved the exact deployed Worker URL and global variable assignment.

### `tests/cloud-api-client.test.js`
Expanded coverage for:
- API version and diagnostic storage key
- Trailing-slash normalization
- Favorites deduplication
- Standard JSON headers
- Curator authentication-header preservation
- Runtime reconfiguration
- Stored browser override precedence
- Unconfigured-client failure behavior
- Server-provided error messages

## Deferred improvements
- Persisting `configure()` changes inside the API module was deliberately deferred because Curator Studio currently owns that browser-storage action.
- Request cancellation, retries, timeouts, and telemetry were not added because they would alter runtime behavior.
- No new metadata endpoints or repositories were introduced.
- The Worker and D1 schema were not modified in this browser-client pass.

## Compatibility conclusion
The refactor is backward compatible. Existing callers continue to use the same `window.BillyCloudApi` methods and receive the same request/response behavior.

## Verification
Passed:
- All eight browser-side test files
- All eight Cloudflare Worker tests

## Recommendation
Proceed to Engineering Pass 1.4 — Sync & Identity using this release as the canonical baseline.
