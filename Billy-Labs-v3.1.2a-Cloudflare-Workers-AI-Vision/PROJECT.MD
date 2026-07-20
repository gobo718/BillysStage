Billy Labs Emoji Kitchen Explorer
Vision
Billy Labs is a living museum of Emoji Kitchen, not just a database.
Every feature should support one or more of these goals:
Browse
Learn
Collect
Progress
If a feature doesn't strengthen one of these goals, it probably doesn't belong.
Current Status
Phase 1 — Museum ✅
Completed:
Master mashup layout
Home and Explorer use the same layout
Blurblets
Favorites
Search
Collections pages
Daily Pick
Curator section
The museum experience is considered feature complete.
Current Phase
Phase 2 — Collections & Trophies
The focus is no longer adding pages.
The focus is adding progression.
Goals
Collection Manager
Collection Book
Living Trophies
Exhibits
Secret Exhibits
Progress Tracking
Points
Unlock System
First Milestone
Collection Manager
Build a Curator tool for managing collection metadata.
Each collection should support:
Name
Description
Rarity
Public
Common
Rare
Epic
Legendary
Mythic
Points (or automatically derived from rarity)
Public / Hidden
Secret Exhibit
Sort Order
Icon or Banner
Private Curator Notes
This becomes the single source of truth for every collection.
System Design
The Collection Manager should drive:
Collection Book
Trophy calculations
Progress tracking
Secret exhibit unlocks
Exhibit displays
Points
Future progression systems
Avoid hardcoding this information elsewhere.
Design Principle
Collections receive rarity.
Mashups do not receive rarity by default.
If individual mashup rarity is ever added, it should be a separate system that does not replace collection rarity.
Workflow
When I upload a ZIP:
Inspect it first.
Tell me exactly which files you'll edit.
Make only the requested changes.
Return a complete ZIP.
Include:
Status
Next step
Never redesign unrelated parts of the site.
