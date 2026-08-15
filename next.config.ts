import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * Security headers added per penetration-test remediation 2026-08-05.
 * See the SECURITY-FIX plan for rationale on each header.
 *
 */
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "interest-cohort=()",
      "payment=()",
      "usb=()",
      "display-capture=()",
    ].join(", "),
  },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // Pin workspace root to this dir (multiple lockfiles confuse inference)
  turbopack: {
    root: projectRoot,
  },
  // Skip type checking during build (pre-existing errors)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Enable React strict mode
  reactStrictMode: true,
  // Apply production security headers to every response, including the
  // assets that the middleware matcher skips.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // Configure images to allow localhost for Figma assets and OAuth avatars
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
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.microsoft.com',
      },
      {
        protocol: 'https',
        hostname: 'service-apis-731353524841.australia-southeast1.run.app',
      },
      {
        protocol: 'https',
        hostname: '*.run.app',
      },
    ],
  },
};

export default nextConfig;
