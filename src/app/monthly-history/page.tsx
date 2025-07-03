'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { jsPDF } from "jspdf";

export default function MonthlyHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMonthlyPayments() {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) {
        setError('User email not found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/monthly-payment?userEmail=${userEmail}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch payment history');
        if (!Array.isArray(data.data) || data.data.length === 0) {
          throw new Error('No monthly payment history found');
        }

        setPayments(data.data); // Array of payments
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchMonthlyPayments();
  }, []);

  // Generate PDF receipt
  const generatePDF = (payment: any) => {
    const doc = new jsPDF();

    // Add BBLC logo/header
    doc.setFontSize(22);
    doc.setTextColor(0, 51, 153);
    doc.text("BBLC - Baba Bamokhar Library Centre", 105, 20, { align: 'center' });

    // Receipt title
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("Monthly Fee Receipt", 105, 30, { align: 'center' });

    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    // Payment details
    doc.setFontSize(12);
    doc.text("Receipt Details", 20, 45);

    // Format dates
    const startDate = new Date(payment.startDate).toLocaleDateString('en-IN');
    const endDate = new Date(payment.endDate).toLocaleDateString('en-IN');
    const paymentDate = new Date(payment.createdAt).toLocaleDateString('en-IN');

    // Payment info table
    doc.setFontSize(10);
    doc.text("Name:", 20, 55);
    doc.text(payment.userName, 70, 55);

    doc.text("Email:", 20, 62);
    doc.text(payment.userEmail, 70, 62);

    doc.text("Plan:", 20, 69);
    doc.text(payment.plan, 70, 69);

    doc.text("Amount:", 20, 76);
    doc.text(`₹${payment.amount}`, 70, 76);

    doc.text("Payment Date:", 20, 83);
    doc.text(paymentDate, 70, 83);

    doc.text("Start Date:", 20, 90);
    doc.text(startDate, 70, 90);

    doc.text("End Date:", 20, 97);
    doc.text(endDate, 70, 97);

    doc.text("Payment Status:", 20, 104);
    doc.text(payment.paymentStatus, 70, 104);

    doc.text("Payment ID:", 20, 111);
    doc.text(payment.razorpay_payment_id, 70, 111);

    doc.text("Order ID:", 20, 118);
    doc.text(payment.order_id, 70, 118);

    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(20, 125, 190, 125);

    // Footer
    doc.setFontSize(10);
    doc.setFont('times', 'italic');
    doc.text('Thank you for your payment!', 105, 135, { align: 'center' });
    doc.text('This is a computer-generated receipt and does not require a signature.', 105, 142, { align: 'center' });

    // Save the PDF
    doc.save(`BBLC_Monthly_Receipt_${payment._id}.pdf`);
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="w-full h-[300px] relative">
        <Image
          src="/heroimg/pexels-pixabay-159775.jpg"
          alt="Payment History Banner"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 mt-20"
        />
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white text-4xl font-extrabold">
          <h1>Monthly Fee History</h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Your Monthly Payment History</h2>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-2">Loading your payment history...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {!loading && !error && payments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments.map((payment) => (
              <div key={payment._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className={`p-4 text-white ${payment.isActive ? 'bg-green-600' : 'bg-gray-600'}`}>
                  <h3 className="text-xl font-bold">{payment.plan} Plan</h3>
                  <p>{payment.isActive ? 'Active Subscription' : 'Expired Subscription'}</p>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <p className="text-gray-600">Amount</p>
                    <p className="text-2xl font-bold">₹{payment.amount}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-600">Start Date</p>
                      <p className="font-medium">{new Date(payment.startDate).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">End Date</p>
                      <p className="font-medium">{new Date(payment.endDate).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600">Payment ID</p>
                    <p className="font-medium text-sm truncate">{payment.razorpay_payment_id}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-600">Payment Date</p>
                    <p className="font-medium">{new Date(payment.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>

                  <button
                    onClick={() => generatePDF(payment)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition duration-300"
                  >
                    Download Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && payments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">No Payment History Found</h3>
            <p className="text-xl text-gray-600 mb-6">You don't have any monthly payment history yet.</p>
            <p className="text-gray-500 mb-8">Make your first monthly fee payment to access BBLC facilities and services.</p>
            <a
              href="/monthly-fee"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition duration-300 shadow-md"
            >
              Make Your First Payment
            </a>
          </div>
        )}
      </div>
    </>
  );
}
