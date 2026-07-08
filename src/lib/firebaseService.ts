// Firebase Service Layer
// Handles all Firebase database operations for orders and cart

import { database } from './firebase';
import {
  ref,
  get,
  set,
  update,
  remove,
  child,
} from 'firebase/database';

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

// ============================================================================
// ORDERS OPERATIONS
// ============================================================================

/**
 * Get all orders for a user
 * @param userId - User ID
 * @returns Array of orders
 */
export async function getOrders(userId: string): Promise<Order[]> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${userId}/orders`));

    if (snapshot.exists()) {
      const ordersObj = snapshot.val();
      // Convert object to array and sort by newest first
      const ordersArray = Object.values(ordersObj) as Order[];
      return ordersArray.sort(
        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
      );
    }

    return [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

/**
 * Create a new order
 * @param userId - User ID
 * @param order - Order data
 * @returns Created order
 */
export async function createOrder(
  userId: string,
  order: Omit<Order, 'createdAt'>
): Promise<Order> {
  try {
    const orderWithTimestamp: Order = {
      ...order,
      userId,
      createdAt: Date.now(),
    };

    const orderRef = ref(database, `users/${userId}/orders/${order.id}`);
    await set(orderRef, orderWithTimestamp);

    return orderWithTimestamp;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Update an existing order
 * @param userId - User ID
 * @param orderId - Order ID
 * @param updates - Fields to update
 * @returns Updated order
 */
export async function updateOrder(
  userId: string,
  orderId: string,
  updates: Partial<Order>
): Promise<Order | null> {
  try {
    const orderRef = ref(database, `users/${userId}/orders/${orderId}`);
    await update(orderRef, updates);

    // Fetch and return updated order
    const snapshot = await get(orderRef);
    return snapshot.val() as Order;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
}

/**
 * Delete an order
 * @param userId - User ID
 * @param orderId - Order ID
 */
export async function deleteOrder(userId: string, orderId: string): Promise<void> {
  try {
    const orderRef = ref(database, `users/${userId}/orders/${orderId}`);
    await remove(orderRef);
  } catch (error) {
    console.error('Error deleting order:', error);
    throw error;
  }
}

/**
 * Update order status
 * @param userId - User ID
 * @param orderId - Order ID
 * @param status - New status
 */
export async function updateOrderStatus(
  userId: string,
  orderId: string,
  status: Order['status']
): Promise<void> {
  try {
    const orderRef = ref(database, `users/${userId}/orders/${orderId}/status`);
    await set(orderRef, status);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

// ============================================================================
// CART OPERATIONS
// ============================================================================

/**
 * Get user's cart
 * @param userId - User ID
 * @returns Array of cart items
 */
export async function getCart(userId: string): Promise<CartItem[]> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${userId}/cart`));

    if (snapshot.exists()) {
      const cartObj = snapshot.val();
      return Object.values(cartObj) as CartItem[];
    }

    return [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}

/**
 * Add item to cart
 * @param userId - User ID
 * @param item - Cart item
 */
