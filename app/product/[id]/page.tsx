'use client'

import { useState } from 'react'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import Footer from '@/components/Footer'
import { InlineVideo } from '@/components/media/InlineVideo'
import ProductHeader from '@/components/product/ProductHeader'
import { ProductTabKey } from '@/components/product/product-tabs'
import ProductInformationTab from '@/components/product/ProductInformationTab'
import IntegrationsTab from '@/components/product/IntegrationsTab'
import PricingTab from '@/components/product/PricingTab'
import { mapMediaAssetsToPreview, useProductDetail } from '@/features/catalog'

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
  } = useProductDetail({ productId: id })

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full size-12 border-b-2 border-[#0466e7]" />
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

  if (!product) {
    return null
  }

  const media = mapMediaAssetsToPreview(product.media)

  return (
    <div className="min-h-screen bg-white pt-[120px] flex flex-col">
      <div className="max-w-[1440px] mx-auto w-full px-[80px] py-[40px] flex flex-col gap-[40px]">
        <ProductHeader
          name={product.product_name}
          description={product.short_description || ''}
          logo={product.product_logo}
          ctaHref={product.official_website}
          product={product}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'product-information' && (
          <ProductInformationTab
            description={product.short_description || ''}
            sellerName={product.product_name}
            sellerLogo={product.product_logo}
            websiteName={`${product.product_name} Website`}
            websiteUrl={product.official_website}
            specializations={product.core_features.length > 0 ? product.core_features : []}
            pricingPlan={
              product.pricing_plans[0]
                ? {
                    name: product.pricing_plans[0].plan_name,
                    price: product.pricing_plans[0].price_text || '',
                    period: product.pricing_plans[0].billing_period || 'per month',
                    description: product.pricing_plans[0].features[0]?.value || '',
                  }
                : undefined
            }
            integrations={product.integration_labels.map(label => ({ name: label, description: '', logo: undefined }))}
            media={media.slice(0, 4)}
          />
        )}

        {activeTab === 'integrations' && (
          <IntegrationsTab integrations={product.integration_labels.map((label, i) => ({
            name: label,
            description: '',
            logo: undefined,
            _idx: i,
          }))} />
        )}

        {activeTab === 'pricing' && (
          <PricingTab
            tiers={product.pricing_plans.map((p, i) => ({
              name: p.plan_name,
              price: p.price_text || '',
              period: p.billing_period || 'per month',
              description: p.features[0]?.value || '',
              popular: i === 0 && p.is_free === false,
            }))}
            sections={[]}
          />
        )}

        {activeTab === 'reviews' && (
          <section className="px-[32px] flex flex-col gap-[24px]">
            {product.ratings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                {product.ratings.map((rating) => (
                  <div
                    key={`${rating.source_kind}-${rating.source_name}`}
                    className="border border-[#e9eaeb] rounded-[12px] p-[20px]"
                  >
                    <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">
                      {rating.source_name}
                    </p>
                    <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                      {rating.avg_rating ?? 'No rating'} · {rating.total_reviews ?? 0} reviews
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col items-center justify-center py-[48px] text-center">
              <p className="font-normal text-[16px] leading-[24px] text-[#535862] max-w-[480px]">
                Written reviews are not currently available.
              </p>
            </div>
          </section>
        )}

        {activeTab === 'features' && (
          <section className="px-[32px]">
            <div className="grid gap-[16px]">
              {product.core_features.length > 0 ? (
                <>
                  <div className="border border-[#e9eaeb] rounded-[12px] p-[20px]">
                    <p className="font-semibold text-[16px] leading-[24px] text-[#181d27] mb-[8px]">Core Features</p>
                    <ul className="space-y-[6px]">
                      {product.core_features.map((feat) => (
                        <li key={feat} className="font-normal text-[14px] leading-[20px] text-[#535862]">
                          • {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {product.integration_labels.length > 0 && (
                    <div className="border border-[#e9eaeb] rounded-[12px] p-[20px]">
                      <p className="font-semibold text-[16px] leading-[24px] text-[#181d27] mb-[8px]">Integrations</p>
                      <ul className="space-y-[6px]">
                        {product.integration_labels.map((label) => (
                          <li key={label} className="font-normal text-[14px] leading-[20px] text-[#535862]">
                            • {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {product.compliance_labels.length > 0 && (
                    <div className="border border-[#e9eaeb] rounded-[12px] p-[20px]">
                      <p className="font-semibold text-[16px] leading-[24px] text-[#181d27] mb-[8px]">Compliance</p>
                      <ul className="space-y-[6px]">
                        {product.compliance_labels.map((label) => (
                          <li key={label} className="font-normal text-[14px] leading-[20px] text-[#535862]">
                            • {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                  Feature details coming soon.
                </p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'media' && (
          <section className="px-[32px]">
            {media.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[16px]">
                {media.map((item) => (
                  <div key={item.id} className="relative aspect-video rounded-[12px] overflow-hidden border border-[#e9eaeb]">
                    {item.type === 'video' ? (
                      <InlineVideo
                        url={item.url}
                        title={item.alt || `${product.product_name} video`}
                        mode="direct"
                      />
                    ) : (
                      <CatalogImage
                        src={item.url}
                        alt={item.alt}
                        className="size-full object-cover"
                        fallback={<span className="flex size-full items-center justify-center bg-[#fafafa] px-[16px] text-center text-[14px] font-medium text-[#717680]">Media unavailable</span>}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-[64px] text-center">
                <p className="font-normal text-[16px] leading-[24px] text-[#535862]">No media assets available.</p>
              </div>
            )}
          </section>
        )}
      </div>

      <Footer />
    </div>
  )
}
