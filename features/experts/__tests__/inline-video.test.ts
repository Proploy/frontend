import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { InlineVideo } from '@/components/media/InlineVideo'

describe('InlineVideo', () => {
  it('renders an uploaded expert video service route as a playable video', () => {
    const markup = renderToStaticMarkup(
      createElement(InlineVideo, {
        url: 'http://localhost:8020/api/v1/experts/expert-1/links/link-1/file',
        title: 'Alex Tan intro video',
      }),
    )

    expect(markup).toContain('<video')
    expect(markup).toContain('src="http://localhost:8020/api/v1/experts/expert-1/links/link-1/file"')
    expect(markup).not.toContain('This video provider cannot be embedded.')
  })

  it('renders YouTube links in the privacy-preserving embed player', () => {
    const markup = renderToStaticMarkup(
      createElement(InlineVideo, {
        url: 'https://www.youtube.com/watch?v=abc123_XYz9',
        title: 'Alex Tan intro video',
      }),
    )

    expect(markup).toContain('<iframe')
    expect(markup).toContain('https://www.youtube-nocookie.com/embed/abc123_XYz9')
  })
})
