# Design Brief: Discover Kosovo

**Owner:** Rinor Zeqiri (`@rinorze`), Product Designer · **Tools:** Figma (UI, prototype, Dev Mode), FigJam (flows), Maputnik (map style), Lottie (motion)

The app should **feel like a social network you open every day, not a tourist catalogue.** Content comes first, the map is a playground, and every visit is a moment worth sharing.

## 1. Design principles

1. **Proof over promise.** A verified visit is the hero. The "Verified visit ✓" badge, the stamp and the real photo are always visible.
2. **Content first.** Full-bleed photos, minimal chrome, and a familiar social layout (Instagram/Strava patterns) so nobody needs a tutorial.
3. **Playful, not childish.** Stamps, fog and XP feel like collecting, with a subtle passport and cartography aesthetic.
4. **Made in Kosovo.** Local materials and motifs (plis, filigree, Rugova peaks, Prizren stone), never clichés. Albanian copy comes first and English is equal.
5. **Works outdoors.** High contrast, large touch targets (≥ 48 dp), one-handed use, usable in sunlight and with a weak signal.

## 2. Brand direction (starting point, to be explored in Sprint 3)

- **Color:** Kosovo blue and gold as the core accents, plus warm stone neutrals, a "fog" grey and a success green for verification. Light and dark themes. Contrast meets **WCAG 2.2 AA** (4.5:1 for text).
- **Type:** one geometric or humanist sans with full Albanian support (ë, ç). Test *"Ëndrra në Çarshi të Gjakovës"*. One display weight for stamps and headers.
- **Imagery:** real user photos; place photos come from Wikimedia Commons with attribution.
- **Stamp system:** a **parametric stamp**: 7 region frames, each with its own motif and color, plus a category icon, the place name on a circular path and the date. It is built as one SVG component, so 60+ stamps need no 60 drawings. Event stamps get a holographic variant.
- **Map:** a custom MapLibre style in Maputnik, starting from OpenFreeMap "positron/liberty". The base map is muted, places pop, visited places turn gold and unexplored areas sit under fog. Light and dark versions.

## 3. Information architecture

```text
Tabs:  [ Home ]  [ Explore ]  [ ⊕ Check in ]  [ Passport ]  [ Profile ]

Home        → Following / Community feed · post detail · comments · notifications (bell)
Explore     → Map ↔ list · search · category filters · place sheet → place detail · Quests → quest detail
Check in    → nearest place in range → camera → caption → verifying → success (stamp + XP)
Passport    → cover → 7 region pages → stamp detail · achievements · leaderboards
Profile     → header + stats · posts grid / passport / map tabs · followers · edit profile · settings
```

## 4. Screen inventory

Design is due **one sprint before** development starts.

