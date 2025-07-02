import mongoose, { Schema, Model, Document } from "mongoose";

export interface IPayment extends Document {
  method: "cbe" | "telebirr";
  transactionId?: string;
  screenshotUrl?: string;
  status: "pending" | "verified" | "failed";
  amount: number;
  createdAt: Date;
  rawDetails?: object;
  payerName?: string;
  payerAccount?: string;
  receiverName?: string;
  receiverAccount?: string;
  paymentDate?: Date;
  receiptNo?: string;
  reason?: string;
  serviceFeeVAT?: string;
  totalPaidAmount?: string;
}

const PaymentSchema = new Schema<IPayment>({
  method: { type: String, enum: ["cbe", "telebirr"], required: true },
  transactionId: { type: String },
  screenshotUrl: { type: String },
  status: {
    type: String,
    enum: ["pending", "verified", "failed"],
    default: "pending",
  },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  rawDetails: { type: Schema.Types.Mixed },
  payerName: { type: String },
  payerAccount: { type: String },
  receiverName: { type: String },
  receiverAccount: { type: String },
  paymentDate: { type: Date },
  receiptNo: { type: String },
  reason: { type: String },
  serviceFeeVAT: { type: String },
  totalPaidAmount: { type: String },
});

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
