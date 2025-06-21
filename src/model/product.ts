import mongoose, { Schema, Model, Document, Types } from "mongoose";

export interface ICustomOption {
  name: string; // "Engraving Text"
  type: "text" | "dropdown";
  required: boolean;
  choices?: string[]; // Only for type "dropdown"
  priceImpact?: number; // Additional cost
}

export interface IVariant {
  name: string; // "Small", "Red", "Cotton"
  type?: string; // "size", "color", "material" (optional)
  sku: string; // "TSHIRT-RED-SM"
  priceAdjustment?: number; // +$5 for this variant
  inventory: number;
  image?: string; // Variant-specific image
}

interface IProduct extends Document {
  store: Types.ObjectId; // Reference to Store
  title: string;
  description: string;
  basePrice: number; // Starting price before variants
  variants: IVariant[];
  categories: Types.ObjectId[]; // Reference to Categories
  images: string[]; // Main product images
  isFeatured: boolean;
  isActive: boolean; // Soft delete
  attributes: {
    // Flexible metadata
    [key: string]: string | number | boolean | undefined; // { "gender": "unisex", "weight": "200g" }
  };
  customOptions?: ICustomOption[];
}

const ProductSchema = new Schema<IProduct>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      minlength: 30,
    },
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    variants: [
      {
        name: { type: String, required: true },
        type: { type: String, enum: ["size", "color", "style", "material"] },
        sku: {
          type: String,
          required: true,
          uppercase: true,
          match: /^[A-Z0-9-]+$/, // Alphanumeric + hyphens
        },
        priceAdjustment: {
          type: Number,
          default: 0,
        },
        inventory: {
          type: Number,
          required: true,
          min: 0,
          default: 0,
        },
        image: String,
      },
    ],
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    images: [
      {
        type: String,
        validate: {
          validator: (urls: string[]) => urls.length > 0,
          message: "At least one product image is required",
        },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    attributes: Schema.Types.Mixed, // Flexible key-value store
    customOptions: [
      {
        name: { type: String, required: true },
        type: { type: String, enum: ["text", "dropdown"], required: true },
        required: { type: Boolean, default: false },
        choices: [
          {
            type: String,
          },
        ],
        priceImpact: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtual for final price calculation
ProductSchema.virtual("finalPrice").get(function () {
  return this.basePrice + (this.variants?.[0]?.priceAdjustment || 0);
});

// Indexes
ProductSchema.index({ store: 1, title: 1 }); // For store product listings
ProductSchema.index({ "variants.sku": 1 }, { unique: true, sparse: true });
ProductSchema.index({ title: "text", description: "text" }); // Text search

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
