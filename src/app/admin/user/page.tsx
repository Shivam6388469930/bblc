// 'use client';

// import { useEffect, useState } from 'react';

// interface User {
//   _id: string;
//   Username: string;
//   email: string;
//   mobile: string;
//   password: string;
// }

// export default function AllUsers() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch all users
//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/admin/alluser');
//       const data = await res.json();

//       if (data.success) {
//         setUsers(data.data);
//       } else {
//         alert('Failed to load users');
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     }
//     setLoading(false);
//   };

//   // Delete user by ID
//   const deleteUser = async (id: string) => {
//     const confirm = window.confirm('Are you sure you want to delete this user?');
//     if (!confirm) return;

//     try {
//       const res = await fetch(`/api/admin/deleteUser/${id}`, {
//         method: 'DELETE',
//       });
//       const result = await res.json();

//       if (result.success) {
//         alert('User deleted successfully!');
//         fetchUsers(); // Refresh list
//       } else {
//         alert(result.message || 'Delete failed');
//       }
//     } catch (error) {
//       console.error('Error deleting user:', error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   return (
//     <div className="p-4">
//       <h2 className="text-xl font-bold mb-4">All Users</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : users.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         <table className="w-full border border-gray-300">
//           <thead className="bg-gray-100">
//             <tr>
//               <th className="p-2 border">Username</th>
//               <th className="p-2 border">Email</th>
              
//               <th className="p-2 border">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user._id} className="text-center">
//                 <td className="p-2 border">{user.userName}</td>
//                 <td className="p-2 border">{user.userEmail}</td>
//                 <td className="p-2 border">
//                   <button
//                     onClick={() => deleteUser(user._id)}
//                     className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

'use client';

import { useEffect, useState } from 'react';

interface User {
  _id: string;
  userName: string;
  userEmail: string;
  userPassword: string;
  role?: string;
}

export default function AllUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/alluser');
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response from server');
      }
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
      } else {
        alert('Failed to load users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users');
    }
    setLoading(false);
  };

  // Delete user by ID
  const deleteUser = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to delete this user?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/admin/deleteUser/${id}`, {
        method: 'DELETE',
      });
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response from server');
      }
      const result = await res.json();

      if (result.success) {
        alert('User deleted successfully!');
        fetchUsers(); // Refresh list
      } else {
        alert(result.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <div className='mb-6'>
         <h2 className="text-3xl font-bold mb-4 text-blue-500">User Management</h2>
         <h2>Manage All User That Are Registed In Your Library</h2>
      </div>
     

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Username</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="text-center">
                <td className="p-2 border">{user.userName}</td>
                <td className="p-2 border">{user.userEmail}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => deleteUser(user._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
