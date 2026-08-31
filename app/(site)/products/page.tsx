'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { CatalogImage } from '@/components/catalog/CatalogImage'
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
  useRecursiveCategoryProductList,
  type CardProduct,
  type CategoryNode,
  type SearchMode,
  getDescendantProductCategoryTermIds,
} from '@/features/catalog'
import { SearchModeToggle } from '@/components/search/SearchModeToggle'
import {
  DEFAULT_PRODUCT_FILTERS,
  ProductFiltersDrawer,
  type ProductFilterValues,
} from '@/components/filters/ProductFiltersDrawer'
import { buildProductListRequest } from '@/features/catalog/products/filter-request'
import { getNextProductPageOffset } from '@/features/catalog/products/pagination-state'

const PRODUCT_PAGE_SIZE = 15

type SearcherMap = {
  natural: (query: string, limit?: number) => Promise<void> | void
  clearNatural: () => void
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSuspenseFallback />}>
      <ProductsPageContent />
    </Suspense>
  )
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

function CategoryIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M3 6h18M6 12h12M10 18h4" />
    </svg>
  )
}

function PricingIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M12 2v20M17 6.5c0-1.9-2.2-3-5-3s-5 1.1-5 3 2.2 3 5 3.5 5 1.6 5 3.5-2.2 3-5 3-5-1.1-5-3" />
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

function subtreeContains(node: CategoryNode, termId: string): boolean {
  if (node.term_id === termId) return true
  return node.children.some((child) => subtreeContains(child, termId))
}

/** Flatten a root's subtree to the selectable (product_category) filter terms. */
function flattenSelectableCategories(node: CategoryNode): CategoryNode[] {
  const result: CategoryNode[] = []
  const walk = (current: CategoryNode) => {
    if (current.taxonomy_type === 'product_category') result.push(current)
    current.children.forEach(walk)
  }
  node.children.forEach(walk)
  return result
}

