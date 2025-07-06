'use client';
import Image from 'next/image';

export default function Page() {
    return (
        <>
            {/* Hero Section */}
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

            {/* Introduction Section */}
            <div className="bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 mt-20">
                <div className="container mx-auto px-6 py-16">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold mb-4">Our State-of-the-Art Facilities</h1>
                        <p className="text-lg max-w-2xl mx-auto">
                            At BBLC, we are proud to provide a range of facilities designed to support your learning, growth, and comfort. Whether you are here to study, attend workshops, or simply relax, we have everything you need to make the most of your time with us.
                        </p>
                    </div>

                    {/* Key Facilities Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold mb-4">High-Speed Wi-Fi</h3>
                            <p className="text-lg text-gray-600">
                                Stay connected with our fast and reliable Wi-Fi throughout the facility. Perfect for research, online classes, or any work that requires constant internet access.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold mb-4">Comfortable Seating</h3>
                            <p className="text-lg text-gray-600">
                                Our ergonomic seating arrangements and comfortable study halls ensure that you can study for hours without discomfort, making focus and productivity effortless.
                            </p>
                        </div>
                        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold mb-4">Ample Parking</h3>
                            <p className="text-lg text-gray-600">
                                We provide plenty of parking space to make your visit hassle-free. No need to worry about finding a parking spot when you arrive.
                            </p>
                        </div>
                    </div>

                    {/* Additional Facility Details */}
                    <div className="flex justify-center items-center mb-12">
                        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-lg">
                            <h2 className="text-3xl font-bold mb-6">Meeting and Conference Rooms</h2>
                            <p className="text-lg text-gray-600">
                                Our fully-equipped meeting rooms provide the ideal setting for group discussions, presentations, and workshops. With whiteboards, projectors, and plenty of space, you’ll have everything you need to collaborate efficiently.
                            </p>
                        </div>
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
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    onClick={() => {
                                        window.location.href = '/unified-payment?batch=Morning%20Batch&plan=Monthly';
                                    }}
                                >
                                    Book Now
                                </button>
                            </div>

                            {/* Card 2 - Noon Batch */}
                            <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105">
                                <h2 className="text-2xl font-bold mb-4">Mid Morning Batch</h2>
                                <p className="text-lg text-gray-600 mb-4">10:00 AM - 5:00 PM</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    The Noon Batch is perfect for those who prefer a midday session. With ample time to rest in the morning, this batch is designed for a more relaxed yet productive atmosphere, allowing you to study during the quieter part of the day.
                                </p>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    onClick={() => {
                                        window.location.href = '/unified-payment?batch=Mid%20Morning%20Batch&plan=Monthly';
                                    }}
                                >
                                    Book Now
                                </button>
                            </div>

                            {/* Card 3 - Evening Batch */}
                            <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105">
                                <h2 className="text-2xl font-bold mb-4">Afternoon Batch</h2>
                                <p className="text-lg text-gray-600 mb-4">2:00 PM - 9:00 PM</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Our Evening Batch caters to those with flexible schedules who want to make the most of their evenings. Whether you're working during the day or prefer a calm evening study environment, this batch offers a peaceful, focused session.
                                </p>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    onClick={() => {
                                        window.location.href = '/unified-payment?batch=Afternoon%20Batch&plan=Monthly';
                                    }}
                                >
                                    Book Now
                                </button>
                            </div>

                            {/* Card 4 - Night Batch */}
                            <div className="bg-white rounded-lg shadow-lg p-6 text-center transition-transform transform hover:scale-105">
                                <h2 className="text-2xl font-bold mb-4">Full Day Batch</h2>
                                <p className="text-lg text-gray-600 mb-4">6:00 AM - 9:00 PM</p>
                                <p className="text-sm text-gray-500 mb-4">
                                    Our Night Batch is designed for night owls and those who need flexibility after a long day. This batch provides a quiet and conducive environment for those who find it easier to focus during the late hours of the night.
                                </p>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                    onClick={() => {
                                        window.location.href = '/unified-payment?batch=Full%20Day%20Batch&plan=Monthly';
                                    }}
                                >
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </>
            );
}
