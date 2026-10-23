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

**Website (`website/`)**: React with TypeScript, built with Vite.

```bash
cd website
npm install
npm run dev             # open the link it prints (http://localhost:5173)
```

Pages are in `website/src/pages/`, the shared top bar, footer, email box and iPhone frame in `website/src/components/`, colours and the font in `website/src/styles/theme.css`. Every text is written `t({ sq: '…', en: '…' })` (Albanian first). Later it goes online for free with GitHub Pages (`npm run build`), and the waiting-list form gets connected to the backend.

## 2. Who does what

| Who | What | Where in the code | Design (in `docs/design/screens`) |
| --- | --- | --- | --- |
| **Rinor** @rinorze | Design, shared components, Home, map, reviews every pull request | `app/src/components/`, `app/src/app/home.tsx` | `02-home`, `03-map` |
| **Elios** @eliosmernica15 | Backend: models and the API + **website waiting list and app page** | `backend/`, `website/src/pages/Waitlist.tsx`, `website/src/pages/AppPage.tsx` | `10-website/02`, `10-website/03` |
| **Krenare** @krenareveselii | PostgreSQL with Docker + Scrum Master + **website landing page** | `docker-compose.yml`, `website/src/pages/Landing.tsx` | `10-website/01` |
| **Artiola** @artiolaferizi | Onboarding 1.1 to 1.3 and 1.14: Welcome, Look around, Guest place, Sign in | `app/src/app/(onboarding)/` | `01-onboarding/01–03, 14` |
| **Erleta** @erletaqerimi-oss | Onboarding 1.4 to 1.7: Language, Where are you today, Kthimi, Interests | `app/src/app/(onboarding)/` | `01-onboarding/04–07` |
| **Elvina** @elvinasinani-netizen | Onboarding 1.8 to 1.13: Avatar, Avatar items, Save passport, Privacy, One friend, First km | `app/src/app/(onboarding)/` | `01-onboarding/08–13` |

Every onboarding screen already exists as its own file with a placeholder, so nobody edits someone else's file. Each placeholder says who builds it and which design to follow. All designs are pictures in **[docs/design](docs/design)**, sorted by area, with the colours, fonts, photos and links in its README.

## 3. Where to push

| Branch | What it is |
| --- | --- |
| **your branch** `feat/<your-name>-<what>` | Where you work and push, e.g. `feat/artiola-welcome` |
| **`staging`** | The shared working branch (default). Your work arrives here through a pull request. |
| `develop` / `main` | Weekly and end-of-sprint copies that run. Pull request + 1 approval. |

```bash
git switch staging
git pull                                  # get everyone's latest work
git switch -c feat/artiola-welcome        # your branch (once)
# ... work ...
git add -A
git commit -m "feat(onboarding): welcome screen (#12)"
git push -u origin feat/artiola-welcome   # later pushes: just git push
```

Then open GitHub → **Compare & pull request** → base **`staging`**, write `Closes #12`, and ask Rinor to review. When it is merged, your card moves to Done by itself.

Every few days, bring in the others' work: `git switch staging && git pull && git switch - && git merge staging`.

## 4. Rules

- Use the colours and sizes from `app/src/theme/tokens.ts` (`useColors()`), never hard-coded hex, so light and dark mode both work.
- Tap targets at least 44 pt. Real data only, no fake numbers. Gold only for rewards.
- **Albanian first.** The app opens in Shqip; English is the second language, then Deutsch and Français. Write every text in Albanian and English. The designs show the Albanian text.
- Commit messages: `type(scope): what you did (#card)`. Types: `feat` · `fix` · `design` · `docs` · `chore`.
- Never commit `.env`, keys, `node_modules/` or `.venv/`.
- Stuck for more than an hour? Write in the group and add the `blocked` label to your card.
