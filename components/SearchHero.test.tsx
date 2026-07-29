import { act } from 'react'
import { render } from '@/test/render'
import type { CategoryNode } from '@/features/catalog'
import SearchHero from './SearchHero'

const categoryTree: CategoryNode[] = [
  {
    term_id: 'ai',
    taxonomy_type: 'ui_category',
    slug: 'ai',
    label: 'AI',
    description: null,
    parent_term_id: null,
    product_count: 12,
    children: [
      {
        term_id: 'ai-assistants',
        taxonomy_type: 'product_category',
        slug: 'ai-assistants',
        label: 'AI Assistants',
        description: null,
        parent_term_id: 'ai',
        product_count: 7,
        children: [
          {
            term_id: 'ai-search',
            taxonomy_type: 'product_category',
            slug: 'ai-search',
            label: 'AI Search',
            description: null,
            parent_term_id: 'ai-assistants',
            product_count: 3,
            children: [],
          },
        ],
      },
    ],
  },
]

describe('SearchHero product categories', () => {
  it('renders nested categories from the category quick filter and applies a descendant', async () => {
    const onCategorySelect = vi.fn()
    const productCategoryProps = {
      productCategoryTree: categoryTree,
      productCategoriesLoading: false,
      productCategoriesError: false,
      selectedCategoryTermId: '',
      onCategorySelect,
    }
    const view = await render(
      <SearchHero kind="products" {...productCategoryProps} />,
    )

    const trigger =
      view.container.querySelector<HTMLButtonElement>(
        'button[data-category-trigger="true"]',
      )
    await act(async () => trigger?.focus())
    expect(view.container.textContent).toContain('AI')
    const root = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent?.trim() === 'AI')
    await act(async () => root?.focus())
    expect(root?.getAttribute('aria-expanded')).toBe('true')

    const parentCategory = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) =>
      button.textContent?.includes('AI Assistants'),
    )
    await act(async () => parentCategory?.focus())
    expect(parentCategory?.getAttribute('aria-expanded')).toBe('true')

    const nestedCategory = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent?.includes('AI Search'))

    expect(nestedCategory).toBeDefined()
    await act(async () => nestedCategory?.click())
    expect(onCategorySelect).toHaveBeenCalledWith('ai-search')
    await view.unmount()
  })

  it('opens the category menu on focus and dismisses it with Escape', async () => {
    const productCategoryProps = {
      productCategoryTree: categoryTree,
      productCategoriesLoading: false,
      productCategoriesError: false,
      selectedCategoryTermId: '',
      onCategorySelect: vi.fn(),
    }
    const view = await render(
      <SearchHero kind="products" {...productCategoryProps} />,
    )
    const trigger =
      view.container.querySelector<HTMLButtonElement>(
        'button[data-category-trigger="true"]',
      )

    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    await act(async () => trigger?.focus())
    expect(trigger?.getAttribute('aria-expanded')).toBe('true')

    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape' }),
      )
    })
    expect(trigger?.getAttribute('aria-expanded')).toBe('false')
    await view.unmount()
  })

  it('keeps the category flyout scroll-free and exposes nested categories beside it', async () => {
    const view = await render(
      <SearchHero
        kind="products"
        productCategoryTree={categoryTree}
        productCategoriesLoading={false}
        productCategoriesError={false}
        selectedCategoryTermId=""
        onCategorySelect={() => undefined}
      />,
    )
    const trigger =
      view.container.querySelector<HTMLButtonElement>(
        'button[data-category-trigger="true"]',
      )
    await act(async () => trigger?.focus())
    const rootCategory = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent?.trim() === 'AI')
    await act(async () => rootCategory?.focus())

    const rootPanel = view.container.querySelector<HTMLElement>(
      '[aria-label="Product categories"]',
    )
    const nestedPanel = view.container.querySelector<HTMLElement>(
      '[aria-label="AI subcategories"]',
    )
    const rootCategoryGrid = view.container.querySelector<HTMLElement>(
      '[data-testid="product-category-root-grid"]',
    )

    expect(rootPanel?.className).not.toContain('overflow-y-auto')
    expect(rootPanel?.className).not.toContain('overflow-hidden')
    expect(rootCategoryGrid?.className).toContain('lg:grid-cols-2')
    expect(nestedPanel?.className).toContain('lg:absolute')
    expect(nestedPanel?.className).toContain('lg:left-full')
    expect(nestedPanel?.className).toContain('lg:w-[280px]')
    expect(nestedPanel?.className).not.toContain('overflow-y-auto')
    expect(nestedPanel?.className).not.toContain('overflow-hidden')
    await view.unmount()
  })
})
