"use client";
import React, { useEffect, useState } from "react";

interface Payment {
  _id: string;
  userName: string;
  userEmail: string;
  amount: number;
  paymentType: string;
  paymentStatus: string;
  createdAt: string;
}

export default function AdminAllPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const fetchPayments = async (email = "") => {
    setLoading(true);
    setError("");
    try {
      let url = "/api/admin/allpayments";
      if (email) url += `?email=${encodeURIComponent(email)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setPayments(data.data);
      } else {
        setError(data.message || "Failed to fetch payments");
      }
    } catch (err) {
      setError("Error fetching payments");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchPayments(searchEmail);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Payment History</h1>
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          type="email"
          placeholder="Filter by user email"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border px-3 py-2 rounded w-64"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
        <button type="button" onClick={() => { setSearchEmail(""); fetchPayments(); }} className="ml-2 px-4 py-2 rounded border">Reset</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">User Name</th>
                <th className="p-2 border">User Email</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p: Payment) => (
                <tr key={p._id} className="text-center">
                  <td className="p-2 border">{p.userName}</td>
                  <td className="p-2 border">{p.userEmail}</td>
                  <td className="p-2 border">₹{p.amount}</td>
                  <td className="p-2 border">{p.paymentType}</td>
                  <td className="p-2 border">{p.paymentStatus}</td>
                  <td className="p-2 border">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
