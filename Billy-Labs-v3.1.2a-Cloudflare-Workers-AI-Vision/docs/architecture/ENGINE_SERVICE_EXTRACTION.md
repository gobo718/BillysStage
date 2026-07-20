# Engine Service Extraction — Stage 3B

Stage 3B establishes canonical Engine ownership for the existing storage, identity, sync, repository, cloud-client, and Worker services while preserving all legacy browser and Worker entry paths.

## Canonical locations

| Legacy path | Canonical Engine path | Compatibility mechanism |
|---|---|---|
| `billy-storage.js` | `engine/platform/storage/storage.js` | synchronous browser loader |
| `billy-storage-adapters.js` | `engine/platform/storage/adapters.js` | synchronous browser loader |
| `billy-device-identity.js` | `engine/platform/identity/device-identity.js` | synchronous browser loader |
| `billy-sync-manager.js` | `engine/platform/sync/sync-manager.js` | synchronous browser loader |
| `billy-cloud-api.js` | `engine/service/cloud/cloud-api.js` | synchronous browser loader |
| `billy-repositories.js` | `engine/service/repositories/billy-repositories.js` | synchronous browser loader |
| `worker/src/index.js` | `engine/service/worker/src/index.js` | ES module re-export |

The public cloud endpoint configuration remains at `billy-cloud-config.js` because it is deployment/game configuration rather than reusable Engine behavior.

## Compatibility rule

Legacy files may load or re-export a canonical service, but may not contain domain behavior. New service work must occur only in the canonical Engine location.

## Runtime preservation

Existing HTML script references were intentionally left unchanged. Browser pages still request the historical paths; those paths synchronously delegate to the Engine implementations before subsequent scripts execute.
