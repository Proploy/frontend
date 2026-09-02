import { describe, expect, it } from 'vitest'

import {
  applyProductFilterParams,
  parseProductFilterParams,
  searchParamsFromRecord,
  serializeProductFilterParams,
} from '../filter-params'
import {
  DEFAULT_PRODUCT_FILTERS,
  countActiveProductFilters,
  hasActiveProductFilters,
  type ProductFilterValues,
} from '../filter-values'

const fullValues: ProductFilterValues = {
  categoryTermIds: ['crm-root', 'sales'],
  pricingBuckets: ['free', 'freemium'],
  freePlan: true,
  freeTrial: false,
  sort: 'rating',
  companySize: ['smb', 'mid_market'],
  deploymentModel: ['cloud'],
  compliance: ['SOC2', 'PCI DSS'],
  integrations: ['Slack', 'Microsoft Teams'],
  industries: ['Retail & E-commerce'],
  implementationComplexity: ['low'],
  minRating: '4.5',
  maxStartingPrice: '30',
}

describe('product filter URL params', () => {
  it('round-trips every filter through the URL', () => {
    const params = applyProductFilterParams(new URLSearchParams('search=crm&mode=natural'), fullValues)
    expect(parseProductFilterParams(params)).toEqual(fullValues)
    // Search UI keys are left untouched.
    expect(params.get('search')).toBe('crm')
    expect(params.get('mode')).toBe('natural')
  })

  it('uses short readable keys and comma-joined lists', () => {
    expect(serializeProductFilterParams(fullValues)).toBe(
      'category=crm-root%2Csales&pricing=free%2Cfreemium&size=smb%2Cmid_market&deploy=cloud' +
        '&compliance=SOC2%2CPCI+DSS&integrations=Slack%2CMicrosoft+Teams' +
        '&industry=Retail+%26+E-commerce&complexity=low&min_rating=4.5&max_price=30' +
        '&free_plan=1&sort=rating',
    )
  })

  it('drops default values from the URL and removes stale keys', () => {
    const params = new URLSearchParams('pricing=free&free_trial=1&sort=rating&size=smb')
    applyProductFilterParams(params, DEFAULT_PRODUCT_FILTERS)
    expect(params.toString()).toBe('')
    expect(serializeProductFilterParams(DEFAULT_PRODUCT_FILTERS)).toBe('')
  })

  it('parses legacy URLs that only carry a category', () => {
    expect(parseProductFilterParams(new URLSearchParams('category=abc&search=jira'))).toEqual({
      ...DEFAULT_PRODUCT_FILTERS,
      categoryTermIds: ['abc'],
    })
  })

  it('ignores unknown sort, rating and price values and dedupes lists', () => {
    const parsed = parseProductFilterParams(
      new URLSearchParams('sort=bogus&min_rating=9&max_price=abc&size=smb,smb,%20enterprise%20,'),
    )
    expect(parsed.sort).toBe('name')
    expect(parsed.minRating).toBe('')
    expect(parsed.maxStartingPrice).toBe('')
    expect(parsed.companySize).toEqual(['smb', 'enterprise'])
  })

  it('treats free_plan=true and free_plan=1 as on', () => {
    expect(parseProductFilterParams(new URLSearchParams('free_plan=true')).freePlan).toBe(true)
    expect(parseProductFilterParams(new URLSearchParams('free_plan=1')).freePlan).toBe(true)
    expect(parseProductFilterParams(new URLSearchParams('free_plan=0')).freePlan).toBe(false)
  })

  it('converts Next.js searchParams records, taking the first of repeated keys', () => {
    const params = searchParamsFromRecord({ category: ['a', 'b'], pricing: 'free', empty: undefined })
    expect(params.get('category')).toBe('a')
    expect(params.get('pricing')).toBe('free')
    expect(params.has('empty')).toBe(false)
  })

  it('counts narrowing filters (including categories) but not sort', () => {
    expect(countActiveProductFilters(DEFAULT_PRODUCT_FILTERS)).toBe(0)
    expect(hasActiveProductFilters({ ...DEFAULT_PRODUCT_FILTERS, sort: 'rating' })).toBe(false)
    expect(hasActiveProductFilters({ ...DEFAULT_PRODUCT_FILTERS, categoryTermIds: ['x'] })).toBe(true)
    expect(countActiveProductFilters(fullValues)).toBe(16)
  })
})
