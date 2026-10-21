# How we work

## Branches

- `main`: stable. It is updated once per sprint with what we demoed in class.
- `develop`: the default branch. All finished work is merged here.
- One short branch per issue: `feat/<issue>-<name>`, `fix/<issue>-<name>`, `design/<issue>-<name>`, `docs/<issue>-<name>`.
  Examples: `feat/41-cities-grid`, `feat/52-unlock-api`, `fix/88-login-error`.

You cannot push directly to `main` or `develop`. Everything goes through a pull request.

## Every task, step by step

```bash
git switch develop && git pull                 # 1. start from the latest develop
git switch -c feat/41-cities-grid              # 2. one branch for your issue
git add -A && git commit -m "feat(explore): cities grid with all 38 municipalities"   # 3. small commits
git push -u origin feat/41-cities-grid         # 4. push, then open a PR into develop
```

1. On the [board](https://github.com/users/rinorze/projects/1), move your card to **In Progress**.
2. Open a PR into `develop`, write `Closes #41` in the description, and add screenshots if the change touches UI.
3. Move the card to **In Review**. You need **1 approval** (Rinor too if the PR changes a screen).
4. Use **Squash and merge**. The card moves to **Done** by itself and the branch is deleted.

## Commit messages

`type(scope): what you did`. Types: `feat` · `fix` · `design` · `docs` · `refactor` · `test` · `chore`.
Scopes: `frontend`, `backend`, `auth`, `explore`, `map`, `unlock`, `feed`, `chat`, `ai`, `admin`.

## Rules

- Pull `develop` every day. Keep PRs small (one issue).
- Never commit `.env` files, keys, `node_modules/`, `venv/` or real photos of people without their permission.
- Blocked? Add the `blocked` label to the issue and say who or what you are waiting for in the group chat.
- Reviews are answered within 24 hours on working days.
