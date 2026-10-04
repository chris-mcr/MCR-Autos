import { NextRequest, NextResponse } from "next/server";
import {
  getOrders,
  createOrder,
  updateOrder,
  updateOrderStatus,
  setOrders,
  Order,
} from "@/lib/store";

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

    const orders = await getOrders(userId);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
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

    let result: any;

    switch (action) {
      case "addOrder":
        result = await createOrder(userId, data as Order);
        break;

      case "updateOrder":
        result = await updateOrder(userId, data.id, data);
        break;

      case "updateOrderStatus":
        await updateOrderStatus(userId, data.id, data.status);
        const updatedOrders = await getOrders(userId);
        result = updatedOrders;
        break;

      case "setOrders":
        await setOrders(userId, data);
        result = await getOrders(userId);
        break;

      default:
        return NextResponse.json(
          { error: "Unknown action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    );
  }
}
