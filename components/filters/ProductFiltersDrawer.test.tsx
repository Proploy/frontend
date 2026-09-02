import { act } from 'react'
import { render } from '@/test/render'
import {
  DEFAULT_PRODUCT_FILTERS,
  ProductFiltersDrawer,
} from './ProductFiltersDrawer'

describe('ProductFiltersDrawer', () => {
  it('uses the centered filter modal with pill filters (no checkboxes)', async () => {
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
    expect(view.container.textContent).toContain('Categories')
    expect(view.container.querySelector('input[type="checkbox"]')).toBeNull()
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
          categoryTermIds: ['ai-search'],
        }}
        onClose={() => undefined}
        onApply={onApply}
      />,
    )

    // Groups other than Categories start collapsed; open Company size first.
    const sizeToggle = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button[aria-expanded]'),
    ).find((button) => button.textContent?.includes('Company size'))
    expect(sizeToggle).toBeDefined()
    await act(async () => sizeToggle?.click())
    const freePlan = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button[aria-pressed]'),
    ).find((button) => button.textContent === 'SMB / Startup') ?? null
    const save = Array.from(
      view.container.querySelectorAll<HTMLButtonElement>('button'),
    ).find((button) => button.textContent === 'Save filters')

    expect(freePlan).not.toBeNull()
    expect(save).toBeDefined()
    await act(async () => freePlan?.click())
    await act(async () => save?.click())

    expect(onApply).toHaveBeenCalledWith({
      ...DEFAULT_PRODUCT_FILTERS,
      categoryTermIds: ['ai-search'],
      companySize: ['smb'],
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
