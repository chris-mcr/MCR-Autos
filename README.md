# MCR Autos

An online car parts store — find parts by vehicle make/model, browse and search by category, view product detail, manage a cart, and check out. The homepage is built from reusable components (part finder, featured-parts carousel, category grid, reviews carousel, FAQ accordion). Built with Next.js and TypeScript.

## Getting started

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Demo login

A set of demo customer accounts is defined in `src/app/api/auth/login/route.ts`.

- Email: `chris@mcrautos.com`
- Password: `password123`

## Project structure

| Path | Purpose |
|---|---|
| `src/app/` | App Router pages (`/`, `/login`, `/shop`, `/product/[id]`, `/cart`, `/dashboard`, `/account`) |
| `src/app/api/` | API routes for auth, cart, orders, favourites and recently viewed items |
| `src/components/` | Shared UI components — navigation, cart button, carousel, part finder, accordion, icons |
| `src/lib/products.ts` | The product catalogue — single source of truth for all parts |
| `src/lib/vehicles.ts` | Make/model data for the homepage part finder |
| `src/lib/firebase*.ts` | Optional Firebase persistence |
| `public/parts-images/` | Product, category and hero images |

## The catalogue

All products live in `src/lib/products.ts`. Each part has an `id`, `title`, `price`, `category`, `image`, `description`, `rating` and `stock`. Add or edit a product there and it appears across the shop, product detail, cart and dashboard automatically.

Product images live in `public/parts-images/` and are referenced by each part's `image` field (e.g. `/parts-images/brakepads.webp`). Drop in a replacement at the same path, or repoint the `image` field, to swap the artwork for a part — no code changes needed. Images are rendered with `next/image`.

## Data persistence

By default, cart, order and favourite data is held in memory and resets when the server restarts. To persist data, add Firebase config to `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Tech stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Firebase (optional)
