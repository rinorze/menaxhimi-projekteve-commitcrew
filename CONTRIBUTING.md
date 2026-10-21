# How we work

## Branches

| Branch | What it is | Who can push |
| --- | --- | --- |
| **`staging`** | **Our working branch** (the default). Everyone pushes their work here. | Everyone, directly |
| `develop` | A safe copy of work that runs. Updated from `staging` every week through a pull request. | Pull request + 1 approval |
| `main` | The stable version, updated once per sprint (what we show in class). | Pull request + 1 approval |

If something breaks on `staging`, `develop` and `main` still have the last working version. Nobody can delete `staging` or rewrite its history (force-push), so no work gets lost.

## Every day

```bash
git switch staging
git pull                                   # get your teammates' work first
# ... work on your card ...
git add -A
git commit -m "feat(explore): cities grid (#12)"
git pull                                   # again, in case someone pushed meanwhile
git push
```

- Put your card number in every commit: `(#12)`. In the last commit for that card, write `Closes #12` and the card moves to **Done** by itself.
- For a bigger change you can use your own branch (`feat/12-cities-grid`) and open a pull request into `staging`, so someone can look at it first.
- If `git pull` shows a conflict, open the file, keep the right lines, then `git add -A`, `git commit` and `git push`. Ask in the group if you're unsure.

## The board

- Open **This week** on the [project board](https://github.com/users/rinorze/projects/1). You have **one card per week** with a checklist inside.
- Move your card: **Todo → In Progress → In Review → Done**, and tick the checklist as you go.
- Stuck? Add the `blocked` label and write why in a comment.

## Every Friday / end of sprint

1. Elios (or Rinor) checks that the app and backend run on `staging`, then opens a pull request **`staging` → `develop`**.
2. At the end of the sprint: a pull request **`develop` → `main`**, then the tag `sprint-NN`.

## Commit messages

`type(scope): what you did (#card)`. Types: `feat` · `fix` · `design` · `docs` · `chore`.
Example: `fix(auth): show error when password is wrong (#20)`

## Never commit

`.env` files or keys · `node_modules/` · `venv/` · photos of people without their permission.
