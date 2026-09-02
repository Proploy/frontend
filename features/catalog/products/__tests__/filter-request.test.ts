import { describe, expect, it } from 'vitest'

import { DEFAULT_EXPERT_FILTERS } from '@/components/filters/ExpertFiltersDrawer'
import { DEFAULT_PRODUCT_FILTERS } from '@/components/filters/ProductFiltersDrawer'
import { buildProductFilterRequest, buildProductListRequest } from '../filter-request'

describe('catalog filter requests', () => {
  it('maps the Explore Products filter state to service query parameters', () => {
    expect(
      buildProductListRequest({
        ...DEFAULT_PRODUCT_FILTERS,
        categoryTermIds: ['crm'],
        search: 'asana',
        pricingBuckets: ['free', 'freemium'],
        freePlan: true,
        freeTrial: false,
        integrations: ['Slack'],
        industries: ['Healthcare'],
        implementationComplexity: ['low'],
        minRating: '4.5',
        maxStartingPrice: '30',
        sort: 'rating',
        limit: 15,
        offset: 0,
      }),
    ).toEqual({
      category: ['crm'],
      search: 'asana',
      pricing_bucket: ['free', 'freemium'],
      free_plan: true,
      free_trial: undefined,
      company_size: undefined,
      deployment_model: undefined,
      compliance: undefined,
      integration: ['Slack'],
      industry: ['Healthcare'],
      implementation_complexity: ['low'],
      min_rating: 4.5,
      max_starting_price_usd: 30,
      sort: 'rating',
      limit: 15,
      offset: 0,
    })
  })

  it('sends nothing for default filters so the list is unfiltered', () => {
    const request = buildProductFilterRequest(DEFAULT_PRODUCT_FILTERS)
    expect(Object.values(request).every((value) => value === undefined)).toBe(true)
  })

  it('treats a zero price ceiling as a real filter (free to start)', () => {
    expect(buildProductFilterRequest({ ...DEFAULT_PRODUCT_FILTERS, maxStartingPrice: '0' }).max_starting_price_usd).toBe(0)
  })

  it('keeps the reference filter defaults deterministic', () => {
    expect(DEFAULT_PRODUCT_FILTERS).toEqual({
      categoryTermIds: [],
      pricingBuckets: [],
      companySize: [],
      compliance: [],
      deploymentModel: [],
      integrations: [],
      industries: [],
      implementationComplexity: [],
      minRating: '',
      maxStartingPrice: '',
      freePlan: false,
      freeTrial: false,
      sort: 'name',
    })
    expect(DEFAULT_EXPERT_FILTERS).toEqual({
      platforms: [],
      industries: [],
      projectTypes: [],
      countries: [],
      entityTypes: [],
      minimumYears: 0,
      sort: 'relevance',
    })
  })
})
