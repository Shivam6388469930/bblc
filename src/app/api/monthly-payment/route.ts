import { connectDB } from "@/app/utils/database";
import { NextRequest, NextResponse } from "next/server";
import MonthlyFee from "@/app/models/monthlyFee";
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
      plan,
      amount,
      startDate,
      endDate,
      paymentStatus,
      order_id,
      razorpay_payment_id,
    } = body;

    // Validate required fields
    if (
      !userName ||
      !userEmail ||
      !plan ||
      !amount ||
      !paymentStatus ||
      !order_id ||
      !razorpay_payment_id
    ) {
      return createErrorResponse("Missing required fields", 400);
    }

    // Calculate end date if not provided (1 month from start date)
    const calculatedStartDate = startDate ? new Date(startDate) : new Date();
    const calculatedEndDate = endDate 
      ? new Date(endDate) 
      : new Date(calculatedStartDate.setMonth(calculatedStartDate.getMonth() + 1));

    // Save the monthly payment
    const saveMonthlyPayment = await MonthlyFee.create({
      userName,
      userEmail,
      plan,
      amount,
      startDate: calculatedStartDate,
      endDate: calculatedEndDate,
      paymentStatus,
      order_id,
      razorpay_payment_id,
    });

    if (!saveMonthlyPayment) {
      return createErrorResponse("Failed to save monthly payment", 500);
    }

    return NextResponse.json(
      { message: "Monthly payment saved successfully", payment: saveMonthlyPayment },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in /api/monthly-payment POST:", error.message || error);
    return createErrorResponse("Server error", 500);
  }
}

// Get monthly payment history for a user
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");
    const isAdmin = searchParams.get("isAdmin") === "true";
    const activeOnly = searchParams.get("activeOnly") === "true";

    let query: any = {};
    if (isAdmin) {
      // Admin: get all monthly payments, optionally filter by userEmail
      if (userEmail) query.userEmail = userEmail;
    } else {
      // User: must provide userEmail
      if (!userEmail) {
        return createErrorResponse("User email is required", 400);
      }
      query = { userEmail };
    }
    if (activeOnly) {
      query.isActive = true;
    }

    const paymentHistory = await MonthlyFee.find(query).sort({ createdAt: -1 });

    // Always return 200, even if no data
    return NextResponse.json(
      { message: paymentHistory.length ? "Monthly payment history retrieved" : "No monthly payment history found", data: paymentHistory },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in /api/monthly-payment GET:", error.message || error);
    return createErrorResponse("Server error", 500);
  }
}
