'use client'

import { useMemo, useState } from 'react'
import { FilterGroup, Pill, PillGroup } from './ProductFilterSections'
import {
  ENTITY_TYPE_LABELS,
  type ExpertFilterValues,
  type ExpertListGroupKey,
  type ExpertThresholdKey,
  withProducts,
} from '@/features/experts/filter-values'
import type { ExpertFacetGroup, ExpertFacets } from '@/features/experts/types'

/** Options shown before a group collapses the rest behind "Show all". */
const VISIBLE_PER_GROUP = 10
/** Above this many options a group gets its own search box. */
const SEARCHABLE_ABOVE = 12

type Option = ExpertFacetGroup['options'][number]

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function optionsFor(facets: ExpertFacets | null, group: string): Option[] {
  return facets?.groups?.[group]?.options ?? []
}

/**
 * Filter groups for the experts directory.
 *
 * The options are the answers the application form offers, served by the API
 * from its vocabulary — so a buyer filters on exactly what an expert was asked.
 * Counts come back with them but are never rendered: they only decide which
 * options lead and which collapse behind "Show all", so a group of 25
 * countries does not bury the three that match anything.
 */
export function ExpertFilterSections({
  values,
  onChange,
  facets,
}: {
  values: ExpertFilterValues
  onChange: (next: ExpertFilterValues) => void
  facets: ExpertFacets | null
}) {
  const setList = (key: ExpertListGroupKey, next: string[]) => onChange({ ...values, [key]: next })
  const toggleList = (key: ExpertListGroupKey, value: string) =>
    setList(key, toggleValue(values[key], value))

  const thresholdPills = (
    key: ExpertThresholdKey,
    group: string,
    suffix: string,
  ) => {
    const options = optionsFor(facets, group)
    if (options.length === 0) return null
    return (
      <div className="pp-pills">
        {options.map((option) => {
          const step = Number(option.value)
          return (
            <Pill
              key={option.value}
              label={`${option.value}+ ${suffix}`}
              pressed={values[key] === step}
              onClick={() => onChange({ ...values, [key]: values[key] === step ? 0 : step })}
            />
          )
        })}
      </div>
    )
  }

  const thresholdGroup = (
    title: string,
    key: ExpertThresholdKey,
    group: string,
    suffix: string,
  ) => {
    const pills = thresholdPills(key, group, suffix)
    if (!pills) return null
    return (
      <FilterGroup
        title={title}
        selectedCount={values[key] > 0 ? 1 : 0}
        onClear={values[key] > 0 ? () => onChange({ ...values, [key]: 0 }) : undefined}
      >
        {pills}
      </FilterGroup>
    )
  }

  const productOptions = optionsFor(facets, 'products')

  const depthCount =
    Number(values.minimumProductYears > 0) +
    Number(values.minimumProductProjects > 0) +
    Number(values.primaryProductOnly) +
    Number(values.productCertified) +
    values.productIndustries.length

  const toggleProduct = (value: string) =>
    onChange(withProducts(values, toggleValue(values.products, value)))

  const clearProducts = () => onChange(withProducts(values, []))

  const depthScopeTitle =
    values.products.length === 1
      ? `Expertise on ${productOptions.find((o) => o.value === values.products[0])?.label ?? 'this product'}`
      : `Expertise on any of the ${values.products.length} products`

  // Served by the API as the picked products' own catalog industries, so the
  // group is empty until a product is picked and never offers one the product
  // does not claim.
  const productIndustryOptions = optionsFor(facets, 'product_industries')

  return (
    <div className="pp-stack" style={{ gap: 0 }}>
      <OptionGroup
        title="Product"
        defaultOpen
        options={productOptions}
        selected={values.products}
        onToggle={toggleProduct}
        onClear={clearProducts}
        searchPlaceholder="Find a product, e.g. Asana"
        extraSelectedCount={depthCount}
        footer={
          // Depth lives inside the product group because it qualifies that
          // selection rather than standing beside it — the API matches it
          // against the same expertise row. It appears only once a product is
          // picked, so there is never a control on screen whose meaning
          // depends on a selection that has not been made.
          values.products.length === 0 ? null : (
            <div style={depthBlockStyle}>
              <p className="pp-small" style={{ margin: '0 0 2px', fontWeight: 600 }}>
                {depthScopeTitle}
              </p>
              {values.products.length > 1 && (
                <p className="pp-small" style={{ margin: '0 0 10px', color: 'var(--slate-11)' }}>
                  Counts on any one of them, not all.
                </p>
              )}
              {productIndustryOptions.length > 0 && (
                <>
                  <label className="pp-small" style={depthLabelStyle}>Industries served on it</label>
                  <div className="pp-pills">
                    {productIndustryOptions.map((option) => (
                      <Pill
                        key={option.value}
                        label={option.label}
                        pressed={values.productIndustries.includes(option.value)}
                        onClick={() => toggleList('productIndustries', option.value)}
                      />
                    ))}
                  </div>
                </>
              )}
              <label
                className="pp-small"
                style={productIndustryOptions.length > 0 ? { ...depthLabelStyle, marginTop: 10 } : depthLabelStyle}
              >
                Years on it
              </label>
              {thresholdPills('minimumProductYears', 'product_years', 'years')}
              <label className="pp-small" style={{ ...depthLabelStyle, marginTop: 10 }}>
                Projects on it
              </label>
              {thresholdPills('minimumProductProjects', 'product_projects', 'projects')}
              <div className="pp-pills" style={{ marginTop: 10 }}>
                <Pill
                  label="Primary product"
                  pressed={values.primaryProductOnly}
                  onClick={() =>
                    onChange({ ...values, primaryProductOnly: !values.primaryProductOnly })
                  }
                />
                <Pill
                  label="Certified on it"
                  pressed={values.productCertified}
                  onClick={() => onChange({ ...values, productCertified: !values.productCertified })}
                />
              </div>
            </div>
          )
        }
      />

      {/* Bands, not a yes/no: choosing between two certified experts, holding
          five credentials is different from holding one. Single-select,
          because the bands cannot overlap. */}
      <FilterGroup
        title="Certifications"
        selectedCount={values.certificationCount ? 1 : 0}
        onClear={
          values.certificationCount ? () => onChange({ ...values, certificationCount: '' }) : undefined
        }
      >
        <div className="pp-pills">
          {optionsFor(facets, 'certifications').map((option) => (
            <Pill
              key={option.value}
              label={option.label}
              pressed={values.certificationCount === option.value}
              onClick={() =>
                onChange({
                  ...values,
                  certificationCount:
                    values.certificationCount === option.value ? '' : option.value,
                })
              }
            />
          ))}
        </div>
      </FilterGroup>

      <PillGroup
        title="Industry"
        options={optionsFor(facets, 'industries').map((o) => ({ value: o.value, label: o.label }))}
        selected={values.industries}
        onToggle={(value) => toggleList('industries', value)}
        onClear={() => setList('industries', [])}
      />

      <PillGroup
        title="Project type"
        options={optionsFor(facets, 'project_types').map((o) => ({ value: o.value, label: o.label }))}
        selected={values.projectTypes}
        onToggle={(value) => toggleList('projectTypes', value)}
        onClear={() => setList('projectTypes', [])}
      />

      {thresholdGroup('Experience', 'minimumYears', 'years', 'years')}
      {thresholdGroup('Projects delivered', 'minimumProjects', 'projects', 'projects')}

      {/* entity_type is single-valued server-side, so this group replaces
          rather than accumulates. */}
      <PillGroup
        title="Expert type"
        options={optionsFor(facets, 'entity_types').map((option) => ({
          value: option.value,
          label: ENTITY_TYPE_LABELS[option.value.toLowerCase()] ?? option.label,
        }))}
        selected={values.entityTypes}
        onToggle={(value) =>
          setList('entityTypes', values.entityTypes.includes(value) ? [] : [value])
        }
        onClear={() => setList('entityTypes', [])}
      />

      <OptionGroup
        title="Country"
        options={optionsFor(facets, 'countries')}
        selected={values.countries}
        onToggle={(value) => toggleList('countries', value)}
        onClear={() => setList('countries', [])}
        searchPlaceholder="Find a country"
      />

      <PillGroup
        title="Regions served"
        options={optionsFor(facets, 'regions_served').map((o) => ({ value: o.value, label: o.label }))}
        selected={values.regionsServed}
        onToggle={(value) => toggleList('regionsServed', value)}
        onClear={() => setList('regionsServed', [])}
      />

      <OptionGroup
        title="Timezone"
        options={optionsFor(facets, 'timezones')}
        selected={values.timezones}
        onToggle={(value) => toggleList('timezones', value)}
        onClear={() => setList('timezones', [])}
        searchPlaceholder="Find a timezone"
      />

      {thresholdGroup('Weekly availability', 'minimumHoursPerWeek', 'availability_hours', 'hours/week')}

      <FilterGroup
        title="Availability"
        selectedCount={Number(values.remoteOnly) + Number(Boolean(values.availableFrom))}
        onClear={
          values.remoteOnly || values.availableFrom
            ? () => onChange({ ...values, remoteOnly: false, availableFrom: '' })
            : undefined
        }
      >
        <div className="pp-pills" style={{ marginBottom: 10 }}>
          <Pill
            label="Remote only"
            pressed={values.remoteOnly}
            onClick={() => onChange({ ...values, remoteOnly: !values.remoteOnly })}
          />
        </div>
        <label className="pp-small" style={{ display: 'block', marginBottom: 4, color: 'var(--slate-11)' }}>
          Available from
        </label>
        <input
          type="date"
          value={values.availableFrom}
          onChange={(event) => onChange({ ...values, availableFrom: event.target.value })}
          aria-label="Available from"
          style={inputStyle}
        />
      </FilterGroup>
    </div>
  )
}

