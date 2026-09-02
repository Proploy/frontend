'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import { RatingStars } from '@/components/catalog/RatingStars'
import { Skeleton } from '@/components/ui/Skeleton'
import CompareToggle from '@/components/compare/CompareToggle'
import FavoriteToggle from '@/components/personalization/FavoriteToggle'
import { Nav } from '@/components/site/Nav'
import { Footer } from '@/components/site/Footer'
import { Reveal } from '@/components/site/Reveal'
import {
  getProductDetailHref,
  useCategoryTree,
  useKeywordSearch,
  useNaturalSearch,
  useCatalogProductList,
  useProductFacets,
  type CardProduct,
  type CategoryNode,
  type FacetOption,
  type ProductFacets,
  type ProductSort,
  type SearchMode,
} from '@/features/catalog'
import { SearchModeToggle } from '@/components/search/SearchModeToggle'
import {
  ProductFiltersDrawer,
  type ProductFilterValues,
} from '@/components/filters/ProductFiltersDrawer'
import { ProductFilterSidebar } from '@/components/filters/ProductFilterSidebar'
import { SortMenu, type SortOption } from '@/components/filters/SortMenu'
import { buildProductListRequest } from '@/features/catalog/products/filter-request'
import { DEFAULT_PRODUCT_FILTERS, countActiveProductFilters } from '@/features/catalog/products/filter-values'
import {
  applyProductFilterParams,
  parseProductFilterParams,
  serializeProductFilterParams,
} from '@/features/catalog/products/filter-params'
import { getNextProductPageOffset } from '@/features/catalog/products/pagination-state'

import type { ProductListResult } from '@/features/catalog/products/types'

const PRODUCT_PAGE_SIZE = 15

const PRODUCT_SORT_OPTIONS: SortOption<ProductSort>[] = [
  { value: 'name', label: 'Name' },
  { value: 'rating', label: 'Rating' },
  { value: 'market_presence', label: 'Market presence' },
  { value: 'created_at', label: 'Newest' },
]

type SearcherMap = {
  natural: (query: string, limit?: number) => void | Promise<void>
  clearNatural: () => void
}

/* ── icons (from the v2 mockup) ─────────────────────────────── */

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function FunnelIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M3 5h18l-7 8v6l-4 2v-8Z" />
    </svg>
  )
}

function TagX() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

/* ── category helpers ───────────────────────────────────────── */

function findCategoryNode(nodes: CategoryNode[], termId: string): CategoryNode | null {
  if (!termId) return null
  for (const node of nodes) {
    if (node.term_id === termId) return node
    const nested = findCategoryNode(node.children, termId)
    if (nested) return nested
  }
  return null
}

/** Flatten a root's subtree to the selectable (product_category) filter terms. */
function pricingLabel(value: string): string | null {
  const labels: Record<string, string> = {
    free: 'Free',
    freemium: 'Freemium',
    paid_tier_1: 'Paid (Tier 1)',
    paid_tier_2: 'Paid (Tier 2)',
    paid_tier_3: 'Paid (Tier 3)',
    contact_sales: 'Contact sales',
  }
  return labels[value] ?? null
}

function companySizeLabel(value: string): string {
  const labels: Record<string, string> = {
    smb: 'SMB / Startup',
    small_team: 'Small team',
    mid_market: 'Mid-market',
    enterprise: 'Enterprise',
  }
  return labels[value] ?? value
}

function deploymentLabel(value: string): string {
  const labels: Record<string, string> = {
    cloud: 'Cloud (SaaS)',
    self_hosted: 'Self-hosted / On-premise',
    hybrid: 'Hybrid',
  }
  return labels[value] ?? value
}

type ActiveFilterTag = {
  label: string
  clear: () => void
}

/* ── suspense fallback (new layout skeleton) ────────────────── */

