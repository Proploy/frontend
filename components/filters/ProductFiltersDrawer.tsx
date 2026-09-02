'use client'

import { useState } from 'react'
import { FilterModal } from './FilterModal'
import { ProductFilterSections } from './ProductFilterSections'
import type { CategoryNode, ProductFacets } from '@/features/catalog'
import {
  DEFAULT_PRODUCT_FILTERS,
  type ProductFilterValues,
} from '@/features/catalog/products/filter-values'

export { DEFAULT_PRODUCT_FILTERS }
export type { ProductFilterValues }

/**
 * Mobile filter dialog. Renders the same pill sections as the desktop sidebar
 * on a draft copy of the filters; "Save filters" applies them in one go.
 */
export function ProductFiltersDrawer({
  open,
  values,
  onClose,
  onApply,
  facets,
  categoryTree = [],
}: {
  open: boolean
  values: ProductFilterValues
  onClose: () => void
  onApply: (values: ProductFilterValues) => void
  facets?: ProductFacets | null
  categoryTree?: CategoryNode[]
}) {
  const [draft, setDraft] = useState(values)
  if (!open) return null

  return (
    <FilterModal
      title="Product filters"
      onClose={onClose}
      onClear={() => setDraft({ ...DEFAULT_PRODUCT_FILTERS, sort: draft.sort })}
      onSave={() => {
        onApply(draft)
        onClose()
      }}
    >
      <ProductFilterSections
        values={draft}
        onChange={setDraft}
        facets={facets}
        categoryTree={categoryTree}
      />
    </FilterModal>
  )
}
