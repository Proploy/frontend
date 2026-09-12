'use client'

import { useState } from 'react'
import { FilterModal } from './FilterModal'
import { ExpertFilterSections } from './ExpertFilterSections'
import type { ExpertFacets } from '@/features/experts/types'
import {
  DEFAULT_EXPERT_FILTERS,
  type ExpertFilterValues,
} from '@/features/experts/filter-values'

export { DEFAULT_EXPERT_FILTERS }
export type { ExpertFilterValues }

/** Mobile filter dialog for the experts directory (draft + Save). */
export function ExpertFiltersDrawer({
  open,
  values,
  facets,
  onClose,
  onApply,
}: {
  open: boolean
  values: ExpertFilterValues
  facets: ExpertFacets | null
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
      <ExpertFilterSections values={draft} onChange={setDraft} facets={facets} />
    </FilterModal>
  )
}
