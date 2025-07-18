import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import dbConnect from "@/lib/mongoose";
import mongoose from "mongoose";

await dbConnect();

const db = mongoose.connection.db;

if (!db) {
  throw new Error("Database connection is not established.");
}

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000", "http://ps4store.localhost:3000"],
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    modelName: "customer_users",
    additionalFields: {
      storeId: {
        type: "string",
        required: true,
      },
      realEmail: {
        type: "string",
        required: true,
      },
      phoneNumber: {
        type: "string",
        required: false,
      },
      orderHistory: {
        type: "string[]",
        required: false,
        defaultValue: [],
      },
      address: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  session: {
    modelName: "customer_sessions",
  },
  account: {
    modelName: "customer_accounts",
  },
  verification: {
    modelName: "customer_verifications",
  },
});
