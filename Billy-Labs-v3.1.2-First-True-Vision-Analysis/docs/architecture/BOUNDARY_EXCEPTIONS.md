# Boundary Exceptions Ledger

These are known temporary exceptions. No new behavior should be added to them before resolution.

| Exception | Current problem | Temporary allowance | Removal stage |
|---|---|---|---|
| `explorer.html` | Mixed Museum and Curator/archive responsibility | May remain at current path while responsibilities are mapped | Stage 3D |
| `mashup.html` | Museum page includes editing/development responsibility | Public viewing remains; no expansion of editing logic | Stage 3D |
| `diagnostics.html` | Mixed Curator/Engine support ownership | May remain reachable during scaffolding | Stage 3D |
| `collections-data.js` | Mechanics and Billy definitions are coupled | Existing reads allowed; no new generic mechanics added here | Stage 3C |
| Museum -> `curator-data.js` | Museum consumes Curator working data | Existing compatibility only; no new Museum dependency | Stage 3C |
| Global script paths | Flat layout requires cross-zone references | Compatibility wrappers allowed | Stages 3B–3F |


## Stage 3A enforcement baseline

The following legacy exceptions are frozen as the starting allowance. They permit existing behavior only; they do not authorize new dependencies.

| ID | Legacy file | Exception | Planned resolution |
|---|---|---|---|
| BX-001 | `explorer.html` | Museum and Curator/archive responsibilities are mixed. | Stage 3D |
| BX-002 | `mashup.html` | Public viewing and editing/development responsibilities are mixed. | Stage 3D |
| BX-003 | `diagnostics.html` | Ownership is unresolved between Curator UI and repository support. | Stage 3D |
| BX-004 | `collections-data.js` | Reusable mechanics and Billy-specific definitions are mixed. | Stage 3C |
| BX-005 | `curator-data.js` / `published-curator-data.js` | Draft and public projections lack explicit versioned contracts. | Stage 3C |
| BX-006 | root runtime paths | Engine candidates still execute from legacy root paths. | Stages 3B–3F |
