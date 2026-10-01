import type { Metadata } from 'next'

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

export type PageSeoProps = {
  title: string
  description: string
  path: string
  keywords?: string[]
  noIndex?: boolean
}

export function constructMetadata({
  title,
  description,
  path,
  keywords,
  noIndex = false,
}: PageSeoProps): Metadata {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const formattedTitle = title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`

  return {
    title: formattedTitle,
    description,
    keywords: keywords || [
      'software marketplace',
      'software implementation',
      'vetted SaaS experts',
      'freelance software consultants',
      'Proploy',
    ],
    alternates: {
      canonical: cleanPath,
    },
    openGraph: {
      title: formattedTitle,
      description,
      url: cleanPath,
      siteName: SITE_NAME,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: formattedTitle,
      description,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  }
}
