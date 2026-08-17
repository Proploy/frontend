'use client'

import { Check, Minus, HelpCircle } from 'lucide-react'

interface PlanTier {
  name: string
  price: string
  period?: string
  description: string
  popular?: boolean
}

interface FeatureValue {
  type: 'bool' | 'text'
  value: boolean | string
}

interface FeatureRow {
  label: any
  name: string
  values: FeatureValue[]
  helper?: string
}

interface FeatureSection {
  title: string
  rows: FeatureRow[]
}

interface PricingTabProps {
  tiers: PlanTier[]
  sections: FeatureSection[]
}

export default function PricingTab({ tiers, sections }: PricingTabProps) {
  return (
    <section className="flex flex-col gap-[16px] px-[32px] w-full font-[family-name:var(--font-dm-sans)]">
      {/* Tier header row */}
      <div
        className="grid items-end gap-x-[16px] pb-[16px] border-b border-[#e9eaeb]"
        style={{ gridTemplateColumns: `minmax(220px, 1fr) repeat(${tiers.length}, minmax(0, 1fr))` }}
      >
        <div />
        {tiers.map((tier, i) => (
          <div key={`${tier.name}-${i}`} className="flex flex-col items-center gap-[8px] text-center">
            <div className="flex items-center gap-[6px]">
              <span className="font-semibold text-[18px] leading-[28px] text-[#181d27]">{tier.name}</span>
              {tier.popular && (
                <span className="inline-flex items-center bg-[#eff4ff] border border-[#b2ccff] rounded-full px-[10px] py-[2px] font-medium text-[12px] leading-[18px] text-[#004eeb]">
                  Popular
                </span>
              )}
            </div>
            <div className="flex items-end gap-[4px]">
              <span className="font-semibold text-[36px] leading-[44px] text-[#181d27] tracking-[-0.72px]">
                {tier.price}
              </span>
              {tier.period && (
                <span className="font-normal text-[14px] leading-[20px] text-[#535862] pb-[8px]">
                  {tier.period}
                </span>
              )}
            </div>
            <p className="font-normal text-[14px] leading-[20px] text-[#535862] max-w-[220px]">
              {tier.description}
            </p>
          </div>
        ))}
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.title} className="flex flex-col">
          <p className="font-semibold text-[14px] leading-[20px] text-[#004eeb] py-[12px]">
            {section.title}
          </p>
          {section.rows.map((row, idx) => (
            <div
              key={row.name}
              className={`grid items-center gap-x-[16px] py-[12px] ${idx % 2 === 0 ? 'bg-[#fafafa]' : ''
                } rounded-[6px]`}
              style={{ gridTemplateColumns: `minmax(220px, 1fr) repeat(${tiers.length}, minmax(0, 1fr))` }}
            >
              <div className="flex items-center gap-[6px] pl-[12px]">
                <span className="font-normal text-[14px] leading-[20px] text-[#414651]">{row.name}</span>
                {row.helper && (
                  <HelpCircle size={14} className="text-[#717680]" aria-label={row.helper} />
                )}
              </div>
              {row.values.map((v, i) => (
                <div key={`${row.label}-col-${i}`} className="flex items-center justify-center">
                  {v.type === 'bool' ? (
                    v.value ? (
                      <span className="size-[24px] rounded-full bg-[#dcfae6] flex items-center justify-center">
                        <Check size={14} className="text-[#079455]" strokeWidth={3} />
                      </span>
                    ) : (
                      <Minus size={16} className="text-[#717680]" />
                    )
                  ) : (
                    <span className="font-normal text-[14px] leading-[20px] text-[#414651] text-center">
                      {v.value as string}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </section>
  )
}
