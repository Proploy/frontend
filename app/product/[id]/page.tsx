'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Footer from '@/components/Footer'
import ProductHeader, { ProductTabKey } from '@/components/product/ProductHeader'
import ProductInformationTab from '@/components/product/ProductInformationTab'
import IntegrationsTab from '@/components/product/IntegrationsTab'
import PricingTab from '@/components/product/PricingTab'
import ReviewsTab, { ProductReview } from '@/components/product/ReviewsTab'
import { useProductDetail } from '@/hooks/use-product-detail'

interface PricingPlan {
  plan_name: string
  plan_price: string
  plan_description: string
  features?: string[]
}

interface Product {
  product_id: string
  product_name: string
  product_description: string | null
  product_logo: string | null
  rating: number | null
  reviews: number | null
  category?: { name: string; link?: string }
  pricing_plans?: PricingPlan[]
  screenshots?: string[]
  videos?: string[]
  product_link?: string
  features?: Array<{ name: string; features: string[] }>
  alternatives?: Array<{ name: string; rating: number; reviews: number; link: string }>
  comparisons?: Array<{ name: string; logo: string; link: string }>
}

const PLACEHOLDER_REVIEW: ProductReview = {
  authorName: 'Sienna Hewitt',
  authorHandle: '@siennahewitt',
  verified: true,
  title: 'A main quote of the title of the thing',
  rating: 5,
  content:
    "We've been using Untitled to kick start every new project and can't imagine working without it. We've been using Untitled to kick start every new project and can't imagine working without it. We've been using Untitled to kick start every new project and can't imagine working without it. We've been using Untitled to kick start every new project and can't imagine working without it.",
}

const PLACEHOLDER_INTEGRATIONS = Array.from({ length: 22 }).map((_, i) => ({
  name: 'Linear',
  description: 'Streamline software projects, sprints, and bug tracking.',
  logo: undefined as string | undefined,
  _idx: i,
}))

const PLACEHOLDER_SPECIALIZATIONS = ['Productivity', 'Knowledge Base', 'Markdown', 'Local-first', 'Plugins', 'Note-taking']

