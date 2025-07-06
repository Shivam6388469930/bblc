'use client';
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import Image from "next/image";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function UnifiedPaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [formdata, setFormdata] = useState({
    userName: "",
    userEmail: "",
    plan: "",
    course: "",
    planAmount: 0,
    registrationFee: 50,
    totalAmount: 0,
    paymentStatus: "pending",
    order_id: "",
    razorpay_payment_id: "",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [hasRegistrationFee, setHasRegistrationFee] = useState<boolean>(false);
  const [checkingRegistration, setCheckingRegistration] = useState<boolean>(false);
  const [isFirstTimePayment, setIsFirstTimePayment] = useState<boolean>(true);
  const [latestPayment, setLatestPayment] = useState(null);
  const [canPay, setCanPay] = useState(true);
  const [planExpired, setPlanExpired] = useState(false);


  // Define batch options and their prices
  const batchOptions = [
    { label: 'Morning Batch', value: 'Morning Batch', amount: 650 },
    { label: 'Mid Morning Batch', value: 'Mid Morning Batch', amount: 800 },
    { label: 'Afternoon Batch', value: 'Afternoon Batch', amount: 1200 },
    { label: 'Full Day Batch', value: 'Full Day Batch', amount: 1500 },
  ];

  // Define monthly plans with their amounts (legacy, for compatibility)
  const planAmounts = {
    "Basic": 500,
    "Standard": 800,
    "Premium": 1200,
  };

  // Define courses for registration
  const courseAmounts = {
    "Course A": 1000,
    "Course B": 1500,
    "Course C": 2000,
  };

  // Load user data from localStorage and query params
  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    // Redirect to login if user is not logged in
    if (!userName) {
      router.replace('/login');
      return;
    }

    // Read batch from query params only (ignore plan param for backend compatibility)
    const batchParam = searchParams.get('batch');

    // Map batch to legacy plan name for backend compatibility
    let plan = '';
    if (batchParam) {
      if (batchParam === 'Morning Batch') plan = 'Basic';
      else if (batchParam === 'Mid Morning Batch') plan = 'Standard';
      else if (batchParam === 'Afternoon Batch' || batchParam === 'Full Day Batch') plan = 'Premium';
    }

    setFormdata(prev => ({
      ...prev,
      userName: userName || '',
      userEmail: userEmail || '',
      course: batchParam || prev.course,
      plan: plan || prev.plan
    }));

    if (userEmail) {
      checkRegistrationStatus(userEmail);
    }
  }, [searchParams]);

  // Check if user has paid registration fee
  const checkRegistrationStatus = async (userEmail: string) => {
    try {
      setCheckingRegistration(true);
      const res = await fetch(`/api/check-registration?userEmail=${userEmail}`);
      const data = await res.json();

      if (res.ok) {
        setHasRegistrationFee(data.hasRegistrationFee);
        setIsFirstTimePayment(!data.hasRegistrationFee);
        console.log('Registration status:', data);
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    } finally {
      setCheckingRegistration(false);
    }
  };

  // Update total amount when batch or registration status changes
  useEffect(() => {
    if (formdata.course) {
      const batch = batchOptions.find(b => b.value === formdata.course);
      const planAmount = batch ? batch.amount : 0;
      const registrationFee = isFirstTimePayment ? 50 : 0;
      const totalAmount = planAmount + registrationFee;

      setFormdata(prev => ({
        ...prev,
        planAmount,
        registrationFee,
        totalAmount
      }));
    }
  }, [formdata.course, isFirstTimePayment]);

  // Fetch latest monthly payment for user
  useEffect(() => {
    const fetchLatestPayment = async () => {
      if (!formdata.userEmail) return;
      try {
        const res = await fetch(`/api/monthly-payment?userEmail=${formdata.userEmail}`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
          const latest = data.data[0]; // sorted by createdAt desc in API
          setLatestPayment(latest);
          const now = new Date();
          const end = new Date(latest.endDate);
          if (latest.paymentStatus === 'Paid' && end >= now) {
            setCanPay(false);
            setPlanExpired(false);
            setMessage(`You already paid the fee for this month. Next due: ${end.toLocaleDateString('en-IN')}`);
          } else if (end < now) {
            setCanPay(true);
            setPlanExpired(true);
            setMessage('Your plan has expired. Please pay the fee to renew.');
          } else {
            setCanPay(true);
            setPlanExpired(false);
          }
        } else {
          setCanPay(true);
          setPlanExpired(true);
        }
      } catch (err) {
        setCanPay(true);
        setPlanExpired(false);
      }
    };
    fetchLatestPayment();
    // eslint-disable-next-line
  }, [formdata.userEmail]);

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
    try {
      // Create order for the total amount
      const res = await fetch("/api/monthly-fee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: formdata.totalAmount,
          plan: formdata.plan,
          isFirstTimePayment: isFirstTimePayment,
          registrationFee: formdata.registrationFee,
          planAmount: formdata.planAmount
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
        description: isFirstTimePayment
          ? `BBLC Registration Fee + ${formdata.plan} Monthly Plan`
          : `BBLC ${formdata.plan} Monthly Plan`,
        order_id: data.order_id,
        notes: {
          payment_type: isFirstTimePayment ? 'registration_and_monthly' : 'monthly_only',
          registration_fee: formdata.registrationFee,
          plan_fee: formdata.planAmount,
          total_amount: formdata.totalAmount,
          plan_name: formdata.plan,
          user_email: formdata.userEmail,
          user_name: formdata.userName,
          // Line items for receipt
          line_item_1: isFirstTimePayment ? `Registration Fee` : `${formdata.plan} Monthly Plan`,
          line_item_1_amount: isFirstTimePayment ? formdata.registrationFee : formdata.totalAmount,
          line_item_2: isFirstTimePayment ? `${formdata.plan} Monthly Plan` : '',
          line_item_2_amount: isFirstTimePayment ? formdata.planAmount : 0,
          items_count: isFirstTimePayment ? 2 : 1,
          breakdown: isFirstTimePayment
            ? `1. Registration Fee: ₹${formdata.registrationFee} | 2. ${formdata.plan} Monthly Plan: ₹${formdata.planAmount} | Total: ₹${formdata.totalAmount}`
            : `${formdata.plan} Monthly Plan: ₹${formdata.totalAmount}`
        },
        handler: async function (response: any) {
          await handlePaymentSuccess(response, data.order_id);
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
    } catch (error) {
      console.error('Payment error:', error);
      setMessage("Error initiating payment.");
      setLoading(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (response: any, orderId: string) => {
    try {
      // If first time payment, save both registration and monthly fee
      if (isFirstTimePayment) {
        // Save registration fee
        const regRes = await fetch("/api/payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: formdata.userName,
            userEmail: formdata.userEmail,
            course: formdata.course || "Library Access",
            registrationFee: formdata.registrationFee,
            paymentStatus: "Paid",
            order_id: orderId,
            razorpay_payment_id: response.razorpay_payment_id,
          }),
        });

        if (!regRes.ok) {
          console.error('Failed to save registration fee');
        }
      }

      // Save monthly fee (send both plan and batch for history)
      const monthlyRes = await fetch("/api/monthly-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: formdata.userName,
          userEmail: formdata.userEmail,
          plan: formdata.plan,
          batch: formdata.course, // send batch name for history
          amount: formdata.planAmount,
          startDate: formdata.startDate,
          endDate: formdata.endDate,
          paymentStatus: "Paid",
          order_id: orderId,
          razorpay_payment_id: response.razorpay_payment_id,
        }),
      });

      if (monthlyRes.ok) {
        // Send confirmation email
        const sendMail = await fetch("/api/monthly-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userName: formdata.userName,
            userEmail: formdata.userEmail,
            plan: formdata.plan,
            amount: formdata.totalAmount,
            startDate: formdata.startDate,
            endDate: formdata.endDate,
            paymentStatus: "Paid",
            order_id: orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            isFirstTimePayment,
            registrationFee: isFirstTimePayment ? formdata.registrationFee : 0
          }),
        });

        if (sendMail.ok) {
          setMessage(isFirstTimePayment
            ? "Registration and monthly fee payment successful! Confirmation email sent."
            : "Monthly fee payment successful! Confirmation email sent."
          );
        } else {
          setMessage("Payment successful but email confirmation failed.");
        }

        // Update registration status
        setHasRegistrationFee(true);
        setIsFirstTimePayment(false);
      } else {
        setMessage("Payment processed but failed to save details.");
      }
    } catch (error) {
      console.error('Error handling payment success:', error);
      setMessage("Payment successful but there was an error saving details.");
    } finally {
      setLoading(false);
    }
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

    if (isFirstTimePayment && !formdata.course) {
      setMessage("Please select a course for registration.");
      setLoading(false);
      return;
    }

    await handlePayment();
  };

  if (checkingRegistration) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Checking registration status...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Banner */}
      <div className="w-full h-[300px] relative">
        <Image
          src="/heroimg/pexels-pixabay-159775.jpg"
          alt="Payment Banner"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 mt-20 mb-20"
        />
        <div className="absolute inset-0 bg-black/50 flex justify-center items-center text-white text-4xl font-extrabold">
          <h1>{isFirstTimePayment ? "Registration + Monthly Fee" : "Monthly Fee Payment"}</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Payment Status Info */}
        <div className={`mb-6 p-4 rounded-lg ${
          isFirstTimePayment
            ? 'bg-blue-100 border border-blue-300'
            : 'bg-green-100 border border-green-300'
        }`}>
          <h2 className="text-lg font-semibold mb-2">
            {isFirstTimePayment ? "🎯 First Time Payment" : "🔄 Monthly Fee Payment"}
          </h2>
          <p className="text-sm">
            {isFirstTimePayment
              ? "आपको Registration Fee (₹50) + Monthly Plan Fee देनी होगी।"
              : "आपको केवल Monthly Plan Fee देनी होगी।"
            }
          </p>
        </div>

        {/* Payment Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={formdata.userName}
                  onChange={(e) => setFormdata({...formdata, userName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formdata.userEmail}
                  onChange={(e) => setFormdata({...formdata, userEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>


            {/* Batch selection (always show) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Batch
              </label>
              <select
                value={formdata.course}
                onChange={(e) => {
                  const selectedBatch = batchOptions.find(b => b.value === e.target.value);
                  // Map batch to legacy plan name for backend compatibility
                  let plan = '';
                  if (selectedBatch) {
                    if (selectedBatch.label === 'Morning Batch') plan = 'Basic';
                    else if (selectedBatch.label === 'Mid Morning Batch') plan = 'Standard';
                    else if (selectedBatch.label === 'Afternoon Batch' || selectedBatch.label === 'Full Day Batch') plan = 'Premium';
                  }
                  setFormdata(prev => ({
                    ...prev,
                    course: e.target.value,
                    plan: plan,
                    planAmount: selectedBatch ? selectedBatch.amount : 0
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Batch</option>
                {batchOptions.map((batch) => (
                  <option key={batch.value} value={batch.value}>
                    {batch.label} (₹{batch.amount})
                  </option>
                ))}
              </select>
            </div>

            {/* Plan selection (synced with batch, read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Plan
              </label>
              <input
                type="text"
                value={formdata.plan ? `${formdata.plan} (₹${formdata.planAmount})` : ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none"
                placeholder="Select a batch to set plan"
                required
              />
            </div>

            {/* Payment Summary */}
            {formdata.plan && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Payment Summary</h3>
                <div className="space-y-1 text-sm">
                  {isFirstTimePayment && (
                    <div className="flex justify-between">
                      <span>Registration Fee:</span>
                      <span>₹{formdata.registrationFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{formdata.plan} Plan (Monthly):</span>
                    <span>₹{formdata.planAmount}</span>
                  </div>
                  <div className="border-t pt-1 flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{formdata.totalAmount}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={!canPay || loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 font-semibold"
            >
              {loading ? "Processing..." : `Pay ₹${formdata.totalAmount}`}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded ${
              message.includes('successful')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          {/* Warning message for plan expiry or payment status */}
          {latestPayment && (
            <div className={`mt-4 p-3 rounded ${
              planExpired
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}>
              {planExpired
                ? "⚠️ Your plan has expired. Please pay the fee to renew."
                : `ℹ️ You already paid the fee for this month. Next due: ${new Date(latestPayment.endDate).toLocaleDateString('en-IN')}`
              }
            </div>
          )}
        </div>
      </div>
    </>
  );
}
