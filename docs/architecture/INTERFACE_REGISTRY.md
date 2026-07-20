# Interface Registry

| Interface | Owner | Consumers | Status | Purpose |
|---|---|---|---|---|
| Device Identity | Engine | Museum, Curator | Foundation | Stable anonymous identity and future account linking |
| Storage Adapter | Engine | All runtime modules | Foundation | Local/cloud persistence abstraction |
| Repository Interface | Engine | Museum, Curator | Foundation | Domain record access without direct key use |
| Cloud API Client | Engine | Museum, Curator | Foundation | Worker communication |
| Sync Manager | Engine | Museum, Curator | Foundation | Reconcile local and cloud state |
| Canonical Item Identity | Engine contract + Billy adapter | Museum, Curator, Content | Foundation | Preserve ordered/canonical mashup identity including duplicate ingredients |
| Progress Event | Engine | Museum, future Onboarding | Foundation | Record generic progression events |
| Collection Definition | BillysLab Content | Engine collection service, Museum, Curator | To formalize | Defines Billy-specific collections |
| Collection State | Engine | Museum, sync | Foundation | Collected/completion state |
| Curator Draft Record | Curator | Publishing service | To create | Editable administrative state |
| Published Record | Engine publishing contract / Billy content projection | Museum | To create | Read-only versioned public data |
| Publication Command | Engine | Curator | Foundation-to-formalize | Validated publish/update/revert request |
| Diagnostics Provider | Engine | Curator diagnostics UI | To create | Read-only runtime/system health data |
| Onboarding Task Definition | Engine contract | Billy config | Reserved | Ordered or dependency-driven mandatory tasks |
| Onboarding State | Engine contract | Identity/storage/sync | Reserved | Persistent resumable tutorial progress |
| Onboarding Event Mapping | Billy config | Engine onboarding | Reserved | Map Billy events such as `mashup.viewed` to generic task completion |
| Permission/Role | Engine contract | Curator, future accounts | Reserved | Player/curator/admin capability checks |
