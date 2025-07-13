'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router=useRouter();
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    role: 'user',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    setMessage(data.message);
    router.push('/login')
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

        <input
          name="userName"
          placeholder="Name"
          onChange={handleChange}
          value={formData.userName}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="userEmail"
          placeholder="Email"
          onChange={handleChange}
          value={formData.userEmail}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="userPassword"
          placeholder="Password"
          onChange={handleChange}
          value={formData.userPassword}
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <select
          name="role"
          onChange={handleChange}
          value={formData.role}
          className="mb-3 w-full p-2 border rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>

        {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
}
