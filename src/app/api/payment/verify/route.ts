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

  console.log("Received form data:", {
    orderId,
    storeId,
    method,
    transactionId,
  });

  if (!orderId || !storeId || !method || !transactionId) {
    console.error("Missing required fields", {
      orderId,
      storeId,
      method,
      transactionId,
    });
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  // 1. Fetch order
  const order = await Order.findById(orderId);
  console.log("Fetched order:", order);
  if (!order)
    return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // 2. Fetch store
  const store = await Store.findById(storeId);
  console.log("Fetched store:", store);
  if (!store)
    return NextResponse.json({ error: "Store not found" }, { status: 404 });

  // 3. Get integration info
  let integration: any = undefined;
  if (typeof method === "string") {
    integration = (store.integrations as Record<string, any>)[method];
  }
  console.log("Integration info:", integration);
  if (!integration)
    return NextResponse.json(
      { error: "Store integration not found" },
      { status: 400 }
    );

  // Check if payment with this transactionId already exists for this store
  const existingPayment = await Payment.findOne({
    transactionId,
    method,
    status: { $ne: "failed" },
  });
  if (existingPayment) {
    return NextResponse.json(
      { success: false, error: "This transaction has already been used." },
      { status: 400 }
    );
  }

  // 4. Call payment verification API
  let verifyData;
  try {
    let apiBody: Record<string, string> = { reference: String(transactionId) };
    if (method === "cbe" && integration.account) {
      // For CBE, send accountSuffix (last 8 digits of account)
      apiBody.accountSuffix = "83058901"; // Example account number, replace with actual
    }
    const verifyRes = await fetch(
      "https://verifyapi.leulzenebe.pro/verify-" + method,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${process.env.VERIFY_API}`,
        },
        body: JSON.stringify(apiBody),
      }
    );
    verifyData = await verifyRes.json();
    console.log("Verification API response:", verifyData);
  } catch (e) {
    console.error("Verification API error", e);
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
    const data = verifyData.data;
    // Only match the last 4 digits of the account number
    const integrationLast4 = integration.number?.slice(-4);
    const creditedLast4 = data.creditedPartyAccountNo?.slice(-4);
    isAccountMatch =
      integrationLast4 && creditedLast4 && integrationLast4 === creditedLast4;
    isNameMatch = data.creditedPartyName === integration.name;
    paidAmount = parseFloat(
      (data.totalPaidAmount || "0").replace(/[^0-9.]/g, "")
    );
    isAmountMatch = paidAmount >= order.total;
    isSuccess = data.transactionStatus === "Completed";
  }

  let paymentStatus = "failed";
  let failReason = "Verification failed";
  if (!isAccountMatch) failReason = "Account number does not match";
  else if (!isNameMatch) failReason = "Account name does not match";
  else if (!isAmountMatch) failReason = "Amount is less than order total";
  else if (!isSuccess) failReason = "Transaction not completed or unsuccessful";
  if (isAccountMatch && isNameMatch && isAmountMatch && isSuccess) {
    paymentStatus = "verified";
    order.status = "paid";
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
    console.log("Payment saved:", failReason);
    return NextResponse.json({ success: true });
  } else {
    // Save failed payment attempt for record
    await Payment.create({
      method,
      transactionId,
      status: paymentStatus,
      amount: order.total,
      rawDetails: verifyData,
      // screenshotUrl: ... (handle file upload if needed)
    });
    return NextResponse.json(
      { success: false, error: failReason },
      { status: 400 }
    );
  }
}
