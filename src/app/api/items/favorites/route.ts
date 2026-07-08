import { NextRequest, NextResponse } from "next/server";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorited,
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

    const favorites = await getFavorites(userId);
    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
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
      case "addFavorite":
        await addFavorite(userId, data as OrderItem);
        result = await getFavorites(userId);
        break;

      case "removeFavorite":
        await removeFavorite(userId, data.id);
        result = await getFavorites(userId);
        break;

      case "checkFavorite":
        result = await isFavorited(userId, data.id);
        break;

      default:
        return NextResponse.json(
          { error: "Unknown action" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error processing favorite:", error);
    return NextResponse.json(
      { error: "Failed to process favorite" },
      { status: 500 }
    );
  }
}
