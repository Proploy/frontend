'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import CompareToggle from '@/components/compare/CompareToggle'
import ListingExplorer from '@/components/ListingExplorer'
import Footer from '@/components/Footer'
import {
  getProductDetailHref,
  useCategoryTree,
  useProductList,
  type CardProduct,
  type CategoryNode,
} from '@/features/catalog'
import {
  DEFAULT_PRODUCT_FILTERS,
  type ProductFilterValues,
} from '@/components/filters/ProductFiltersDrawer'

const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

const ACTIVE_BUTTON_CLASS = 'bg-white text-[#414651] border border-[#e9eaeb] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1)]'
const INACTIVE_BUTTON_CLASS = 'text-[#717680] hover:text-[#414651]'
const BASE_BUTTON_CLASS = 'h-[44px] px-[16px] rounded-[8px] font-semibold text-[14px] leading-[20px] transition-colors'

function CategoryNavigation({
  categories,
  activeCategory,
  onChange,
}: {
  categories: CategoryNode[]
  activeCategory: string | null
  onChange: (category: CategoryNode | null) => void
}) {
  const [openRootId, setOpenRootId] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap items-start justify-center gap-[8px]">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`${BASE_BUTTON_CLASS} ${activeCategory === null ? ACTIVE_BUTTON_CLASS : INACTIVE_BUTTON_CLASS}`}
      >
        View all
      </button>
      {categories.map((root) => (
        <div
          key={root.term_id}
          className="relative"
          onMouseEnter={() => setOpenRootId(root.term_id)}
          onMouseLeave={() => setOpenRootId(null)}
          onFocus={() => setOpenRootId(root.term_id)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setOpenRootId(null)
          }}
        >
          <button
            type="button"
            aria-expanded={openRootId === root.term_id}
            aria-haspopup="menu"
            onClick={() => setOpenRootId(root.term_id)}
            className={`${BASE_BUTTON_CLASS} inline-flex items-center gap-[6px] ${
              root.children.some((child) => child.term_id === activeCategory)
                ? ACTIVE_BUTTON_CLASS
                : INACTIVE_BUTTON_CLASS
            }`}
          >
            {root.label}
            <ChevronDown
              size={16}
              className={`transition-transform ${openRootId === root.term_id ? 'rotate-180' : ''}`}
            />
          </button>

          {openRootId === root.term_id && (
            <div
              role="menu"
              className="absolute left-1/2 top-full z-40 mt-[8px] w-[320px] -translate-x-1/2 rounded-[12px] border border-[#e9eaeb] bg-white p-[8px] shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03)]"
            >
              <div className="px-[10px] pb-[8px] pt-[6px]">
                <p className="text-[14px] font-semibold leading-[20px] text-[#181d27]">{root.label}</p>
                {root.description && (
                  <p className="mt-[2px] text-[12px] leading-[18px] text-[#717680]">{root.description}</p>
                )}
              </div>
              <div className="max-h-[360px] overflow-y-auto">
                {root.children.map((child) => (
                  <button
                    key={child.term_id}
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onChange(child)
                      setOpenRootId(null)
                    }}
                    className={`flex w-full items-center justify-between gap-[12px] rounded-[8px] px-[10px] py-[9px] text-left hover:bg-[#fafafa] ${
                      child.term_id === activeCategory ? 'bg-[#eff4ff]' : ''
                    }`}
                  >
                    <span className="text-[14px] font-medium leading-[20px] text-[#414651]">
                      {child.label}
                    </span>
                    <span className="shrink-0 text-[12px] leading-[18px] text-[#717680]">
                      {child.product_count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageContent />
    </Suspense>
  )
}

function ProductsPageContent() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search')?.trim() || undefined
  const categoryParam = searchParams.get('category')
  const { tree, loading: catLoading, error: catError } = useCategoryTree()
  const roots = useMemo(
    () => tree.filter((node) => node.taxonomy_type === 'ui_category' && node.parent_term_id === null),
    [tree],
  )
  const selectedFromUrl = useMemo(
    () => roots.flatMap((root) => root.children).find((child) => child.term_id === categoryParam) ?? null,
    [categoryParam, roots],
  )
  const [activeCategory, setActiveCategory] = useState<CategoryNode | null>(selectedFromUrl)
  const [limit, setLimit] = useState(15)
  const [filters, setFilters] = useState<ProductFilterValues>(DEFAULT_PRODUCT_FILTERS)

  useEffect(() => {
    setActiveCategory(selectedFromUrl)
  }, [selectedFromUrl])

  const { products, loading, error, pagination, refetch } = useProductList({
    limit,
    category: activeCategory?.term_id,
    search,
    pricing_bucket: filters.pricingBucket || undefined,
    free_plan: filters.freePlan || undefined,
    free_trial: filters.freeTrial || undefined,
    sort: filters.sort,
  })
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
  })

  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-dm-sans)] flex flex-col">
      <ListingExplorer
        kind="products"
        productFilters={filters}
        onProductFiltersChange={(values) => {
          setFilters(values)
          setLimit(15)
        }}
      />

      <section className="py-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[64px]">
          <div className="max-w-[768px] mx-auto flex flex-col gap-[20px] text-center">
            <h2 className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
              Close more deals, stress less.
            </h2>
            <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
              Hear first-hand from our incredible community of customers.
            </p>
          </div>

          {/* Category filter tabs */}
          {catLoading ? (
            <div className="flex justify-center">
              <span className="text-[#717680] text-[14px]">Loading categories...</span>
            </div>
          ) : catError ? (
            <div className="flex justify-center">
              <span className="text-red-500 text-[14px]">Failed to load categories</span>
            </div>
          ) : (
            <CategoryNavigation
              categories={roots}
              activeCategory={activeCategory?.term_id ?? null}
              onChange={(category) => {
                setActiveCategory(category)
                setLimit(15)
              }}
            />
          )}

          {activeCategory && (
            <div className="mx-auto -mt-[40px] max-w-[720px] text-center">
              <p className="text-[14px] font-semibold leading-[20px] text-[#004eeb]">
                {activeCategory.label}
              </p>
              {activeCategory.description && (
                <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                  {activeCategory.description}
                </p>
              )}
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="flex flex-col items-center gap-[16px] py-[48px]">
              <p className="text-[16px] text-red-500 font-medium">
                {error.error.code === 'CIRCUIT_OPEN'
                  ? `Service temporarily unavailable. Retry in ${error.error.retryAfter}s.`
                  : 'Unable to load products. Please try again.'}
              </p>
              <button
                type="button"
                onClick={refetch}
                className="px-[16px] py-[8px] bg-[#155eef] text-white rounded-[8px] font-semibold text-[14px]"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-[96px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0466e7]" />
            </div>
          ) : products.length === 0 && !error ? (
            <div className="flex flex-col items-center gap-[16px] py-[96px]">
              <p className="text-[16px] text-[#535862]">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
              {products.map((p, idx) => (
                <ProductCard key={p.product_id} product={p} highlightIndex={idx} />
              ))}
            </div>
          )}

          {pagination?.hasNextPage && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setLimit((current) => current + 15)}
                className={`bg-white border border-[#d5d7da] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-[#414651] ${BUTTON_SKEUO_SHADOW}`}
              >
                Load more products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Contact section */}
      <section className="py-[96px] bg-[#fafafa]">
        <div className="max-w-[768px] mx-auto px-[32px] flex flex-col gap-[32px]">
          <div className="flex flex-col items-center gap-[12px] text-center">
            <p className="font-semibold text-[16px] leading-[24px] text-[#004eeb]">Contact us</p>
            <h2 className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
              Can&apos;t See Your Product?
            </h2>
            <p className="font-normal text-[16px] leading-[24px] text-[#535862] max-w-[560px]">
              We&apos;re constantly expanding and would love to hear from you. Tell us what&apos;s missing.
              We&apos;ll reach out when it&apos;s live or connect you with an expert who can help.
            </p>
          </div>

          <form
            className="flex flex-col gap-[24px] bg-white rounded-[16px] border border-[#e9eaeb] p-[32px]"
            onSubmit={(e) => {
              e.preventDefault()
              alert('Thanks — Proploy will reach out shortly.')
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <LabeledInput label="First name" value={contact.firstName} onChange={(v) => setContact((c) => ({ ...c, firstName: v }))} placeholder="First name" />
              <LabeledInput label="Last name" value={contact.lastName} onChange={(v) => setContact((c) => ({ ...c, lastName: v }))} placeholder="Last name" />
            </div>
            <LabeledInput label="Email" type="email" value={contact.email} onChange={(v) => setContact((c) => ({ ...c, email: v }))} placeholder="you@company.com" required />
            <LabeledInput label="Phone number" value={contact.phone} onChange={(v) => setContact((c) => ({ ...c, phone: v }))} placeholder="+1 (555) 000-0000" />
            <div className="flex flex-col gap-[6px]">
              <label className="font-medium text-[14px] leading-[20px] text-[#414651]">Message</label>
              <textarea
                value={contact.message}
                onChange={(e) => setContact((c) => ({ ...c, message: e.target.value }))}
                placeholder="Tell us about the product you can&apos;t find"
                className="h-[124px] resize-none border border-[#d5d7da] rounded-[8px] px-[14px] py-[12px] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#0466e7]/30 focus:border-[#0466e7]"
              />
            </div>
            <label className="flex items-start gap-[8px] font-normal text-[14px] leading-[20px] text-[#535862]">
              <input
                type="checkbox"
                checked={contact.consent}
                onChange={(e) => setContact((c) => ({ ...c, consent: e.target.checked }))}
                className="mt-[2px]"
              />
              You agree to our friendly{' '}
              <Link href="#" className="underline">
                privacy policy
              </Link>
              .
            </label>
            <button
              type="submit"
              className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] py-[12px] font-semibold text-[16px] leading-[24px] text-white ${BUTTON_SKEUO_SHADOW}`}
            >
              Send message
            </button>
          </form>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-[96px] bg-[#0040c1]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-wrap gap-[32px] items-start">
          <div className="flex-1 min-w-[420px] max-w-[768px] flex flex-col gap-[20px]">
            <h2 className="font-semibold text-[36px] leading-[44px] text-white tracking-[-0.72px]">
              Transform Your Software Procurement Strategy
            </h2>
            <p className="font-normal text-[20px] leading-[30px] text-[#b2ccff]">
              Join leading enterprises that have modernised their procurement operations and achieved consistent,
              high-success implementation outcomes.
            </p>
          </div>
          <form
            className="w-[480px] max-w-full flex flex-col gap-[6px]"
            onSubmit={(e) => {
              e.preventDefault()
              alert('Subscribed.')
            }}
          >
            <div className="flex gap-[16px]">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[12px] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
              />
              <button
                type="submit"
                className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-white ${BUTTON_SKEUO_SHADOW}`}
              >
                Subscribe
              </button>
            </div>
            <p className="font-normal text-[14px] leading-[20px] text-[#b2ccff]">
              We care about your data in our{' '}
              <Link href="#" className="underline">
                privacy policy
              </Link>
              .
            </p>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}

