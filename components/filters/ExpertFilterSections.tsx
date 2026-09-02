'use client'

import { useMemo, useState } from 'react'
import { FilterGroup, Pill, PillGroup } from './ProductFilterSections'
import {
  ENTITY_TYPE_LABELS,
  EXPERT_YEARS_OPTIONS,
  type ExpertFilterOptions,
  type ExpertFilterValues,
} from '@/features/experts/filter-values'

type ListKey = 'platforms' | 'industries' | 'projectTypes' | 'countries' | 'entityTypes'

const PLATFORMS_VISIBLE = 10

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

/**
 * Pill-based filter groups for the experts directory. Options come from the
 * loaded directory (see deriveExpertFilterOptions), so only real values show.
 */
export function ExpertFilterSections({
  values,
  onChange,
  options,
}: {
  values: ExpertFilterValues
  onChange: (next: ExpertFilterValues) => void
  options: ExpertFilterOptions
}) {
  const [platformQuery, setPlatformQuery] = useState('')
  const [showAllPlatforms, setShowAllPlatforms] = useState(false)

  const setList = (key: ListKey, next: string[]) => onChange({ ...values, [key]: next })
  const toggleList = (key: ListKey, value: string) => setList(key, toggleValue(values[key], value))

  const visiblePlatforms = useMemo(() => {
    const needle = platformQuery.trim().toLowerCase()
    const selected = options.platforms.filter((label) => values.platforms.includes(label))
    const pool = needle ? options.platforms.filter((label) => label.toLowerCase().includes(needle)) : options.platforms
    const merged = Array.from(new Set([...selected, ...pool]))
    if (needle || showAllPlatforms) return merged
    return merged.slice(0, Math.max(PLATFORMS_VISIBLE, selected.length))
  }, [options.platforms, platformQuery, showAllPlatforms, values.platforms])

  return (
    <div className="pp-stack" style={{ gap: 0 }}>
      {options.platforms.length > 0 && (
        <FilterGroup
          title="Platform expertise"
          defaultOpen
          selectedCount={values.platforms.length}
          onClear={values.platforms.length ? () => setList('platforms', []) : undefined}
        >
          <input
            type="search"
            value={platformQuery}
            onChange={(event) => setPlatformQuery(event.target.value)}
            placeholder="Find a platform, e.g. Asana"
            aria-label="Find a platform"
            style={{
              width: '100%',
              height: 36,
              marginBottom: 8,
              padding: '0 12px',
              borderRadius: 'var(--r-control)',
              border: 'var(--bw) solid var(--line)',
              background: '#fff',
              fontSize: 13,
              color: 'var(--ink)',
              outline: 'none',
            }}
          />
          <div className="pp-pills">
            {visiblePlatforms.map((label) => (
              <Pill
                key={label}
                label={label}
                pressed={values.platforms.includes(label)}
                onClick={() => toggleList('platforms', label)}
              />
            ))}
            {visiblePlatforms.length === 0 && (
              <p className="pp-small" style={{ color: 'var(--slate-11)' }}>
                No platforms match &quot;{platformQuery}&quot;.
              </p>
            )}
            {!platformQuery && options.platforms.length > PLATFORMS_VISIBLE && (
              <button
                type="button"
                className="pp-pill pp-pill--ghost"
                onClick={() => setShowAllPlatforms((current) => !current)}
              >
                {showAllPlatforms ? 'Show fewer' : `Show all ${options.platforms.length}`}
              </button>
            )}
          </div>
        </FilterGroup>
      )}

      <PillGroup
        title="Industry"
        options={options.industries.map((label) => ({ value: label, label }))}
        selected={values.industries}
        onToggle={(value) => toggleList('industries', value)}
        onClear={() => setList('industries', [])}
      />

      <PillGroup
        title="Project type"
        options={options.projectTypes.map((label) => ({ value: label, label }))}
        selected={values.projectTypes}
        onToggle={(value) => toggleList('projectTypes', value)}
        onClear={() => setList('projectTypes', [])}
      />

      <FilterGroup
        title="Experience"
        selectedCount={values.minimumYears > 0 ? 1 : 0}
        onClear={values.minimumYears > 0 ? () => onChange({ ...values, minimumYears: 0 }) : undefined}
      >
        <div className="pp-pills">
          {EXPERT_YEARS_OPTIONS.map((years) => (
            <Pill
              key={years}
              label={`${years}+ years`}
              pressed={values.minimumYears === years}
              onClick={() => onChange({ ...values, minimumYears: values.minimumYears === years ? 0 : years })}
            />
          ))}
        </div>
      </FilterGroup>

      <PillGroup
        title="Expert type"
        options={options.entityTypes.map((value) => ({ value, label: ENTITY_TYPE_LABELS[value] ?? value }))}
        selected={values.entityTypes}
        onToggle={(value) => toggleList('entityTypes', value)}
        onClear={() => setList('entityTypes', [])}
      />

      <PillGroup
        title="Location"
        options={options.countries.map((label) => ({ value: label, label }))}
        selected={values.countries}
        onToggle={(value) => toggleList('countries', value)}
        onClear={() => setList('countries', [])}
      />
    </div>
  )
}
