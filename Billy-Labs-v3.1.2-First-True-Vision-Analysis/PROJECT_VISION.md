🍳 Emoji Kitchen Explorer

What This Project Is

Emoji Kitchen Explorer is a fun way to browse, discover, collect, and enjoy Google's completed Emoji Kitchen mashups.

It should not feel like searching through a giant technical database.

It should feel like discovering strange little creations, opening packs, completing collections, and finding combinations you never knew existed.

The First Working Version

The first version of the project showed the 100 newest Emoji Kitchen mashups.

Each result included:

- The two original emojis
- A picture of the completed mashup
- The date Google added it
- Its position in the newest-results list
- Search
- A random-result button
- A reset button
- A phone-friendly layout

Next Version

The next version should show every available mashup in groups of 100.

The first page shows the newest 100.

A right arrow opens the next 100.

A left arrow returns to the previous 100.

The app should clearly show:

- Current page
- Result numbers being shown
- Total number of results
- Newest date on the page
- Oldest date on the page

Main Browsing Features

- Browse newest to oldest
- Browse oldest to newest
- Move forward and backward 100 results at a time
- Search by emoji
- Search by emoji name
- Search by date
- Jump to a random mashup
- Jump to a random mashup the user has never seen
- Browse every combination involving one selected emoji
- Browse self-combinations such as 🤪 + 🤪
- Browse combinations added in a particular release

Discovery Modes

Surprise Me

Show a random completed mashup.

Show Me Something New

Show a mashup the user has not viewed before.

Hidden Gems

Show combinations that are easy to miss because few people would think to combine those two emojis.

What Did Google Do?

Show especially strange, funny, confusing, or unnecessary creations.

Tonight's Discoveries

Give the user a small curated group of unseen mashups.

Discovery Packs

Reveal several mashups one at a time, like opening a pack of collectible cards.

Possible pack themes:

- Animals
- Faces
- Food
- Objects
- Cursed
- Cute
- Wooden
- Double emojis
- New releases
- Completely random

Sorting Ideas

- Newest
- Oldest
- Recently added
- Random
- Unseen first
- Favorites first
- Funniest
- Weirdest
- Cutest
- Most cursed
- Most surprising
- By first emoji
- By second emoji
- By release date

Some opinion-based categories may eventually require manual tags or user voting.

Collections

Users should be able to explore or complete collections such as:

- Every 🤪 combination
- Every 🦜 combination
- Every 🪵 combination
- Every animal combination
- Every food combination
- Every face combination
- Every self-combination
- Every mashup from a particular update
- Every combination involving hearts
- Every combination involving crowns
- Every combination involving ghosts
- Every combination involving spiders
- Every combination involving the magic wand

Users should also be able to make their own collections.

Seen and Unseen Tracking

The app should remember which completed mashups the user has opened.

It should display progress such as:

- Mashups seen
- Mashups unseen
- Percentage discovered
- New discoveries today
- Current discovery streak
- Collections completed

Example:

«4,317 of 147,826 mashups discovered
2.9% complete»

A mashup should not count as seen merely because it appeared far down a page. It should count after the user opens it or deliberately marks it as seen.

Favorites

Users should be able to save mashups they love.

Possible favorite groups:

- Funniest
- Cutest
- Most cursed
- Best reactions
- Send to friends
- Personal favorites

Achievements

Achievements should make exploring feel playful rather than like scrolling through a database.

Progress Achievements

- First Discovery
- First 10
- First 100
- First 1,000
- Ten Thousand Seen
- One Percent Complete

Emoji Collection Achievements

- Saw every 🤪 mashup
- Saw every 🦜 mashup
- Saw every wooden mashup
- Saw every self-combination
- Completed one emoji's entire collection
- Completed a full release date

Discovery Achievements

- Found a combination involving two animals
- Found a food-animal hybrid
- Found a face mixed with an object
- Found a self-combination
- Found a hidden Blob design
- Found a very recent addition
- Found an extremely old design
- Found something the app classified as cursed
- Found a combination involving an underused emoji

Possible Fun Achievement Names

- Kitchen Rookie
- Certified Mixologist
- What Did Google Do?
- Wooden Collector
- Double Trouble
- Blob Hunter
- Zany Completionist
- Parrot Advocate
- Cursed Curator
- Deep-Fryer Diver
- Pantry Archaeologist
- Unnecessary but Magnificent
- I Cannot Believe This Exists
- Seen Some Things
- Kitchen Cryptozoologist

These names are not final. More funny achievement names should be saved as they are invented.

Special Research Features

The app could answer questions such as:

- Which emojis have the most combinations?
- Which emojis have the fewest?
- Which emojis have never been supported?
- Is 🦜 unusually neglected?
- Which emoji gained the most combinations in the newest update?
- How many mashups were released on each date?
- Which pairs have more than one artwork version?
- Which emojis mostly transform other emojis rather than appearing themselves?
- What was added since a selected date?

Update Detection

The app should eventually compare an older database with the newest database.

It should report:

- Newly added mashups
- Removed mashups
- Replaced artwork
- New supported emojis
- Number of additions in each update
- New combinations for a selected emoji

Example:

«Google added 173 new mashups on April 29, 2026.»

Design Style

The app should be:

- Fun
- Colorful without being cluttered
- Easy to use on an Android phone
- Focused on large completed mashup pictures
- Understandable without technical knowledge
- Fast to browse
- Playful rather than corporate
- Accessible in light and dark mode

Every card should clearly show:

- Completed mashup picture
- Original emoji pair
- Names
- Release date
- Seen or unseen status
- Favorite button

Important Data

The project currently has:

- The full Emoji Kitchen backend database
- A working HTML gallery showing the 100 newest completed mashups
- Image links that load completed results from Google's public Emoji Kitchen image servers

The first gallery file is named:

"emoji_kitchen_100_newest.html"

The complete source database came from:

"emoji-kitchen-backend"

Development Rule

Important ideas must not live only inside a ChatGPT conversation.

When a useful feature, achievement, category, design decision, or research idea is created, it should be added to this file or another project document.

GitHub is the project's permanent memory.

Immediate Next Steps

1. Add the first working gallery to this repository.
2. Rename it to "index.html".
3. Confirm that it works through GitHub Pages.
4. Add previous and next page arrows.
5. Show 100 mashups per page.
6. Add page and result counters.
7. Add searching and sorting.
8. Add seen and unseen tracking.
9. Add favorites.
10. Add discovery modes and achievements.

Long-Term Goal

Create the most enjoyable Emoji Kitchen exploration tool available.

People should be able to search when they know what they want.

More importantly, the app should help them discover things they never would have thought to search for.

## Discovery and Progression Separation (v2.4.0)

Discovery and progression are separate systems. Discovery answers how a player finds a mashup; progression answers why they continue collecting. Categories and classifications remain foundational game data for collection completion, trophies, rewards, statistics, and future challenges. They are not deleted merely because category shortcut buttons are removed from the public Home interface.

The intended discovery paths are Billy’s Daily Pick, Newly Created, Surprise Me, Billy’s Lab, and—later—mashups shown in profile Top 8s. General thumbnail browsing is not a discovery path. Thumbnail grids are reserved for a player’s own Collection and future profile Top 8 displays.
