import { NextResponse } from 'next/server';
import { connectDB } from '@/app/utils/database';
import User from '@/app/models/user';
// GET /api/user - Get all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch users." }, { status: 500 });
  }
}
