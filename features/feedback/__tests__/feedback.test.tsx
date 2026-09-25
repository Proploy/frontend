import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render } from '@/test/render'

const pathname = vi.hoisted(() => ({ current: '/' }))
const auth = vi.hoisted(() => ({ user: null as null | { id: string; email?: string } }))
const submit = vi.hoisted(() => vi.fn())
const compare = vi.hoisted(() => ({ count: 0 }))

vi.mock('next/navigation', () => ({ usePathname: () => pathname.current }))
vi.mock('@/components/providers/auth-provider', () => ({ useAuth: () => auth }))
vi.mock('@/features/compare/selection-store', async importOriginal => ({
  ...(await importOriginal<typeof import('@/features/compare/selection-store')>()),
  useCompareSelection: () => ({ count: compare.count }),
}))
vi.mock('../client', async importOriginal => ({
  ...(await importOriginal<typeof import('../client')>()),
  submitFeedback: submit,
}))

import { readScreenshot, screenshotProblem } from '../client'
import { FeedbackWidget } from '../FeedbackWidget'

type View = Awaited<ReturnType<typeof render>>
let view: View | null = null

function button(name: string): HTMLButtonElement {
  const match = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find(
    el => (el.getAttribute('aria-label') ?? el.textContent?.trim()) === name,
  )
  if (!match) throw new Error(`no button named ${name}`)
  return match
}

function byLabel<T extends HTMLElement>(text: string | RegExp): T | null {
  const label = Array.from(document.querySelectorAll('label')).find(el =>
    typeof text === 'string' ? el.textContent?.trim() === text : text.test(el.textContent ?? ''),
  )
  if (!label) return null
  return (label.htmlFor ? document.getElementById(label.htmlFor) : label.querySelector('input')) as T | null
}

async function click(el: HTMLElement) {
  await act(async () => el.click())
}

async function type(el: HTMLTextAreaElement | HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')!.set!
  await act(async () => {
    setter.call(el, value)
    el.dispatchEvent(new Event('input', { bubbles: true }))
  })
}

async function openAndFill(message = 'The compare page is empty') {
  await click(button('Give feedback'))
  await type(byLabel<HTMLTextAreaElement>('Your feedback')!, message)
}

async function send() {
  await click(button('Send feedback'))
  await act(async () => {})
}

const alertText = () => document.querySelector('[role="alert"]')?.textContent ?? ''

describe('FeedbackWidget', () => {
  beforeEach(() => {
    pathname.current = '/'
    auth.user = null
    compare.count = 0
    submit.mockReset()
  })

  afterEach(async () => {
    await view?.unmount()
    view = null
  })

  it.each(['/', '/products', '/compare', '/experts/top', '/sign-in'])('shows on public page %s', async path => {
    pathname.current = path
    view = await render(<FeedbackWidget />)
    expect(button('Give feedback')).toBeTruthy()
  })

  it.each(['/workspace', '/dashboard', '/profile', '/experts/abc', '/auth/callback'])('hides on %s', async path => {
    pathname.current = path
    view = await render(<FeedbackWidget />)
    expect(view.container.innerHTML).toBe('')
  })

  it('lifts clear of the compare tray only while the tray shows', async () => {
    view = await render(<FeedbackWidget />)
    expect(button('Give feedback').hasAttribute('data-above-tray')).toBe(false)
    await view.unmount()

    compare.count = 2
    view = await render(<FeedbackWidget />)
    expect(button('Give feedback').hasAttribute('data-above-tray')).toBe(true)
    await view.unmount()

    pathname.current = '/compare'
    view = await render(<FeedbackWidget />)
    expect(button('Give feedback').hasAttribute('data-above-tray')).toBe(false)
  })

  it('submits anonymously and shows the confirmation', async () => {
    submit.mockResolvedValue({ ok: true, data: { id: 'f1', status: 'received' } })
    view = await render(<FeedbackWidget />)
    await openAndFill()
    await click(button('Idea'))
    await click(button('4 out of 5'))
    await send()

    expect(document.body.textContent).toContain('Thanks, we got it')
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({
      category: 'idea',
      rating: 4,
      message: 'The compare page is empty',
      email: null,
      website: null,
      attachment: null,
    }))
  })

  it('keeps the form and reports a failure instead of claiming success', async () => {
    submit.mockResolvedValue({ ok: false, status: 500, error: { code: 'X', message: 'boom' } })
    view = await render(<FeedbackWidget />)
    await openAndFill()
    await send()

    expect(alertText()).toMatch(/went wrong/)
    expect(document.body.textContent).not.toContain('Thanks, we got it')
    expect(byLabel<HTMLTextAreaElement>('Your feedback')!.value).toBe('The compare page is empty')
  })

  it('explains a rate limit', async () => {
    submit.mockResolvedValue({ ok: false, status: 429, error: { code: 'RATE', message: '' } })
    view = await render(<FeedbackWidget />)
    await openAndFill()
    await send()
    expect(alertText()).toMatch(/Too many/)
  })

  it('blocks a too-short message without calling the API', async () => {
    view = await render(<FeedbackWidget />)
    await openAndFill('short')
    await send()
    expect(alertText()).toMatch(/at least 10/)
    expect(submit).not.toHaveBeenCalled()
  })

  it('requires an email from an anonymous visitor who asks to be contacted', async () => {
    view = await render(<FeedbackWidget />)
    await openAndFill()
    await click(byLabel<HTMLInputElement>(/You can contact me/)!)
    await send()
    expect(alertText()).toMatch(/email/)
    expect(submit).not.toHaveBeenCalled()
  })

  it('does not ask a signed-in user for an email', async () => {
    auth.user = { id: 'u1', email: 'sam@acme.io' }
    submit.mockResolvedValue({ ok: true, data: { id: 'f1', status: 'received' } })
    view = await render(<FeedbackWidget />)
    await openAndFill()
    expect(byLabel(/^Email/)).toBeNull()
    expect(document.body.textContent).toContain('Sending as sam@acme.io.')
    await send()
    expect(submit).toHaveBeenCalledWith(expect.objectContaining({ email: null }))
  })
})

describe('screenshots', () => {
  it('rejects the wrong type and oversize files', () => {
    expect(screenshotProblem(new File(['x'], 'a.gif', { type: 'image/gif' }))).toMatch(/PNG/)
    const big = new File([new Uint8Array(5 * 1024 * 1024 + 1)], 'a.png', { type: 'image/png' })
    expect(screenshotProblem(big)).toMatch(/5 MB/)
    expect(screenshotProblem(new File(['x'], 'a.png', { type: 'image/png' }))).toBeNull()
  })

  it('base64-encodes the file bytes', async () => {
    const file = new File([new Uint8Array([0x89, 0x50, 0x4e, 0x47])], 'shot.png', { type: 'image/png' })
    await expect(readScreenshot(file)).resolves.toEqual({
      filename: 'shot.png',
      contentType: 'image/png',
      dataBase64: 'iVBORw==',
    })
  })
})
