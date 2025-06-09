// models/Store.ts
import mongoose, { Schema, Document, Model, Types } from 'mongoose';

interface IAIBrandConfig {
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  layoutTemplate: 'minimalist' | 'professional' | 'vibrant';
}

interface IStore extends Document {
  owner: Types.ObjectId;
  subdomain: string;
  storeName: string;
  description: string;
  aiConfig: IAIBrandConfig;
  generatedAt?: Date;
  isPublished: boolean;
}

const StoreSchema = new Schema<IStore>({
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  subdomain: { 
    type: String, 
    required: true,
    unique: true,
    match: /^[a-z0-9\-]+$/,
    maxlength: 30
  },
  storeName: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 40 
  },
  description: {
    type: String,
    maxlength: 200
  },
  aiConfig: {
    colorPalette: {
      primary: { 
        type: String, 
        default: '#2563eb',
        validate: /^#([A-Fa-f0-9]{6})$/
      },
      secondary: { 
        type: String, 
        default: '#1e40af',
        validate: /^#([A-Fa-f0-9]{6})$/
      },
      accent: { 
        type: String, 
        default: '#f97316',
        validate: /^#([A-Fa-f0-9]{6})$/
      }
    },
    typography: {
      heading: {
        type: String,
        default: 'Inter, sans-serif',
        enum: ['Inter, sans-serif', 'Playfair Display, serif', 'Montserrat, sans-serif']
      },
      body: {
        type: String,
        default: 'Roboto, sans-serif',
        enum: ['Roboto, sans-serif', 'Open Sans, sans-serif', 'Lora, serif']
      }
    },
    layoutTemplate: {
      type: String,
      enum: ['minimalist', 'professional',                         'vibrant'],
      default: 'professional'
    }
  },
  generatedAt: Date,
  isPublished: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

const Store: Model<IStore> = mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema);

export default Store;