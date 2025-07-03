import { NextResponse } from 'next/server';
import { connectDB } from '@/app/utils/database';
import User from '@/app/models/user';

// DELETE /api/admin/deleteUser → with ID in request body
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "User ID is required." }, { status: 400 });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully.", data: deletedUser }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ success: false, message: "Failed to delete user." }, { status: 500 });
  }
}
