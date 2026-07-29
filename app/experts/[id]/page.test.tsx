import { act } from 'react'
import { render } from '@/test/render'
import type { ExpertPublic } from '@/features/experts/types'
import ExpertProfilePage from './page'

const mocks = vi.hoisted(() => ({
  getExpertProfile: vi.fn(),
  trackRecentlyViewed: vi.fn(),
  createMeetingIntent: vi.fn(),
  push: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'expert-1' }),
  useRouter: () => ({ push: mocks.push }),
}))

vi.mock('@/components/Footer', () => ({
  default: () => <footer>Footer</footer>,
}))

vi.mock('@/components/providers/auth-provider', () => ({
  useAuth: () => ({
    user: null,
    isLoading: false,
  }),
}))

vi.mock('@/components/experts/ProjectDocumentViewer', () => ({
  ProjectDocumentViewer: () => null,
}))

vi.mock('@/components/personalization/FavoriteToggle', () => ({
  default: () => null,
}))

vi.mock('@/components/media/InlineVideo', () => ({
  InlineVideo: () => null,
}))

vi.mock('@/features/experts/use-expert-profile', () => ({
  useExpertProfile: () => ({
    getExpertProfile: mocks.getExpertProfile,
  }),
}))

vi.mock('@/features/users', () => ({
  useRecentlyViewed: () => ({
    track: mocks.trackRecentlyViewed,
  }),
}))

vi.mock('@/features/workspace', () => ({
  useStandaloneCurrentUserRole: () => ({ expert: null }),
  useWorkspace: () => ({
    createMeetingIntent: mocks.createMeetingIntent,
  }),
}))

const baseProfile: ExpertPublic = {
  id: 'expert-1',
  email: null,
  displayName: 'Sam Expert',
  headline: 'Implementation specialist',
  entityType: 'individual',
  regionCountry: 'India',
  regionCity: 'Mumbai',
  timezone: 'Asia/Kolkata',
  yearsExperience: 8,
  projectsCompletedTotal: 24,
  introVideoLink: null,
  availabilityNotes: null,
  whyPlatform: 'Reliable delivery',
  uniqueStrength: 'Complex migrations',
  idealClients: 'Growing teams',
  biggestWin: 'Global CRM rollout',
  primaryPlatforms: ['Asana'],
  secondaryPlatforms: [],
  industryExpertise: ['Technology'],
  preferredProjectTypes: ['Implementation'],
  toolsStack: [],
  tags: [],
  links: [],
  projects: [],
  profilePictureUrl: null,
  profilePictureKey: null,
  schedulingLink: 'https://cal.example.com/expert',
  schedulingProvider: 'cal',
  schedulingLinkEnabled: true,
}

async function renderProfile(profile: ExpertPublic) {
  mocks.getExpertProfile.mockResolvedValue({
    ok: true,
    data: profile,
  })
  const view = await render(<ExpertProfilePage />)
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 0))
  })
  return view
}

describe('Expert profile contact details', () => {
  beforeEach(() => {
    mocks.getExpertProfile.mockReset()
    mocks.trackRecentlyViewed.mockReset()
    mocks.createMeetingIntent.mockReset()
    mocks.push.mockReset()
  })

  it('shows scheduling without missing-email fallback copy', async () => {
    const view = await renderProfile(baseProfile)

    expect(view.container.textContent).toContain('Scheduling link')
    expect(view.container.textContent).not.toContain(
      'Email is not returned by service-apis.',
    )
    await view.unmount()
  })

  it('shows a real email when the service provides one', async () => {
    const view = await renderProfile({
      ...baseProfile,
      email: 'expert@example.com',
    })

    expect(view.container.textContent).toContain(
      'expert@example.com',
    )
    expect(
      view.container.querySelector(
        'a[href="mailto:expert@example.com"]',
      ),
    ).not.toBeNull()
    await view.unmount()
  })
})
