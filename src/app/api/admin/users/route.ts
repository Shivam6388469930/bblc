import { connectDB } from "@/app/utils/database";
import { NextResponse } from "next/server";
import User from "../../../models/user";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("👥 Fetching users for admin...");

    await connectDB();
    console.log("✅ Database connected");

    // Fetch all users with role 'user' (exclude admins from attendance marking)
    const users = await User.find({ role: 'user' })
      .select('userName userEmail role createdAt')
      .sort({ userName: 1 });

    console.log(`✅ Found ${users.length} users`);

    return NextResponse.json({
      message: "Users retrieved successfully",
      users: users
    }, { status: 200 });

  } catch (error: any) {
    console.error("❌ Error fetching users:", error);
    console.error("❌ Error stack:", error.stack);

    return NextResponse.json({
      message: "Internal Server Error",
      error: error.message || "Unknown error occurred"
    }, { status: 500 });
  }
}