export function ProductsPageSuspenseFallback() {
  return (
    <div className="pp-scope overflow-x-clip">
      <main className="pp-page">
        <section className="pp-blueprint" style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}>
          <div className="pp-container">
            <div className="pp-stack pp-gap-8">
              <div className="pp-stack pp-gap-6" style={{ maxWidth: 820 }}>
                <Skeleton className="h-[30px] w-[320px] max-w-full rounded-full" />
                <Skeleton className="h-[120px] w-[640px] max-w-full rounded-[16px]" />
              </div>
              <div className="pp-glass" style={{ padding: 'var(--sp-6)' }}>
                <Skeleton className="h-[52px] w-full rounded-[10px]" />
              </div>
            </div>
          </div>
        </section>
        <hr className="pp-rule" />
        <section className="pp-section pp-band">
          <div className="pp-container pp-stack pp-gap-16">
            <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-8)' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <div className="pp-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)' }}>
      <div className="pp-stack pp-gap-3">
        <div className="pp-flex" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Skeleton className="size-[48px] rounded-[12px]" />
        </div>
        <Skeleton className="h-[26px] w-[75%] rounded-[6px]" />
        <Skeleton.Text lines={3} />
      </div>
      <div className="pp-flex" style={{ justifyContent: 'space-between', marginTop: 'auto' }}>
        <Skeleton className="h-[24px] w-[96px] rounded-[6px]" />
        <Skeleton className="h-[38px] w-[120px] rounded-[10px]" />
      </div>
    </div>
  )
}

/* ── page ───────────────────────────────────────────────────── */

