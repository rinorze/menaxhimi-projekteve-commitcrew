# How we work

## 1. Set up once

You need: [Node.js 22+](https://nodejs.org), [Python 3.12+](https://www.python.org/downloads/), Git, and **Expo Go** on your phone (App Store / Play Store).

```bash
git clone https://github.com/rinorze/menaxhimi-projekteve-commitcrew.git
cd menaxhimi-projekteve-commitcrew
git switch staging
```

**App (`app/`)**: Expo SDK 58, React Native, TypeScript, Expo Router.

```bash
cd app
npm install
npx expo start          # scan the QR code with Expo Go (phone and laptop on the same Wi-Fi)
```

**Backend (`backend/`)**: Python, Django, Django REST Framework.

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows   (macOS: source .venv/bin/activate)
pip install -r requirements.txt
copy .env.example .env          # macOS: cp .env.example .env
python manage.py migrate
python manage.py runserver      # open http://127.0.0.1:8000/api/health/
```

Without a `DATABASE_URL` the backend uses a local SQLite file, so you can start right away. The app and the backend are **not connected yet**: that comes later.

**Or with Docker (PostgreSQL included, easiest):** install [Docker Desktop](https://www.docker.com/products/docker-desktop/), open it once and wait for “Engine running”, then open a **new** terminal (the old one does not know `docker` yet) and in the repo folder:

```bash
docker compose up          # database + backend; Ctrl+C to stop
```

API at http://localhost:8000/api/health/ (it says `"database": "postgresql"`), and the database itself at http://localhost:8080 (Adminer: System **PostgreSQL**, server **db**, user **postgres**, password **postgres**). Run Django commands inside it with `docker compose exec backend python manage.py createsuperuser`.

**Website (`website/`)**: React with TypeScript, built with Vite (Krenare).

```bash
cd website
npm install
npm run dev             # open the link it prints (http://localhost:5173)
```

Pages are in `website/src/pages/`, the shared top bar, footer, email box and iPhone frame in `website/src/components/`, colours and the font in `website/src/styles/theme.css`. Every text is written `t({ sq: '…', en: '…' })` (Albanian first). Later it goes online for free with GitHub Pages (`npm run build`), and the waiting-list form gets connected to the backend.

## 2. Who does what

| Who | What | Where in the code | Design (in `docs/design/screens`) |
| --- | --- | --- | --- |
| **Rinor** @rinorze | Card 1: design, shared components, Home, map, reviews every pull request · Card 3: Docker + PostgreSQL | `app/src/components/`, `app/src/app/home.tsx`, `docker-compose.yml` | `02-home`, `03-map` |
| **Elios** @eliosmernica15 | Card 2: backend, models and the API | `backend/` | — |
| **Krenare** @krenareveselii | Cards 7 and 8: the whole website · Scrum Master | `website/src/pages/` | `10-website` |
| **Artiola** @artiolaferizi | Card 4: onboarding 1.1 to 1.4 and 1.14 (Welcome, Look around, Guest place, Language, Sign in) | `app/src/app/(onboarding)/` | `01-onboarding/01–04, 14` |
| **Erleta** @erletaqerimi-oss | Card 5: onboarding 1.5, 1.6, 1.7, 1.10, 1.11 (Where are you today, Kthimi, Interests, Save passport, Privacy) | `app/src/app/(onboarding)/` | `01-onboarding/05–07, 10, 11` |
| **Elvina** @elvinasinani-netizen | Card 6: onboarding 1.8, 1.9, 1.12, 1.13 (Avatar creator, Avatar items, One friend, First km) | `app/src/app/(onboarding)/` | `01-onboarding/08, 09, 12, 13` |

Every onboarding screen already exists as its own file with a placeholder, so nobody edits someone else's file. Each placeholder says who builds it and which design to follow. All designs are pictures in **[docs/design](docs/design)**, sorted by area, with the colours, fonts, photos and links in its README.

## 3. Where to push

| Branch | What it is |
| --- | --- |
| **your branch** | Where you work and push. **Already created for you** (see below). |
| **`staging`** | The shared working branch (default). Your work arrives here through a pull request. Never work on it directly. |
| `develop` / `main` | Weekly and end-of-sprint copies that run. Pull request + 1 approval. |

| Who | Card | Branch |
| --- | --- | --- |
| Rinor | Card 1 (#136), Card 3 (#138) | `feat/rinor-components`, `feat/rinor-docker` |
| Elios | Card 2 (#137) | `feat/elios-places-api` |
| Krenare | Card 7 (#142), then Card 8 (#143) | `feat/krenare-website-landing`, then `feat/krenare-website-pages` |
| Artiola | Card 4 (#139) | `feat/artiola-welcome` |
| Erleta | Card 5 (#140) | `feat/erleta-language` |
| Elvina | Card 6 (#141) | `feat/elvina-avatar` |

```bash
git fetch
git switch feat/artiola-welcome           # your branch: the first time and every day
# ... work ...
git add -A
git commit -m "feat(onboarding): welcome screen (#139)"
git push
```

Every 2 to 3 days, bring in the others' work: `git pull origin staging`. Check which branch you are on with `git branch` (the one with `*`).

When the card is done: on GitHub → **Compare & pull request** → base **`staging`**, write `Closes #139`, and add **rinorze** as reviewer. When it is merged, your card moves to Done by itself. Prefer buttons? [GitHub Desktop](https://desktop.github.com) does the same steps.

## 4. Rules

- Use the colours and sizes from `app/src/theme/tokens.ts` (`useColors()`), never hard-coded hex, so light and dark mode both work.
- Tap targets at least 44 pt. Real data only, no fake numbers. Gold only for rewards.
- **Albanian first.** The app opens in Shqip; English is the second language, then Deutsch and Français. Write every text in Albanian and English. The designs show the Albanian text.
- Commit messages: `type(scope): what you did (#card)`. Types: `feat` · `fix` · `design` · `docs` · `chore`.
- Never commit `.env`, keys, `node_modules/` or `.venv/`.
- Stuck for more than an hour? Write in the group and add the `blocked` label to your card.
