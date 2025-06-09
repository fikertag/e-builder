// models/AIConfig.ts
import { Schema, model, Document, Types } from 'mongoose';

interface IAIGeneration extends Document {
  store: Types.ObjectId;
  prompt: string;
  inputImages: string[];
  generatedCodeVersion: string;
  componentsModified: string[];
  status: 'pending' | 'generating' | 'completed' | 'failed';
}

const AIGenerationSchema = new Schema<IAIGeneration>({
  store: { 
    type: Schema.Types.ObjectId, 
    ref: 'Store', 
    required: true 
  },
  prompt: {
    type: String,
    required: true,
    maxlength: 500
  },
  inputImages: [String],
  generatedCodeVersion: String,
  componentsModified: [{
    type: String,
    enum: ['header', 'product-grid', 'color-scheme', 'typography', 'checkout-flow']
  }],
  status: {
    type: String,
    enum: ['pending', 'generating', 'completed', 'failed'],
    default: 'pending'
  }
}, { timestamps: true });

export const AIGeneration = model<IAIGeneration>('AIGeneration', AIGenerationSchema);