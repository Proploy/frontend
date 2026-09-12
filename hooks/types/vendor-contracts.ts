// vendor-contracts.ts
// Type contracts for vendor/expert onboarding.

import type { ExpertProgressSectionKey, SocialPlatform } from '@/features/experts/types'

export type VendorSectionKey = ExpertProgressSectionKey

export const VENDOR_SECTION_KEYS: readonly VendorSectionKey[] = [
  'identity',
  'products',
  'experience',
  'socials',
  'evidence',
  'availability',
  'agreements',
] as const

export function isVendorSectionKey(value: string | null | undefined): value is VendorSectionKey {
  return typeof value === 'string' && (VENDOR_SECTION_KEYS as readonly string[]).includes(value)
}

export interface SocialLinkEntry {
  platform: SocialPlatform
  url: string
}

// A certification held on one product. `file` is the optional uploaded
// certificate; once saved, `linkId` mirrors `file.id`.
export interface CertificationEntry {
  localId: string
  name: string
  issuer: string
  year: string
  credentialUrl: string
  linkId?: string | null
  file?: UploadedApplicationFile | null
}

// One product the applicant works on. Numeric fields are kept as strings so
// the inputs stay controlled; the mapper parses them.
export interface ProductExpertiseEntry {
  localId: string
  id?: string | null
  productId: string | null
  productName: string
  isPrimary: boolean
  yearsExperience: string
  projectsCompleted: string
  certifications: CertificationEntry[]
  industryFit?: string[]
}

export interface VendorOnboardingData {
  // identity
  accountType?: string
  displayName: string
  headline: string

  // products
  productExpertise: ProductExpertiseEntry[]
  industries: string[]
  // Certificate files not tied to a product (legacy uploads) and
  // hand-typed credential names (stored as certification tags).
  certificationFiles: UploadedApplicationFile[]
  manualCertifications: string[]

  // experience
  yearsExperience: string
  totalProjects: string
  uniqueStrength: string
  biggestWin: string
  idealClients: string

  // socials
  socialLinks: SocialLinkEntry[]

  // evidence
  featuredProjects: FeaturedProject[]
  portfolioFiles: UploadedApplicationFile[]
  portfolioLinks: AddedLink[]
  introVideoLink?: string
  introVideoFile?: UploadedApplicationFile | null
  visibilitySettings: Record<string, boolean>

  // availability
  timezone: string
  regionCountry: string
  regionCity: string
  regions: string[]
  remoteOnly: boolean
  weeklyAvailability: string
  earliestStartDate: string
  preferredProjectTypes: string[]
  whyPlatforms: string

  // agreements
  agreements: boolean[]
}

export interface FeaturedProject {
  clientProjectId: string
  title: string
  clientIndustry: string
  platform: string
  delivered: string
  outcome: string
  link: string
  ndaSafe: boolean
  fileStorageKey?: string | null
  fileName?: string | null
  fileContentType?: string | null
  fileSizeBytes?: number | null
}

export interface AddedLink {
  url: string
  visible: boolean
  linkType?: 'portfolio' | 'certification'
}

export interface UploadedApplicationFile {
  name: string
  size: number
  file?: File
  id?: string
  // Legacy hydration only. New uploads never receive a public storage URL.
  publicUrl?: string | null
  storageKey?: string | null
  fileContentType?: string | null
  visible: boolean
}

export const EMPTY_VENDOR_ONBOARDING_DATA: VendorOnboardingData = {
  accountType: '',
  displayName: '',
  headline: '',
  productExpertise: [],
  industries: [],
  certificationFiles: [],
  manualCertifications: [],
  yearsExperience: '',
  totalProjects: '',
  uniqueStrength: '',
  biggestWin: '',
  idealClients: '',
  socialLinks: [],
  featuredProjects: [],
  portfolioFiles: [],
  portfolioLinks: [],
  introVideoLink: '',
  introVideoFile: null,
  visibilitySettings: {},
  timezone: '',
  regionCountry: '',
  regionCity: '',
  regions: [],
  remoteOnly: false,
  weeklyAvailability: '',
  earliestStartDate: '',
  preferredProjectTypes: [],
  whyPlatforms: '',
  agreements: [false, false, false],
}