export default function ProductsPageClient({
  initialCategoryTree,
  initialProductsPage,
  initialFacets = null,
}: {
  initialCategoryTree: CategoryNode[]
  initialProductsPage: {
    products: ProductListResult['products']
    pagination: ProductListResult['pagination'] | null
  } | null
  initialFacets?: ProductFacets | null
}) {
  const searchParams = useSearchParams()
  const search = searchParams.get('search')?.trim() || undefined
  const modeParam = searchParams.get('mode')
  const activeMode: SearchMode =
    modeParam === 'natural' ? 'natural' : 'keyword'
  const { tree, loading: catLoading, error: catError } = useCategoryTree({
    initialData: initialCategoryTree,
  })
  // The URL is the single source of truth for filters (shareable, survives
  // refresh/back, server-renderable). See features/catalog/products/filter-params.
  const filters: ProductFilterValues = parseProductFilterParams(searchParams)
  const filterKey = serializeProductFilterParams(filters)
  const requestKey = `${search ?? ''}:${filterKey}`
  const [paginationState, setPaginationState] = useState({
    requestKey,
    offset: 0,
  })
  const offset =
    paginationState.requestKey === requestKey ? paginationState.offset : 0
  const resetOffset = () => setPaginationState({ requestKey, offset: 0 })
  // Options are scoped to the active search so every one of them returns
  // something; without a search they describe the whole catalog.
  const { facets } = useProductFacets(initialFacets, search)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const hasActiveSearch = Boolean(search)
  const naturalMode = activeMode === 'natural'

  const selectedCategoryNodes = filters.categoryTermIds
    .map((termId) => findCategoryNode(tree, termId))
    .filter((node): node is CategoryNode => node !== null)
  const { products: listedProducts, loading: listLoading, error: listError, pagination, refetch } = useCatalogProductList({
    // The server rendered the first page for exactly this URL (filters and
    // search included), so it is valid as-is; later param changes refetch.
    initialData: initialProductsPage ?? undefined,
    ...buildProductListRequest({
      ...filters,
      search: !naturalMode ? search : undefined,
      limit: PRODUCT_PAGE_SIZE,
      offset,
    }),
    enabled: !naturalMode || !hasActiveSearch,
    append: true,
  })

  const {
    products: naturalProducts,
    loading: naturalLoading,
    error: naturalError,
    note: naturalNote,
    search: runNaturalSearch,
    clear: clearNaturalSearch,
  } = useNaturalSearch({
    pricingBuckets: filters.pricingBuckets,
    companySize: filters.companySize,
    deploymentModel: filters.deploymentModel,
    compliance: filters.compliance,
    integrations: filters.integrations,
    industries: filters.industries,
    implementationComplexity: filters.implementationComplexity,
    minRating: filters.minRating,
    maxStartingPrice: filters.maxStartingPrice,
    freePlan: filters.freePlan,
    freeTrial: filters.freeTrial,
    categoryTermIds: filters.categoryTermIds,
  })

  const naturalFilterKey = filterKey

  const pageSearchersRef = useRef<SearcherMap>({
    natural: () => {},
    clearNatural: () => {},
  })
  useEffect(() => {
    pageSearchersRef.current = {
      natural: runNaturalSearch,
      clearNatural: clearNaturalSearch,
    }
  }, [runNaturalSearch, clearNaturalSearch])

  useEffect(() => {
    if (activeMode === 'natural' && search) {
      void pageSearchersRef.current.natural(search, PRODUCT_PAGE_SIZE)
    } else {
      pageSearchersRef.current.clearNatural()
    }
  }, [activeMode, naturalFilterKey, search])

  const products = (hasActiveSearch && naturalMode) ? naturalProducts : listedProducts
  const loading = (hasActiveSearch && naturalMode) ? naturalLoading : listLoading
  const error = (hasActiveSearch && naturalMode) ? naturalError : listError
  // Only blank the grid when there is nothing to show. While a filter or
  // search change is in flight, keep the current cards dimmed so the page
  // never looks empty mid-request.
  const isLoadingInitialProducts = loading && products.length === 0
  const isRefreshingProducts = loading && products.length > 0 && offset === 0
  const isLoadingMoreProducts = loading && offset > 0 && products.length > 0

  const categoryLabel =
    selectedCategoryNodes.length === 1
      ? selectedCategoryNodes[0].label
      : selectedCategoryNodes.length > 1
        ? `${selectedCategoryNodes.length} categories`
        : null

  const navigateWithParams = (mutate: (params: URLSearchParams) => void) => {
    resetOffset()
    const params = new URLSearchParams(searchParams.toString())
    mutate(params)
    const query = params.toString()
    // Update the URL in place rather than routing. A router navigation
    // re-renders the server component, which blocks on a fresh catalog fetch
    // and blanks the grid for seconds; the list hook already refetches when
    // the params change. Next syncs useSearchParams with history updates, and
    // back/forward still work.
    window.history.pushState(null, '', `/products${query ? `?${query}` : ''}`)
  }


  const handleSearch = (query: string) => {
    navigateWithParams((params) => {
      const trimmed = query.trim()
      if (trimmed) params.set('search', trimmed)
      else params.delete('search')
    })
  }

  const handleModeChange = (next: SearchMode) => {
    navigateWithParams((params) => {
      if (next === 'natural') params.set('mode', 'natural')
      else params.delete('mode')
    })
  }

  const applyFilters = (values: ProductFilterValues) => {
    navigateWithParams((params) => {
      applyProductFilterParams(params, values)
    })
  }

  const updateFilters = (patch: Partial<ProductFilterValues>) => {
    applyFilters({ ...filters, ...patch })
  }

  const clearAllFilters = () => applyFilters({ ...DEFAULT_PRODUCT_FILTERS, sort: filters.sort })
  const activeFilterCount = countActiveProductFilters(filters)

  /* removable active-filter tags — each removal writes back to the URL */
  const optionLabel = (
    options: FacetOption[] | undefined,
    value: string,
    fallback: (value: string) => string,
  ) => options?.find((option) => option.value === value)?.label ?? fallback(value)

  const activeFilterTags: ActiveFilterTag[] = []
  filters.categoryTermIds.forEach((termId) => {
    activeFilterTags.push({
      label: findCategoryNode(tree, termId)?.label ?? 'Selected category',
      clear: () => updateFilters({ categoryTermIds: filters.categoryTermIds.filter((id) => id !== termId) }),
    })
  })
  const listTags = (
    key: 'pricingBuckets' | 'companySize' | 'deploymentModel' | 'compliance' | 'industries' | 'integrations' | 'implementationComplexity',
    label: (value: string) => string,
  ) => {
    filters[key].forEach((value) => {
      activeFilterTags.push({
        label: label(value),
        clear: () => updateFilters({ [key]: filters[key].filter((v) => v !== value) }),
      })
    })
  }
  listTags('pricingBuckets', (v) => optionLabel(facets?.pricing_buckets, v, (x) => pricingLabel(x) ?? x))
  listTags('companySize', (v) => optionLabel(facets?.company_sizes, v, companySizeLabel))
  listTags('deploymentModel', (v) => optionLabel(facets?.deployment_models, v, deploymentLabel))
  listTags('implementationComplexity', (v) => `${optionLabel(facets?.implementation_complexity, v, (x) => x)} effort`)
  listTags('compliance', (v) => v)
  listTags('industries', (v) => v)
  listTags('integrations', (v) => `Integrates with ${v}`)
  if (filters.minRating) {
    activeFilterTags.push({
      label: optionLabel(facets?.ratings, filters.minRating, (v) => `${v}+ stars`),
      clear: () => updateFilters({ minRating: '' }),
    })
  }
  if (filters.maxStartingPrice !== '') {
    activeFilterTags.push({
      label: optionLabel(facets?.starting_prices, filters.maxStartingPrice, (v) =>
        v === '0' ? 'Free to start' : `Up to $${v}/mo`,
      ),
      clear: () => updateFilters({ maxStartingPrice: '' }),
    })
  }
  if (filters.freePlan) {
    activeFilterTags.push({
      label: 'Free plan available',
      clear: () => updateFilters({ freePlan: false }),
    })
  }
  if (filters.freeTrial) {
    activeFilterTags.push({
      label: 'Free trial available',
      clear: () => updateFilters({ freeTrial: false }),
    })
  }

  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
  })

  return (
    <div className="pp-scope overflow-x-clip">
      <Nav />
      <main className="pp-page">
        {/* ── Listing explorer: search hero ─────────────────── */}
        <section
          className="pp-blueprint pp-products-hero"
          style={{ paddingBlock: 'var(--sp-20) var(--sp-16)' }}
        >
          <div className="pp-glow" style={{ top: -140, right: -60 }} />
          <div className="pp-container">
            <Reveal className="pp-stack pp-gap-8 pp-soften">
              <div className="pp-stack pp-gap-6 pp-soften" style={{ maxWidth: 820 }}>
                <span className="pp-badge-note">
                  <b>What&apos;s new</b> Fruition joined the marketplace
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
                <h1 className="pp-display pp-d1">
                  Find the right product
                  <br />
                  and the expert to run it.
                </h1>
                <p className="pp-lede" style={{ maxWidth: '56ch' }}>
                  400+ tools scored against your stack, your sector and your
                  constraints — each one shipping with the specialists who
                  deploy it.
                </p>
              </div>

              <div className="pp-glass" style={{ padding: 'var(--sp-6)' }}>
                <ProductSearchPanel
                  mode={activeMode}
                  onModeChange={handleModeChange}
                  initialQuery={searchParams.get('search') ?? ''}
                  onSearch={handleSearch}
                  freeTrial={filters.freeTrial}
                />
              </div>
            </Reveal>
          </div>
        </section>

        <hr className="pp-rule" />

        {/* ── Catalogue ─────────────────────────────────────── */}
        <section className="pp-section pp-band">
          <div className="pp-container pp-stack pp-gap-16">
            <Reveal className="pp-sec-split pp-soften">
              <div className="pp-sec-head">
                <p className="pp-label">Marketplace catalogue</p>
                <h2 className="pp-display pp-d3">
                  Close more deals,
                  <br />
                  stress less.
                </h2>
              </div>
              <p className="pp-lede">
                Every listing carries a measurable proof point from a live
                deployment, not a feature list.
              </p>
            </Reveal>

            {/* filters + results */}
            <div className="pp-catalog-layout">
              <aside className="pp-filter-side" aria-label="Product filters">
                <ProductFilterSidebar
                  values={filters}
                  onChange={applyFilters}
                  facets={facets}
                  categoryTree={catError ? [] : tree}
                  categoriesLoading={catLoading}
                />
              </aside>

              <div className="pp-fade-stack pp-stack pp-gap-6" style={{ minWidth: 0 }}>
                <div className="pp-results-head">
                  <div className="pp-stack" style={{ gap: 4 }}>
                    <h3 className="pp-heading-sm">
                      {naturalMode && search
                        ? `Best matches for "${search}"`
                        : search
                          ? `Results for "${search}"`
                          : categoryLabel ?? 'All products'}
                    </h3>
                    {naturalMode && search && naturalNote && (
                      <p className="pp-small" style={{ color: 'var(--slate-11)' }}>
                        {naturalNote}
                      </p>
                    )}
                  </div>
                  <div className="pp-flex pp-gap-3" style={{ alignItems: 'center' }}>
                    <button
                      type="button"
                      className="pp-btn pp-btn--secondary pp-btn--sm pp-btn--inline pp-filters-toggle"
                      onClick={() => setDrawerOpen(true)}
                    >
                      <FunnelIcon size={16} />
                      {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
                    </button>
                    <SortMenu<ProductSort>
                      value={filters.sort}
                      options={PRODUCT_SORT_OPTIONS}
                      onChange={(sort) => updateFilters({ sort })}
                    />
                  </div>
                </div>

                {activeFilterTags.length > 0 && (
                  <div className="pp-flex pp-wrap pp-gap-2" style={{ rowGap: 'var(--sp-2)', alignItems: 'center' }}>
                    {activeFilterTags.map((tag) => (
                      <span key={tag.label} className="pp-tag pp-tag--filter">
                        {tag.label}
                        <button
                          type="button"
                          className="pp-tag-x"
                          aria-label={`Remove ${tag.label}`}
                          onClick={tag.clear}
                        >
                          <TagX />
                        </button>
                      </span>
                    ))}
                    <button type="button" className="pp-filter-group-clear" onClick={clearAllFilters}>
                      Clear all
                    </button>
                  </div>
                )}

                {error && (
                  <div
                    className="pp-stack pp-gap-4"
                    style={{ alignItems: 'center', paddingBlock: 'var(--sp-12)' }}
                  >
                    <p className="pp-body" style={{ color: 'var(--color-error-600, #d92d20)' }}>
                      {error.error.code === 'CIRCUIT_OPEN'
                        ? `Service temporarily unavailable. Retry in ${error.error.retryAfter}s.`
                        : 'Unable to load products. Please try again.'}
                    </p>
                    <button
                      type="button"
                      onClick={refetch}
                      className="pp-btn pp-btn--cobalt pp-btn--sm pp-btn--inline"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {isLoadingInitialProducts ? (
                  <div
                    className="pp-grid pp-grid-2"
                    style={{ gap: 'var(--sp-6)' }}
                    role="status"
                    aria-busy="true"
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                ) : products.length === 0 && !error ? (
                  <div
                    className="pp-stack"
                    style={{ alignItems: 'center', paddingBlock: 'var(--sp-20)', textAlign: 'center' }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--slate-2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 'var(--sp-4)',
                        color: 'var(--slate-11)',
                      }}
                    >
                      <SearchIcon />
                    </div>
                    <h3 className="pp-heading-sm">No products match these filters</h3>
                    <p
                      className="pp-body"
                      style={{ color: 'var(--slate-11)', maxWidth: '400px', marginTop: 'var(--sp-2)' }}
                    >
                      Try removing a filter or broadening your search. We&apos;re onboarding new vendors every week.
                    </p>
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        className="pp-btn pp-btn--secondary pp-btn--sm pp-btn--inline"
                        style={{ marginTop: 'var(--sp-4)' }}
                        onClick={clearAllFilters}
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                ) : (
                  <Reveal>
                    <div
                      className="pp-grid pp-grid-2"
                      style={{
                        gap: 'var(--sp-6)',
                        opacity: isRefreshingProducts ? 0.5 : 1,
                        transition: 'opacity 160ms ease',
                      }}
                      aria-busy={isRefreshingProducts}
                    >
                      {products.map((p) => (
                        <ProductCard key={p.product_id} product={p} />
                      ))}
                    </div>
                  </Reveal>
                )}

                {(!naturalMode || !hasActiveSearch) && pagination?.hasNextPage && (
                  <div className="pp-fade-action" style={{ marginTop: 0 }}>
                    <button
                      type="button"
                      onClick={() =>
                        setPaginationState({
                          requestKey,
                          offset: getNextProductPageOffset(products),
                        })
                      }
                      disabled={isLoadingMoreProducts}
                      className="pp-btn pp-btn--secondary pp-btn--inline"
                    >
                      {isLoadingMoreProducts ? 'Loading…' : 'Load more products'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ───────────────────────────────────────── */}
        <section className="pp-section pp-blueprint">
          <div className="pp-glow" style={{ left: -84, top: 588 }} />
          <div className="pp-container">
            <Reveal className="pp-stack pp-gap-8 pp-soften">
              <div className="pp-stack pp-gap-4 pp-center pp-soften">
                <p className="pp-label">Contact us</p>
                <h2 className="pp-display pp-d3">Can&apos;t see your product?</h2>
                <p className="pp-lede pp-mx-auto" style={{ maxWidth: '56ch' }}>
                  Proploy is constantly expanding. Tell us what&apos;s missing —
                  we&apos;ll reach out when it&apos;s live, or connect you with
                  an expert who can help.
                </p>
              </div>

              <form
                className="pp-card pp-card--panel pp-stack pp-gap-6"
                style={{ maxWidth: 620, marginInline: 'auto', width: '100%' }}
                action={async () => {
                  try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_APIS_URL}/api/v1/contact`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        type: 'missing_product',
                        firstName: contact.firstName,
                        lastName: contact.lastName,
                        email: contact.email,
                        phone: contact.phone,
                        message: contact.message,
                      }),
                    })
                    if (res.ok) {
                      alert('Thanks — Proploy will reach out shortly.')
                      setContact({ firstName: '', lastName: '', email: '', phone: '', message: '', consent: false })
                    } else {
                      alert('Failed to send message. Please try again.')
                    }
                  } catch {
                    alert('Failed to send message. Please try again.')
                  }
                }}
              >
                <div className="pp-grid pp-grid-2" style={{ gap: 'var(--sp-5)' }}>
                  <div className="pp-field">
                    <label htmlFor="pFirst">First name</label>
                    <input
                      className="pp-input"
                      id="pFirst"
                      type="text"
                      placeholder="First name"
                      value={contact.firstName}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, firstName: e.target.value }))
                      }
                    />
                  </div>
                  <div className="pp-field">
                    <label htmlFor="pLast">Last name</label>
                    <input
                      className="pp-input"
                      id="pLast"
                      type="text"
                      placeholder="Last name"
                      value={contact.lastName}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, lastName: e.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="pp-field">
                  <label htmlFor="pEmail">Email</label>
                  <input
                    className="pp-input"
                    id="pEmail"
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={contact.email}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, email: e.target.value }))
                    }
                  />
                </div>
                <div className="pp-field">
                  <label htmlFor="pPhone">Phone number</label>
                  <input
                    className="pp-input"
                    id="pPhone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={contact.phone}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, phone: e.target.value }))
                    }
                  />
                </div>
                <div className="pp-field">
                  <label htmlFor="pMsg">Message</label>
                  <textarea
                    className="pp-textarea"
                    id="pMsg"
                    placeholder="Tell us about the product you can't find"
                    value={contact.message}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, message: e.target.value }))
                    }
                  />
                </div>
                <label className="pp-check">
                  <input
                    type="checkbox"
                    checked={contact.consent}
                    onChange={(e) =>
                      setContact((c) => ({ ...c, consent: e.target.checked }))
                    }
                  />
                  <span>
                    You agree to our friendly{' '}
                    <Link href="#">privacy policy</Link>.
                  </span>
                </label>
                <button type="submit" className="pp-btn pp-btn--cobalt pp-btn--block">
                  Send message
                </button>
              </form>
            </Reveal>
          </div>
        </section>

        {/* ── Closing CTA ───────────────────────────────────── */}
        <section style={{ paddingBlock: '0 var(--section-y)' }}>
          <div className="pp-container">
            <Reveal className="pp-dark">
              <div
                className="pp-sec-split"
                style={{ alignItems: 'center', gap: 'var(--sp-16)' }}
              >
                <div className="pp-stack pp-gap-5">
                  <p className="pp-label">Get started</p>
                  <h2 className="pp-display pp-d3">
                    Transform your software procurement strategy.
                  </h2>
                  <p className="pp-lede">
                    Join the enterprises modernising how they buy and deploy
                    software — with implementation success rates the old way
                    never reached.
                  </p>
                </div>
                <form
                  className="pp-stack pp-gap-3"
                  action={async (formData: FormData) => {
                    const email = formData.get('email') as string
                    if (!email) return
                    try {
                      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_APIS_URL}/api/v1/contact`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          type: 'newsletter',
                          email: email.trim(),
                        }),
                      })
                      if (res.ok) {
                        alert('Subscribed.')
                        // Form reset should be handled via ref or state if needed, but alert is sufficient here
                      } else {
                        alert('Failed to subscribe. Please try again.')
                      }
                    } catch {
                      alert('Failed to subscribe. Please try again.')
                    }
                  }}
                >
                  <div className="pp-flex pp-gap-3">
                    <input
                      name="email"
                      className="pp-input"
                      type="email"
                      required
                      placeholder="you@company.com"
                      aria-label="Work email"
                    />
                    <button type="submit" className="pp-btn pp-btn--cobalt pp-btn--inline">
                      Subscribe
                    </button>
                  </div>
                  <p className="pp-small">
                    No sales sequence. A named specialist reviews your stack
                    first.
                  </p>
                </form>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {drawerOpen ? (
        <ProductFiltersDrawer
          key={JSON.stringify(filters)}
          open={drawerOpen}
          values={filters}
          facets={facets}
          categoryTree={tree}
          onClose={() => setDrawerOpen(false)}
          onApply={applyFilters}
        />
      ) : null}

      <Footer />
    </div>
  )
}