const depthBlockStyle: React.CSSProperties = {
  marginTop: 12,
  paddingTop: 12,
  borderTop: 'var(--bw) solid var(--line)',
}

const depthLabelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 6,
  color: 'var(--slate-11)',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 36,
  padding: '0 12px',
  borderRadius: 'var(--r-control)',
  border: 'var(--bw) solid var(--line)',
  background: '#fff',
  fontSize: 13,
  color: 'var(--ink)',
  outline: 'none',
}

/**
 * A long option list: matches lead, everything else collapses behind
 * "Show all". Selected options always stay visible so a filter can be cleared
 * without hunting for it.
 */
function OptionGroup({
  title,
  options,
  selected,
  onToggle,
  onClear,
  searchPlaceholder,
  defaultOpen = false,
  footer = null,
  extraSelectedCount = 0,
}: {
  title: string
  options: Option[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
  searchPlaceholder: string
  defaultOpen?: boolean
  /** Controls that qualify this group's selection and belong inside it. */
  footer?: React.ReactNode
  /** Selections the footer owns, so the collapsed header counts them too. */
  extraSelectedCount?: number
}) {
  const [query, setQuery] = useState('')
  const [showAll, setShowAll] = useState(false)

  const ordered = useMemo(() => {
    // Options an expert actually has come first; the rest stay reachable.
    const withMatches = options.filter((o) => o.count > 0 || selected.includes(o.value))
    const withoutMatches = options.filter((o) => o.count === 0 && !selected.includes(o.value))
    return [...withMatches, ...withoutMatches]
  }, [options, selected])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (needle) return ordered.filter((o) => o.label.toLowerCase().includes(needle))
    if (showAll) return ordered
    const head = ordered.slice(0, VISIBLE_PER_GROUP)
    const missingSelected = ordered.filter(
      (o) => selected.includes(o.value) && !head.includes(o),
    )
    return [...head, ...missingSelected]
  }, [ordered, query, showAll, selected])

  if (options.length === 0) return null

  return (
    <FilterGroup
      title={title}
      defaultOpen={defaultOpen}
      selectedCount={selected.length + extraSelectedCount}
      onClear={selected.length + extraSelectedCount ? onClear : undefined}
    >
      {options.length > SEARCHABLE_ABOVE && (
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          style={{ ...inputStyle, marginBottom: 8 }}
        />
      )}
      <div className="pp-pills">
        {visible.map((option) => (
          <Pill
            key={option.value}
            label={option.label}
            pressed={selected.includes(option.value)}
            onClick={() => onToggle(option.value)}
          />
        ))}
        {visible.length === 0 && (
          <p className="pp-small" style={{ color: 'var(--slate-11)' }}>
            Nothing matches &quot;{query}&quot;.
          </p>
        )}
        {!query && ordered.length > VISIBLE_PER_GROUP && (
          <button
            type="button"
            className="pp-pill pp-pill--ghost"
            onClick={() => setShowAll((current) => !current)}
          >
            {showAll ? 'Show fewer' : `Show all ${ordered.length}`}
          </button>
        )}
      </div>
      {footer}
    </FilterGroup>
  )
}
