# Billy Labs Curator Data Bible v1.0

**Status:** Canonical Specification\
**Applies to:** Billy Labs / MASHPEDITION Curator Studio

------------------------------------------------------------------------

# 1. Project Philosophy

1.  The Google Emoji Kitchen catalog is immutable.
2.  Billy Labs metadata is authoritative.
3.  AI is an assistant, never the final authority.
4.  Every change must be reviewable and auditable.
5.  Metadata exists to improve discovery, collections, exhibits,
    achievements, research, and future AI.

# 2. Canonical Mashup Identity

-   Every mashup has a permanent canonical ID.
-   Duplicate ingredients (A+A) are valid identities.
-   Metadata references canonical IDs rather than image URLs.

# 3. Metadata Model

Each field defines: - Name - Description - Data type - Single/Multi
value - Searchable - AI editable - Curator editable - Required -
Lockable

## Initial Core Fields

  Field                  Type         Single   Search   AI   Curator   Lock
  ---------------------- ----------- -------- -------- ---- --------- ------
  Primary Subject        Text           ✓        ✓      ✓       ✓       ✓
  Dominant Color         Enum           ✓        ✓      ✓       ✓       ✓
  Original Ingredients   List           ✓        ✓      No     No       ✓
  Categories             List           ✗        ✓      ✓       ✓       ✓
  AI Description         Long Text      ✓        ✓      ✓       ✓       ✓
  Curator Notes          Long Text      ✓        No     No      ✓       ✓
  AI Confidence          Number         ✓        ✓      ✓      No       No
  Curator Verified       Boolean        ✓        ✓      No      ✓       ✓

# 4. Controlled Vocabularies

Versioned lists maintained by the Curator.

Examples: - Colors - Animals - Food - Fantasy - Emotions - Holidays -
Sports - Professions

# 5. Category Hierarchy

Two independent systems:

1.  Source Categories
    -   Derived from original emoji.
2.  Depicted Categories
    -   Describes the rendered mashup.

A mashup may belong to multiple categories.

# 6. Search Architecture

Support: - Global search - Field search - Boolean filters - Verified
only - AI Suggestions only - Pending Review - Locked - Future semantic
search

# 7. AI Workflow

AI may: - Analyze - Reanalyze - Suggest - Flag inconsistencies -
Estimate confidence

AI never overwrites verified metadata.

# 8. Review Queue

Lifecycle:

New → Pending → Accepted → Edited → Rejected → Deferred → Locked

Every action is recorded.

# 9. Batch Editing

Supported modes:

-   Add Only (default)
-   Replace
-   Remove
-   Clear
-   Set Exactly

Every batch operation requires: - Preview - Confirmation - Undo support

# 10. Locking

Support: - Record locks - Field locks - Temporary locks - Permanent
locks

Locked data is excluded from automated edits.

# 11. Audit History

Every modification stores: - Timestamp - User - Previous value - New
value - Reason - AI model/version (if applicable)

Audit history is immutable.

# 12. Ideas Engine

AI may propose: - Achievements - Exhibits - Collections - Interesting
statistics - Hidden themes - Rare discoveries - Curator insights

Suggestions remain pending until reviewed.

# 13. Future Extensibility

Designed to support: - Accounts - Community submissions - Voting -
Additional AI models - Localization - Custom metadata fields - New
collection systems

# 14. Naming Conventions

-   Stable identifiers are never renamed.
-   Display names may change.
-   Controlled vocabularies are versioned.
-   Metadata schema changes increment the Data Bible version.

# Appendix A --- Example Metadata Record

``` json
{
  "id":"emojiA|emojiB",
  "primarySubject":"Dragon",
  "dominantColor":"Green",
  "categories":["Fantasy","Creature"],
  "verified":true,
  "aiConfidence":98
}
```

# Appendix B --- Specification Governance

Changes to this document should: 1. Receive curator approval. 2.
Increment the specification version. 3. Document migration impacts where
applicable.
