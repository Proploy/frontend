import { describe, expect, it } from 'vitest'

import { mergeSelectedProducts } from '../selection-store'

const product = (product_id: string) => ({
  product_id,
  product_name: product_id,
  product_logo: null,
})

describe('mergeSelectedProducts', () => {
  it('adds the current product and alternative without removing an existing selection', () => {
    expect(
      mergeSelectedProducts([product('current')], [product('current'), product('alternative')]),
    ).toHaveLength(2)
  })

  it('deduplicates ids and keeps the four-product cap', () => {
    const next = mergeSelectedProducts(
      ['1', '2', '3'].map(product),
      [product('4'), product('5')],
    )

    expect(next.map((item) => item.product_id)).toEqual(['1', '2', '3', '4'])
  })
})
