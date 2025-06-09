import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Category from "@/model/catagory";
import Store from "@/model/store"; // Import your Store model

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { store, name, slug, description, parent, featured } = await request.json();

    // Validate required fields
    if (!store || !mongoose.Types.ObjectId.isValid(store)) {
      return NextResponse.json({ message: "Invalid or missing store ID." }, { status: 400 });
    }

    const storeExists = await Store.findById(store);
    if (!storeExists) {
      return NextResponse.json({ message: "Store not found." }, { status: 404 });
}

    if (!name || typeof name !== "string") {
      return NextResponse.json({ message: "Category name is required." }, { status: 400 });
    }
    if (!slug || typeof slug !== "string" || !/^[a-z0-9\-]+$/.test(slug)) {
      return NextResponse.json({ message: "Valid slug is required (lowercase, a-z, 0-9, hyphens)." }, { status: 400 });
    }
    if (parent && !mongoose.Types.ObjectId.isValid(parent)) {
      return NextResponse.json({ message: "Invalid parent category ID." }, { status: 400 });
    }

    // Check uniqueness of slug per store
    const existing = await Category.findOne({ store, slug });
    if (existing) {
      return NextResponse.json(
        { message: `Category slug "${slug}" already exists for this store.` },
        { status: 409 }
      );
    }

    const newCategory = new Category({
      store,
      name,
      slug,
      description,
      parent,
      featured: !!featured,
    });

    const savedCategory = await newCategory.save();

    return NextResponse.json(savedCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { message: "Failed to create category", error },
      { status: 500 }
    );
  }
}

/**
 * API Documentation:
 *
 * POST /api/category
 * - Description: Creates a new category for a store.
 * - Request Body:
 *   {
 *     "store": "StoreObjectId",
 *     "name": "Category Name",
 *     "slug": "category-slug",
 *     "description": "Optional description",
 *     "parent": "ParentCategoryObjectId", // optional
 *     "featured": true // optional
 *   }
 * - Response:
 *   - 201: Returns the created category document.
 *   - 400: Returns an error message if required fields are missing or invalid.
 *   - 409: Returns an error if the slug already exists for the store.
 *   - 500: Returns an error message if creation fails.
 */