'use client'

import Image from 'next/image'
import { MoreHorizontal } from 'lucide-react'
import { PRODUCT_TABS } from './product-tabs'
import type { ProductTabKey } from './product-tabs'

const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

interface ProductHeaderProps {
  name: string
  description: string
  logo?: string | null
  ctaLabel?: string
  ctaHref?: string
  activeTab: ProductTabKey
  onTabChange: (tab: ProductTabKey) => void
}

export default function ProductHeader({
  name,
  description,
  logo,
  ctaLabel = 'Try for Free',
  ctaHref = '#',
  activeTab,
  onTabChange,
}: ProductHeaderProps) {
  return (
    <div className="flex flex-col items-center w-full font-[family-name:var(--font-dm-sans)]">
      <div className="flex flex-col gap-[24px] items-start px-[32px] w-full">
        <div className="flex items-center gap-[20px] w-full">
          {/* Logo */}
          <div className="relative size-[160px] shrink-0">
            <div className="absolute inset-0 bg-white border border-black/[0.08] rounded-[20px] p-[6px] flex items-center justify-center">
              <div className="flex-1 h-full border border-black/[0.08] rounded-[20px] drop-shadow-[0px_24px_48px_rgba(10,13,18,0.18)] overflow-hidden flex items-center justify-center bg-white">
                {logo ? (
                  <Image src={logo} alt={name} width={148} height={148} className="size-full object-contain p-[12px]" />
                ) : null}
              </div>
            </div>
          </div>

          {/* Content + tabs */}
          <div className="flex-1 flex flex-col gap-[20px] min-w-0">
            <div className="flex flex-wrap items-start gap-[16px] w-full">
              <div className="flex-1 flex flex-col gap-[4px] min-w-[240px]">
                <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">{name}</h1>
                <p className="font-normal text-[16px] leading-[24px] text-[#535862]">{description}</p>
              </div>
              <div className="flex items-center gap-[12px]">
                <button
                  type="button"
                  aria-label="More actions"
                  className={`relative flex items-center justify-center bg-white border border-[#d5d7da] rounded-[8px] p-[10px] ${BUTTON_SKEUO_SHADOW}`}
                >
                  <MoreHorizontal size={20} className="text-[#414651]" />
                </button>
                <a
                  href={ctaHref}
                  target={ctaHref.startsWith('http') ? '_blank' : undefined}
                  rel={ctaHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`relative flex items-center justify-center bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white ${BUTTON_SKEUO_SHADOW}`}
                >
                  {ctaLabel}
                </a>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-[4px] p-[4px] bg-[#fafafa] border border-[#e9eaeb] rounded-[10px] w-full overflow-x-auto">
              {PRODUCT_TABS.map((tab) => {
                const active = tab.key === activeTab
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => onTabChange(tab.key)}
                    className={`flex items-center gap-[8px] h-[36px] px-[12px] py-[8px] rounded-[6px] whitespace-nowrap font-semibold text-[14px] leading-[20px] transition-colors ${
                      active
                        ? 'bg-white text-[#414651] shadow-[0px_1px_3px_0px_rgba(10,13,18,0.1),0px_1px_2px_-1px_rgba(10,13,18,0.1)]'
                        : 'text-[#717680] hover:text-[#414651]'
                    }`}
                  >
                    {tab.label}
                    {tab.badge && (
                      <span className="inline-flex items-center bg-[#fafafa] border border-[#e9eaeb] rounded-full px-[8px] py-[2px] font-medium text-[12px] leading-[18px] text-[#414651]">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
