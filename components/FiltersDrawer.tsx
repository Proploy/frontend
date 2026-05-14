'use client'

import { useEffect, useState } from 'react'
import { X, Search, Check } from 'lucide-react'

const BUTTON_SKEUO_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

const CATEGORY_BADGE_STYLES: Record<string, string> = {
  brand: 'bg-[#eff4ff] border-[#b2ccff] text-[#004eeb]',
  blue: 'bg-[#eff8ff] border-[#b2ddff] text-[#175cd3]',
  indigo: 'bg-[#eef4ff] border-[#c7d7fe] text-[#3538cd]',
  pink: 'bg-[#fdf2fa] border-[#fcceee] text-[#c11574]',
  success: 'bg-[#ecfdf3] border-[#abefc6] text-[#067647]',
  grayBlue: 'bg-[#f8f9fc] border-[#d5d9eb] text-[#363f72]',
  blueLight: 'bg-[#f0f9ff] border-[#b9e6fe] text-[#026aa2]',
}

const CATEGORIES: Array<{ label: string; tone: keyof typeof CATEGORY_BADGE_STYLES }> = [
  { label: 'CRM & Sales', tone: 'brand' },
  { label: 'Marketing Automation', tone: 'blue' },
  { label: 'Project Management', tone: 'indigo' },
  { label: 'Analytics & Business Intelligence', tone: 'pink' },
  { label: 'Accounting & Finance', tone: 'success' },
  { label: 'HR & Recruitment', tone: 'grayBlue' },
  { label: 'Customer Support', tone: 'blueLight' },
  { label: 'Collaboration Tools', tone: 'blueLight' },
  { label: 'Security & Compliance', tone: 'blueLight' },
]

const TYPES = ['Business', 'Individual', 'Team']

export interface FilterValues {
  categories: string[]
  location: string
  types: string[]
  priceRange: [number, number]
  yearsRange: [number, number]
}

const DEFAULT_VALUES: FilterValues = {
  categories: [],
  location: '',
  types: [],
  priceRange: [200, 1000],
  yearsRange: [5, 10],
}

interface FiltersDrawerProps {
  open: boolean
  onClose: () => void
  onApply?: (values: FilterValues) => void
  onSaveFilter?: (values: FilterValues) => void
  initialValues?: Partial<FilterValues>
}

