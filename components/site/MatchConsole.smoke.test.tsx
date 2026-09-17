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

  it('renders one bare search bar, with no mode toggle and no results panel', async () => {
    const { container, unmount } = await render(<MatchConsole />)

    // The search bar is always mounted.
    expect(container.querySelector('input')).not.toBeNull()
    expect(container.querySelector('input')!.placeholder).toBe(
      'What are you trying to solve?',
    )
    // The manual keyword/AI toggle is gone; the mode is read off the query.
    expect(container.querySelector('[aria-label="Search mode"]')).toBeNull()
    expect(container.textContent).not.toContain('Search Software')
    expect(container.textContent).not.toContain('Get Recommendations')
    // So is the old card chrome: header label, hint line and suggestion chips.
    expect(container.textContent).not.toContain('Proploy match engine')
    expect(container.textContent).not.toContain('Start typing')
    // Nothing typed yet, so the panel has not expanded.
    expect(container.querySelector('.mc-results')).toBeNull()
    // An empty bar reads as keyword, so it never fires the natural endpoint.
    expect(container.querySelector('[data-mode]')!.getAttribute('data-mode')).toBe('keyword')
    // Subtle guided route into the authenticated Sam workspace.
    const askSam = container.querySelector('a[href="/AI_workspace"]')
    expect(askSam).not.toBeNull()
    expect(askSam!.textContent).toContain('Ask Sam')
    expect(container.textContent).toContain('Not sure what to search?')

    await unmount()
  })

  it('does not offer the Sam workspace to an approved expert', async () => {
    authState.user = { id: 'e1', email: 'expert@example.com', role: 'expert' }
    const { container, unmount } = await render(<MatchConsole />)

    // The search bar stays; only the guided route into Sam is withheld.
    expect(container.querySelector('input')).not.toBeNull()
    expect(container.querySelector('a[href="/AI_workspace"]')).toBeNull()
    expect(container.textContent).not.toContain('Not sure what to search?')

    await unmount()
  })
})
