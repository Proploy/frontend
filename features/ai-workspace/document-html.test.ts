// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'

import { sanitizeDocumentHtml } from './document-html'

describe('sanitizeDocumentHtml', () => {
  it('keeps document structure and classes', () => {
    const html = '<h2 class="text-lg font-bold">Overview</h2><table class="w-full"><tbody><tr><td class="p-2">Linear</td></tr></tbody></table>'
    expect(sanitizeDocumentHtml(html)).toBe(html)
  })

  it('drops executable content and handlers', () => {
    const out = sanitizeDocumentHtml(
      '<p onclick="alert(1)">hi</p><script>alert(1)</script><iframe src="x"></iframe><a href="javascript:alert(1)">bad</a><div style="background:url(http://x)">s</div>',
    )
    expect(out).not.toContain('<script')
    expect(out).not.toContain('<iframe')
    expect(out).not.toContain('onclick')
    expect(out).not.toContain('javascript:')
    expect(out).not.toContain('url(')
    expect(out).toContain('<p>hi</p>')
    expect(out).toContain('rel="noopener noreferrer"')
  })

  it('returns nothing for empty input', () => {
    expect(sanitizeDocumentHtml('')).toBe('')
  })
})
