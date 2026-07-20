# Billy Labs Curator Implementation Roadmap v1.0

**Purpose:** Incrementally implement Curator Studio while keeping Billy
Labs fully functional after every release.

------------------------------------------------------------------------

# v2.5.0 -- Foundation

**Objective** - Lay the groundwork without changing user behavior.

**User-facing changes** - None.

**Internal changes** - Create metadata service interfaces. - Prepare
repository abstraction.

**Files likely modified** - Storage/repository layer - Curator
infrastructure

**Database** - None

**Complexity:** Small

**Dependencies** - Architecture Report - Data Bible

**Risks** - Minimal

**Success Criteria** - No visible behavior changes.

------------------------------------------------------------------------

# v2.5.1 -- Database Foundation

**Objective** - Introduce metadata tables.

**User-facing** - None.

**Internal** - D1 migrations - Metadata repository

**Database** - Initial curator tables

**Complexity:** Medium

**Dependencies** - Database Schema

**Risks** - Migration safety

**Success Criteria** - Existing site unchanged.

------------------------------------------------------------------------

# v2.5.2 -- Metadata Editor

**Objective** - Manual metadata editing.

**User-facing** - Curator metadata editor.

**Internal** - CRUD operations.

**Files** - studio.html - repositories

**Database** - Metadata writes.

**Complexity:** Medium

**Dependencies** - v2.5.1

**Risks** - Validation

**Success** - Metadata persists correctly.

------------------------------------------------------------------------

# v2.5.3 -- Search Foundation

**Objective** - Search metadata.

**User-facing** - Curator search filters.

**Internal** - Indexed lookup layer.

**Database** - Search indexes.

**Complexity:** Medium

**Dependencies** - Metadata editor

**Success** - Fast field searches.

------------------------------------------------------------------------

# v2.6.0 -- AI Suggestions

**Objective** - Store AI suggestions separately.

**User-facing** - Suggestion panel.

**Internal** - Suggestion ingestion.

**Database** - ai_suggestions

**Complexity:** Large

**Dependencies** - Search

**Risks** - Suggestion volume

**Success** - No verified data overwritten.

------------------------------------------------------------------------

# v2.6.1 -- Review Queue

**Objective** - Review AI output.

**User-facing** - Queue with accept/edit/reject.

**Internal** - Workflow engine.

**Database** - review_queue

**Complexity:** Medium

**Dependencies** - AI Suggestions

**Success** - Curator controls every change.

------------------------------------------------------------------------

# v2.6.2 -- Batch Operations

**Objective** - Efficient editing.

**User-facing** - Batch tools.

**Internal** - Preview, undo.

**Database** - Audit integration.

**Complexity:** Medium

**Success** - Safe bulk edits.

------------------------------------------------------------------------

# v2.7.0 -- Audit & Locking

**Objective** - Complete governance.

**User-facing** - History viewer.

**Internal** - Audit logging. - Record locking.

**Database** - audit_log

**Complexity:** Medium

**Success** - Every change traceable.

------------------------------------------------------------------------

# v2.8.0 -- Ideas Engine

**Objective** - AI-generated curator insights.

**User-facing** - Ideas dashboard.

**Internal** - Statistical analysis.

**Database** - ideas

**Complexity:** Large

**Dependencies** - Verified metadata

**Success** - AI proposes exhibits, achievements and discoveries.

------------------------------------------------------------------------

# Future

-   Community accounts
-   Blurblet submissions
-   Voting
-   Semantic search
-   Multiple AI providers
-   Localization

------------------------------------------------------------------------

## Guiding Rule

Every release must: 1. Preserve existing functionality. 2. Be
independently testable. 3. Be reversible if necessary. 4. Ship only
after the previous milestone is stable.
