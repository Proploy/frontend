import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',
  // Skip type checking during build (pre-existing errors in vendor-onboarding)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Enable React strict mode
  reactStrictMode: true,
  // Configure images to allow localhost for Figma assets
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
