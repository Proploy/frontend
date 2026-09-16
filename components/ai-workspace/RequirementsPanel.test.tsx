import { render } from '@/test/render'
import { RequirementsPanel } from './RequirementsPanel'

describe('RequirementsPanel', () => {
  it('shows the meter from the first turn, when every row is still a gap', async () => {
    // The panel only mounts inside an active evaluation, and an empty meter is
    // the moment the buyer can most improve the shortlist — so it is shown,
    // not hidden.
    const view = await render(<RequirementsPanel profile={null} onAsk={() => undefined} />)
    const text = view.container.textContent ?? ''
    expect(text).toContain('0 captured')
    expect(text).toContain('Add context')
    await view.unmount()
  })

  it('offers no chips when there is nowhere to put the text', async () => {
    const view = await render(<RequirementsPanel profile={null} />)
    expect(view.container.textContent).not.toContain('Tell Sam more')
    await view.unmount()
  })

  it('lists only what Sam captured, leaving the gaps to the chips', async () => {
    const view = await render(
      <RequirementsPanel
        onAsk={() => undefined}
        profile={{
          goals: [{ text: 'Replace our PM tool' }],
          constraints: [{ type: 'team_size', value: '45' }],
          pain_points: ['Double entry'],
        }}
      />,
    )
    const text = view.container.textContent ?? ''
    expect(text).toContain('3 captured')
    expect(text).toContain('Replace our PM tool')
    expect(text).toContain('45')
    // An empty requirement is not a fact about the buyer: no blank rows, and
    // the row label only appears as something they can answer.
    expect(text).not.toContain('Not yet known')
    expect(text).toContain('Add context')
    await view.unmount()
  })
})
