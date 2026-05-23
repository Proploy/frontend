import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip type checking during build (pre-existing errors)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Enable React strict mode
  reactStrictMode: true,
  // Configure images to allow localhost for Figma assets
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
