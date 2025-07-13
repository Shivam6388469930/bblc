import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white ">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/heroimg/Untitled_design-removebg-preview (1).png"
                alt="BBLC Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <div>
                <p className="font-bold text-indigo-400 text-lg">BBLC</p>
                <p className="text-xs text-gray-400">Baba Bamokhar Library Centre</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              A peaceful and productive environment for students and professionals to study, learn, and grow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
              <li><a href="/service" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Fee Options */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Services</h3>
            <ul className="space-y-2">
              <li><a href="/unified-payment" className="text-gray-400 hover:text-white transition-colors">Pay Fees</a></li>
              <li><a href="/attendance" className="text-gray-400 hover:text-white transition-colors">My Attendance</a></li>
              <li><a href="/history" className="text-gray-400 hover:text-white transition-colors">Registration History</a></li>
              <li><a href="/monthly-history" className="text-gray-400 hover:text-white transition-colors">Monthly Fee History</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-indigo-400">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Baba Bamokhar, Uttar Pradesh, India</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>agraharishivam6388@gmail.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mt-0.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+91 9999999999</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} BBLC - Baba Bamokhar Library Centre. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
