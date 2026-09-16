import { mapVendorOnboardingToExpertDraft } from '../onboarding-mappers'
import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts'

const form: VendorOnboardingData = {
  accountType: 'individual',
  displayName: 'Alex Tan',
  headline: 'CRM implementation expert',
  productExpertise: [
    {
      localId: 'p1',
      productId: 'prod-hubspot',
      productName: 'HubSpot CRM',
      isPrimary: true,
      yearsExperience: '6',
      projectsCompleted: '9',
      certifications: [{ localId: 'c1', name: 'HubSpot Solutions Partner', issuer: 'HubSpot', year: '2024', credentialUrl: '' }],
    },
    {
      localId: 'p2',
      productId: null,
      productName: 'Zoho CRM',
      isPrimary: false,
      yearsExperience: '',
      projectsCompleted: '',
      certifications: [],
    },
  ],
  industries: ['Technology'],
  certificationFiles: [],
  manualCertifications: [
    { name: 'HubSpot Solutions Partner', file: null },
    { name: 'Salesforce Admin', file: null },
    { name: ' hubspot solutions partner ', file: null },
  ],
  yearsExperience: '6–10 years',
  totalProjects: '12',
  uniqueStrength: 'Pipeline design',
  biggestWin: 'Cut lead response time in half',
  idealClients: 'B2B SaaS sales teams',
  socialLinks: [{ platform: 'linkedin', url: 'https://linkedin.com/in/alex-tan' }],
  remoteOnly: false,
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
  regionCountry: 'Singapore',
  regionCity: 'Singapore',
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
    expect(result.productExpertise).toHaveLength(2)
    expect(result.productExpertise?.[0]).toMatchObject({
      productId: 'prod-hubspot',
      productName: 'HubSpot CRM',
      isPrimary: true,
      yearsExperience: 6,
      projectsCompleted: 9,
    })
    expect(result.productExpertise?.[0].certifications[0]).toMatchObject({
      name: 'HubSpot Solutions Partner',
      issuer: 'HubSpot',
      year: 2024,
    })
    expect(result.socialLinks).toEqual([{ platform: 'linkedin', url: 'https://linkedin.com/in/alex-tan' }])
    expect(result.regionsServed).toEqual(['Southeast Asia'])
    expect(result.earliestStartDate).toBe('2026-07-01')
  })

  it('sends the country and city the directory filters on', () => {
    const result = mapVendorOnboardingToExpertDraft(form)

    expect(result.regionCountry).toBe('Singapore')
    expect(result.regionCity).toBe('Singapore')
  })

  it('carries hand-typed certifications through as tags, de-duplicated', () => {
    const result = mapVendorOnboardingToExpertDraft(form)
    const certifications = (result.tags ?? []).filter((tag) => tag.tagType === 'certification')

    expect(certifications.map((tag) => tag.tagValue)).toEqual([
      'HubSpot Solutions Partner',
      'Salesforce Admin',
    ])
  })

  it('omits country and city rather than sending blanks', () => {
    const result = mapVendorOnboardingToExpertDraft({
      ...form,
      regionCountry: '',
      regionCity: '   ',
    })

    expect(result.regionCountry).toBeUndefined()
    expect(result.regionCity).toBeUndefined()
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
