# Skill: add an API route

1. Create `src/app/api/<name>/route.ts`. Import `NextRequest` and `NextResponse` from `next/server` and export an async function per verb: `GET(request: NextRequest)`, `POST(request: NextRequest)`.
2. **Follow the existing shape** (see `src/app/api/cart/route.ts`):
   - `GET` reads `userId` from `request.nextUrl.searchParams.get("userId") || request.headers.get("x-user-id")` and returns **401** `{ error: "User ID required" }` if absent.
   - `POST` reads `{ action, data, userId }` from `await request.json()` and dispatches on `action` with a `switch`; unknown actions return 400 `{ error: "Unknown action" }`. Success returns `{ success: true, ... }`.
3. **All data work goes through `@/lib/store`** — never query SQLite in a route. A new operation = a new `case` here **and** a function in `store.ts` (see the `sqlite-data` skill). Import shared types (`Order`, `CartItem`, `OrderItem`) from `@/lib/store`, don't redeclare them.
4. **Validate input.** Don't trust client-sent ids, prices or totals — recompute prices from `@/lib/products` (`getProduct(id)`). This app's routes don't check that `userId` belongs to the caller (auth is client-side only); when you add a route that touches user data, validate the body and tell the user about the missing auth.
5. Wrap the handler in try/catch, `console.error` the error, and return a 500 JSON error.

Example (`src/app/api/wishlist/route.ts`):
```ts
import { NextRequest, NextResponse } from "next/server";
import { getFavorites } from "@/lib/store";

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId") || request.headers.get("x-user-id");
    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 401 });
    return NextResponse.json(await getFavorites(userId));
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}
```
