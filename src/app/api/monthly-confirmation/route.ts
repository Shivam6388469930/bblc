import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const {
    userName,
    userEmail,
    plan,
    amount,
    startDate,
    endDate,
    paymentStatus,
    order_id,
    razorpay_payment_id,
    isFirstTimePayment = false,
    registrationFee = 0
  } = await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "agraharishivam6388@gmail.com",       // Your Gmail address
      pass: "dpll htzh zjhi vjjs"     // App password, not your real password
    },
  });

  // Format dates for display
  const formattedStartDate = new Date(startDate).toLocaleDateString('en-IN');
  const formattedEndDate = new Date(endDate).toLocaleDateString('en-IN');

  const mailOptions = {
    from: "agraharishivam6388@gmail.com",
    to: userEmail,
    subject: isFirstTimePayment
      ? `🎉 BBLC Registration + Monthly Fee Payment Confirmation - ${plan} Plan`
      : `📩 BBLC Monthly Fee Payment Confirmation - ${plan} Plan`,
    text: `
Hello ${userName},

${isFirstTimePayment
  ? 'Welcome to BBLC! Thank you for your registration and monthly fee payment.'
  : 'Thank you for your monthly fee payment at BBLC.'
}

Payment Details:
${isFirstTimePayment ? `- Registration Fee: ₹${registrationFee}` : ''}
- Plan: ${plan}
- Monthly Fee: ₹${amount - registrationFee}
- Total Amount: ₹${amount}
- Start Date: ${formattedStartDate}
- End Date: ${formattedEndDate}
- Payment Status: ${paymentStatus}
- Order ID: ${order_id}
- Payment ID: ${razorpay_payment_id}

${isFirstTimePayment
  ? `Your registration is complete and your ${plan} plan subscription is now active. You can access all the facilities included in your plan.`
  : `Your subscription is now active. You can access all the facilities included in your ${plan} plan.`
}

Thank you,
BBLC Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
        <h2 style="color: #4a90e2;">${isFirstTimePayment ? '🎉' : '📩'} BBLC ${isFirstTimePayment ? 'Registration + ' : ''}Monthly Fee Payment Confirmation</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>${isFirstTimePayment
          ? 'Welcome to BBLC! Thank you for your registration and monthly fee payment.'
          : 'Thank you for your monthly fee payment at BBLC.'
        }</p>

        <div style="background-color: #fff; border-left: 4px solid #4a90e2; padding: 15px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4a90e2;">Payment Details</h3>
          ${isFirstTimePayment ? `<p><strong>Registration Fee:</strong> ₹${registrationFee}</p>` : ''}
          <p><strong>Plan:</strong> ${plan}</p>
          <p><strong>Monthly Fee:</strong> ₹${amount - registrationFee}</p>
          <p><strong>Total Amount:</strong> ₹${amount}</p>
          <p><strong>Start Date:</strong> ${formattedStartDate}</p>
          <p><strong>End Date:</strong> ${formattedEndDate}</p>
          <p><strong>Payment Status:</strong> ${paymentStatus}</p>
          <p><strong>Order ID:</strong> ${order_id}</p>
          <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
        </div>

        <p>${isFirstTimePayment
          ? `Your registration is complete and your <strong>${plan}</strong> plan subscription is now active. You can access all the facilities included in your plan.`
          : `Your subscription is now active. You can access all the facilities included in your <strong>${plan}</strong> plan.`
        }</p>

        <p>Thank you,<br>BBLC Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
  }
}
