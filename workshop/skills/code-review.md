# Skill: code review

Review changed code for correctness and quality. Bugs first, cleanups second. Be specific — every finding is file:line, what breaks, the fix.

## What to look for (in priority order)
1. **Correctness bugs** — the code doesn't do what it intends. Off-by-one, wrong/missing `await`, unhandled null/undefined (`one()` in `store.ts` returns `null` for a missing row), inverted conditions, wrong variable, state updated but not re-read.
2. **Edge cases** — empty arrays/carts, missing `localStorage` values, a product id that isn't in `lib/products.ts`, a logged-out user hitting a user-only page, a failed `fetch` with no catch, `JSON.parse` on a bad value.
3. **Broken conventions** (this app's rules — flag violations):
   - Database access outside `lib/store.ts`, or a component importing `@/lib/store` instead of calling an `/api` route.
   - SQL built by string concatenation instead of `?` placeholders.
   - A type redeclared instead of imported from `lib/`.
   - `"use client"` missing where hooks are used, or present where nothing is interactive.
   - Deep relative imports instead of the `@/` alias.
   - A new page missing from `navLinks` / `currentPage` in `Navigation.tsx` when it should be in the nav.
   - An existing `data-testid` removed or renamed (the e2e tests in `e2e/` depend on them), or none added on a new interactive element.
   - Unused locals/parameters — `npm run build` fails on them (`noUnusedLocals`, `noUnusedParameters`).
4. **Reuse & simplification** — reinvented helper that already exists in `lib/`, dead code, a 20-line block that's a 2-line one, needless abstraction.
5. **React/Next pitfalls** — missing `key` in a list, `useEffect` with wrong/missing deps, mutating state directly, fetching in `useEffect` for static data that could render on the server.

## How to review
1. `git diff` (via run_command) to see what changed; if nothing's changed, ask what to review.
2. Read the full files around the diff — a change is only correct in context.
3. Report worst-first. For each: **severity** · file:line · the problem · the concrete fix (show the corrected line).
4. Separate real bugs from nits. Don't drown a genuine bug in style nags. If it's clean, say so in one line — don't invent findings.

This skill is about correctness and quality. For auth/access/data-exposure holes, use the `security-review` skill instead.
