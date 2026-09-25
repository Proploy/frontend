import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo'
import { PORTAL_PREFIXES } from '@/lib/site-chrome'

// Signed-in surfaces have nothing to index, and a crawler that follows a link
// into one lands on a sign-in redirect. `PORTAL_PREFIXES` is already the list
// of those routes for the chrome, so reusing it keeps the two from drifting.
const PRIVATE_PREFIXES = [
  ...PORTAL_PREFIXES,
  '/studio',
  '/api/',
  '/auth/',
  '/dashboard',
  '/settings',
  '/profile',
  '/compare',
  '/legacy-home',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: PRIVATE_PREFIXES },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
