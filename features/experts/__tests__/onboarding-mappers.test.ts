import { mapVendorOnboardingToExpertDraft } from '../onboarding-mappers'
import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts'

const form: VendorOnboardingData = {
  accountType: 'individual',
  displayName: 'Alex Tan',
  headline: 'CRM implementation expert',
  categories: ['HubSpot CRM'],
  specializations: ['Zoho CRM'],
  skills: [],
  platform: 'HubSpot CRM',
  industry: 'Technology',
  industries: ['Technology'],
  certificationFiles: [],
  manualCertifications: [],
  yearsExperience: '6–10 years',
  openToAssessment: true,
  totalProjects: '12',
  featuredProjects: [{
    clientProjectId: 'client-project-1',
    title: 'CRM migration',
    clientIndustry: 'SaaS',
    platform: 'HubSpot CRM',
    delivered: 'Migrated the sales pipeline',
    outcome: 'Faster lead response',
    link: 'https://example.com/case-study',
    ndaSafe: true,
  }],
  portfolioFiles: [],
  portfolioLinks: [{ url: 'https://example.com', visible: true }],
  visibilitySettings: {},
  timezone: 'UTC+08:00 (Singapore)',
  regions: ['Southeast Asia'],
  weeklyAvailability: '10 to 20 hours',
  earliestStartDate: '2026-07-01',
  preferredProjectTypes: ['Migration'],
  whyPlatforms: 'I enjoy CRM transformation work.',
  agreements: [true, true, true],
}

describe('mapVendorOnboardingToExpertDraft', () => {
  it('maps the new onboarding UI to the service-api contract', () => {
    const result = mapVendorOnboardingToExpertDraft(form)

    expect(result.primaryPlatforms).toEqual(['HubSpot CRM'])
    expect(result.secondaryPlatforms).toEqual(['Zoho CRM'])
    expect(result.industryExpertise).toEqual(['Technology'])
    expect(result.yearsExperience).toBe(6)
    expect(result.projectsCompletedTotal).toBe(12)
    expect(result.projects?.[0].title).toBe('CRM migration')
    expect(result.agreeTerms).toBe(true)
    expect(result.consentContact).toBe(true)
  })

  it('does not persist a raw storage URL for uploaded portfolio evidence', () => {
    const storageUrl = 'https://project.supabase.co/storage/v1/object/public/expert-document/pending/file.pdf'
    const result = mapVendorOnboardingToExpertDraft({
      ...form,
      portfolioFiles: [{
        name: 'file.pdf',
        size: 1024,
        publicUrl: storageUrl,
        storageKey: 'pending-expert-applications/user-1/documents/portfolio/file.pdf',
        fileContentType: 'application/pdf',
        visible: true,
      }],
    })

    expect(result.links?.some((link) => link.url === storageUrl)).toBe(false)
    expect(result.links?.some((link) => link.storageKey?.includes('pending-expert-applications/user-1'))).toBe(true)
  })

  it('does not expose the raw storage URL for an uploaded intro video', () => {
    const storageUrl = 'https://project.supabase.co/storage/v1/object/public/expert-document/pending/intro.mp4'
    const result = mapVendorOnboardingToExpertDraft({
      ...form,
      introVideoLink: storageUrl,
      introVideoFile: {
        name: 'intro.mp4',
        size: 1024,
        publicUrl: storageUrl,
        storageKey: 'pending-expert-applications/user-1/documents/intro_video/intro.mp4',
        fileContentType: 'video/mp4',
        visible: true,
      },
    })

    expect(result.introVideoLink).not.toBe(storageUrl)
    expect(result.links?.some((link) => link.url === storageUrl)).toBe(false)
  })
})
