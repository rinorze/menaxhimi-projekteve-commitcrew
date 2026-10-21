<div align="center">

# Discover Kosovo

**The social travel app where every post is a verified visit.**

Explore Kosovo on a living map, check in with your camera when you are really there,<br/>
collect stamps in your digital passport, and share the journey with friends.

[Project board](https://github.com/users/rinorze/projects/1) ·
[Plan](docs/PROJECT-PLAN.md) ·
[MVP (Shqip)](docs/MVP-PROPOSAL.md) ·
[Architecture](docs/ARCHITECTURE.md) ·
[Design brief](docs/design/DESIGN-BRIEF.md) ·
[Contributing](CONTRIBUTING.md)

![Expo](https://img.shields.io/badge/Expo_SDK-58-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.88-61DAFB?logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostGIS-3FCF8E?logo=supabase&logoColor=white)
![MapLibre](https://img.shields.io/badge/MapLibre-OpenFreeMap-396CB2?logo=maplibre&logoColor=white)

</div>

---

## About

Kosovo welcomed **762,836 visitors in 2025**, most of them from abroad, and hundreds of thousands of diaspora members return every year. The apps they find are static catalogues. **Discover Kosovo** turns exploring into a social game:

| | |
| --- | --- |
| 🗺️ **Discover** | A map of 60+ monuments, nature spots and hidden places in all 7 regions, plus themed *Besa Quests* |
| 📸 **Check in** | Take a photo with the in-app camera inside the place's GPS radius, and it becomes a **verified post** |
| 🛂 **Collect** | Earn stamps in the *Passport of Kosovo*, gain XP, and clear the fog from the map |
| 💬 **Connect** | A feed of friends' visits, follows, likes, comments and weekly leaderboards |

A web **admin CMS** manages places, quests and events and moderates reported content.

> University project for the course *Menaxhimi i Projekteve* (Prof. Lorent Sinani), built in **11 weekly sprints** (Oct 2026 – Jan 2027).

## Tech stack

| Layer | Technology |
| --- | --- |
| Mobile | Expo SDK 58 · React Native · Expo Router · TypeScript · MapLibre + OpenFreeMap · TanStack Query · i18next |
| Web | Next.js 16 · Tailwind CSS 4 · shadcn/ui · deployed on Vercel |
| Backend | Supabase: Postgres + PostGIS, Auth, Storage, Row Level Security, Edge Functions |
| Tooling | pnpm + Turborepo monorepo · GitHub Actions CI · Maestro and Playwright tests · EAS Build |
| Design | Figma · Maputnik · Lottie |

## Repository structure

```text
apps/mobile      Expo app (Android / iOS)
apps/web         Next.js: admin CMS, public profiles, landing page
packages/shared  Types, schemas, design tokens
supabase/        Migrations, RLS policies, SQL functions, seed
data/            Place datasets, import scripts, image attributions
design/          Exported design assets (icons, stamps, map style)
docs/            Plan, architecture, ADRs, sprint reviews, research
```

## Getting started

> The app is scaffolded in **Sprint 2** ([#32](../../issues/32)). These commands work from then on.

**Prerequisites:** Git, Node.js LTS, pnpm (`corepack enable`), an Expo account, and an Android phone or emulator. The Supabase CLI and Docker are optional, for a local database.

```bash
git clone https://github.com/rinorze/menaxhimi-projekteve-commitcrew.git
cd menaxhimi-projekteve-commitcrew
pnpm install
cp .env.example .env          # add the Supabase URL and anon key (ask Elios)
pnpm dev:mobile               # starts Expo; open the app in the development build
pnpm dev:web                  # http://localhost:3000
```

The map needs a **development build** (MapLibre is not included in Expo Go). The shared Android dev APK will be linked here once it is built in Sprint 2. Environments are described in [ARCHITECTURE.md](docs/ARCHITECTURE.md#environments).

## Team: CommitCrew

| Member | Role |
| --- | --- |
| Rinor Zeqiri ([@rinorze](https://github.com/rinorze)) | Product Designer: UI/UX lead · Product Owner |
| Elios Mernica ([@eliosmernica15](https://github.com/eliosmernica15)) | Tech Lead: backend, data and DevOps |
| Artiola Ferizi ([@artiolaferizi](https://github.com/artiolaferizi)) | Web Developer: admin CMS · QA lead |
| Erleta Qerimi ([@erletaqerimi-oss](https://github.com/erletaqerimi-oss)) | Mobile Developer: Explore, map and quests |
| Elvina Sinani ([@elvinasinani-netizen](https://github.com/elvinasinani-netizen)) | Mobile Developer: check-in and passport |
| Krenare Veseli ([@krenareveselii](https://github.com/krenareveselii)) | Mobile Developer: social feed · Scrum Master |

Responsibilities and the sprint-by-sprint plan are in [docs/PROJECT-PLAN.md](docs/PROJECT-PLAN.md#6-team-and-responsibilities).

## How we work

- **Scrum, 1-week sprints.** Every task is an issue on the [GitHub Project](https://github.com/users/rinorze/projects/1) with an owner, sprint, priority and acceptance criteria.
- **Branches:** `main` (a stable release per sprint) ← `develop` (integration, the default branch) ← `feat/<issue>-<name>` work branches.
- **Pull requests** into `develop`, with one approving review, green CI and `Closes #<issue>`. Details are in [CONTRIBUTING.md](CONTRIBUTING.md).

## License

© 2026 CommitCrew. Academic project, all rights reserved. Map data © OpenStreetMap contributors. Place photos are credited in `data/attributions.csv`.
