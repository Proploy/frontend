'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Reveal } from '@/components/site/Reveal'
import { AuthRequiredLink } from '@/components/auth/AuthRequiredLink'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import { Skeleton } from '@/components/ui/Skeleton'
import { useApprovedExperts } from '@/features/experts/use-approved-experts'
import { useCatalogProductMatches, type CardProduct } from '@/features/catalog'
import { resolveExpertPublicResourceUrl } from '@/features/experts/public-resource'
import type { ExpertListItem } from '@/features/experts/types'
import {
  DEFAULT_EXPERT_FILTERS,
  ExpertFiltersDrawer,
  type ExpertFilterValues,
} from '@/components/filters/ExpertFiltersDrawer'

export default function ExpertsPage() {
  return (
    <div className="pp-scope overflow-x-clip">
      <Nav />
      <Suspense fallback={<ExpertsPageSuspenseFallback />}>
        <ExpertsPageContent />
      </Suspense>
      <Footer />
    </div>
  )
}

/* ── icons ──────────────────────────────────────────────────── */

function SearchIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function ArrowIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function PinIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  )
}

function FilterIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 5h18l-7 8v6l-4 2v-8Z" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

function VerifiedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--cobalt)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-label="Approved expert">
      <path d="M12 3l2.2 1.7 2.7-.3 1 2.6 2.3 1.5-.7 2.7.7 2.7-2.3 1.5-1 2.6-2.7-.3L12 21l-2.2-1.7-2.7.3-1-2.6L3.8 15.5l.7-2.7-.7-2.7 2.3-1.5 1-2.6 2.7.3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

/* ── loading skeletons ──────────────────────────────────────── */

function ExpertCardSkeleton() {
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

function ExpertGridSkeleton() {
  return (
    <div className="xp-grid" role="status" aria-busy="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <ExpertCardSkeleton key={i} />
      ))}
    </div>
  )
}

function ExpertsPageSuspenseFallback() {
  return (
    <main className="pp-page">
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-container">
          <div className="pp-stack pp-gap-8">
            <div className="pp-stack pp-gap-6" style={{ maxWidth: 820 }}>
              <Skeleton className="h-[30px] w-[340px] max-w-full rounded-full" />
              <Skeleton className="h-[120px] w-[520px] max-w-full rounded-[12px]" />
              <Skeleton className="h-[52px] w-[440px] max-w-full rounded-[10px]" />
            </div>
            <Skeleton className="h-[168px] w-full rounded-[16px]" />
          </div>
        </div>
      </section>
      <hr className="pp-rule" />
      <section className="pp-section pp-band">
        <div className="pp-container-app pp-stack pp-gap-12">
          <ExpertGridSkeleton />
        </div>
      </section>
    </main>
  )
}

/* ── expert card (real data → xp-card) ──────────────────────── */

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('') || '?'
}

function isUsefulLabel(value: string) {
  return Boolean(value?.trim()) && value.trim().length <= 64
}

function tagValues(expert: ExpertListItem, tagType: string) {
  return expert.tags?.filter((tag) => tag.tagType === tagType).map((tag) => tag.tagValue) ?? []
}

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter(isUsefulLabel)))
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

function expertPlatforms(expert: ExpertListItem) {
  return dedupe([
    ...(expert.primaryPlatforms ?? []),
    ...(expert.secondaryPlatforms ?? []),
    ...tagValues(expert, 'platform'),
  ])
}

