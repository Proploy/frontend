'use client'

import { useMemo, useState } from 'react'
import type { CategoryNode, FacetOption, ProductFacets } from '@/features/catalog'
import type { ProductFilterValues } from '@/features/catalog/products/filter-values'

/**
 * The filter controls for the Explore Products page: category tree plus
 * multi-select pill groups. No checkboxes; every option is a toggle whose
 * pressed state is the selection. Used by the desktop sidebar (applies on
 * every click) and the mobile drawer (draft + save).
 */

export type ListFilterKey =
  | 'pricingBuckets'
  | 'companySize'
  | 'deploymentModel'
  | 'compliance'
  | 'integrations'
  | 'industries'
  | 'implementationComplexity'

type Option = { value: string; label: string }

/** Options used until facets resolve (or if the request fails). */
export const FALLBACK_OPTIONS: Record<string, Option[]> = {
  pricing_buckets: [
    { value: 'free', label: 'Free' },
    { value: 'freemium', label: 'Freemium' },
    { value: 'paid_tier_1', label: 'Paid (Tier 1)' },
    { value: 'paid_tier_2', label: 'Paid (Tier 2)' },
    { value: 'paid_tier_3', label: 'Paid (Tier 3)' },
    { value: 'contact_sales', label: 'Contact sales' },
  ],
  company_sizes: [
    { value: 'individual', label: 'Individual' },
    { value: 'small_team', label: 'Small team' },
    { value: 'smb', label: 'SMB / Startup' },
    { value: 'mid_market', label: 'Mid-market' },
    { value: 'enterprise', label: 'Enterprise' },
  ],
  deployment_models: [
    { value: 'cloud', label: 'Cloud (SaaS)' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'self_hosted', label: 'Self-hosted / On-premise' },
  ],
  compliance: [
    { value: 'SOC2', label: 'SOC2' },
    { value: 'GDPR', label: 'GDPR' },
    { value: 'ISO27001', label: 'ISO27001' },
    { value: 'HIPAA', label: 'HIPAA' },
    { value: 'PCI DSS', label: 'PCI DSS' },
  ],
  industries: [],
  integrations: [],
  implementation_complexity: [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ],
  ratings: [
    { value: '4.5', label: '4.5+ stars' },
    { value: '4', label: '4+ stars' },
    { value: '3.5', label: '3.5+ stars' },
  ],
  starting_prices: [
    { value: '0', label: 'Free to start' },
    { value: '10', label: 'Up to $10/mo' },
    { value: '30', label: 'Up to $30/mo' },
    { value: '100', label: 'Up to $100/mo' },
  ],
}

type FacetKey = keyof Omit<ProductFacets, 'total' | 'free_plan_count' | 'free_trial_count'>

/** Live facet options (zero-result options hidden, counts dropped) or the fallback list. */
export function optionsFor(facets: ProductFacets | null | undefined, key: FacetKey): Option[] {
  const live = facets?.[key] as FacetOption[] | undefined
  if (live && live.length) {
    return live.filter((option) => option.count > 0).map(({ value, label }) => ({ value, label }))
  }
  return FALLBACK_OPTIONS[key] ?? []
}

