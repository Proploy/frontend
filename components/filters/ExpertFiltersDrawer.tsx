'use client'

import { useState } from 'react'
import { FilterModal } from './FilterModal'
import { ExpertFilterSections } from './ExpertFilterSections'
import {
  DEFAULT_EXPERT_FILTERS,
  type ExpertFilterOptions,
  type ExpertFilterValues,
} from '@/features/experts/filter-values'

export { DEFAULT_EXPERT_FILTERS }
export type { ExpertFilterValues }

/** Mobile filter dialog for the experts directory (draft + Save). */
export function ExpertFiltersDrawer({
  open,
  values,
  options,
  onClose,
  onApply,
}: {
  open: boolean
  values: ExpertFilterValues
  options: ExpertFilterOptions
  onClose: () => void
  onApply: (values: ExpertFilterValues) => void
}) {
  const [draft, setDraft] = useState(values)
  if (!open) return null

  return (
    <FilterModal
      title="Expert filters"
      onClose={onClose}
      onClear={() => setDraft({ ...DEFAULT_EXPERT_FILTERS, sort: draft.sort })}
      onSave={() => {
        onApply(draft)
        onClose()
      }}
    >
      <ExpertFilterSections values={draft} onChange={setDraft} options={options} />
    </FilterModal>
  )
}
