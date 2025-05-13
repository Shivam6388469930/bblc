import { connectDB } from "@/app/utils/database";
import { NextResponse } from "next/server";
import Attendance from "../../models/attendence";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userName, userEmail, date, value } = await req.json();

    await connectDB(); // ✅ Make sure to await the DB connection

    const newFee = new Attendance({
      userName,
      userEmail,
      date,
      value,
    });

    await newFee.save(); // ✅ Actually save the fee record

    return NextResponse.json({ message: "Fee record created successfully", fee: newFee }, { status: 201 });

  } catch (error) {
    console.error("Error creating fee:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
