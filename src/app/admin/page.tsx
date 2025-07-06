'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (localStorage.getItem('token')) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!userEmail || !userPassword) {
      setError('Please fill in both fields');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userEmail, userPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('username', data.name);
        localStorage.setItem('token', data.token);
        // Manually dispatch storage event so sidebar updates immediately
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new StorageEvent('storage', { key: 'token', newValue: data.token }));
        }
        // If admin logs in, do NOT use their email for payment/user queries
        if (data.role === 'admin') {
          localStorage.setItem('isAdmin', 'true');
        } else {
          localStorage.removeItem('isAdmin');
        }
        router.push('/admin/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md p-8 rounded w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700">Admin Login</h2>

        {error && <p className="text-red-600 text-center">{error}</p>}

        <div>
          <label htmlFor="userEmail" className="block text-sm font-medium">Email</label>
          <input
            type="email"
            id="userEmail"
            required
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="userPassword" className="block text-sm font-medium">Password</label>
          <input
            type="password"
            id="userPassword"
            required
            value={userPassword}
            onChange={(e) => setUserPassword(e.target.value)}
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
