'use client'

import type { CategoryNode, ProductFacets } from '@/features/catalog'
import {
  DEFAULT_PRODUCT_FILTERS,
  countActiveProductFilters,
  type ProductFilterValues,
} from '@/features/catalog/products/filter-values'
import { ProductFilterSections } from './ProductFilterSections'

/**
 * Desktop filter column for the Explore Products page. Every interaction
 * applies immediately (the page writes it to the URL); "Clear all" resets
 * everything except the sort order.
 */
export function ProductFilterSidebar({
  values,
  onChange,
  facets,
  categoryTree,
  categoriesLoading,
}: {
  values: ProductFilterValues
  onChange: (next: ProductFilterValues) => void
  facets?: ProductFacets | null
  categoryTree: CategoryNode[]
  categoriesLoading?: boolean
}) {
  const activeCount = countActiveProductFilters(values)
  return (
    <div>
      <div className="pp-filter-side-head">
        <h3 className="pp-h6" style={{ margin: 0 }}>
          Filters
          {activeCount > 0 && (
            <span className="pp-small" style={{ marginLeft: 8, color: 'var(--cobalt)', fontWeight: 600 }}>
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            type="button"
            className="pp-filter-group-clear"
            onClick={() => onChange({ ...DEFAULT_PRODUCT_FILTERS, sort: values.sort })}
          >
            Clear all
          </button>
        )}
      </div>
      <ProductFilterSections
        values={values}
        onChange={onChange}
        facets={facets}
        categoryTree={categoryTree}
        categoriesLoading={categoriesLoading}
      />
    </div>
  )
}
