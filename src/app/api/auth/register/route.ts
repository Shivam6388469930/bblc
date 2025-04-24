import User from '@/app/models/user';
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/utils/database';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { userName, userEmail, userPassword, role } = await req.json();

    // Log incoming data (for debugging)
    console.log('Register request:', { userName, userEmail, userPassword, role });

    // Basic validation
    if (!userName || !userEmail || !userPassword || !role) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ userEmail });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // Create new user
    const newUser = await User.create({
      userName,
      userEmail,
      userPassword: hashedPassword,
      role,
    });

    // Prepare safe response
    const userResponse = {
      _id: newUser._id,
      userName: newUser.userName,
      userEmail: newUser.userEmail,
      role: newUser.role,
    };

    return NextResponse.json(
      { message: 'User created successfully', data: userResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
