import { Schema, model, Document, Types } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  stores: Types.ObjectId[];
  stripeCustomerId?: string;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: { type: String, required: true, select: false },
  stores: [{ type: Schema.Types.ObjectId, ref: 'Store' }],
  stripeCustomerId: String,
  lastLogin: Date
}, { timestamps: true });

export const Store = model<IUser>('User', UserSchema);