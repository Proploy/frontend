import { act } from 'react'

import { render } from '@/test/render'
import { ProductSearch } from './ProductSearch'
import { CLEARED_MS, DELETE_MS, HOLD_MS, TYPE_MS } from './use-typed-placeholder'

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }))
vi.mock('@/features/catalog', async () => {
  const actual = await vi.importActual<Record<string, unknown>>('@/features/catalog')
  const idle = {
    products: [], loading: false, error: null, suggestedCorrection: null,
    ghostSuffix: null, fullCompletion: null, note: null,
    search: vi.fn(), clear: vi.fn(),
  }
  return { ...actual, useKeywordSearch: () => idle, useNaturalSearch: () => idle }
})

const PHRASES = ['ab', 'cd'] as const

function Harness() {
  return (
    <ProductSearch
      query=""
      onQueryChange={() => {}}
      mode="keyword"
      variant="embedded"
      placeholderPhrases={PHRASES}
    />
  )
}

function placeholderOf(container: HTMLElement) {
  return container.querySelector('input')!.getAttribute('placeholder')
}

async function tick(ms: number) {
  await act(async () => {
    vi.advanceTimersByTime(ms)
  })
}

/** n separate ticks — one act flush each, since the effect schedules the next
 *  timer only after the previous state lands. */
async function ticks(n: number, ms: number) {
  for (let i = 0; i < n; i += 1) await tick(ms)
}

describe('ProductSearch — animated placeholder', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('types an example query out one character at a time', async () => {
    const { container, unmount } = await render(<Harness />)

    await tick(TYPE_MS)
    expect(placeholderOf(container)).toBe('a')
    await tick(TYPE_MS)
    expect(placeholderOf(container)).toBe('ab')

    await unmount()
  })

  it('erases the finished phrase and types the next one', async () => {
    const { container, unmount } = await render(<Harness />)

    await ticks(2, TYPE_MS)
    expect(placeholderOf(container)).toBe('ab')

    // Hold, then the two phase flips either side of it, then erase.
    await tick(HOLD_MS)
    expect(placeholderOf(container)).toBe('ab')
    await tick(DELETE_MS)
    expect(placeholderOf(container)).toBe('ab')
    await tick(DELETE_MS)
    expect(placeholderOf(container)).toBe('a')
    await tick(DELETE_MS)
    expect(placeholderOf(container)).toBe('')

    // Wraps to the second example rather than stopping.
    await tick(CLEARED_MS)
    await tick(TYPE_MS)
    expect(placeholderOf(container)).toBe('c')

    await unmount()
  })

  it('stops the reel while the field is focused, so it never types under you', async () => {
    const { container, unmount } = await render(<Harness />)
    const input = container.querySelector('input')!

    await tick(TYPE_MS)
    expect(placeholderOf(container)).toBe('a')

    await act(async () => {
      input.focus()
    })
    // Falls back to the static prompt and stays there.
    expect(placeholderOf(container)).toBe('What are you trying to solve?')
    await ticks(10, TYPE_MS)
    expect(placeholderOf(container)).toBe('What are you trying to solve?')

    await unmount()
  })

  it('shows a static placeholder when reduced motion is requested', async () => {
    const original = window.matchMedia
    window.matchMedia = ((q: string) => ({
      matches: q.includes('prefers-reduced-motion'),
      media: q, addEventListener() {}, removeEventListener() {},
      addListener() {}, removeListener() {}, onchange: null,
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia

    const { container, unmount } = await render(<Harness />)
    await ticks(10, TYPE_MS)
    expect(placeholderOf(container)).toBe('What are you trying to solve?')

    await unmount()
    window.matchMedia = original
  })
})
