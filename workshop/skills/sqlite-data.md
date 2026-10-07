# Skill: add or change data logic

All persistence lives in `src/lib/store.ts` (SQLite through Node's built-in `node:sqlite`, file `.data/store.db`). **Only the API routes (`src/app/api/*/route.ts`) import it** — components never touch the database; they `fetch` those routes.

The data model is one table, `items(user_id, collection, id, data)`, with `data` as a JSON blob. A "collection" is `orders`, `cart`, `favorites` or `recentlyViewed`.

1. **Add an exported function to `store.ts`.** Build it from the private helpers already there — `all<T>(userId, collection)`, `one<T>(userId, collection, id)`, `put(userId, collection, id, value)`, `del(...)`, `clear(...)`. Match the surrounding style; keep it `async` like the rest, even though the helpers are synchronous.
2. **Never build SQL by string concatenation.** If you must add a query, use `db().prepare("... ? ...").run/get/all(...)` with `?` placeholders, as the helpers do.
3. **New collection?** Add its name to the `Collection` union type at the top of `store.ts`. Nothing else to migrate — the table is generic.
4. **Types are declared once** in `store.ts` and exported (`Order`, `OrderItem`, `CartItem`); `Product` is in `lib/products.ts`. Reuse them; never redeclare a shape that exists.
5. **Handle the empty case:** `one()` returns `null` for a missing row, `all()` returns `[]`. Return a sensible default rather than throwing.
6. **Don't open the database at import time.** `db()` opens it lazily because `next build` imports every route in parallel; keep that.
7. Then expose it: add a `case` to the route's `switch (action)` (or a `GET`), and call that route from the component with `fetch`.

Example — add to `store.ts`:
```ts
export async function getCartTotal(userId: string): Promise<number> {
  return all<CartItem>(userId, 'cart').reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```
and in `src/app/api/cart/route.ts`, in the `GET` handler, return it or add `case "getTotal":` to the `POST` switch.

The `.data/` folder is git-ignored and local. Delete `.data/store.db` to reset all data; it's recreated on next use. Requires Node 22.5+.
