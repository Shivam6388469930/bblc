'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { jsPDF } from 'jspdf';

export default function Page() {
  const [payments, setPayments] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPayments() {
      const userEmail = "agraharishivam6388@gmail.com";
      if (!userEmail) {
        setError('User email not found');
        return;
      }
      try {
        const res = await fetch(`/api/payment?userEmail=${userEmail}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch payment');
        if (!Array.isArray(data.data) || data.data.length === 0) {
          throw new Error('No payment history found');
        }

        setPayments(data.data); // Array of payments
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Unknown error occurred');
      }
    }

    fetchPayments();
  }, []);

  // Function to download an individual invoice as PDF
  const downloadPDF = (invoice: any) => {
    const doc = new jsPDF();

    // Company Info
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.text("BBLC", 20, 20);
    doc.text("Connect with us: +91 123 456 7890", 20, 30);
    doc.text("Address: 123 Business Lane, Business City, India", 20, 40);
    doc.setLineWidth(0.5);
    doc.line(10, 45, 200, 45);

    // Title
    doc.setFontSize(18);
    doc.setFont('times', 'bold');
    doc.text("Payment Invoice", 105, 60, { align: "center" });
    doc.line(10, 62, 200, 62);

    // Invoice Info
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    doc.text(`Name: ${invoice.userName || 'N/A'}`, 20, 75);
    doc.text(`Email: ${invoice.userEmail || 'N/A'}`, 20, 85);
    doc.text(`Course: ${invoice.course || 'N/A'}`, 20, 95);
    doc.text(`Payment Status: ${invoice.paymentStatus}`, 20, 105);
    doc.text(`Order ID: ${invoice.order_id}`, 20, 115);
    doc.text(`Razorpay Payment ID: ${invoice.razorpay_payment_id}`, 20, 125);
    doc.text(`Amount Paid: ₹ ${invoice.registrationFee || 'Not Available'}`, 20, 135);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleString()}`, 20, 145);

    // Footer
    doc.setLineWidth(0.5);
    doc.line(10, 155, 200, 155);
    doc.setFontSize(10);
    doc.setFont('times', 'italic');
    doc.text('Thank you for your payment!', 105, 165, { align: 'center' });

    doc.save(`invoice_${invoice._id}.pdf`);
  };

  return (
    <>
      <div className="w-full h-[300px] relative">
        <Image
          src="/heroimg/pexels-pixabay-159775.jpg"
          alt="Facilities Banner"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 mt-20 "
        />
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white text-4xl font-extrabold">
          <h1>Our Facilities</h1>
        </div>
      </div>



      <div className="p-6 mt-12 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Payment Invoices</h1>

        {error && <p className="text-red-600 text-center">{error}</p>}

        {!error && payments.length === 0 && (
          <p className="text-center">Loading payment history...</p>
        )}

        {payments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments.map((invoice, index) => (
              <div
                key={invoice._id || index}
                className="border rounded-lg shadow-md p-6 bg-white"
              >
                <h2 className="text-xl font-semibold mb-3">Invoice Details</h2>
                <p><strong>Name:</strong> {invoice.userName || 'N/A'}</p>
                <p><strong>Email:</strong> {invoice.userEmail || 'N/A'}</p>
                <p><strong>Course:</strong> {invoice.course || 'N/A'}</p>
                <p><strong>Status:</strong> {invoice.paymentStatus}</p>
                <p><strong>Order ID:</strong> {invoice.order_id}</p>
                <p><strong>Payment ID:</strong> {invoice.razorpay_payment_id}</p>
                <p><strong>Amount Paid:</strong> ₹{invoice.registrationFee || 'N/A'}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Date: {new Date(invoice.createdAt).toLocaleString()}
                </p>

                <button
                  onClick={() => downloadPDF(invoice)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
