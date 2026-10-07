# Skill: write a Playwright E2E test

The app already has Playwright set up and a few specs in `e2e/` (`cart-api`, `guest-browse`, `login`, `navigation`). Add new tests there, one file per flow: `e2e/<flow>.spec.ts`.

## Setup (already done)
- `playwright.config.ts`: `testDir` is `./e2e`, `baseURL` is `http://localhost:3000`, and `webServer` starts `npm run dev` for you (it reuses a server that's already running). Chromium only.
- Run with `npm test` (or `npm run test:ui`). The first time on a machine, `npm run test:install` downloads the browsers — tell the user to run it, don't run installs yourself.

## App-specific gotchas
- **Auth is localStorage, not cookies.** To test a logged-in flow, seed the session before navigating instead of going through the login UI:
  ```ts
  await page.addInitScript(() => {
    localStorage.setItem("user", JSON.stringify({ id: "e2e-user", name: "Test", email: "test@example.com" }));
    localStorage.setItem("authToken", "test-token");
  });
  ```
- Browsing (`/`, `/shop`, `/product/[id]`) is public. `/cart`, `/account` and `/dashboard` redirect to `/login` in a `useEffect` when `"user"` is absent — assert that redirect for the logged-out case. Add-to-cart while logged out also goes to `/login`.
- **Selectors: prefer `getByTestId`.** The app has many `data-testid`s: `search-input`, `products-grid`, `product-<id>`, `product-title-<id>`, `add-to-cart-<id>`, `favorite-button-<id>`, `filter-<Category>`, `nav-shop` / `nav-cart` / `nav-account`, `email-input`, `password-input`, `login-button`, `proceed-checkout`, `place-order-button`. **Check an id exists with `search` before using it.** Some ids in `src/lib/playwright.ts` (e.g. `product-add-to-cart`, `cart-item`) don't exist in the app. Add a `data-testid` to a new element rather than matching on styling.
- **Data persists** in `.data/store.db` between tests. For API or cart tests use a unique user id, e.g. `` `e2e-${Date.now()}` ``, as `e2e/cart-api.spec.ts` does, so runs don't interfere.
- Product ids are `item-1` … `item-16` (see `src/lib/products.ts`).

## Example
```ts
import { test, expect } from "@playwright/test";

test("guest is redirected from the cart to login", async ({ page }) => {
  await page.goto("/cart");
  await expect(page).toHaveURL("/login");
});

test("logged-in user can add a product and see it in the cart", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("user", JSON.stringify({ id: `e2e-${Date.now()}`, name: "Test", email: "test@example.com" }));
    localStorage.setItem("authToken", "test-token");
  });
  await page.goto("/shop");
  await page.getByTestId("add-to-cart-item-1").click();
  await page.goto("/cart");
  await expect(page.getByTestId("cart-summary")).toBeVisible();
});
```

Keep tests behaviour-focused: assert what the user sees, not implementation details.
