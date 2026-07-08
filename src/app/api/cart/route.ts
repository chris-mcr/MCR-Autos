import { NextRequest, NextResponse } from "next/server";
import {
  getCart,
  addCartItem,
  removeCartItem,
  updateCartItemQuantity,
  clearCart,
  setCart,
  CartItem,
} from "@/lib/firebaseService";

export async function GET(request: NextRequest) {
  try {
    // Get userId from query params or headers
    const userId = request.nextUrl.searchParams.get("userId") ||
      request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 401 }
      );
    }

    const cart = await getCart(userId);
    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, data, userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 401 }
      );
    }

    let cart: CartItem[] = [];

    switch (action) {
      case "addItem":
        await addCartItem(userId, data as CartItem);
        cart = await getCart(userId);
        break;

      case "removeItem":
        await removeCartItem(userId, data.id);
        cart = await getCart(userId);
        break;

      case "updateQuantity":
        await updateCartItemQuantity(userId, data.id, data.quantity);
        cart = await getCart(userId);
        break;

      case "clearCart":
        await clearCart(userId);
        cart = [];
        break;

      case "setCart":
        await setCart(userId, data);
        cart = await getCart(userId);
        break;

      default:
        return NextResponse.json(
          { error: "Unknown action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Error processing cart:", error);
    return NextResponse.json(
      { error: "Failed to process cart" },
      { status: 500 }
    );
  }
}
