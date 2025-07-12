// app/api/stores/[subdomain]/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Store from "@/model/store";
import Theme from "@/model/theme"; // Import Theme model

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subdomain: string }> }
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
      .populate({ path: "theme", model: Theme })
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
      theme: store.theme,
      heroHeading: store.heroHeading,
      storeLandingImage: store.storeLandingImage,
      heroDescription: store.heroDescription,
      aboutUs: store.aboutUs,
      whyChooseUs: store.whyChooseUs || [],
      contact: store.contact || {},
      isPublished: store.isPublished,
      integrations: store.integrations || {},
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
