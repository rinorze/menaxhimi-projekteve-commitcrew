# How we work

## 1. Set up once

You need: [Node.js 22+](https://nodejs.org), [Python 3.12+](https://www.python.org/downloads/), Git, and **Expo Go** on your phone (App Store / Play Store).

```bash
git clone https://github.com/rinorze/menaxhimi-projekteve-commitcrew.git
cd menaxhimi-projekteve-commitcrew
git switch staging
```

**App (`frontend/`)**: Expo SDK 58, React Native, TypeScript, Expo Router.

```bash
cd frontend
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

**Or with Docker (PostgreSQL included, easiest):** install [Docker Desktop](https://www.docker.com/products/docker-desktop/), then in the repo folder:

```bash
docker compose up          # database + backend; Ctrl+C to stop
```

API at http://localhost:8000/api/health/ (it says `"database": "postgresql"`), and the database itself at http://localhost:8080 (Adminer: System **PostgreSQL**, server **db**, user **postgres**, password **postgres**). Run Django commands inside it with `docker compose exec backend python manage.py createsuperuser`.

## 2. Who does what

| Who | What | Where in the code | Design |
| --- | --- | --- | --- |
| **Rinor** @rinorze | Design, Home, map, camera unlock, shared components, reviews every pull request | `frontend/src/app/home.tsx`, `frontend/src/components/` | `HomeLive`, `PinsMap`, `PinsZoom`, `PinsCard`, `Unlock`, `Stamp` |
| **Elios** @eliosmernica15 | Backend: models and the API | `backend/` | — |
| **Krenare** @krenareveselii | PostgreSQL database + Scrum Master (the board every week) + **website landing page** | `docker-compose.yml`, `backend/.env`, `website/index.html` | `WebLanding` |
| **Artiola** @artiolaferizi | Onboarding: Welcome, Look around, Guest place, Sign in | `frontend/src/app/(onboarding)/` | `Welcome2`, `GuestMap`, `GuestPlace`, `SignIn` |
| **Erleta** @erletaqerimi-oss | Onboarding: Language, Where are you today, Kthimi, Interests + **website waiting list and app page** | `frontend/src/app/(onboarding)/`, `website/waitlist.html`, `website/app.html` | `Language4`, `WhereToday`, `Kthimi`, `Interests`, `WebWaitlist`, `WebApp` |
| **Elvina** @elvinasinani-netizen | Onboarding: Avatar, Save passport, Privacy, One friend, First km | `frontend/src/app/(onboarding)/` | `Avatar`, `AvatarRewards`, `SavePassport`, `Privacy`, `OneFriend`, `FirstKm` |

**Website (`website/`)**: plain HTML and CSS, no install. Open `website/index.html` in your browser (or run `npx serve website` and open the link). Shared colours and the font are in `website/styles.css`. Later it goes online for free with GitHub Pages; the waiting-list form gets connected to the backend after that.

Every onboarding screen already exists as its own file with a placeholder, so nobody edits someone else's file. Each placeholder says who builds it and which design to follow. All designs are pictures in **[docs/design/screens](docs/design/screens)** (light and dark).

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

- Use the colours and sizes from `frontend/src/theme/tokens.ts` (`useColors()`), never hard-coded hex, so light and dark mode both work.
- Tap targets at least 44 pt. Real data only, no fake numbers. Gold only for rewards.
- Commit messages: `type(scope): what you did (#card)`. Types: `feat` · `fix` · `design` · `docs` · `chore`.
- Never commit `.env`, keys, `node_modules/` or `.venv/`.
- Stuck for more than an hour? Write in the group and add the `blocked` label to your card.
