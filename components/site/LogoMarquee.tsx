'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { getProductDetailHref, useProductList } from '@/features/catalog'
import { IntegrationLogo } from '@/components/integrations/IntegrationLogo'
import { CatalogImage } from '@/components/catalog/CatalogImage'

// Tiles come from the live catalog (approved_logo_url via the backend gateway)
// rather than a hardcoded set of invented brand names. While the request is in
// flight or the catalog is empty, we fall back to a small static set so the
// marquee layout never collapses during initial paint.
const FALLBACK_NAMES = ['Slack', 'Stripe', 'Linear', 'Jira', 'Zoom', 'HubSpot', 'Figma', 'DocuSign']

export function LogoMarquee() {
  const { products, loading } = useProductList({ limit: 100 })

  const tiles = useMemo(() => {
    const fromCatalog = (products ?? [])
      .filter((p) => p.product_logo)
      .slice(0, 14)
      .map((p) => ({
        href: getProductDetailHref(p.product_id),
        logo: p.product_logo as string,
        alt: p.product_name,
      }))
    if (fromCatalog.length > 0) return fromCatalog

    // Only fallback to mock names if loading is complete and catalog returned 0 products
    if (!loading && (products ?? []).length === 0) {
      return FALLBACK_NAMES.map((name) => ({
        href: null,
        logo: null,
        alt: name,
      }))
    }

    return []
  }, [products, loading])

  if (loading && tiles.length === 0) {
    return (
      <section
        aria-label="Loading companies..."
        className="relative border-y border-border bg-white/50 py-6 overflow-hidden"
      >
        <div className="flex items-center justify-around gap-12 px-6 opacity-60">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-7 w-28 bg-gray-200/80 rounded-md animate-pulse shrink-0" />
          ))}
        </div>
      </section>
    )
  }

  // Duplicate the strip once so the CSS marquee animation reads as seamless.
  const track = [...tiles, ...tiles]

  return (
    <section
      aria-label="Companies growing with Proploy"
      className="relative border-y border-border bg-white/50 py-6"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-[linear-gradient(90deg,var(--paper),transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(270deg,var(--paper),transparent)]" />
      <div className="flex overflow-hidden">
        <ul className="marquee-track flex shrink-0 items-center gap-14 pr-14" aria-busy={loading}>
          {track.map((t, i) => (
            <li key={`${t.alt}-${i}`} className="display shrink-0">
              {t.href ? (
                <Link
                  href={t.href}
                  aria-label={`Open ${t.alt}`}
                  className="flex items-center text-[1.05rem] tracking-[-0.02em] text-ink-soft/55 transition-colors duration-300 hover:text-cobalt"
                >
                  {t.logo ? (
                    <CatalogImage
                      src={t.logo}
                      alt={t.alt}
                      className="h-7 w-auto opacity-70 transition-opacity hover:opacity-100"
                      fallback={<IntegrationLogo name={t.alt.toLowerCase()} size={28} />}
                    />
                  ) : (
                    <IntegrationLogo name={t.alt.toLowerCase()} size={28} />
                  )}
                </Link>
              ) : t.logo ? (
                <CatalogImage
                  src={t.logo}
                  alt={t.alt}
                  className="h-7 w-auto opacity-70"
                  fallback={<IntegrationLogo name={t.alt.toLowerCase()} size={28} />}
                />
              ) : (
                <IntegrationLogo name={t.alt.toLowerCase()} size={28} />
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}