/* ── search panel (hero glass form) ─────────────────────────── */

function ProductSearchPanel({
  mode,
  onModeChange,
  initialQuery,
  onSearch,
  freeTrial,
}: {
  mode: SearchMode
  onModeChange: (mode: SearchMode) => void
  initialQuery: string
  onSearch: (query: string) => void
  freeTrial: boolean
}) {
  const [query, setQuery] = useState(initialQuery)
  const [resultsOpen, setResultsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const {
    products,
    loading,
    error,
    search,
    clear,
  } = useKeywordSearch()
  const {
    products: naturalProducts,
    loading: naturalLoading,
    error: naturalError,
    note: naturalNote,
    search: searchNatural,
    clear: clearNatural,
  } = useNaturalSearch({ freeTrial })

  const isNatural = mode === 'natural'
  const activeProducts = isNatural ? naturalProducts : products
  const activeLoading = isNatural ? naturalLoading : loading
  const activeError = isNatural ? naturalError : error

  type MobileSearcherMap = {
    keyword: (query: string, limit?: number) => Promise<void> | void
    natural: (query: string, limit?: number) => Promise<void> | void
    clearKeyword: () => void
    clearNatural: () => void
  }

  const panelSearchersRef = useRef<MobileSearcherMap>({
    keyword: () => {},
    natural: () => {},
    clearKeyword: () => {},
    clearNatural: () => {},
  })
  useEffect(() => {
    panelSearchersRef.current = {
      keyword: search,
      natural: searchNatural,
      clearKeyword: clear,
      clearNatural: clearNatural,
    }
  }, [search, searchNatural, clear, clearNatural])

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    if (query.trim().length > 1) {
      const activeSearch = isNatural
        ? panelSearchersRef.current.natural
        : panelSearchersRef.current.keyword
      void activeSearch(query, 6)
    } else {
      panelSearchersRef.current.clearKeyword()
      panelSearchersRef.current.clearNatural()
    }
  }, [isNatural, query])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setResultsOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  return (
    <form
      className="pp-stack pp-gap-4"
      onSubmit={(e) => {
        e.preventDefault()
        setResultsOpen(false)
        onSearch(query)
      }}
    >
      <div className="pp-flex">
        <SearchModeToggle value={mode} onChange={onModeChange} />
      </div>

      <div className="pp-flex pp-gap-3">
        <div ref={searchRef} style={{ flex: 1, position: 'relative' }}>
          <div className="pp-search">
            <input
              type="text"
              name="query"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setResultsOpen(true)
              }}
              onFocus={() => {
                if (query.trim().length > 1) setResultsOpen(true)
              }}
              placeholder="Search products, industries, and experts"
              aria-label="Search products"
            />
          </div>

          {resultsOpen && query.trim().length > 1 && (
            <div
              className="pp-search-results"
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 'calc(100% + 8px)',
                zIndex: 40,
                overflow: 'hidden',
                background: '#fff',
                border: 'var(--bw) solid var(--line)',
                borderRadius: 'var(--r-card)',
                boxShadow: 'var(--shadow-menu)',
              }}
            >
              {isNatural && naturalNote && (
                <p
                  className="pp-small"
                  style={{
                    padding: '10px 14px',
                    color: 'var(--slate-11)',
                    borderBottom: 'var(--bw) solid var(--line)',
                  }}
                >
                  {naturalNote}
                </p>
              )}
              {activeLoading ? (
                <p className="pp-small" style={{ padding: '14px 16px', textAlign: 'center' }}>
                  Searching products...
                </p>
              ) : activeError ? (
                <p
                  className="pp-small"
                  style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--color-error-600, #b42318)' }}
                >
                  Unable to search products.
                </p>
              ) : activeProducts.length > 0 ? (
                <div style={{ paddingBlock: 6 }}>
                  {activeProducts.map((product) => (
                    <Link
                      key={product.product_id}
                      href={getProductDetailHref(product.product_id)}
                      onClick={() => setResultsOpen(false)}
                      className="pp-flex pp-gap-3"
                      style={{ alignItems: 'center', padding: '10px 14px', color: 'inherit' }}
                    >
                      <span className="pp-tile pp-tile--sm">
                        {product.product_logo ? (
                          <CatalogImage
                            src={product.product_logo}
                            alt=""
                            className="size-full object-contain p-[4px]"
                            fallback={<span aria-hidden="true">{product.product_name.charAt(0)}</span>}
                          />
                        ) : (
                          <span aria-hidden="true">{product.product_name.charAt(0)}</span>
                        )}
                      </span>
                      <span className="pp-stack" style={{ minWidth: 0, flex: 1, gap: 0 }}>
                        <span
                          className="pp-body"
                          style={{
                            color: 'var(--ink)',
                            fontWeight: 'var(--weight-semibold)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.product_name}
                        </span>
                        <span
                          className="pp-small"
                          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {product.primary_category ?? 'Software product'}
                        </span>
                      </span>
                    </Link>
                  ))}
                  <button
                    type="submit"
                    className="pp-small"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      textAlign: 'center',
                      fontWeight: 'var(--weight-semibold)',
                      color: 'var(--cobalt)',
                      background: 'none',
                      border: 'none',
                      borderTop: 'var(--bw) solid var(--line)',
                      cursor: 'pointer',
                    }}
                  >
                    View all results for &quot;{query}&quot;
                  </button>
                </div>
              ) : (
                <p className="pp-small" style={{ padding: '14px 16px', textAlign: 'center' }}>
                  No products found.
                </p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="pp-btn pp-btn--cobalt pp-btn-icon"
          aria-label="Search"
          style={{ height: 52, width: 52 }}
        >
          <SearchIcon />
        </button>
      </div>

    </form>
  )
}

