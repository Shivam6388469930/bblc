import { NextResponse } from 'next/server';
import Payment from '@/app/models/payment';
import { connectDB } from '@/app/utils/database';

// GET /api/admin/allpayments?email=optional
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    let query = {};
    if (email) {
      query = { userEmail: email };
    }
    const payments = await Payment.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
