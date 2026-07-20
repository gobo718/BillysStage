# Billy Labs Curator Database Schema v1.0

**Status:** Canonical Design Specification (Pre-Implementation)

## 1. Purpose

Defines the long-term database architecture for Curator Studio. This
specification is implementation-independent and precedes SQL migrations.

## 2. Design Principles

-   Preserve immutable Google Emoji Kitchen catalog data.
-   Store Billy Labs metadata separately.
-   Treat AI suggestions as non-canonical until approved.
-   Record every significant change.
-   Design for horizontal feature growth without schema redesign.

## 3. Entity Relationship Overview

Core entities:

-   Mashup (canonical identity)
-   Metadata
-   AI Suggestion
-   Review Item
-   Audit Event
-   Collection
-   Achievement
-   Exhibit
-   Idea
-   User (future)
-   Controlled Vocabulary
-   Category

Relationships:

Mashup → Metadata (1:1 current) Mashup → AI Suggestions (1:many) Mashup
→ Audit Events (1:many) Metadata → Categories (many:many) Metadata →
Vocabulary values (many:many where applicable) Ideas may reference one
or many Mashups. Collections, Exhibits, and Achievements may reference
many Mashups.

## 4. Tables

### mashups

Primary catalog key.

Fields: - mashup_id (PK) - ingredient_a - ingredient_b - display_name -
source_image_url - source_date - catalog_version

Indexes: - mashup_id - ingredient_a - ingredient_b

### metadata

One authoritative curator record.

Fields: - metadata_id (PK) - mashup_id (FK) - verified -
primary_subject - dominant_color - curator_notes - metadata_version -
updated_at

### metadata_values

Stores repeatable fields.

Fields: - value_id - metadata_id (FK) - field_name - value

### ai_suggestions

Fields: - suggestion_id - mashup_id (FK) - field_name -
suggested_value - confidence - ai_model - created_at - status

### review_queue

Fields: - review_id - suggestion_id (FK) - state - reviewer -
reviewed_at - disposition

### audit_log

Fields: - audit_id - entity_type - entity_id - action - old_value -
new_value - actor - timestamp

### categories

Master category list.

### mashup_categories

Bridge table.

### vocabularies

Controlled vocabulary entries.

### ideas

AI-generated observations.

### exhibits

Curated exhibits.

### exhibit_members

Bridge table.

### achievements

Achievement definitions.

### achievement_members

Bridge table.

### collections

Collection definitions.

### collection_members

Bridge table.

### users (future)

Reserved for authenticated accounts.

## 5. Immutable vs Mutable Storage

Google Catalog - Canonical ingredients - Image URL - Source information

Billy Labs - Metadata - Blurblets - Collections - AI output - Reviews -
Audit history - Ideas

## 6. Versioning

Independent versions: - Catalog Version - Metadata Version - AI Model
Version - Data Bible Version - Schema Version

## 7. Migration Strategy

1.  Preserve existing catalog.
2.  Introduce metadata tables.
3.  Introduce AI tables.
4.  Introduce review workflow.
5.  Add Ideas Engine.
6.  Add community features.

## 8. Performance

Target: - 174,000+ mashups - Millions of metadata values - Millions of
AI suggestions

Indexes should prioritize: - mashup_id - category - dominant_color -
verification - review status

Avoid storing duplicated catalog information.

## 9. Scalability

Support: - Multiple AI providers - Community accounts - Voting -
Localization - Additional metadata fields without schema redesign

## 10. Cloudflare D1 Compatibility

Designed around: - Relational tables - Junction tables - Indexed
lookups - Lightweight transactions - Incremental migrations

## 11. Future-proofing

Favor extension tables over altering core tables. Prefer lookup tables
instead of hard-coded enums. Keep AI data isolated from verified
metadata.

## 12. Example Relationship Diagram

Mashup ├── Metadata │ ├── Metadata Values │ └── Categories ├── AI
Suggestions │ └── Review Queue ├── Audit Log ├── Ideas ├── Exhibits ├──
Collections └── Achievements

## 13. Example Record

Mashup: - id: dragon\|apple

Metadata: - primary_subject: Dragon - dominant_color: Green - verified:
true

AI Suggestion: - field: Emotion - value: Happy - confidence: 93%

## 14. Next Milestone

Generate Cloudflare D1 migration specifications from this approved
schema.
