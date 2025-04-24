import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/utils/database';   
import User from '@/app/models/user';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const key = 'shivam'; // Ideally, store this in .env file as JWT_SECRET

// LOGIN ROUTE
export async function POST(req: NextRequest) {
  try {
    const { userEmail, userPassword } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({ userEmail });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const isPasswordCorrect = await bcrypt.compare(userPassword, existingUser.userPassword);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.userEmail },
      key,
      { expiresIn: '1d' }
    );

    return NextResponse.json({
       message: "Login successful",
     user:{
      userName: existingUser.userName,
      userEmail: existingUser.userEmail
     },
    token}, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// GET LOGGED IN USER ROUTE
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, key) as { id: string };

    await connectDB();

    const user = await User.findById(decoded.id).select('-userPassword'); // exclude password

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
