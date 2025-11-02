import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // ✅ Disable strict mode để tránh double render trong development
  images: {
    domains: ["res.cloudinary.com"], // Cho phép hiển thị ảnh từ Cloudinary
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
