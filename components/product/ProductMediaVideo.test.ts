import { describe, expect, it } from 'vitest'

import { getEmbeddedProductVideoUrl } from './ProductMediaVideo'

describe('getEmbeddedProductVideoUrl', () => {
  it('converts supported hosted video URLs to embeddable sources', () => {
    expect(getEmbeddedProductVideoUrl('https://youtu.be/abc123')).toBe(
      'https://www.youtube.com/embed/abc123',
    )
    expect(getEmbeddedProductVideoUrl('https://vimeo.com/123456')).toBe(
      'https://player.vimeo.com/video/123456',
    )
    expect(getEmbeddedProductVideoUrl('https://www.loom.com/share/loom-id')).toBe(
      'https://www.loom.com/embed/loom-id',
    )
  })

  it('leaves direct video files for the native video element', () => {
    expect(getEmbeddedProductVideoUrl('https://cdn.example.com/demo.mp4')).toBeNull()
    expect(getEmbeddedProductVideoUrl('not a URL')).toBeNull()
  })
})
