import { NextResponse } from "next/server";
import Order from "@/model/order";
import mongoose from "mongoose";

// Cancel order endpoint
export async function POST(req: Request) {
  try {
    const { orderId, action } = await req.json();
    if (!orderId || !action) {
      return NextResponse.json({ error: "Missing orderId or action" }, { status: 400 });
    }
    await mongoose.connect(process.env.MONGODB_URI!);
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    if (action === "cancel") {
      if (order.status === "cancelled" || order.status === "delivered") {
        return NextResponse.json({ error: "Order cannot be cancelled" }, { status: 400 });
      }
      order.status = "cancelled";
      await order.save();
      return NextResponse.json({ success: true, status: order.status });
    }
    if (action === "confirm") {
      if (order.status !== "shipped") {
        return NextResponse.json({ error: "Order not in shipped state" }, { status: 400 });
      }
      order.status = "delivered";
      await order.save();
      return NextResponse.json({ success: true, status: order.status });
    }
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
