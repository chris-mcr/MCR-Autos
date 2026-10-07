# Skill: security review

Review code for vulnerabilities. This app has known weak spots — check these first, they're where real bugs live. For correctness bugs and code quality (not security), use the `code-review` skill instead.

## This app's soft underbelly
1. **Auth is client-side only, and API routes trust a client-supplied `userId`.** Sessions are `localStorage` (`"user"` JSON + `"authToken"`). There is no server middleware and no auth check in `src/app/api/*/route.ts`: `cart`, `orders`, `items/favorites` and `items/recent` read the user id from `?userId=`, the `x-user-id` header or the POST body, so any client can read or change any user's data by changing that id. This is the headline finding; look here first. Example: `GET /api/orders?userId=user-2` returns another user's orders.
2. **Hardcoded credentials and a fake token.** `src/app/api/auth/login/route.ts` holds a map of demo accounts with plaintext passwords in the source, and returns the literal token `"mock-jwt-token"` — nothing issues or verifies a real session. Check for no rate limiting or lockout on login. Don't repeat the passwords in your report.
3. **No input validation** on API route bodies. Quantities, prices, totals and ids come straight off the request. `addItem` / `addOrder` accept client-sent prices (look for trusting them instead of recomputing from `lib/products.ts`); `setCart` / `setOrders` replace a user's data with whatever array is sent; `updateOrderStatus` lets any caller mark any order delivered.
4. **The SQLite store** (`src/lib/store.ts`, `.data/store.db`). The existing queries use `?` placeholders — check any new SQL does too, and flag string-built SQL as injection. The file holds every user's data and must stay git-ignored.
5. **Secrets** — `.env*` is git-ignored; check nothing sensitive is committed or logged, and that nothing server-only is exposed to the client through a `NEXT_PUBLIC_*` variable.

## How to audit
1. `search` for `localStorage`, `userId`, `x-user-id`, `route.ts`, `request.json` to map trust boundaries.
2. For each API route: ask "what stops user A from passing user B's id?" If nothing, that's a broken-access-control finding.
3. Report each finding as: **severity** · file:line · what an attacker does · the fix. Lead with the worst.
4. Don't hand-wave. Show the vulnerable line and the concrete exploit ("POST /api/orders with `{userId: victimId}` returns their orders").

Prefer one real, demonstrated hole over ten theoretical ones.
