import { render } from '@/test/render'
import { WelcomeState } from './WelcomeState'

describe('WelcomeState', () => {
  it('uses a full-width centered content column for copy and starter prompts', async () => {
    const view = await render(
      <WelcomeState onPrompt={() => undefined} />,
    )

    const content = view.container.querySelector(
      '[data-testid="welcome-content"]',
    )
    expect(content?.className).toContain('w-full')
    expect(content?.className).toContain('max-w-[720px]')
    expect(view.container.textContent).toContain(
      'Describe your requirements and compare suitable products',
    )
    expect(view.container.textContent).toContain('Project management')
    expect(view.container.textContent).toContain('Customer support')
    await view.unmount()
  })
})
