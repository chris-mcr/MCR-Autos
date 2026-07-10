"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import { products, categories, type Product as Item } from "@/lib/products";

export default function ShopPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loadingFavorites, setLoadingFavorites] = useState<Set<string>>(new Set());
  const isLoadingFavoritesRef = useRef(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));
    loadFavorites();
  }, [router]);

  const loadFavorites = async () => {
    if (isLoadingFavoritesRef.current) return;
    try {
      isLoadingFavoritesRef.current = true;
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const { id: userId } = JSON.parse(userData);
      const response = await fetch("/api/items/favorites", {
        headers: { "x-user-id": userId },
      });
      if (response.ok) {
        const favoriteItems = await response.json();
        const favoriteIds = new Set<string>(favoriteItems.map((item: any) => item.id));
        setFavorites(favoriteIds);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      isLoadingFavoritesRef.current = false;
    }
  };

  const handleAddToCart = async (item: Item) => {
    setAddingToCart(item.id);
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const { id: userId } = JSON.parse(userData);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ action: "addItem", data: { ...item, quantity: 1 }, userId }),
      });
      if (response.ok) {
        const data = await response.json();
        window.dispatchEvent(new CustomEvent("cartUpdated", { bubbles: true, detail: { cart: data.cart } }));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(null);
    }
  };

  const handleToggleFavorite = async (item: Item) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;
      const { id: userId } = JSON.parse(userData);
      const isFavorited = favorites.has(item.id);
      setLoadingFavorites((prev) => new Set(prev).add(item.id));
      const response = await fetch("/api/items/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-user-id": userId },
        body: JSON.stringify({
          action: isFavorited ? "removeFavorite" : "addFavorite",
          data: isFavorited ? { id: item.id } : item,
          userId,
        }),
      });
      if (response.ok) {
        const newFavorites = new Set(favorites);
        if (isFavorited) {
          newFavorites.delete(item.id);
        } else {
          newFavorites.add(item.id);
        }
        setFavorites(newFavorites);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setLoadingFavorites((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const filteredItems = products.filter((item: Item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }} role="application" aria-label="Shop page">
      <Navigation currentPage="shop" showCart={true} user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search and filters */}
        <div className="mb-8 space-y-5">
          <div>
            <label htmlFor="product-search" className="block text-xs font-code uppercase tracking-wide mb-2" style={{ color: 'var(--text-3)' }}>
              Search
            </label>
            <input
              id="product-search"
              type="text"
              placeholder="Search products…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="search-input"
              className="field max-w-md"
              aria-label="Search products by name"
              title="Search products by name"
              role="searchbox"
            />
          </div>

          <div>
            <fieldset role="group" aria-label="Filter products by category">
              <legend className="block text-xs font-code uppercase tracking-wide mb-3" style={{ color: 'var(--text-3)' }}>
                Category
              </legend>
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      data-testid={`filter-${category}`}
                      aria-pressed={isActive}
                      aria-label={`Filter by ${category}${isActive ? ', currently selected' : ''}`}
                      className="px-3 py-1.5 rounded text-xs font-code font-semibold uppercase tracking-wider transition-all duration-150"
                      style={{
                        background: isActive ? 'var(--accent)' : 'var(--bg-overlay)',
                        color: isActive ? '#ffffff' : 'var(--text-2)',
                        border: `1px solid ${isActive ? 'var(--accent)' : 'var(--edge-mid)'}`,
                      }}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </div>

        {/* Result count */}
        <div className="mb-5">
          <p className="text-xs font-code" style={{ color: 'var(--text-3)' }}>
            {filteredItems.length > 0 ? (
              <>{filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''}</>
            ) : (
              'No products found'
            )}
          </p>
        </div>

        {/* Products grid */}
        <div
          data-testid="products-grid"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          role="region"
          aria-label="Product list"
          aria-live="polite"
          aria-atomic="false"
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, i) => (
              <div
                key={item.id}
                data-testid={`product-${item.id}`}
                className={`card overflow-hidden group anim-fade-up anim-d${Math.min(i + 1, 7)}`}
                style={{ transition: 'border-color 0.2s ease, box-shadow 0.2s ease' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--edge-mid)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(0,0,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--edge)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <Link href={`/product/${item.id}`}>
                  {/* Product image area */}
                  <div
                    className="h-44 flex items-center justify-center relative overflow-hidden"
                    style={{ background: 'var(--bg-overlay)' }}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    {/* Favorite button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleToggleFavorite(item);
                      }}
                      disabled={loadingFavorites.has(item.id)}
                      data-testid={`favorite-button-${item.id}`}
                      aria-label={`${favorites.has(item.id) ? "Remove from favorites" : "Add to favorites"}: ${item.title}`}
                      aria-pressed={favorites.has(item.id)}
                      aria-busy={loadingFavorites.has(item.id)}
                      title={favorites.has(item.id) ? `Remove ${item.title} from favorites` : `Add ${item.title} to favorites`}
                      className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-150 disabled:opacity-40"
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--edge-mid)',
                        color: favorites.has(item.id) ? 'var(--accent)' : 'var(--text-3)',
                      }}
                    >
                      <span aria-hidden="true">{favorites.has(item.id) ? "♥" : "♡"}</span>
                    </button>
                  </div>

                  {/* Product info */}
                  <div className="p-4">
                    <p className="font-code text-xs uppercase tracking-wider mb-1.5" style={{ color: 'var(--accent)' }}>
                      {item.category}
                    </p>
                    <h3
                      data-testid={`product-title-${item.id}`}
                      className="text-sm font-semibold leading-snug mb-4 line-clamp-2"
                      style={{ color: 'var(--text-1)' }}
                    >
                      {item.title}
                    </h3>
                    <div className="flex items-center justify-between gap-2">
                      <p
                        data-testid={`product-price-${item.id}`}
                        className="font-display text-lg font-semibold"
                        style={{ color: 'var(--accent)' }}
                      >
                        £{item.price.toFixed(2)}
                      </p>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(item);
                        }}
                        disabled={addingToCart === item.id}
                        data-testid={`add-to-cart-${item.id}`}
                        aria-label={`Add ${item.title} to cart, £${item.price.toFixed(2)}`}
                        aria-busy={addingToCart === item.id}
                        title={`Add ${item.title} to cart — £${item.price.toFixed(2)}`}
                        className="text-xs font-semibold font-code px-3 py-1.5 rounded transition-all duration-150 disabled:opacity-40"
                        style={{
                          background: addingToCart === item.id ? 'var(--bg-overlay)' : 'var(--accent)',
                          color: addingToCart === item.id ? 'var(--text-3)' : '#ffffff',
                          border: `1px solid ${addingToCart === item.id ? 'var(--edge-mid)' : 'var(--accent)'}`,
                        }}
                      >
                        {addingToCart === item.id ? "Adding…" : "Add"}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="font-display text-2xl mb-2" style={{ color: 'var(--text-3)' }}>No products match your search</p>
              <p className="text-sm font-code" style={{ color: 'var(--text-3)' }}>Try a different term or category</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
