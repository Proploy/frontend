import type {
  CertificationEntry,
  FeaturedProject,
  ProductExpertiseEntry,
  SocialLinkEntry,
  UploadedApplicationFile,
  VendorOnboardingData,
  VendorSectionKey,
} from '@/hooks/types/vendor-contracts'
import type {
  ExpertCertification,
  ExpertDraftRequest,
  ExpertLinkInput,
  ExpertLinkResponse,
  ExpertMe,
  ExpertProductExpertiseInput,
  SocialLink,
  SocialPlatform,
} from './types'

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

/** The server only accepts absolute https URLs for credential and social links. */
export function safeHttpsUrl(value: string | null | undefined): string | undefined {
  const url = safeExternalUrl(value)
  return url?.startsWith('https://') ? url : undefined
}

function isServiceFilePath(value: string | null | undefined): boolean {
  return typeof value === 'string'
    && /^\/api\/v1\/experts\/[^/]+\/links\/[^/]+\/file$/.test(value)
}

export function createLocalId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `local-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const MAX_SOCIAL_LINKS = 8

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

/**
 * Trim, drop blanks, and de-duplicate case-insensitively. Expert tags carry a
 * unique (expertId, tagType, tagValue) index, so a repeated value fails the
 * whole insert rather than being ignored.
 */
function uniqueTrimmed(values: string[] | undefined): string[] {
  const seen = new Map<string, string>()
  for (const value of values ?? []) {
    const trimmed = value.trim()
    const key = trimmed.toLowerCase()
    if (trimmed && !seen.has(key)) seen.set(key, trimmed)
  }
  return Array.from(seen.values())
}

function parseInteger(value: string | null | undefined): number | undefined {
  const trimmed = value?.trim()
  if (!trimmed) return undefined
  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? Math.trunc(parsed) : undefined
}

function fileLink(
  linkType: 'portfolio' | 'certification' | 'intro_video',
  file: UploadedApplicationFile,
): ExpertLinkInput {
  return {
    id: file.id,
    linkType,
    url: '',
    storageKey: file.storageKey,
    fileName: file.name,
    fileContentType: file.fileContentType,
    fileSizeBytes: file.size,
  }
}

function hasStoredFile(file: UploadedApplicationFile | null | undefined): file is UploadedApplicationFile {
  return Boolean(file && (file.storageKey || file.id))
}

function mapCertification(entry: CertificationEntry): ExpertCertification | null {
  const name = entry.name.trim()
  if (!name) return null
  const year = parseInteger(entry.year)
  return {
    name,
    issuer: entry.issuer.trim() || null,
    year: year ?? null,
    credentialUrl: safeHttpsUrl(entry.credentialUrl) ?? null,
    linkId: entry.file?.id ?? entry.linkId ?? null,
  }
}

/**
 * Products are unique by name (case-insensitive) on the server; the picker
 * prevents duplicates, and this drops any that slipped through.
 */
export function mapProductExpertise(entries: ProductExpertiseEntry[]): ExpertProductExpertiseInput[] {
  const seen = new Set<string>()
  const result: ExpertProductExpertiseInput[] = []
  for (const entry of entries) {
    const productName = entry.productName.trim()
    const key = productName.toLowerCase()
    if (!productName || seen.has(key)) continue
    seen.add(key)
    result.push({
      id: entry.id ?? undefined,
      productId: entry.productId || null,
      productName,
      isPrimary: entry.isPrimary,
      yearsExperience: parseInteger(entry.yearsExperience) ?? null,
      projectsCompleted: parseInteger(entry.projectsCompleted) ?? null,
      certifications: entry.certifications
        .map(mapCertification)
        .filter((cert): cert is ExpertCertification => cert !== null),
      industryFit: entry.industryFit ?? [],
    })
  }
  return result
}

export interface MapVendorOnboardingOptions {
  lastStepKey?: VendorSectionKey | null
}

export function mapVendorOnboardingToExpertDraft(
  form: VendorOnboardingData,
  options: MapVendorOnboardingOptions = {},
): ExpertDraftRequest {
  const introVideoLink = form.introVideoFile
    ? undefined
    : safeExternalUrl(form.introVideoLink)

  const productExpertise = mapProductExpertise(form.productExpertise)
  const primaryPlatforms = productExpertise.filter((p) => p.isPrimary).map((p) => p.productName)
  const secondaryPlatforms = productExpertise.filter((p) => !p.isPrimary).map((p) => p.productName)

  const productCertificationFiles = form.productExpertise.flatMap((product) =>
    product.certifications
      .map((cert) => cert.file)
      .filter(hasStoredFile),
  )

  const earliestStartDate = form.earliestStartDate?.trim() || null

  return {
    entityType: form.accountType === 'business' ? 'Business/Team' : 'Individual',
    displayName: form.displayName.trim(),
    headline: form.headline.trim(),
    regionCountry: form.regionCountry?.trim() || undefined,
    regionCity: form.regionCity?.trim() || undefined,
    timezone: form.timezone,
    yearsExperience: EXPERIENCE_YEARS[form.yearsExperience],
    projectsCompletedTotal: parseInteger(form.totalProjects),
    availabilityHoursPerWeek: AVAILABILITY_HOURS[form.weeklyAvailability],
    whyPlatform: form.whyPlatforms,
    uniqueStrength: form.uniqueStrength?.trim() || undefined,
    biggestWin: form.biggestWin?.trim() || undefined,
    idealClients: form.idealClients?.trim() || undefined,
    introVideoLink,
    // Derived by the server from productExpertise; sent too so older
    // gateways keep working until productExpertise is everywhere.
    primaryPlatforms,
    secondaryPlatforms,
    productExpertise,
    industryExpertise: uniqueTrimmed(form.industries),
    preferredProjectTypes: form.preferredProjectTypes,
    regionsServed: uniqueTrimmed(form.regions),
    earliestStartDate,
    remoteOnly: Boolean(form.remoteOnly),
    lastStepKey: options.lastStepKey ?? undefined,
    projects: form.featuredProjects.map((project) => ({
      id: project.clientProjectId || undefined,
      title: project.title,
      summary: [
        project.delivered,
        project.ndaSafe ? 'NDA-safe description' : '',
      ].filter(Boolean).join('\n'),
      outcomes: project.outcome,
      link: project.link || null,
      platform: project.platform?.trim() || null,
      clientIndustry: project.clientIndustry?.trim() || null,
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
        .filter((file) => file.visible && hasStoredFile(file))
        .map((file) => fileLink('portfolio', file)),
      ...form.certificationFiles
        .filter((file) => file.visible && hasStoredFile(file))
        .map((file) => fileLink('certification', file)),
      // Files attached to hand-typed "other certifications" (independent of
      // per-product certification files).
      ...form.manualCertifications
        .filter((entry) => entry.file && entry.file.visible !== false && hasStoredFile(entry.file))
        .map((entry) => fileLink('certification', entry.file!)),
      ...productCertificationFiles.map((file) => fileLink('certification', file)),
      ...(form.introVideoFile?.visible && hasStoredFile(form.introVideoFile)
        ? [fileLink('intro_video', form.introVideoFile)]
        : []),
    ],
    tags: [
      ...primaryPlatforms.map((tagValue) => ({ tagType: 'platform', tagValue })),
      ...secondaryPlatforms.map((tagValue) => ({ tagType: 'platform', tagValue })),
      ...uniqueTrimmed(form.industries).map((tagValue) => ({ tagType: 'industry', tagValue })),
      ...form.preferredProjectTypes.map((tagValue) => ({ tagType: 'project_type', tagValue })),
      // Certifications typed by hand with no product behind them. Product
      // certifications travel inside productExpertise instead.
      ...uniqueTrimmed(form.manualCertifications.map((entry) => entry.name)).map((tagValue) => ({
        tagType: 'certification',
        tagValue,
      })),
    ],
    agreeTerms: Boolean(form.agreements[0] && form.agreements[1]),
    consentContact: Boolean(form.agreements[2]),
    socialLinks: mapSocialLinks(form.socialLinks ?? []),
  }
}

/**
 * Same rules as the server (https only, no duplicate platform+url pair, at
 * most 8). Half-typed links are left out so they never block a draft save;
 * the socials section shows the inline error instead.
 */
export function mapSocialLinks(links: SocialLinkEntry[]): SocialLink[] {
  const seen = new Set<string>()
  const result: SocialLink[] = []
  for (const link of links) {
    const url = safeHttpsUrl(link.url)
    if (!url) continue
    const key = `${link.platform}|${url.toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    result.push({ platform: link.platform, url })
    if (result.length >= MAX_SOCIAL_LINKS) break
  }
  return result
}

