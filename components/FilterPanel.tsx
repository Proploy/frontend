'use client'

import React, { useState, useEffect } from 'react'
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion'
import { X, Search } from 'lucide-react'
import Button from '@/components/ui/Button'
import Checkbox from '@/components/ui/Checkbox'
import Slider from '@/components/ui/Slider'

interface FilterPanelProps {
  isOpen: boolean
  onClose: () => void
}

const categoryOptions = [
  { label: 'CRM & Sales', bg: 'bg-[#f2f4f7]', text: 'text-[#344054]', border: 'border-[#d0d5dd]' },
  { label: 'Marketing Automation', bg: 'bg-[#eff8ff]', text: 'text-[#175cd3]', border: 'border-[#b2ddff]' },
  { label: 'Project Management', bg: 'bg-[#eff8ff]', text: 'text-[#175cd3]', border: 'border-[#b2ddff]' },
  { label: 'Analytics & Business Intelligence', bg: 'bg-[#eef4ff]', text: 'text-[#3538cd]', border: 'border-[#c7d7fe]' },
  { label: 'Accounting & Finance', bg: 'bg-[#f0f9ff]', text: 'text-[#026aa2]', border: 'border-[#b9e6fe]' },
  { label: 'HR & Recruitment', bg: 'bg-[#f2f4f7]', text: 'text-[#344054]', border: 'border-[#d0d5dd]' },
  { label: 'Customer Support', bg: 'bg-[#ecfdf3]', text: 'text-[#067647]', border: 'border-[#abefc6]' },
  { label: 'Collaboration Tools', bg: 'bg-[#eff8ff]', text: 'text-[#175cd3]', border: 'border-[#b2ddff]' },
  { label: 'Security & Compliance', bg: 'bg-[#eef4ff]', text: 'text-[#3538cd]', border: 'border-[#c7d7fe]' },
]

const typeOptions = ['Business', 'Individual', 'Team']

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const [categoryChecked, setCategoryChecked] = useState<Record<string, boolean>>({})
  const [typeChecked, setTypeChecked] = useState<Record<string, boolean>>({})
  const [priceRange, setPriceRange] = useState<[number, number]>([200, 1000])
  const [experienceRange, setExperienceRange] = useState<[number, number]>([5, 10])
  const [locationSearch, setLocationSearch] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {isOpen && (
        <>
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={onClose}
          />

          {/* Panel */}
          <m.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[320px] bg-white z-[70] flex flex-col shadow-[0px_8px_8px_-4px_rgba(10,13,18,0.03),0px_20px_24px_-4px_rgba(10,13,18,0.08)]"
          >
            {/* Header */}
            <div className="px-[24px] pt-[24px] pb-[20px] flex items-start justify-between shrink-0">
              <div className="flex flex-col gap-[4px]">
                <h2 className="font-[family-name:var(--font-dm-sans)] font-semibold text-[18px] leading-[28px] text-[#181d27]">
                  Filters
                </h2>
                <p
                  className="font-[family-name:var(--font-dm-sans)] font-normal text-[14px] leading-[20px] text-[#535862]"
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  Apply filters to table data.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close filters"
                onClick={onClose}
                className="size-[36px] flex items-center justify-center text-[#535862] hover:text-[#181d27] hover:bg-[#fafafa] rounded-[8px] transition-colors cursor-pointer shrink-0"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-[24px] pb-[24px]">
              {/* Category */}
              <div className="flex flex-col gap-[16px]">
                <span className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#414651]">
                  Category
                </span>
                <div className="flex flex-col gap-[12px]">
                  {categoryOptions.map((cat) => (
                    <div key={cat.label} className="flex items-center gap-[8px]">
                      <Checkbox
                        checked={!!categoryChecked[cat.label]}
                        onChange={(checked) =>
                          setCategoryChecked((prev) => ({ ...prev, [cat.label]: checked }))
                        }
                        size="sm"
                      />
                      <span
                        className={`inline-flex items-center px-[8px] py-[2px] rounded-full border font-[family-name:var(--font-dm-sans)] font-medium text-[14px] leading-[20px] ${cat.bg} ${cat.text} ${cat.border}`}
                        style={{ fontVariationSettings: "'opsz' 14" }}
                      >
                        {cat.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-[16px] mt-[24px]">
                <span className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#414651]">
                  Location
                </span>
                <div className="bg-white border border-[#d5d7da] rounded-[8px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] flex items-center gap-[8px] px-[14px] py-[10px] focus-within:border-[#2970ff] focus-within:ring-1 focus-within:ring-[#2970ff] transition-colors">
                  <Search size={20} className="text-[#535862] shrink-0" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="flex-1 font-[family-name:var(--font-dm-sans)] font-normal text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] bg-transparent outline-none min-w-0"
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  />
                  <kbd className="shrink-0 font-[family-name:var(--font-dm-sans)] text-[12px] leading-[18px] font-medium text-[#535862]">
                    ⌘K
                  </kbd>
                </div>
              </div>

              {/* Type */}
              <div className="flex flex-col gap-[16px] mt-[24px]">
                <span className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#414651]">
                  Type
                </span>
                <div className="flex flex-col gap-[12px]">
                  {typeOptions.map((type) => (
                    <Checkbox
                      key={type}
                      checked={!!typeChecked[type]}
                      onChange={(checked) =>
                        setTypeChecked((prev) => ({ ...prev, [type]: checked }))
                      }
                      size="sm"
                      label={type}
                    />
                  ))}
                </div>
                <button type="button" className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#004eeb] text-left hover:underline cursor-pointer">
                  Show 10 more
                </button>
              </div>

              {/* Price Range */}
              <div className="flex flex-col gap-[16px] mt-[24px]">
                <span className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#414651]">
                  Price Range
                </span>
                <Slider
                  min={0}
                  max={2000}
                  step={50}
                  value={priceRange}
                  onChange={setPriceRange}
                  labelPosition="bottom"
                  formatLabel={(v) => `$${v}`}
                />
              </div>

              {/* Years of Experience */}
              <div className="flex flex-col gap-[16px] mt-[24px]">
                <span className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#414651]">
                  Years of Experience
                </span>
                <Slider
                  min={0}
                  max={20}
                  step={1}
                  value={experienceRange}
                  onChange={setExperienceRange}
                  labelPosition="bottom"
                  formatLabel={(v) => `${v}`}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-[24px] py-[16px] border-t border-[#e9eaeb] flex items-center justify-between shrink-0">
              <button type="button" className="font-[family-name:var(--font-dm-sans)] font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline cursor-pointer">
                Save filter
              </button>
              <div className="flex items-center gap-[12px]">
                <Button variant="secondary" size="md" onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" onClick={onClose}>
                  Apply
                </Button>
              </div>
            </div>
          </m.div>
        </>
      )}
    </AnimatePresence>
    </LazyMotion>
  )
}
