# Contributing

Read this once before your first PR. These rules keep six people from overwriting each other's work and give the professor a clear history of who did what.

## 1. Branches

| Branch | Purpose | Who writes to it |
| --- | --- | --- |
| `main` | Stable. Updated **once per sprint** with what we demoed, and tagged `sprint-01`, `sprint-02`, … `v1.0.0` | PR from `develop` only (Elios or Rinor) |
| `develop` | **Default branch.** Integration of finished work; must always build | PRs from work branches |
| `<type>/<issue>-<short-name>` | One short-lived branch per issue | Its owner |

**Branch types:** `feat/` new functionality · `fix/` a bug · `design/` design assets, tokens, research · `docs/` documentation · `chore/` setup, config, CI · `test/` tests only.

Examples: `feat/41-explore-map`, `design/24-ui-kit-tokens`, `fix/120-feed-double-like`, `docs/2-working-agreement`.

Rules: lowercase with hyphens, always include the issue number, **one issue per branch**, and delete the branch after merge (GitHub does this automatically). Never commit directly to `main` or `develop`.

## 2. Daily workflow

```bash
# 1. Start from the latest develop
git switch develop
git pull

# 2. Create your branch for the issue
git switch -c feat/41-explore-map

# 3. Commit small and often
git add -A
git commit -m "feat(map): show place markers from Supabase"

# 4. Stay up to date with develop (at least daily)
git fetch origin
git merge origin/develop

# 5. Push and open a PR into develop
git push -u origin feat/41-explore-map
gh pr create --base develop --fill   # or use the GitHub website
```

Before you start, move your card to **In Progress** on the [board](https://github.com/users/rinorze/projects/1). When you open the PR, move it to **In Review**.

## 3. Commit messages ([Conventional Commits](https://www.conventionalcommits.org))

`type(scope): short summary in the imperative`, for example:

- `feat(checkin): reject check-ins outside the place radius`
- `fix(feed): stop duplicate likes on double tap`
- `design(tokens): add dark theme colors`
- `docs: add sprint 3 review`
- `chore(ci): cache pnpm store`

Scopes: `mobile`, `web`, `db`, `map`, `checkin`, `feed`, `passport`, `quests`, `admin`, `data`, `tokens`, `ci`.

## 4. Pull requests

- **Title:** the same format as a commit message. **Body:** use the template, and include `Closes #<issue>`. This moves the card to Done on merge.
- Keep PRs **small**: at most about 400 changed lines. Split big features.
- UI changes **must** include screenshots or a short screen recording (Android, light and dark).
- **One approval** is required, from your review pair or Elios. A PR that changes UI also needs a review from **Rinor**. CODEOWNERS requests these reviewers automatically.
- CI (lint, typecheck, tests) must be green.
- Merge with **Squash and merge**. The branch is deleted automatically.
- Reviewers respond within **24 hours** on working days. If you are blocked, say so in the group chat.

**Review pairs:** Erleta ↔ Elvina · Krenare ↔ Artiola · Elios reviews backend (`supabase/`) and risky changes · Rinor reviews UI.

## 5. Issues and the board

- All work starts from an issue. If something new appears, open an issue with a template (Feature, Design task, Bug) and add it to the **Backlog**.
- Each issue has **one owner**, a **Sprint**, a **Priority** (P0/P1/P2), a **size** (points) and acceptance criteria.
- Board columns: **Backlog → Todo → In Progress → In Review → Done**.
- If you are blocked, add the `blocked` label and comment who or what you are waiting for.

## 6. Sprint release (end of each sprint, Sunday)

1. Elios opens a PR `develop → main` titled `release: sprint NN`.
2. The team checks the demo build. After merging, tag the release: `git tag sprint-NN && git push --tags`.
3. Krenare writes `docs/sprints/sprint-NN.md` (goal, done, not done, retro).

## 7. Never commit

`.env` files or keys (only `.env.example`) · `node_modules/`, build output, `.expo/` · real personal data of testers · images without a licence (record the source in `data/attributions.csv`).

## 8. One-time setup

```bash
git config --global user.name "Your Name"
git config --global user.email "the-email-on-your-github-account"
git config --global core.autocrlf input   # Windows: keeps line endings consistent
git clone https://github.com/rinorze/menaxhimi-projekteve-commitcrew.git
```

Tooling (Node.js LTS, pnpm, Expo, Supabase CLI) is listed in the [README](README.md#getting-started).