/**
 * POST /experts/apply requires displayName, headline and yearsExperience. A
 * draft saved from the first sections may not have them yet; the caller falls
 * back to the PATCH upsert in that case.
 */
export function hasApplyRequiredFields(payload: ExpertDraftRequest): boolean {
  return Boolean(payload.displayName)
    && Boolean(payload.headline)
    && typeof payload.yearsExperience === 'number'
}

// ─── Legacy hydration helpers ──────────────────────────────────────────────

const LEGACY_SUMMARY_PLATFORM = /^Platform:\s*(.+)$/
const LEGACY_SUMMARY_INDUSTRY = /^Industry:\s*(.+)$/
const LEGACY_NDA_LINE = 'NDA-safe description'

/**
 * Older drafts packed platform and industry into the project summary. Pull
 * them back out so nothing is lost on reload; new saves send real fields.
 */
function parseLegacyProjectSummary(summary: string): {
  platform: string
  clientIndustry: string
  delivered: string
  ndaSafe: boolean
} {
  let platform = ''
  let clientIndustry = ''
  let ndaSafe = false
  const delivered: string[] = []
  for (const line of summary.split('\n')) {
    const platformMatch = line.match(LEGACY_SUMMARY_PLATFORM)
    const industryMatch = line.match(LEGACY_SUMMARY_INDUSTRY)
    if (platformMatch && !platform) platform = platformMatch[1].trim()
    else if (industryMatch && !clientIndustry) clientIndustry = industryMatch[1].trim()
    else if (line.trim() === LEGACY_NDA_LINE) ndaSafe = true
    else delivered.push(line)
  }
  return { platform, clientIndustry, delivered: delivered.join('\n').trim(), ndaSafe }
}

