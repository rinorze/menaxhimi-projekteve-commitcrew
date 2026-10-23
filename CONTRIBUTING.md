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

The app opens on onboarding. **To open any of the 14 onboarding screens:** go to the end of Home (Ballina tab) → "Të gjitha ekranet e onboarding" → tap a screen. Home → "Komponentet" shows every shared component. After you pull new code, if Expo says it cannot find a module, run `npm install` again and restart with `npx expo start --clear`.

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

| What | Where | Login |
| --- | --- | --- |
| The API | http://localhost:8000/api/health/ | says `"database": "postgresql"` |
| Django admin | http://localhost:8000/admin/ | user `admin`, password `admin` (created automatically, local only) |
| Adminer (look inside the database) | http://localhost:8080 | System **PostgreSQL**, server `db`, user `postgres`, password `postgres`, database `discover_kosovo` |
| PostgreSQL itself | `localhost:5432` | user `postgres`, password `postgres`, database `discover_kosovo` |

Each person has **their own database** on their own laptop; nothing is shared online yet. The data lives in a Docker volume, so it is still there after `docker compose down`.

### Database help

| I want to… | Run |
| --- | --- |
| start everything | `docker compose up` (or `docker compose up -d` to keep the terminal free) |
| stop it, keep the data | `docker compose down` |
| **delete all data and start clean** | `docker compose down -v` |
| run a Django command | `docker compose exec backend python manage.py <command>` (for example `makemigrations`, `migrate`, `test`) |
| open a SQL prompt | `docker compose exec db psql -U postgres -d discover_kosovo` |
| make a backup | `docker compose exec -T db pg_dump -U postgres discover_kosovo > backup.sql` |
| restore a backup | `docker compose exec -T db psql -U postgres -d discover_kosovo < backup.sql` (on an empty database: `docker compose down -v` first) |
| see what is wrong | `docker compose logs backend` or `docker compose logs db` |

- **"port is already allocated"** (5432, 8000 or 8080): something else uses it. Close the other program, or change the left number in `docker-compose.yml`, for example `"5433:5432"`.
- **`docker` is not recognised:** open a **new** terminal after installing Docker Desktop, and make sure Docker Desktop says "Engine running".
- After you change a model, run `makemigrations` and `migrate` (table above) and commit the new file in `backend/<app>/migrations/`, so everyone's database gets the same tables.
- PostGIS (distance queries) comes later; the current image is plain PostgreSQL 17.

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
| **Rinor** @rinorze | Card 1: design, shared components, Home, map, reviews every pull request · Card 3: Docker + PostgreSQL | `app/src/components/`, `app/src/app/(tabs)/home.tsx`, `docker-compose.yml` | `02-home`, `03-map` |
| **Elios** @eliosmernica15 | Card 2: backend, models and the API | `backend/` | — |
| **Krenare** @krenareveselii | Cards 7 and 8: the whole website · Scrum Master | `website/src/pages/` | `10-website` |
| **Artiola** @artiolaferizi | Card 4: onboarding 1.1 to 1.4 and 1.14 (Welcome, Look around, Guest place, Language, Sign in) | `app/src/app/(onboarding)/` | `01-onboarding/01–04, 14` |
| **Erleta** @erletaqerimi-oss | Card 5: onboarding 1.5, 1.6, 1.7, 1.10, 1.11 (Where are you today, Kthimi, Interests, Save passport, Privacy) | `app/src/app/(onboarding)/` | `01-onboarding/05–07, 10, 11` |
| **Elvina** @elvinasinani-netizen | Card 6: onboarding 1.8, 1.9, 1.12, 1.13 (Avatar creator, Avatar items, One friend, First km) | `app/src/app/(onboarding)/` | `01-onboarding/08, 09, 12, 13` |

Every onboarding screen already exists as its own file with a placeholder, so nobody edits someone else's file. Each placeholder says who builds it and which design to follow. All designs are pictures in **[docs/design](docs/design)**, sorted by area, with the colours, fonts, photos and links in its README.

## 3. Where to push

| Branch | What it is |
| --- | --- |
| **your branch** (`feat/` + your first name) | Where you work and push, for all your cards. **Already created for you** (see below). |
| **`staging`** | The shared working branch (default). Your work arrives here through a pull request. Never work on it directly. |
| `develop` / `main` | Weekly and end-of-sprint copies that run. Pull request + 1 approval. |

