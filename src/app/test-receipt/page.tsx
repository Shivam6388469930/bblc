'use client';
import React, { useState } from 'react';

export default function TestReceiptPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testFirstTimePayment = async () => {
    setLoading(true);
    setResult('');

    try {
      console.log('🧪 Testing first time payment receipt...');

      const testData = {
        amount: 550, // Registration (50) + Basic Plan (500)
        plan: 'Basic',
        isFirstTimePayment: true,
        registrationFee: 50,
        planAmount: 500
      };

      console.log('🧪 Sending data:', testData);

      const res = await fetch('/api/monthly-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await res.json();
      console.log('🧪 Response:', data);

      if (res.ok) {
        setResult(`✅ SUCCESS: First Time Payment Order Created

Order Details:
- Order ID: ${data.order_id}
- Amount: ₹${data.amount / 100}
- Receipt: ${data.receipt}
- Plan: ${data.plan}

Receipt में यह breakdown show होगा:
Line Item 1: Registration Fee - ₹50
Line Item 2: Basic Monthly Plan - ₹500
Total Amount: ₹550

Notes में detailed breakdown भी होगा।`);
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

  const testRecurringPayment = async () => {
    setLoading(true);
    setResult('');

    try {
      console.log('🧪 Testing recurring payment receipt...');

      const testData = {
        amount: 500, // Only Basic Plan
        plan: 'Basic',
        isFirstTimePayment: false,
        registrationFee: 0,
        planAmount: 500
      };

      console.log('🧪 Sending data:', testData);

      const res = await fetch('/api/monthly-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await res.json();
      console.log('🧪 Response:', data);

      if (res.ok) {
        setResult(`✅ SUCCESS: Recurring Payment Order Created

Order Details:
- Order ID: ${data.order_id}
- Amount: ₹${data.amount / 100}
- Receipt: ${data.receipt}
- Plan: ${data.plan}

Receipt में यह breakdown show होगा:
- Basic Plan: ₹500 (केवल monthly fee)`);
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

  const testPremiumFirstTime = async () => {
    setLoading(true);
    setResult('');

    try {
      console.log('🧪 Testing Premium first time payment receipt...');

      const testData = {
        amount: 1250, // Registration (50) + Premium Plan (1200)
        plan: 'Premium',
        isFirstTimePayment: true,
        registrationFee: 50,
        planAmount: 1200
      };

      console.log('🧪 Sending data:', testData);

      const res = await fetch('/api/monthly-fee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await res.json();
      console.log('🧪 Response:', data);

      if (res.ok) {
        setResult(`✅ SUCCESS: Premium First Time Payment Order Created

Order Details:
- Order ID: ${data.order_id}
- Amount: ₹${data.amount / 100}
- Receipt: ${data.receipt}
- Plan: ${data.plan}

Receipt में यह breakdown show होगा:
Line Item 1: Registration Fee - ₹50
Line Item 2: Premium Monthly Plan - ₹1200
Total Amount: ₹1250

Notes में detailed breakdown भी होगा।`);
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
      <h1 className="text-3xl font-bold mb-6">Receipt Breakdown Test</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Different Payment Scenarios</h2>

        <div className="space-y-4">
          <button
            onClick={testFirstTimePayment}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mr-4"
          >
            {loading ? 'Testing...' : 'Test First Time Payment (Basic)'}
          </button>

          <button
            onClick={testRecurringPayment}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 mr-4"
          >
            {loading ? 'Testing...' : 'Test Recurring Payment (Basic)'}
          </button>

          <button
            onClick={testPremiumFirstTime}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test First Time Payment (Premium)'}
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
        <h3 className="font-semibold text-yellow-800 mb-2">Receipt Breakdown Details:</h3>
        <div className="text-yellow-700 space-y-2">
          <p><strong>First Time Payment Receipt:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>Receipt ID: reg_monthly_[plan]_[timestamp]</li>
            <li>Description: BBLC Registration Fee + [Plan] Monthly Plan</li>
            <li>Line Item 1: Registration Fee - ₹50</li>
            <li>Line Item 2: [Plan] Monthly Plan - ₹[amount]</li>
            <li>Notes में detailed breakdown with separate amounts</li>
          </ul>

          <p><strong>Recurring Payment Receipt:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>Receipt ID: monthly_[plan]_[timestamp]</li>
            <li>Description: BBLC [Plan] Monthly Plan</li>
            <li>Line Item 1: [Plan] Monthly Plan - ₹[amount]</li>
            <li>Notes में plan details</li>
          </ul>

          <p><strong>Razorpay Dashboard में दिखेगा:</strong></p>
          <ul className="list-disc list-inside ml-4">
            <li>✅ Registration और Monthly Fee अलग-अलग line items</li>
            <li>✅ हर item का अलग amount</li>
            <li>✅ Total amount</li>
            <li>✅ User details और payment breakdown</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
