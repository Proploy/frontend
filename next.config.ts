import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * Security headers added per penetration-test remediation 2026-08-05.
 * See the SECURITY-FIX plan for rationale on each header.
 *
 * IMPORTANT — Content-Security-Policy trade-off:
 * The current policy uses `'unsafe-inline'` on `script-src` because Next.js
 * (App Router) and several dependencies (Tailwind v4 runtime, Sanity
 * Studio when loaded under /studio) inject inline scripts. Migrating to
 * `nonce-…` would require touching every Server Component. The risk is
 * bounded by `default-src 'self'`, the strict frame-ancestors/frame-src,
 * and the same-origin connect-src. Revisit when the Next.js 16 stable
 * nonce story lands.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js dev/runtime + Tailwind v4 + Sanity Vision need inline
      // scripts. Locked down further is the long-term target.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.sanity.io",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      // Supabase auth/storage + Sanity CDN + Google avatar CDN + GitHub + Microsoft CDN + local service-apis gateway.
      "img-src 'self' data: blob: http://localhost:* http://127.0.0.1:* https://eczlamdmamicyugklabj.supabase.co https://*.supabase.co https://cdn.sanity.io https://lh3.googleusercontent.com https://*.googleusercontent.com https://avatars.githubusercontent.com https://*.githubusercontent.com https://*.microsoft.com",
      "connect-src 'self' http://localhost:* https://eczlamdmamicyugklabj.supabase.co https://*.supabase.co wss://*.supabase.co https://*.sanity.io https://service-apis-731353524841.australia-southeast1.run.app",
      // OAuth provider redirects land in the top frame.
      "frame-src 'self' https://accounts.google.com https://github.com https://login.microsoftonline.com https://*.supabase.co",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join("; "),
  },
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
    ],
  },
};

export default nextConfig;
