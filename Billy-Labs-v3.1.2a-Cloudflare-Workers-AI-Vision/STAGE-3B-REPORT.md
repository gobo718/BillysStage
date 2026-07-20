# Billy Labs v3 — Stage 3B Engine Service Extraction

## Scope

Extract existing service behavior into canonical Engine-owned locations without changing application features, UI, public browser paths, API routes, storage keys, cloud endpoint configuration, or Worker behavior.

## Completed

- Extracted the storage gateway and adapters into `engine/platform/storage/`.
- Extracted anonymous device identity into `engine/platform/identity/`.
- Extracted local-first synchronization into `engine/platform/sync/`.
- Extracted the cloud API client into `engine/service/cloud/`.
- Extracted repository orchestration into `engine/service/repositories/`.
- Extracted the Cloudflare Worker implementation, tests, migrations, and service package into `engine/service/worker/`.
- Replaced six historical browser service files with behavior-free compatibility loaders.
- Replaced the historical Worker entry file with an ES module re-export.
- Kept all current HTML references and Worker routes compatible.
- Redirected service tests to canonical Engine implementations.
- Added compatibility delegation tests.

## Intentionally unchanged

- No page layout, styling, wording, navigation, game rule, collection behavior, Curator workflow, publishing behavior, API route, storage key, or visible version label changed.
- `billy-cloud-config.js` remains game/deployment configuration.
- Full cloud sync remains disabled unless explicitly configured.
- No onboarding functionality was implemented; its reserved architectural support remains intact.

## Completion condition

File and local behavior verification passed. User-environment verification remains required before Stage 3B can be declared fully accepted.
