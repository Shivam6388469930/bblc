import { connectDB } from "@/app/utils/database";
import { NextResponse } from "next/server";
import Fee from "../../models/fee";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get('userEmail');

    if (!userEmail) {
      return NextResponse.json({ 
        message: "User email is required" 
      }, { status: 400 });
    }

    // Check if user has paid registration fee
    const registrationPayment = await Fee.findOne({ 
      userEmail,
      paymentStatus: 'Paid'
    });

    const hasRegistrationFee = !!registrationPayment;

    return NextResponse.json({
      message: "Registration status checked successfully",
      hasRegistrationFee,
      registrationDetails: registrationPayment || null
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error checking registration:", error);
    return NextResponse.json({ 
      message: "Internal Server Error",
      error: error.message || "Unknown error occurred"
    }, { status: 500 });
  }
}
