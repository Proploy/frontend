'use client'

import {
  DEFAULT_EXPERT_FILTERS,
  countActiveExpertFilters,
  type ExpertFilterOptions,
  type ExpertFilterValues,
} from '@/features/experts/filter-values'
import { ExpertFilterSections } from './ExpertFilterSections'

/** Desktop filter column for the experts directory; every click applies immediately. */
export function ExpertFilterSidebar({
  values,
  onChange,
  options,
}: {
  values: ExpertFilterValues
  onChange: (next: ExpertFilterValues) => void
  options: ExpertFilterOptions
}) {
  const activeCount = countActiveExpertFilters(values)
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
            onClick={() => onChange({ ...DEFAULT_EXPERT_FILTERS, sort: values.sort })}
          >
            Clear all
          </button>
        )}
      </div>
      <ExpertFilterSections values={values} onChange={onChange} options={options} />
    </div>
  )
}
