'use client'

/**
 * Shared v2 expert directory card (xp-card design system).
 *
 * Extracted verbatim from app/(site)/experts/page.tsx so the main directory
 * and the /experts/<category> pages render identical cards. Pure extraction —
 * behavior must match the original exactly.
 */

import { Reveal } from '@/components/site/Reveal'
import { AuthRequiredLink } from '@/components/auth/AuthRequiredLink'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import { Skeleton } from '@/components/ui/Skeleton'
import { resolveExpertPublicResourceUrl } from '@/features/experts/public-resource'
import type { ExpertListItem } from '@/features/experts/types'
import type { CardProduct } from '@/features/catalog'

/* ── icons ──────────────────────────────────────────────────── */

export function PinIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

export function VerifiedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cobalt)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-label="Approved expert">
      <path d="M12 3l2.2 1.7 2.7-.3 1 2.6 2.3 1.5-.7 2.7.7 2.7-2.3 1.5-1 2.6-2.7-.3L12 21l-2.2-1.7-2.7.3-1-2.6L3.8 15.5l.7-2.7-.7-2.7 2.3-1.5 1-2.6 2.7.3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

/* ── helpers ────────────────────────────────────────────────── */

export function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?'
}

export function isUsefulLabel(value: string) {
  return Boolean(value?.trim()) && value.trim().length <= 64
}

export function tagValues(expert: ExpertListItem, tagType: string) {
  return expert.tags?.filter((tag) => tag.tagType === tagType).map((tag) => tag.tagValue) ?? []
}

export function dedupe(values: string[]) {
  return Array.from(new Set(values.filter(isUsefulLabel)))
}

export function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

export function isSameProductName(productName: string, platformName: string) {
  const product = normalizeName(productName)
  const platform = normalizeName(platformName)
  if (!product || !platform) return false
  if (product === platform) return true
  if (Math.min(product.length, platform.length) < 4) return false
  return product.startsWith(platform) || platform.startsWith(product)
}

export function expertPlatforms(expert: ExpertListItem) {
  return dedupe([
    ...(expert.primaryPlatforms ?? []),
    ...(expert.secondaryPlatforms ?? []),
    ...tagValues(expert, 'platform'),
  ])
}

/* ── loading skeleton ───────────────────────────────────────── */

export function ExpertCardSkeleton() {
  return (
    <article className="xp-card" aria-hidden="true" style={{ padding: 'var(--sp-6)', gap: 'var(--sp-4)' }}>
      <div className="pp-flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Skeleton shape="circle" className="size-[54px] shrink-0" />
        <div className="pp-flex" style={{ gap: 4 }}>
          <Skeleton shape="circle" className="size-[36px]" />
          <Skeleton shape="circle" className="size-[36px]" />
        </div>
      </div>
      <div className="pp-stack" style={{ gap: 8 }}>
        <Skeleton className="h-[20px] w-[55%] rounded-[6px]" />
        <Skeleton className="h-[14px] w-[40%] rounded-[6px]" />
      </div>
      <Skeleton className="h-[44px] w-full rounded-[8px]" />
      <div className="pp-flex pp-wrap" style={{ gap: 8 }}>
        <Skeleton className="h-[28px] w-[110px] rounded-full" />
        <Skeleton className="h-[28px] w-[90px] rounded-full" />
        <Skeleton className="h-[28px] w-[120px] rounded-full" />
      </div>
    </article>
  )
}

/* ── expert card (real data → xp-card) ──────────────────────── */

export function ExpertCard({
  expert,
  index,
  catalogProducts,
}: {
  expert: ExpertListItem
  index: number
  catalogProducts: CardProduct[]
}) {
  const platforms = expertPlatforms(expert).slice(0, 4)
  const pills = [
    ...(expert.yearsExperience != null && expert.yearsExperience > 0
      ? [`${expert.yearsExperience} yrs experience`]
      : []),
    ...dedupe([
      ...(expert.industryExpertise ?? []),
      ...tagValues(expert, 'industry'),
      ...(expert.preferredProjectTypes ?? []),
      ...tagValues(expert, 'project_type'),
    ]),
  ].slice(0, 5)

  const location = [expert.regionCity, expert.regionCountry].filter(Boolean).join(', ')
  const pictureUrl = resolveExpertPublicResourceUrl(expert.profilePictureUrl)

  return (
    <Reveal className="pp-stack" delay={(index % 2) * 90}>
      <AuthRequiredLink href={`/experts/${expert.id}`} className="xp-card pp-lift xp-card-link">
        <div className="pp-flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-3)' }}>
          <span
            className="pp-avatar pp-avatar--lg"
            style={{ background: 'linear-gradient(135deg,var(--cobalt),#7f56d9)', color: '#fff', overflow: pictureUrl ? 'hidden' : undefined }}
          >
            {pictureUrl ? (
              <CatalogImage
                src={pictureUrl}
                alt={expert.displayName}
                className="size-full rounded-full object-cover"
                fallback={initialsOf(expert.displayName)}
              />
            ) : (
              initialsOf(expert.displayName)
            )}
          </span>

          {platforms.length > 0 && (
            <div className="xp-logos" aria-label="Platforms">
              {platforms.map((platform) => {
                const product = catalogProducts.find((candidate) =>
                  isSameProductName(candidate.product_name, platform),
                )
                return (
                  <span key={platform} className="xp-logo" title={platform}>
                    {product?.product_logo ? (
                      <CatalogImage
                        src={product.product_logo}
                        alt={`${platform} logo`}
                        className="size-full object-contain"
                        fallback={platform.charAt(0).toUpperCase()}
                      />
                    ) : (
                      platform.charAt(0).toUpperCase()
                    )}
                  </span>
                )
              })}
            </div>
          )}
        </div>

        <div className="pp-stack" style={{ gap: 4 }}>
          <div className="pp-flex pp-gap-2" style={{ alignItems: 'center' }}>
            <span className="pp-h5">{expert.displayName}</span>
            <VerifiedIcon />
          </div>
          {location && (
            <p className="pp-small pp-flex" style={{ alignItems: 'center', gap: 5 }}>
              <PinIcon />
              {location}
            </p>
          )}
        </div>

        {expert.headline && <p className="pp-body pp-clamp-3">{expert.headline}</p>}

        {pills.length > 0 && (
          <div className="pp-flex pp-wrap pp-gap-2" style={{ marginTop: 'auto' }}>
            {pills.map((pill) => (
              <span key={pill} className="pp-tag">
                <span className="xp-pill-dot" aria-hidden="true" />
                {pill}
              </span>
            ))}
          </div>
        )}
      </AuthRequiredLink>
    </Reveal>
  )
}
