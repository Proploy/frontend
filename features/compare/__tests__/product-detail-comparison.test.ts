import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { buildComparisonAdditions } from '@/components/product/product-detail-comparison'

describe('product detail comparison', () => {
  it('keeps the viewed product first when adding an alternative', () => {
    const current = { product_id: 'current', product_name: 'Current', product_logo: null }
    const alternative = { product_id: 'alternative', product_name: 'Alternative', product_logo: null }

    expect(buildComparisonAdditions(current, alternative)).toEqual([current, alternative])
  })

  it('does not add the viewed product until a recommendation is compared', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'components/product/ProductDetailExperience.tsx'),
      'utf8',
    )

    expect(source).not.toContain('autoAddedProductIdRef')
    expect(source).not.toContain('addMany([currentComparisonProduct])')
    expect(source).not.toContain('alternatives.length > 0) && (')
    expect(source).toContain('Recommended products')
  })
})
