import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts'
import type { ExpertDraftRequest, ExpertMe } from './types'

const EXPERIENCE_YEARS: Record<string, number> = {
  'Less than 1 year': 0,
  '1–2 years': 1,
  '3–5 years': 3,
  '6–10 years': 6,
  '10+ years': 10,
}

const AVAILABILITY_HOURS: Record<string, number> = {
  'Less than 5 hours': 4,
  '5 to 10 hours': 10,
  '10 to 20 hours': 20,
  '20+ hours': 20,
}

function mapYearsToRange(years: number | null | undefined): string {
  if (years == null) return ''
  if (years < 1) return 'Less than 1 year'
  if (years <= 2) return '1–2 years'
  if (years <= 5) return '3–5 years'
  if (years <= 10) return '6–10 years'
  return '10+ years'
}

function mapHoursToRange(hours: number | null | undefined): string {
  if (hours == null) return ''
  if (hours < 5) return 'Less than 5 hours'
  if (hours <= 10) return '5 to 10 hours'
  if (hours <= 20) return '10 to 20 hours'
  return '20+ hours'
}

export function mapVendorOnboardingToExpertDraft(
  form: VendorOnboardingData,
): ExpertDraftRequest {
  return {
    entityType: form.accountType === 'business' ? 'Business/Team' : 'Individual',
    displayName: form.displayName.trim(),
    headline: form.headline.trim(),
    timezone: form.timezone,
    yearsExperience: EXPERIENCE_YEARS[form.yearsExperience],
    projectsCompletedTotal: Number(form.totalProjects) || undefined,
    availabilityHoursPerWeek: AVAILABILITY_HOURS[form.weeklyAvailability],
    availabilityNotes: [
      form.earliestStartDate ? `Earliest start: ${form.earliestStartDate}` : '',
      form.regions.length ? `Regions: ${form.regions.join(', ')}` : '',
    ].filter(Boolean).join('\n'),
    whyPlatform: form.whyPlatforms,
    primaryPlatforms: form.categories,
    secondaryPlatforms: form.specializations,
    industryExpertise: form.industries,
    preferredProjectTypes: form.preferredProjectTypes,
    projects: form.featuredProjects.map((project) => ({
      title: project.title,
      summary: [
        project.platform ? `Platform: ${project.platform}` : '',
        project.clientIndustry ? `Industry: ${project.clientIndustry}` : '',
        project.delivered,
        project.ndaSafe ? 'NDA-safe description' : '',
      ].filter(Boolean).join('\n'),
      outcomes: project.outcome,
      link: project.link || null,
      fileStorageKey: project.fileStorageKey,
      fileName: project.fileName,
      fileContentType: project.fileContentType,
      fileSizeBytes: project.fileSizeBytes,
    })),
    links: form.portfolioLinks
      .filter((link) => link.visible && link.url.trim())
      .map((link) => ({ linkType: 'portfolio', url: link.url.trim() })),
    tags: [
      ...form.categories.map((tagValue) => ({ tagType: 'platform', tagValue })),
      ...form.specializations.map((tagValue) => ({ tagType: 'platform', tagValue })),
      ...form.industries.map((tagValue) => ({ tagType: 'industry', tagValue })),
      ...form.preferredProjectTypes.map((tagValue) => ({ tagType: 'project_type', tagValue })),
    ],
    agreeTerms: Boolean(form.agreements[0] && form.agreements[1]),
    consentContact: Boolean(form.agreements[2]),
  }
}

export function hydrateVendorOnboardingFromExpert(
  current: VendorOnboardingData,
  expert: ExpertMe,
): VendorOnboardingData {
  return {
    ...current,
    accountType: expert.entityType?.toLowerCase().includes('business') ? 'business' : 'individual',
    displayName: expert.displayName ?? '',
    headline: expert.headline ?? '',
    categories: expert.primaryPlatforms ?? [],
    specializations: expert.secondaryPlatforms ?? [],
    industries: expert.industryExpertise ?? [],
    industry: expert.industryExpertise?.[0] ?? '',
    yearsExperience: mapYearsToRange(expert.yearsExperience),
    totalProjects: String(expert.projectsCompletedTotal ?? ''),
    timezone: expert.timezone ?? '',
    weeklyAvailability: mapHoursToRange(expert.availabilityHoursPerWeek),
    preferredProjectTypes: expert.preferredProjectTypes ?? [],
    whyPlatforms: expert.whyPlatform ?? '',
    portfolioLinks: (expert.links ?? [])
      .filter((link) => link.linkType === 'portfolio')
      .map((link) => ({ url: link.url, visible: true })),
    featuredProjects: (expert.projects ?? []).map((project) => ({
      clientProjectId: project.id,
      title: project.title,
      clientIndustry: '',
      platform: '',
      delivered: project.summary,
      outcome: project.outcomes,
      link: project.link ?? '',
      ndaSafe: false,
    })),
    agreements: [expert.agreeTerms, expert.agreeTerms, expert.consentContact],
  }
}
