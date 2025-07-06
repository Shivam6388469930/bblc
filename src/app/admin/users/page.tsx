"use client";
import React, { useEffect, useState } from "react";

interface User {
  _id: string;
  userName: string;
  userEmail: string;
  createdAt: string;
  role?: string;
}

interface Payment {
  startDate: string;
  endDate: string;
  isActive: boolean;
  plan: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [userStatus, setUserStatus] = useState<Record<string, { status: string; plan?: string; batchPeriod?: string }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsersAndStatus() {
      try {
        // Fetch all users
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch users");
        setUsers(data.users);

        // For each user, fetch their latest monthly payment
        const statusObj: Record<string, { status: string; plan?: string; batchPeriod?: string }> = {};
        await Promise.all(
          data.users.map(async (user: User) => {
            const payRes = await fetch(`/api/monthly-payment?userEmail=${encodeURIComponent(user.userEmail)}`);
            const payData = await payRes.json();
            if (payRes.ok && Array.isArray(payData.data) && payData.data.length > 0) {
              const latest = payData.data[0];
              const now = new Date();
              const end = new Date(latest.endDate);
              if (latest.isActive && end >= now) {
                statusObj[user._id] = {
                  status: "Active",
                  plan: latest.plan,
                  batchPeriod: `${new Date(latest.startDate).toLocaleDateString()} to ${new Date(latest.endDate).toLocaleDateString()}`
                };
              } else {
                statusObj[user._id] = {
                  status: "Expired",
                  plan: latest.plan,
                  batchPeriod: `${new Date(latest.startDate).toLocaleDateString()} to ${new Date(latest.endDate).toLocaleDateString()}`
                };
              }
            } else {
              statusObj[user._id] = { status: "Registered" };
            }
          })
        );
        setUserStatus(statusObj);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchUsersAndStatus();
  }, []);

  // Delete user handler
  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/deleteUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (err: any) {
      alert(err.message || "Error deleting user");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-500">User Management</h1>
      {loading && <div>Loading users...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan/Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.userName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.userEmail}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={userStatus[user._id]?.status || 'Registered'}
                      onChange={async (e) => {
                        const newStatus = e.target.value;
                        try {
                          const res = await fetch('/api/admin/deleteUser', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: user._id, newStatus })
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setUserStatus((prev) => ({ ...prev, [user._id]: { ...prev[user._id], status: newStatus } }));
                            alert('User status updated successfully');
                          } else {
                            alert(data.message || 'Failed to update user status');
                          }
                        } catch (err: any) {
                          alert(err.message || 'Error updating user status');
                        }
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Expired">Expired</option>
                      <option value="Registered">Registered</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{userStatus[user._id]?.plan || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{userStatus[user._id]?.batchPeriod || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* <select
                      className="border rounded px-2 py-1 text-xs"
                      value={user.role || 'user'}
                      onChange={async (e) => {
                        const newRole = e.target.value;
                        try {
                          const res = await fetch('/api/admin/deleteUser', {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId: user._id, newRole })
                          });
                          const data = await res.json();
                          if (res.ok) {
                            setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, role: newRole } : u));
                            alert('User role updated successfully');
                          } else {
                            alert(data.message || 'Failed to update user role');
                          }
                        } catch (err: any) {
                          alert(err.message || 'Error updating user role');
                        }
                      }}
                      disabled={user.role === 'admin'}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option> */}
                    {/* </select> */}
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
