'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router=useRouter();
  const [formData, setFormData] = useState({
    userEmail: '',
    userPassword: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ Prevent default form refresh

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        const {user,token}=data
        localStorage.setItem('userName', user.userName);
        localStorage.setItem('userEmail', user.userEmail); 
        localStorage.setItem('token', data.token); 

        setMessage(data.message);
        console.log('✅ Login successful:', data);
        router.push('/')
       
      } else {
        setMessage(data.message || 'Something went wrong');
        console.error('❌ Login failed:', data);
      }
    } catch (error) {
      setMessage('An error occurred');
      console.error('❌ Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

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

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>

        {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
      </form>
    </div>
  );
}
