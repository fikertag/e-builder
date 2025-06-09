// models/Store.ts
import { Schema, model, Document, Types } from 'mongoose';

interface IStoreSettings {
  subdomain: string;
  primaryColor: string;
  logo?: string;
  favicon?: string;
  seoDescription?: string;
}

interface IStore extends Document {
  name: string;
  owner: Types.ObjectId;
  settings: IStoreSettings;
  isActive: boolean;
  stripeAccountId?: string; 
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  settings: {
    subdomain: { 
      type: String, 
      required: true,
      unique: true,
      match: /^[a-z0-9\-]+$/,
      maxlength: 30
    },
    primaryColor: { 
      type: String, 
      default: '#2563eb',
      validate: /^#([A-Fa-f0-9]{6})$/
    },
    logo: String, // Cloudinary/S3 URL
    favicon: String,
    seoDescription: String
  },
  isActive: { type: Boolean, default: true },
  stripeAccountId: String // For Stripe Connect
}, { timestamps: true });

// Index for subdomain routing
StoreSchema.index({ 'settings.subdomain': 1 }, { unique: true });

export const Store = model<IStore>('Store', StoreSchema);