/**
 * Before regionsServed / earliestStartDate had columns they were written into
 * availabilityNotes. Read-only: the new mapper never writes availabilityNotes.
 */
function parseLegacyAvailabilityNotes(notes: string | null | undefined): {
  regions: string[]
  earliestStartDate: string
} {
  const regions: string[] = []
  let earliestStartDate = ''
  for (const line of (notes ?? '').split('\n')) {
    const start = line.match(/^Earliest start:\s*(\d{4}-\d{2}-\d{2})/)
    const region = line.match(/^Regions:\s*(.+)$/)
    if (start) earliestStartDate = start[1]
    if (region) regions.push(...region[1].split(',').map((v) => v.trim()).filter(Boolean))
  }
  return { regions, earliestStartDate }
}

function fileFromLink(link: ExpertLinkResponse, fallbackName: string): UploadedApplicationFile {
  return {
    id: link.id,
    name: link.fileName ?? fallbackName,
    size: link.fileSizeBytes ?? 0,
    fileContentType: link.fileContentType,
    visible: true,
  }
}

export function hydrateVendorOnboardingFromExpert(
  current: VendorOnboardingData,
  expert: ExpertMe,
): VendorOnboardingData {
  const storedIntroMatch = expert.introVideoLink?.match(/^\/api\/v1\/experts\/[^/]+\/links\/([^/]+)\/file$/)
  const links = expert.links ?? []
  const storedPortfolioLinks = links.filter(
    (link) => link.linkType === 'portfolio' && isServiceFilePath(link.url),
  )
  const storedCertificationLinks = links.filter(
    (link) => link.linkType === 'certification' && isServiceFilePath(link.url),
  )
  const certificationLinkById = new Map(storedCertificationLinks.map((link) => [link.id, link]))
  const claimedCertificationLinkIds = new Set<string>()

  const productExpertise: ProductExpertiseEntry[] = (expert.productExpertise ?? []).map((row) => ({
    localId: createLocalId(),
    id: row.id,
    productId: row.productId ?? null,
    productName: row.productName,
    isPrimary: row.isPrimary,
    yearsExperience: row.yearsExperience == null ? '' : String(row.yearsExperience),
    projectsCompleted: row.projectsCompleted == null ? '' : String(row.projectsCompleted),
    certifications: (row.certifications ?? []).map((cert) => {
      const link = cert.linkId ? certificationLinkById.get(cert.linkId) : undefined
      if (link) claimedCertificationLinkIds.add(link.id)
      return {
        localId: createLocalId(),
        name: cert.name,
        issuer: cert.issuer ?? '',
        year: cert.year == null ? '' : String(cert.year),
        credentialUrl: cert.credentialUrl ?? '',
        linkId: link?.id ?? null,
        file: link ? fileFromLink(link, 'Certificate') : null,
      }
    }),
    industryFit: row.industryFit ?? [],
  }))

  // Drafts saved before productExpertise existed only carry the string arrays.
  if (productExpertise.length === 0) {
    for (const name of expert.primaryPlatforms ?? []) {
      productExpertise.push(emptyProductEntry(name, true))
    }
    for (const name of expert.secondaryPlatforms ?? []) {
      productExpertise.push(emptyProductEntry(name, false))
    }
  }

  const legacyAvailability = parseLegacyAvailabilityNotes(expert.availabilityNotes)
  const regions = expert.regionsServed?.length ? expert.regionsServed : legacyAvailability.regions
  const earliestStartDate = expert.earliestStartDate ?? legacyAvailability.earliestStartDate

  return {
    ...current,
    accountType: expert.entityType?.toLowerCase().includes('business') ? 'business' : 'individual',
    displayName: expert.displayName ?? '',
    headline: expert.headline ?? '',
    productExpertise,
    industries: expert.industryExpertise ?? [],
    yearsExperience: mapYearsToRange(expert.yearsExperience),
    totalProjects: expert.projectsCompletedTotal == null ? '' : String(expert.projectsCompletedTotal),
    uniqueStrength: expert.uniqueStrength ?? '',
    biggestWin: expert.biggestWin ?? '',
    idealClients: expert.idealClients ?? '',
    manualCertifications: (expert.tags ?? [])
      .filter((tag) => tag.tagType === 'certification')
      .map((tag) => ({ name: tag.tagValue, file: null })),
    regionCountry: expert.regionCountry ?? '',
    regionCity: expert.regionCity ?? '',
    timezone: expert.timezone ?? '',
    regions,
    remoteOnly: Boolean(expert.remoteOnly),
    earliestStartDate: earliestStartDate ?? '',
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
    portfolioLinks: links
      .filter((link) => link.linkType === 'portfolio' && !isServiceFilePath(link.url))
      .filter((link) => !isBlockedStorageUrl(link.url))
      .map((link) => ({ url: link.url, visible: true, linkType: 'portfolio' })),
    portfolioFiles: storedPortfolioLinks.map((link) => fileFromLink(link, 'Portfolio file')),
    certificationFiles: storedCertificationLinks
      .filter((link) => !claimedCertificationLinkIds.has(link.id))
      .map((link) => fileFromLink(link, 'Certificate')),
    featuredProjects: (expert.projects ?? []).map((project): FeaturedProject => {
      const legacy = parseLegacyProjectSummary(project.summary ?? '')
      return {
        clientProjectId: project.id,
        title: project.title,
        clientIndustry: project.clientIndustry ?? legacy.clientIndustry,
        platform: project.platform ?? legacy.platform,
        delivered: legacy.delivered,
        outcome: project.outcomes,
        link: project.link ?? '',
        ndaSafe: legacy.ndaSafe,
        fileName: project.fileName ?? null,
        fileContentType: project.fileContentType ?? null,
        fileSizeBytes: project.fileSizeBytes ?? null,
      }
    }),
    agreements: [expert.agreeTerms, expert.agreeTerms, expert.consentContact],
    socialLinks: (expert.socialLinks ?? []).map((link) => ({
      platform: link.platform as SocialPlatform,
      url: link.url,
    })),
  }
}

