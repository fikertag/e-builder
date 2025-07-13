import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Theme from "@/model/theme";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();

    const theme = await Theme.create(body);
    return NextResponse.json(theme, { status: 201 });
  } catch (error) {
    console.error("Error creating theme:", error);
    return NextResponse.json(
      { message: "Failed to create theme", error },
      { status: 500 }
    );
  }
}
