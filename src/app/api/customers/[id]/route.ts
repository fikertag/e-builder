import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import CustomerUser from "@/model/cusomer_user";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  await dbConnect();
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: "Invalid store ID." },
      { status: 400 }
    );
  }
  try {
    const customer = await CustomerUser.findOne({ storeId: id }).lean();
    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found for this store ID." },
        { status: 404 }
      );
    }
    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to fetch customer", error },
      { status: 500 }
    );
  }
}