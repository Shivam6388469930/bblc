import Admin from '@/app/models/admin';
import { NextResponse } from 'next/server';
import { connectDB } from '@/app/utils/database';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    // Destructure the data from the request body
    const { name, email, password } = await req.json();

    // Log incoming data (for debugging)
    console.log('Register request:', { name, email, password });

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    // Connect to the database
    await connectDB();

    // Check if the user already exists
    const existingUser = await Admin.findOne({ userEmail: email });
    if (existingUser) {
      return NextResponse.json({ message: 'Admin already exists' }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin user
    const newAdmin = await Admin.create({
      userName: name,
      userEmail: email,
      userPassword: hashedPassword,
    });

    // Prepare safe response with only necessary fields
    const AdminResponse = {
      _id: newAdmin._id,
      userName: newAdmin.userName,
      userEmail: newAdmin.userEmail,
    };

    return NextResponse.json(
      { message: 'User created successfully', data: AdminResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
