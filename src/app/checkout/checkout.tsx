"use client";
import { useEffect } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayButton: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    const res = await fetch('/api/create-order', { method: 'POST' });
    const order = await res.json();

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      amount: order.amount,
      currency: order.currency,
      name: 'My Shop',
      description: 'Test Transaction',
      order_id: order.id,
      handler: (response: any) => {
        alert(`Payment ID: ${response.razorpay_payment_id}`);
        // You can also POST this to your backend for verification
      },
      prefill: {
        name: 'John Doe',
        email: 'john@example.com',
        contact: '9999999999',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return <button onClick={handlePayment}>Pay ₹500</button>;
};

export default RazorpayButton;
