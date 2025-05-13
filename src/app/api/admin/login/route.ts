import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/utils/database';
import Admin from '@/app/models/admin'; // Admin model
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';

const key = process.env.JWT_SECRET || 'defaultSecret'; // Use env variable for secret key

// LOGIN ROUTE
export async function POST(req: NextRequest) {
  try {
    const { userEmail, userPassword } = await req.json();

    // Connect to DB
    await connectDB();

    // Find the user by email
    const existingUser = await Admin.findOne({ userEmail });
    if (!existingUser) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordCorrect = await bcrypt.compare(userPassword, existingUser.userPassword);
    if (!isPasswordCorrect) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Generate a JWT token with a 1-day expiry
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.userEmail },
      key,
      { expiresIn: '1d' }
    );

    // Respond with a success message and token
    return NextResponse.json({
      message: "Login successful",
      user: {
        userName: existingUser.userName,
        userEmail: existingUser.userEmail,
      },
      token,
    }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// GET LOGGED IN USER ROUTE
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    // Check for authorization header and Bearer token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, key) as { id: string };

    // Connect to DB
    await connectDB();

    // Find the user by ID and exclude the password
    const user = await Admin.findById(decoded.id).select('-userPassword');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Return user details (excluding password)
    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    console.error('Auth error:', error);

    // Handle invalid token or expired token scenario
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ message: 'Token expired' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
