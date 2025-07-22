// models/Order.ts
import mongoose, { Schema, Model, Document, Types } from "mongoose";

interface IOrderItem {
  product: Types.ObjectId;
  variant?: string;
  quantity: number;
  price: number;
}

interface IOrder extends Document {
  store: Types.ObjectId;
  customer: Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  payment?: Types.ObjectId;
  shippingMethod: 'pickup' | 'delivery';
  deliveryLocation?: string;
  deliveryPrice?: number;
  phoneNumber: string;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variant: String,
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    store: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: false, // Optional for guest checkout
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    shipping: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: false,
    },
    shippingMethod: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },
    deliveryLocation: {
      type: String,
      required: false,
    },
    deliveryPrice: {
      type: Number,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Index for store order management
OrderSchema.index({ store: 1, status: 1, createdAt: -1 });
// Index for customer order history
OrderSchema.index({ customer: 1, createdAt: -1 });

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
