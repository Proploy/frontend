import { describe, expect, it } from 'vitest'
import {
  DEFAULT_FILTERS,
  PATH_META,
  TABS,
  TYPE_META,
} from '../data'

describe('lib/compare/data', () => {
  it('keeps the comparison product-only', () => {
    expect(Object.keys(TYPE_META)).toEqual(['product'])
    expect([...TABS]).toEqual([
      'At a glance',
      'Pricing',
      'Fit',
      'Implementation',
      'Reviews',
      'Alternatives',
    ])
  })

  it('contains metadata for every recommended path', () => {
    expect(Object.keys(PATH_META).sort()).toEqual([
      'Expert-led implementation',
      'Guided setup',
      'Self-serve',
      'White-glove project',
    ])
  })

  it('starts with neutral filters instead of prototype buyer context', () => {
    expect(DEFAULT_FILTERS).toEqual({
      category: null,
      companySize: null,
      budget: null,
      region: null,
    })
  })
})
