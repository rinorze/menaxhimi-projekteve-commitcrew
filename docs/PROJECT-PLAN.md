# 11-Week Project Plan

This is a practical reconstruction from the Discover Kosovo overview and the course brief. The referenced conversation did not preserve the previously drafted week-by-week answer, and the group roster is not yet available. Replace role placeholders with the six confirmed GitHub users before assigning work.

## Six roles

| Role | Main responsibility |
| --- | --- |
| R1 — Product and project lead | Scope, backlog, weekly facilitation, integration coordination, demo narrative |
| R2 — UX and content | User flows, wireframes, accessibility, attraction/quest copy and source attribution |
| R3 — Visitor experience and map | Responsive discovery screens, map/location view, attraction details |
| R4 — Check-in and passport | Photo/location check-in, permission states, stamps and passport progress |
| R5 — Data and web admin | Attraction/quest data model, seed content, lightweight create/edit admin |
| R6 — Quality and release | Acceptance review, integration checks, bug triage, documentation and final demo readiness |

Roles describe ownership areas, not extra people. Pair on cross-cutting work and give each issue one directly responsible member after the roster is confirmed.

## Weekly sprint plan

| Sprint | Focus and target outcome | Role-led work (one owner per issue) | Weekly check / exit criteria |
| --- | --- | --- | --- |
| Week 1 — Kickoff and scope | Agree MVP, audience, stack, repository workflow, and definition of done | R1: kickoff/backlog; R2: primary journey; R3-R5: technical feasibility spikes; R6: acceptance checklist | Six members and role mapping recorded; MVP approved; risks and demo fallback agreed |
| Week 2 — Research and UX | Complete key flows and low-fidelity screens | R2: discovery/check-in/passport/admin wireframes; R1: acceptance criteria; R3-R5: review feasibility; R6: accessibility and test scenarios | Team reviews one end-to-end flow; no unresolved blocker on permissions or demo path |
| Week 3 — Foundation and data | Establish app skeleton, attraction schema, seed format, and integration conventions | R3: visitor shell; R5: data model and seed loader; R1: architecture decisions; R2: content schema; R4: check-in state model; R6: baseline quality checklist | App runs locally; sample attraction renders; setup and contribution steps work |
| Week 4 — Attraction discovery | Show a usable location/map view and attraction list/details | R3: map/list/detail; R2: responsive layout and copy; R5: seed 8 attractions; R6: review map/data states; R1: integration | User can find and inspect a seeded attraction; data has attribution |
| Week 5 — Content and navigation | Make attraction browsing coherent and navigable | R3: filters/basic navigation; R5: content/admin groundwork; R2: content quality; R1: review scope; R6: acceptance pass; R4: check-in entry flow | Visitor can move from discovery to an attraction and start a check-in |
| Week 6 — Photo check-in | Complete a reliable demo check-in using photo and proximity, with fallback | R4: check-in flow; R3: location/map handoff; R5: persistence interface; R2: permission copy; R6: edge-case review; R1: scope guard | Successful check-in and denied-permission/demo path both demonstrated; no AI dependency |
| Week 7 — Passport | Award and display stamps for completed check-ins | R4: stamp and passport UI/state; R5: persistence; R3: visited markers; R2: empty/completed states; R6: acceptance review; R1: integration | A successful check-in creates one visible passport stamp without duplicates |
| Week 8 — Quests | Deliver one predefined three-to-five-stop quest | R4: quest progress; R5: quest data; R3: quest route/discovery; R2: quest copy; R6: test scenarios; R1: keep to one quest | Progress updates from completed stops and completion state is visible |
| Week 9 — Lightweight admin | Add/edit attraction content through a small admin screen | R5: create/edit flow; R3: visitor data refresh; R2: form labels/help; R6: validation and error review; R1: access/scope decision; R4: integration | Team can add/edit a place and see it in visitor discovery; admin access is appropriate for a demo |
| Week 10 — Integration and hardening | Stabilize end-to-end journey, fix high-priority issues, rehearse demo | R6: regression checklist; R1: bug triage; R2: content/accessibility polish; R3-R5: fixes and integration; R4: permission fallback check | No known blocker in core journey; demo works on a clean setup; remaining gaps recorded |
| Week 11 — Final review and handoff | Complete course presentation, documentation, and retrospective | R1: presentation and retrospective; R2: user journey/story; R3: discovery demo; R4: check-in/passport demo; R5: admin demo; R6: final checks and setup guide | MVP acceptance demo passes; repository and known limitations are documented; each member presents owned work |

## Weekly task check

Hold one check each week, ideally at the same time. For every issue in the active sprint, the owner reports: completed acceptance criteria, evidence (PR/demo/screenshot), next step, and blocker. The team then moves work on the board, reassigns or splits blocked work, and records scope changes. At sprint end, review the increment and choose a realistic next sprint. Avoid adding stretch features while core journey work is behind.

## GitHub Project setup

The private [Discover Kosovo — 11-Week Course Plan](https://github.com/users/rinorze/projects/1) project is linked to this repository. Its fields are:

- **Status:** Backlog, Ready, In progress, In review, Done, Blocked.
- **Sprint:** Sprint 1 — Kickoff and scope; Sprint 2 — Research and UX; Sprint 3 — Foundation and data; Sprint 4 — Attraction discovery; Sprint 5 — Content and navigation; Sprint 6 — Photo check-in; Sprint 7 — Passport; Sprint 8 — Quests; Sprint 9 — Lightweight admin; Sprint 10 — Integration and hardening; Sprint 11 — Final review and handoff.
- **Role:** R1 Product/project lead; R2 UX/content; R3 Visitor experience/map; R4 Check-in/passport; R5 Data/web admin; R6 Quality/release.
- **Priority:** P0 Must have, P1 Should have, P2 Could have.
- **Week check:** date/status for the weekly review (set once the course meeting date is known).

Use the Sprint field as the 11 weekly categories; create matching repository milestones only if the team wants milestone-level completion tracking. Set actual start/end dates after confirming the course calendar; do not invent dates. Add a saved **Board** view grouped by Status and a **Sprint planning** table view grouped by Sprint. Use an issue form to ensure every card includes description, acceptance criteria, priority, role, sprint, owner, and dependency links.

## Assignment and dependency rules

- Add the six confirmed GitHub handles and assign one owner per issue; use the role field for specialization.
- Keep each issue independently reviewable and small enough to complete within its sprint.
- Link prerequisite issues using GitHub issue references (`Depends on #...`). Avoid circular dependencies.
- Where one feature has multiple independently deliverable parts, split it into separate issues and connect them with dependency references.
- Do not fill the Assignees field with role names or guessed people.
