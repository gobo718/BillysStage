# Public and Private Namespace Conventions

## Purpose

These conventions define how modules may expose and consume behavior while runtime files remain in legacy locations. They are enforceable for all new Stage 3+ code.

## Namespaces

- `engine.public.*` — stable, reusable player/runtime interfaces. Museum and Curator may consume these.
- `engine.admin.*` — privileged administrative interfaces. Curator may consume these; Museum may not.
- `engine.contracts.*` — versioned schemas and event definitions. All modules may consume permitted contracts.
- `engine.private.*` — implementation details owned by Engine. No external module may import them.
- `museum.public.*` — public route/event declarations.
- `museum.private.*` — Museum implementation details. Curator, Engine, and Content may not import them.
- `curator.public.*` — publication commands and validated administrative outputs.
- `curator.private.*` — Curator implementation details and draft workflows. Museum and Engine may not import them.
- `curator.drafts.*` — unpublished records. Museum must never consume them.
- `billyslab-content.public.*` — published Billy-specific data safe for Museum.
- `billyslab-content.curator.*` — Billy-specific editing metadata available only to Curator.

## Filesystem convention

When runtime migration begins, each module must expose cross-boundary behavior through a `public/`, `admin/`, or `contracts/` entry point. Files under `private/` cannot be imported outside their owner. Direct relative imports that cross into another module's internal folders are forbidden.

## Legacy paths

Root-level v2.6.4 runtime files are temporarily classified as legacy compatibility paths. Existing references are recorded in the Boundary Exceptions Ledger. New code may not create additional cross-boundary references to those paths without an approved exception.

## Onboarding reservation

Onboarding lives at `engine.systems.onboarding` and communicates through `engine.contracts.events`. Billy-specific task definitions and event mappings live under `games/billyslab/config/onboarding` and `games/billyslab/config/event-mappings`. No tutorial logic belongs directly in Museum pages.
