"use client";
import React, { useState } from 'react';

export default function Page() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [formData, setFormData] = useState({
    userName: userName,7
    userEmail: userEmail,
    course: '',
    totalFee: '',
    submitFee: '',
    balanceFee: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    if (name === 'totalFee' || name === 'submitFee') {
      const total = name === 'totalFee' ? Number(value) : Number(updatedData.totalFee);
      const submitted = name === 'submitFee' ? Number(value) : Number(updatedData.submitFee);
      updatedData.balanceFee = total - submitted >= 0 ? String(total - submitted) : '';
    }

    setFormData(updatedData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/fees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      const data = await res.json();
      setMessage('Fees submitted successfully!');
      console.log(formData);
    }
  };

  return (
    <>
    <section className=" mt-20 p-6 bg-gray-50 rounded-xl shadow">
      {/* Top Heading and Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Fee Dashboard</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
          Pay Your Fee
        </button>
      </div>

      {/* Fee Cards Row */}
      <div className="flex justify-between gap-4">
        <div className="flex-1 bg-blue-100 p-4 rounded-xl text-center shadow">
          <h3 className="text-lg font-semibold">Total Fee</h3>
          <p className="text-xl font-bold text-blue-700">₹50,000</p>
        </div>
        <div className="flex-1 bg-green-100 p-4 rounded-xl text-center shadow">
          <h3 className="text-lg font-semibold">Paid Fee</h3>
          <p className="text-xl font-bold text-green-700">₹30,000</p>
        </div>
        <div className="flex-1 bg-red-100 p-4 rounded-xl text-center shadow">
          <h3 className="text-lg font-semibold">Balance Fee</h3>
          <p className="text-xl font-bold text-red-700">₹20,000</p>
        </div>
      </div>
    </section>
    {/* // fee form */}
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4">Fees Submit Form</h2>

        <input
          name="userName"
          placeholder="Name"
          onChange={handleChange}
          value={formData.userName}
          disabled
          className="mb-3 w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="userEmail"
          placeholder="Email"
          onChange={handleChange}
          value={formData.userEmail}
          disabled
          className="mb-3 w-full p-2 border rounded"
          required
        />

        <select
          name="course"
          onChange={handleChange}
          value={formData.course}
          className="mb-3 w-full p-2 border rounded"
          required
        >
          <option value="">Select Course</option>
          <option value="B.Tech">B.Tech</option>
          <option value="MBA">MBA</option>
          <option value="BCA">BCA</option>
          <option value="BBA">BBA</option>
          <option value="Polytechnic">Polytechnic</option>
        </select>

        <input
          type="number"
          name="totalFee"
          placeholder="Total Fee"
          onChange={handleChange}
          value={formData.totalFee}
          className="mb-3 w-full p-2 border rounded"
        />
        <input
          type="number"
          name="submitFee"
          placeholder="Submit Fee"
          onChange={handleChange}
          value={formData.submitFee}
          className="mb-3 w-full p-2 border rounded"
        />
        <input
          type="number"
          name="balanceFee"
          placeholder="Balance Fee"
          value={formData.balanceFee}
          readOnly
          className="mb-3 w-full p-2 border rounded bg-gray-100"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>

        {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
      </form>
    </div>
    </>
  );
}
