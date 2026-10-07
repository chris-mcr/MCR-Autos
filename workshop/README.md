# Workshop files for shelby

Starter skills and an example tool for the shelby agent workshop.

After you have cloned this repo and run `shelby` once (it creates `.shelby/skills` and `.shelby/tools`):

```sh
# inside shelby: type /init     (shelby explores the app and writes SHELBY.md)

# then, in a normal terminal at the repo root:
cp workshop/skills/*.md .shelby/skills/
cp workshop/tools/*.mjs .shelby/tools/
```

Quit shelby (`/exit`) and start it again so the tool loads. `/skills` should list 9 skills and
`/tools` should show `word_count (custom)`.

- `skills/` — markdown instructions the agent reads for a kind of job (add a page, add an API route, review code, ...).
- `tools/` — code the agent can run. `word_count.mjs` has a deliberate bug for you to fix.
- `SHELBY.example.md` — a hand-written app overview. Only use it if `/init` gives a poor result: copy it to `SHELBY.md`.

`.shelby/` and `SHELBY.md` are git-ignored in this repo, so your copies stay local.
