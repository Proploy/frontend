import { describe, expect, it } from 'vitest'

import { buildQueryString } from '../query'

describe('buildQueryString', () => {
  it('serializes defined scalar values', () => {
    expect(buildQueryString({
      category: 'crm',
      free_plan: false,
      limit: 20,
      offset: 0,
    })).toBe('category=crm&free_plan=false&limit=20&offset=0')
  })

  it('omits undefined and null values', () => {
    expect(buildQueryString({
      category: undefined,
      pricing_bucket: null,
      sort: 'name',
    })).toBe('sort=name')
  })
})
