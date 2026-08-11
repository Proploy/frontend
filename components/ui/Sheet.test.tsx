import { act } from 'react'
import { render } from '@/test/render'
import { Sheet } from './Sheet'

describe('Sheet', () => {
  it('renders nothing when closed', async () => {
    const view = await render(
      <Sheet
        open={false}
        onClose={() => undefined}
        title="Filters"
      >
        <p>Hidden contents</p>
      </Sheet>,
    )
    expect(view.container.querySelector('[role="dialog"]')).toBeNull()
    await view.unmount()
  })

  it('renders a mobile-bottom anchored sheet by default', async () => {
    const view = await render(
      <Sheet
        open
        onClose={() => undefined}
        title="Filters"
        data-testid="sheet-root"
      >
        <p>Body</p>
      </Sheet>,
    )

    const dialog =
      view.container.querySelector<HTMLElement>('[role="dialog"]')
    expect(dialog).not.toBeNull()
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    // Mobile: rounded top only, full width, anchored to items-end.
    expect(dialog?.className).toContain('rounded-t-[22px]')
    expect(dialog?.className).toContain('w-full')
    // Desktop (default side='right'): right-anchored, rounded-left only on lg+.
    expect(dialog?.className).toContain('lg:right-0')
    expect(dialog?.className).toContain('lg:rounded-l-[22px]')

    const header =
      view.container.querySelector<HTMLHeadingElement>('[role="dialog"] h2')
    expect(header?.textContent).toBe('Filters')
    expect(view.container.textContent).toContain('Body')
    await view.unmount()
  })

  it('uses the left side when side="left"', async () => {
    const view = await render(
      <Sheet
        open
        onClose={() => undefined}
        title="Filters"
        side="left"
      >
        <p>Body</p>
      </Sheet>,
    )
    const dialog = view.container.querySelector<HTMLElement>('[role="dialog"]')
    expect(dialog?.className).toContain('lg:left-0')
    expect(dialog?.className).toContain('lg:right-auto')
    await view.unmount()
  })

  it('renders the footer slot when provided', async () => {
    const view = await render(
      <Sheet
        open
        onClose={() => undefined}
        title="Filters"
        footer={<button type="button">Apply</button>}
      >
        <p>Body</p>
      </Sheet>,
    )
    expect(view.container.textContent).toContain('Apply')
    await view.unmount()
  })

  it('closes via Escape', async () => {
    const onClose = vi.fn()
    const view = await render(
      <Sheet open onClose={onClose} title="Filters">
        <p>Body</p>
      </Sheet>,
    )
    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape' }),
      )
    })
    expect(onClose).toHaveBeenCalledOnce()
    await view.unmount()
  })

  it('does not dismiss when a click happens inside the sheet panel', async () => {
    const onClose = vi.fn()
    const view = await render(
      <Sheet open onClose={onClose} title="Filters">
        <p>Body</p>
      </Sheet>,
    )
    const dialog = view.container.querySelector<HTMLElement>('[role="dialog"]')
    await act(async () => {
      dialog?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(onClose).not.toHaveBeenCalled()
    await view.unmount()
  })
})