function emptyProductEntry(productName: string, isPrimary: boolean): ProductExpertiseEntry {
  return {
    localId: createLocalId(),
    productId: null,
    productName,
    isPrimary,
    yearsExperience: '',
    projectsCompleted: '',
    certifications: [],
    industryFit: [],
  }
}

// ─── Post-save reconciliation ──────────────────────────────────────────────

export interface ReconcileResult {
  form: VendorOnboardingData
  /** A certification file received its link id for the first time; the
   *  linkId must be persisted with one more save. */
  certificationLinksChanged: boolean
}

/**
 * The server mints ids for links, projects and product rows on save and only
 * keeps them stable when the client echoes them back. Copy the ids from the
 * response onto the local form so the next save updates rather than recreates.
 */
export function reconcileVendorOnboardingIds(
  form: VendorOnboardingData,
  expert: ExpertMe,
): ReconcileResult {
  const links = expert.links ?? []
  const claimed = new Set<string>()
  for (const file of [
    ...form.portfolioFiles,
    ...form.certificationFiles,
    ...(form.introVideoFile ? [form.introVideoFile] : []),
    ...form.productExpertise.flatMap((p) => p.certifications.map((c) => c.file)),
    ...form.manualCertifications.map((entry) => entry.file),
  ]) {
    if (file?.id) claimed.add(file.id)
  }

  const claimLink = (
    linkType: string,
    file: UploadedApplicationFile,
  ): UploadedApplicationFile => {
    if (file.id) return file
    const match = links.find(
      (link) =>
        !claimed.has(link.id)
        && link.linkType === linkType
        && isServiceFilePath(link.url)
        && (link.fileName ?? '') === file.name
        && (link.fileSizeBytes ?? 0) === file.size,
    )
    if (!match) return file
    claimed.add(match.id)
    return { ...file, id: match.id }
  }

  let certificationLinksChanged = false
  const productExpertise = form.productExpertise.map((product) => {
    const serverRow = (expert.productExpertise ?? []).find(
      (row) => row.productName.toLowerCase() === product.productName.trim().toLowerCase(),
    )
    return {
      ...product,
      id: serverRow?.id ?? product.id ?? null,
      certifications: product.certifications.map((cert) => {
        if (!cert.file || cert.file.id) return cert
        const file = claimLink('certification', cert.file)
        if (!file.id) return cert
        certificationLinksChanged = true
        return { ...cert, file, linkId: file.id }
      }),
    }
  })

  const serverProjects = expert.projects ?? []
  const claimedProjects = new Set<string>()
  const featuredProjects = form.featuredProjects.map((project) => {
    if (serverProjects.some((row) => row.id === project.clientProjectId)) {
      claimedProjects.add(project.clientProjectId)
      return project
    }
    const match = serverProjects.find(
      (row) => !claimedProjects.has(row.id) && row.title === project.title,
    )
    if (!match) return project
    claimedProjects.add(match.id)
    return { ...project, clientProjectId: match.id }
  })

  return {
    certificationLinksChanged,
    form: {
      ...form,
      productExpertise,
      featuredProjects,
      portfolioFiles: form.portfolioFiles.map((file) => claimLink('portfolio', file)),
      certificationFiles: form.certificationFiles.map((file) => claimLink('certification', file)),
      manualCertifications: form.manualCertifications.map((entry) =>
        entry.file && !entry.file.id
          ? { ...entry, file: claimLink('certification', entry.file) }
          : entry,
      ),
      introVideoFile: form.introVideoFile ? claimLink('intro_video', form.introVideoFile) : form.introVideoFile,
    },
  }
}
