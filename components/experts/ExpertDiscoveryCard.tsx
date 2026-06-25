'use client'

import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  CheckCircle2,
  Layers3,
  MapPin,
  Sparkles,
  Wrench,
} from 'lucide-react'
import { AuthRequiredLink } from '@/components/auth/AuthRequiredLink'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import type { CardProduct } from '@/features/catalog'
import type { ExpertListItem } from '@/features/experts/types'

export function ExpertDiscoveryCard({
  expert,
  catalogProducts,
}: {
  expert: ExpertListItem
  catalogProducts: CardProduct[]
}) {
  const tags = getDisplayTags(expert)
  const projects = expert.projects ?? []
  const platforms = Array.from(new Set([
    ...(expert.primaryPlatforms ?? []),
    ...(expert.secondaryPlatforms ?? []),
  ])).slice(0, 5)
  const relatedProducts = platforms
    .map((platform) => catalogProducts.find(
      (product) => isSameProductName(product.product_name, platform),
    ))
    .filter((product): product is CardProduct => Boolean(product))
  const expertise = Array.from(new Set([
    ...(expert.industryExpertise ?? []),
    ...(expert.preferredProjectTypes ?? []),
  ])).filter(isUsefulLabel).slice(0, 5)
  const tools = (expert.toolsStack ?? []).filter(isUsefulLabel).slice(0, 4)

  return (
    <article className="overflow-hidden rounded-[18px] border border-[#e0e3e8] bg-white shadow-[0_8px_24px_rgba(10,13,18,0.04)]">
      <div className="flex flex-col gap-[18px] p-[20px] sm:p-[24px] lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 items-start gap-[14px]">
          <div className="relative flex size-[54px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#155eef] to-[#7f56d9] text-[20px] font-semibold text-white">
            {expert.profilePictureUrl ? (
              <CatalogImage
                src={expert.profilePictureUrl}
                alt={expert.displayName}
                className="size-full object-cover"
                fallback={expert.displayName.charAt(0).toUpperCase()}
              />
            ) : (
              expert.displayName.charAt(0).toUpperCase()
            )}
            <span className="absolute bottom-0 right-0 size-[14px] rounded-full border-2 border-white bg-[#17b26a]" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-[7px]">
              <AuthRequiredLink href={`/experts/${expert.id}`} className="truncate text-[18px] font-semibold text-[#181d27] hover:text-[#004eeb]">
                {expert.displayName}
              </AuthRequiredLink>
              <BadgeCheck size={17} className="shrink-0 text-[#155eef]" aria-label="Approved expert" />
              {expert.entityType && (
                <span className="rounded-full bg-[#f2f4f7] px-[8px] py-[3px] text-[11px] font-semibold text-[#535862]">
                  {expert.entityType}
                </span>
              )}
            </div>
            {(expert.regionCity || expert.regionCountry) && (
              <p className="mt-[3px] flex items-center gap-[4px] text-[12px] text-[#717680]">
                <MapPin size={13} />
                {[expert.regionCity, expert.regionCountry].filter(Boolean).join(', ')}
              </p>
            )}
            {expert.headline && (
              <p className="mt-[10px] max-w-[720px] text-[15px] font-medium leading-[22px] text-[#414651]">
                {expert.headline}
              </p>
            )}
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-x-[22px] gap-y-[10px] sm:grid-cols-3">
          <Metric label="Experience" value={expert.yearsExperience != null ? `${expert.yearsExperience} yrs` : '—'} />
          <Metric label="Completed" value={expert.projectsCompletedTotal != null ? String(expert.projectsCompletedTotal) : '—'} />
          <Metric label="Portfolio" value={String(projects.length)} />
        </div>

        {platforms.length > 0 && (
          <div className="flex shrink-0 items-center -space-x-[8px]" aria-label="Related products">
            {platforms.slice(0, 4).map((platform) => {
              const product = relatedProducts.find(
                (candidate) => isSameProductName(candidate.product_name, platform),
              )
              return (
                <div
                  key={platform}
                  title={platform}
                  className="flex size-[38px] items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#f2f4f7] p-[7px] text-[12px] font-bold text-[#155eef] shadow-sm"
                >
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
                </div>
              )
            })}
          </div>
        )}

        <AuthRequiredLink
          href={`/experts/${expert.id}`}
          className="inline-flex h-[42px] shrink-0 items-center justify-center gap-[6px] rounded-[10px] bg-[#181d27] px-[16px] text-[14px] font-semibold text-white hover:bg-[#344054]"
        >
          View profile
          <ArrowRight size={16} />
        </AuthRequiredLink>
      </div>

      <div className="grid border-y border-[#e9eaeb] bg-[#fafbfc] md:grid-cols-3">
        <ExpertiseColumn
          icon={<Layers3 size={16} />}
          label="Product expertise"
          values={platforms}
          empty="Platforms not listed yet"
        />
        <ExpertiseColumn
          icon={<Sparkles size={16} />}
          label="Expertise focus"
          values={expertise}
          empty="Expertise areas not listed yet"
        />
        <ExpertiseColumn
          icon={<Wrench size={16} />}
          label="Delivery toolkit"
          values={tools}
          empty={expert.availabilityNotes || 'Tools and delivery notes coming soon'}
          last
        />
      </div>

      <div className="flex flex-wrap items-center gap-[8px] px-[20px] py-[14px] sm:px-[24px]">
        {tags.map((tag) => (
          <span key={tag} className="rounded-full bg-[#f2f4f7] px-[10px] py-[5px] text-[12px] font-medium text-[#414651]">
            {tag}
          </span>
        ))}
        {projects.length > 0 && (
          <span className="inline-flex items-center gap-[5px] rounded-full bg-[#eff4ff] px-[10px] py-[5px] text-[12px] font-semibold text-[#004eeb]">
            <CheckCircle2 size={13} />
            {projects.length} published {projects.length === 1 ? 'case study' : 'case studies'}
          </span>
        )}
        {expert.schedulingLinkEnabled && expert.schedulingLink && (
          <span className="ml-auto inline-flex items-center gap-[5px] rounded-full bg-[#ecfdf3] px-[10px] py-[5px] text-[12px] font-semibold text-[#067647]">
            <CalendarCheck size={13} />
            Scheduling available
          </span>
        )}
      </div>
    </article>
  )
}

