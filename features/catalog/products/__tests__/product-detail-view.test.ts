import { describe, expect, it } from 'vitest'

import {
  classifyProductMediaAsset,
  getMediaAutoplayDuration,
  getProductDetailHref,
  getProductDetailTabs,
  getProductHeroMedia,
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
      'features',
      'media',
      'experts',
    ])
  })
})

describe('getProductDetailHref', () => {
  it('uses the canonical plural product route and encodes the id', () => {
    expect(getProductDetailHref('product/id')).toBe('/products/product%2Fid')
  })
})

describe('getMediaAutoplayDuration', () => {
  it('holds images for 5 seconds', () => {
    expect(getMediaAutoplayDuration('image')).toBe(5_000)
  })

  it('holds GIFs for 8 seconds so the looped animation is visible', () => {
    expect(getMediaAutoplayDuration('gif')).toBe(8_000)
  })

  it('returns 0 for videos so they drive their own advance via the ended event', () => {
    expect(getMediaAutoplayDuration('video')).toBe(0)
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
        assetKind: 'video',
        mimeType: 'video/mp4',
      },
    ])
  })

  it('recognizes videos and GIFs from MIME types, URL extensions, and hosted players', () => {
    expect(classifyProductMediaAsset({
      asset_kind: 'screenshot',
      mime_type: null,
      public_url: 'https://cdn.example.com/demo.webm?download=1',
    })).toBe('video')
    expect(classifyProductMediaAsset({
      asset_kind: 'screenshot',
      mime_type: 'image/gif; charset=binary',
      public_url: 'https://cdn.example.com/animation',
    })).toBe('gif')
    expect(classifyProductMediaAsset({
      asset_kind: 'screenshot',
      mime_type: null,
      public_url: 'https://www.youtube.com/watch?v=abc123',
    })).toBe('video')
  })

  it('uses the first non-logo image as the hero media', () => {
    expect(getProductHeroMedia([
      {
        media_id: 'logo',
        asset_kind: 'logo',
        public_url: 'https://example.com/logo.svg',
        mime_type: 'image/svg+xml',
        width: null,
        height: null,
        alt_text: 'Logo',
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
        display_order: 0,
      },
      {
        media_id: 'hero',
        asset_kind: 'screenshot',
        public_url: 'https://example.com/hero.png',
        mime_type: 'image/png',
        width: null,
        height: null,
        alt_text: 'Hero',
        display_order: 1,
      },
    ])?.id).toBe('hero')
  })
})