| Who | Card | Branch |
| --- | --- | --- |
| Rinor | Card 1 (#136), Card 3 (#138) | `feat/rinor` |
| Elios | Card 2 (#137) | `feat/elios` |
| Krenare | Card 7 (#142), then Card 8 (#143) | `feat/krenare` |
| Artiola | Card 4 (#139) | `feat/artiola` |
| Erleta | Card 5 (#140) | `feat/erleta` |
| Elvina | Card 6 (#141) | `feat/elvina` |

```bash
git fetch
git switch feat/artiola                   # your branch (feat/ + your name): the first time and every day
# ... work ...
git add -A
git commit -m "feat(onboarding): welcome screen (#139)"
git push
```

Every 2 to 3 days, bring in the others' work: `git pull origin staging`. Check which branch you are on with `git branch` (the one with `*`).

When the card is done: on GitHub → **Compare & pull request** → base **`staging`**, write `Closes #139`, and add **rinorze** as reviewer. When it is merged, your card moves to Done by itself. Prefer buttons? [GitHub Desktop](https://desktop.github.com) does the same steps.

## 4. How the app is built

```
app/src/
  app/(onboarding)/   the 14 onboarding screens, one file each
  app/(tabs)/         the tab bar (Ballina, Harta, Pasaporta, Shokët, Kërko); home.tsx is Home
  app/components.tsx  the component gallery, app/screens.tsx the list of onboarding screens
  components/         shared components (Screen, Txt, Button…); components/home/ are the parts of Home
  data/               real places, municipalities, events and the Kosovo map (until the API exists)
  lib/                t({ sq, en }) and the language setting
  theme/tokens.ts     colours (light and dark), text sizes, spacing, motion
```

The tab bar is the **native iPhone tab bar** (Liquid Glass on iOS 26), so do not draw your own. Screens inside a tab (a place, a city…) are added as files next to the tabs and opened with `router.push`.

## 5. Shared components (use these, do not draw your own)

Open the app, go to Home → **Komponentet** to see every one with an example. Import them from one place:

```tsx
import { Screen, Txt, Button, Chip, ProgressDots, Icon, Glass } from '@/components';
import { useT } from '@/lib/i18n';

export default function Language() {
  const t = useT();
  return (
    <Screen>
      <ProgressDots step={1} total={7} />
      <Txt variant="largeTitle">{t({ sq: 'Gjuha', en: 'Language' })}</Txt>
      <Button label={t({ sq: 'Vazhdo', en: 'Continue' })} onPress={() => router.push('/where-today')} />
    </Screen>
  );
}
```

| Component | Use it for |
| --- | --- |
| `Screen` | the start of every screen: safe area, background in light and dark, side margin (`scroll` for long screens) |
| `Txt` | all text; `variant` = size (largeTitle, title2, headline, body, subheadline, footnote…), `tone` = colour name |
| `Button` | `primary` (black), `secondary` (grey), `text`, `reward` (gold: only when a stamp can be earned), `glass` (Liquid Glass, over photos and maps) |
| `Chip` | picking one or more options (language, interests, filters) |
| `ProgressDots` | the "step X of 7" bar on onboarding |
| `Icon` | Apple SF Symbols by name |
| `Glass` | Liquid Glass on controls over photos only |
| `GlassIconButton` | a round glass button with an SF Symbol (bell, ghost mode, back) |
| `Press` | anything else tappable (cards, rows) |

`t({ sq, en })` picks the Albanian or English text; the app starts in Albanian. Need something that is missing? Ask Rinor instead of copying one.

## 6. Rules

- Use the colours and sizes from `app/src/theme/tokens.ts` (`useColors()`), never hard-coded hex, so light and dark mode both work.
- **Liquid Glass only on controls** (buttons, bars, pills on photos), never on content and never glass on glass.
- Tap targets at least 44 pt. Real data only, no fake numbers. Gold only for rewards.
- **Albanian first.** The app opens in Shqip; English is the second language, then Deutsch and Français. Write every text in Albanian and English. The designs show the Albanian text.
- Commit messages: `type(scope): what you did (#card)`. Types: `feat` · `fix` · `design` · `docs` · `chore`.
- Never commit `.env`, keys, `node_modules/` or `.venv/`.
- Stuck for more than an hour? Write in the group and add the `blocked` label to your card.
