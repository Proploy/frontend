/**
 * The origin search engines should treat as the site.
 *
 * Deliberately not `NEXT_PUBLIC_APP_URL`. That one is the origin the app runs
 * on, which auth redirects need, and production also answers on the raw Cloud
 * Run host and on www. Canonical links, the sitemap and OG URLs must all name
 * one host whichever of those served the request, or the copies compete.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://proploy.io').replace(/\/+$/, '')

export const SITE_NAME = 'Proploy'

export const SITE_DESCRIPTION =
  'Proploy matches your business with the right software and the vetted experts who deploy it. Pre-negotiated pricing, full spend visibility, guaranteed execution.'
