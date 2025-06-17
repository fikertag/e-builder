// app/api/stores/[subdomain]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Store  from "@/model/store";

export async function GET(
 request: Request,
  { params }: { params:Promise< { subdomain: string }> }
): Promise<NextResponse> {
  await dbConnect();

  try {
   const { subdomain } = await params;
    // 1. Validate subdomain format
    if (!subdomain || typeof subdomain !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid subdomain format" },
        { status: 400 }
      );
    }

    // 2. Clean subdomain input
    const cleanSubdomain = subdomain.toLowerCase().trim();

    // 3. Find store
    const store = await Store.findOne({ subdomain: cleanSubdomain })
      .select("-__v -owner -createdAt -updatedAt") // Exclude unnecessary fields
      .lean();

    if (!store) {
      return NextResponse.json(
        { success: false, message: "Store not found" },
        { status: 404 }
      );
    }

    // 4. Format response
    const response = {
        id: store._id.toString(),
        storeName: store.storeName,
        subdomain: store.subdomain,
        description: store.description,
        aiConfig: store.aiConfig, 
        heroHeading: store.heroHeading,
        storeLandingImage: store.storeLandingImage,
        heroDescription: store.heroDescription,
        aboutUs: store.aboutUs,
        whyChooseUs: store.whyChooseUs || [],
        contact: store.contact || {},
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("GET Store Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * API Documentation
GET /api/stores/[subdomain]

    Purpose: Fetch store details by subdomain

    Authentication: None (public endpoint)

    Parameters:

        subdomain (URL path): Store's unique subdomain

    Success Response:
    json

{
  "success": true,
  "data": {
    "storeName": "Example Store",
    "subdomain": "example",
    "description": "An example store",
    "theme": {
      "colorPalette": {
        "primary": "#2563eb",
        "secondary": "#1e40af",
        "accent": "#f97316"
      },
      "typography": {
        "heading": "Inter, sans-serif",
        "body": "Roboto, sans-serif"
      },
      "layoutTemplate": "professional"
    }
  }
}

Error Responses:

    400 Bad Request: Invalid subdomain format

    404 Not Found: Store not found

    500 Internal Server Error: Server error
 */