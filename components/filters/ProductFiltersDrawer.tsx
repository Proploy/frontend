'use client'

import { useState } from 'react'
import type { ProductSort } from '@/features/catalog'
import { FilterModal } from './FilterModal'

export interface ProductFilterValues {
  categoryTermId: string
  pricingBucket: string
  freePlan: boolean
  freeTrial: boolean
  sort: ProductSort
}

export const DEFAULT_PRODUCT_FILTERS: ProductFilterValues = {
  categoryTermId: '',
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
    <FilterModal
      title="Product filters"
      onClose={onClose}
      onClear={() =>
        setDraft({
          ...DEFAULT_PRODUCT_FILTERS,
          categoryTermId: draft.categoryTermId,
        })
      }
      onSave={() => {
        onApply(draft)
        onClose()
      }}
    >
      <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2">
        <Field label="Pricing">
          <select
            value={draft.pricingBucket}
            onChange={(event) =>
              setDraft({
                ...draft,
                pricingBucket: event.target.value,
              })
            }
            className={controlClasses}
          >
            <option value="">Any pricing</option>
            <option value="free">Free</option>
            <option value="low">Low</option>
            <option value="mid">Mid-market</option>
            <option value="enterprise">Enterprise</option>
          </select>
        </Field>

        <Field label="Sort by">
          <select
            value={draft.sort}
            onChange={(event) =>
              setDraft({
                ...draft,
                sort: event.target.value as ProductSort,
              })
            }
            className={controlClasses}
          >
            <option value="name">Name</option>
            <option value="rating">Rating</option>
            <option value="market_presence">Market presence</option>
            <option value="created_at">Newest</option>
          </select>
        </Field>

        <div className="flex flex-col gap-3 sm:col-span-2">
          <p className="text-sm font-medium text-[#414651]">
            Plans and trials
          </p>
          <Checkbox
            label="Free plan available"
            checked={draft.freePlan}
            onChange={(freePlan) =>
              setDraft({ ...draft, freePlan })
            }
          />
          <Checkbox
            label="Free trial available"
            checked={draft.freeTrial}
            onChange={(freeTrial) =>
              setDraft({ ...draft, freeTrial })
            }
          />
        </div>
      </div>
    </FilterModal>
  )
}

const controlClasses =
  'h-[50px] w-full rounded-[10px] border border-[#d5d7da] bg-white px-[14px] text-[15px] text-[#181d27] outline-none focus:border-[#155eef]'

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-[6px] text-sm font-medium text-[#414651]">
      {label}
      {children}
    </label>
  )
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2.5 text-sm text-[#414651]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="accent-[#155eef]"
      />
      {label}
    </label>
  )
}
