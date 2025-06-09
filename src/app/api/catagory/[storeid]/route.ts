import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Category from "@/model/catagory";
import Store from "@/model/store";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ storeid: string }> }
): Promise<NextResponse> {
  await dbConnect();

  const { storeid } = await params;

  // Validate storeid
  if (!storeid || !mongoose.Types.ObjectId.isValid(storeid)) {
    return NextResponse.json({ message: "Invalid store ID." }, { status: 400 });
  }

  // Check if store exists
  const storeExists = await Store.findById(storeid);
  if (!storeExists) {
    return NextResponse.json({ message: "Store not found." }, { status: 404 });
  }

  // Fetch categories for the store, selecting only necessary fields
  try {
    const categories = await Category.find({ store: storeid })
      .select("_id name slug description featured parent")
      .lean();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch categories", error },
      { status: 500 }
    );
  }
}

/**
 * API Documentation:
 *
 * GET /api/category/[storeid]
 * - Description: Fetches all categories for a specific store.
 * - Path Parameter:
 *   - storeid: The ObjectId of the store.
 * - Response:
 *   - 200: Returns an array of category documents (only _id, name, slug, description, featured, parent).
 *   - 400: Returns an error if the store ID is invalid.
 *   - 404: Returns an error if the store does not exist.
 *   - 500: Returns an error if fetching fails.
 */