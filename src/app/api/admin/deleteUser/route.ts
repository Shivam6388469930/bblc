
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/utils/database';
import User from '@/app/models/user';

// POST /api/admin/deleteUser → with userId in request body
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId } = body;
    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required." }, { status: 400 });
    }
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "User deleted successfully.", data: deletedUser }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ success: false, message: "Failed to delete user." }, { status: 500 });
  }
}

// PATCH /api/admin/deleteUser → update user status (Active/Expired/Registered)
import MonthlyFee from '@/app/models/monthlyFee';
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, newStatus } = body;
    if (!userId || !newStatus) {
      return NextResponse.json({ success: false, message: "User ID and new status are required." }, { status: 400 });
    }
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }
    // Update status in MonthlyFee (latest record)
    const latestFee = await MonthlyFee.findOne({ userEmail: user.userEmail }).sort({ endDate: -1 });
    if (!latestFee) {
      return NextResponse.json({ success: false, message: "No payment record found for user." }, { status: 404 });
    }
    if (newStatus === 'Active') {
      latestFee.isActive = true;
    } else if (newStatus === 'Expired') {
      latestFee.isActive = false;
    } else if (newStatus === 'Registered') {
      // Optionally, you could delete all MonthlyFee records for this user or set isActive to false
      latestFee.isActive = false;
    }
    await latestFee.save();
    return NextResponse.json({ success: true, message: "User status updated successfully.", data: latestFee }, { status: 200 });
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json({ success: false, message: "Failed to update user status." }, { status: 500 });
  }
}
