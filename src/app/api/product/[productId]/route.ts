import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Product from "@/model/product";

export async function GET(
  request: Request,
  { params }: { params: Promise <{ productId: string }> }
) : Promise < NextResponse > {
  await dbConnect();

  const { productId } = await params;
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ message: "Invalid product ID." }, { status: 400 });
  }

  try {
    const product = await Product.findById(productId)
      .lean();
    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch product", error },
      { status: 500 }
    );
  }
}

/**
 * API Documentation:
 *
 * GET /api/product/[id]
 * - Description: Fetches a single product by its ID.
 * - Path Parameter:
 *   - id: ProductObjectId
 * - Response:
 *   - 200: Returns the product document.
 *   - 400: Returns an error if the product ID is invalid.
 *   - 404: Returns an error if the product is not found.
 *   - 500: Returns an error if fetching fails.
 */