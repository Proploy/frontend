'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { ProductSort } from '@/features/catalog'

export interface ProductFilterValues {
  pricingBucket: string
  freePlan: boolean
  freeTrial: boolean
  sort: ProductSort
}

export const DEFAULT_PRODUCT_FILTERS: ProductFilterValues = {
  pricingBucket: '',
  freePlan: false,
  freeTrial: false,
  sort: 'name',
}

export function ProductFiltersDrawer({
  open,
  values,
  onClose,
  onApply,
}: {
  open: boolean
  values: ProductFilterValues
  onClose: () => void
  onApply: (values: ProductFilterValues) => void
}) {
  const [draft, setDraft] = useState(values)
  if (!open) return null

  return (
    <Drawer title="Product filters" onClose={onClose}>
      <Field label="Pricing">
        <select
          value={draft.pricingBucket}
          onChange={(event) => setDraft({ ...draft, pricingBucket: event.target.value })}
          className="w-full rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px]"
        >
          <option value="">Any pricing</option>
          <option value="free">Free</option>
          <option value="low">Low</option>
          <option value="mid">Mid-market</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </Field>
      <Checkbox
        label="Free plan available"
        checked={draft.freePlan}
        onChange={(freePlan) => setDraft({ ...draft, freePlan })}
      />
      <Checkbox
        label="Free trial available"
        checked={draft.freeTrial}
        onChange={(freeTrial) => setDraft({ ...draft, freeTrial })}
      />
      <Field label="Sort by">
        <select
          value={draft.sort}
          onChange={(event) => setDraft({ ...draft, sort: event.target.value as ProductSort })}
          className="w-full rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px]"
        >
          <option value="name">Name</option>
          <option value="rating">Rating</option>
          <option value="market_presence">Market presence</option>
          <option value="created_at">Newest</option>
        </select>
      </Field>
      <DrawerActions
        onReset={() => setDraft(DEFAULT_PRODUCT_FILTERS)}
        onApply={() => {
          onApply(draft)
          onClose()
        }}
      />
    </Drawer>
  )
}

function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/20" onClick={onClose}>
      <aside className="flex h-full w-[420px] max-w-full flex-col gap-[24px] overflow-y-auto bg-white p-[24px]" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold text-[#181d27]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close filters"><X size={20} /></button>
        </div>
        {children}
      </aside>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="flex flex-col gap-[6px] text-[14px] font-medium text-[#414651]">{label}{children}</label>
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <label className="flex items-center gap-[10px] text-[14px] text-[#414651]"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</label>
}

function DrawerActions({ onReset, onApply }: { onReset: () => void; onApply: () => void }) {
  return <div className="mt-auto flex justify-between border-t border-[#e9eaeb] pt-[20px]"><button type="button" onClick={onReset} className="font-semibold text-[#004eeb]">Reset</button><button type="button" onClick={onApply} className="rounded-[8px] bg-[#155eef] px-[16px] py-[10px] font-semibold text-white">Apply filters</button></div>
}
