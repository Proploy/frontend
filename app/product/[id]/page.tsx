'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import Footer from '@/components/Footer'
import ProductHeader, { ProductTabKey } from '@/components/product/ProductHeader'
import ProductInformationTab from '@/components/product/ProductInformationTab'
import IntegrationsTab from '@/components/product/IntegrationsTab'
import PricingTab from '@/components/product/PricingTab'
import ReviewsTab, { ProductReview } from '@/components/product/ReviewsTab'

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
  logo: null as string | null,
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
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ProductTabKey>('product-information')

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${id}`)
        if (response.ok) {
          const result = await response.json()
          if (result?.data) {
            setProduct(result.data)
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  const resolvedProduct: Product = product ?? {
    product_id: id,
    product_name: 'Obsidian',
    product_description:
      'A flexible, local-first note-taking app with plugins, Markdown support, and knowledge graph features. Proploy connects you with vetted implementation experts who roll it out end-to-end for your team.',
    product_logo: null,
    rating: 4.8,
    reviews: 124,
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
              20 vetted experts available to implement {resolvedProduct.product_name} for your team.
            </p>
          </section>
        )}
      </div>

      <Footer />
    </div>
  )
}