const PLACEHOLDER_PRICING_SECTIONS = [
  {
    title: 'Overview',
    rows: [
      { name: 'Basic features', values: [{ type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }] },
      { name: 'Users', values: [{ type: 'text' as const, value: '10' }, { type: 'text' as const, value: '20' }, { type: 'text' as const, value: 'Unlimited' }] },
      { name: 'Individual data', values: [{ type: 'text' as const, value: '20 GB' }, { type: 'text' as const, value: '40 GB' }, { type: 'text' as const, value: 'Unlimited' }] },
      { name: 'Support', values: [{ type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }] },
      { name: 'Automated workflows', values: [{ type: 'bool' as const, value: false }, { type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }] },
      { name: '200+ integrations', values: [{ type: 'bool' as const, value: false }, { type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }] },
    ],
  },
  {
    title: 'Reporting and analytics',
    rows: [
      { name: 'Analytics', values: [{ type: 'text' as const, value: 'Basic' }, { type: 'text' as const, value: 'Advanced' }, { type: 'text' as const, value: 'Advanced' }] },
      { name: 'Export reports', values: [{ type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }] },
      { name: 'Scheduled reports', values: [{ type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }] },
      { name: 'API Access', values: [{ type: 'bool' as const, value: false }, { type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }] },
      { name: 'Advanced reports', values: [{ type: 'bool' as const, value: false }, { type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }] },
      { name: 'Saved reports', values: [{ type: 'bool' as const, value: false }, { type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }] },
      { name: 'Customer properties', values: [{ type: 'bool' as const, value: false }, { type: 'bool' as const, value: false }, { type: 'bool' as const, value: true }] },
      { name: 'Custom fields', values: [{ type: 'bool' as const, value: false }, { type: 'bool' as const, value: false }, { type: 'bool' as const, value: true }] },
    ],
  },
  {
    title: 'User access',
    rows: [
      { name: 'SSO/SAML authentication', values: [{ type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }] },
      { name: 'Advanced permissions', values: [{ type: 'bool' as const, value: false }, { type: 'bool' as const, value: true }, { type: 'bool' as const, value: true }] },
      { name: 'Audit log', values: [{ type: 'bool' as const, value: false }, { type: 'bool' as const, value: false }, { type: 'bool' as const, value: true }] },
      { name: 'Data history', values: [{ type: 'bool' as const, value: false }, { type: 'bool' as const, value: false }, { type: 'bool' as const, value: true }] },
    ],
  },
]

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [activeTab, setActiveTab] = useState<ProductTabKey>('product-information')

  const {
    product,
    loading,
    error,
    notFound,
    refetch,
    pricingPlans,
    ratings,
    alternatives,
    loadPricingPlans,
    loadRatings,
    loadAlternatives,
  } = useProductDetail({ productId: id })

  // Load sub-resources when tab becomes relevant
  useEffect(() => {
    if (activeTab === 'pricing') {
      loadPricingPlans()
    } else if (activeTab === 'reviews') {
      loadRatings()
    } else if (activeTab === 'vetted-experts') {
      loadAlternatives()
    }
  }, [activeTab, loadPricingPlans, loadRatings, loadAlternatives])

  const resolvedProduct: Product = product
    ? {
        product_id: product.product_id,
        product_name: product.product_name,
        product_description: product.short_description,
        product_logo: null,
        rating: product.avg_rating,
        reviews: product.total_reviews,
        pricing_plans: pricingPlans.map((p) => ({
          plan_name: p.plan_name,
          plan_price: p.price_text || '',
          plan_description: '',
        })),
        screenshots: [],
        videos: [],
        product_link: product.official_website || '#',
        features: [],
        alternatives: alternatives.map((a) => ({
          name: a.product_name,
          rating: a.avg_rating ?? 0,
          reviews: 0,
          link: `/product/${a.product_id}`,
        })),
      }
    : {
        product_id: id,
        product_name: 'Loading...',
        product_description: null,
        product_logo: null,
        rating: null,
        reviews: null,
        pricing_plans: [],
        screenshots: [],
        videos: [],
        product_link: '#',
      }

  const pricingTiers = useMemo(() => {
    const plans = resolvedProduct.pricing_plans ?? []
    const fallback = [
      { name: 'Basic', price: '$10', period: 'per month', description: 'Basic features for up to 10 users.', popular: true },
      { name: 'Business', price: '$20', period: 'per month', description: 'Advanced features and reporting, better workflows and automation.' },
      { name: 'Enterprise', price: '$40', period: 'per month', description: 'Personalised service and enterprise security for large teams.' },
    ]
    if (plans.length === 0) return fallback
    return plans.slice(0, 3).map((p, i) => ({
      name: p.plan_name,
      price: p.plan_price,
      period: 'per month',
      description: p.plan_description,
      popular: i === 0,
    }))
  }, [resolvedProduct])

  const media = useMemo(() => {
    const items: Array<{ url: string; type?: 'image' | 'video' }> = []
    resolvedProduct.screenshots?.forEach((s) => items.push({ url: s, type: 'image' }))
    resolvedProduct.videos?.forEach((v) => items.push({ url: v, type: 'video' }))
    return items
  }, [resolvedProduct])

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0466e7]" />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-white gap-8">
        <h1 className="font-semibold text-[36px] text-[#181d27]">Product not found</h1>
        <Link href="/products" className="text-[#004eeb] font-semibold hover:underline">Back to products</Link>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-white gap-8">
        <p className="text-red-500 font-medium">
          {error.error.code === 'CIRCUIT_OPEN'
            ? `Service temporarily unavailable. Retry in ${error.error.retryAfter}s.`
            : 'Unable to load product. Please try again.'}
        </p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={refetch}
            className="px-[16px] py-[8px] bg-[#155eef] text-white rounded-[8px] font-semibold text-[14px]"
          >
            Retry
          </button>
          <Link href="/products" className="px-[16px] py-[8px] border border-[#d5d7da] rounded-[8px] font-semibold text-[14px] text-[#414651]">
            Back to products
          </Link>
        </div>
      </div>
    )
  }

  const websiteUrl = resolvedProduct.product_link || '#'

  return (
    <div className="min-h-screen bg-white pt-[120px] flex flex-col">
      <div className="max-w-[1440px] mx-auto w-full px-[80px] py-[40px] flex flex-col gap-[40px]">
        <ProductHeader
          name={resolvedProduct.product_name}
          description={resolvedProduct.product_description || ''}
          logo={resolvedProduct.product_logo}
          ctaHref={websiteUrl}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'product-information' && (
          <ProductInformationTab
            description={resolvedProduct.product_description || ''}
            sellerName={resolvedProduct.product_name}
            sellerLogo={resolvedProduct.product_logo}
            websiteName={`${resolvedProduct.product_name} Website`}
            websiteUrl={websiteUrl}
            specializations={PLACEHOLDER_SPECIALIZATIONS}
            pricingPlan={
              pricingTiers[0]
                ? {
                    name: pricingTiers[0].name + ' plan',
                    price: pricingTiers[0].price,
                    period: pricingTiers[0].period,
                    description: pricingTiers[0].description,
                  }
                : undefined
            }
            integrations={PLACEHOLDER_INTEGRATIONS}
            media={media.slice(0, 4)}
          />
        )}

        {activeTab === 'integrations' && (
          <IntegrationsTab integrations={[...PLACEHOLDER_INTEGRATIONS, ...PLACEHOLDER_INTEGRATIONS, ...PLACEHOLDER_INTEGRATIONS]} />
        )}

        {activeTab === 'pricing' && (
          <PricingTab tiers={pricingTiers} sections={PLACEHOLDER_PRICING_SECTIONS} />
        )}

        {activeTab === 'reviews' && (
          <ReviewsTab reviews={[PLACEHOLDER_REVIEW]} />
        )}

        {activeTab === 'features' && (
          <section className="px-[32px]">
            <div className="grid gap-[16px]">
              {resolvedProduct.features?.map((f) => (
                <div key={f.name} className="border border-[#e9eaeb] rounded-[12px] p-[20px]">
                  <p className="font-semibold text-[16px] leading-[24px] text-[#181d27] mb-[8px]">{f.name}</p>
                  <ul className="space-y-[6px]">
                    {f.features.map((feat, i) => (
                      <li key={i} className="font-normal text-[14px] leading-[20px] text-[#535862]">
                        • {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )) ?? (
                <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                  Feature details coming soon.
                </p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'vetted-experts' && (
          <section className="px-[32px]">
            <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
              {alternatives.length > 0
                ? `${alternatives.length} alternative products found.`
                : `20 vetted experts available to implement ${resolvedProduct.product_name} for your team.`}
            </p>
          </section>
        )}
      </div>

      <Footer />
    </div>
  )
}