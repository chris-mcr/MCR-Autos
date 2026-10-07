# Skill: add a page

1. Create `src/app/<route>/page.tsx`. Default export a React component named after the route.
2. Add `"use client"` at the top if it uses hooks/state/events (most pages here do).
3. Use the `@/` import alias (e.g. `import Navigation from "@/components/Navigation"`).
4. Render `<Navigation currentPage="..." showCart={true} user={user} onLogout={handleLogout} />` at the top. If the page belongs in the nav, add an entry to `navLinks` (`{ href, label, show, testId }`) **and** add the name to the `currentPage` union, both in `src/components/Navigation.tsx`.
5. **Public or user-only?** Browsing pages (`/shop`, `/product/[id]`) are public: read `localStorage.getItem("user")` in a `useEffect` and just set the user if present. User-only pages (`/cart`, `/account`, `/dashboard`) `router.push("/login")` when it's absent — copy the pattern from `src/app/account/page.tsx`.
6. Style with Tailwind plus the CSS variables in `globals.css` (`var(--bg-base)`, `var(--accent)`, `var(--text-2)` …). The UI is dark.
7. Give interactive elements a `data-testid` so e2e tests can find them.

Example skeleton (a user-only page):
```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

interface User { id: string; name: string; email: string }

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) { router.push("/login"); return; }
    setUser(JSON.parse(userData));
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Navigation currentPage="account" showCart={true} user={user} />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text-1)" }}>Settings</h1>
      </main>
    </div>
  );
}
```
