# Contributing

## Work from an issue

Before starting, choose an issue in the current sprint, confirm its acceptance criteria, and make sure it has one owner. If the scope is unclear or blocked, discuss it in the issue before creating a large implementation.

## Branch and pull request flow

The team has six personal work branches, mapped to the six project roles, and one shared mobile integration branch:

| Branch | Initial role mapping |
| --- | --- |
| `member-1-product` | R1 — Product and project lead |
| `member-2-ux-content` | R2 — UX and content |
| `member-3-discovery-map` | R3 — Visitor experience and map |
| `member-4-checkin-passport` | R4 — Check-in and passport |
| `member-5-data-admin` | R5 — Data and web admin |
| `member-6-quality-release` | R6 — Quality and release |
| `app-mobile` | Shared mobile app integration |

The member numbers are placeholders until the six GitHub usernames are confirmed. The role mapping can be changed with the team roster.

1. Pull the latest version of your assigned `member-N-*` branch before starting work.
2. Commit only work for your assigned issues to your member branch. Put the issue number in commit messages or pull request descriptions.
3. Open a pull request from the member branch into `app-mobile` for mobile app work. Keep each pull request focused on one issue and use `Closes #<issue-number>` when it completes that issue.
4. Explain what changed, how to review it, and any remaining limitation. Include screenshots for visible interface changes.
5. Ask a teammate to review the work against the issue's acceptance criteria. The author should not approve their own pull request.
6. After the weekly review, integrate the approved work into `app-mobile`. Open a pull request from `app-mobile` into `main` for a reviewed, runnable milestone. Only merge after checks and review are complete.

Do not commit directly to `main`. Keep the `app-mobile` branch buildable and bring it up to date with `main` after each integration pull request.

## Quality and collaboration

- Keep `main` in a demoable state; do not commit unfinished experiments directly to it.
- Add or update documentation when setup, behavior, or project decisions change.
- Record third-party content and media sources and only use assets the team may use.
- Do not commit secrets, private user data, or real location/photo data from participants.
- Raise blockers early and update the issue and sprint board during the weekly task check.

## Pull request checklist

- [ ] Linked issue and acceptance criteria are addressed.
- [ ] Change is focused and includes appropriate documentation.
- [ ] Relevant checks were run and their results are stated.
- [ ] UI behavior was checked at a narrow and wide viewport when applicable.
- [ ] No secrets, unlicensed assets, or real participant data were added.
