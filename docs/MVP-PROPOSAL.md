# Discover Kosovo — MVP Proposal

## Problem and audience

Discover Kosovo helps visitors, returning diaspora, and local students find a reason to explore cultural and natural attractions across Kosovo. Static lists do not connect discovery to an activity or a memorable record of places visited.

## Proposed MVP

Build a small, web-first prototype around one complete journey: discover a place, visit it, check in with a photo, collect a passport stamp, and complete a short quest. A lightweight admin interface lets the team maintain demo attraction content.

### Included

- A browsable map or map-like location view with a small seeded set of attractions.
- Attraction cards/details with name, municipality, coordinates, short description, and sourced image or placeholder.
- A check-in flow using browser camera/photo capture where available and a location-proximity check. The prototype should clearly explain permission needs and provide a demo fallback for presentations.
- A passport page showing earned stamps and visited attractions.
- One predefined quest linking three to five attractions, with simple progress and completion state.
- A basic protected or demo-only admin screen to create and edit attraction records.
- Responsive layout, accessible labels, and clear loading, empty, denied-permission, and error states.

### Explicitly out of scope for the 11-week MVP

- AI or computer-vision verification of submitted photos.
- Social feed, friends, group sessions, direct messages, or public leaderboards.
- Elo rankings, rewards from businesses, or monetization.
- Offline vector maps, queued cryptographic check-ins, and background synchronization.
- Full mobile app store releases, seven-region content coverage, and production moderation workflows.
- Audio histories, archival photo overlays, and automated content imports.

These ideas remain possible future work after the core journey is demonstrated and reviewed.

## MVP acceptance demo

At the final review, a team member can open the prototype, browse at least eight curated attractions, inspect an attraction, complete a demo-supported photo/location check-in, see its passport stamp, make progress through one three-to-five-stop quest, and demonstrate adding or editing an attraction in the admin screen. The team can explain how location/photo permissions and the demo fallback work.

## Success checks

- The complete journey works from attraction discovery through passport/quest progress without a manual database edit.
- At least eight attraction records have complete, consistently formatted core fields and source attribution.
- The admin can add and edit an attraction and the visitor view reflects the change.
- The interface remains usable at desktop and mobile viewport widths and communicates permission failures clearly.

## Assumptions and risks

- The course permits a web-first prototype in place of shipping separate iOS and Android apps.
- A small, carefully curated content set is enough to demonstrate the idea.
- Browser location and camera permissions may be unavailable in classroom or hosted demo environments; provide a clearly labelled demo mode.
- Use only images that the team has permission to use and record their source/license in the content data.
- The product concept PDF describes a much larger platform. The schedule must protect integration and demo time by keeping AI, social, and offline capabilities out of the MVP.
