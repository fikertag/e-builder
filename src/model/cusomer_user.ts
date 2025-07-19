import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICustomerUser extends Document {
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  storeId: string;
  realEmail: string;
  orderHistory: Types.ObjectId[];
  image?: string;
}

const CustomerUserSchema = new Schema<ICustomerUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  storeId: { type: String, required: true },
  realEmail: { type: String, required: true },
  orderHistory: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  image: { type: String },
}, {
  timestamps: true,
});

const CustomerUser: Model<ICustomerUser> =
  mongoose.models.customer_user || mongoose.model<ICustomerUser>("customer_user", CustomerUserSchema);

export default CustomerUser;