function ExpertiseColumn({
  icon,
  label,
  values,
  empty,
  last = false,
}: {
  icon: React.ReactNode
  label: string
  values: string[]
  empty: string
  last?: boolean
}) {
  return (
    <div className={`min-w-0 px-[20px] py-[18px] sm:px-[24px] ${last ? '' : 'border-b border-[#e9eaeb] md:border-b-0 md:border-r'}`}>
      <p className="flex items-center gap-[7px] text-[12px] font-semibold uppercase tracking-[0.07em] text-[#535862]">
        <span className="text-[#155eef]">{icon}</span>
        {label}
      </p>
      {values.length > 0 ? (
        <div className="mt-[12px] flex flex-wrap gap-[7px]">
          {values.map((value) => (
            <span key={value} className="rounded-[7px] border border-[#e0e3e8] bg-white px-[9px] py-[5px] text-[12px] font-medium text-[#414651]">
              {value}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-[11px] line-clamp-2 text-[12px] leading-[18px] text-[#717680]">{empty}</p>
      )}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-[72px]">
      <p className="text-[16px] font-semibold text-[#181d27]">{value}</p>
      <p className="mt-[1px] text-[11px] text-[#717680]">{label}</p>
    </div>
  )
}

function getDisplayTags(expert: ExpertListItem) {
  const preferred = [
    ...(expert.primaryPlatforms ?? []),
    ...(expert.secondaryPlatforms ?? []),
    ...(expert.preferredProjectTypes ?? []),
    ...(expert.industryExpertise ?? []),
  ]
  const fallback = expert.tags
    ?.filter((tag) => tag.tagType !== 'tool')
    .map((tag) => tag.tagValue) ?? []
  return Array.from(new Set([...preferred, ...fallback].filter((value) => Boolean(value) && value.length <= 48))).slice(0, 6)
}

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '')
}

function isSameProductName(productName: string, platformName: string) {
  const product = normalizeName(productName)
  const platform = normalizeName(platformName)
  if (!product || !platform) return false
  if (product === platform) return true
  if (Math.min(product.length, platform.length) < 4) return false
  return product.startsWith(platform) || platform.startsWith(product)
}

function isUsefulLabel(value: string) {
  return Boolean(value?.trim()) && value.trim().length <= 64
}
