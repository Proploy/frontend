import { describe, expect, it } from 'vitest'

import {
  getNextProductPageOffset,
  mergeProductListPage,
} from '../pagination-state'
import type { CardProduct } from '../types'

function product(productId: string): CardProduct {
  return {
    product_id: productId,
    product_name: `Product ${productId}`,
    product_description: null,
    product_logo: null,
    rating: null,
    reviews: null,
    primary_category: null,
    vendor_name: null,
    free_plan_available: false,
    free_trial_available: false,
  }
}

describe('product pagination state', () => {
  it('requests the next batch from the number of already visible products', () => {
    expect(getNextProductPageOffset([product('p1'), product('p2')])).toBe(2)
  })

  it('appends load-more results without duplicating already visible products', () => {
    expect(
      mergeProductListPage({
        currentProducts: [product('p1'), product('p2')],
        incomingProducts: [product('p2'), product('p3')],
        offset: 2,
      }).map((item) => item.product_id),
    ).toEqual(['p1', 'p2', 'p3'])
  })

  it('replaces the list for a fresh first-page request', () => {
    expect(
      mergeProductListPage({
        currentProducts: [product('old')],
        incomingProducts: [product('new')],
        offset: 0,
      }).map((item) => item.product_id),
    ).toEqual(['new'])
  })
})
