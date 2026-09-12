import { describe, expect, it } from 'vitest'

import {
  applyExpertFilterParams,
  buildExpertListQuery,
  parseExpertFilterParams,
  serializeExpertFilterParams,
} from '../filter-params'
import {
  DEFAULT_EXPERT_FILTERS,
  countActiveExpertFilters,
  withProducts,
  type ExpertFilterValues,
} from '../filter-values'

const full: ExpertFilterValues = {
  products: ['6c51b28e08b6', 'efb606289140'],
  minimumProductYears: 6,
  minimumProductProjects: 25,
  primaryProductOnly: true,
  productCertified: true,
  productIndustries: ['Healthcare'],
  certificationCount: '2',
  industries: ['Fintech'],
  projectTypes: ['CRM migration'],
  countries: ['India'],
  regionsServed: ['South Asia'],
  timezones: ['UTC+05:30'],
  entityTypes: ['business'],
  minimumYears: 5,
  minimumProjects: 10,
  minimumHoursPerWeek: 20,
  availableFrom: '2026-11-01',
  remoteOnly: true,
  sort: 'experience',
}

describe('expert filter URL params', () => {
  it('round-trips every filter and leaves search alone', () => {
    const params = applyExpertFilterParams(new URLSearchParams('search=asana'), full)
    expect(parseExpertFilterParams(params)).toEqual(full)
    expect(params.get('search')).toBe('asana')
  })

  it('accepts legacy single-value links', () => {
    expect(parseExpertFilterParams(new URLSearchParams('industry=Fintech&type=business'))).toEqual({
      ...DEFAULT_EXPERT_FILTERS,
      industries: ['Fintech'],
      entityTypes: ['business'],
    })
  })

  it('only accepts a band the API defines', () => {
    expect(parseExpertFilterParams(new URLSearchParams('certifications=0')).certificationCount).toBe('0')
    expect(parseExpertFilterParams(new URLSearchParams('certifications=5')).certificationCount).toBe('5')
    expect(parseExpertFilterParams(new URLSearchParams('certifications=3')).certificationCount).toBe('')
    expect(parseExpertFilterParams(new URLSearchParams('certifications=lots')).certificationCount).toBe('')
  })

  it('drops defaults and ignores bad values', () => {
    expect(serializeExpertFilterParams(DEFAULT_EXPERT_FILTERS)).toBe('')
    const parsed = parseExpertFilterParams(
      new URLSearchParams('min_years=abc&min_hours=-4&available_from=soon&sort=bogus'),
    )
    expect(parsed.minimumYears).toBe(0)
    expect(parsed.minimumHoursPerWeek).toBe(0)
    // Only an ISO date survives; anything else is dropped rather than sent on.
    expect(parsed.availableFrom).toBe('')
    expect(parsed.sort).toBe('relevance')
  })

  it('counts every active group, including booleans and dates', () => {
    expect(countActiveExpertFilters(DEFAULT_EXPERT_FILTERS)).toBe(0)
    // 9 list values (products has 2) + 5 thresholds + 2 product flags
    // + certificationCount + availableFrom + remoteOnly
    expect(countActiveExpertFilters(full)).toBe(19)
  })
})

describe('buildExpertListQuery', () => {
  it('repeats multi-value groups and maps names to the API contract', () => {
    const query = buildExpertListQuery(full, { search: 'crm', limit: 24, includeFacets: true })
    expect(query.getAll('product_id')).toEqual(['6c51b28e08b6', 'efb606289140'])
    expect(query.getAll('project_type')).toEqual(['CRM migration'])
    expect(query.getAll('region_served')).toEqual(['South Asia'])
    expect(query.get('min_hours_per_week')).toBe('20')
    expect(query.get('available_from')).toBe('2026-11-01')
    expect(query.get('remote_only')).toBe('true')
    // Depth qualifies product_id rather than standing on its own.
    expect(query.get('min_product_years')).toBe('6')
    expect(query.get('min_product_projects')).toBe('25')
    expect(query.get('product_primary_only')).toBe('true')
    expect(query.get('product_certified')).toBe('true')
    expect(query.get('certification_count')).toBe('2')
    expect(query.get('search')).toBe('crm')
    expect(query.get('include_facets')).toBe('true')
  })

  it('omits empty groups and never sends a page for the first page', () => {
    const query = buildExpertListQuery(DEFAULT_EXPERT_FILTERS, { page: 1 })
    expect(query.has('product_id')).toBe(false)
    expect(query.has('min_years')).toBe(false)
    expect(query.has('min_product_years')).toBe(false)
    expect(query.has('product_certified')).toBe(false)
    expect(query.has('certification_count')).toBe(false)
    expect(query.has('remote_only')).toBe(false)
    expect(query.has('page')).toBe(false)
  })

  it('sends entity_type only when exactly one is chosen, since the API is single-valued', () => {
    expect(buildExpertListQuery({ ...DEFAULT_EXPERT_FILTERS, entityTypes: ['business'] }).get('entity_type')).toBe(
      'business',
    )
    expect(
      buildExpertListQuery({ ...DEFAULT_EXPERT_FILTERS, entityTypes: ['business', 'individual'] }).has('entity_type'),
    ).toBe(false)
  })
})

describe('withProducts', () => {
  it('keeps depth while any product is still selected', () => {
    const next = withProducts(full, ['6c51b28e08b6'])

    expect(next.products).toEqual(['6c51b28e08b6'])
    expect(next.minimumProductYears).toBe(6)
    expect(next.productCertified).toBe(true)
    // Industries are offered per product, so a change of product clears them
    // rather than leaving a filter no visible option can switch off.
    expect(next.productIndustries).toEqual([])
  })

  it('drops depth when the last product goes', () => {
    // Depth is only reachable in the UI while a product is selected, so
    // leaving it set would filter invisibly.
    const next = withProducts(full, [])

    expect(next.products).toEqual([])
    expect(next.minimumProductYears).toBe(0)
    expect(next.minimumProductProjects).toBe(0)
    expect(next.primaryProductOnly).toBe(false)
    expect(next.productCertified).toBe(false)
    expect(next.productIndustries).toEqual([])
    // Everything else is left alone.
    expect(next.minimumYears).toBe(full.minimumYears)
    expect(next.certificationCount).toBe(full.certificationCount)
  })
})
