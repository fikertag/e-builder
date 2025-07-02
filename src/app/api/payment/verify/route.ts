import { NextRequest, NextResponse } from "next/server";
import Order from "@/model/order";
import Store from "@/model/store";
import Payment from "@/model/payment";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const orderId = form.get("orderId");
  const storeId = form.get("storeId");
  const method = form.get("method");
  const transactionId = form.get("transactionId");
  // const screenshot = form.get("screenshot"); // handle file upload if needed

  if (!orderId || !storeId || !method || !transactionId) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  // 1. Fetch order
  const order = await Order.findById(orderId);
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // 2. Fetch store
  const store = await Store.findById(storeId);
  if (!store)
    return NextResponse.json({ error: "Store not found" }, { status: 404 });

  // 3. Get integration info
  let integration: any = undefined;
  if (typeof method === "string") {
    integration = (store.integrations as Record<string, any>)[method];
  }
  if (!integration)
    return NextResponse.json(
      { error: "Store integration not found" },
      { status: 400 }
    );

  // 4. Call payment verification API
  let verifyData;
  try {
    const verifyRes = await fetch(
      "https://verifyapi.leulzenebe.pro/verify-" + method,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${process.env.VERIFY_API}`,
        },
        body: JSON.stringify({ reference: transactionId }),
      }
    );
    verifyData = await verifyRes.json();
  } catch (e) {
    return NextResponse.json(
      { error: "Verification API error" },
      { status: 500 }
    );
  }

  // 5. Check verification
  let isAccountMatch = false;
  let isNameMatch = false;
  let isAmountMatch = false;
  let isSuccess = false;
  let paidAmount = 0;

  if (method === "cbe") {
    isAccountMatch = verifyData.receiverAccount === integration.account;
    isNameMatch = verifyData.receiver === integration.name;
    paidAmount = parseFloat((verifyData.amount || "0").replace(/[^0-9.]/g, ""));
    isAmountMatch = paidAmount === order.total;
    isSuccess =
      verifyData.success &&
      (!verifyData.status || verifyData.status === "Completed");
  } else if (method === "telebirr") {
    const data = verifyData.data || verifyData;
    isAccountMatch = data.creditedPartyAccountNo === integration.account;
    isNameMatch = data.creditedPartyName === integration.name;
    paidAmount = parseFloat(
      (data.totalPaidAmount || "0").replace(/[^0-9.]/g, "")
    );
    isAmountMatch = paidAmount === order.total;
    isSuccess = data.success && data.transactionStatus === "Completed";
  }

  let paymentStatus = "failed";
  if (isAccountMatch && isNameMatch && isAmountMatch && isSuccess) {
    paymentStatus = "verified";
    order.status = "paid";
  }

  // 6. Save payment
  const payment = await Payment.create({
    method,
    transactionId,
    status: paymentStatus,
    amount: order.total,
    rawDetails: verifyData,
    // screenshotUrl: ... (handle file upload if needed)
  });

  // 7. Link payment to order and save
  order.payment = payment._id as typeof order.payment; // Explicitly type as Types.ObjectId
  await order.save();

  if (paymentStatus === "verified") {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json(
      { success: false, error: "Verification failed" },
      { status: 400 }
    );
  }
}
