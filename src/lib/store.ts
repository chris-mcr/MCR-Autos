// Persistence layer for orders, cart, favourites and recently-viewed.
// SQLite via Node's built-in node:sqlite, stored in .data/store.db.

import { mkdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  userId?: string;
  createdAt?: number;
}

export interface CartItem extends OrderItem {
  addedAt?: number;
}

type Collection = 'orders' | 'cart' | 'favorites' | 'recentlyViewed';

// Opened on first use, not at import: `next build` imports every route in
// parallel workers, which would otherwise fight over the file lock.
let handle: DatabaseSync | undefined;

function db(): DatabaseSync {
  if (handle) return handle;
  mkdirSync('.data', { recursive: true });
  handle = new DatabaseSync('.data/store.db');
  // ponytail: one JSON-blob table keyed like the old users/{userId}/{collection}/{id}
  // paths. Split into real tables/columns if you ever need to query across users.
  handle.exec(`CREATE TABLE IF NOT EXISTS items (
    user_id TEXT NOT NULL,
    collection TEXT NOT NULL,
    id TEXT NOT NULL,
    data TEXT NOT NULL,
    PRIMARY KEY (user_id, collection, id)
  )`);
  return handle;
}

function all<T>(userId: string, collection: Collection): T[] {
  return db()
    .prepare('SELECT data FROM items WHERE user_id = ? AND collection = ? ORDER BY rowid')
    .all(userId, collection)
    .map((row) => JSON.parse(row.data as string) as T);
}

function one<T>(userId: string, collection: Collection, id: string): T | null {
  const row = db()
    .prepare('SELECT data FROM items WHERE user_id = ? AND collection = ? AND id = ?')
    .get(userId, collection, id);
  return row ? (JSON.parse(row.data as string) as T) : null;
}

function put(userId: string, collection: Collection, id: string, value: unknown): void {
  db().prepare(
    `INSERT INTO items (user_id, collection, id, data) VALUES (?, ?, ?, ?)
     ON CONFLICT (user_id, collection, id) DO UPDATE SET data = excluded.data`
  ).run(userId, collection, id, JSON.stringify(value));
}

function del(userId: string, collection: Collection, id: string): void {
  db().prepare('DELETE FROM items WHERE user_id = ? AND collection = ? AND id = ?').run(
    userId,
    collection,
    id
  );
}

function clear(userId: string, collection: Collection): void {
  db().prepare('DELETE FROM items WHERE user_id = ? AND collection = ?').run(userId, collection);
}

// ============================================================================
// ORDERS OPERATIONS
// ============================================================================

/** Get all orders for a user, newest first */
export async function getOrders(userId: string): Promise<Order[]> {
  return all<Order>(userId, 'orders').sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

export async function createOrder(userId: string, order: Omit<Order, 'createdAt'>): Promise<Order> {
  const orderWithTimestamp: Order = { ...order, userId, createdAt: Date.now() };
  put(userId, 'orders', order.id, orderWithTimestamp);
  return orderWithTimestamp;
}

export async function updateOrder(
  userId: string,
  orderId: string,
  updates: Partial<Order>
): Promise<Order | null> {
  const existing = one<Order>(userId, 'orders', orderId);
  if (!existing) return null;
  const updated = { ...existing, ...updates };
  put(userId, 'orders', orderId, updated);
  return updated;
}

export async function updateOrderStatus(
  userId: string,
  orderId: string,
  status: Order['status']
): Promise<void> {
  await updateOrder(userId, orderId, { status });
}

/** Replace all orders (for testing) */
export async function setOrders(userId: string, orders: Order[]): Promise<void> {
  clear(userId, 'orders');
  orders.forEach((order) =>
    put(userId, 'orders', order.id, { ...order, userId, createdAt: Date.now() })
  );
}

// ============================================================================
// CART OPERATIONS
// ============================================================================

export async function getCart(userId: string): Promise<CartItem[]> {
  return all<CartItem>(userId, 'cart');
}

/** Add item to cart, incrementing quantity if it is already there */
export async function addCartItem(userId: string, item: CartItem): Promise<void> {
  const existing = one<CartItem>(userId, 'cart', item.id);
  put(
    userId,
    'cart',
    item.id,
    existing
      ? { ...existing, quantity: existing.quantity + (item.quantity || 1) }
      : { ...item, addedAt: Date.now() }
  );
}

/** Update cart item quantity; removes the item if quantity is 0 or less */
export async function updateCartItemQuantity(
  userId: string,
  itemId: string,
  quantity: number
): Promise<void> {
  const existing = one<CartItem>(userId, 'cart', itemId);
  if (quantity <= 0) del(userId, 'cart', itemId);
  else if (existing) put(userId, 'cart', itemId, { ...existing, quantity });
}

export async function removeCartItem(userId: string, itemId: string): Promise<void> {
  del(userId, 'cart', itemId);
}

export async function clearCart(userId: string): Promise<void> {
  clear(userId, 'cart');
}

/** Replace entire cart */
export async function setCart(userId: string, items: CartItem[]): Promise<void> {
  clear(userId, 'cart');
  items.forEach((item) => put(userId, 'cart', item.id, { ...item, addedAt: Date.now() }));
}

// ============================================================================
// FAVORITES OPERATIONS
// ============================================================================

export async function getFavorites(userId: string): Promise<OrderItem[]> {
  return all<OrderItem>(userId, 'favorites');
}

export async function addFavorite(userId: string, item: OrderItem): Promise<void> {
  put(userId, 'favorites', item.id, item);
}

export async function removeFavorite(userId: string, itemId: string): Promise<void> {
  del(userId, 'favorites', itemId);
}

export async function isFavorited(userId: string, itemId: string): Promise<boolean> {
  return one(userId, 'favorites', itemId) !== null;
}

// ============================================================================
// RECENTLY VIEWED OPERATIONS
// ============================================================================

/** Get user's recently viewed items, most recent first */
export async function getRecentlyViewed(userId: string, limit: number = 10): Promise<OrderItem[]> {
  return all<OrderItem & { viewedAt?: number }>(userId, 'recentlyViewed')
    .sort((a, b) => (b.viewedAt || 0) - (a.viewedAt || 0))
    .slice(0, limit)
    .map(({ viewedAt: _viewedAt, ...item }) => item);
}

export async function addRecentlyViewed(userId: string, item: OrderItem): Promise<void> {
  put(userId, 'recentlyViewed', item.id, { ...item, viewedAt: Date.now() });
}

export async function clearRecentlyViewed(userId: string): Promise<void> {
  clear(userId, 'recentlyViewed');
}
