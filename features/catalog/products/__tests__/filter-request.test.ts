import { describe, expect, it } from 'vitest'

import { DEFAULT_EXPERT_FILTERS } from '@/components/filters/ExpertFiltersDrawer'
import { DEFAULT_PRODUCT_FILTERS } from '@/components/filters/ProductFiltersDrawer'
import { buildProductListRequest } from '../filter-request'

describe('catalog filter requests', () => {
  it('maps the Explore Products filter state to service query parameters', () => {
    expect(
      buildProductListRequest({
        categoryTermId: 'crm',
        search: 'asana',
        pricingBucket: 'free',
        freePlan: true,
        freeTrial: false,
        sort: 'rating',
        limit: 15,
        offset: 0,
      }),
    ).toEqual({
      category: 'crm',
      search: 'asana',
      pricing_bucket: 'free',
      free_plan: true,
      free_trial: undefined,
      sort: 'rating',
      limit: 15,
      offset: 0,
    })
  })

  it('keeps the reference filter defaults deterministic', () => {
    expect(DEFAULT_PRODUCT_FILTERS).toEqual({
      categoryTermId: '',
      pricingBucket: '',
      freePlan: false,
      freeTrial: false,
      sort: 'name',
    })
    expect(DEFAULT_EXPERT_FILTERS).toEqual({
      location: '',
      entityType: '',
      minimumYears: 0,
      platform: '',
      industry: '',
      projectType: '',
      sort: 'relevance',
    })
  })
})
