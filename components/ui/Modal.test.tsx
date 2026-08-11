import { act } from 'react'
import { render } from '@/test/render'
import { Modal } from './Modal'

describe('Modal', () => {
  it('renders nothing when closed', async () => {
    const view = await render(
      <Modal
        open={false}
        onClose={() => undefined}
        title="Saved filter"
      >
        <p>Hidden contents</p>
      </Modal>,
    )
    expect(view.container.querySelector('[role="dialog"]')).toBeNull()
    await view.unmount()
  })

  it('exposes the centred dialog with the labelled title', async () => {
    const view = await render(
      <Modal
        open
        onClose={() => undefined}
        title="Saved filter"
        closeLabel="Dismiss"
        data-testid="modal-root"
      >
        <p>Filter contents</p>
      </Modal>,
    )

    const dialog =
      view.container.querySelector<HTMLElement>('[role="dialog"]')
    expect(dialog).not.toBeNull()
    expect(dialog?.getAttribute('aria-modal')).toBe('true')
    expect(dialog?.className).toContain('rounded-[22px]')
    expect(dialog?.className).toContain('w-[min(640px,100%)]')
    expect(dialog?.getAttribute('aria-labelledby')).toMatch(/.+/)

    const heading =
      view.container.querySelector<HTMLHeadingElement>('[role="dialog"] h2')
    expect(heading?.textContent).toBe('Saved filter')

    const close = view.container.querySelector<HTMLButtonElement>(
      'button[aria-label="Dismiss"]',
    )
    expect(close).not.toBeNull()

    expect(
      view.container
        .querySelector('[data-testid="modal-root"]')
        ?.className,
    ).toContain('items-center')
    expect(view.container.textContent).toContain('Filter contents')
    await view.unmount()
  })

  it('renders the footer slot when provided', async () => {
    const view = await render(
      <Modal
        open
        onClose={() => undefined}
        title="Confirm"
        footer={
          <button type="button" data-testid="confirm">
            Confirm
          </button>
        }
      >
        <p>Are you sure?</p>
      </Modal>,
    )
    expect(view.container.querySelector('[data-testid="confirm"]')).not.toBeNull()
    await view.unmount()
  })

  it('closes via Escape', async () => {
    const onClose = vi.fn()
    const view = await render(
      <Modal open onClose={onClose} title="Confirm">
        <p>Body</p>
      </Modal>,
    )
    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape' }),
      )
    })
    expect(onClose).toHaveBeenCalledOnce()
    await view.unmount()
  })

  it('dismisses when the backdrop is clicked', async () => {
    const onClose = vi.fn()
    const view = await render(
      <Modal open onClose={onClose} title="Confirm">
        <p>Body</p>
      </Modal>,
    )
    const dialog = view.container.querySelector<HTMLElement>('[role="dialog"]')
    const backdrop = dialog?.parentElement
    expect(backdrop).not.toBeNull()
    await act(async () => {
      backdrop?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(onClose).toHaveBeenCalledOnce()
    await view.unmount()
  })

  it('does not dismiss when a click happens inside the dialog panel', async () => {
    const onClose = vi.fn()
    const view = await render(
      <Modal open onClose={onClose} title="Confirm">
        <p>Body</p>
      </Modal>,
    )
    const dialog = view.container.querySelector<HTMLElement>('[role="dialog"]')
    await act(async () => {
      dialog?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })
    expect(onClose).not.toHaveBeenCalled()
    await view.unmount()
  })
})
