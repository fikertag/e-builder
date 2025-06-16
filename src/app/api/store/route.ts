import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "@/lib/rateLimit";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import  Store  from "@/model/store";

// Allowed enums from your schema
const allowedHeadings = [
  "Inter, sans-serif",
  "Playfair Display, serif",
  "Montserrat, sans-serif",
];
const allowedBodies = [
  "Roboto, sans-serif",
  "Open Sans, sans-serif",
  "Lora, serif",
];
const allowedTemplates = ["minimalist", "professional", "vibrant"];
const hexColorRegex = /^#([A-Fa-f0-9]{6})$/;

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const {
      storeName,
      subdomain,
      owner,
      description,
      aiConfig,
      heroHeading,
      storeLandingImage,
      heroDescription,
      aboutUs,
      whyChooseUs,
      contact,
    } = await request.json();
     const userId = owner;

     const ip = request.headers.get("x-forwarded-for") || "unknown";
     const identifier = userId || ip;

     const { success } = await ratelimit.limit(identifier);

  if (!success) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

     // Required fields validation
     if (!storeName || typeof storeName !== "string") {
       return NextResponse.json({ message: "Store name is required." }, { status: 400 });
     }
     if (storeName.length > 100) {
       return NextResponse.json({ message: "Store name is too long." }, { status: 400 });
     }
     if (!storeLandingImage) {
      return NextResponse.json({message: "strore image is required. "}, {status: 400 });
     }
     if (!description || typeof description !== "string") {
       return NextResponse.json({ message: "Description is required." }, { status: 400 });
     }
     if (!owner || !mongoose.Types.ObjectId.isValid(owner)) {
       return NextResponse.json({ message: "Invalid or missing owner." }, { status: 400 });
     }

     // New required fields
     if (!heroHeading || typeof heroHeading !== "string" || !heroHeading.trim()) {
       return NextResponse.json({ message: "heroHeading is required." }, { status: 400 });
     }
     if (heroHeading.length > 100) {
       return NextResponse.json({ message: "heroHeading is too long." }, { status: 400 });
     }

     if (!heroDescription || typeof heroDescription !== "string" || !heroDescription.trim()) {
       return NextResponse.json({ message: "heroDescription is required." }, { status: 400 });
     }
     if (heroDescription.length > 300) {
       return NextResponse.json({ message: "heroDescription is too long." }, { status: 400 });
     }

     if (!aboutUs || typeof aboutUs !== "string" || !aboutUs.trim()) {
       return NextResponse.json({ message: "aboutUs is required." }, { status: 400 });
     }
     if (aboutUs.length > 1000) {
       return NextResponse.json({ message: "aboutUs is too long." }, { status: 400 });
     }

     if (!Array.isArray(whyChooseUs) || whyChooseUs.length === 0) {
       return NextResponse.json({ message: "whyChooseUs must be a non-empty array." }, { status: 400 });
     }
     if ((whyChooseUs as string[]).some(item => typeof item !== "string" || !item.trim())) {
       return NextResponse.json({ message: "Each whyChooseUs item must be a non-empty string." }, { status: 400 });
   }

     // Contact is optional, but if provided, validate structure
     if (contact && typeof contact !== "object") {
       return NextResponse.json({ message: "contact must be an object." }, { status: 400 });
     }

   let cleanSubdomain = subdomain || storeName.toLowerCase().replace(/\s+/g, "-");

    // Sanitize: only allow a-z, 0-9, and hyphens; trim to 30 characters
    cleanSubdomain = cleanSubdomain
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .substring(0, 30);

    // Normalize: collapse multiple hyphens, trim start/end hyphens
    cleanSubdomain = cleanSubdomain.replace(/-+/g, "-").replace(/^-+|-+$/g, "");

    if (!cleanSubdomain) {
      return NextResponse.json({ message: "Invalid subdomain generated from store name." }, { status: 400 });
    }

    // Check uniqueness
    const existing = await Store.findOne({ subdomain: cleanSubdomain });
    if (existing) {
      return NextResponse.json(
        { message: `Subdomain "${cleanSubdomain}" is already taken.` },
        { status: 409 }
      );
    }

    // aiConfig validation if provided
    if (aiConfig) {
      if (typeof aiConfig !== "object") {
        return NextResponse.json({ message: "aiConfig must be an object." }, { status: 400 });
      }
      // colorPalette
      if (aiConfig.colorPalette) {
        const { primary, secondary, accent } = aiConfig.colorPalette;
        if (primary && !hexColorRegex.test(primary)) {
          return NextResponse.json({ message: "aiConfig.colorPalette.primary must be a valid hex color." }, { status: 400 });
        }
        if (secondary && !hexColorRegex.test(secondary)) {
          return NextResponse.json({ message: "aiConfig.colorPalette.secondary must be a valid hex color." }, { status: 400 });
        }
        if (accent && !hexColorRegex.test(accent)) {
          return NextResponse.json({ message: "aiConfig.colorPalette.accent must be a valid hex color." }, { status: 400 });
        }
      }
      // typography
      if (aiConfig.typography) {
        const { heading, body } = aiConfig.typography;
        if (heading && !allowedHeadings.includes(heading)) {
          return NextResponse.json({ message: "aiConfig.typography.heading is not allowed." }, { status: 400 });
        }
        if (body && !allowedBodies.includes(body)) {
          return NextResponse.json({ message: "aiConfig.typography.body is not allowed." }, { status: 400 });
        }
      }
      // layoutTemplate
      if (aiConfig.layoutTemplate && !allowedTemplates.includes(aiConfig.layoutTemplate)) {
        return NextResponse.json({ message: "aiConfig.layoutTemplate is not allowed." }, { status: 400 });
      }
    }

    // Create store
   const newStore = new Store({
    storeName,
    subdomain: cleanSubdomain,
    owner,
    description,
    aiConfig,
    heroHeading,
    storeLandingImage,
    heroDescription,
    aboutUs,
    whyChooseUs,
    contact,
    generatedAt: new Date(),
     });

    const savedStore = await newStore.save();

    return NextResponse.json(savedStore, { status: 201 });
  } catch (error) {
    console.error("Error creating store:", error);
    return NextResponse.json(
      { message: "Failed to create store", error },
      { status: 500 }
    );
  }
}