/* ── product card ───────────────────────────────────────────── */

function ProductCard({ product }: { product: CardProduct }) {
  const initial = product.product_name?.charAt(0) ?? 'P'
  return (
    <article
      className="pp-card pp-lift"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-8)', height: '100%', position: 'relative' }}
    >
      <Link 
        href={getProductDetailHref(product.product_id)} 
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        aria-label={`View ${product.product_name}`}
      />
      <div className="pp-stack pp-gap-3" style={{ position: 'relative', zIndex: 1, pointerEvents: 'none' }}>
        <div
          className="pp-flex"
          style={{ justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--sp-3)' }}
        >
          <span className="pp-tile">
            {product.product_logo ? (
              <CatalogImage
                src={product.product_logo}
                alt={`${product.product_name} logo`}
                className="size-full object-contain p-[6px]"
                fallback={<span aria-hidden="true">{initial}</span>}
              />
            ) : (
              <span aria-hidden="true">{initial}</span>
            )}
          </span>
          {product.rating !== null && product.rating > 0 && (
            <RatingStars rating={product.rating} />
          )}
        </div>
        <div className="pp-h6">
          {product.product_name}
        </div>
        <p className="pp-body pp-clamp-3" style={{ minHeight: 72 }}>
          {product.product_description ||
            'Proploy-matched implementation experts have shipped this rollout for teams just like yours — from procurement to go-live.'}
        </p>
      </div>

      <div
        className="pp-flex pp-wrap pp-gap-3"
        style={{ justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', position: 'relative', zIndex: 1 }}
      >
        <span
          className="pp-link-arrow"
          style={{ pointerEvents: 'none' }}
        >
          Learn more
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
        <div className="pp-flex pp-gap-2" style={{ alignItems: 'center', pointerEvents: 'auto' }}>
          <FavoriteToggle targetId={product.product_id} label={product.product_name} />
          <CompareToggle
            product={{
              product_id: product.product_id,
              product_name: product.product_name,
              product_logo: product.product_logo,
            }}
          />
        </div>
      </div>
    </article>
  )
}
