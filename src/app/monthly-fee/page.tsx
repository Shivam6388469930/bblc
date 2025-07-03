'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function MonthlyFeePage() {
  const [formdata, setFormdata] = useState({
    amount: NaN,
    userEmail: "",
    plan: "",
    userName: "",
    paymentStatus: "pending",
    order_id: "",
    razorpay_payment_id: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  // Define monthly plans with their amounts
  const planAmounts = {
    "Basic": 500,
    "Standard": 800,
    "Premium": 1200,
  };

  // Update amount when plan changes
  useEffect(() => {
    if (formdata.plan) {
      setFormdata((prevData) => ({
        ...prevData,
        amount: planAmounts[formdata.plan] || 0,
      }));
    }
  }, [formdata.plan]);

  // Load user data from localStorage if available
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (userName && userEmail) {
      setFormdata(prev => ({
        ...prev,
        userName,
        userEmail
      }));
    }
  }, []);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Handle payment process
  const handlePayment = async () => {
    // Create order
    const res = await fetch("/api/monthly-fee", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: formdata.amount,
        plan: formdata.plan
      }),
    });

    const data = await res.json();
    if (!res.ok || !data?.order_id) {
      setMessage("Order creation failed.");
      setLoading(false);
      return;
    }

    // Load Razorpay
    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    // Configure Razorpay options
    const options = {
      key: "rzp_test_7VXRc8O89d3bz1",
      amount: data.amount,
      currency: data.currency,
      name: "BBLC Library",
      description: `Monthly Fee - ${formdata.plan} Plan`,
      order_id: data.order_id,
      handler: async function (response: any) {
        // Save payment details
        const res = await fetch("/api/monthly-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: formdata.userName,
            userEmail: formdata.userEmail,
            plan: formdata.plan,
            amount: formdata.amount,
            startDate: formdata.startDate,
            endDate: formdata.endDate,
            paymentStatus: "Paid",
            order_id: data.order_id,
            razorpay_payment_id: response.razorpay_payment_id,
          }),
        });

        const paymentData = await res.json();
        if (res.ok) {
          // Send confirmation email
          const sendMail = await fetch("/api/monthly-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userName: formdata.userName,
              userEmail: formdata.userEmail,
              plan: formdata.plan,
              amount: formdata.amount,
              startDate: formdata.startDate,
              endDate: formdata.endDate,
              paymentStatus: "Paid",
              order_id: data.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            }),
          });

          if (sendMail.ok) {
            setMessage("Payment successful and confirmation email sent!");
          } else {
            setMessage("Payment successful but email confirmation failed.");
          }
        } else {
          setMessage("Payment processed but failed to save details.");
        }

        setLoading(false);
      },
      prefill: {
        name: formdata.userName,
        email: formdata.userEmail,
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: () => {
          setMessage("Payment popup closed without completing payment.");
          setLoading(false);
        },
      },
    };

    // Open Razorpay payment form
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validate form
    if (!formdata.userName || !formdata.userEmail || !formdata.plan) {
      setMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    await handlePayment();
  };

  return (
    <>
      {/* Hero Banner */}
      <div className="w-full h-[300px] relative">
        <Image
          src="/heroimg/pexels-pixabay-159775.jpg"
          alt="Monthly Fee Banner"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 mt-20"
        />
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white text-4xl font-extrabold">
          <h1>Monthly Fee Payment</h1>
        </div>
      </div>

      {/* Plan Comparison */}
      <div className="container mx-auto px-4 py-12 mt-10">
        <h2 className="text-3xl font-bold text-center mb-2">Choose Your Monthly Plan</h2>
        <p className="text-center text-gray-600 mb-10">
          Select the plan that best fits your needs and budget
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Basic Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
            <div className="bg-blue-600 p-6 text-white text-center">
              <h3 className="text-2xl font-bold">Basic Plan</h3>
              <p className="text-4xl font-bold mt-2">₹500<span className="text-sm font-normal">/month</span></p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Access to common study area
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Wi-Fi connectivity
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Basic amenities
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  8 hours access per day
                </li>
              </ul>
            </div>
          </div>

          {/* Standard Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 border-2 border-indigo-500">
            <div className="bg-indigo-600 p-6 text-white text-center relative">
              <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-bl text-gray-800">POPULAR</div>
              <h3 className="text-2xl font-bold">Standard Plan</h3>
              <p className="text-4xl font-bold mt-2">₹800<span className="text-sm font-normal">/month</span></p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Access to dedicated study area
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  High-speed Wi-Fi
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Access to library resources
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  12 hours access per day
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Complimentary refreshments
                </li>
              </ul>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
            <div className="bg-purple-600 p-6 text-white text-center">
              <h3 className="text-2xl font-bold">Premium Plan</h3>
              <p className="text-4xl font-bold mt-2">₹1200<span className="text-sm font-normal">/month</span></p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Access to premium study cabins
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Ultra high-speed Wi-Fi
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Full access to all resources
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  24/7 access
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Free printing (100 pages/month)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500">
        <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-2 text-blue-700">Monthly Fee Payment</h2>
          <p className="text-center text-gray-600 mb-6">
            Fill in your details and pay securely via Razorpay to access BBLC facilities.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium">Name</label>
              <input
                type="text"
                id="userName"
                value={formdata.userName}
                onChange={(e) => setFormdata({ ...formdata, userName: e.target.value })}
                required
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium">Email</label>
              <input
                type="email"
                id="userEmail"
                value={formdata.userEmail}
                onChange={(e) => setFormdata({ ...formdata, userEmail: e.target.value })}
                required
                className="w-full mt-1 p-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="plan" className="block text-sm font-medium">Monthly Plan</label>
              <select
                id="plan"
                value={formdata.plan}
                onChange={(e) => setFormdata({ ...formdata, plan: e.target.value })}
                required
                className="w-full mt-1 p-2 border rounded bg-white"
              >
                <option value="">Select Plan</option>
                <option value="Basic">Basic (₹500/month)</option>
                <option value="Standard">Standard (₹800/month)</option>
                <option value="Premium">Premium (₹1200/month)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={formdata.startDate}
                  onChange={(e) => {
                    const newStartDate = e.target.value;
                    const startDate = new Date(newStartDate);
                    const endDate = new Date(startDate);
                    endDate.setMonth(endDate.getMonth() + 1);

                    setFormdata({
                      ...formdata,
                      startDate: newStartDate,
                      endDate: endDate.toISOString().split('T')[0]
                    });
                  }}
                  required
                  className="w-full mt-1 p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  value={formdata.endDate}
                  readOnly
                  className="w-full mt-1 p-2 border rounded bg-gray-100"
                />
              </div>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium">Amount (₹)</label>
              <input
                type="number"
                id="amount"
                value={formdata.amount}
                readOnly
                className="w-full mt-1 p-2 border rounded bg-gray-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>

          {message && <p className="mt-4 text-green-600 text-center">{message}</p>}
        </div>
      </div>
    </>
  );
}
