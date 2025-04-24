'use client'

import React, { useState } from 'react'

export default function Page() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = { name, email, message };

        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (response.ok) {
            setStatus("Email sent successfully!");
            // Reset form fields
            setName("");
            setEmail("");
            setMessage("");
        } else {
            setStatus("Failed to send email.");
        }
    };

    return (
        <div className="bg-gray-50 mt-16">
            {/* Divs Section */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="p-6 bg-blue-500 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
                        <h3 className="text-2xl font-semibold text-white mb-4 text-center">Email</h3>
                        <p className="text-white text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.</p>
                    </div>
                    <div className="p-6 bg-green-500 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
                        <h3 className="text-2xl font-semibold text-white mb-4 text-center">Contact Number</h3>
                        <p className="text-white text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.</p>
                    </div>
                    <div className="p-6 bg-purple-500 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl">
                        <h3 className="text-2xl font-semibold text-white mb-4 text-center">Social Media</h3>
                        <p className="text-white text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.</p>
                    </div>
                </div>
            </div>

            {/* Form and Map Section */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left side: Form */}
                    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-300">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email Address</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="message" className="block text-sm font-semibold text-gray-700">Message</label>
                                <textarea 
                                    id="message" 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows="4" 
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Your message"
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-all"
                            >
                                Send Message
                            </button>
                        </form>
                        {status && <p className="mt-4 text-center text-lg font-semibold">{status}</p>}
                    </div>

                    {/* Right side: Map */}
                    <div className="p-6 bg-white rounded-lg shadow-lg border border-gray-300">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Location</h3>
                        <div className="w-full h-80">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.3496921097017!2d82.86744307517144!3d25.426569977564068!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398fd56ab47f61d5%3A0x5c419337770f057a!2sBaba%20bamokhar%20library%20center(BBLC)!5e0!3m2!1sen!2sin!4v1745231735808!5m2!1sen!2sin" 
                                width="100%" 
                                height="100%" 
                                style={{ border: 0 }} 
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