function pricingLabel(value: string): string | null {
  const labels: Record<string, string> = {
    free: 'Free',
    freemium: 'Freemium',
    paid_tier_1: 'Paid (Tier 1)',
    paid_tier_2: 'Paid (Tier 2)',
    paid_tier_3: 'Paid (Tier 3)',
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

function ProductsPageSuspenseFallback() {
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

function ProductsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get('search')?.trim() || undefined
  const categoryParam = searchParams.get('category')
  const modeParam = searchParams.get('mode')
  const activeMode: SearchMode =
    modeParam === 'natural' ? 'natural' : 'keyword'
  const { tree, loading: catLoading, error: catError } = useCategoryTree()
  const requestKey = `${search ?? ''}:${categoryParam ?? ''}`
  const [paginationState, setPaginationState] = useState({
    requestKey,
    offset: 0,
  })
  const offset =
    paginationState.requestKey === requestKey ? paginationState.offset : 0
  const resetOffset = () => setPaginationState({ requestKey, offset: 0 })
  const [storedFilters, setStoredFilters] =
    useState<ProductFilterValues>(DEFAULT_PRODUCT_FILTERS)
  const filters: ProductFilterValues = {
    ...storedFilters,
    categoryTermId: categoryParam ?? '',
  }
  const [drawerOpen, setDrawerOpen] = useState(false)
  const hasActiveSearch = Boolean(search)
  const naturalMode = activeMode === 'natural'

  const selectedCategoryNode = findCategoryNode(tree, filters.categoryTermId)
  const categoryTermIds = getDescendantProductCategoryTermIds(selectedCategoryNode)
  const { products: listedProducts, loading: listLoading, error: listError, pagination, refetch } = useRecursiveCategoryProductList({
    ...buildProductListRequest({
      search: !naturalMode ? search : undefined,
      categoryTermId: filters.categoryTermId,
      pricingBucket: filters.pricingBucket,
      freePlan: filters.freePlan,
      freeTrial: filters.freeTrial,
      companySize: filters.companySize,
      deploymentModel: filters.deploymentModel,
      compliance: filters.compliance,
      sort: filters.sort,
      limit: PRODUCT_PAGE_SIZE,
      offset,
    }),
    categoryTermIds,
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
    pricingBucket: filters.pricingBucket,
    companySize: filters.companySize,
    deploymentModel: filters.deploymentModel,
    compliance: filters.compliance,
    freePlan: filters.freePlan,
    freeTrial: filters.freeTrial,
    categoryTermId: filters.categoryTermId,
  })

  const naturalFilterKey = [
    filters.pricingBucket,
    ...filters.companySize,
    ...filters.deploymentModel,
    ...filters.compliance,
    filters.freePlan,
    filters.freeTrial,
    filters.categoryTermId,
  ].join('|')

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
      void pageSearchersRef.current.natural(search, 6)
    } else {
      pageSearchersRef.current.clearNatural()
    }
  }, [activeMode, naturalFilterKey, search])

  const products = (hasActiveSearch && naturalMode) ? naturalProducts : listedProducts
  const loading = (hasActiveSearch && naturalMode) ? naturalLoading : listLoading
  const error = (hasActiveSearch && naturalMode) ? naturalError : listError
  const isLoadingInitialProducts = loading && (offset === 0 || products.length === 0)
  const isLoadingMoreProducts = loading && offset > 0 && products.length > 0

  /* category rail state: which ui_category root is expanded */
  const [railRootOverride, setRailRootOverride] = useState<string | null>(null)
  const selectedRoot = railRootOverride
    ? (tree.find((node) => node.term_id === railRootOverride) ?? null)
    : filters.categoryTermId
      ? (tree.find((node) => subtreeContains(node, filters.categoryTermId)) ??
        null)
      : null
  const subcategories = selectedRoot
    ? flattenSelectableCategories(selectedRoot)
    : []
  const describedNode = selectedCategoryNode ?? selectedRoot
  const categoryLabel = selectedCategoryNode?.label ?? null

  const navigateWithParams = (mutate: (params: URLSearchParams) => void) => {
    resetOffset()
    const params = new URLSearchParams(searchParams.toString())
    mutate(params)
    const query = params.toString()
    router.push(`/products${query ? `?${query}` : ''}`, { scroll: false })
  }

  const selectCategory = (termId: string) => {
    navigateWithParams((params) => {
      if (termId) params.set('category', termId)
      else params.delete('category')
    })
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
    setStoredFilters(values)
    resetOffset()
    if (values.categoryTermId !== (categoryParam ?? '')) {
      selectCategory(values.categoryTermId)
    }
  }

  /* removable active-filter tags (same clearing mechanics as before) */
  const activeFilterTags: ActiveFilterTag[] = []
  if (filters.categoryTermId) {
    activeFilterTags.push({
      label: categoryLabel ?? 'Selected category',
      clear: () => selectCategory(''),
    })
  }
  if (filters.pricingBucket) {
    activeFilterTags.push({
      label: pricingLabel(filters.pricingBucket) ?? filters.pricingBucket,
      clear: () => {
        setStoredFilters({ ...storedFilters, pricingBucket: '' })
        resetOffset()
      },
    })
  }
  if (filters.freePlan) {
    activeFilterTags.push({
      label: 'Free plan available',
      clear: () => {
        setStoredFilters({ ...storedFilters, freePlan: false })
        resetOffset()
      },
    })
  }
  if (filters.freeTrial) {
    activeFilterTags.push({
      label: 'Free trial available',
      clear: () => {
        setStoredFilters({ ...storedFilters, freeTrial: false })
        resetOffset()
      },
    })
  }
  
  if (filters.companySize?.length) {
    filters.companySize.forEach(size => {
      activeFilterTags.push({
        label: companySizeLabel(size),
        clear: () => {
          setStoredFilters({
            ...storedFilters,
            companySize: storedFilters.companySize.filter(s => s !== size)
          })
          resetOffset()
        }
      })
    })
  }

  if (filters.deploymentModel?.length) {
    filters.deploymentModel.forEach(dep => {
      activeFilterTags.push({
        label: deploymentLabel(dep),
        clear: () => {
          setStoredFilters({
            ...storedFilters,
            deploymentModel: storedFilters.deploymentModel.filter(d => d !== dep)
          })
          resetOffset()
        }
      })
    })
  }

  if (filters.compliance?.length) {
    filters.compliance.forEach(comp => {
      activeFilterTags.push({
        label: comp,
        clear: () => {
          setStoredFilters({
            ...storedFilters,
            compliance: storedFilters.compliance.filter(c => c !== comp)
          })
          resetOffset()
        }
      })
    })
  }

  const planCount = Number(filters.freePlan) + Number(filters.freeTrial)
  const quickChipLabels = {
    category: categoryLabel ?? 'Any category',
    pricing: pricingLabel(filters.pricingBucket) ?? 'Any pricing',
    plans:
      planCount > 0
        ? `${planCount} plan filter${planCount === 1 ? '' : 's'}`
        : 'Plans & trials',
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
                  onMoreFilters={() => setDrawerOpen(true)}
                  quickChipLabels={quickChipLabels}
                  activeFilterTags={activeFilterTags}
                  pricingValue={filters.pricingBucket || ''}
                  onPricingChange={(val) => {
                    setStoredFilters((prev) => ({ ...prev, pricingBucket: val || '' }))
                    resetOffset()
                  }}
                  deploymentValue={filters.deploymentModel?.[0] || ''}
                  onDeploymentChange={(val) => {
                    setStoredFilters((prev) => ({
                      ...prev,
                      deploymentModel: val ? [val] : [],
                    }))
                    resetOffset()
                  }}
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

            {/* category rail */}
            {!catError && (
              <div id="catalogue-rail">
              <Reveal className="pp-stack pp-gap-6">
                <div className="pp-flex pp-wrap pp-gap-2">
                  <button
                    type="button"
                    className="pp-chip pp-chip--all"
                    aria-pressed={!selectedRoot && !filters.categoryTermId}
                    onClick={() => {
                      setRailRootOverride(null)
                      if (filters.categoryTermId) selectCategory('')
                    }}
                  >
                    View all
                  </button>
                  {catLoading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-[38px] w-[124px] rounded-full" />
                      ))
                    : tree.map((root) => (
                        <button
                          key={root.term_id}
                          type="button"
                          className="pp-chip"
                          aria-pressed={selectedRoot?.term_id === root.term_id}
                          onClick={() => {
                            setRailRootOverride(root.term_id)
                            selectCategory(root.term_id)
                          }}
                        >
                          {root.label}
                        </button>
                      ))}
                </div>

                {subcategories.length > 0 && (
                  <div className="pp-flex pp-wrap pp-gap-2">
                    {subcategories.map((node) => (
                      <button
                        key={node.term_id}
                        type="button"
                        className="pp-chip pp-chip--outline"
                        aria-pressed={filters.categoryTermId === node.term_id}
                        onClick={() =>
                          selectCategory(
                            filters.categoryTermId === node.term_id
                              ? ''
                              : node.term_id,
                          )
                        }
                      >
                        {node.label}
                      </button>
                    ))}
                  </div>
                )}

                {describedNode?.description ? (
                  <div
                    className="pp-stack"
                    style={{
                      gap: 2,
                      borderLeft: '2px solid var(--cobalt)',
                      paddingLeft: 'var(--sp-4)',
                    }}
                  >
                    <p className="pp-h6" style={{ color: 'var(--cobalt-deep)' }}>
                      {describedNode.label}
                    </p>
                    <p className="pp-body">{describedNode.description}</p>
                  </div>
                ) : null}
              </Reveal>
              </div>
            )}

            {/* product grid */}
            <div className="pp-fade-stack pp-stack pp-gap-8">
              {naturalMode && search && (
                <div className="pp-stack" style={{ gap: 4 }}>
                  <h3 className="pp-heading-sm">
                    Best matches for &quot;{search}&quot;
                  </h3>
                  {naturalNote && (
                    <p className="pp-small" style={{ color: 'var(--slate-11)' }}>
                      {naturalNote}
                    </p>
                  )}
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
                  className="pp-grid pp-grid-3"
                  style={{ gap: 'var(--sp-8)' }}
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
                  style={{ alignItems: 'center', paddingBlock: 'var(--sp-24)', textAlign: 'center' }}
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
                  <h3 className="pp-heading-sm">More products coming soon!</h3>
                  <p
                    className="pp-body"
                    style={{ color: 'var(--slate-11)', maxWidth: '400px', marginTop: 'var(--sp-2)' }}
                  >
                    We&apos;re actively onboarding new software vendors for this category. Try adjusting your filters or check back later.
                  </p>
                </div>
              ) : (
                <Reveal>
                  <div className="pp-grid pp-grid-3" style={{ gap: 'var(--sp-8)' }}>
                    {products.map((p) => (
                      <ProductCard key={p.product_id} product={p} />
                    ))}
                  </div>
                </Reveal>
              )}

              {!hasActiveSearch && pagination?.hasNextPage && (
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
                    aria-busy={isLoadingMoreProducts}
                    className="pp-btn pp-btn--secondary pp-btn--pill pp-btn--inline"
                  >
                    {isLoadingMoreProducts
                      ? 'Loading more products...'
                      : 'Load more products'}
                  </button>
                </div>
              )}
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
  onMoreFilters,
  quickChipLabels,
  activeFilterTags,
  pricingValue,
  onPricingChange,
  deploymentValue,
  onDeploymentChange,
  freeTrial,
}: {
  mode: SearchMode
  onModeChange: (mode: SearchMode) => void
  initialQuery: string
  onSearch: (query: string) => void
  onMoreFilters: () => void
  quickChipLabels: { category: string; pricing: string; plans: string }
  activeFilterTags: ActiveFilterTag[]
  pricingValue: string
  onPricingChange: (value: string) => void
  deploymentValue: string
  onDeploymentChange: (value: string) => void
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

  const scrollToRail = () => {
    document
      .getElementById('catalogue-rail')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

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

      <div className="pp-flex pp-wrap pp-gap-3" style={{ justifyContent: 'space-between' }}>
        <div className="pp-flex pp-wrap pp-gap-2">
          <button
            type="button"
            className="pp-chip pp-btn--inline"
            onClick={scrollToRail}
            title="Browse categories below"
          >
            <CategoryIcon />
            {quickChipLabels.category}
          </button>
          <label
            className="pp-chip pp-btn--inline"
            style={{ position: 'relative', cursor: 'pointer', margin: 0 }}
          >
            <PricingIcon />
            {quickChipLabels.pricing}
            <select
              value={pricingValue}
              onChange={(e) => onPricingChange(e.target.value)}
              style={{
                position: 'absolute',
                opacity: 0,
                inset: 0,
                width: '100%',
                cursor: 'pointer',
              }}
              aria-label="Pricing filter"
            >
              <option value="">Any pricing</option>
              <option value="free">Free</option>
              <option value="freemium">Freemium</option>
              <option value="paid_tier_1">Paid (Tier 1)</option>
              <option value="paid_tier_2">Paid (Tier 2)</option>
              <option value="paid_tier_3">Paid (Tier 3)</option>
            </select>
          </label>
          <label
            className="pp-chip pp-btn--inline"
            style={{ position: 'relative', cursor: 'pointer', margin: 0 }}
          >
            <FunnelIcon />
            Any deployment
            <select
              value={deploymentValue}
              onChange={(e) => onDeploymentChange(e.target.value)}
              style={{
                position: 'absolute',
                opacity: 0,
                inset: 0,
                width: '100%',
                cursor: 'pointer',
              }}
              aria-label="Deployment filter"
            >
              <option value="">Any deployment</option>
              <option value="cloud">Cloud (SaaS)</option>
              <option value="self_hosted">Self-hosted / On-premise</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
        </div>
        <button
          type="button"
          className="pp-btn pp-btn--secondary pp-btn--sm pp-btn--inline"
          onClick={onMoreFilters}
        >
          <FunnelIcon size={16} />
          More filters
        </button>
      </div>

      {activeFilterTags.length > 0 && (
        <div className="pp-flex pp-wrap pp-gap-2" style={{ rowGap: 'var(--sp-2)' }}>
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
        </div>
      )}
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
