"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";

export default function CartButton() {
  const [cartCount, setCartCount] = useState(0);
  const isLoadingRef = useRef(false);
  const pathname = usePathname();

  const updateCartCount = useCallback((cartItems: any[]) => {
    const count = cartItems.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );
    setCartCount(count);
  }, []);

  const loadCartCount = useCallback(async () => {
    // Skip if a request is already in progress
    if (isLoadingRef.current) {
      return;
    }

    try {
      isLoadingRef.current = true;
      const userData = localStorage.getItem("user");
      if (!userData) {
        return;
      }

      const { id: userId } = JSON.parse(userData);
      const response = await fetch("/api/cart", {
        headers: { "x-user-id": userId },
      });
      if (response.ok) {
        const cartItems = await response.json();
        updateCartCount(cartItems);
      }
    } catch (error) {
      console.error("Error loading cart count:", error);
    } finally {
      isLoadingRef.current = false;
    }
  }, [updateCartCount]);

  useEffect(() => {
    // Listen for custom cart update event - can include cart data to avoid extra request
    const handleCartUpdated = (event: Event) => {
      const customEvent = event as CustomEvent;
      // If cart data is provided in the event, use it directly
      if (customEvent.detail?.cart) {
        updateCartCount(customEvent.detail.cart);
      } else {
        // Otherwise, fetch from API
        loadCartCount();
      }
    };
    
    window.addEventListener("storage", loadCartCount);
    window.addEventListener("cartUpdated", handleCartUpdated);
    
    // On cart page, skip initial load - the cart page will dispatch the event with cart data
    // On other pages, load immediately
    if (pathname !== "/cart") {
      loadCartCount();
    }
    
    return () => {
      window.removeEventListener("storage", loadCartCount);
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, [loadCartCount, updateCartCount, pathname]);

  return (
    <Link
      href="/cart"
      data-testid="cart-link"
      className="relative flex items-center gap-2 transition-opacity hover:opacity-70"
      onClick={() => loadCartCount()}
    >
      <span className="text-xl">🛒</span>
      {cartCount > 0 && (
        <span
          data-testid="cart-count"
          className={`absolute -top-1 -right-1 text-xs font-bold font-code rounded-full flex items-center justify-center ${
            cartCount > 9 ? "px-1.5 min-w-[1.75rem] h-5" : "w-5 h-5"
          }`}
          style={{ background: 'var(--accent)', color: '#ffffff' }}
        >
          {cartCount > 9 ? "9+" : cartCount}
        </span>
      )}
    </Link>
  );
}
