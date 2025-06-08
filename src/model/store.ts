import mongoose, { Schema, Document, Types } from 'mongoose';

interface IStoreSettings {
  themeColor?: string;
  logoUrl?: string;
}

interface IStore extends Document {
  name: string;
  owner: Types.ObjectId;  // Reference to User model
  settings?: IStoreSettings;
  createdAt: Date;
  updatedAt: Date;
}

const storeSettingsSchema = new Schema<IStoreSettings>({
  themeColor: { 
    type: String,
    default: '#2563eb',
    validate: {
      validator: (color: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color),
      message: 'Invalid hex color format'
    }
  },
  logoUrl: { 
    type: String,
    validate: {
      validator: (url: string) => /^(https?:\/\/).*\.(jpeg|jpg|png|gif|webp|svg)$/i.test(url),
      message: 'Invalid image URL format'
    }
  }
}, { _id: false });

const storeSchema = new Schema<IStore>({
  name: { 
    type: String, 
    required: [true, 'Store name is required'],
    trim: true,
    minlength: [3, 'Store name must be at least 3 characters'],
    maxlength: [50, 'Store name cannot exceed 50 characters'],
    index: true
  },
  owner: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: [true, 'Owner ID is required'],
    index: true
  },
  settings: storeSettingsSchema
}, {
  timestamps: true  // Auto-create createdAt/updatedAt fields
});

const Store = mongoose.model<IStore>('Store', storeSchema);
export default Store;