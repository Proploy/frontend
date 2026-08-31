import { describe, expect, it, vi } from 'vitest'

import { render } from '@/test/render'
import { getEmbeddedProductVideoUrl, ProductMediaVideo } from './ProductMediaVideo'

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

describe('ProductMediaVideo', () => {
  it('forwards onEnded to the native video element for direct files', async () => {
    const onEnded = vi.fn()
    const { container, unmount } = await render(
      <ProductMediaVideo
        src="https://cdn.example.com/demo.mp4"
        title="Demo"
        autoPlay
        muted
        onEnded={onEnded}
      />,
    )

    const video = container.querySelector('video')
    expect(video).not.toBeNull()
    expect(video!.muted).toBe(true)

    video!.dispatchEvent(new Event('ended'))
    expect(onEnded).toHaveBeenCalledTimes(1)

    await unmount()
  })

  it('does not set loop when auto-rotating hero videos must end to advance', async () => {
    const { container, unmount } = await render(
      <ProductMediaVideo
        src="https://cdn.example.com/demo.mp4"
        title="Demo"
        autoPlay
        muted
        loop={false}
        controls={false}
      />,
    )

    const video = container.querySelector('video')
    expect(video!.loop).toBe(false)
    expect(video!.controls).toBe(false)

    await unmount()
  })
})
