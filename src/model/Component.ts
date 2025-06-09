// models/Component.ts
import { Schema, model, Document, Types } from 'mongoose';

interface IComponent extends Document {
  store: Types.ObjectId;
  name: string;
  originalCode: string;
  generatedCode: string;
  version: number;
  modifiedAt: Date;
}

const ComponentSchema = new Schema<IComponent>({
  store: { 
    type: Schema.Types.ObjectId, 
    ref: 'Store', 
    required: true 
  },
  name: {
    type: String,
    required: true,
    enum: ['ProductCard', 'Navbar', 'HeroSection', 'CheckoutForm', 'Footer']
  },
  originalCode: { 
    type: String, 
    required: true 
  },
  generatedCode: { 
    type: String, 
    required: true 
  },
  version: { 
    type: Number, 
    default: 1 
  },
  modifiedAt: Date
}, { timestamps: true });

export const Component = model<IComponent>('Component', ComponentSchema);