export default function FiltersDrawer({
  open,
  onClose,
  onApply,
  onSaveFilter,
  initialValues,
}: FiltersDrawerProps) {
  const [values, setValues] = useState<FilterValues>({ ...DEFAULT_VALUES, ...initialValues })

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  const toggleCategory = (label: string) => {
    setValues((v) => ({
      ...v,
      categories: v.categories.includes(label)
        ? v.categories.filter((c) => c !== label)
        : [...v.categories, label],
    }))
  }

  const toggleType = (label: string) => {
    setValues((v) => ({
      ...v,
      types: v.types.includes(label)
        ? v.types.filter((t) => t !== label)
        : [...v.types, label],
    }))
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/10 flex items-stretch justify-end font-[family-name:var(--font-dm-sans)]"
      onClick={onClose}
    >
      <aside
        className="w-[440px] max-w-full bg-white border-l border-black/[0.08] flex flex-col overflow-y-auto shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03),0px_3px_3px_-1.5px_rgba(10,13,18,0.04)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-[8px] p-[24px] relative">
          <div className="flex-1 flex flex-col gap-[2px]">
            <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Filters</p>
            <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
              Apply filters to table data.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="absolute right-[12px] top-[12px] flex items-center justify-center p-[8px] rounded-[8px] hover:bg-gray-50"
          >
            <X size={20} className="text-[#414651]" />
          </button>
        </div>

        {/* Sections */}
        <div className="flex-1 flex flex-col gap-[24px] px-[24px]">
          {/* Category */}
          <section className="flex flex-col gap-[16px] w-full">
            <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Category</p>
            <div className="flex flex-col gap-[12px] pl-[8px]">
              {CATEGORIES.map((cat) => {
                const checked = values.categories.includes(cat.label)
                return (
                  <label key={cat.label} className="flex items-center gap-[8px] cursor-pointer">
                    <CheckboxControl checked={checked} onChange={() => toggleCategory(cat.label)} />
                    <span
                      className={`inline-flex items-center px-[10px] py-[2px] rounded-full border font-medium text-[14px] leading-[20px] ${CATEGORY_BADGE_STYLES[cat.tone]}`}
                    >
                      {cat.label}
                    </span>
                  </label>
                )
              })}
            </div>
          </section>

          {/* Location */}
          <section className="flex flex-col gap-[16px] w-full">
            <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Location</p>
            <div className="flex items-center gap-[8px] bg-white border border-[#d5d7da] rounded-[8px] px-[12px] py-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]">
              <Search size={20} className="text-[#717680]" />
              <input
                type="text"
                value={values.location}
                onChange={(e) => setValues((v) => ({ ...v, location: e.target.value }))}
                placeholder="Search"
                className="flex-1 font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none"
              />
              <span className="border border-[#e9eaeb] rounded-[4px] px-[4px] py-[1px] font-medium text-[12px] leading-[18px] text-[#717680]">
                ⌘K
              </span>
            </div>
          </section>

          {/* Type */}
          <section className="flex flex-col gap-[16px] w-full">
            <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Type</p>
            <div className="flex flex-col gap-[12px] pl-[8px]">
              {TYPES.map((type) => {
                const checked = values.types.includes(type)
                return (
                  <label key={type} className="flex items-start gap-[8px] cursor-pointer">
                    <div className="pt-[2px]">
                      <CheckboxControl checked={checked} onChange={() => toggleType(type)} />
                    </div>
                    <span className="flex-1 font-medium text-[14px] leading-[20px] text-[#414651]">
                      {type}
                    </span>
                  </label>
                )
              })}
              <button type="button" className="text-left font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline">
                Show 10 more
              </button>
            </div>
          </section>

          {/* Price Range */}
          <section className="flex flex-col gap-[16px] w-full">
            <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Price Range</p>
            <RangeSlider
              min={0}
              max={2000}
              step={50}
              value={values.priceRange}
              onChange={(range) => setValues((v) => ({ ...v, priceRange: range }))}
              formatLabel={(n) => `$${n}`}
            />
          </section>

          {/* Years of Experience */}
          <section className="flex flex-col gap-[16px] w-full pb-[24px]">
            <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">Years of Experience</p>
            <RangeSlider
              min={0}
              max={20}
              step={1}
              value={values.yearsRange}
              onChange={(range) => setValues((v) => ({ ...v, yearsRange: range }))}
              formatLabel={(n) => `${n}`}
            />
          </section>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e9eaeb] bg-white">
          <div className="flex items-center justify-between px-[24px] py-[16px]">
            <button
              type="button"
              onClick={() => onSaveFilter?.(values)}
              className="font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline"
            >
              Save filter
            </button>
            <div className="flex items-center gap-[12px]">
              <button
                type="button"
                onClick={onClose}
                className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO_SHADOW}`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onApply?.(values)}
                className={`bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white ${BUTTON_SKEUO_SHADOW}`}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  )
}

function CheckboxControl({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="checkbox"
      aria-checked={checked}
      className={`flex items-center justify-center size-[16px] rounded-[4px] border ${
        checked ? 'bg-[#155eef] border-[#155eef]' : 'bg-white border-[#d5d7da]'
      }`}
    >
      {checked && <Check size={12} strokeWidth={3} className="text-white" />}
    </button>
  )
}

interface RangeSliderProps {
  min: number
  max: number
  step: number
  value: [number, number]
  onChange: (val: [number, number]) => void
  formatLabel: (n: number) => string
}

function RangeSlider({ min, max, step, value, onChange, formatLabel }: RangeSliderProps) {
  const [lo, hi] = value
  const range = max - min
  const loPct = ((lo - min) / range) * 100
  const hiPct = ((hi - min) / range) * 100

  return (
    <div className="relative h-[56px] w-[320px] max-w-full">
      {/* Track */}
      <div className="absolute left-0 right-0 top-[8px] h-[8px] bg-[#e9eaeb] rounded-full" />
      <div
        className="absolute top-[8px] h-[8px] bg-[#155eef] rounded-full"
        style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
      />
      {/* Native inputs (stacked) */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={lo}
        onChange={(e) => {
          const next = Math.min(Number(e.target.value), hi - step)
          onChange([next, hi])
        }}
        className="absolute left-0 right-0 top-0 h-[24px] w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-[24px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#155eef] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[24px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#155eef] [&::-moz-range-thumb]:bg-white"
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={hi}
        onChange={(e) => {
          const next = Math.max(Number(e.target.value), lo + step)
          onChange([lo, next])
        }}
        className="absolute left-0 right-0 top-0 h-[24px] w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-[24px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#155eef] [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[24px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#155eef] [&::-moz-range-thumb]:bg-white"
      />
      {/* Value labels */}
      <span
        className="absolute top-[34px] -translate-x-1/2 font-medium text-[16px] leading-[24px] text-[#181d27] whitespace-nowrap"
        style={{ left: `${loPct}%` }}
      >
        {formatLabel(lo)}
      </span>
      <span
        className="absolute top-[34px] -translate-x-1/2 font-medium text-[16px] leading-[24px] text-[#181d27] whitespace-nowrap"
        style={{ left: `${hiPct}%` }}
      >
        {formatLabel(hi)}
      </span>
    </div>
  )
}
