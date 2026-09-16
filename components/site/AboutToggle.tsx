'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * A pill toggle shown on the for-businesses / for-experts branding pages.
 * Uses the v2 design system tokens and sits in the hero section of each page.
 */
export function AboutToggle() {
  const pathname = usePathname()
  const isExperts = pathname === '/for-experts'

  return (
    <nav
      aria-label="Switch audience"
      className="about-toggle"
    >
      <Link
        href="/for-businesses"
        aria-current={!isExperts ? 'page' : undefined}
        className={`about-toggle__tab ${!isExperts ? 'is-active' : ''}`}
      >
        For Businesses
      </Link>
      <Link
        href="/for-experts"
        aria-current={isExperts ? 'page' : undefined}
        className={`about-toggle__tab ${isExperts ? 'is-active' : ''}`}
      >
        For Experts
      </Link>
    </nav>
  )
}
