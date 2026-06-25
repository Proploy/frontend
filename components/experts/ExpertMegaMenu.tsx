'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useProductList } from '@/features/catalog'

interface ExpertMegaMenuProps {
  mobile?: boolean
  onNavigate?: () => void
}

const projectTypeOptions = [
  'Implementation',
  'Migration',
  'Integration',
  'Customization',
  'Consulting',
  'Training',
  'Support & maintenance',
  'Audit & optimization',
]

const industryOptions = [
  'Technology',
  'Finance & Banking',
  'Healthcare',
  'Education',
  'Retail & E-commerce',
  'Manufacturing',
  'Consulting',
]

const regionOptions = [
  'North America',
  'South America',
  'Europe',
  'Middle East',
  'Africa',
  'Central Asia',
  'South Asia',
  'Southeast Asia',
  'East Asia',
  'Oceania',
]

type ExpertSection = {
  title: string
  param: 'projectType' | 'platform' | 'industry' | 'location'
  items: string[]
}

function expertsHref(param: ExpertSection['param'], value: string) {
  return `/experts?${param}=${encodeURIComponent(value)}`
}

export default function ExpertMegaMenu({ mobile = false, onNavigate }: ExpertMegaMenuProps) {
  const { products } = useProductList({ limit: 6, sort: 'name' })
  const platformOptions = useMemo(
    () => products.map((product) => product.product_name),
    [products],
  )
  const expertSections: ExpertSection[] = [
    { title: 'Expertise', param: 'projectType', items: projectTypeOptions },
    { title: 'Platforms', param: 'platform', items: platformOptions.length ? platformOptions : ['monday.com', 'Asana', 'HubSpot', 'Salesforce', 'NetSuite', 'Zapier'] },
    { title: 'Industries', param: 'industry', items: industryOptions },
    { title: 'Regions', param: 'location', items: regionOptions },
  ]

  if (mobile) {
    return (
      <div className="flex flex-col gap-[12px]">
        {expertSections.map((section) => (
          <div key={section.title} className="rounded-[10px] border border-[#e9eaeb] bg-white p-[12px]">
            <p className="mb-[8px] text-[13px] font-semibold text-[#717680]">{section.title}</p>
            <div className="flex flex-col gap-[2px]">
              {section.items.map((item) => (
                <Link
                  key={item}
                  href={expertsHref(section.param, item)}
                  onClick={onNavigate}
                  className="rounded-[8px] px-[8px] py-[8px] text-[14px] font-medium text-[#414651] hover:bg-[#f5f8ff] hover:text-[#004eeb]"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid w-full grid-cols-4 gap-[14px] overflow-hidden rounded-[18px] border border-[#e9eaeb] bg-white p-[18px] shadow-[0_24px_48px_-12px_rgba(10,13,18,0.2)]">
      {expertSections.map((section) => (
        <div key={section.title} className="min-w-0 rounded-[12px] bg-[#f7f9fc] p-[12px]">
          <p className="mb-[8px] text-[13px] font-semibold leading-[18px] text-[#717680]">{section.title}</p>
          <div className="flex flex-col gap-[4px]">
            {section.items.map((item) => (
              <Link
                key={item}
                href={expertsHref(section.param, item)}
                onClick={onNavigate}
                className="block rounded-[9px] bg-white px-[10px] py-[9px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#f5f8ff] hover:text-[#004eeb]"
              >
                <span className="truncate">{item}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
