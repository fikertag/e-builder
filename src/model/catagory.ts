// models/Category.ts
import mongoose , { Schema, Model, Document, Types } from 'mongoose';

interface ICategory extends Document {
  store: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parent?: Types.ObjectId;
  featured: boolean;
}

const CategorySchema = new Schema<ICategory>({
  store: { 
    type: Schema.Types.ObjectId, 
    ref: 'Store',
    required: true,
    index: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  slug: { 
    type: String, 
    required: true,
    lowercase: true,
    match: /^[a-z0-9\-]+$/
  },
  description: String,
  parent: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category' 
  },
  featured: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

// Unique category per store
CategorySchema.index({ store: 1, slug: 1 }, { unique: true });


const Category: Model<ICategory> = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;