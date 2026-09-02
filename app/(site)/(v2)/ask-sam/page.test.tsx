import { render } from '@/test/render'
import AskSamPage, { metadata } from './page'

const BRIEF_SECTIONS = [
  'Executive summary',
  'Business objectives',
  'Key requirements',
  'Shortlisted solutions',
  'Recommended solution',
  'Success criteria',
  'Next steps',
]

describe('Ask Sam branding page', () => {
  it('renders one h1, a single repeated CTA into the workspace, and the real brief sections', async () => {
    const { container, unmount } = await render(<AskSamPage />)

    expect(container.querySelectorAll('h1')).toHaveLength(1)
    expect(container.querySelector('h1')!.textContent).toContain('Describe the problem')

    // Hero + closing: the only CTA on the page, both pointing at the workspace.
    const ctas = Array.from(container.querySelectorAll('a[href="/AI_workspace"]'))
    expect(ctas).toHaveLength(2)
    ctas.forEach((a) => expect(a.textContent).toContain('Ask Sam'))
    expect(container.querySelector('form')).toBeNull()

    // Section order mirrors agent-harness project_brief_skill.py.
    const headings = Array.from(container.querySelectorAll('h3')).map((h) => h.textContent ?? '')
    const found = BRIEF_SECTIONS.map((s) => headings.findIndex((h) => h.includes(s)))
    found.forEach((idx) => expect(idx).toBeGreaterThanOrEqual(0))
    expect([...found].sort((a, b) => a - b)).toEqual(found)

    await unmount()
  })

  it('ships page metadata consistent with the other v2 pages', () => {
    expect(metadata.title).toBe('Ask Sam — Proploy')
    expect(metadata.openGraph?.title).toBe('Ask Sam — Proploy')
    expect(String(metadata.description)).not.toMatch(/lorem/i)
  })
})
