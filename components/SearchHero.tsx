'use client'

import Link from 'next/link'
import { ArrowRight, Search, ChevronDown, MapPin, DollarSign, ListFilter, FilterIcon, X } from 'lucide-react'

const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

interface SearchHeroProps {
  onMoreFilters?: () => void
  onSearch?: (query: string) => void
  initialQuery?: string
  activeLabels?: string[]
  onRemoveLabel?: (label: string) => void
  announcementHref?: string
  announcement?: { tag: string; text: string }
}

export default function SearchHero({
  onMoreFilters,
  onSearch,
  initialQuery = '',
  activeLabels = ['Label'],
  onRemoveLabel,
  announcementHref = '#',
  announcement = { tag: "What's new?", text: 'Fruition Joined!' },
}: SearchHeroProps) {
  return (
    <div className="flex flex-col gap-[48px] items-center w-full font-[family-name:var(--font-dm-sans)]">
      <div className="flex flex-col gap-[24px] items-center max-w-[1024px] w-full">
        <div className="flex flex-col gap-[16px] items-center w-full">
          <Link
            href={announcementHref}
            className="inline-flex items-center gap-[8px] bg-white border border-[#d5d7da] rounded-[10px] pl-[4px] pr-[8px] py-[4px] shadow-[0px_1px_1px_0px_rgba(10,13,18,0.05)]"
          >
            <span className="inline-flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[6px] px-[8px] py-[2px]">
              <span className="size-[6px] rounded-full bg-[#0466e7]" />
              <span className="font-medium text-[14px] leading-[20px] text-[#414651]">
                {announcement.tag}
              </span>
            </span>
            <span className="inline-flex items-center gap-[4px]">
              <span className="font-medium text-[14px] leading-[20px] text-[#414651]">
                {announcement.text}
              </span>
              <ArrowRight size={16} className="text-[#414651]" />
            </span>
          </Link>

          <h1 className="font-semibold text-[60px] leading-[72px] text-[#181d27] text-center tracking-[-1.2px]">
            Find the right product and expert to help streamline your business.
          </h1>
        </div>
        <p className="font-normal text-[20px] leading-[30px] text-[#535862] text-center max-w-[768px]">
          Transform your software procurement today.
        </p>
      </div>

      <div className="flex flex-col gap-[12px] items-start justify-center w-[820px] max-w-full">
        {/* Search bar */}
        <form
          className="flex gap-[16px] items-start w-full"
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            onSearch?.(String(formData.get('query') ?? ''))
          }}
        >
          <div className="flex-1 flex items-center gap-[8px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[12px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
            <input
              type="text"
              key={initialQuery}
              name="query"
              defaultValue={initialQuery}
              placeholder="Search products, industries, and experts"
              className="flex-1 font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none"
            />
          </div>
          <button
            type="submit"
            aria-label="Search"
            className={`relative flex items-center justify-center bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] p-[14px] ${BUTTON_SKEUO_SHADOW}`}
          >
            <Search size={20} className="text-white" />
          </button>
        </form>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-start justify-between gap-y-[12px] w-full">
          <div className="flex gap-[12px] items-start">
            <FilterSelect icon={<ListFilter size={20} className="text-[#717680]" />} label="Any Type" width={200} />
            <FilterSelect icon={<MapPin size={20} className="text-[#717680]" />} label="Any Location" width={200} />
            <FilterSelect icon={<DollarSign size={20} className="text-[#717680]" />} label="Any price" width={168} />
          </div>
          <button
            type="button"
            onClick={onMoreFilters}
            className={`flex items-center gap-[4px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] ${BUTTON_SKEUO_SHADOW}`}
          >
            <FilterIcon size={20} className="text-[#414651]" />
            <span className="px-[2px] font-semibold text-[14px] leading-[20px] text-[#414651]">
              More filters
            </span>
          </button>
        </div>

        {/* Active label chips */}
        {activeLabels.length > 0 && (
          <div className="flex flex-wrap gap-[8px]">
            {activeLabels.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-[3px] bg-white border border-[#d5d7da] rounded-[6px] pl-[10px] pr-[4px] py-[4px]"
              >
                <span className="font-medium text-[14px] leading-[20px] text-[#414651]">
                  {label}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveLabel?.(label)}
                  aria-label={`Remove ${label}`}
                  className="p-[3px] rounded-[3px] hover:bg-gray-50"
                >
                  <X size={14} className="text-[#414651]" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

interface FilterSelectProps {
  icon: React.ReactNode
  label: string
  width: number
}

function FilterSelect({ icon, label, width }: FilterSelectProps) {
  return (
    <button
      type="button"
      style={{ width }}
      className="flex items-center gap-[8px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
    >
      <div className="flex-1 flex items-center gap-[8px] min-w-0">
        {icon}
        <span className="flex-1 font-normal text-[16px] leading-[24px] text-[#717680] text-left truncate">
          {label}
        </span>
      </div>
      <ChevronDown size={20} className="text-[#717680]" />
    </button>
  )
}