const INTEGRATIONS_VISIBLE = 10

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function ProductFilterSections({
  values,
  onChange,
  facets,
  categoryTree,
  categoriesLoading = false,
}: {
  values: ProductFilterValues
  onChange: (next: ProductFilterValues) => void
  facets?: ProductFacets | null
  categoryTree: CategoryNode[]
  categoriesLoading?: boolean
}) {
  const [integrationQuery, setIntegrationQuery] = useState('')
  const [showAllIntegrations, setShowAllIntegrations] = useState(false)

  const pricingOptions = useMemo(() => optionsFor(facets, 'pricing_buckets'), [facets])
  const sizeOptions = useMemo(() => optionsFor(facets, 'company_sizes'), [facets])
  const deploymentOptions = useMemo(() => optionsFor(facets, 'deployment_models'), [facets])
  const complianceOptions = useMemo(() => optionsFor(facets, 'compliance'), [facets])
  const industryOptions = useMemo(() => optionsFor(facets, 'industries'), [facets])
  const integrationOptions = useMemo(() => optionsFor(facets, 'integrations'), [facets])
  const complexityOptions = useMemo(() => optionsFor(facets, 'implementation_complexity'), [facets])
  const ratingOptions = useMemo(() => optionsFor(facets, 'ratings'), [facets])
  const priceOptions = useMemo(() => optionsFor(facets, 'starting_prices'), [facets])

  const visibleIntegrations = useMemo(() => {
    const needle = integrationQuery.trim().toLowerCase()
    const selected = integrationOptions.filter((option) => values.integrations.includes(option.value))
    const pool = needle
      ? integrationOptions.filter((option) => option.label.toLowerCase().includes(needle))
      : integrationOptions
    const merged = new Map<string, Option>()
    for (const option of [...selected, ...pool]) merged.set(option.value, option)
    const all = Array.from(merged.values())
    if (needle || showAllIntegrations) return all
    return all.slice(0, Math.max(INTEGRATIONS_VISIBLE, selected.length))
  }, [integrationOptions, integrationQuery, showAllIntegrations, values.integrations])

  const setList = (key: ListFilterKey, next: string[]) => onChange({ ...values, [key]: next })
  const toggleList = (key: ListFilterKey, value: string) => setList(key, toggleValue(values[key], value))
  const toggleCategory = (termId: string) =>
    onChange({ ...values, categoryTermIds: toggleValue(values.categoryTermIds, termId) })

  return (
    <div className="pp-stack" style={{ gap: 0 }}>
      <FilterGroup
        title="Categories"
        defaultOpen
        selectedCount={values.categoryTermIds.length}
        onClear={values.categoryTermIds.length ? () => onChange({ ...values, categoryTermIds: [] }) : undefined}
      >
        <CategoryTree
          tree={categoryTree}
          loading={categoriesLoading}
          selected={values.categoryTermIds}
          onToggle={toggleCategory}
        />
      </FilterGroup>

      <PillGroup
        title="Pricing"
        options={pricingOptions}
        selected={values.pricingBuckets}
        onToggle={(value) => toggleList('pricingBuckets', value)}
        onClear={() => setList('pricingBuckets', [])}
      />

      <FilterGroup
        title="Plans and trials"
        selectedCount={Number(values.freePlan) + Number(values.freeTrial)}
        onClear={values.freePlan || values.freeTrial ? () => onChange({ ...values, freePlan: false, freeTrial: false }) : undefined}
      >
        <div className="pp-pills">
          <Pill
            label="Free plan"
            pressed={values.freePlan}
            onClick={() => onChange({ ...values, freePlan: !values.freePlan })}
          />
          <Pill
            label="Free trial"
            pressed={values.freeTrial}
            onClick={() => onChange({ ...values, freeTrial: !values.freeTrial })}
          />
        </div>
      </FilterGroup>

      <PillGroup
        title="Company size"
        options={sizeOptions}
        selected={values.companySize}
        onToggle={(value) => toggleList('companySize', value)}
        onClear={() => setList('companySize', [])}
      />

      <FilterGroup
        title="Minimum rating"
        selectedCount={values.minRating ? 1 : 0}
        onClear={values.minRating ? () => onChange({ ...values, minRating: '' }) : undefined}
      >
        <div className="pp-pills">
          {ratingOptions.map((option) => (
            <Pill
              key={option.value}
              label={option.label}
              pressed={values.minRating === option.value}
              onClick={() => onChange({ ...values, minRating: values.minRating === option.value ? '' : option.value })}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup
        title="Starting price"
        selectedCount={values.maxStartingPrice !== '' ? 1 : 0}
        onClear={values.maxStartingPrice !== '' ? () => onChange({ ...values, maxStartingPrice: '' }) : undefined}
      >
        <div className="pp-pills">
          {priceOptions.map((option) => (
            <Pill
              key={option.value}
              label={option.label}
              pressed={values.maxStartingPrice === option.value}
              onClick={() =>
                onChange({
                  ...values,
                  maxStartingPrice: values.maxStartingPrice === option.value ? '' : option.value,
                })
              }
            />
          ))}
        </div>
      </FilterGroup>

      <PillGroup
        title="Deployment"
        options={deploymentOptions}
        selected={values.deploymentModel}
        onToggle={(value) => toggleList('deploymentModel', value)}
        onClear={() => setList('deploymentModel', [])}
      />

      <PillGroup
        title="Implementation effort"
        options={complexityOptions}
        selected={values.implementationComplexity}
        onToggle={(value) => toggleList('implementationComplexity', value)}
        onClear={() => setList('implementationComplexity', [])}
      />

      <PillGroup
        title="Compliance"
        options={complianceOptions}
        selected={values.compliance}
        onToggle={(value) => toggleList('compliance', value)}
        onClear={() => setList('compliance', [])}
      />

      {industryOptions.length > 0 && (
        <PillGroup
          title="Industry"
          options={industryOptions}
          selected={values.industries}
          onToggle={(value) => toggleList('industries', value)}
          onClear={() => setList('industries', [])}
        />
      )}

      {integrationOptions.length > 0 && (
        <FilterGroup
          title="Integrates with"
          selectedCount={values.integrations.length}
          onClear={values.integrations.length ? () => setList('integrations', []) : undefined}
        >
          <input
            type="search"
            value={integrationQuery}
            onChange={(event) => setIntegrationQuery(event.target.value)}
            placeholder="Find an integration"
            aria-label="Find an integration"
            className="pp-filter-search"
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
            {visibleIntegrations.map((option) => (
              <Pill
                key={option.value}
                label={option.label}
                pressed={values.integrations.includes(option.value)}
                onClick={() => toggleList('integrations', option.value)}
              />
            ))}
            {visibleIntegrations.length === 0 && (
              <p className="pp-small" style={{ color: 'var(--slate-11)' }}>
                No integrations match &quot;{integrationQuery}&quot;.
              </p>
            )}
            {!integrationQuery && integrationOptions.length > INTEGRATIONS_VISIBLE && (
              <button
                type="button"
                className="pp-pill pp-pill--ghost"
                onClick={() => setShowAllIntegrations((current) => !current)}
              >
                {showAllIntegrations ? 'Show fewer' : `Show all ${integrationOptions.length}`}
              </button>
            )}
          </div>
        </FilterGroup>
      )}
    </div>
  )
}

/* ── building blocks ─────────────────────────────────────────── */

export function FilterGroup({
  title,
  onClear,
  selectedCount = 0,
  defaultOpen = false,
  children,
}: {
  title: string
  onClear?: () => void
  /** Shown in the collapsed header so a hidden selection is never a surprise. */
  selectedCount?: number
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  // A group with a selection starts open; the user can collapse anything.
  const [userOpen, setUserOpen] = useState<boolean | null>(null)
  const open = userOpen ?? (defaultOpen || selectedCount > 0)
  const panelId = `filter-group-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return (
    <section className="pp-filter-group" aria-label={title} data-open={open}>
      <div className="pp-filter-group-head">
        <button
          type="button"
          className="pp-filter-group-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setUserOpen(!open)}
        >
          <span className="pp-filter-group-title">{title}</span>
          {!open && selectedCount > 0 && (
            <span className="pp-filter-group-badge">{selectedCount}</span>
          )}
          <svg className="pp-filter-group-plusminus" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M5 12h14" />
            <path className="pp-filter-group-plusminus-v" d="M12 5v14" />
          </svg>
        </button>
        {open && onClear && (
          <button type="button" className="pp-filter-group-clear" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      {open && (
        <div id={panelId} className="pp-filter-group-body">
          {children}
        </div>
      )}
    </section>
  )
}

export function PillGroup({
  title,
  options,
  selected,
  onToggle,
  onClear,
}: {
  title: string
  options: Option[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
}) {
  if (options.length === 0) return null
  return (
    <FilterGroup title={title} onClear={selected.length ? onClear : undefined} selectedCount={selected.length}>
      <div className="pp-pills">
        {options.map((option) => (
          <Pill
            key={option.value}
            label={option.label}
            pressed={selected.includes(option.value)}
            onClick={() => onToggle(option.value)}
          />
        ))}
      </div>
    </FilterGroup>
  )
}

export function Pill({
  label,
  pressed,
  onClick,
}: {
  label: string
  pressed: boolean
  onClick: () => void
}) {
  return (
    <button type="button" className="pp-pill" aria-pressed={pressed} onClick={onClick}>
      {label}
    </button>
  )
}

function CategoryTree({
  tree,
  loading,
  selected,
  onToggle,
}: {
  tree: CategoryNode[]
  loading: boolean
  selected: string[]
  onToggle: (termId: string) => void
}) {
  // Subcategories reveal on hover or keyboard focus; they stay visible while
  // the root or one of its subcategories is selected, so refinement is always
  // one click away without any extra expand control.
  const [hovered, setHovered] = useState<string | null>(null)

  if (loading && tree.length === 0) {
    return (
      <div className="pp-stack" style={{ gap: 6 }} role="status" aria-busy="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} style={{ height: 34, borderRadius: 8, background: 'var(--slate-2)' }} />
        ))}
      </div>
    )
  }

  return (
    <div className="pp-cat-tree">
      {tree.map((root) => {
        const rootSelected = selected.includes(root.term_id)
        const selectedChildren = root.children.filter((child) => selected.includes(child.term_id)).length
        const open = hovered === root.term_id || rootSelected || selectedChildren > 0
        return (
          <div
            key={root.term_id}
            className="pp-cat-item"
            data-open={open}
            onMouseEnter={() => setHovered(root.term_id)}
            onMouseLeave={() => setHovered((current) => (current === root.term_id ? null : current))}
            onFocus={() => setHovered(root.term_id)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setHovered((current) => (current === root.term_id ? null : current))
              }
            }}
          >
            <button
              type="button"
              className="pp-cat-root"
              aria-pressed={rootSelected}
              onClick={() => onToggle(root.term_id)}
              title={root.description ?? undefined}
            >
              <span className="pp-cat-root-label">{root.label}</span>
              {!rootSelected && selectedChildren > 0 && (
                <span className="pp-filter-group-badge">{selectedChildren}</span>
              )}
            </button>
            {open && root.children.length > 0 && (
              <div className="pp-cat-children">
                {root.children.map((child) => (
                  <Pill
                    key={child.term_id}
                    label={child.label}
                    pressed={selected.includes(child.term_id)}
                    onClick={() => onToggle(child.term_id)}
                  />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
