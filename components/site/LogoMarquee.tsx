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

/**
 * Reorders tiles so logos from the same vendor are never adjacent — several
 * vendors (HubSpot, Microsoft, …) own many products whose logos would
 * otherwise march side by side. Round-robin across vendor groups keeps every
 * company distributed evenly and is deterministic (stable across reloads).
 */
export function interleaveByVendor<T extends { vendor: string }>(tiles: T[]): T[] {
  if (tiles.length < 3) return tiles

  const groups = new Map<string, typeof tiles>()
  for (const tile of tiles) {
    const key = tile.vendor || '\u0000'
    groups.set(key, [...(groups.get(key) ?? []), tile])
  }

  const groupList = [...groups.values()].sort((a, b) => b.length - a.length)
  const max = Math.max(...groupList.map((g) => g.length))
  const interleaved: typeof tiles = []
  for (let i = 0; i < max; i++) {
    for (const group of groupList) {
      if (i < group.length) interleaved.push(group[i])
    }
  }
  return interleaved
}

export function LogoMarquee() {
  const { products, loading } = useProductList({ limit: 100 })

  const tiles = useMemo(() => {
    const fromCatalog = interleaveByVendor(
      (products ?? [])
        .filter((p) => p.product_logo)
        .map((p) => ({
          href: getProductDetailHref(p.product_id),
          logo: p.product_logo as string,
          alt: p.product_name,
          vendor: p.vendor_name ?? '',
        })),
    )
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
        className="relative border-y border-border bg-white/50 py-8 overflow-hidden"
      >
        <div className="flex items-center justify-around gap-14 px-6 opacity-60">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 w-32 bg-gray-200/80 rounded-lg animate-pulse shrink-0" />
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
      className="relative border-y border-border bg-white/50 py-8"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 bg-[linear-gradient(90deg,var(--paper),transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 bg-[linear-gradient(270deg,var(--paper),transparent)]" />
      <div className="flex overflow-hidden">
        <ul
          className="marquee-track flex shrink-0 items-center gap-22 pr-22"
          style={{ animationDuration: '48s' }}
          aria-busy={loading}
        >
          {track.map((t, i) => (
            <li key={`${t.alt}-${i}`} className="shrink-0 flex items-center justify-center">
              {t.href ? (
                <Link
                  href={t.href}
                  aria-label={`Open ${t.alt}`}
                  className="group flex h-10 items-center justify-center transition-transform duration-300 hover:scale-105"
                >
                  {t.logo ? (
                    <CatalogImage
                      src={t.logo}
                      alt={t.alt}
                      className="h-8 max-h-9 w-auto max-w-[130px] object-contain opacity-80 transition-opacity group-hover:opacity-100"
                      fallback={<IntegrationLogo name={t.alt} size={36} borderless />}
                    />
                  ) : (
                    <IntegrationLogo name={t.alt} size={36} borderless />
                  )}
                </Link>
              ) : (
                <div className="flex h-10 items-center justify-center">
                  {t.logo ? (
                    <CatalogImage
                      src={t.logo}
                      alt={t.alt}
                      className="h-8 max-h-9 w-auto max-w-[130px] object-contain opacity-80"
                      fallback={<IntegrationLogo name={t.alt} size={36} borderless />}
                    />
                  ) : (
                    <IntegrationLogo name={t.alt} size={36} borderless />
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}