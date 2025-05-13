'use client';
import React, { useState, useEffect } from "react";
import Image from "next/image";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Page() {
  const [formdata, setFormdata] = useState({
    amount: NaN,
    userEmail: "",
    course: "",
    userName: "",
    paymentStatus: "pending",
    order_id: "",
    razorpay_payment_id: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const courseAmounts = {
    "Course A": 1000,
    "Course B": 1500,
    "Course C": 2000,
  };

  useEffect(() => {
    if (formdata.course) {
      setFormdata((prevData) => ({
        ...prevData,
        amount: courseAmounts[formdata.course] || 0,
      }));
    }
  }, [formdata.course]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await fetch("/api/fees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: formdata.amount }),
    });

    const data = await res.json();
    if (!res.ok || !data?.order_id) {
      setMessage("Order creation failed.");
      setLoading(false);
      return;
    }

    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      setLoading(false);
      return;
    }

    const options = {
      key: "rzp_test_7VXRc8O89d3bz1",
      amount: data.amount,
      currency: data.currency,
      name: "BBLC Library",
      description: "Registration Fee",
      order_id: data.order_id,
      handler: async function (response: any) {
        const res = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: formdata.userName,
            userEmail: formdata.userEmail,
            course: formdata.course,
            registrationFee: formdata.amount,
            paymentStatus: "Paid",
            order_id: data.order_id,
            razorpay_payment_id: response.razorpay_payment_id,
          }),
        });

        const paymentData = await res.json();
        if (res.ok) {
          localStorage.setItem("id", paymentData.savePayment._id);
          setMessage("Payment data saved successfully!");

          const sendMail = await fetch("/api/confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...formdata,
              registrationFee: formdata.amount,
              paymentStatus: "Paid",
              order_id: data.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            }),
          });

          if (sendMail.ok) {
            setMessage("Email sent successfully!");
          }
        }

        setMessage("Payment successful! Payment ID: " + response.razorpay_payment_id);
        alert("Payment successful! Please check your console for details.");
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

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formdata.userName || !formdata.userEmail || !formdata.course) {
      setMessage("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    await handlePayment();
  };

  return (
    <>
     <div className="w-full h-[300px] relative ">
            <Image
              src="/heroimg/pexels-pixabay-159775.jpg"
              alt="Facilities Banner"
              layout="fill"
              objectFit="cover"
              className="absolute inset-0 mt-20 "
            />
            <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white text-4xl font-extrabold">
              <h1>Our Facilities</h1>
            </div>
          </div>
    
    
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 mt-10 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 mt-20 ">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-blue-700">Fee Registration</h2>
        <p className="text-center text-gray-600 mb-6">
          Fill in your details below and pay securely via Razorpay to register for your selected course.
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
            <label htmlFor="course" className="block text-sm font-medium">Course</label>
            <select
              id="course"
              value={formdata.course}
              onChange={(e) => setFormdata({ ...formdata, course: e.target.value })}
              required
              className="w-full mt-1 p-2 border rounded bg-white"
            >
              <option value="">Select Course</option>
              <option value="Course A">Course A</option>
              <option value="Course B">Course B</option>
              <option value="Course C">Course C</option>
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              value={formdata.amount}
              onChange={(e) => setFormdata({ ...formdata, amount: Number(e.target.value) })}
              required
              min="1"
              className="w-full mt-1 p-2 border rounded"
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
