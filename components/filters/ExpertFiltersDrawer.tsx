'use client'

import { useState } from 'react'
import { FilterModal } from './FilterModal'

export interface ExpertFilterValues {
  location: string
  entityType: string
  minimumYears: number
  platform: string
  industry: string
  projectType: string
  sort: 'relevance' | 'experience' | 'projects' | 'name'
}

export const DEFAULT_EXPERT_FILTERS: ExpertFilterValues = {
  location: '',
  entityType: '',
  minimumYears: 0,
  platform: '',
  industry: '',
  projectType: '',
  sort: 'relevance',
}

export function ExpertFiltersDrawer({
  open,
  values,
  onClose,
  onApply,
}: {
  open: boolean
  values: ExpertFilterValues
  onClose: () => void
  onApply: (values: ExpertFilterValues) => void
}) {
  const [draft, setDraft] = useState(values)
  if (!open) return null

  return (
    <FilterModal
      title="Expert filters"
      onClose={onClose}
      onClear={() => setDraft(DEFAULT_EXPERT_FILTERS)}
      onSave={() => {
        onApply(draft)
        onClose()
      }}
    >
      <div className="grid gap-x-7 gap-y-6 sm:grid-cols-2">
        <label className="flex flex-col gap-[6px] text-[14px] font-medium text-[#414651]">
          Sort by
          <select value={draft.sort} onChange={(event) => setDraft({ ...draft, sort: event.target.value as ExpertFilterValues['sort'] })} className={controlClasses}>
            <option value="relevance">Relevance</option>
            <option value="experience">Most experienced</option>
            <option value="projects">Most projects</option>
            <option value="name">Name</option>
          </select>
        </label>
        <label className="flex flex-col gap-[6px] text-[14px] font-medium text-[#414651]">
          Expert type
          <select value={draft.entityType} onChange={(event) => setDraft({ ...draft, entityType: event.target.value })} className={controlClasses}>
            <option value="">Any type</option>
            <option value="individual">Individual</option>
            <option value="business">Business or team</option>
          </select>
        </label>
        <Input label="Platform expertise" value={draft.platform} onChange={(platform) => setDraft({ ...draft, platform })} placeholder="e.g., Asana" />
        <Input label="Industry" value={draft.industry} onChange={(industry) => setDraft({ ...draft, industry })} placeholder="e.g., Fintech" />
        <Input label="Project type" value={draft.projectType} onChange={(projectType) => setDraft({ ...draft, projectType })} placeholder="e.g., CRM migration" />
        <Input label="Location" value={draft.location} onChange={(location) => setDraft({ ...draft, location })} placeholder="Country or city" />
        <label className="flex flex-col gap-[8px] text-[14px] font-medium text-[#414651] sm:col-span-2">
          Minimum experience: {draft.minimumYears} years
          <input className="accent-[#155eef]" type="range" min={0} max={20} value={draft.minimumYears} onChange={(event) => setDraft({ ...draft, minimumYears: Number(event.target.value) })} />
        </label>
      </div>
    </FilterModal>
  )
}

const controlClasses = 'h-[50px] rounded-[10px] border border-[#d5d7da] bg-white px-[14px] text-[15px] text-[#181d27] outline-none focus:border-[#155eef]'

function Input({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="flex flex-col gap-[6px] text-[14px] font-medium text-[#414651]">{label}<input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={controlClasses} /></label>
}
