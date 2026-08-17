'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { IntegrationLogo } from '@/components/integrations/IntegrationLogo'
import { useProductList } from '@/features/catalog'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import { Reveal } from "./Reveal"

// Defaults match the original Vault design — used when Sanity hasn't authored
// the integrations section yet, or when the live data fails the safety
// checks below.
const DEFAULT_EYEBROW = "Integrations"
const DEFAULT_TITLE = "Connects to the tools your teams already run."
const DEFAULT_BODY =
  "30+ apps and growing — finance, identity, ticketing, data warehouse. Procurement data flows both ways, so spend, contracts and delivery status stay in one place."

// Shape of the integrations section as authored in Sanity. Kept loose on
// purpose: not every field is required, and `ringA`/`ringB` may legitimately
// be null/undefined while the document is being populated.
type IntegrationsData = {
  eyebrow?: string | null
  title?: string | null
  body?: string | null
  // When authored in Sanity, ring entries may carry product links or just a
  // brand label. Either way we render the catalog logo if one is linked.
  ringA?: (string | { label: string; productId?: string | null })[] | null
  ringB?: (string | { label: string; productId?: string | null })[] | null
}

type RingEntry = { label: string; productId: string | null; logo: string | null }

function safeArray(
  value: IntegrationsData['ringA'],
  fallback: string[],
): (string | { label: string; productId?: string | null })[] {
  return Array.isArray(value) ? value : fallback
}

function safeText(value: string | null | undefined, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback
}

function entryLabel(value: string | { label: string; productId?: string | null }): string {
  return typeof value === "string" ? value : value.label
}

function entryProductId(value: string | { label: string; productId?: string | null }): string | null {
  if (typeof value === "string") return null
  return value.productId ?? null
}

function Ring({
  items,
  radius,
  size,
  reverse,
  lookupLogo,
}: {
  items: RingEntry[]
  radius: number
  size: number
  reverse?: boolean
  lookupLogo: (productId: string | null, label: string) => string | null
}) {
  return (
    <div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border ${
        reverse ? "spin-slower-rev" : "spin-slow"
      }`}
      style={{ width: `${radius * 2}px`, height: `${radius * 2}px` }}
    >
      {items.map((entry, i) => {
        const angle = (i / items.length) * Math.PI * 2
        const x = radius + Math.cos(angle) * radius - size / 2
        const y = radius + Math.sin(angle) * radius - size / 2
        const logo = lookupLogo(entry.productId, entry.label)
        return (
          <div
            key={entry.productId ?? entry.label}
            className={`absolute grid place-items-center rounded-2xl border border-border bg-white shadow-[0_10px_28px_-20px_rgba(21,94,239,0.7)] ${
              reverse ? "spin-slower" : "spin-slow-rev"
            }`}
            style={{ left: Math.round(x), top: Math.round(y), width: size, height: size }}
          >
            {logo ? (
              <CatalogImage
                src={logo}
                alt={entry.label}
                className="h-2/3 w-2/3 object-contain"
                fallback={<IntegrationLogo name={entry.label.toLowerCase()} size={Math.round(size * 0.7)} />}
              />
            ) : (
              <IntegrationLogo name={entry.label.toLowerCase()} size={Math.round(size * 0.7)} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export function Integrations({ data }: { data?: IntegrationsData } = {}) {
  // Pull the live catalog so the ring tiles render real brand logos and
  // dynamic count directly from the database.
  const { products } = useProductList({ limit: 100 })

  const logoLookup = useMemo(() => {
    const byId = new Map<string, string>()
    const byName = new Map<string, string>()
    for (const p of products ?? []) {
      if (p.product_logo) {
        if (p.product_id) byId.set(p.product_id, p.product_logo)
        if (p.product_name) byName.set(p.product_name.toLowerCase(), p.product_logo)
      }
    }
    return { byId, byName }
  }, [products])

  const lookupLogo = (productId: string | null, label: string) => {
    if (productId && logoLookup.byId.has(productId)) return logoLookup.byId.get(productId) ?? null
    const lowerLabel = label.toLowerCase()
    if (logoLookup.byName.has(lowerLabel)) return logoLookup.byName.get(lowerLabel) ?? null
    return null
  }

  const { ringAEntries, ringBEntries, appCount } = useMemo(() => {
    const catalogProducts = (products ?? []).filter((p) => p.product_name)
    const count = Math.max(catalogProducts.length, 30)

    if (catalogProducts.length >= 6) {
      // Build dynamic rings directly from live database products
      const innerCount = Math.min(6, catalogProducts.length)
      const outerCount = Math.min(8, Math.max(0, catalogProducts.length - innerCount))
      
      const ringAItems: RingEntry[] = catalogProducts.slice(0, innerCount).map((p) => ({
        label: p.product_name,
        productId: p.product_id,
        logo: p.product_logo ?? null,
      }))
      const ringBItems: RingEntry[] = (outerCount > 0 ? catalogProducts.slice(innerCount, innerCount + outerCount) : catalogProducts.slice(0, 6)).map((p) => ({
        label: p.product_name,
        productId: p.product_id,
        logo: p.product_logo ?? null,
      }))
      return { ringAEntries: ringAItems, ringBEntries: ringBItems, appCount: count }
    }

    const ringA = safeArray(data?.ringA, ["Slack", "NetSuite", "Xero", "Jira", "Okta", "HubSpot"])
    const ringB = safeArray(data?.ringB, ["Workday", "SAP", "Notion", "Snowflake", "Zendesk"])

    return {
      ringAEntries: ringA.map((v) => ({ label: entryLabel(v), productId: entryProductId(v), logo: null })),
      ringBEntries: ringB.map((v) => ({ label: entryLabel(v), productId: entryProductId(v), logo: null })),
      appCount: count,
    }
  }, [data?.ringA, data?.ringB, products])

  const eyebrow = safeText(data?.eyebrow, DEFAULT_EYEBROW)
  const title = safeText(data?.title, DEFAULT_TITLE)
  const body = safeText(data?.body, DEFAULT_BODY)

  return (
    <section id="integrations" className="relative overflow-hidden border-y border-border bg-white/60 py-24 lg:py-32">
      <div className="mx-auto grid max-w-[1240px] items-center gap-16 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <Reveal>
          <span className="label">{eyebrow}</span>
          <h2 className="display mt-5 max-w-[16ch] text-[clamp(2rem,4.2vw,3.25rem)] text-ink">
            {title}
          </h2>
          <p className="mt-6 max-w-[40ch] text-[1rem] leading-relaxed text-ink-soft">{body}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <span className="display text-[2.5rem] text-cobalt">{appCount}+</span>
            <span className="label max-w-[14ch] leading-relaxed">apps connected and growing</span>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto aspect-square w-full max-w-[460px]">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--cobalt)_14%,transparent),transparent_62%)] blur-xl"
            />
            <Ring items={ringBEntries} radius={215} size={62} reverse lookupLogo={lookupLogo} />
            <Ring items={ringAEntries} radius={135} size={62} lookupLogo={lookupLogo} />
            <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-3xl border border-border bg-ink shadow-[0_30px_60px_-30px_var(--cobalt)]">
              <Image
                src="/PROPLOY.svg"
                alt="Proploy"
                width={72}
                height={20}
                className="h-5 w-auto brightness-0 invert"
                priority={false}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}