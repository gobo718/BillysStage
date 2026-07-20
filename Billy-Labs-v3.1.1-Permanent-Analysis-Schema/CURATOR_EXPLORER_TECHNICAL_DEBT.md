# Curator Explorer Technical Debt

- Curator access is still a lightweight browser-mode convention rather than authenticated authorization.
- Cloud-published status is represented by the locally available published snapshot; a later release may hydrate live status in batches.
- The inventory grid still renders 100 cards per page and can later adopt virtualization if actual curator use warrants it.
- Dashboard, saved views, bulk operations, analytics, and Museum Health are intentionally deferred.
