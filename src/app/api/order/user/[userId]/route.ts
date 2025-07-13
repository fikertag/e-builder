import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongoose";
import Order from "@/model/order";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  await dbConnect();

  const { userId } = await params;
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return NextResponse.json({ message: "Invalid user ID." }, { status: 400 });
  }

  try {
    const orders = await Order.find({ customer: userId })
      .sort({ createdAt: -1 })
      .lean();
    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { message: "No orders found for this user." },
        { status: 404 }
      );
    }
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch orders", error },
      { status: 500 }
    );
  }
}
