# Discover Kosovo

Discover Kosovo is a course project for exploring Kosovo through an interactive map, verified photo check-ins, a digital travel passport, and short themed quests. The project is planned as a focused 11-week MVP by a six-person team.

## MVP goal

Deliver a demonstrable web-first prototype that lets a visitor:

1. Browse a map and a small, curated catalogue of Kosovo attractions.
2. Open an attraction and view its description, location, and reference photo.
3. Complete a photo check-in for a nearby attraction (location and photo evidence; no AI verification in the MVP).
4. Collect a digital passport stamp and see completed places.
5. Follow one short, predefined quest across a small set of attractions.
6. Let a team member add or edit attraction content through a small web admin screen.

Offline maps, AI photo matching, social feeds, rankings, audio tours, chat, and broad production coverage are stretch goals. See [the MVP proposal](docs/MVP-PROPOSAL.md) for scope and exclusions.

## Team and weekly ownership

The six roles and their responsibilities are in [the project plan](docs/PROJECT-PLAN.md). The repository deliberately does not invent member names or GitHub handles: add the confirmed roster and map each role to one member before assigning issues. Work is tracked in the linked GitHub Project, with one sprint per week and a weekly task check.

## Project links

- GitHub Project: [Discover Kosovo — 11-Week Course Plan](https://github.com/users/rinorze/projects/1).
- Course instructor: Professor Lorent Sinani (`@lorentsinani`), invited as a collaborator.
- Weekly plan and sprint checks: [docs/PROJECT-PLAN.md](docs/PROJECT-PLAN.md).
- Contribution and branching rules: [CONTRIBUTING.md](CONTRIBUTING.md).

## Planned structure

The first sprint establishes the project skeleton. The proposed structure is intentionally small and may be adapted to the team's chosen stack:

```text
apps/
  web/             visitor experience and lightweight admin
docs/              MVP proposal, plan, decisions, and research
data/              curated demo attraction data and attribution
```

Do not introduce the full mobile, backend, AI, or offline architecture from the concept document unless the team has the time and course approval to deliver it.

## Getting started

The implementation stack and exact setup commands will be documented once the team confirms the initial architecture in Sprint 1. No application runtime has been added yet.

## Course workflow

- Every work item starts as a GitHub Issue with an owner, role, week, priority, acceptance criteria, and dependencies.
- Create a branch from `main` for each issue and open a pull request that links the issue.
- Review the sprint board and check acceptance criteria once each week; record decisions and blockers on the issue or in the sprint review.
- Keep the MVP small: a working end-to-end visitor journey is more valuable than unfinished advanced features.
