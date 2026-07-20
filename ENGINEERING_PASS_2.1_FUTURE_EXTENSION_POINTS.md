# Engineering Pass 2.1 — Future Extension Points

## Collections and Trophies
Store canonical IDs returned by `BillyMashups.id()`. Resolve display records through the Emoji Engine rather than splitting and reinterpreting IDs inside the feature.

## Laboratory
Ingredient selection may preserve user-entered order for presentation, but experiments and collected results must use the canonical ID.

## Profiles and Top 8
Profile records should store canonical IDs. Display order can be recovered from the resolved mashup row.

## Curator Studio and AI tools
Metadata, suggestions, drafts, reactions, and publishing records should be keyed by canonical ID.

## Cloud and accounts
Synchronization payloads should continue treating mashup IDs as opaque strings. Any future server validator must implement the documented identity contract before rejecting existing values.

## Migrations
Any future identity-format change requires an explicit versioned migration covering browser storage, D1 data, exported backups, URLs, and published curator content.
