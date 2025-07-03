import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: 'rzp_test_7VXRc8O89d3bz1', // Your test key
  key_secret: '69fFf3BjY8z7Yd3r98gVPmni', // Your test secret
});

export async function POST(req: NextRequest) {
  try {
    const {
      amount,
      plan,
      isFirstTimePayment = false,
      registrationFee = 0,
      planAmount = 0
    }: {
      amount: number,
      plan: string,
      isFirstTimePayment?: boolean,
      registrationFee?: number,
      planAmount?: number
    } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { message: 'Valid amount is required' },
        { status: 400 }
      );
    }

    if (!plan) {
      return NextResponse.json(
        { message: 'Plan is required' },
        { status: 400 }
      );
    }

    const receipt = isFirstTimePayment
      ? `reg_monthly_${plan}_${Date.now()}`
      : `monthly_${plan}_${Date.now()}`;

    const options = {
      amount: amount * 100, // in paisa
      currency: 'INR',
      receipt,
      notes: {
        plan: plan,
        type: isFirstTimePayment ? 'registration_and_monthly_fee' : 'monthly_fee',
        registration_fee: isFirstTimePayment ? registrationFee.toString() : '0',
        plan_amount: planAmount.toString(),
        total_amount: amount.toString(),
        breakdown: isFirstTimePayment
          ? `Registration Fee: ₹${registrationFee}, ${plan} Monthly Plan: ₹${planAmount}, Total: ₹${amount}`
          : `${plan} Monthly Plan: ₹${amount}`,
        // Separate line items for better receipt display
        item_1: isFirstTimePayment ? `Registration Fee: ₹${registrationFee}` : `${plan} Monthly Plan: ₹${amount}`,
        item_2: isFirstTimePayment ? `${plan} Monthly Plan: ₹${planAmount}` : '',
        item_count: isFirstTimePayment ? '2' : '1'
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      {
        message: 'Monthly fee order created successfully',
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        plan: plan
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error('Razorpay Error:', err);
    return NextResponse.json(
      {
        message: 'Monthly fee order creation failed',
        error: err?.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
