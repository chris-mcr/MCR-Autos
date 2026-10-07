# Skill: add a component

1. Create `src/components/<Name>.tsx`, PascalCase filename matching the component name.
2. Default export the component. Type its props with an explicit interface (`Props`, or `<Name>Props` like `NavigationProps`).
3. Import shared types via the `@/` alias — never redeclare them (`import type { Product } from "@/lib/products"`, `import type { CartItem } from "@/lib/store"`).
4. Add `"use client"` only if it uses state, effects or event handlers.
5. Components never touch the database or `@/lib/store` directly. For user data (cart, orders, favourites), `fetch` the matching `/api/*` route with the user's id in the `x-user-id` header.
6. Style with Tailwind utility classes plus the CSS variables from `globals.css` (`var(--bg-surface)`, `var(--edge)`, `var(--accent)`, `var(--text-1/2/3)`). The UI is dark, so don't use light-theme colours.
7. Icons come from the `Icon` component; to add one, add a key to the `icons` record in `src/components/Icon.tsx`.
8. Add a `data-testid` to anything a test would click or read.

Example:
```tsx
"use client";
import type { Product } from "@/lib/products";

interface Props { product: Product; onAdd: (id: string) => void }

export default function ProductCard({ product, onAdd }: Props) {
  return (
    <div className="rounded-lg p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--edge)" }}>
      <h3 className="font-semibold" style={{ color: "var(--text-1)" }}>{product.title}</h3>
      <p className="text-sm" style={{ color: "var(--text-2)" }}>£{product.price.toFixed(2)}</p>
      <button
        data-testid={`add-to-cart-${product.id}`}
        onClick={() => onAdd(product.id)}
        className="mt-2 text-sm font-medium"
        style={{ color: "var(--accent)" }}
      >
        Add to cart
      </button>
    </div>
  );
}
```