| # | Screen / flow | Priority | Lo-fi | Hi-fi | Built in |
| --- | --- | --- | --- | --- | --- |
| 1 | Splash, welcome, sign up / sign in, forgot password | P0 | S2 | S3 | S2–S3 |
| 2 | Onboarding: language, 3 intro slides, location and camera primers, profile setup | P0 | S2 | S3 | S3 |
| 3 | Home feed (Following / Community), post card, empty feed | P0 | S2 | S4 | S2→S5 |
| 4 | Post detail, comments sheet, like animation | P0 | S2 | S5 | S5 |
| 5 | Explore map, clusters, place sheet, map ↔ list toggle | P0 | S2 | S4 | S3–S4 |
| 6 | Place detail (gallery, info, visitors' photos, directions, save) | P0 | S2 | S4 | S4–S6 |
| 7 | Search and category filters | P1 | S2 | S4 | S5 |
| 8 | Check-in: in range / too far, camera, caption, verifying, success, failure, permission denied, offline | P0 | S2 | S4 | S4–S5 |
| 9 | Passport: cover, region page, stamp grid, stamp detail | P0 | S2 | S5 | S6 |
| 10 | Profile (own and others), followers / following, edit profile | P0 | S2 | S5 | S3–S4 |
| 11 | Notifications | P0 | S2 | S5 | S6 |
| 12 | Report / block sheets | P0 | S2 | S5 | S6 |
| 13 | Quests list, quest detail with route, progress, completion | P0 | S2 | S6 | S7 |
| 14 | XP / level, achievements | P1 | — | S6 | S7 |
| 15 | Leaderboards | P1 | — | S6 | S8 |
| 16 | Fog-of-war map state | P1 | — | S6 | S8 |
| 17 | Events list and festival stamp | P1 | — | S8 | S8 |
| 18 | Settings (language, privacy, delete account), demo-mode banner | P1 | — | S6 | S7 |
| 19 | Web: public profile `/u/username`, landing page | P1 | — | S6 | S7–S8 |
| 20 | Web admin: shadcn defaults plus a short style guide (no hi-fi needed) | P0 | — | S3 | S3–S8 |
| 21 | App icon, splash, share card, store-style screenshots | P1 | — | S7 | S7 |
| 22 | Empty, loading and error states with microcopy (sq/en) | P1 | — | S8 | S9 |

## 5. Deliverables by sprint

| Sprint | Deliverable | Where it lives |
| --- | --- | --- |
| S1 | Competitor and inspiration audit; 3 proto-personas and a journey map | `docs/design/research/` |
| S2 | IA, user flows (FigJam), lo-fi wireframes and a clickable lo-fi prototype | Figma + links in the issue |
| S3 | Visual identity (logo, color, type, icons); Figma UI kit; **design tokens** | Figma · `design/tokens.json` → `packages/shared/theme` |
| S4 | Hi-fi: feed, explore, place detail, check-in, stamp system (SVG frames) | Figma · `design/stamps/` |
| S5 | Hi-fi: profiles, comments, notifications, passport, report/block; custom map style and category pins; **usability test #1** (prototype, 5 people) | Figma · `design/map-style/` · `design/icons/` · `docs/design/research/usability-1.md` |
| S6 | Hi-fi: quests, fog, leaderboards, XP, settings, web pages; motion spec and Lottie files | Figma · `design/motion/` |
| S7 | **Usability test #2** on the real app; app icon, splash, share card | `docs/design/research/usability-2.md` · `design/brand/` |
| S8 | Empty/loading/error states and a microcopy deck (sq/en); events and festival stamps | Figma · `docs/design/copy-deck.md` |
| S9 | **Design QA** (built app vs Figma) and accessibility audit; one issue per finding | GitHub issues labelled `area: design` |
| S10 | Final presentation deck; demo video storyboard | Figma Slides / Google Slides |
| S11 | Demo video; design case study | `docs/design/CASE-STUDY.md` |

## 6. Handoff to developers

- Every UI issue links to its **Figma frame**, using "Copy link to selection". Developers inspect it in **Dev Mode**.
- **Tokens are the contract.** Developers use `theme.colors.*`, `theme.space.*` and `theme.type.*`, never hard-coded hex values.
- Components are named the same in Figma and code (`PostCard`, `PlaceSheet`, `StampBadge`, `PrimaryButton`…).
- Every screen ships with its **states**: loading (skeleton), empty, error, offline, and permission denied.
- Rinor reviews every PR that changes UI and approves only when it matches the design, or the deviation is agreed in the PR.

## 7. Usability testing plan

- **Who:** 5 people per round: at least 1 foreign visitor or Erasmus student, 1–2 diaspora, 2–3 local students.
- **Tasks:** (1) find a place in Prizren worth visiting; (2) check in (demo mode) and post it; (3) find and follow a friend; (4) open your passport — how many regions have you started?; (5) start a quest.
- **Measure:** task success, time on task, errors, an SUS score, and quotes. Fix findings by severity before the next sprint.

## 8. Accessibility checklist (per screen)

Contrast ≥ 4.5:1 for text and 3:1 for UI · touch targets ≥ 48 dp · works at 200% font size · every icon button has an `accessibilityLabel` (sq/en) · color is never the only signal (visited = gold **and** a check mark) · motion respects "reduce motion".
