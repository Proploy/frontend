import { act, useState } from 'react'
import { render } from '@/test/render'
import type { ProductFilterValues } from '@/components/filters/ProductFiltersDrawer'
import ProductsPage from './page'

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
  searchParams: 'search=crm&category=ai',
  productRequests: [] as Array<Record<string, unknown>>,
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mocks.push }),
  useSearchParams: () => new URLSearchParams(mocks.searchParams),
}))

vi.mock('@/features/catalog', async (importOriginal) => {
  const original =
    await importOriginal<typeof import('@/features/catalog')>()
  return {
    ...original,
    useCategoryTree: () => ({
      tree: [],
      loading: false,
      error: null,
    }),
    useKeywordSearch: () => ({
      products: [],
      loading: false,
      error: null,
      suggestedCorrection: null,
      ghostSuffix: null,
      fullCompletion: null,
      search: vi.fn(),
      clear: vi.fn(),
    }),
    useProductList: (request: Record<string, unknown>) => {
      mocks.productRequests.push(request)
      return {
        products: [
          {
            product_id: 'product-1',
            product_name: 'Product One',
            product_description: 'Description',
            product_logo: null,
            rating: null,
            reviews: null,
            primary_category: 'Software',
            vendor_name: 'Vendor',
            free_plan_available: false,
            free_trial_available: false,
          },
        ],
        loading: false,
        error: null,
        pagination: { hasNextPage: true },
        refetch: vi.fn(),
      }
    },
  }
})

// The filters drawer is the page's filter entry point; the mock exposes the
// received values and an apply action, mirroring how the real drawer calls
// onApply with a draft.
vi.mock('@/components/filters/ProductFiltersDrawer', async (importOriginal) => {
  const original = await importOriginal<
    typeof import('@/components/filters/ProductFiltersDrawer')
  >()
  return {
    ...original,
    ProductFiltersDrawer: ({
      values,
      onApply,
      onClose,
    }: {
      values: ProductFilterValues
      onApply: (values: ProductFilterValues) => void
      onClose: () => void
    }) => (
      <div>
        <output data-testid="product-filters">{JSON.stringify(values)}</output>
        <button
          type="button"
          onClick={() => {
            onApply({ ...values, freePlan: true })
            onClose()
          }}
        >
          Apply free plan
        </button>
      </div>
    ),
  }
})

vi.mock('@/components/site/Nav', () => ({ Nav: () => null }))
vi.mock('@/components/site/Footer', () => ({ Footer: () => null }))

vi.mock('@/components/personalization/FavoriteToggle', () => ({
  default: () => null,
}))

vi.mock('@/components/compare/CompareToggle', () => ({
  default: () => null,
}))

function ProductsHarness() {
  const [, setRevision] = useState(0)
  return (
    <>
      <button
        type="button"
        onClick={() => {
          mocks.searchParams = 'search=new&category=sales'
          setRevision((revision) => revision + 1)
        }}
      >
        Browser history search
      </button>
      <ProductsPage />
    </>
  )
}

function findButton(container: HTMLElement, label: string) {
  return Array.from(
    container.querySelectorAll<HTMLButtonElement>('button'),
  ).find((button) => button.textContent?.trim() === label)
}

async function applyFreePlan(container: HTMLElement) {
  await act(async () => findButton(container, 'More filters')?.click())
  await act(async () => findButton(container, 'Apply free plan')?.click())
}

describe('ProductsPage filter state', () => {
  beforeEach(() => {
    mocks.push.mockReset()
    mocks.searchParams = 'search=crm&category=ai'
    mocks.productRequests = []
  })

  it('resets a loaded-more offset when URL search and category change without clearing filters', async () => {
    const view = await render(<ProductsHarness />)

    await applyFreePlan(view.container)
    await act(async () =>
      findButton(view.container, 'Load more products')?.click(),
    )
    expect(mocks.productRequests.at(-1)).toMatchObject({
      search: 'crm',
      free_plan: true,
      offset: 1,
    })

    await act(async () =>
      findButton(view.container, 'Browser history search')?.click(),
    )
    expect(mocks.productRequests.at(-1)).toMatchObject({
      search: 'new',
      category: 'sales',
      free_plan: true,
      offset: 0,
    })
    await view.unmount()
  })

  it('preserves applied product filters when a new search resets pagination', async () => {
    const view = await render(<ProductsPage />)

    await applyFreePlan(view.container)
    expect(mocks.productRequests.at(-1)).toMatchObject({ free_plan: true })

    const searchInput = view.container.querySelector<HTMLInputElement>(
      '.pp-search input',
    )
    expect(searchInput).toBeTruthy()
    await act(async () => {
      const setValue = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )!.set!
      setValue.call(searchInput, 'billing')
      searchInput!.dispatchEvent(new Event('input', { bubbles: true }))
      searchInput!.form!.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })

    // Navigation is pushed with the new search while the free-plan filter is
    // still applied to the request state.
    expect(mocks.push).toHaveBeenCalledWith(
      expect.stringContaining('search=billing'),
    )
    expect(mocks.productRequests.at(-1)).toMatchObject({ free_plan: true })
    await view.unmount()
  })

  it('removes only the category parameter when the category tag is cleared', async () => {
    const view = await render(<ProductsPage />)
    const clearCategory = view.container.querySelector<HTMLButtonElement>(
      'button[aria-label="Remove Selected category"]',
    )
    expect(clearCategory).toBeTruthy()

    await act(async () => clearCategory?.click())

    expect(mocks.push).toHaveBeenCalledWith('/products?search=crm')
    await view.unmount()
  })
})
