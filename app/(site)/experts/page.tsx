'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Reveal } from '@/components/site/Reveal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useApprovedExperts } from '@/features/experts/use-approved-experts'
import { useExpertKeywordSearch } from '@/features/experts/use-expert-keyword-search'
import { useCatalogProductMatches } from '@/features/catalog'
import type { ExpertListItem } from '@/features/experts/types'
import {
  ExpertCard,
  ExpertCardSkeleton,
  PinIcon,
  dedupe,
  expertPlatforms,
} from '@/components/experts/ExpertCardV2'
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

/* ── loading skeletons ──────────────────────────────────────── */

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
  const {
    experts: keywordExperts,
    loading: keywordLoading,
    error: keywordError,
    refetch: refetchKeywordExperts,
  } = useExpertKeywordSearch(query, 50, {
    platform: filters.platform,
    industry: filters.industry,
    projectType: filters.projectType,
    location: filters.location,
    minimumYears: filters.minimumYears,
    entityType: filters.entityType,
    sort: filters.sort,
  })
  const showingKeywordResults = Boolean(query.trim())
  const displayedExperts = showingKeywordResults ? keywordExperts : experts

  const typedExperts: ExpertListItem[] = useMemo(() => {
    if (showingKeywordResults) return keywordExperts

    const filtered = experts.filter((expert) => {
      const location = [expert.regionCity, expert.regionCountry].filter(Boolean).join(' ').toLowerCase()
      const matchesLocation = !filters.location || location.includes(filters.location.toLowerCase())
      const matchesYears = (expert.yearsExperience ?? 0) >= filters.minimumYears
      const matchesType = !filters.entityType || expert.entityType?.toLowerCase().includes(filters.entityType)
      return matchesLocation && matchesYears && matchesType
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
  }, [experts, filters, keywordExperts, showingKeywordResults])

  const activeChips = useMemo(
    () => buildFilterChips(filters, setFilters),
    [filters],
  )

  // Resolve the experts' platform labels to catalog products so cards can show
  // real product logos (capped to keep the keyword-search fan-out bounded).
  const platformQueries = useMemo(
    () => dedupe(displayedExperts.flatMap((expert) => expertPlatforms(expert))).slice(0, 24),
    [displayedExperts],
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
  const directoryLoading = showingKeywordResults ? keywordLoading : loading
  const directoryError = showingKeywordResults ? keywordError : error
  const directoryLede = directoryLoading || directoryError
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

          {directoryLoading ? (
            <ExpertGridSkeleton />
          ) : directoryError ? (
            <div className="pp-stack pp-gap-4" style={{ alignItems: 'center', paddingBlock: 'var(--sp-16)', textAlign: 'center' }}>
              <p className="pp-lede">We couldn&apos;t load approved experts right now.</p>
              <p className="pp-small">{directoryError.error.message}</p>
              <button type="button" onClick={showingKeywordResults ? refetchKeywordExperts : refetch} className="pp-btn pp-btn--cobalt pp-btn--inline">
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
