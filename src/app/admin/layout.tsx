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
        <ul className="space-y-2">
          <li><a href="/admin/dashboard" className="block hover:text-blue-300">Dashboard</a></li>
          <li><a href="/admin/user" className="block hover:text-blue-300">Users</a></li>
          <li><a href="/admin/settings" className="block hover:text-blue-300">Settings</a></li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
        
      </main>
    </div>
  );
}
