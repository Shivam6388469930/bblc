import { connectDB } from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server";
import Fee from "@/app/models/fee";
import mongoose from "mongoose";

const createErrorResponse = (message: string, status: number) =>
  NextResponse.json({ message }, { status });

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const {
      userName,
      userEmail,
      course,
      registrationFee,
      paymentStatus,
      order_id,
      razorpay_payment_id,
    } = body;

    if (
      !userName ||
      !userEmail ||
      !course ||
      !registrationFee ||
      !paymentStatus ||
      !order_id ||
      !razorpay_payment_id
    ) {
      return createErrorResponse("Missing required fields", 400);
    }

    const savePayment = await Fee.create({
      userName,
      userEmail,
      course,
      registrationFee,
      paymentStatus,
      order_id,
      razorpay_payment_id,
    });

    if (!savePayment) {
      return createErrorResponse("Failed to save payment", 500);
    }

    return NextResponse.json(
      { message: "Payment saved successfully", savePayment },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in /api/payment POST:", error.message || error);
    return createErrorResponse("Server error", 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return createErrorResponse("User email is required", 400);
    }

    const paymentHistory = await Fee.find({ userEmail });

    if (!paymentHistory || paymentHistory.length === 0) {
      return createErrorResponse("No payment history found", 404);
    }

    return NextResponse.json(
      { message: "Payment history retrieved", data: paymentHistory },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in /api/payment GET:", error.message || error);
    return createErrorResponse("Server error", 500);
  }
}

