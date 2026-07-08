import { NextRequest, NextResponse } from "next/server";
import {
  getRecentlyViewed,
  addRecentlyViewed,
  clearRecentlyViewed,
  OrderItem,
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

    // Get limit from query params (default 10)
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

    const recentItems = await getRecentlyViewed(userId, limit);
    return NextResponse.json(recentItems);
  } catch (error) {
    console.error("Error fetching recently viewed:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently viewed items" },
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
      case "addViewed":
        await addRecentlyViewed(userId, data as OrderItem);
        result = await getRecentlyViewed(userId, 10);
        break;

      case "clearViewed":
        await clearRecentlyViewed(userId);
        result = [];
        break;

      default:
        return NextResponse.json(
          { error: "Unknown action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error processing recently viewed:", error);
    return NextResponse.json(
      { error: "Failed to process recently viewed" },
      { status: 500 }
    );
  }
}
