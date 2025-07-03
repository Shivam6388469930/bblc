'use client';
import React, { useState } from 'react';

export default function TestAttendancePage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testMarkAttendance = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('🧪 Testing attendance marking...');
      
      const testData = {
        userName: 'Test User',
        userEmail: 'test@example.com',
        date: new Date().toISOString().split('T')[0], // Today's date
        value: 'present'
      };
      
      console.log('🧪 Sending data:', testData);
      
      const res = await fetch('/api/attendence', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await res.json();
      console.log('🧪 Response:', data);

      if (res.ok) {
        setResult(`✅ SUCCESS: ${data.message}`);
      } else {
        setResult(`❌ ERROR: ${data.message || 'Unknown error'} (Status: ${res.status})`);
      }
    } catch (error: any) {
      console.error('🧪 Test error:', error);
      setResult(`❌ NETWORK ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testFetchUsers = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('🧪 Testing user fetch...');
      
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      console.log('🧪 Users response:', data);

      if (res.ok) {
        setResult(`✅ SUCCESS: Found ${data.users?.length || 0} users`);
      } else {
        setResult(`❌ ERROR: ${data.message || 'Unknown error'} (Status: ${res.status})`);
      }
    } catch (error: any) {
      console.error('🧪 Test error:', error);
      setResult(`❌ NETWORK ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testFetchAttendance = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('🧪 Testing attendance fetch...');
      
      const res = await fetch('/api/attendence?isAdmin=true');
      const data = await res.json();
      console.log('🧪 Attendance response:', data);

      if (res.ok) {
        setResult(`✅ SUCCESS: Found ${data.attendance?.length || 0} attendance records`);
      } else {
        setResult(`❌ ERROR: ${data.message || 'Unknown error'} (Status: ${res.status})`);
      }
    } catch (error: any) {
      console.error('🧪 Test error:', error);
      setResult(`❌ NETWORK ERROR: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Attendance System Test</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">API Tests</h2>
        
        <div className="space-y-4">
          <button
            onClick={testFetchUsers}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mr-4"
          >
            {loading ? 'Testing...' : 'Test Fetch Users'}
          </button>
          
          <button
            onClick={testMarkAttendance}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 mr-4"
          >
            {loading ? 'Testing...' : 'Test Mark Attendance'}
          </button>
          
          <button
            onClick={testFetchAttendance}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Fetch Attendance'}
          </button>
        </div>
        
        {result && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )}
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
        <h3 className="font-semibold text-yellow-800 mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside text-yellow-700 space-y-1">
          <li>Open your browser's Developer Tools (F12)</li>
          <li>Go to the Console tab</li>
          <li>Click the test buttons above</li>
          <li>Check both the results here and the console logs</li>
          <li>If there are errors, they will show detailed information</li>
        </ol>
      </div>
    </div>
  );
}
