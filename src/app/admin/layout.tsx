// app/admin/layout.tsx
import React from 'react';
import Navbar from '../component/Navber'; 
import Footer from '../component/Footer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <ul className="space-y-4">
          <li><a href="/admin/dashboard" className="block hover:text-blue-300 transition-colors">Dashboard</a></li>

          <li>
            <p className="text-gray-400 text-xs uppercase font-semibold mb-2 mt-4">User Management</p>
            <a href="/admin/user" className="block hover:text-blue-300 transition-colors pl-2 py-1">Users</a>
          </li>

          <li>
            <p className="text-gray-400 text-xs uppercase font-semibold mb-2 mt-4">Attendance Management</p>
            <a href="/admin/attendance" className="block hover:text-blue-300 transition-colors pl-2 py-1">Attendance Records</a>
          </li>

          <li>
            <p className="text-gray-400 text-xs uppercase font-semibold mb-2 mt-4">Financial Management</p>
            <a href="/admin/monthly-fees" className="block hover:text-blue-300 transition-colors pl-2 py-1">Monthly Fees</a>
            <a href="/admin/registration-fees" className="block hover:text-blue-300 transition-colors pl-2 py-1">Registration Fees</a>
          </li>

          <li>
            <p className="text-gray-400 text-xs uppercase font-semibold mb-2 mt-4">System</p>
            <a href="/admin/settings" className="block hover:text-blue-300 transition-colors pl-2 py-1">Settings</a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}

      </main>
    </div>
  );
}
