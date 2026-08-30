import { render } from '@/test/render'
import { MatchConsole } from './MatchConsole'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

describe('MatchConsole render smoke', () => {
  it('shows the bar, toggle and suggestions without any interaction', async () => {
    const { container, unmount } = await render(<MatchConsole />)

    expect(container.textContent).toContain('Proploy match engine')
    // Toggle lives at the top of the card with both modes visible.
    const toggle = container.querySelector('[aria-label="Search mode"]')
    expect(toggle).not.toBeNull()
    expect(toggle!.textContent).toContain('Search Software')
    expect(toggle!.textContent).toContain('Get Recommendations')
    // The search bar is always mounted.
    expect(container.querySelector('input')).not.toBeNull()
    expect(container.querySelector('input')!.placeholder).toBe(
      'What are you trying to solve?',
    )
    // Suggestions are visible before a query exists.
    expect(container.textContent).toContain('Start typing — or try one')
    expect(container.textContent).toContain('Vetted experts attached')

    await unmount()
  })
})