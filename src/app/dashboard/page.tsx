"use client";

import { useEffect, useState, useCallback } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Item {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  quantity?: number;
}

interface Order {
  id: string;
  items: Item[];
  total: number;
  date: string;
  status: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [recentViewed, setRecentViewed] = useState<Item[]>([]);
  const [favorites, setFavorites] = useState<Item[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  // Filtering and sorting state
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "total-desc" | "total-asc">("date-desc");
  const [searchId, setSearchId] = useState<string>("");

  const loadDashboardData = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      // Always fetch fresh data
      const [recentRes, favRes, ordersRes] = await Promise.all([
        fetch(`/api/items/recent?userId=${userId}`),
        fetch(`/api/items/favorites?userId=${userId}`),
        fetch(`/api/orders?userId=${userId}`),
      ]);

      const recentData = recentRes.ok ? await recentRes.json() : [];
      const favData = favRes.ok ? await favRes.json() : [];
      const ordersData = ordersRes.ok ? await ordersRes.json() : [];

      setRecentViewed(recentData);
      setFavorites(favData);
      setOrders(ordersData);
    } catch (err) {
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = localStorage.getItem("user");
        if (!userData) {
          router.push("/login");
          return;
        }

        const user = JSON.parse(userData);
        setUser(user);
        await loadDashboardData(user.id);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      }
    };

    checkAuth();

    // Auto-refresh when page comes into focus
    const handleFocus = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        loadDashboardData(user.id);
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [router, loadDashboardData]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    router.push("/");
  };

  const handleRemoveFavorite = async (itemId: string) => {
    try {
      if (!user) return;

      const response = await fetch("/api/items/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({
          action: "removeFavorite",
          data: { id: itemId },
          userId: user.id,
        }),
      });

      if (response.ok) {
        // Remove from local state
        setFavorites(favorites.filter((item) => item.id !== itemId));
      }
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  const calculateTotalItems = (items: Item[]): number => {
    return items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;
  };

  // Filter and sort orders
  const getFilteredAndSortedOrders = (): Order[] => {
    let filtered = orders;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Apply search filter
    if (searchId.trim()) {
      filtered = filtered.filter((order) =>
        order.id.substring(6, 16).toUpperCase().includes(searchId.toUpperCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered];
    switch (sortBy) {
      case "date-desc":
        sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "date-asc":
        sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "total-desc":
        sorted.sort((a, b) => b.total - a.total);
        break;
      case "total-asc":
        sorted.sort((a, b) => a.total - b.total);
        break;
    }

    return sorted;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-base)' }}>
        <p className="font-code text-sm" style={{ color: 'var(--text-3)' }}>Loading…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const fieldCls = "field";
  const labelCls = "block text-xs font-code uppercase tracking-wide mb-2";

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }} role="application" aria-label="Dashboard page">
      <Navigation currentPage="dashboard" showCart={true} user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Orders */}
        <section className="mb-14" role="region" aria-label="Order history">
          <div className="mb-5">
            <h2 className="font-display text-2xl" style={{ color: 'var(--text-1)' }}>Order History</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>Your recent purchases and order status</p>
          </div>

          {orders.length > 0 && (
            <div className="mb-5 flex flex-col sm:flex-row gap-4 p-4 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--edge)' }}>
              <div className="flex-1">
                <label htmlFor="search-order-id" className={labelCls} style={{ color: 'var(--text-3)' }}>Search Order ID</label>
                <input
                  id="search-order-id"
                  type="text"
                  data-testid="search-order-id"
                  placeholder="Search by order number..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className={fieldCls}
                  aria-label="Search orders by ID"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="status-filter" className={labelCls} style={{ color: 'var(--text-3)' }}>Filter by Status</label>
                <select
                  id="status-filter"
                  data-testid="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={fieldCls}
                  aria-label="Filter orders by status"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div className="flex-1">
                <label htmlFor="sort-by" className={labelCls} style={{ color: 'var(--text-3)' }}>Sort By</label>
                <select
                  id="sort-by"
                  data-testid="sort-by"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className={fieldCls}
                  aria-label="Sort orders"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="total-desc">Highest Total</option>
                  <option value="total-asc">Lowest Total</option>
                </select>
              </div>
              <button
                onClick={() => { setStatusFilter("all"); setSearchId(""); setSortBy("date-desc"); }}
                data-testid="clear-filters"
                aria-label="Clear all filters"
                className="btn-ghost self-end"
              >
                Clear
              </button>
            </div>
          )}

          <div
            data-testid="orders-container"
            className="card overflow-hidden"
            role="table"
            aria-label="Order list"
          >
            {orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full" role="table">
                  <thead role="rowgroup">
                    <tr style={{ borderBottom: '1px solid var(--edge)', background: 'var(--bg-overlay)' }} role="row">
                      {["Order ID","Date","Items","Total","Status","Details"].map((h, i) => (
                        <th key={h} className={`px-6 py-3 text-xs font-code uppercase tracking-wide ${i === 5 ? 'text-center' : 'text-left'}`} style={{ color: 'var(--text-3)' }} role="columnheader">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody role="rowgroup">
                    {getFilteredAndSortedOrders().map((order) => (
                      <React.Fragment key={order.id}>
                        <tr className="transition-colors" style={{ borderBottom: '1px solid var(--edge)' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-overlay)')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td className="px-6 py-4 text-sm font-code" style={{ color: 'var(--text-1)' }}>#{order.id.substring(6, 16).toUpperCase()}</td>
                          <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-2)' }}>{new Date(order.date).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-2)' }}>{calculateTotalItems(order.items)} item{calculateTotalItems(order.items) !== 1 ? 's' : ''}</td>
                          <td className="px-6 py-4 text-sm font-semibold font-code" style={{ color: 'var(--accent)' }}>£{order.total.toFixed(2)}</td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              data-testid={`order-status-${order.id}`}
                              className={`px-2.5 py-1 rounded text-xs font-semibold font-code inline-block ${
                                order.status === "delivered"  ? "bg-green-900/30 text-green-300 border border-green-800"
                                : order.status === "pending"   ? "bg-yellow-900/30 text-yellow-300 border border-yellow-800"
                                : order.status === "processing"? "bg-pink-900/30 text-pink-300 border border-pink-800"
                                : "bg-purple-900/30 text-purple-300 border border-purple-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                              data-testid={`expand-order-${order.id}`}
                              aria-label={`${expandedOrderId === order.id ? 'Collapse' : 'Expand'} order ${order.id.substring(6, 16).toUpperCase()} details`}
                              aria-expanded={expandedOrderId === order.id}
                              className="text-sm font-medium transition-colors"
                              style={{ color: 'var(--accent)' }}
                            >
                              {expandedOrderId === order.id ? '▼' : '▶'}
                            </button>
                          </td>
                        </tr>
                        {expandedOrderId === order.id && (
                          <tr style={{ background: 'var(--bg-overlay)', borderBottom: '1px solid var(--edge)' }}>
                            <td colSpan={6} className="px-6 py-4">
                              <p className="text-xs font-code uppercase tracking-wide mb-3" style={{ color: 'var(--text-3)' }}>Order Items</p>
                              <div className="space-y-2">
                                {order.items && order.items.length > 0 ? order.items.map((item) => (
                                  <div key={item.id} className="flex justify-between items-center p-3 rounded text-sm" style={{ background: 'var(--bg-surface)' }}>
                                    <div className="flex items-center gap-3">
                                      <img src={item.image} alt={item.title} className="w-8 h-8 rounded object-cover" style={{ background: 'var(--bg-overlay)' }} />
                                      <div>
                                        <p className="font-medium" style={{ color: 'var(--text-1)' }}>{item.title}</p>
                                        <p className="text-xs font-code" style={{ color: 'var(--text-3)' }}>{item.category}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p style={{ color: 'var(--text-2)' }}>×{item.quantity || 1}</p>
                                      <p className="font-semibold font-code" style={{ color: 'var(--accent)' }}>£{(item.price * (item.quantity || 1)).toFixed(2)}</p>
                                    </div>
                                  </div>
                                )) : <p className="text-sm" style={{ color: 'var(--text-3)' }}>No items in this order</p>}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 text-center">
                <p className="mb-1" style={{ color: 'var(--text-2)' }}>{orders.length === 0 ? 'No orders yet' : 'No orders match your filters'}</p>
                <p className="text-sm" style={{ color: 'var(--text-3)' }}>{orders.length === 0 ? 'Your orders will appear here after checkout' : 'Try adjusting your search or filters'}</p>
              </div>
            )}
          </div>
        </section>

        {/* Recently Viewed & Favorites */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section data-testid="recent-items-container" role="region" aria-label="Recently viewed items">
            <div className="mb-5">
              <h2 className="font-display text-2xl" style={{ color: 'var(--text-1)' }}>Recently Viewed</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>Items you&apos;ve been looking at</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recentViewed.length > 0 ? recentViewed.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push(`/product/${item.id}`)}
                  data-testid={`item-${item.id}`}
                  className="card overflow-hidden hover-border-accent transition-all hover:-translate-y-0.5 text-left cursor-pointer"
                >
                  <div className="h-32 overflow-hidden" style={{ background: 'var(--bg-overlay)' }}>
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-code uppercase tracking-wide mb-1" style={{ color: 'var(--accent)' }}>{item.category}</p>
                    <h3 className="font-semibold text-sm mb-1.5 line-clamp-2" style={{ color: 'var(--text-1)' }}>{item.title}</h3>
                    <p className="font-display text-base font-semibold" style={{ color: 'var(--accent)' }}>£{item.price.toFixed(2)}</p>
                  </div>
                </button>
              )) : (
                <div className="col-span-full py-8 text-center">
                  <p className="text-sm" style={{ color: 'var(--text-3)' }}>No recently viewed items</p>
                </div>
              )}
            </div>
          </section>

          <section role="region" aria-label="Favorite items">
            <div className="mb-5">
              <h2 className="font-display text-2xl" style={{ color: 'var(--text-1)' }}>Favourites</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-2)' }}>Your saved items</p>
            </div>
            <div data-testid="favorites-container" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {favorites.length > 0 ? favorites.map((item) => (
                <div
                  key={item.id}
                  data-testid={`favorite-${item.id}`}
                  className="relative card overflow-hidden hover-border-accent transition-all"
                >
                  <button onClick={() => router.push(`/product/${item.id}`)} className="absolute inset-0 z-0 cursor-pointer" data-testid={`favorite-card-${item.id}`} />
                  <div className="h-32 overflow-hidden relative" style={{ background: 'var(--bg-overlay)' }}>
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRemoveFavorite(item.id); }}
                      data-testid={`remove-favorite-${item.id}`}
                      aria-label={`Remove ${item.title} from favorites`}
                      className="absolute top-2 right-2 text-lg p-1.5 rounded-full transition-all cursor-pointer z-10"
                      style={{ background: 'var(--bg-surface)', color: 'var(--accent)' }}
                    >
                      ♥
                    </button>
                  </div>
                  <div className="p-4 pointer-events-none">
                    <p className="text-xs font-code uppercase tracking-wide mb-1" style={{ color: 'var(--accent)' }}>{item.category}</p>
                    <h3 className="font-semibold text-sm mb-1.5 line-clamp-2" style={{ color: 'var(--text-1)' }}>{item.title}</h3>
                    <p className="font-display text-base font-semibold" style={{ color: 'var(--accent)' }}>£{item.price.toFixed(2)}</p>
                  </div>
                </div>
              )) : (
                <div className="col-span-full py-8 text-center">
                  <p className="text-sm" style={{ color: 'var(--text-3)' }}>No favourite items yet</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
