# App knowledge — MCR Autos

An online car-parts store: find parts by vehicle make/model, browse and search by category, view product detail, manage a cart, check out. Next.js 15 (App Router) + React 19, TypeScript (strict), Tailwind CSS 3. Data persists in a local SQLite file. Prices are in £. `package.json` name is `mcr-autos`.

## Layout
- `src/app/` — routes (App Router). Each route is a folder with `page.tsx`.
  - Pages: `/` (home), `/shop`, `/product/[id]`, `/cart` (cart + checkout steps), `/account`, `/dashboard`, `/login`. Plus `error.tsx` and `not-found.tsx`.
  - The home page composes `PartFinder` (make/model finder), `Carousel` (featured parts and reviews), `ImageCarousel`, a category grid and `Accordion` (FAQ).
  - `src/app/layout.tsx` — root layout; loads Syne / DM Sans / DM Mono through `next/font` and sets site metadata.
  - `src/app/api/*/route.ts` — `auth/login`, `cart`, `orders`, `items/favorites`, `items/recent`.
- `src/components/` — reusable UI, one component per file, PascalCase, default export: `Navigation`, `CartButton`, `Carousel`, `ImageCarousel`, `PartFinder`, `Accordion`, `Icon`.
- `src/lib/`:
  - `products.ts` — the catalogue: `Product` type, `categories`, the hardcoded `products` array (`item-1` … `item-32`) and `getProduct(id)`. A part may carry an optional `fits` (make → models, an empty list = every model of that make); a part without `fits` suits every vehicle. Nothing reads `fits` yet. Add a product here and it flows to shop, product detail, cart and dashboard.
  - `vehicles.ts` — make→model data for the part finder: `vehicles`, `makes`, `modelsFor(make)`.
  - `store.ts` — all database access (orders, cart, favourites, recently viewed). Exports the `Order`, `OrderItem` and `CartItem` types.
  - `playwright.ts` — helpers for the e2e tests (`TEST_IDS`, `login`, `logout`, …). Some ids in it no longer exist in the app; check the real `data-testid` before relying on one.
- `e2e/` — Playwright specs (`*.spec.ts`).

## Conventions
- Interactive pages/components start with `"use client"` and use React hooks. Most pages here are client components.
- Imports use the `@/` alias → `src/` (e.g. `@/components/Navigation`, `@/lib/products`).
- **Auth is client-side only.** `POST /api/auth/login` checks a hardcoded in-memory `users` map and returns `{ user, token }` with a literal mock token; nothing is verified server-side. Pages store the user as JSON in `localStorage` under `"user"` (and `"authToken"`). Browsing (`/`, `/shop`, `/product/[id]`) is public; `/cart`, `/account` and `/dashboard` read `localStorage.getItem("user")` in a `useEffect` and `router.push("/login")` if absent. Add-to-cart while logged out redirects to `/login`.
- API routes trust whatever `userId` the client sends (query `?userId=`, the `x-user-id` header, or the POST body).
- Styling is Tailwind utility classes plus CSS variables from `src/app/globals.css`. The UI is dark: `--bg-base`, `--bg-surface`, `--bg-overlay`, `--edge`, `--edge-mid`, `--accent` (pink), `--text-1/2/3`, `--danger`, `--success`. No CSS modules.
- Product images live in `public/parts-images/` (`.webp`) and are referenced by each product's `image` field; rendered with `next/image`.
- Elements the e2e tests drive carry `data-testid` (e.g. `search-input`, `add-to-cart-<productId>`, `nav-<page>`, `email-input`, `login-button`). Keep existing ones when editing, and add one to any new interactive element.
- Types live in `lib/` and are imported. (A few pages redeclare small local interfaces; don't copy that.)

## Persistence (SQLite, `src/lib/store.ts`)
- Node's built-in `node:sqlite` (`DatabaseSync`), file `.data/store.db` (git-ignored; delete it to reset all data). Needs Node 22.5+.
- One table, `items(user_id, collection, id, data)`, where `data` is a JSON blob. Collections: `orders`, `cart`, `favorites`, `recentlyViewed`.
- The database opens lazily on first use (not at import), because `next build` imports every route in parallel workers.
- All access goes through the exported async functions in `store.ts` (`getCart`, `addCartItem`, `createOrder`, …). Never query the database from a component or a route directly.
- API routes are a thin layer over `store.ts`: `GET` reads `userId` from `?userId=` or the `x-user-id` header (401 if absent); `POST` takes `{ action, data, userId }` and dispatches on `action` with a `switch`. Add an operation = a new `case` in the route **and** a function in `store.ts`.

## Where things go
- New page → `src/app/<route>/page.tsx`; add it to `navLinks` and the `currentPage` union in `src/components/Navigation.tsx` if it belongs in the nav.
- New component → `src/components/<Name>.tsx`.
- New data logic → `src/lib/store.ts`.
- New API endpoint → `src/app/api/<name>/route.ts`.
- New test → `e2e/<flow>.spec.ts`.

## Running the app
`npm install`, then `npm run dev` (http://localhost:3000), `npm run build`, `npm run lint`. Tests: `npm test` (Playwright; starts the dev server itself). Run `npm run test:install` once to download the browsers. The build fails on ESLint errors and on unused locals/parameters (`noUnusedLocals`, `noUnusedParameters`).
