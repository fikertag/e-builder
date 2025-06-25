import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Order from "@/model/order";

// GET /api/order/stats?store=<storeId>
export async function GET(request: Request) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const store = searchParams.get("store");
  if (!store) {
    return NextResponse.json({ message: "Missing store id" }, { status: 400 });
  }
  try {
    const [totalOrders, paidOrders, totalRevenue, recentOrders] =
      await Promise.all([
        Order.countDocuments({ store }),
        Order.countDocuments({ store, status: "paid" }),
        Order.aggregate([
          {
            $match: {
              store:
                typeof store === "string"
                  ? new (await import("mongoose")).Types.ObjectId(store)
                  : store,
              status: "paid",
            },
          },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
        Order.find({ store }).sort({ createdAt: -1 }).limit(5).lean(),
      ]);
    return NextResponse.json(
      {
        totalOrders,
        paidOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        recentOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch stats", error },
      { status: 500 }
    );
  }
}
