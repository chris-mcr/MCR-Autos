"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import CartButton from "@/components/CartButton";
import { getProduct, type Product as Item } from "@/lib/products";

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [user, setUser] = useState(null);
  const [item, setItem] = useState<Item | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [cartAdded, setCartAdded] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // Find the product
    const product = getProduct(productId);
    if (product) {
      setItem(product);
      trackItemView(product);
      checkIfFavorited(product.id);
    } else {
      router.push("/shop");
    }
  }, [productId, router]);

  const trackItemView = async (product: Item) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const { id: userId } = JSON.parse(userData);
      await fetch("/api/items/recent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          action: "addViewed",
          data: product,
          userId,
        }),
      });
    } catch (error) {
      console.error("Error tracking item view:", error);
    }
  };

  const checkIfFavorited = async (itemId: string) => {
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const { id: userId } = JSON.parse(userData);
      const response = await fetch("/api/items/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          action: "checkFavorite",
          data: { id: itemId },
          userId,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setIsFavorited(result.data);
      }
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!item) return;

    setFavoriteLoading(true);
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const { id: userId } = JSON.parse(userData);
      const response = await fetch("/api/items/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          action: isFavorited ? "removeFavorite" : "addFavorite",
          data: isFavorited ? { id: item.id } : item,
          userId,
        }),
      });

      if (response.ok) {
        setIsFavorited(!isFavorited);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!item) return;

    setAddingToCart(true);
    try {
      const userData = localStorage.getItem("user");
      if (!userData) return;

      const { id: userId } = JSON.parse(userData);
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({
          action: "addItem",
          data: { ...item, quantity },
          userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCartAdded(true);
        setTimeout(() => setCartAdded(false), 2000);
        // Notify CartButton to update count with cart data
        window.dispatchEvent(new CustomEvent("cartUpdated", { 
          bubbles: true,
          detail: { cart: data.cart }
        }));
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  if (!item || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <p className="font-code text-sm" style={{ color: 'var(--text-3)' }}>Loading…</p>
      </div>
    );
  }

  const rating = item.rating;
  const stock = item.stock;
  const description = item.description;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }} role="application" aria-label="Product details page">
      {/* Reuse shared Navigation */}
      <header role="banner" style={{ background: 'rgba(15,15,15,0.96)', borderBottom: '1px solid var(--edge)' }} className="sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
            data-testid="home-logo-button"
            aria-label="Go to home page"
          >
            <span className="text-lg" aria-hidden="true">🔧</span>
            <span className="font-code font-semibold tracking-widest text-sm uppercase" style={{ color: 'var(--accent)' }}>MCR</span>
            <span className="font-code text-sm" style={{ color: 'var(--text-3)' }}>autos</span>
          </button>
          <div className="flex items-center gap-4">
            <CartButton />
            <button
              onClick={handleLogout}
              data-testid="logout-button"
              aria-label="Log out of account"
              className="px-3 py-2 rounded text-sm font-medium transition-colors"
              style={{ color: 'var(--text-3)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav style={{ background: 'rgba(15,15,15,0.96)', borderBottom: '1px solid var(--edge)' }} role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            {[{ href: '/dashboard', label: 'Dashboard' }, { href: '/shop', label: 'Shop', active: true }, { href: '/account', label: 'Account' }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-4 border-b-2 text-sm font-medium transition-colors"
                style={{ borderColor: link.active ? 'var(--accent)' : 'transparent', color: link.active ? 'var(--accent)' : 'var(--text-2)' }}
                aria-label={link.label}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors hover-accent"
          style={{ color: 'var(--text-2)' }}
          aria-label="Go back to shop page"
        >
          ← Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 card p-8" role="region" aria-label="Product details">
          {/* Image column */}
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
              <Image src={item.image} alt={item.title} fill priority sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
            </div>
            <button
              onClick={handleToggleFavorite}
              disabled={favoriteLoading}
              data-testid={`favorite-button-${item.id}`}
              aria-label={`${isFavorited ? "Remove from favorites" : "Add to favorites"}: ${item.title}`}
              aria-pressed={isFavorited}
              aria-busy={favoriteLoading}
              className="w-full py-2.5 rounded text-sm font-semibold transition-all duration-200 disabled:opacity-50"
              style={isFavorited
                ? { background: 'var(--accent-dim)', border: '1px solid var(--accent)', color: 'var(--accent)' }
                : { background: 'var(--bg-overlay)', border: '1px solid var(--edge-mid)', color: 'var(--text-2)' }
              }
            >
              {isFavorited ? "♥ Remove from Favourites" : "♡ Add to Favourites"}
            </button>
          </div>

          {/* Info column */}
          <div className="flex flex-col justify-center">
            <p className="font-code text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>{item.category}</p>
            <h1 className="font-display text-4xl mb-4" style={{ color: 'var(--text-1)' }} data-testid={`product-title-${item.id}`}>
              {item.title}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex" style={{ color: '#f59e0b' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.floor(rating) ? "★" : "☆"}</span>
                ))}
              </div>
              <span className="text-sm" style={{ color: 'var(--text-2)' }}>{rating.toFixed(1)}</span>
            </div>

            <div className="mb-5 pb-5" style={{ borderBottom: '1px solid var(--edge)' }}>
              <p className="text-xs font-code uppercase tracking-wide mb-1" style={{ color: 'var(--text-3)' }}>Price</p>
              <p className="font-display text-5xl font-semibold" style={{ color: 'var(--accent)' }} data-testid={`product-price-${item.id}`}>
                £{item.price.toFixed(2)}
              </p>
            </div>

            <div className="mb-5">
              <p className="text-xs font-code uppercase tracking-wide mb-1" style={{ color: 'var(--text-3)' }}>Availability</p>
              <p className="text-sm font-semibold" style={{ color: stock > 10 ? 'var(--success)' : '#fb923c' }}>
                {stock > 10 ? `${stock} in stock` : `Only ${stock} left!`}
              </p>
            </div>

            <div className="mb-6 pb-6" style={{ borderBottom: '1px solid var(--edge)' }}>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{description}</p>
            </div>

            <div className="mb-5">
              <p className="text-xs font-code uppercase tracking-wide mb-3" style={{ color: 'var(--text-3)' }}>Quantity</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded flex items-center justify-center text-sm font-semibold transition-colors"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--edge-mid)', color: 'var(--text-2)' }}
                  data-testid="decrease-qty"
                  aria-label="Decrease quantity"
                >−</button>
                <span
                  className="w-12 text-center font-semibold font-code"
                  style={{ color: 'var(--text-1)' }}
                  data-testid="quantity-display"
                  aria-label={`Current quantity: ${quantity}`}
                  role="status"
                >{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded flex items-center justify-center text-sm font-semibold transition-colors"
                  style={{ background: 'var(--bg-overlay)', border: '1px solid var(--edge-mid)', color: 'var(--text-2)' }}
                  data-testid="increase-qty"
                  aria-label="Increase quantity"
                >+</button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || stock === 0}
              data-testid={`add-to-cart-${item.id}`}
              aria-label={`${addingToCart ? "Adding to cart" : cartAdded ? "Added to cart" : "Add"} ${item.title}, £${item.price.toFixed(2)}, quantity ${quantity}`}
              aria-busy={addingToCart}
              className="btn-amber w-full py-3 text-base mb-5 disabled:opacity-50"
              style={cartAdded ? { background: 'var(--success)' } : undefined}
            >
              {addingToCart ? "Adding…" : cartAdded ? "✓ Added to Cart" : stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Free Shipping",  detail: "On orders over £50" },
                { label: "30-Day Returns", detail: "No questions asked" },
                { label: "1 Year Warranty",detail: "Full replacement" },
                { label: "Secure Checkout",detail: "256-bit encryption" },
              ].map((f) => (
                <div key={f.label} className="p-3 rounded" style={{ background: 'var(--bg-overlay)' }}>
                  <p className="text-xs font-code uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-3)' }}>{f.label}</p>
                  <p className="text-xs" style={{ color: 'var(--text-2)' }}>{f.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
