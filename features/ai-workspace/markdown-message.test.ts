import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { MarkdownMessage } from '@/components/ai-workspace/MarkdownMessage'

describe('MarkdownMessage', () => {
  it('renders common Markdown and GFM without rendering raw HTML', () => {
    const html = renderToStaticMarkup(
      React.createElement(MarkdownMessage, {
        content: [
          '## Result',
          '',
          '- One',
          '- Two',
          '',
          '| Product | Score |',
          '| --- | --- |',
          '| Notion | 92 |',
          '',
          '```ts',
          'const product = "Notion"',
          '```',
          '',
          '<script>alert("unsafe")</script>',
        ].join('\n'),
      }),
    )

    expect(html).toContain('<h2')
    expect(html).toContain('<ul')
    expect(html).toContain('<table')
    expect(html).toContain('<pre')
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })

  it('adds safe attributes to external links', () => {
    const html = renderToStaticMarkup(
      React.createElement(MarkdownMessage, {
        content: '[Catalog](https://example.com/catalog)',
      }),
    )

    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noreferrer noopener"')
  })
})
