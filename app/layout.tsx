import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";

/**
 * DM Sans - Used for hero headlines and branding text
 * Inter - Used for body text and UI elements
 */
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Proploy - Procurement Solutions",
  description: "Smart procurement platform for your business needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${dmSans.variable} ${inter.variable}`}>
        <body className="antialiased font-inter">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
