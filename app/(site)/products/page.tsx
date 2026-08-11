'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import { Skeleton } from '@/components/ui/Skeleton'
import CompareToggle from '@/components/compare/CompareToggle'
import FavoriteToggle from '@/components/personalization/FavoriteToggle'
import ListingExplorer from '@/components/ListingExplorer'
import {
  getProductDetailHref,
  useCategoryTree,
  useProductList,
  type CardProduct,
} from '@/features/catalog'
import {
  DEFAULT_PRODUCT_FILTERS,
  type ProductFilterValues,
} from '@/components/filters/ProductFiltersDrawer'
import { buildProductListRequest } from '@/features/catalog/products/filter-request'
import { getNextProductPageOffset } from '@/features/catalog/products/pagination-state'
import {
  PRODUCT_CARD_BODY_CLASS,
  PRODUCT_CARD_CLASS,
  PRODUCT_CARD_DESCRIPTION_CLASS,
} from '@/features/catalog/products/presentation'

const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

const PRODUCT_PAGE_SIZE = 15

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSuspenseFallback />}>
      <ProductsPageContent />
    </Suspense>
  )
}

function ProductsPageSuspenseFallback() {
  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-dm-sans)] flex flex-col">
      <div className="pb-[32px] pt-[120px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col items-center gap-[24px]">
          <Skeleton className="h-[64px] w-[824px] max-w-full rounded-full" />
        </div>
      </div>
      <section className="pb-[96px] pt-[24px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[40px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] flex flex-col gap-[16px]">
                <div className="flex items-start justify-between">
                  <Skeleton className="size-[48px] rounded-[10px]" />
                  <Skeleton className="h-[24px] w-[120px] rounded-full" />
                </div>
                <Skeleton className="h-[28px] w-[80%] rounded-[6px]" />
                <Skeleton.Text lines={2} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const search = searchParams.get('search')?.trim() || undefined
  const categoryParam = searchParams.get('category')
  const { tree, loading: catLoading, error: catError } = useCategoryTree()
  const requestKey = `${search ?? ''}:${categoryParam ?? ''}`
  const [paginationState, setPaginationState] = useState({
    requestKey,
    offset: 0,
  })
  const offset =
    paginationState.requestKey === requestKey
      ? paginationState.offset
      : 0
  const resetOffset = () =>
    setPaginationState({ requestKey, offset: 0 })
  const [storedFilters, setStoredFilters] =
    useState<ProductFilterValues>(DEFAULT_PRODUCT_FILTERS)
  const filters: ProductFilterValues = {
    ...storedFilters,
    categoryTermId: categoryParam ?? '',
  }

  const { products, loading, error, pagination, refetch } = useProductList({
    ...buildProductListRequest({
      search,
      categoryTermId: filters.categoryTermId,
      pricingBucket: filters.pricingBucket,
      freePlan: filters.freePlan,
      freeTrial: filters.freeTrial,
      sort: filters.sort,
      limit: PRODUCT_PAGE_SIZE,
      offset,
    }),
    append: true,
  })
  const isLoadingInitialProducts = loading && (offset === 0 || products.length === 0)
  const isLoadingMoreProducts = loading && offset > 0 && products.length > 0
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
        productCategoryTree={tree}
        productCategoriesLoading={catLoading}
        productCategoriesError={Boolean(catError)}
        onSearchChange={resetOffset}
        onProductFiltersChange={(values) => {
          setStoredFilters(values)
          resetOffset()
          if (values.categoryTermId !== (categoryParam ?? '')) {
            const params = new URLSearchParams(
              searchParams.toString(),
            )
            if (values.categoryTermId) {
              params.set('category', values.categoryTermId)
            } else {
              params.delete('category')
            }
            const query = params.toString()
            router.push(`/products${query ? `?${query}` : ''}`)
          }
        }}
      />

      <section className="pb-[96px] pt-[24px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[40px]">
          <div className="max-w-[768px] mx-auto flex flex-col gap-[20px] text-center">
            <h2 className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
              Close more deals, stress less.
            </h2>
            <p className="font-normal text-[20px] leading-[30px] text-[#535862]">
              Hear first-hand from our incredible community of customers.
            </p>
          </div>

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
          {isLoadingInitialProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]" role="status" aria-busy="true">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] flex flex-col gap-[16px]">
                  <div className="flex items-start justify-between">
                    <Skeleton className="size-[48px] rounded-[10px]" />
                    <Skeleton className="h-[24px] w-[120px] rounded-full" />
                  </div>
                  <Skeleton className="h-[28px] w-[80%] rounded-[6px]" />
                  <Skeleton.Text lines={2} />
                </div>
              ))}
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
                onClick={() =>
                  setPaginationState({
                    requestKey,
                    offset: getNextProductPageOffset(products),
                  })
                }
                disabled={isLoadingMoreProducts}
                aria-busy={isLoadingMoreProducts}
                className={`bg-white border border-[#d5d7da] rounded-[8px] px-[18px] py-[12px] font-semibold text-[16px] leading-[24px] text-[#414651] disabled:cursor-not-allowed disabled:text-[#717680] disabled:opacity-70 ${BUTTON_SKEUO_SHADOW}`}
              >
                {isLoadingMoreProducts ? 'Loading more products...' : 'Load more products'}
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
            onSubmit={async (e) => {
              e.preventDefault()
              try {
                await fetch('/api/contact', {
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
                alert('Thanks — Proploy will reach out shortly.')
                setContact({ firstName: '', lastName: '', email: '', phone: '', message: '', consent: false })
              } catch {
                alert('Thanks — Proploy will reach out shortly.')
              }
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

import { IntegrationLogo } from '@/components/integrations/IntegrationLogo'

function ProductCard({ product, highlightIndex }: { product: CardProduct; highlightIndex: number }) {
  const highlight = HIGHLIGHT_BADGES[highlightIndex % HIGHLIGHT_BADGES.length]
  const tone = HIGHLIGHT_STYLES[highlight.tone]
  return (
    <article className={PRODUCT_CARD_CLASS}>
      <div className={PRODUCT_CARD_BODY_CLASS}>
        <div className="flex items-start justify-between">
          <div className={`size-[48px] rounded-[10px] border border-[#d5d7da] bg-white flex items-center justify-center text-[#155eef] font-bold text-[18px] ${BUTTON_SKEUO_SHADOW}`}>
            {product.product_logo ? (
              <CatalogImage
                src={product.product_logo}
                alt={`${product.product_name} logo`}
                className="size-full rounded-[10px] object-contain p-[4px]"
                fallback={<IntegrationLogo name={product.product_name.toLowerCase()} size={46} />}
              />
            ) : (
              <IntegrationLogo name={product.product_name.toLowerCase()} size={46} />
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
        <p className={PRODUCT_CARD_DESCRIPTION_CLASS}>
          {product.product_description || 'Proploy-matched implementation experts have shipped this rollout for teams just like yours — from procurement to go-live.'}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-[10px]">
        <div className="flex items-center gap-[10px]">
          <FavoriteToggle targetId={product.product_id} label={product.product_name} />
          <CompareToggle
            product={{
              product_id: product.product_id,
              product_name: product.product_name,
              product_logo: product.product_logo,
            }}
          />
          <Link
            href={getProductDetailHref(product.product_id)}
            onClick={(event) => event.stopPropagation()}
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
