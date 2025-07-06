import User from '@/app/models/user';
import MonthlyFee from '@/app/models/monthlyFee';
import { connectDB } from '@/app/utils/database';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    // Total users (excluding admin)
    const totalUsers = await User.countDocuments({ role: 'user' });
    // Total subscriptions (active monthly fees)
    const totalSubscriptions = await MonthlyFee.countDocuments({ isActive: true });

    // Expired users: users whose latest (most recent) subscription is expired
    const latestSubs = await MonthlyFee.aggregate([
      { $sort: { userEmail: 1, endDate: -1 } },
      { $group: {
          _id: "$userEmail",
          latest: { $first: "$ROOT" }
      }}
    ]);
    const expiredUsers = latestSubs.filter(sub => sub.latest && sub.latest.isActive === false).length;

    // Total earning (sum of all monthly fees, regardless of paymentStatus)
    const earningAgg = await MonthlyFee.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalEarning = earningAgg[0]?.total || 0;
    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalSubscriptions,
        expiredUsers,
        totalEarning,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
