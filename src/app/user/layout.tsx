// app/admin/layout.tsx
import React from 'react';
import Navbar from '../component/Navber';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen pt-20">
     
      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <Navbar/>
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        {children}
      </main>
    </div>
  );
}
