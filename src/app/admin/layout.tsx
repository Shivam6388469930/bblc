// // "use client";
// // // app/admin/layout.tsx
// // import React, { useEffect, useState } from 'react';

// // export default function AdminLayout({ children }: { children: React.ReactNode }) {
// //   const [hasToken, setHasToken] = useState(false);


// //   useEffect(() => {
// //     if (typeof window !== 'undefined') {
// //       const checkToken = () => setHasToken(!!localStorage.getItem('token'));
// //       checkToken();
// //       const onStorage = (e: StorageEvent) => {
// //         if (e.key === 'token') checkToken();
// //       };
// //       window.addEventListener('storage', onStorage);
// //       return () => window.removeEventListener('storage', onStorage);
// //     }
// //   }, []);

// //   return (
// //     <div className="flex min-h-screen ">
// //       {/* Sidebar */}
// //       <aside className="w-64 bg-gray-800 text-white p-4">
// //         <h2 className="text-3xl font-bold mb-8 mt-3 text-center ">Admin Panel</h2>
// //         <ul className="space-y-4 text-xl">
// //           <li><a href="/admin/dashboard" className="block hover:text-blue-300 transition-colors pl-2 py-1">Dashboard</a></li>
// //           <li>
// //             <a href="/admin/users" className="block hover:text-blue-300 transition-colors pl-2 py-1">User Management</a>
// //           </li>
// //           <li>
           
// //             <a href="/admin/attendance" className="block hover:text-blue-300 transition-colors pl-2 py-1">Attendance Management</a>
// //           </li>
// //           <li>
           
// //             <a href="/admin/monthly-fees" className="block hover:text-blue-300 transition-colors pl-2 py-1">Financial Management</a>
// //           </li>
          

// //           {hasToken && (
// //             <li>
// //               <button
// //                 onClick={() => {
// //                   if (typeof window !== 'undefined') {
// //                     localStorage.removeItem('token');
// //                     sessionStorage.removeItem('adminToken');
// //                     setHasToken(false); // update state immediately
// //                     window.location.href = '/admin'; // redirect
// //                   }
// //                 }}
// //                 className="block w-full text-left hover:text-red-400 transition-colors pl-2 py-1 mt-8"
// //               >
// //                 Logout
// //               </button>
// //             </li>
// //           )}

           
          
// //         </ul>
// //       </aside>
// //       {/* Main Content */}
// //       <main className="flex-1 bg-gray-100 p-6">
// //         {children}
// //       </main>
// //     </div>
// //   );
// // }

// "use client";
// // app/admin/layout.tsx
// import React, { useEffect, useState } from 'react';

// export default function AdminLayout({ children }: { children: React.ReactNode }) {
//   const [hasToken, setHasToken] = useState(false);


//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const checkToken = () => setHasToken(!!localStorage.getItem('token'));
//       checkToken();
//       const onStorage = (e: StorageEvent) => {
//         if (e.key === 'token') checkToken();
//       };
//       window.addEventListener('storage', onStorage);
//       return () => window.removeEventListener('storage', onStorage);
//     }
//   }, []);

//   return (
//     <div className="flex min-h-screen ">
//       {/* Sidebar */}
//       <aside className="w-64 bg-gray-800 text-white p-4">
//         <h2 className="text-3xl font-bold mb-8 mt-3 text-center ">Admin Panel</h2>
//         <ul className="space-y-4 text-xl">
//           <li><a href="/admin/dashboard" className="block hover:text-blue-300 transition-colors pl-2 py-1">Dashboard</a></li>
//           <li>
//             <a href="/admin/users" className="block hover:text-blue-300 transition-colors pl-2 py-1">User Management</a>
//           </li>
//           <li>
           
//             <a href="/admin/attendance" className="block hover:text-blue-300 transition-colors pl-2 py-1">Attendance Management</a>
//           </li>
//           <li>
           
//             <a href="/admin/monthly-fees" className="block hover:text-blue-300 transition-colors pl-2 py-1">Financial Management</a>
//           </li>
          

//           {hasToken && (
//             <li>
//               <button
//                 onClick={() => {
//                   if (typeof window !== 'undefined') {
//                     localStorage.removeItem('token');
//                     sessionStorage.removeItem('adminToken');
//                     setHasToken(false); // update state immediately
//                     window.location.href = '/admin'; // redirect
//                   }
//                 }}
//                 className="block w-full text-left hover:text-red-400 transition-colors pl-2 py-1 mt-8"
//               >
//                 Logout
//               </button>
//             </li>
//           )}

           
          
//         </ul>
//       </aside>
//       {/* Main Content */}
//       <main className="flex-1 bg-gray-100 p-6">
//         {children}
//       </main>
//     </div>
//   );
// } 
"use client";
import React, { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // Optional: install lucide-react for icons

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [hasToken, setHasToken] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkToken = () => setHasToken(!!localStorage.getItem("token"));
      checkToken();
      const onStorage = (e: StorageEvent) => {
        if (e.key === "token") checkToken();
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Top Navbar for Mobile */}
      <div className="flex md:hidden justify-between items-center bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-gray-800 text-white p-4`}
      >
        <h2 className="text-3xl font-bold mb-8 mt-3 text-center hidden md:block">
          Admin Panel
        </h2>
        <ul className="space-y-4 text-xl">
          <li>
            <a
              href="/admin/dashboard"
              className="block hover:text-blue-300 transition-colors pl-2 py-1"
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="/admin/users"
              className="block hover:text-blue-300 transition-colors pl-2 py-1"
            >
              User Management
            </a>
          </li>
          <li>
            <a
              href="/admin/attendance"
              className="block hover:text-blue-300 transition-colors pl-2 py-1"
            >
              Attendance Management
            </a>
          </li>
          <li>
            <a
              href="/admin/monthly-fees"
              className="block hover:text-blue-300 transition-colors pl-2 py-1"
            >
              Financial Management
            </a>
          </li>
          {hasToken && (
            <li>
              <button
                onClick={() => {
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("adminToken");
                    setHasToken(false);
                    window.location.href = "/admin";
                  }
                }}
                className="block w-full text-left hover:text-red-400 transition-colors pl-2 py-1 mt-8"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
