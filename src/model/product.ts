import { Schema, model, Document, Types } from 'mongoose';

interface IProductVariant {
  name: string;
  price: number;
  sku?: string;
  inventory: number;
}

interface IProduct extends Document {
  store: Types.ObjectId;
  title: string;
  description?: string;
  aiDescription?: string; // AI-generated content
  price: number;
  variants?: IProductVariant[];
  categories: string[];
  images: string[];
  isFeatured: boolean;
  metadata?:string;
}

const ProductSchema = new Schema<IProduct>({
  store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  title: { type: String, required: true, maxlength: 100 },
  description: String,
  aiDescription: String,
  price: { type: Number, required: true, min: 0 },
  variants: [{
    name: String,
    price: Number,
    sku: String,
    inventory: { type: Number, default: 0 }
  }],
  categories: [{ type: String }],
  images: [{ type: String }], // Array of image URLs
  isFeatured: { type: Boolean, default: false },
  metadata: { type: String } // For extensibility
}, { timestamps: true });

// Compound index for store + product queries
ProductSchema.index({ store: 1, title: 1 });

export const Store = model<IProduct>('Product', ProductSchema);