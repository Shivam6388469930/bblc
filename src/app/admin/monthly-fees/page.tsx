'use client';
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';

export default function AdminMonthlyFeesPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [filteredPayments, setFilteredPayments] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'expired'

  // Fetch all monthly fee payments
  useEffect(() => {
    async function fetchAllMonthlyPayments() {
      try {
        const res = await fetch(`/api/monthly-payment?isAdmin=true`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch payment data');
        }

        // Use real API data
        setPayments(data.data || []);
        setFilteredPayments(data.data || []);
      } catch (err: any) {
        console.error('Error fetching payments:', err);
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchAllMonthlyPayments();
  }, []);

  // Filter payments based on search and active status
  useEffect(() => {
    let filtered = payments;
    
    // Filter by email search
    if (searchEmail) {
      filtered = filtered.filter(payment => 
        payment.userEmail.toLowerCase().includes(searchEmail.toLowerCase()) ||
        payment.userName.toLowerCase().includes(searchEmail.toLowerCase())
      );
    }
    
    // Filter by active status
    if (activeFilter === 'active') {
      filtered = filtered.filter(payment => payment.isActive);
    } else if (activeFilter === 'expired') {
      filtered = filtered.filter(payment => !payment.isActive);
    }
    
    setFilteredPayments(filtered);
  }, [searchEmail, activeFilter, payments]);

  // Generate PDF report for a payment
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
    doc.text('This is an official receipt from BBLC.', 105, 135, { align: 'center' });
    doc.text('For any queries, please contact admin@bblc.com', 105, 142, { align: 'center' });
    
    // Save the PDF
    doc.save(`BBLC_Monthly_Receipt_${payment._id}.pdf`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-500">Financial Management</h1>
      
      {/* Search and Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-1/2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search by Name or Email</label>
            <input
              type="text"
              id="search"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Enter name or email..."
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div className="w-full md:w-1/3">
            <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              id="filter"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Subscriptions</option>
              <option value="active">Active Subscriptions</option>
              <option value="expired">Expired Subscriptions</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2">Loading payment data...</p>
        </div>
      )}
      
      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Data Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                  {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.userName}</div>
                            <div className="text-sm text-gray-500">{payment.userEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.plan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{payment.amount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(payment.startDate).toLocaleDateString('en-IN')} to {new Date(payment.endDate).toLocaleDateString('en-IN')}
                        </div>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${payment.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {payment.isActive ? 'Active' : 'Expired'}
                        </span>
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => generatePDF(payment)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Download Receipt
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No payments found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
