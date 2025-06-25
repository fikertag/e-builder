import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/model/order";

// GET /api/order?store=<storeId>&limit=<n>
export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const store = searchParams.get("store");
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  if (!store) {
    return NextResponse.json({ message: "Missing store id" }, { status: 400 });
  }
  try {
    const orders = await Order.find({ store })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch orders", error },
      { status: 500 }
    );
  }
}
