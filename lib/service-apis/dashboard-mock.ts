import type { ExpertDashboardResponse, ExpertMe } from '@/hooks/types/expert-contracts'

// Dev-only fixture so the gated expert dashboard UI renders without auth/backend.
// Toggle with NEXT_PUBLIC_DASHBOARD_MOCK=1 in .env (never enable in production).
export const MOCK_ENABLED =
  process.env.NODE_ENV !== 'production' &&
  process.env.NEXT_PUBLIC_DASHBOARD_MOCK === '1'

export const MOCK_AUTH_USER = {
  id: 'mock-user-1',
  email: 'expert@proploy.dev',
  name: 'Avery Mock',
  image: undefined,
}

const MOCK_EXPERT: ExpertMe = {
  id: 'mock-expert-1',
  status: 'approved',
  displayName: 'Avery Mock',
  headline: 'Salesforce & HubSpot implementation lead',
  entityType: 'individual',
  regionCountry: 'Australia',
  regionCity: 'Melbourne',
  timezone: 'Australia/Melbourne',
  yearsExperience: 8,
  projectsCompletedTotal: 42,
  introVideoLink: null,
  availabilityHoursPerWeek: 20,
  availabilityNotes: 'Weekdays, AEST business hours',
  whyPlatform: null,
  uniqueStrength: null,
  idealClients: null,
  biggestWin: null,
  primaryPlatforms: ['Salesforce', 'HubSpot'],
  secondaryPlatforms: ['Zapier'],
  industryExpertise: ['SaaS', 'Fintech'],
  preferredProjectTypes: ['Implementation', 'Migration'],
  toolsStack: ['Apex', 'Flow', 'dbt'],
  tags: [
    { id: 't1', tagType: 'platform', tagValue: 'Salesforce' },
    { id: 't2', tagType: 'industry', tagValue: 'Fintech' },
  ],
  links: [
    { id: 'l1', linkType: 'linkedin', url: 'https://linkedin.com/in/example' },
  ],
  projects: [
    {
      id: 'p1',
      title: 'CRM migration for fintech scale-up',
      summary: 'Migrated 120k records from legacy CRM to Salesforce.',
      link: null,
      outcomes: 'Cut manual data entry 60%.',
      fileUrl: null,
      fileStorageKey: null,
      fileName: null,
      fileContentType: null,
      fileSizeBytes: null,
    },
  ],
  featuredProjects: [],
  profilePictureUrl: null,
  profilePictureKey: null,
  agreeTerms: true,
  consentContact: true,
  reviews: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-06-01T00:00:00.000Z',
  schedulingProvider: null,
  schedulingLink: null,
  schedulingLinkEnabled: false,
}

export const MOCK_DASHBOARD: ExpertDashboardResponse = {
  expert: MOCK_EXPERT,
  interests: [],
  recentlyViewed: [],
}
