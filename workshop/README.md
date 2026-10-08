# Workshop files for shelby

Starter skills for the shelby agent workshop.

After you have cloned this repo and run `shelby` once (it creates `.shelby/skills`):

```sh
# inside shelby: type /init     (shelby explores the app and writes SHELBY.md)

# then, in a normal terminal at the repo root:
cp workshop/skills/*.md .shelby/skills/
```

Back in shelby, type `/skills`. It picks up the new files and should list 9 skills.

- `skills/` — markdown instructions the agent reads for a kind of job (add a page, add an API route, review code, ...).
- `SHELBY.example.md` — a hand-written app overview. Only use it if `/init` gives a poor result: copy it to `SHELBY.md`.

`.shelby/` and `SHELBY.md` are git-ignored in this repo, so your copies stay local.
