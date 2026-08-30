import { useState } from 'react'
import { render } from '@/test/render'
import type { SearchMode } from '@/features/catalog'
import { ProductSearch } from './ProductSearch'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  keywordSearch: vi.fn(),
  naturalSearch: vi.fn(),
  product: {
    product_id: 'p-1',
    product_name: 'QuickBooks',
    product_description: null,
    product_logo: null,
    rating: null,
    reviews: null,
    primary_category: 'Accounting',
    vendor_name: 'Intuit',
    free_plan_available: false,
    free_trial_available: true,
  },
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
}))

vi.mock('@/features/catalog', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@/features/catalog')>()
  return {
    ...original,
    getProductDetailHref: (id: string) => `/products/${id}`,
    useKeywordSearch: () => ({
      products: [mocks.product],
      loading: false,
      error: null,
      suggestedCorrection: null,
      ghostSuffix: null,
      fullCompletion: null,
      search: mocks.keywordSearch,
      clear: vi.fn(),
    }),
    useNaturalSearch: () => ({
      products: [mocks.product],
      loading: false,
      error: null,
      note: 'Showing keyword matches',
      search: mocks.naturalSearch,
      clear: vi.fn(),
    }),
  }
})

function Harness({ initialMode = 'keyword' }: { initialMode?: SearchMode }) {
  const [query, setQuery] = useState('')
  const [mode] = useState<SearchMode>(initialMode)
  return (
    <ProductSearch
      query={query}
      onQueryChange={setQuery}
      mode={mode}
      variant="embedded"
    />
  )
}

function changeInput(container: HTMLElement, value: string) {
  const input = container.querySelector('input')
  expect(input).not.toBeNull()
  const setValue = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )!.set!
  setValue.call(input, value)
  input!.dispatchEvent(new Event('input', { bubbles: true }))
}

function submitForm(container: HTMLElement) {
  const input = container.querySelector('input')
  expect(input).not.toBeNull()
  input!.form!.dispatchEvent(
    new Event('submit', { bubbles: true, cancelable: true }),
  )
}

describe('ProductSearch — keyword mode', () => {
  it('has no search button — results appear as you type', async () => {
    const { container, unmount } = await render(<Harness />)
    expect(container.querySelector('button[type="submit"]')).toBeNull()
    expect(container.textContent).not.toContain('Find your software')
    await unmount()
  })

  it('queries the keyword API from 2 characters and shows real products', async () => {
    const { container, unmount } = await render(<Harness />)
    const { act } = await import('react-dom/test-utils')

    await act(async () => {
      changeInput(container, 'quick')
    })

    expect(mocks.keywordSearch).toHaveBeenCalledWith('quick', 6)
    expect(container.textContent).toContain('QuickBooks')
    await unmount()
  })

  it('takes Enter straight to the products page without a natural flag', async () => {
    const { container, unmount } = await render(<Harness />)
    const { act } = await import('react-dom/test-utils')

    await act(async () => changeInput(container, 'quick'))
    await act(async () => submitForm(container))

    expect(mocks.push).toHaveBeenCalledWith('/products?search=quick')
    await unmount()
  })
})

describe('ProductSearch — natural mode', () => {
  it('queries the natural API and flags the search mode on submit', async () => {
    const { container, unmount } = await render(<Harness initialMode="natural" />)
    const { act } = await import('react-dom/test-utils')

    await act(async () => changeInput(container, 'invoicing'))

    expect(mocks.naturalSearch).toHaveBeenCalledWith('invoicing', 6)
    expect(container.textContent).toContain('Showing keyword matches')

    await act(async () => submitForm(container))
    expect(mocks.push).toHaveBeenCalledWith('/products?search=invoicing&mode=natural')
    await unmount()
  })
})