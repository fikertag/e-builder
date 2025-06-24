import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Product from "@/model/product";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
): Promise<NextResponse> {
  await dbConnect();

  const { productId } = await params;
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { message: "Invalid product ID." },
      { status: 400 }
    );
  }

  try {
    const product = await Product.findById(productId)
      .populate({ path: "categories", select: "name" })
      .lean();
    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }
    // Prepare response with categories as string[]
    let categories: string[] = [];
    if (Array.isArray(product.categories)) {
      categories = product.categories
        .map((cat) =>
          typeof cat === "object" && cat && "name" in cat
            ? cat.name
            : String(cat)
        )
        .filter((name): name is string => typeof name === "string");
    }
    return NextResponse.json({ ...product, categories }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch product", error },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
): Promise<NextResponse> {
  await dbConnect();
  const { productId } = await params;
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json(
      { message: "Invalid product ID." },
      { status: 400 }
    );
  }
  try {
    const body = await request.json();
    // Convert category names to ObjectIds (like in POST)
    const categoryIds = [];
    if (body.categories && Array.isArray(body.categories)) {
      for (const catName of body.categories) {
        if (!catName || typeof catName !== "string") continue;
        const slug = catName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, "");
        let catDoc = await import("@/model/catagory").then((m) =>
          m.default.findOne({ store: body.store, slug })
        );
        if (!catDoc) {
          catDoc = await import("@/model/catagory").then((m) =>
            m.default.create({ store: body.store, name: catName.trim(), slug })
          );
        }
        if (!catDoc) {
          throw new Error(
            `Failed to find or create category for name: ${catName}`
          );
        }
        categoryIds.push(catDoc._id);
      }
      body.categories = categoryIds;
    }
    const updated = await Product.findByIdAndUpdate(productId, body, {
      new: true,
      runValidators: true,
    }).lean();
    if (!updated) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      );
    }
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to update product", error },
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
 *
 * PATCH /api/product/[id]
 * - Description: Updates a single product by its ID.
 * - Path Parameter:
 *   - id: ProductObjectId
 * - Request Body: Product fields to update.
 * - Response:
 *   - 200: Returns the updated product document.
 *   - 400: Returns an error if the product ID is invalid.
 *   - 404: Returns an error if the product is not found.
 *   - 500: Returns an error if updating fails.
 */
