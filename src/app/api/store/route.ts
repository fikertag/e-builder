import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "@/lib/rateLimit";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Store from "@/model/store";

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
      theme,
      deliveryFees,
    } = await request.json();
    // deliveryFees validation (optional, but if present must be valid)
    if (deliveryFees !== undefined) {
      if (!Array.isArray(deliveryFees)) {
        return NextResponse.json(
          { message: "deliveryFees must be an array." },
          { status: 400 }
        );
      }
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
    }
    const userId = owner;

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const identifier = userId || ip;

    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return NextResponse.json(
        { message: "Too many requests" },
        { status: 429 }
      );
    }

    // Required fields validation
    if (!storeName || typeof storeName !== "string") {
      return NextResponse.json(
        { message: "Store name is required." },
        { status: 400 }
      );
    }
    if (storeName.length > 100) {
      return NextResponse.json(
        { message: "Store name is too long." },
        { status: 400 }
      );
    }
    if (!storeLandingImage) {
      return NextResponse.json(
        { message: "strore image is required. " },
        { status: 400 }
      );
    }
    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { message: "Description is required." },
        { status: 400 }
      );
    }
    if (!owner || !mongoose.Types.ObjectId.isValid(owner)) {
      return NextResponse.json(
        { message: "Invalid or missing owner." },
        { status: 400 }
      );
    }

    // New required fields
    if (
      !heroHeading ||
      typeof heroHeading !== "string" ||
      !heroHeading.trim()
    ) {
      return NextResponse.json(
        { message: "heroHeading is required." },
        { status: 400 }
      );
    }
    if (heroHeading.length > 100) {
      return NextResponse.json(
        { message: "heroHeading is too long." },
        { status: 400 }
      );
    }

    if (
      !heroDescription ||
      typeof heroDescription !== "string" ||
      !heroDescription.trim()
    ) {
      return NextResponse.json(
        { message: "heroDescription is required." },
        { status: 400 }
      );
    }
    if (heroDescription.length > 300) {
      return NextResponse.json(
        { message: "heroDescription is too long." },
        { status: 400 }
      );
    }

    if (!aboutUs || typeof aboutUs !== "string" || !aboutUs.trim()) {
      return NextResponse.json(
        { message: "aboutUs is required." },
        { status: 400 }
      );
    }
    if (aboutUs.length > 1000) {
      return NextResponse.json(
        { message: "aboutUs is too long." },
        { status: 400 }
      );
    }

    if (!Array.isArray(whyChooseUs) || whyChooseUs.length === 0) {
      return NextResponse.json(
        { message: "whyChooseUs must be a non-empty array." },
        { status: 400 }
      );
    }
    if (
      (whyChooseUs as string[]).some(
        (item) => typeof item !== "string" || !item.trim()
      )
    ) {
      return NextResponse.json(
        { message: "Each whyChooseUs item must be a non-empty string." },
        { status: 400 }
      );
    }

    // Contact is optional, but if provided, validate structure
    if (contact && typeof contact !== "object") {
      return NextResponse.json(
        { message: "contact must be an object." },
        { status: 400 }
      );
    }

    let cleanSubdomain =
      subdomain || storeName.toLowerCase().replace(/\s+/g, "-");

    // Sanitize: only allow a-z, 0-9, and hyphens; trim to 30 characters
    cleanSubdomain = cleanSubdomain
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .substring(0, 30);

    // Normalize: collapse multiple hyphens, trim start/end hyphens
    cleanSubdomain = cleanSubdomain.replace(/-+/g, "-").replace(/^-+|-+$/g, "");

    if (!cleanSubdomain) {
      return NextResponse.json(
        { message: "Invalid subdomain generated from store name." },
        { status: 400 }
      );
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
        return NextResponse.json(
          { message: "aiConfig must be an object." },
          { status: 400 }
        );
      }
      // colorPalette
      if (aiConfig.colorPalette) {
        const { primary, secondary, accent } = aiConfig.colorPalette;
        if (primary && !hexColorRegex.test(primary)) {
          return NextResponse.json(
            {
              message:
                "aiConfig.colorPalette.primary must be a valid hex color.",
            },
            { status: 400 }
          );
        }
        if (secondary && !hexColorRegex.test(secondary)) {
          return NextResponse.json(
            {
              message:
                "aiConfig.colorPalette.secondary must be a valid hex color.",
            },
            { status: 400 }
          );
        }
        if (accent && !hexColorRegex.test(accent)) {
          return NextResponse.json(
            {
              message:
                "aiConfig.colorPalette.accent must be a valid hex color.",
            },
            { status: 400 }
          );
        }
      }
      // typography
      if (aiConfig.typography) {
        const { heading, body } = aiConfig.typography;
        if (heading && !allowedHeadings.includes(heading)) {
          return NextResponse.json(
            { message: "aiConfig.typography.heading is not allowed." },
            { status: 400 }
          );
        }
        if (body && !allowedBodies.includes(body)) {
          return NextResponse.json(
            { message: "aiConfig.typography.body is not allowed." },
            { status: 400 }
          );
        }
      }
      // layoutTemplate
      if (
        aiConfig.layoutTemplate &&
        !allowedTemplates.includes(aiConfig.layoutTemplate)
      ) {
        return NextResponse.json(
          { message: "aiConfig.layoutTemplate is not allowed." },
          { status: 400 }
        );
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
      theme,
      deliveryFees,
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

export async function PATCH(request: NextRequest) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, subdomain, ...updateFields } = body;

    // Require either id or subdomain to identify the store
    if (!id && !subdomain) {
      return NextResponse.json(
        { message: "Store id or subdomain is required." },
        { status: 400 }
      );
    }

    // Validate fields if present (reuse POST logic for validation)
    if (updateFields.storeName && typeof updateFields.storeName !== "string") {
      return NextResponse.json(
        { message: "Store name must be a string." },
        { status: 400 }
      );
    }
    if (updateFields.storeName && updateFields.storeName.length > 100) {
      return NextResponse.json(
        { message: "Store name is too long." },
        { status: 400 }
      );
    }
    if (
      updateFields.heroHeading &&
      (typeof updateFields.heroHeading !== "string" ||
        updateFields.heroHeading.length > 100)
    ) {
      return NextResponse.json(
        { message: "heroHeading must be a string up to 100 chars." },
        { status: 400 }
      );
    }
    if (
      updateFields.heroDescription &&
      (typeof updateFields.heroDescription !== "string" ||
        updateFields.heroDescription.length > 300)
    ) {
      return NextResponse.json(
        { message: "heroDescription must be a string up to 300 chars." },
        { status: 400 }
      );
    }
    if (
      updateFields.aboutUs &&
      (typeof updateFields.aboutUs !== "string" ||
        updateFields.aboutUs.length > 1000)
    ) {
      return NextResponse.json(
        { message: "aboutUs must be a string up to 1000 chars." },
        { status: 400 }
      );
    }
    if (
      updateFields.whyChooseUs &&
      (!Array.isArray(updateFields.whyChooseUs) ||
        updateFields.whyChooseUs.some(
          (item: string) => typeof item !== "string" || !item.trim()
        ))
    ) {
      return NextResponse.json(
        {
          message:
            "whyChooseUs must be a non-empty array of non-empty strings.",
        },
        { status: 400 }
      );
    }
    if (updateFields.contact && typeof updateFields.contact !== "object") {
      return NextResponse.json(
        { message: "contact must be an object." },
        { status: 400 }
      );
    }
    if (updateFields.aiConfig) {
      const aiConfig = updateFields.aiConfig;
      if (typeof aiConfig !== "object") {
        return NextResponse.json(
          { message: "aiConfig must be an object." },
          { status: 400 }
        );
      }
      if (aiConfig.colorPalette) {
        const { primary, secondary, accent } = aiConfig.colorPalette;
        if (primary && !hexColorRegex.test(primary)) {
          return NextResponse.json(
            {
              message:
                "aiConfig.colorPalette.primary must be a valid hex color.",
            },
            { status: 400 }
          );
        }
        if (secondary && !hexColorRegex.test(secondary)) {
          return NextResponse.json(
            {
              message:
                "aiConfig.colorPalette.secondary must be a valid hex color.",
            },
            { status: 400 }
          );
        }
        if (accent && !hexColorRegex.test(accent)) {
          return NextResponse.json(
            {
              message:
                "aiConfig.colorPalette.accent must be a valid hex color.",
            },
            { status: 400 }
          );
        }
      }
      if (aiConfig.typography) {
        const { heading, body } = aiConfig.typography;
        if (heading && !allowedHeadings.includes(heading)) {
          return NextResponse.json(
            { message: "aiConfig.typography.heading is not allowed." },
            { status: 400 }
          );
        }
        if (body && !allowedBodies.includes(body)) {
          return NextResponse.json(
            { message: "aiConfig.typography.body is not allowed." },
            { status: 400 }
          );
        }
      }
      if (
        aiConfig.layoutTemplate &&
        !allowedTemplates.includes(aiConfig.layoutTemplate)
      ) {
        return NextResponse.json(
          { message: "aiConfig.layoutTemplate is not allowed." },
          { status: 400 }
        );
      }
    }

    // Validate integrations if present
    if (updateFields.integrations) {
      const { telebirr, cbe } = updateFields.integrations;
      if (telebirr) {
        if (
          typeof telebirr !== "object" ||
          !/^\+2519\d{8}$/.test(telebirr.number || "") ||
          !telebirr.name ||
          typeof telebirr.name !== "string"
        ) {
          return NextResponse.json(
            { message: "Invalid Telebirr integration info." },
            { status: 400 }
          );
        }
      }
      if (cbe) {
        if (
          typeof cbe !== "object" ||
          !/^1000\d{8,}$/.test(cbe.account || "") ||
          !cbe.name ||
          typeof cbe.name !== "string"
        ) {
          return NextResponse.json(
            { message: "Invalid CBE integration info." },
            { status: 400 }
          );
        }
      }
    }

    // Find store by id or subdomain
    const query = id ? { _id: id } : { subdomain };
    const store = await Store.findOne(query);
    if (!store) {
      return NextResponse.json(
        { message: "Store not found." },
        { status: 404 }
      );
    }

    // Update only provided fields
    Object.entries(updateFields).forEach(([key, value]) => {
      if (value !== undefined) {
        // @ts-expect-error: Store type is not indexable by string, but dynamic field assignment is required for PATCH updates
        store[key] = value;
      }
    });
    await store.save();
    const saved = store;
    const response = {
      id: saved._id,
      storeName: saved.storeName,
      subdomain: saved.subdomain,
      theme: saved.theme,
      description: saved.description,
      heroHeading: saved.heroHeading,
      storeLandingImage: saved.storeLandingImage,
      heroDescription: saved.heroDescription,
      aboutUs: saved.aboutUs,
      whyChooseUs: Array.isArray(saved.whyChooseUs) ? saved.whyChooseUs : [],
      contact: saved.contact ? saved.contact : {},
      isPublished: saved.isPublished,
      integrations: saved.integrations ? saved.integrations : {},
      deliveryFees: Array.isArray(saved.deliveryFees) ? saved.deliveryFees : [],
    };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error updating store:", error);
    return NextResponse.json(
      { message: "Failed to update store", error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const owner = url.searchParams.get("owner");
    if (!owner || !mongoose.Types.ObjectId.isValid(owner)) {
      return NextResponse.json(
        { message: "Owner (user id) is required." },
        { status: 400 }
      );
    }
    const stores = await Store.find({ owner });
    const response = stores.map((store) => ({
      id: store._id,
      storeName: store.storeName,
      subdomain: store.subdomain,
      theme: store.theme,
      description: store.description,
      heroHeading: store.heroHeading,
      storeLandingImage: store.storeLandingImage,
      heroDescription: store.heroDescription,
      aboutUs: store.aboutUs,
      whyChooseUs: Array.isArray(store.whyChooseUs) ? store.whyChooseUs : [],
      contact: store.contact ? store.contact : {},
      isPublished: store.isPublished,
      integrations: store.integrations ? store.integrations : {},
      deliveryFees: Array.isArray(store.deliveryFees) ? store.deliveryFees : [],
    }));
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error fetching stores:", error);
    return NextResponse.json(
      { message: "Failed to fetch stores", error },
      { status: 500 }
    );
  }
}
