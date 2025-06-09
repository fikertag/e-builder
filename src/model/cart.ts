import { Schema,model, Document, Types } from 'mongoose';

interface ICartItem {
  product: Types.ObjectId;
  variant?: string;
  quantity: number;
  priceAtAddition: number;
}

interface ICart extends Document {
  store: Types.ObjectId;
  user?: Types.ObjectId; // Optional for guest carts
  sessionId?: string; // For guest users
  items: ICartItem[];
  expiresAt: Date;
}

const CartSchema = new Schema<ICart>({
  store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: String,
    quantity: { type: Number, min: 1, default: 1 },
    priceAtAddition: { type: Number, required: true }
  }],
  expiresAt: { 
    type: Date, 
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
});

// TTL index for automatic cart cleanup
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Cart = model<ICart>('Cart', CartSchema);