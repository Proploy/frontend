import { act } from 'react'
import { render } from '@/test/render'
import { RequirementsModal } from './RequirementsModal'

describe('RequirementsModal', () => {
  it('does not render when open is false', async () => {
    const view = await render(
      <RequirementsModal
        open={false}
        onClose={() => undefined}
        profile={null}
      />,
    )
    expect(view.container.querySelector('[data-testid="requirements-modal"]')).toBeNull()
    await view.unmount()
  })

  it('renders captured requirements and progress meter when open', async () => {
    const view = await render(
      <RequirementsModal
        open={true}
        onClose={() => undefined}
        profile={{
          goals: [{ text: 'Automate sprint planning' }],
          constraints: [{ type: 'team_size', value: '25' }],
        }}
      />,
    )

    const modal = view.container.querySelector('[data-testid="requirements-modal"]')
    expect(modal).not.toBeNull()
    expect(modal?.textContent).toContain('Decision Inputs & Requirements')
    expect(modal?.textContent).toContain('2 captured')
    expect(modal?.textContent).toContain('Automate sprint planning')
    expect(modal?.textContent).toContain('25')
    await view.unmount()
  })

  it('calls onAsk and onClose when a gap chip is clicked', async () => {
    const onAsk = vi.fn()
    const onClose = vi.fn()
    const view = await render(
      <RequirementsModal
        open={true}
        onClose={onClose}
        profile={null}
        onAsk={onAsk}
      />,
    )

    const button = Array.from(view.container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Your goal'),
    )
    expect(button).toBeDefined()
    await act(async () => button?.click())

    expect(onAsk).toHaveBeenCalledWith("What we're trying to achieve is ")
    expect(onClose).toHaveBeenCalledOnce()
    await view.unmount()
  })

  it('calls onAsk and closes when Refine with SAM is clicked', async () => {
    const onAsk = vi.fn()
    const onClose = vi.fn()
    const view = await render(
      <RequirementsModal
        open={true}
        onClose={onClose}
        profile={{ goals: [{ text: 'Goal 1' }] }}
        onAsk={onAsk}
      />,
    )

    const refineBtn = Array.from(view.container.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('Refine with SAM'),
    )
    expect(refineBtn).toBeDefined()
    await act(async () => refineBtn?.click())

    expect(onAsk).toHaveBeenCalledWith('I want to update these requirements: ')
    expect(onClose).toHaveBeenCalledOnce()
    await view.unmount()
  })
})
