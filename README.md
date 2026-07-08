# MCR Autos

An online car parts store — browse and search parts by category, view product detail, manage a cart, and check out. Built with Next.js and TypeScript.

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
- Password: `MCR@2024`

## Project structure

| Path | Purpose |
|---|---|
| `src/app/` | App Router pages (`/`, `/login`, `/shop`, `/product/[id]`, `/cart`, `/dashboard`, `/account`) |
| `src/app/api/` | API routes for auth, cart, orders, favourites and recently viewed items |
| `src/components/` | Shared UI components (navigation, cart button) |
| `src/lib/products.ts` | The product catalogue — single source of truth for all parts |
| `src/lib/firebase*.ts` | Optional Firebase persistence |
| `public/products/` | Product images |

## The catalogue

All products live in `src/lib/products.ts`. Each part has an `id`, `title`, `price`, `category`, `image`, `description`, `rating` and `stock`. Add or edit a product there and it appears across the shop, product detail, cart and dashboard automatically.

Product images are in `public/products/` and referenced by the `image` field. Drop in a replacement image at the same path to swap the artwork for a part.

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
