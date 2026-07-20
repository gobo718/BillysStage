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

------------------------------------------------------------------------

# Engineering Review Strategy (Added)

To reduce risk and improve review quality, implementation work should be
performed in responsibility-based packages rather than attempting to
review the entire project at once.

Recommended review order:

1.  **Infrastructure**

    -   Storage layer
    -   Repository layer
    -   Cloudflare Worker
    -   D1 integration

2.  **Emoji Engine**

    -   Mashup generation
    -   Canonical IDs
    -   Search
    -   Emoji data

3.  **Public Museum**

    -   Home
    -   Explorer
    -   Mashup pages
    -   Daily Pick

4.  **Collections & Profiles**

5.  **Curator Studio**

6.  **Shared Components & Utilities**

Each package should follow the same workflow:

-   Audit
-   Refactor
-   Regression test
-   Release

This package-based workflow replaces large project-wide stabilization
passes and minimizes regressions while producing smaller, verifiable
releases.

------------------------------------------------------------------------

# Engineering Pass Workflow (Canonical)

To minimize regressions and keep Billy Labs releasable after every
milestone, all stabilization work will be performed as **Engineering
Passes**.

Each Engineering Pass is a complete audit, cleanup, refactor, regression
review, and release of a single subsystem.

## Engineering Pass 1 --- Infrastructure

Scope: - Storage layer - Repository layer - Cloudflare Worker - D1
integration - Shared infrastructure utilities

Deliverable: - Safe internal refactors - Improved documentation - No
user-facing changes - Versioned release ZIP

## Engineering Pass 2 --- Emoji Engine

Scope: - Canonical mashup identity - Emoji data - Mashup generation -
Search - Core engine logic

## Engineering Pass 3 --- Public Museum

Scope: - Home - Explorer - Mashup pages - Daily Pick - Favorites -
Public navigation

## Engineering Pass 4 --- Collections & Profiles

Scope: - Collection Book - Collection Manager - Trophy Room - Profiles -
Progress systems

## Engineering Pass 5 --- Curator Studio

Scope: - Dashboard - Metadata Editor - Review Queue - AI Suggestions -
Research Lab - Batch tools - Ideas Engine

### Rules

Every Engineering Pass must: 1. Begin from the latest stable release. 2.
Modify only its assigned subsystem unless required for compatibility. 3.
Preserve user-facing behavior unless the milestone explicitly changes
it. 4. End with regression testing. 5. Produce a versioned ZIP and
detailed changelog.
