import type { VendorOnboardingData } from '@/hooks/types/vendor-contracts'
import type { ExpertDraftRequest, ExpertMe } from './types'

export function isBlockedStorageUrl(value: string | null | undefined): boolean {
  if (!value) return false
  try {
    const parsed = new URL(value)
    const hostname = parsed.hostname.toLowerCase()
    const configuredHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.toLowerCase()
      : ''
    return (
      ['http:', 'https:'].includes(parsed.protocol)
      && parsed.pathname.startsWith('/storage/v1/object/')
      && (
        hostname === configuredHostname
        || hostname.endsWith('.supabase.co')
        || hostname.endsWith('.supabase.in')
      )
    )
  } catch {
    return false
  }
}

function safeExternalUrl(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim()
  if (!trimmed || isBlockedStorageUrl(trimmed)) return undefined
  try {
    const parsed = new URL(trimmed)
    return ['http:', 'https:'].includes(parsed.protocol) && parsed.hostname
      ? trimmed
      : undefined
  } catch {
    return undefined
  }
}

function isServiceFilePath(value: string | null | undefined): boolean {
  return typeof value === 'string'
    && /^\/api\/v1\/experts\/[^/]+\/links\/[^/]+\/file$/.test(value)
}

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
  const introVideoLink = form.introVideoFile
    ? undefined
    : safeExternalUrl(form.introVideoLink)

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
    introVideoLink,
    primaryPlatforms: form.categories,
    secondaryPlatforms: form.specializations,
    industryExpertise: form.industries,
    preferredProjectTypes: form.preferredProjectTypes,
    projects: form.featuredProjects.map((project) => ({
      id: project.clientProjectId || undefined,
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
    links: [
      ...form.portfolioLinks
        .filter((link) => link.visible && safeExternalUrl(link.url))
        .map((link) => ({ linkType: link.linkType ?? 'portfolio', url: safeExternalUrl(link.url) as string })),
      ...form.portfolioFiles
        .filter((file) => file.visible && (file.storageKey || file.id))
        .map((file) => ({
          id: file.id,
          linkType: 'portfolio',
          url: '',
          storageKey: file.storageKey,
          fileName: file.name,
          fileContentType: file.fileContentType,
          fileSizeBytes: file.size,
        })),
      ...form.certificationFiles
        .filter((file) => file.visible && (file.storageKey || file.id))
        .map((file) => ({
          id: file.id,
          linkType: 'certification',
          url: '',
          storageKey: file.storageKey,
          fileName: file.name,
          fileContentType: file.fileContentType,
          fileSizeBytes: file.size,
        })),
      ...(form.introVideoFile?.visible && (form.introVideoFile.storageKey || form.introVideoFile.id) ? [{
        id: form.introVideoFile.id,
        linkType: 'intro_video',
        url: '',
        storageKey: form.introVideoFile.storageKey,
        fileName: form.introVideoFile.name,
        fileContentType: form.introVideoFile.fileContentType,
        fileSizeBytes: form.introVideoFile.size,
      }] : []),
    ],
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
  const storedIntroMatch = expert.introVideoLink?.match(/^\/api\/v1\/experts\/[^/]+\/links\/([^/]+)\/file$/)
  const storedPortfolioLinks = (expert.links ?? []).filter(
    (link) => link.linkType === 'portfolio' && isServiceFilePath(link.url),
  )
  const storedCertificationLinks = (expert.links ?? []).filter(
    (link) => link.linkType === 'certification' && isServiceFilePath(link.url),
  )

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
    introVideoLink: storedIntroMatch || isBlockedStorageUrl(expert.introVideoLink)
      ? ''
      : expert.introVideoLink ?? '',
    introVideoFile: storedIntroMatch
      ? {
          id: storedIntroMatch[1],
          name: 'Intro video',
          size: 0,
          visible: true,
        }
      : null,
    portfolioLinks: (expert.links ?? [])
      .filter((link) => link.linkType === 'portfolio' && !isServiceFilePath(link.url))
      .filter((link) => !isBlockedStorageUrl(link.url))
      .map((link) => ({ url: link.url, visible: true, linkType: 'portfolio' })),
    portfolioFiles: storedPortfolioLinks.map((link) => ({
      id: link.id,
      name: link.fileName ?? 'Portfolio file',
      size: link.fileSizeBytes ?? 0,
      fileContentType: link.fileContentType,
      visible: true,
    })),
    certificationFiles: storedCertificationLinks.map((link) => ({
        id: link.id,
        name: link.fileName ?? 'Certificate',
        size: link.fileSizeBytes ?? 0,
        fileContentType: link.fileContentType,
        visible: true,
      })),
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
