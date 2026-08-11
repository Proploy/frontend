'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'
import { hidesGlobalChrome } from '@/lib/site-chrome'

// Renders the marketing Footer globally (mounted once in the root layout),
// suppressing it on internal portal routes that own their own chrome — the same
// rule the global Navbar uses. This guarantees the footer appears throughout the
// public site without each page importing it.
export default function SiteFooter() {
  const pathname = usePathname()
  if (hidesGlobalChrome(pathname)) return null
  return <Footer />
}
