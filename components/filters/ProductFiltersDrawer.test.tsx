import { act } from 'react'
import { render } from '@/test/render'
import {
  DEFAULT_PRODUCT_FILTERS,
  ProductFiltersDrawer,
} from './ProductFiltersDrawer'

describe('ProductFiltersDrawer', () => {
  it('uses the centered filter modal without duplicating the category tree', async () => {
    const view = await render(
      <ProductFiltersDrawer
        open
        values={DEFAULT_PRODUCT_FILTERS}
        onClose={() => undefined}
        onApply={() => undefined}
      />,
    )

    const dialog =
      view.container.querySelector<HTMLElement>('[role="dialog"]')
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(dialog?.className).toContain('rounded-[22px]')
    expect(view.container.textContent).not.toContain('Category')
    expect(view.container.textContent).not.toContain('AI Assistants')
    expect(view.container.textContent).toContain('Clear all filters')
    expect(view.container.textContent).toContain('Save filters')
    await view.unmount()
  })

  it('preserves the selected category while applying other product filters', async () => {
    const onApply = vi.fn()
    const view = await render(
      <ProductFiltersDrawer
        open
        values={{
          ...DEFAULT_PRODUCT_FILTERS,
          categoryTermId: 'ai-search',
        }}
        onClose={() => undefined}
        onApply={onApply}
      />,
    )

    const freePlan =
      view.container.querySelector<HTMLInputElement>(
        'input[type="checkbox"]',
      )
    const save = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent === 'Save filters')

    expect(freePlan).not.toBeNull()
    expect(save).toBeDefined()
    await act(async () => freePlan?.click())
    await act(async () => save?.click())

    expect(onApply).toHaveBeenCalledWith({
      ...DEFAULT_PRODUCT_FILTERS,
      categoryTermId: 'ai-search',
      freePlan: true,
    })
    await view.unmount()
  })

  it('closes the modal with Escape', async () => {
    const onClose = vi.fn()
    const view = await render(
      <ProductFiltersDrawer
        open
        values={DEFAULT_PRODUCT_FILTERS}
        onClose={onClose}
        onApply={() => undefined}
      />,
    )

    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape' }),
      )
    })

    expect(onClose).toHaveBeenCalledOnce()
    await view.unmount()
  })
})
