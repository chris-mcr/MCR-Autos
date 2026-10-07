# Skill: Next.js 15 best practices

App Router (Next 15, React 19). Apply these when writing or refactoring — but respect this app's existing patterns over generic advice.

## Server vs client components
- Components are **server components by default**. Only add `"use client"` when the file uses hooks (`useState`/`useEffect`), event handlers, or browser APIs (`localStorage`, `window`).
- A common smell here: `"use client"` on a component that only renders props and has no interactivity — drop it so it can render on the server.
- Keep `"use client"` at the leaves. Don't mark a whole page client just because one button needs it — split the interactive bit into its own client component.

## Data & rendering
- Prefer fetching in server components (`async` function components, `await` directly) over `useEffect` + `fetch` where the data isn't user-session-specific. The product catalog (`lib/products.ts`) is static — render it on the server.
- User-session data here is gated on `localStorage`, which is client-only — those pages must stay client components. Don't try to move localStorage auth to the server; flag it as tech debt instead (see the `security-review` skill).

## Hygiene
- Use the `@/` alias, not deep relative imports.
- Type props with an explicit interface; import shared types from `lib/`, never redeclare.
- Run `npm run lint` and `npm run build` after non-trivial changes — App Router surfaces server/client boundary errors at build time, not in the editor.
- Don't add dependencies for what a few lines do. This app is deliberately lean.

When refactoring, change the smallest thing that fixes the issue and explain why in one line.
