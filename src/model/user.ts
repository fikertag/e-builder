// models/User.ts
import { Schema, model, Document, Types } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  stores: Types.ObjectId[];
  aiCredits: number;
  lastGenerationAt?: Date;
}

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: { 
    type: String, 
    required: true, 
    select: false 
  },
  stores: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Store' 
  }],
  aiCredits: { 
    type: Number, 
    default: 3, 
    min: 0 
  },
  lastGenerationAt: Date
}, { timestamps: true });

export const User = model<IUser>('User', UserSchema);