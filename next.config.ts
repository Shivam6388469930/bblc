import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure image domains
  images: {
    domains: [
      'res.cloudinary.com',  // Allow Cloudinary images
      'fonts.gstatic.com',   // Allow Google Fonts
    ],
    // You can also use a loader for Cloudinary if needed
    // loader: 'cloudinary',
    // path: 'https://res.cloudinary.com/dkzupc7jr/image/upload/',
  },
  // Font optimization settings
  optimizeFonts: false,
};

export default nextConfig;
