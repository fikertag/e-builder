// models/Order.ts
import mongoose, { Schema, Model, Document, Types } from "mongoose";

interface IOrderItem {
  product: Types.ObjectId;
  variant?: string;
  quantity: number;
  price: number;
}

interface IOrderAddress {
  street: string;
  city: string;
  phoneNumber: string;
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
  shippingAddress: IOrderAddress;
  payment?: Types.ObjectId;
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

const OrderAddressSchema = new Schema<IOrderAddress>(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true },
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
      required: true,
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
    shippingAddress: OrderAddressSchema,
    payment: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
      required: false,
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
