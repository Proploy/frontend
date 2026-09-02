import { render } from '@/test/render'
import { MatchConsole } from './MatchConsole'

const authState: { user: { id: string; email: string; role: string } | null } = { user: null }

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/components/providers/auth-provider', () => ({
  useAuth: () => ({ user: authState.user, isLoading: false, signOut: vi.fn() }),
}))

describe('MatchConsole render smoke', () => {
  beforeEach(() => {
    authState.user = null
  })

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
    // Subtle guided route into the authenticated Sam workspace.
    const askSam = container.querySelector('a[href="/AI_workspace"]')
    expect(askSam).not.toBeNull()
    expect(askSam!.textContent).toContain('Ask Sam')
    expect(container.textContent).toContain('Sam asks a few questions')

    await unmount()
  })

  it('does not offer the Sam workspace to an approved expert', async () => {
    authState.user = { id: 'e1', email: 'expert@example.com', role: 'expert' }
    const { container, unmount } = await render(<MatchConsole />)

    // The search bar stays; only the guided route into Sam is withheld.
    expect(container.querySelector('input')).not.toBeNull()
    expect(container.querySelector('a[href="/AI_workspace"]')).toBeNull()
    expect(container.textContent).not.toContain('Sam asks a few questions')

    await unmount()
  })
})
