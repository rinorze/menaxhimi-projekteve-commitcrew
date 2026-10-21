# Architecture Decision Records

Short records of important technical decisions, so the team (and the professor) can see **what** was decided and **why**. Use the next number, and never edit an accepted ADR. Supersede it with a new one instead.

| # | Decision | Status |
| --- | --- | --- |
| 001 | Expo (React Native) for mobile | Proposed: confirm in Sprint 1 |
| 002 | MapLibre + OpenFreeMap tiles for maps | Proposed |
| 003 | Supabase (Postgres + PostGIS) as the backend | Proposed |
| 004 | pnpm + Turborepo monorepo | Proposed |

## Template (`NNN-title.md`)

```markdown
# NNN. Title

- Status: Proposed | Accepted | Superseded by NNN
- Date: YYYY-MM-DD · Deciders: …

## Context
What problem are we solving? Which constraints apply?

## Options considered
1. … (pros / cons)
2. …

## Decision
We chose … because …

## Consequences
What becomes easier or harder?
```