/**
 * API Documentation:
 *
 * POST /api/store
 * - Description: Creates a new store in the database.
 * - Request Body:
 *   {
 *     "owner": "UserObjectId",
 *     "subdomain": "myshop", // optional, auto-generated from storeName if not provided
 *     "storeName": "My Shop",
 *     "description": "A cool store",
 *     "aiConfig": { // optional, but if provided, must match schema
 *       "colorPalette": {
 *         "primary": "#2563eb",
 *         "secondary": "#1e40af",
 *         "accent": "#f97316"
 *       },
 *       "typography": {
 *         "heading": "Inter, sans-serif",
 *         "body": "Roboto, sans-serif"
 *       },
 *       "layoutTemplate": "professional"
 *     },
 *     "heroHeading": "Welcome to My Shop",           // required, string, max 100 chars
 *     "heroDescription": "Best products for you.",    // required, string, max 300 chars
 *     "aboutUs": "We are passionate about mugs.",     // required, string, max 1000 chars
 *     "whyChooseUs": ["Quality", "Fast Shipping"],    // required, non-empty array of strings
 *     "contact": {                                    // optional, object
 *       "email": "info@myshop.com",
 *       "phone": "+123456789",
 *       "address": "123 Main St, City, Country",
 *       "social": {
 *         "instagram": "myshop",
 *         "facebook": "myshop",
 *         "twitter": "myshop",
 *         "tiktok": "myshop",
 *         "youtube": "myshop"
 *       }
 *     }
 *   }
 * - Response:
 *   - 201: Returns the created store document.
 *   - 400: Returns an error message if required fields are missing or invalid.
 *   - 409: Returns an error if the subdomain is already taken.
 *   - 500: Returns an error message if creation fails.
 */