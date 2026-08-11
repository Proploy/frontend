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

vi.mock('@/components/ListingExplorer', () => ({
  default: ({
    productFilters,
    onProductFiltersChange,
    onSearchChange,
  }: {
    productFilters?: ProductFilterValues
    onProductFiltersChange?: (
      values: ProductFilterValues,
    ) => void
    onSearchChange?: () => void
  }) => (
    <div>
      <output data-testid="product-filters">
        {JSON.stringify(productFilters)}
      </output>
      <button
        type="button"
        onClick={() =>
          productFilters &&
          onProductFiltersChange?.({
            ...productFilters,
            freePlan: true,
          })
        }
      >
        Apply free plan
      </button>
      <button type="button" onClick={onSearchChange}>
        Change search
      </button>
      <button
        type="button"
        onClick={() =>
          productFilters &&
          onProductFiltersChange?.({
            ...productFilters,
            categoryTermId: '',
          })
        }
      >
        Clear category
      </button>
    </div>
  ),
}))

vi.mock('@/components/Footer', () => ({
  default: () => null,
}))

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

describe('ProductsPage filter state', () => {
  beforeEach(() => {
    mocks.push.mockReset()
    mocks.searchParams = 'search=crm&category=ai'
    mocks.productRequests = []
  })

  it('resets a loaded-more offset when URL search and category change without clearing filters', async () => {
    const view = await render(<ProductsHarness />)
    const findButton = (label: string) =>
      Array.from(
        view.container.querySelectorAll<HTMLButtonElement>('button'),
      ).find((button) => button.textContent === label)

    await act(async () => findButton('Apply free plan')?.click())
    await act(async () =>
      findButton('Load more products')?.click(),
    )
    expect(mocks.productRequests.at(-1)).toMatchObject({
      search: 'crm',
      free_plan: true,
      offset: 1,
    })

    await act(async () =>
      findButton('Browser history search')?.click(),
    )
    expect(mocks.productRequests.at(-1)).toMatchObject({
      search: 'new',
      category: 'sales',
      free_plan: true,
      offset: 0,
    })
    await view.unmount()
  })

  it('preserves applied product filters when search pagination resets', async () => {
    const view = await render(<ProductsPage />)
    const findButton = (label: string) =>
      Array.from(
        view.container.querySelectorAll<HTMLButtonElement>('button'),
      ).find((button) => button.textContent === label)

    await act(async () => findButton('Apply free plan')?.click())
    expect(
      view.container.querySelector('[data-testid="product-filters"]')
        ?.textContent,
    ).toContain('"freePlan":true')

    await act(async () => findButton('Change search')?.click())
    expect(
      view.container.querySelector('[data-testid="product-filters"]')
        ?.textContent,
    ).toContain('"freePlan":true')
    await view.unmount()
  })

  it('removes only the category parameter when category is cleared', async () => {
    const view = await render(<ProductsPage />)
    const clearCategory = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent === 'Clear category')

    await act(async () => clearCategory?.click())

    expect(mocks.push).toHaveBeenCalledWith('/products?search=crm')
    await view.unmount()
  })
})
