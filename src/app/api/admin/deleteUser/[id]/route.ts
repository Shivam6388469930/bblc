
import { NextResponse } from 'next/server';
import User from '@/app/models/user';
import { connectDB } from '@/app/utils/database';


// DELETE /api/admin/deleteUser/[id]
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ success: false, message: 'User ID is required.' }, { status: 400 });
  }
  try {
    await connectDB();
    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    // Actually delete the user
    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `User '${user.userName}' deleted successfully.`,
      deletedUser: {
        _id: user._id,
        userName: user.userName,
        userEmail: user.userEmail,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
