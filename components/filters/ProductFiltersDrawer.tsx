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
  companySize: string[]
  deploymentModel: string[]
  compliance: string[]
}

export const DEFAULT_PRODUCT_FILTERS: ProductFilterValues = {
  categoryTermId: '',
  pricingBucket: '',
  freePlan: false,
  freeTrial: false,
  sort: 'name',
  companySize: [],
  deploymentModel: [],
  compliance: [],
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
            <option value="freemium">Freemium</option>
            <option value="paid_tier_1">Paid (Tier 1)</option>
            <option value="paid_tier_2">Paid (Tier 2)</option>
            <option value="paid_tier_3">Paid (Tier 3)</option>
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

        <Field label="Company size">
          <div className="space-y-2">
            {[
              { value: 'smb', label: 'SMB / Startup' },
              { value: 'small_team', label: 'Small team' },
              { value: 'mid_market', label: 'Mid-market' },
              { value: 'enterprise', label: 'Enterprise' },
            ].map(({ value, label }) => (
              <Checkbox
                key={value}
                label={label}
                checked={draft.companySize.includes(value)}
                onChange={(checked) =>
                  setDraft({
                    ...draft,
                    companySize: checked
                      ? [...draft.companySize, value]
                      : draft.companySize.filter((v) => v !== value),
                  })
                }
              />
            ))}
          </div>
        </Field>

        <Field label="Deployment">
          <div className="space-y-2">
            {[
              { value: 'cloud', label: 'Cloud (SaaS)' },
              { value: 'self_hosted', label: 'Self-hosted / On-premise' },
              { value: 'hybrid', label: 'Hybrid' },
            ].map(({ value, label }) => (
              <Checkbox
                key={value}
                label={label}
                checked={draft.deploymentModel.includes(value)}
                onChange={(checked) =>
                  setDraft({
                    ...draft,
                    deploymentModel: checked
                      ? [...draft.deploymentModel, value]
                      : draft.deploymentModel.filter((v) => v !== value),
                  })
                }
              />
            ))}
          </div>
        </Field>

        <Field label="Compliance">
          <div className="space-y-2">
            {[
              { value: 'SOC2', label: 'SOC2' },
              { value: 'HIPAA', label: 'HIPAA' },
              { value: 'GDPR', label: 'GDPR' },
              { value: 'ISO27001', label: 'ISO27001' },
            ].map(({ value, label }) => (
              <Checkbox
                key={value}
                label={label}
                checked={draft.compliance.includes(value)}
                onChange={(checked) =>
                  setDraft({
                    ...draft,
                    compliance: checked
                      ? [...draft.compliance, value]
                      : draft.compliance.filter((v) => v !== value),
                  })
                }
              />
            ))}
          </div>
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
