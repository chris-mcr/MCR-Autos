# Skill: add or edit a product (the catalogue)

The catalogue is a static array in `src/lib/products.ts` — the single source of truth. Add or edit an entry there and it flows to shop, product detail, cart, and dashboard automatically. There is no product database and no API call to make.

## Add a product
1. Add an object to the `products` array in `src/lib/products.ts`. Every field of the `Product` type is required:
   ```ts
   {
     id: "item-17",                        // unique; follow the "item-N" pattern (check the last id first)
     title: "Rear Wiper Blade",
     price: 12.99,                          // number, GBP
     category: "Exterior",                  // must be one of `categories` (minus "All")
     image: "/parts-images/wiperblade.webp",// path under public/, see below
     description: "…",
     rating: 4.5,                           // 0–5
     stock: 120,
   }
   ```
2. **`category` must already exist** in the `categories` array at the top of the file (Brakes, Filters, Engine, Electrical, Suspension, Exterior), or the shop's category filter won't show it. Adding a genuinely new category = add the string to `categories` too.
3. **Add the image.** Drop the file into `public/parts-images/` (they're `.webp` here) and point `image` at `/parts-images/<file>.webp`. Rendered with `next/image` — no code change to swap artwork, just replace the file or repoint the field.
4. `id` must be unique — `getProduct(id)` and the cart key on it.

## Edit a product
Change the object in place. To swap only the photo, replace the file at the same `image` path or repoint `image` — nothing else to touch.

## Vehicles (the home-page part finder)
Make/model options come from `src/lib/vehicles.ts`, not `products.ts`. Add a make or models by editing the `vehicles` record (`makes` and `modelsFor(make)` derive from it). It's independent of the catalogue — adding a vehicle doesn't add parts.

## Don't
- Don't add a fetch, route or database call for catalogue data — it's static, imported directly.
- Don't redeclare the `Product` type; import it (`import type { Product } from "@/lib/products"`).
