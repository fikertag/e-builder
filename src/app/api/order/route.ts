import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/model/order";
import CustomerUser from "@/model/cusomer_user";

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

// POST /api/order
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    // Basic validation
    if (!body.store) {
      return NextResponse.json(
        { message: "Missing store id" },
        { status: 400 }
      );
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { message: "Order must have at least one item" },
        { status: 400 }
      );
    }

    // Create order
    const order = await Order.create(body);

    // If customer exists, add order to user's orders field
    if (body.customer) {
      console.log("there is user userId", body.customer)
      await CustomerUser.findByIdAndUpdate(body.customer,{ $push: { orderHistory: order._id }});
    }

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Failed to create order", error },
      { status: 500 }
    );
  }
}