function ExpertCard({
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

/* ── page content ───────────────────────────────────────────── */

type ActiveFilterChip = {
  label: string
  clear: () => void
}

const SORT_LABELS: Record<ExpertFilterValues['sort'], string> = {
  relevance: 'Relevance',
  experience: 'Most experienced',
  projects: 'Most projects',
  name: 'Name',
}

function buildFilterChips(
  values: ExpertFilterValues,
  onChange: (values: ExpertFilterValues) => void,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = []
  if (values.sort && values.sort !== 'relevance') {
    chips.push({
      label: SORT_LABELS[values.sort],
      clear: () => onChange({ ...values, sort: 'relevance' }),
    })
  }
  if (values.entityType) {
    chips.push({ label: values.entityType, clear: () => onChange({ ...values, entityType: '' }) })
  }
  if (values.platform) {
    chips.push({ label: values.platform, clear: () => onChange({ ...values, platform: '' }) })
  }
  if (values.industry) {
    chips.push({ label: values.industry, clear: () => onChange({ ...values, industry: '' }) })
  }
  if (values.projectType) {
    chips.push({ label: values.projectType, clear: () => onChange({ ...values, projectType: '' }) })
  }
  if (values.location) {
    chips.push({ label: values.location, clear: () => onChange({ ...values, location: '' }) })
  }
  if (values.minimumYears > 0) {
    chips.push({
      label: `${values.minimumYears}+ years`,
      clear: () => onChange({ ...values, minimumYears: 0 }),
    })
  }
  return chips
}

function ExpertsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchFromUrl = searchParams.get('search') ?? ''
  const search = searchFromUrl.trim().toLowerCase()

  const filtersFromUrl = useMemo<ExpertFilterValues>(() => ({
    ...DEFAULT_EXPERT_FILTERS,
    platform: searchParams.get('platform') ?? '',
    industry: searchParams.get('industry') ?? '',
    projectType: searchParams.get('projectType') ?? '',
    location: searchParams.get('location') ?? '',
  }), [searchParams])
  const [filters, setFilters] = useState<ExpertFilterValues>(filtersFromUrl)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState(searchFromUrl)

  useEffect(() => {
    setFilters(filtersFromUrl)
  }, [filtersFromUrl])

  useEffect(() => {
    setQuery(searchFromUrl)
  }, [searchFromUrl])

  const { experts, loading, error, refetch } = useApprovedExperts({
    platform: filters.platform || undefined,
    industry: filters.industry || undefined,
    projectType: filters.projectType || undefined,
    limit: 50,
  })

  const typedExperts: ExpertListItem[] = useMemo(() => {
    const filtered = experts.filter((expert) => {
      const location = [expert.regionCity, expert.regionCountry].filter(Boolean).join(' ').toLowerCase()
      const searchable = [
        expert.displayName,
        expert.headline,
        location,
        ...(expert.tags?.map((tag) => tag.tagValue) ?? []),
      ].filter(Boolean).join(' ').toLowerCase()
      const matchesSearch = !search || searchable.includes(search)
      const matchesLocation = !filters.location || location.includes(filters.location.toLowerCase())
      const matchesYears = (expert.yearsExperience ?? 0) >= filters.minimumYears
      const matchesType = !filters.entityType || expert.entityType?.toLowerCase().includes(filters.entityType)
      return matchesSearch && matchesLocation && matchesYears && matchesType
    })

    if (filters.sort === 'experience') {
      return [...filtered].sort((a, b) => (b.yearsExperience ?? 0) - (a.yearsExperience ?? 0))
    }
    if (filters.sort === 'projects') {
      return [...filtered].sort((a, b) => (b.projectsCompletedTotal ?? 0) - (a.projectsCompletedTotal ?? 0))
    }
    if (filters.sort === 'name') {
      return [...filtered].sort((a, b) => a.displayName.localeCompare(b.displayName))
    }
    return filtered
  }, [experts, filters, search])

  const activeChips = useMemo(
    () => buildFilterChips(filters, setFilters),
    [filters],
  )

  // Resolve the experts' platform labels to catalog products so cards can show
  // real product logos (capped to keep the keyword-search fan-out bounded).
  const platformQueries = useMemo(
    () => dedupe(experts.flatMap((expert) => expertPlatforms(expert))).slice(0, 24),
    [experts],
  )
  const { products: platformProducts } = useCatalogProductMatches(platformQueries)

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    const trimmed = query.trim()
    if (trimmed) params.set('search', trimmed)
    else params.delete('search')
    router.push(`/experts?${params.toString()}`)
  }

  const count = typedExperts.length
  const directoryLede = loading || error
    ? 'Specialists with verified credentials and published case studies, matched to your filters.'
    : `${count} ${count === 1 ? 'specialist matches' : 'specialists match'} your filters, each with verified credentials and published case studies.`

  const [ctaEmail, setCtaEmail] = useState('')
  const [ctaSent, setCtaSent] = useState(false)

  return (
    <main className="pp-page">
      {/* ── Search hero ─────────────────────────────────────── */}
      <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
        <div className="pp-glow" style={{ top: -160, right: -40 }} />

        <div className="pp-container">
          <Reveal className="pp-stack pp-gap-8 pp-soften">
            <div className="pp-stack pp-gap-6 pp-soften" style={{ maxWidth: 820 }}>
              <Link className="pp-badge-note" href="/for-businesses">
                <b>Vetted network</b> 200+ specialists reference-checked this quarter
                <ArrowIcon size={14} />
              </Link>

              <h1 className="pp-display pp-d1">
                The people who
                <br />
                make it land.
              </h1>

              <p className="pp-lede" style={{ maxWidth: '56ch' }}>
                Every expert is interviewed, reference-checked and graded against the playbook for
                the software they implement. Search by platform, sector or the outcome you need.
              </p>
            </div>

            <div className="pp-glass" style={{ padding: 'var(--sp-6)' }}>
              <form className="pp-stack pp-gap-4" onSubmit={handleSearchSubmit}>
                <div className="pp-flex pp-gap-3">
                  <div className="pp-search" style={{ flex: 1 }}>
                    <SearchIcon />
                    <input
                      type="text"
                      name="query"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search experts, platforms, and industries"
                      aria-label="Search experts"
                    />
                  </div>
                  <button
                    type="submit"
                    className="pp-btn pp-btn--cobalt pp-btn-icon"
                    aria-label="Search"
                    style={{ height: 52, width: 52 }}
                  >
                    <SearchIcon size={20} />
                  </button>
                </div>

                <div className="pp-flex pp-wrap pp-gap-3" style={{ justifyContent: 'space-between' }}>
                  <div className="pp-flex pp-wrap pp-gap-2">
                    <button
                      type="button"
                      className="pp-chip pp-btn--inline"
                      aria-pressed={Boolean(filters.entityType)}
                      onClick={() => setDrawerOpen(true)}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M3 6h18M6 12h12M10 18h4" />
                      </svg>
                      {filters.entityType || 'Any expert type'}
                    </button>

                    <button
                      type="button"
                      className="pp-chip pp-btn--inline"
                      aria-pressed={Boolean(filters.location)}
                      onClick={() => setDrawerOpen(true)}
                    >
                      <PinIcon size={15} />
                      {filters.location || 'Any location'}
                    </button>

                    <button
                      type="button"
                      className="pp-chip pp-btn--inline"
                      aria-pressed={filters.minimumYears > 0}
                      onClick={() => setDrawerOpen(true)}
                    >
                      <FilterIcon size={15} />
                      {filters.minimumYears > 0 ? `${filters.minimumYears}+ years` : 'Any experience'}
                    </button>
                  </div>

                  <button
                    type="button"
                    className="pp-btn pp-btn--secondary pp-btn--sm pp-btn--inline"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <FilterIcon />
                    More filters
                  </button>
                </div>

                {activeChips.length > 0 && (
                  <div className="pp-flex pp-wrap pp-gap-2">
                    {activeChips.map((chip) => (
                      <span key={chip.label} className="pp-tag pp-tag--filter">
                        {chip.label}
                        <button
                          className="pp-tag-x"
                          type="button"
                          aria-label={`Remove ${chip.label}`}
                          onClick={chip.clear}
                        >
                          <XIcon />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <hr className="pp-rule" />

      {/* ── Expert directory ────────────────────────────────── */}
      <section className="pp-section pp-band">
        <div className="pp-container-app pp-stack pp-gap-12">
          <Reveal className="pp-sec-split pp-soften">
            <div className="pp-sec-head">
              <p className="pp-label">Expert directory</p>
              <h2 className="pp-display pp-d3">Execution is the deliverable.</h2>
            </div>
            <p className="pp-lede">{directoryLede}</p>
          </Reveal>

          {loading ? (
            <ExpertGridSkeleton />
          ) : error ? (
            <div className="pp-stack pp-gap-4" style={{ alignItems: 'center', paddingBlock: 'var(--sp-16)', textAlign: 'center' }}>
              <p className="pp-lede">We couldn&apos;t load approved experts right now.</p>
              <p className="pp-small">{error.error.message}</p>
              <button type="button" onClick={refetch} className="pp-btn pp-btn--cobalt pp-btn--inline">
                Try again
              </button>
            </div>
          ) : typedExperts.length === 0 ? (
            <div className="pp-stack pp-gap-4" style={{ alignItems: 'center', paddingBlock: 'var(--sp-16)', textAlign: 'center' }}>
              <p className="pp-lede">No experts found yet. Check back soon!</p>
            </div>
          ) : (
            <div className="xp-grid">
              {typedExperts.map((expert, index) => (
                <ExpertCard key={expert.id} expert={expert} index={index} catalogProducts={platformProducts} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────── */}
      <section style={{ paddingBlock: '0 var(--section-y)' }}>
        <div className="pp-container-app">
          <Reveal className="pp-dark">
            <div className="pp-sec-split" style={{ alignItems: 'center', gap: 'var(--sp-16)' }}>
              <div className="pp-stack pp-gap-5">
                <p className="pp-label">Get started</p>
                <h2 className="pp-display pp-d3">Brief once. Meet the specialist who ships it.</h2>
                <p className="pp-lede">
                  Describe the rollout in plain language. Proploy returns a shortlist of vetted
                  experts scored on fit — first consultation included.
                </p>
              </div>

              <form
                className="pp-stack pp-gap-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  if (ctaEmail.trim()) setCtaSent(true)
                }}
              >
                <div className="pp-flex pp-gap-3">
                  <input
                    className="pp-input"
                    type="email"
                    required
                    value={ctaEmail}
                    onChange={(event) => setCtaEmail(event.target.value)}
                    placeholder="you@company.com"
                    aria-label="Work email"
                  />
                  <button type="submit" className="pp-btn pp-btn--cobalt pp-btn--inline">
                    Get matched
                  </button>
                </div>
                <p className="pp-small" aria-live="polite">
                  {ctaSent
                    ? 'Thanks — we’ll be in touch within one business day.'
                    : 'No sales sequence. A named specialist reviews your stack first.'}
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      {drawerOpen && (
        <ExpertFiltersDrawer
          key={JSON.stringify(filters)}
          open={drawerOpen}
          values={filters}
          onClose={() => setDrawerOpen(false)}
          onApply={(values) => setFilters(values)}
        />
      )}
    </main>
  )
}
