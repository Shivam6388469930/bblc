

"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface DashboardStats {
  totalUsers: number;
  totalSubscriptions: number;
  expiredUsers: number;
  totalEarning: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/admin/dashboard-stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        } else {
          setError(data.message || 'Failed to load stats');
        }
      } catch (err) {
        setError('Error loading stats');
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto mb-5">
    <div className="flex justify-between items-center px-6 py-4 bg-gray-100 rounded-lg shadow-md">
  <h1 className="text-3xl font-bold text-blue-500">Admin Dashboard</h1>
  <a className="bg-green-500 hover:bg-green-600 text-white text-lg font-semibold py-2 px-4 rounded shadow" href='/admin/register'>
    Add New Admin
  </a>
</div>
<h1></h1>
     

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-5">
        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-4xl font-bold text-blue-600">{loading ? '...' : stats?.totalUsers ?? 0}</div>
          <div className="mt-2 text-gray-600">Total Users</div>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-4xl font-bold text-green-600">{loading ? '...' : stats?.totalSubscriptions ?? 0}</div>
          <div className="mt-2 text-gray-600">Active Subscriptions</div>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-4xl font-bold text-red-600">{loading ? '...' : stats?.expiredUsers ?? 0}</div>
          <div className="mt-2 text-gray-600">Expired Users</div>
        </div>
        <div className="bg-white rounded shadow p-6 text-center">
          <div className="text-4xl font-bold text-yellow-600">{loading ? '...' : `₹${stats?.totalEarning?.toLocaleString() ?? 0}`}</div>
          <div className="mt-2 text-gray-600">Total Earning</div>
        </div>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Quick Links */}
       <h2 className="text-xl font-semibold mb-4">Quick Link</h2>
      <div className="flex flex-col gap-6">
        <div className="bg-white rounded shadow p-6">
         
          <ul className="space-y-2 flex justify-around">
            <li className=''>
              <Link href="/admin/attendece" className="text-blue-600 hover:underline">Attendence</Link>
            </li>
            <li>
              <Link href="/admin/user" className="text-blue-600 hover:underline">User Management</Link>
            </li>
            <li>
              <Link href="/admin/allpayments" className="text-blue-600 hover:underline">All Payments</Link>
            </li>
              <li>
              <Link href="/admin/monthly-fees" className="text-blue-600 hover:underline">Monthly Fees</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
