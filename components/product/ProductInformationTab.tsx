'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import { ProductMediaVideo } from '@/components/product/ProductMediaVideo'

interface ProductInformationTabProps {
  description: string
  sellerName: string
  sellerLogo?: string | null
  websiteName: string
  websiteUrl: string | null
  specializations: string[]
  pricingPlan?: {
    name: string
    price: string
    period?: string
    description: string
  }
  integrations: Array<{ name: string; logo?: string }>
  media?: Array<{ id: string; url: string; type?: 'image' | 'video'; alt?: string }>
}

export default function ProductInformationTab({
  description,
  sellerName,
  sellerLogo,
  websiteName,
  websiteUrl,
  specializations,
  pricingPlan,
  integrations,
  media = [],
}: ProductInformationTabProps) {
  const [readMore, setReadMore] = useState(false)
  const visibleIntegrations = integrations.slice(0, 18)

  return (
    <section className="flex flex-col gap-[24px] px-[32px] w-full font-[family-name:var(--font-dm-sans)]">
      {/* About + Details */}
      <div className="flex flex-wrap gap-[20px] items-start w-full">
        {/* About */}
        <div className="flex-1 flex flex-col gap-[16px] min-w-[320px] max-w-[760px]">
          <div className={`flex flex-col gap-[8px] ${readMore ? '' : 'max-h-[193px] overflow-hidden'}`}>
            <p className="font-medium text-[16px] leading-[24px] text-[#181d27]">Product Details</p>
            <p className="font-normal text-[16px] leading-[24px] text-[#535862] whitespace-pre-line">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setReadMore((v) => !v)}
            className="self-start font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline"
          >
            {readMore ? 'Read less' : 'Read more'}
          </button>
        </div>

        {/* Details */}
        <div className="w-[436px] max-w-full flex flex-wrap gap-x-[24px] gap-y-[24px] items-start">
          <LabelText label="Seller">
            <div className="flex items-center gap-[8px]">
              {sellerLogo ? (
                <CatalogImage
                  src={sellerLogo}
                  alt={sellerName}
                  className="size-[20px] rounded object-contain"
                  fallback={<span className="flex size-[20px] items-center justify-center rounded bg-[#155eef] text-[10px] font-bold text-white">{sellerName.charAt(0)}</span>}
                />
              ) : (
                <div className="size-[20px] rounded bg-[#155eef] text-white text-[10px] font-bold flex items-center justify-center">
                  {sellerName.charAt(0)}
                </div>
              )}
              <span className="font-normal text-[16px] leading-[24px] text-[#181d27]">{sellerName}</span>
            </div>
          </LabelText>

          <LabelText label="Product Website" className="flex-1 min-w-[200px]">
            {websiteUrl ? (
              <a
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[4px] font-semibold text-[16px] leading-[24px] text-[#004eeb] hover:underline"
              >
                {websiteName}
                <ArrowUpRight size={16} />
              </a>
            ) : (
              <span className="font-normal text-[16px] leading-[24px] text-[#535862]">
                Not provided
              </span>
            )}
          </LabelText>

          <LabelText label="Specialization" className="w-full">
            <div className="flex flex-wrap gap-[8px]">
              {specializations.map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="inline-flex items-center gap-[6px] bg-[#eff4ff] border border-[#b2ccff] rounded-full px-[10px] py-[2px] font-medium text-[14px] leading-[20px] text-[#004eeb]"
                >
                  <span className="size-[6px] rounded-full bg-[#004eeb]" />
                  {tag}
                </span>
              ))}
            </div>
          </LabelText>
        </div>
      </div>

      <div className="h-px w-full bg-[#e9eaeb]" />

      {/* Pricing + Integrations preview */}
      <div className="flex flex-wrap gap-[20px] items-start w-full">
        {/* Pricing card */}
        <div className="flex flex-col gap-[16px] w-[343px]">
          <div className="flex items-center gap-[8px]">
            <p className="font-medium text-[16px] leading-[24px] text-[#181d27]">Pricing</p>
            <button type="button" className="inline-flex items-center gap-[4px] ml-auto font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline">
              Learn More <ArrowUpRight size={14} />
            </button>
          </div>
          {pricingPlan && (
            <div className="flex flex-col gap-[8px] bg-white border border-[#e9eaeb] rounded-[16px] p-[20px]">
              <p className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{pricingPlan.name}</p>
              <div className="flex items-end gap-[6px]">
                <span className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
                  {pricingPlan.price}
                </span>
                {pricingPlan.period && (
                  <span className="font-normal text-[14px] leading-[20px] text-[#535862] pb-[8px]">
                    {pricingPlan.period}
                  </span>
                )}
              </div>
              <p className="font-normal text-[14px] leading-[20px] text-[#535862]">{pricingPlan.description}</p>
            </div>
          )}
        </div>

        {/* Integrations grid (6×3) */}
        <div className="flex-1 flex flex-col gap-[16px] min-w-[400px]">
          <div className="flex items-center gap-[8px]">
            <p className="font-medium text-[16px] leading-[24px] text-[#181d27]">Integrations</p>
            <button type="button" className="inline-flex items-center gap-[4px] ml-auto font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline">
              Learn More <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-[12px]">
            {visibleIntegrations.map((integration, i) => (
              <div
                key={integration.id ?? integration.name}
                className="flex items-center gap-[6px] border border-[#e9eaeb] rounded-[8px] px-[8px] py-[6px]"
              >
                <div className="size-[22px] rounded bg-[#155eef]/10 flex items-center justify-center text-[#155eef] text-[10px] font-bold">
                  {integration.logo ? (
                    <CatalogImage
                      src={integration.logo}
                      alt={integration.name}
                      className="size-[18px] object-contain"
                      fallback={integration.name.charAt(0)}
                    />
                  ) : (
                    integration.name.charAt(0)
                  )}
                </div>
                <span className="font-medium text-[12px] leading-[18px] text-[#414651] truncate">
                  {integration.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-px w-full bg-[#e9eaeb]" />

      {/* Media */}
      <div className="flex flex-col gap-[16px] w-full">
        <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Media</p>
        {media.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[24px]">
            {media.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="aspect-[286/184] rounded-[12px] overflow-hidden bg-[#e9eaeb] flex items-center justify-center"
              >
                {item.type === 'video' ? (
                  <ProductMediaVideo
                    src={item.url}
                    title={item.alt || 'Product video'}
                    className="object-cover"
                    autoPlay
                    muted
                    loop
                    controls={false}
                  />
                ) : (
                  <CatalogImage
                    src={item.url}
                    alt={item.alt ?? ''}
                    className="size-full object-cover"
                    fallback={<span className="px-[12px] text-center text-[13px] font-medium text-[#717680]">Media unavailable</span>}
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[12px] border border-dashed border-[#d5d7da] bg-[#fafafa] px-[24px] py-[40px] text-center">
            <p className="text-[14px] font-medium leading-[20px] text-[#717680]">
              No product media has been published yet.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

function LabelText({
  label,
  children,
  className = '',
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-[8px] ${className}`}>
      <p className="font-medium text-[14px] leading-[20px] text-[#181d27]">{label}</p>
      {children}
    </div>
  )
}
