import { describe, expect, it } from 'vitest'

import {
  getProductDetailHref,
  getProductDetailTabs,
  mapMediaAssetsToPreview,
} from '../product-detail-view'
import type { ProductPageModel } from '../types'

const product = {
  pricing_plans: [],
  ratings: [],
  integration_labels: [],
  core_features: [],
  media: [],
} as unknown as ProductPageModel

describe('getProductDetailTabs', () => {
  it('does not expose unsupported alternatives', () => {
    expect(getProductDetailTabs(product).map((tab) => tab.key)).not.toContain('alternatives')
  })

  it('keeps supported sections available even when they are empty', () => {
    expect(getProductDetailTabs(product).map((tab) => tab.key)).toEqual([
      'product-information',
      'integrations',
      'pricing',
      'reviews',
      'features',
      'media',
    ])
  })
})

describe('getProductDetailHref', () => {
  it('uses the canonical plural product route and encodes the id', () => {
    expect(getProductDetailHref('product/id')).toBe('/products/product%2Fid')
  })
})

describe('mapMediaAssetsToPreview', () => {
  it('drops assets without public URLs', () => {
    expect(mapMediaAssetsToPreview([
      {
        media_id: 'missing',
        asset_kind: 'screenshot',
        public_url: null,
        mime_type: null,
        width: null,
        height: null,
        alt_text: null,
        display_order: 0,
      },
      {
        media_id: 'video',
        asset_kind: 'video',
        public_url: 'https://example.com/demo.mp4',
        mime_type: 'video/mp4',
        width: null,
        height: null,
        alt_text: 'Demo',
        display_order: 1,
      },
    ])).toEqual([
      {
        id: 'video',
        url: 'https://example.com/demo.mp4',
        type: 'video',
        alt: 'Demo',
      },
    ])
  })
})
