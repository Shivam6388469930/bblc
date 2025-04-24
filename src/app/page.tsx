'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';

export default function HomePage() {
  return (
    <div className="h-[60vh] w-full">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="h-full w-full"
      >
        <SwiperSlide>
          <div className="relative h-[60vh] w-full">
            <Image
              src="/heroimg/pexels-pixabay-159775.jpg"
              alt="image 1"
              fill
              className="object-cover rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-3xl sm:text-4xl font-bold bg-black/50 px-8 py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-500">
                <h1>We are Providing Peaceful Environment</h1>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative h-[60vh] w-full">
            <Image
              src="/heroimg/WhatsApp Image 2025-04-21 at 12.12.05_d4e63f5b.jpg"
              alt="image 2"
              fill
              className="object-cover rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-3xl sm:text-4xl font-bold bg-black/50 px-8 py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-500">
                <h1>Separated Desks For Everyone</h1>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="relative h-[60vh] w-full">
            <Image
              src="/heroimg/WhatsApp Image 2025-04-21 at 12.12.04_df939f16.jpg"
              alt="image 3"
              fill
              className="object-cover rounded-xl shadow-lg transform hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-3xl sm:text-4xl font-bold bg-black/50 px-8 py-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-500">
                <h1>Discover stories, cultures, and traditions through</h1>
                <h1>our special festive collection at the Library</h1>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className="text-center bg-gradient-to-r  to-pink-400 via-purple-500 mt-3 mb-3 rounded-lg p-8 shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 pt-6">Why Choose BBLC</h1>
        <h3 className="text-center container px-7 font-extrabold text-black mb-6 leading-relaxed">
          Welcome to BBLC – Baba Bamokhar Library Centre, a space thoughtfully designed to nurture your focus and fuel your goals. We provide a peaceful and distraction-free environment, equipped with high-speed Wi-Fi, fully air-conditioned study halls, RO drinking water, and ample parking space. Whether you're preparing for competitive exams or simply need a quiet corner to read, our user-friendly batch timings ensure you find the perfect slot that fits your routine. Come experience productivity like never before at BBLC!
        </h3>
        <button className="px-6 py-3 mt-3 mb-3 bg-yellow-400 text-black font-bold text-lg rounded-full hover: bg-blue-400 transition-all duration-300 transform hover:scale-105">
          Join BBLC Today
        </button>
      </div>

      <div className="text-center bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 mt-3 mb-3 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 pt-6">Batch Timing</h1>

        {/* Grid Container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {/* Card 1 - Morning Batch */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold mb-4">Morning Batch</h2>
            <p className="text-lg text-gray-600 mb-4">6:00 AM - 2:00 PM</p>
            <p className="text-sm text-gray-500 mb-4">
              Start your day with our Morning Batch, designed for those who like to get a jump on their day. Ideal for early risers or individuals with busy afternoons, this batch offers a quiet and focused study time to set a productive tone for the rest of the day.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="px-6 py-3 bg-yellow-400 text-black font-bold text-lg rounded-full hover:bg-blue-400 transition-all duration-300 transform hover:scale-105">
                Join Now
              </button>
              <button className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                More Info
              </button>
            </div>
          </div>

          {/* Card 2 - Noon Batch */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold mb-4">Mid Morning Batch</h2>
            <p className="text-lg text-gray-600 mb-4">10:00 AM - 5:00 PM</p>
            <p className="text-sm text-gray-500 mb-4">
              The Noon Batch is perfect for those who prefer a midday session. With ample time to rest in the morning, this batch is designed for a more relaxed yet productive atmosphere, allowing you to study during the quieter part of the day.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="px-6 py-3 bg-yellow-400 text-black font-bold text-lg rounded-full hover:bg-blue-400 transition-all duration-300 transform hover:scale-105">
                Join Now
              </button>
              <button className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                More Info
              </button>
            </div>
          </div>

          {/* Card 3 - Evening Batch */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold mb-4">Afternoon Batch</h2>
            <p className="text-lg text-gray-600 mb-4">2:00 PM - 9:00 PM</p>
            <p className="text-sm text-gray-500 mb-4">
              Our Evening Batch caters to those with flexible schedules who want to make the most of their evenings. Whether you're working during the day or prefer a calm evening study environment, this batch offers a peaceful, focused session.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="px-6 py-3 bg-yellow-400 text-black font-bold text-lg rounded-full hover:bg-blue-400 transition-all duration-300 transform hover:scale-105">
                Join Now
              </button>
              <button className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                More Info
              </button>
            </div>
          </div>

          {/* Card 4 - Night Batch */}
          <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105">
            <h2 className="text-2xl font-bold mb-4">Full Day Batch</h2>
            <p className="text-lg text-gray-600 mb-4">6:00 AM - 9:00 PM</p>
            <p className="text-sm text-gray-500 mb-4">
              Our Night Batch is designed for night owls and those who need flexibility after a long day. This batch provides a quiet and conducive environment for those who find it easier to focus during the late hours of the night.
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="px-6 py-3 bg-yellow-400 text-black font-bold text-lg rounded-full hover:bg-blue-400 transition-all duration-300 transform hover:scale-105">
                Join Now
              </button>
              <button className="px-6 py-3 bg-blue-500 text-white font-bold text-lg rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                More Info
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
