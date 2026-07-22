'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, DollarSign, ListFilter, FilterIcon, X } from 'lucide-react'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import { getProductDetailHref, useKeywordSearch } from '@/features/catalog'

const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

interface SearchHeroProps {
  kind?: 'products' | 'experts'
  onMoreFilters?: () => void
  onSearch?: (query: string) => void
  initialQuery?: string
  activeLabels?: string[]
  onRemoveLabel?: (label: string) => void
}

export default function SearchHero({
  kind = 'products',
  onMoreFilters,
  onSearch,
  initialQuery = '',
  activeLabels = ['Label'],
  onRemoveLabel,
}: SearchHeroProps) {
  const [query, setQuery] = useState(initialQuery)
  const [resultsOpen, setResultsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { products, loading, error, search, clear } = useKeywordSearch()

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    if (kind !== 'products') return
    if (query.trim().length > 1) {
      void search(query, 6)
    } else {
      clear()
    }
  }, [clear, kind, query, search])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setResultsOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  const quickFilters = kind === 'products'
    ? [
        { icon: <ListFilter size={20} className="text-[#717680]" />, label: 'Any category', width: 200 },
        { icon: <DollarSign size={20} className="text-[#717680]" />, label: 'Any pricing', width: 200 },
        { icon: <FilterIcon size={20} className="text-[#717680]" />, label: 'Plans & trials', width: 168 },
      ]
    : [
        { icon: <ListFilter size={20} className="text-[#717680]" />, label: 'Any expert type', width: 200 },
        { icon: <MapPin size={20} className="text-[#717680]" />, label: 'Any location', width: 200 },
        { icon: <FilterIcon size={20} className="text-[#717680]" />, label: 'Any experience', width: 168 },
      ]

  return (
    <div className="flex flex-col gap-[48px] items-center w-full font-[family-name:var(--font-dm-sans)]">
      <div className="flex flex-col gap-[24px] items-center max-w-[1024px] w-full">
        <div className="flex flex-col items-center w-full">
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
            onSearch?.(query)
          }}
        >
          <div ref={searchRef} className="relative flex-1">
            <div className="flex items-center gap-[8px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[12px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
            <input
              type="text"
              name="query"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setResultsOpen(true)
              }}
              onFocus={() => {
                if (query.trim().length > 1) setResultsOpen(true)
              }}
              placeholder="Search products, industries, and experts"
              className="flex-1 font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none"
            />
            </div>
            {kind === 'products' && resultsOpen && query.trim().length > 1 && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 overflow-hidden rounded-[14px] border border-[#e9eaeb] bg-white shadow-[0_24px_48px_-12px_rgba(10,13,18,0.18)]">
                {loading ? (
                  <p className="px-[16px] py-[14px] text-center text-[13px] text-[#717680]">Searching products...</p>
                ) : error ? (
                  <p className="px-[16px] py-[14px] text-center text-[13px] text-[#b42318]">Unable to search products.</p>
                ) : products.length > 0 ? (
                  <div className="py-[6px]">
                    {products.map((product) => (
                      <Link
                        key={product.product_id}
                        href={getProductDetailHref(product.product_id)}
                        onClick={() => setResultsOpen(false)}
                        className="flex items-center gap-[12px] px-[14px] py-[10px] text-left transition-colors hover:bg-[#f5f8ff]"
                      >
                        <div className="flex size-[40px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-[#e9eaeb] bg-white">
                          {product.product_logo ? (
                            <CatalogImage
                              src={product.product_logo}
                              alt=""
                              className="size-full object-contain p-[4px]"
                              fallback={<span className="text-[14px] font-bold text-[#155eef]">{product.product_name.charAt(0)}</span>}
                            />
                          ) : (
                            <span className="text-[14px] font-bold text-[#155eef]">{product.product_name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{product.product_name}</p>
                          <p className="truncate text-[12px] leading-[18px] text-[#717680]">
                            {product.primary_category ?? 'Software product'}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <button
                      type="submit"
                      className="w-full border-t border-[#e9eaeb] px-[14px] py-[11px] text-center text-[13px] font-semibold text-[#004eeb] hover:bg-[#f5f8ff]"
                    >
                      View all results for &quot;{query}&quot;
                    </button>
                  </div>
                ) : (
                  <p className="px-[16px] py-[14px] text-center text-[13px] text-[#717680]">No products found.</p>
                )}
              </div>
            )}
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
            {quickFilters.map((filter) => (
              <FilterSelect
                key={filter.label}
                icon={filter.icon}
                label={filter.label}
                width={filter.width}
                onClick={onMoreFilters}
              />
            ))}
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
  onClick?: () => void
}

function FilterSelect({ icon, label, width, onClick }: FilterSelectProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width }}
      className="flex items-center gap-[8px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
    >
      <div className="flex-1 flex items-center gap-[8px] min-w-0">
        {icon}
        <span className="flex-1 font-normal text-[16px] leading-[24px] text-[#717680] text-left truncate">
          {label}
        </span>
      </div>
    </button>
  )
}
