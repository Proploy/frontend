'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
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
  dedupe,
  expertPlatforms,
} from '@/components/experts/ExpertCardV2'
import { ExpertFiltersDrawer } from '@/components/filters/ExpertFiltersDrawer'
import { ExpertFilterSidebar } from '@/components/filters/ExpertFilterSidebar'
import { SortMenu } from '@/components/filters/SortMenu'
import {
  DEFAULT_EXPERT_FILTERS,
  ENTITY_TYPE_LABELS,
  EXPERT_SORT_OPTIONS,
  countActiveExpertFilters,
  deriveExpertFilterOptions,
  matchesExpertFilters,
  sortExperts,
  type ExpertFilterValues,
} from '@/features/experts/filter-values'
import {
  applyExpertFilterParams,
  parseExpertFilterParams,
} from '@/features/experts/filter-params'

const DIRECTORY_LIMIT = 100

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
            <Skeleton className="h-[112px] w-full rounded-[16px]" />
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

function buildFilterChips(
  values: ExpertFilterValues,
  onChange: (values: ExpertFilterValues) => void,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = []
  const listChips = (
    key: 'platforms' | 'industries' | 'projectTypes' | 'countries' | 'entityTypes',
    label: (value: string) => string,
  ) => {
    values[key].forEach((value) => {
      chips.push({
        label: label(value),
        clear: () => onChange({ ...values, [key]: values[key].filter((v) => v !== value) }),
      })
    })
  }
  listChips('platforms', (v) => v)
  listChips('industries', (v) => v)
  listChips('projectTypes', (v) => v)
  listChips('entityTypes', (v) => ENTITY_TYPE_LABELS[v] ?? v)
  listChips('countries', (v) => v)
  if (values.minimumYears > 0) {
    chips.push({
      label: `${values.minimumYears}+ years`,
      clear: () => onChange({ ...values, minimumYears: 0 }),
    })
  }
  return chips
}

function ExpertsPageContent() {
  const searchParams = useSearchParams()
  const searchFromUrl = searchParams.get('search') ?? ''

  // The URL is the single source of truth for filters and sort.
  const filters = useMemo(() => parseExpertFilterParams(searchParams), [searchParams])
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState(searchFromUrl)

  useEffect(() => {
    setQuery(searchFromUrl)
  }, [searchFromUrl])

  const navigate = (mutate: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    mutate(params)
    const next = params.toString()
    // Update the URL in place: filtering is evaluated client-side, so a router
    // navigation would re-render the route for no new data. Next syncs
    // useSearchParams with history updates, and back/forward still work.
    window.history.pushState(null, '', `/experts${next ? `?${next}` : ''}`)
  }
  const applyFilters = (values: ExpertFilterValues) => navigate((params) => {
    applyExpertFilterParams(params, values)
  })
  const clearAllFilters = () => applyFilters({ ...DEFAULT_EXPERT_FILTERS, sort: filters.sort })

  // Load the directory once; filters are evaluated client-side so the pill
  // options reflect the real data and every group can be multi-select.
  const { experts, loading, error, refetch } = useApprovedExperts({ limit: DIRECTORY_LIMIT })
  const {
    experts: keywordExperts,
    loading: keywordLoading,
    error: keywordError,
    refetch: refetchKeywordExperts,
  } = useExpertKeywordSearch(query, DIRECTORY_LIMIT, { sort: filters.sort })
  const showingKeywordResults = Boolean(query.trim())

  const filterOptions = useMemo(() => deriveExpertFilterOptions(experts), [experts])

  const typedExperts: ExpertListItem[] = useMemo(() => {
    const source = showingKeywordResults ? keywordExperts : experts
    const filtered = source.filter((expert) => matchesExpertFilters(expert, filters))
    // Keyword results are already relevance-ordered by the API.
    return showingKeywordResults && filters.sort === 'relevance' ? filtered : sortExperts(filtered, filters.sort)
  }, [experts, filters, keywordExperts, showingKeywordResults])

  const activeChips = useMemo(() => buildFilterChips(filters, applyFilters), [filters]) // eslint-disable-line react-hooks/exhaustive-deps
  const activeFilterCount = countActiveExpertFilters(filters)

  // Resolve the experts' platform labels to catalog products so cards can show
  // real product logos (capped to keep the keyword-search fan-out bounded).
  const platformQueries = useMemo(
    () => dedupe(typedExperts.flatMap((expert) => expertPlatforms(expert))).slice(0, 24),
    [typedExperts],
  )
  const { products: platformProducts } = useCatalogProductMatches(platformQueries)

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate((params) => {
      const trimmed = query.trim()
      if (trimmed) params.set('search', trimmed)
      else params.delete('search')
    })
  }

  const directoryLoading = showingKeywordResults ? keywordLoading : loading
  const directoryError = showingKeywordResults ? keywordError : error

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
            <p className="pp-lede">
              Specialists with verified credentials and published case studies, matched to your filters.
            </p>
          </Reveal>

          <div className="pp-catalog-layout">
            <aside className="pp-filter-side" aria-label="Expert filters">
              <ExpertFilterSidebar values={filters} onChange={applyFilters} options={filterOptions} />
            </aside>

            <div className="pp-stack pp-gap-6" style={{ minWidth: 0 }}>
              <div className="pp-results-head">
                <h3 className="pp-heading-sm">
                  {showingKeywordResults ? `Experts for "${query.trim()}"` : 'All experts'}
                </h3>
                <div className="pp-flex pp-gap-3" style={{ alignItems: 'center' }}>
                  <button
                    type="button"
                    className="pp-btn pp-btn--secondary pp-btn--sm pp-btn--inline pp-filters-toggle"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <FilterIcon size={16} />
                    {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
                  </button>
                  <SortMenu
                    value={filters.sort}
                    options={EXPERT_SORT_OPTIONS}
                    onChange={(sort) => applyFilters({ ...filters, sort })}
                  />
                </div>
              </div>

              {activeChips.length > 0 && (
                <div className="pp-flex pp-wrap pp-gap-2" style={{ alignItems: 'center' }}>
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
                  <button type="button" className="pp-filter-group-clear" onClick={clearAllFilters}>
                    Clear all
                  </button>
                </div>
              )}

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
                  <p className="pp-lede">No experts match these filters.</p>
                  {activeFilterCount > 0 && (
                    <button type="button" className="pp-btn pp-btn--secondary pp-btn--sm pp-btn--inline" onClick={clearAllFilters}>
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="xp-grid">
                  {typedExperts.map((expert, index) => (
                    <ExpertCard key={expert.id} expert={expert} index={index} catalogProducts={platformProducts} />
                  ))}
                </div>
              )}
            </div>
          </div>
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
          options={filterOptions}
          onClose={() => setDrawerOpen(false)}
          onApply={applyFilters}
        />
      )}
    </main>
  )
}
