// models/Store.ts
import mongoose, { Schema, Document, Model, Types } from "mongoose";

interface IStore extends Document {
  owner: Types.ObjectId;
  heroHeading: string;
  storeLandingImage: string;
  heroDescription: string;
  aboutUs: string;
  whyChooseUs: string[];
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    social?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
      tiktok?: string;
      youtube?: string;
    };
  };
  subdomain: string;
  storeName: string;
  description: string;
  theme: Types.ObjectId;
  isPublished: boolean;
  integrations?: {
    telebirr?: {
      number: string;
      name: string;
    };
    cbe?: {
      account: string;
      name: string;
    };
  };
  deliveryFees?: Array<{
    location: string;
    price: number;
  }>;
}

const StoreSchema = new Schema<IStore>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subdomain: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-z0-9\-]+$/,
      maxlength: 30,
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    storeLandingImage: {
      type: String,
      required: true,
    },
    heroHeading: {
      type: String,
      maxlength: 100,
    },
    heroDescription: {
      type: String,
      maxlength: 300,
    },
    aboutUs: {
      type: String,
      maxlength: 1000,
    },
    whyChooseUs: {
      type: [String],
      default: [],
    },
    contact: {
      email: { type: String },
      phone: { type: String },
      address: { type: String },
      social: {
        instagram: { type: String },
        facebook: { type: String },
        twitter: { type: String },
        tiktok: { type: String },
        youtube: { type: String },
      },
    },
    description: {
      type: String,
      maxlength: 200,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: Schema.Types.ObjectId,
      ref: "Theme",
      required: true,
    },
    integrations: {
      telebirr: {
        number: { type: String },
        name: { type: String },
      },
      cbe: {
        account: { type: String },
        name: { type: String },
      },
    },
    deliveryFees: [
      {
        location: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
      },
    ],
  },
  { timestamps: true }
);

const Store: Model<IStore> =
  mongoose.models.Store || mongoose.model<IStore>("Store", StoreSchema);

export default Store;