export async function addCartItem(
  userId: string,
  item: CartItem
): Promise<void> {
  try {
    const cartItemRef = ref(database, `users/${userId}/cart/${item.id}`);
    const existingItem = await get(cartItemRef);

    if (existingItem.exists()) {
      // Item exists, increment quantity
      const existing = existingItem.val() as CartItem;
      await update(cartItemRef, {
        quantity: existing.quantity + (item.quantity || 1),
      });
    } else {
      // New item, add to cart
      await set(cartItemRef, {
        ...item,
        addedAt: Date.now(),
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Update cart item quantity
 * @param userId - User ID
 * @param itemId - Item ID
 * @param quantity - New quantity
 */
export async function updateCartItemQuantity(
  userId: string,
  itemId: string,
  quantity: number
): Promise<void> {
  try {
    const cartItemRef = ref(database, `users/${userId}/cart/${itemId}`);

    if (quantity <= 0) {
      // Remove if quantity is 0 or less
      await remove(cartItemRef);
    } else {
      // Update quantity
      await update(cartItemRef, { quantity });
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
}

/**
 * Remove item from cart
 * @param userId - User ID
 * @param itemId - Item ID
 */
export async function removeCartItem(userId: string, itemId: string): Promise<void> {
  try {
    const cartItemRef = ref(database, `users/${userId}/cart/${itemId}`);
    await remove(cartItemRef);
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
}

/**
 * Clear entire cart
 * @param userId - User ID
 */
export async function clearCart(userId: string): Promise<void> {
  try {
    const cartRef = ref(database, `users/${userId}/cart`);
    await remove(cartRef);
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
}

/**
 * Replace entire cart
 * @param userId - User ID
 * @param items - New cart items
 */
export async function setCart(userId: string, items: CartItem[]): Promise<void> {
  try {
    const cartRef = ref(database, `users/${userId}/cart`);
    const cartObject: { [key: string]: CartItem } = {};

    items.forEach((item) => {
      cartObject[item.id] = {
        ...item,
        addedAt: Date.now(),
      };
    });

    await set(cartRef, cartObject);
  } catch (error) {
    console.error('Error setting cart:', error);
    throw error;
  }
}

/**
 * Replace all orders (for testing)
 * @param userId - User ID
 * @param orders - New orders
 */
export async function setOrders(userId: string, orders: Order[]): Promise<void> {
  try {
    const ordersRef = ref(database, `users/${userId}/orders`);
    const ordersObject: { [key: string]: Order } = {};

    orders.forEach((order) => {
      ordersObject[order.id] = {
        ...order,
        userId,
        createdAt: Date.now(),
      };
    });

    await set(ordersRef, ordersObject);
  } catch (error) {
    console.error('Error setting orders:', error);
    throw error;
  }
}

// ============================================================================
// FAVORITES OPERATIONS
// ============================================================================

/**
 * Get user's favorite items
 * @param userId - User ID
 * @returns Array of favorite items
 */
export async function getFavorites(userId: string): Promise<OrderItem[]> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${userId}/favorites`));

    if (snapshot.exists()) {
      const favoritesObj = snapshot.val();
      return Object.values(favoritesObj) as OrderItem[];
    }

    return [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

/**
 * Add item to favorites
 * @param userId - User ID
 * @param item - Item to add
 */
export async function addFavorite(userId: string, item: OrderItem): Promise<void> {
  try {
    const favoriteRef = ref(database, `users/${userId}/favorites/${item.id}`);
    await set(favoriteRef, item);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
}

/**
 * Remove item from favorites
 * @param userId - User ID
 * @param itemId - Item ID
 */
export async function removeFavorite(userId: string, itemId: string): Promise<void> {
  try {
    const favoriteRef = ref(database, `users/${userId}/favorites/${itemId}`);
    await remove(favoriteRef);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
}

/**
 * Check if item is in favorites
 * @param userId - User ID
 * @param itemId - Item ID
 * @returns True if item is favorited
 */
export async function isFavorited(userId: string, itemId: string): Promise<boolean> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(
      child(dbRef, `users/${userId}/favorites/${itemId}`)
    );
    return snapshot.exists();
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}

// ============================================================================
// RECENTLY VIEWED OPERATIONS
// ============================================================================

/**
 * Get user's recently viewed items (sorted by most recent)
 * @param userId - User ID
 * @param limit - Maximum number of items to return (default 10)
 * @returns Array of recently viewed items
 */
export async function getRecentlyViewed(userId: string, limit: number = 10): Promise<OrderItem[]> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${userId}/recentlyViewed`));

    if (snapshot.exists()) {
      const recentObj = snapshot.val();
      // Convert to array and sort by most recent first
      const recentArray = Object.values(recentObj) as (OrderItem & { viewedAt?: number })[];
      const sorted = recentArray.sort(
        (a, b) => (b.viewedAt || 0) - (a.viewedAt || 0)
      );
      return sorted.slice(0, limit).map(({ viewedAt, ...item }) => item);
    }

    return [];
  } catch (error) {
    console.error('Error fetching recently viewed:', error);
    return [];
  }
}

/**
 * Add item to recently viewed
 * @param userId - User ID
 * @param item - Item to mark as viewed
 */
export async function addRecentlyViewed(userId: string, item: OrderItem): Promise<void> {
  try {
    const recentRef = ref(database, `users/${userId}/recentlyViewed/${item.id}`);
    await set(recentRef, {
      ...item,
      viewedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error adding to recently viewed:', error);
    throw error;
  }
}

/**
 * Clear all recently viewed items
 * @param userId - User ID
 */
export async function clearRecentlyViewed(userId: string): Promise<void> {
  try {
    const recentRef = ref(database, `users/${userId}/recentlyViewed`);
    await remove(recentRef);
  } catch (error) {
    console.error('Error clearing recently viewed:', error);
    throw error;
  }
}
