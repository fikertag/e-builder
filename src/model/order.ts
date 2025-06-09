// models/Order.ts
import { Schema, model, Document, Types } from 'mongoose';

interface IOrderItem {
  product: Types.ObjectId;
  variant?: string;
  quantity: number;
  price: number;
}

interface IOrderAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface IOrder extends Document {
  store: Types.ObjectId;
  customer: Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: IOrderAddress;
  stripePaymentId: string;
  stripeChargeId: string;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  variant: String,
  quantity: { 
    type: Number, 
    min: 1, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  }
}, { _id: false });

const OrderAddressSchema = new Schema<IOrderAddress>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
}, { _id: false });

const OrderSchema = new Schema<IOrder>({
  store: { 
    type: Schema.Types.ObjectId, 
    ref: 'Store', 
    required: true,
    index: true 
  },
  customer: { 
    type: Schema.Types.ObjectId, 
    ref: 'Customer', 
    required: true 
  },
  items: [OrderItemSchema],
  subtotal: { 
    type: Number, 
    required: true,
    min: 0 
  },
  shipping: { 
    type: Number, 
    required: true,
    min: 0 
  },
  tax: { 
    type: Number, 
    required: true,
    min: 0 
  },
  total: { 
    type: Number, 
    required: true,
    min: 0 
  },
  status: { 
    type: String, 
    enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: OrderAddressSchema,
  stripePaymentId: { 
    type: String, 
    required: true 
  },
  stripeChargeId: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

// Index for store order management
OrderSchema.index({ store: 1, status: 1, createdAt: -1 });
// Index for customer order history
OrderSchema.index({ customer: 1, createdAt: -1 });

export const Order = model<IOrder>('Order', OrderSchema);