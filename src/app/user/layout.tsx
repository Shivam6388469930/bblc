// app/admin/layout.tsx
import React from 'react';
import Footer from '../component/Footer';
import Navbar from './component/Navber';


export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen pt-20">

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <Navbar/>
       
        {children}
       <Footer/>
      </main>
    </div>
  );
}
