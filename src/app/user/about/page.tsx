'use client';
import Image from 'next/image';
import React from 'react';

export default function Page() {
  return (
    <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 mt-20">
       <div className="w-full h-[300px] relative">
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

      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-4">About Us</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Welcome to BBLC – Baba Bamokhar Library Centre. We are a community-driven space designed to foster productivity, learning, and personal growth. Whether you are preparing for exams or simply in need of a peaceful environment to read and study, we offer the perfect setting for all your needs.
          </p>
        </div>
   
        {/* Mission Section */}
        <div className="flex justify-center items-center mb-12">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-lg">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600">
              At BBLC, our mission is simple: to provide an environment that promotes learning, focus, and growth. We offer fully-equipped study spaces, high-speed internet, comfortable seating, and a peaceful atmosphere designed to maximize your potential. Join us in achieving your academic and professional goals.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">High-Speed Wi-Fi</h3>
            <p className="text-lg text-gray-600">
              Stay connected with our fast and reliable Wi-Fi. Whether you’re researching for a project or attending online classes, we have you covered.
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Comfortable Seating</h3>
            <p className="text-lg text-gray-600">
              Enjoy ergonomically designed seating and fully air-conditioned study halls. Focus on your work in a comfortable and quiet environment.
            </p>
          </div>
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Ample Parking</h3>
            <p className="text-lg text-gray-600">
              Don’t worry about parking. Our library offers plenty of parking spaces, so you can come and go with ease.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-6">Meet Our Team</h2>
          <div className="flex justify-center gap-12">
            <div className="bg-white rounded-lg shadow-lg p-6 w-64">
              <img src="/team1.jpg" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">John Doe</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 w-64">
              <img src="/team2.jpg" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Jane Smith</h3>
              <p className="text-gray-600">Operations Manager</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 w-64">
              <img src="/team3.jpg" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
              <h3 className="text-xl font-semibold">Mark Wilson</h3>
              <p className="text-gray-600">Community Outreach</p>
            </div>
          </div>
        </div>

        {/* Call to Action Section */}
        <div className="bg-white text-center p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Join Us Today</h2>
          <p className="text-lg text-gray-600 mb-6">
            Become a part of our community and start your journey to success. We are here to support your growth and provide the best environment for studying and learning.
          </p>
          <button className="px-6 py-3 bg-yellow-400 text-black font-bold text-lg rounded-full hover:bg-yellow-500 transition-all duration-300">
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
}
