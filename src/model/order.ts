import { Schema, model, Document, Types } from 'mongoose';

interface IOrderItem {
  product: Types.ObjectId;
  variant?: string;
  quantity: number;
  price: number;
}

interface IOrder extends Document {
  store: Types.ObjectId;
  user: Types.ObjectId;
  items: IOrderItem[];
  total: number;
  stripePaymentId: string;
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'refunded';
  shippingAddress?: Record<string, any>;
}

const OrderSchema = new Schema<IOrder>({
  store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: String,
    quantity: { type: Number, min: 1, required: true },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  stripePaymentId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'shipped', 'completed', 'refunded'],
    default: 'pending'
  },
  shippingAddress: Schema.Types.Mixed
}, { timestamps: true });

// Index for store order lookups
OrderSchema.index({ store: 1, createdAt: -1 });

export const Order = model<IOrder>('Order', OrderSchema);