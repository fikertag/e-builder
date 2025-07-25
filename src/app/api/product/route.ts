import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Product from "@/model/product";
import Store from "@/model/store";
import Category from "@/model/catagory";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const {
      store,
      title,
      description,
      basePrice,
      variants,
      categories,
      images,
      isFeatured,
      isActive,
      attributes,
      customOptions,
      deliveryFees,
      isFreeDelivery,
      useDefaultDeliveryFees,
    } = await request.json();

    // Validate required fields
    if (!store || !mongoose.Types.ObjectId.isValid(store)) {
      return NextResponse.json(
        { message: "Invalid or missing store ID." },
        { status: 400 }
      );
    }
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { message: "Product title is required." },
        { status: 400 }
      );
    }
    if (
      !description ||
      typeof description !== "string" ||
      description.length < 10
    ) {
      return NextResponse.json(
        {
          message:
            "Description is required and must be at least 10 characters.",
        },
        { status: 400 }
      );
    }
    if (typeof basePrice !== "number" || basePrice < 0) {
      return NextResponse.json(
        { message: "basePrice must be a non-negative number." },
        { status: 400 }
      );
    }
    if (!Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { message: "At least one product image is required." },
        { status: 400 }
      );
    }

    const categoryIds = [];
    if (categories && categories.length > 0) {
      for (const catName of categories) {
        if (!catName || typeof catName !== "string") continue;
        const slug = catName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9\-]/g, "");
        let catDoc = await Category.findOne({ store, slug });
        if (!catDoc) {
          catDoc = await Category.create({ store, name: catName.trim(), slug });
        }
        categoryIds.push(catDoc._id);
      }
    }

    // Optionally: Check if store exists
    const storeExists = await Store.findById(store);
    if (!storeExists) {
      return NextResponse.json(
        { message: "Store not found." },
        { status: 404 }
      );
    }

    // Delivery fee logic
    let productDeliveryFees = undefined;
    let productIsFreeDelivery = false;
    let productUseDefaultDeliveryFees = false;
    if (isFreeDelivery) {
      productIsFreeDelivery = true;
    } else if (Array.isArray(deliveryFees)) {
      // Validate custom delivery fees
      for (const fee of deliveryFees) {
        if (
          typeof fee !== "object" ||
          typeof fee.location !== "string" ||
          !fee.location.trim() ||
          typeof fee.price !== "number" ||
          fee.price < 0
        ) {
          return NextResponse.json(
            {
              message:
                "Each delivery fee must have a non-empty location and a non-negative price.",
            },
            { status: 400 }
          );
        }
      }
      productDeliveryFees = deliveryFees;
    } else if (useDefaultDeliveryFees) {
      productUseDefaultDeliveryFees = true;
    }

    // Create product
    const newProduct = new Product({
      store,
      title,
      description,
      basePrice,
      variants,
      categories: categoryIds,
      images,
      isFeatured: !!isFeatured,
      isActive: isActive !== false,
      attributes,
      customOptions,
      deliveryFees: productDeliveryFees,
      isFreeDelivery: productIsFreeDelivery,
      useDefaultDeliveryFees: productUseDefaultDeliveryFees,
    });

    const savedProduct = await newProduct.save();

    return NextResponse.json(savedProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: "Failed to create product", error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  const url = new URL(request.url);
  const store = url.searchParams.get("store");
  const category = url.searchParams.get("category");

  // Make store param mandatory
  if (!store || !mongoose.Types.ObjectId.isValid(store)) {
    return NextResponse.json(
      { message: "Valid store parameter is required." },
      { status: 400 }
    );
  }

  const filter: Record<string, unknown> = { store };
  if (category && mongoose.Types.ObjectId.isValid(category)) {
    filter.categories = category;
  }

  try {
    const products = await Product.find(filter);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch products", error },
      { status: 500 }
    );
  }
}

/**
 * API Documentation:
 *
 * POST /api/product
 * - Description: Creates a new product in the database.
 * - Request Body:
 *   {
  "store": "60f7c2b8e1d2c8a1b8e1d2c8",
  "title": "Cool T-Shirt",
  "description": "A very cool t-shirt with awesome features and great quality. Perfect for everyone!",
  "basePrice": 25.99,
  "images": ["https://example.com/image1.jpg"],
  "categories": ["60f7c2b8e1d2c8a1b8e1d2c9"],
  "variants": [
    {
      "name": "Large",
      "type": "size",
      "sku": "TSHIRT-L",
      "priceAdjustment": 2,
      "inventory": 10,
      "image": "https://example.com/large.jpg"
    },
    {
      "name": "Red",
      "type": "color",
      "sku": "TSHIRT-RED",
      "priceAdjustment": 0,
      "inventory": 5,
      "image": "https://example.com/red.jpg"
    }
  ],
  "customOptions": [
    {
      "name": "Gift Wrap",
      "type": "dropdown",
      "required": false,
      "choices": ["Yes", "No"],
      "priceImpact": 1.5
    }
  ]
}
 * - Response:
 *   - 201: Returns the created product document.
 *   - 400: Returns an error message if required fields are missing or invalid.
 *   - 404: Returns an error if the store is not found.
 *   - 500: Returns an error message if creation fails.
 * 
 * 
 * 
 *  *
 * GET /api/product
 * - Description: Fetches all products, optionally filtered by store or category.
 * - Query Parameters:
 *   - store: StoreObjectId (optional)
 *   - category: CategoryObjectId (optional)
 * - Response:
 *   - 200: Returns an array of product documents (only _id, title, description, basePrice, images, isFeatured, isActive, store, categories).
 *   - 500: Returns an error if fetching fails.
 */
