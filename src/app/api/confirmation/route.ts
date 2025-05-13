import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    const { userName, userEmail, course, amount, paymentStatus, order_id, razorpay_payment_id }= await req.json();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "agraharishivam6388@gmail.com",       // Your Gmail address
      pass:  "dpll htzh zjhi vjjs"     // App password, not your real password
    },
  });

  const mailOptions = {
    from: "agraharishivam6388@gmail.com",
    to: userEmail,
    subject: `📩 Message from BBLC - Received from ${userName}`,
    text: `
  Hello,
  
  You have received payement confirmatiom for registration  from the BBLC ${course}.
  
   Name: ${userName}
   Email: ${userEmail}
   paymentStatus: ${paymentStatus}
    order_id: ${order_id}
    Amount: ${amount}
    razorpay_payment_id: ${razorpay_payment_id}

  
  Thank you,
  BBLC Team
    `,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;">
        <h2 style="color: #4a90e2;">📩 Message from BBLC</h2>
        <h2 style="color: #4a90e2;">📩 Payment Successful</h2>
        <p><strong> Name:</strong> ${userName}</p>
        <p><strong> Email:</strong> ${userEmail}</p>
        <p><strong>paymentStatus:</strong> ${paymentStatus}</p>
        <p><strong>order_id:</strong> ${order_id}</p>
        <p><strong>Amount:</strong> ${amount}</p>
        <p><strong>payment_id:</strong></p>
        <blockquote style="background-color: #f1f1f1; padding: 15px; border-left: 4px solid #4a90e2;">
            ${razorpay_payment_id}
        </blockquote>
        <p style="margin-top: 20px;">We are contact witin a 24 hours</p>
        <p style="margin-top: 20px;">Thank you for reaching out to us!</p>
        <p style="margin-top: 30px;">Regards,<br><strong>BBLC Team</strong></p>
      </div>
    `,
  };
  

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: "Email sent successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