const HIGHLIGHT_BADGES = [
  { label: '+24% Sales Increase', tone: 'blue' },
  { label: '3× Faster Rollout', tone: 'indigo' },
  { label: '40 hrs / week saved', tone: 'success' },
  { label: 'CFO-ready ROI', tone: 'pink' },
  { label: 'Cuts vendor sprawl', tone: 'brand' },
]

const HIGHLIGHT_STYLES: Record<string, string> = {
  blue: 'bg-[#eff8ff] border-[#b2ddff] text-[#175cd3] dot-[#1570ef]',
  indigo: 'bg-[#eef4ff] border-[#c7d7fe] text-[#3538cd] dot-[#444ce7]',
  success: 'bg-[#ecfdf3] border-[#abefc6] text-[#067647] dot-[#079455]',
  pink: 'bg-[#fdf2fa] border-[#fcceee] text-[#c11574] dot-[#dd2590]',
  brand: 'bg-[#eff4ff] border-[#b2ddff] text-[#004eeb] dot-[#155eef]',
}

function ProductCard({ product, highlightIndex }: { product: CardProduct; highlightIndex: number }) {
  const highlight = HIGHLIGHT_BADGES[highlightIndex % HIGHLIGHT_BADGES.length]
  const tone = HIGHLIGHT_STYLES[highlight.tone]
  return (
    <article className="bg-white border border-[#e9eaeb] rounded-[12px] p-[32px] flex flex-col gap-[36px]">
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-start justify-between">
          <div className={`size-[48px] rounded-[10px] border border-[#d5d7da] bg-white flex items-center justify-center text-[#155eef] font-bold text-[18px] ${BUTTON_SKEUO_SHADOW}`}>
            {product.product_logo ? (
              <CatalogImage
                src={product.product_logo}
                alt={`${product.product_name} logo`}
                className="size-full rounded-[10px] object-contain p-[4px]"
                fallback={<span aria-hidden="true">{product.product_name?.charAt(0) ?? 'P'}</span>}
              />
            ) : (
              product.product_name?.charAt(0) ?? 'P'
            )}
          </div>
          <span className={`inline-flex items-center gap-[6px] rounded-full border px-[10px] py-[2px] font-medium text-[14px] leading-[20px] ${tone}`}>
            <span className="size-[6px] rounded-full bg-current" />
            {highlight.label}
          </span>
        </div>
        <Link
          href={getProductDetailHref(product.product_id)}
          className="font-semibold text-[18px] leading-[28px] text-[#181d27] hover:text-[#0466e7]"
        >
          {product.product_name}
        </Link>
        <p className="font-normal text-[16px] leading-[24px] text-[#535862] line-clamp-4">
          {product.product_description || 'Proploy-matched implementation experts have shipped this rollout for teams just like yours — from procurement to go-live.'}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <div className="flex -space-x-[8px]">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-[32px] rounded-full border-[1.5px] border-white bg-gradient-to-br from-[#cfcbdc] to-[#d7e3e8]"
            />
          ))}
        </div>
        <div className="flex items-center gap-[10px]">
          <CompareToggle
            product={{
              product_id: product.product_id,
              product_name: product.product_name,
              product_logo: product.product_logo,
            }}
          />
          <Link
            href={getProductDetailHref(product.product_id)}
            className="inline-flex items-center gap-[4px] font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline"
          >
            Learn More
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  )
}

function LabeledInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-[6px]">
      <label className="font-medium text-[14px] leading-[20px] text-[#414651]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#0466e7]/30 focus:border-[#0466e7]"
      />
    </div>
  )
}
