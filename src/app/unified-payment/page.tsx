// ./src/app/unified-payment/page.tsx
'use client';
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import Image from "next/image";

// Declare Razorpay globally
declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  notes: Record<string, any>;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open(): void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
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
  const [checkingRegistration, setCheckingRegistration] = useState<boolean>(false);
  const [isFirstTimePayment, setIsFirstTimePayment] = useState<boolean>(true);
  const [latestPayment, setLatestPayment] = useState<any>(null);
  const [canPay, setCanPay] = useState(true);
  const [planExpired, setPlanExpired] = useState(false);

  const batchOptions = [
    { label: 'Morning Batch', value: 'Morning Batch', amount: 650 },
    { label: 'Mid Morning Batch', value: 'Mid Morning Batch', amount: 800 },
    { label: 'Afternoon Batch', value: 'Afternoon Batch', amount: 1200 },
    { label: 'Full Day Batch', value: 'Full Day Batch', amount: 1500 },
  ];

  useEffect(() => {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');

    if (!userName) {
      router.replace('/login');
      return;
    }

    const batchParam = searchParams.get('batch');

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
  }, [searchParams, router]);

  const checkRegistrationStatus = async (userEmail: string) => {
    try {
      setCheckingRegistration(true);
      const res = await fetch(`/api/check-registration?userEmail=${userEmail}`);
      const data = await res.json();

      if (res.ok) {
        setIsFirstTimePayment(!data.hasRegistrationFee);
      }
    } catch (error) {
      console.error('Error checking registration:', error);
    } finally {
      setCheckingRegistration(false);
    }
  };

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

  useEffect(() => {
    const fetchLatestPayment = async () => {
      if (!formdata.userEmail) return;
      try {
        const res = await fetch(`/api/monthly-payment?userEmail=${formdata.userEmail}`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.data) && data.data.length > 0) {
          const latest = data.data[0];
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
      } catch (error) {
        console.error('Error fetching payment:', error);
        setCanPay(true);
        setPlanExpired(false);
      }
    };
    fetchLatestPayment();
  }, [formdata.userEmail, batchOptions]);

  // Replace other "any" types if needed in formdata or Razorpay options

  // ... rest of the component remains unchanged
}
