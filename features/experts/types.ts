export interface ExpertSummary {
  id: string
  displayName: string
  profilePictureUrl: string | null
}

export interface ExpertSummaryResponse {
  results: ExpertSummary[]
}

export type ExpertProjectFileUploadResponse = {
  storageKey: string
  fileName: string
  fileContentType: string
  fileSizeBytes: number
}

export type SocialPlatform = 'linkedin' | 'github' | 'twitter' | 'youtube' | 'website' | 'dribbble' | 'behance' | 'other'

export interface SocialLink {
  platform: SocialPlatform
  url: string
}

// One certification held on a product. `linkId` points at an uploaded
// expert_link(linkType=certification) when a file backs it.
export interface ExpertCertification {
  name: string
  issuer?: string | null
  year?: number | null
  credentialUrl?: string | null
  linkId?: string | null
}

// Source of truth for what an expert works on. The server derives
// primaryPlatforms / secondaryPlatforms and the platform tags from it.
export interface ExpertProductExpertiseInput {
  id?: string | null
  productId?: string | null
  productName: string
  isPrimary: boolean
  yearsExperience?: number | null
  projectsCompleted?: number | null
  certifications: ExpertCertification[]
  industryFit?: string[]
}

export interface ExpertProductExpertiseResponse extends ExpertProductExpertiseInput {
  id: string
  sortOrder: number
}

export type ExpertApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'changes_requested'
  | 'approved'
  | 'rejected'

export type ExpertProgressSectionKey =
  | 'identity'
  | 'products'
  | 'experience'
  | 'socials'
  | 'evidence'
  | 'availability'
  | 'agreements'

export interface ExpertProgressSection {
  key: ExpertProgressSectionKey
  label: string
  complete: boolean
  missing: string[]
}

export interface ExpertChangeRequest {
  id: string
  notes?: string | null
  createdAt: string
}

// Computed by the server on every read of the application; never stored.
export interface ExpertProgress {
  stage: string
  percentComplete: number
  sections: ExpertProgressSection[]
  canSubmit: boolean
  submitBlockers: string[]
  changeRequests: ExpertChangeRequest[]
}

export type ApplicationDocumentType = 'intro_video' | 'portfolio' | 'certification'

export type ApplicationDocumentUploadResponse = {
  storageKey: string
  documentType: ApplicationDocumentType
  fileName: string
  fileContentType: string
  fileSizeBytes: number
}

// Expert project file download — get a signed URL to retrieve the file
export type ExpertProjectDownloadUrlResponse = {
  downloadUrl: string
  expiresIn: number
}

export type ExpertProfilePictureUploadUrlResponse = {
  storageKey: string
  fileName: string
  fileContentType: string
}

export interface ExpertProfileUpdateRequest {
  displayName?: string | null
  headline?: string | null
  regionCountry?: string | null
  regionCity?: string | null
  timezone?: string | null
  availabilityHoursPerWeek?: number | null
  availabilityNotes?: string | null
  whyPlatform?: string | null
  uniqueStrength?: string | null
  idealClients?: string | null
  biggestWin?: string | null
  primaryPlatforms?: string[]
  secondaryPlatforms?: string[]
  industryExpertise?: string[]
  preferredProjectTypes?: string[]
  toolsStack?: string[]
  profilePictureUrl?: string | null
  profilePictureKey?: string | null
  schedulingLink?: string | null
  schedulingProvider?: string | null
  schedulingLinkEnabled?: boolean
  productExpertise?: ExpertProductExpertiseInput[]
  socialLinks?: SocialLink[]
  regionsServed?: string[]
  earliestStartDate?: string | null
  remoteOnly?: boolean
}

// Expert application draft response
export interface ExpertApplicationResponse {
  id: string
  status: string
  displayName: string
  headline?: string | null
  entityType?: string | null
  regionCountry?: string | null
  regionCity?: string | null
  timezone?: string | null
  yearsExperience?: number | null
  projectsCompletedTotal?: number | null
  introVideoLink?: string | null
  availabilityHoursPerWeek?: number | null
  availabilityNotes?: string | null
  whyPlatform?: string | null
  uniqueStrength?: string | null
  idealClients?: string | null
  biggestWin?: string | null
  primaryPlatforms: string[]
  secondaryPlatforms: string[]
  industryExpertise: string[]
  preferredProjectTypes: string[]
  toolsStack: string[]
  tags: ExpertTagResponse[]
  links: ExpertLinkResponse[]
  projects: ExpertProjectResponse[]
  featuredProjects: ExpertProjectResponse[]
  profilePictureUrl?: string | null
  profilePictureKey?: string | null
  agreeTerms: boolean
  consentContact: boolean
  reviews: unknown[]
  createdAt: string
  updatedAt: string
  schedulingProvider?: string | null
  schedulingLink?: string | null
  schedulingLinkEnabled?: boolean
  socialLinks?: SocialLink[]
  productExpertise?: ExpertProductExpertiseResponse[]
  regionsServed?: string[]
  earliestStartDate?: string | null
  remoteOnly?: boolean
  lastStepKey?: string | null
  submittedAt?: string | null
  progress?: ExpertProgress | null
}

// Expert dashboard response
export interface ExpertDashboardResponse {
  expert: ExpertMe
  interests?: Record<string, unknown>[]
  recentlyViewed?: Record<string, unknown>[]
}

export interface ExpertTagInput {
  tagType: string  // platform | industry | project_type | tool
  tagValue: string
}

export interface ExpertLinkInput {
  id?: string
  linkType: string  // portfolio | case_study | certification | testimonial | linkedin | github | x | website
  url: string
  storageKey?: string | null
  fileName?: string | null
  fileContentType?: string | null
  fileSizeBytes?: number | null
}

export interface ExpertProjectInput {
  id?: string
  title: string
  summary: string
  link?: string | null
  outcomes: string
  fileUrl?: string | null
  fileStorageKey?: string | null
  fileName?: string | null
  fileContentType?: string | null
  fileSizeBytes?: number | null
  // Product the project was delivered on and the client's industry.
  platform?: string | null
  clientIndustry?: string | null
}

export interface ExpertDraftRequest {
  entityType?: string
  displayName?: string
  headline?: string
  regionCountry?: string
  regionCity?: string
  timezone?: string
  yearsExperience?: number
  projectsCompletedTotal?: number
  introVideoLink?: string
  availabilityHoursPerWeek?: number
  availabilityNotes?: string
  whyPlatform?: string
  uniqueStrength?: string
  idealClients?: string
  biggestWin?: string
  primaryPlatforms?: string[]
  secondaryPlatforms?: string[]
  industryExpertise?: string[]
  preferredProjectTypes?: string[]
  toolsStack?: string[]
  tags?: ExpertTagInput[]
  links?: ExpertLinkInput[]
  projects?: ExpertProjectInput[]
  agreeTerms?: boolean
  consentContact?: boolean
  schedulingProvider?: string | null
  schedulingLink?: string | null
  schedulingLinkEnabled?: boolean
  socialLinks?: SocialLink[]
  productExpertise?: ExpertProductExpertiseInput[]
  regionsServed?: string[]
  earliestStartDate?: string | null
  remoteOnly?: boolean
  lastStepKey?: string | null
}

export interface ExpertApplyRequest extends ExpertDraftRequest {
  displayName: string
  headline: string
  yearsExperience: number
}

export interface ExpertTagResponse {
  id: string
  tagType: string
  tagValue: string
}

export interface ExpertLinkResponse {
  id: string
  linkType: string
  url: string
  fileName?: string | null
  fileContentType?: string | null
  fileSizeBytes?: number | null
}

export interface ExpertProjectResponse {
  id: string
  title: string
  summary: string
  link?: string | null
  outcomes: string
  fileUrl?: string | null
  fileStorageKey?: string | null
  fileName?: string | null
  fileContentType?: string | null
  fileSizeBytes?: number | null
  platform?: string | null
  clientIndustry?: string | null
}

export interface ExpertPublic {
  id: string
  email?: string | null
  displayName: string
  headline?: string | null
  entityType?: string | null
  regionCountry?: string | null
  regionCity?: string | null
  timezone?: string | null
  yearsExperience?: number | null
  projectsCompletedTotal?: number | null
  introVideoLink?: string | null
  availabilityHoursPerWeek?: number | null
  availabilityNotes?: string | null
  whyPlatform?: string | null
  uniqueStrength?: string | null
  idealClients?: string | null
  biggestWin?: string | null
  primaryPlatforms: string[]
  secondaryPlatforms: string[]
  industryExpertise: string[]
  preferredProjectTypes: string[]
  toolsStack: string[]
  tags: ExpertTagResponse[]
  links: ExpertLinkResponse[]
  projects: ExpertProjectResponse[]
  profilePictureUrl?: string | null
  profilePictureKey?: string | null
  schedulingLink?: string | null
  schedulingProvider?: string | null
  schedulingLinkEnabled?: boolean
  socialLinks?: SocialLink[]
  productExpertise?: ExpertProductExpertiseResponse[]
  regionsServed?: string[]
  earliestStartDate?: string | null
  remoteOnly?: boolean
}

export interface ExpertMe {
  id: string
  status: string
  displayName: string
  headline?: string | null
  entityType?: string | null
  regionCountry?: string | null
  regionCity?: string | null
  timezone?: string | null
  yearsExperience?: number | null
  projectsCompletedTotal?: number | null
  introVideoLink?: string | null
  availabilityHoursPerWeek?: number | null
  availabilityNotes?: string | null
  whyPlatform?: string | null
  uniqueStrength?: string | null
  idealClients?: string | null
  biggestWin?: string | null
  primaryPlatforms: string[]
  secondaryPlatforms: string[]
  industryExpertise: string[]
  preferredProjectTypes: string[]
  toolsStack: string[]
  tags: ExpertTagResponse[]
  links: ExpertLinkResponse[]
  projects: ExpertProjectResponse[]
  featuredProjects: ExpertProjectResponse[]  // alias for frontend compatibility
  profilePictureUrl?: string | null
  profilePictureKey?: string | null
  agreeTerms: boolean
  consentContact: boolean
  reviews: unknown[]
  createdAt: string
  updatedAt: string
  schedulingProvider?: string | null
  schedulingLink?: string | null
  schedulingLinkEnabled?: boolean
  socialLinks?: SocialLink[]
  productExpertise?: ExpertProductExpertiseResponse[]
  regionsServed?: string[]
  earliestStartDate?: string | null
  remoteOnly?: boolean
  lastStepKey?: string | null
  submittedAt?: string | null
  progress?: ExpertProgress | null
}

// View model for expert listing (explore-experts page)
export interface ExpertListItem {
  id: string
  email?: string | null
  displayName: string
  headline: string | null
  entityType?: string | null
  regionCity: string | null
  regionCountry: string | null
  timezone?: string | null
  yearsExperience: number | null
  projectsCompletedTotal?: number | null
  availabilityNotes?: string | null
  primaryPlatforms?: string[]
  secondaryPlatforms?: string[]
  industryExpertise?: string[]
  preferredProjectTypes?: string[]
  toolsStack?: string[]
  tags: ExpertTagResponse[]
  projects?: ExpertProjectResponse[]
  profilePictureUrl: string | null
  schedulingLink?: string | null
  schedulingLinkEnabled?: boolean
}

// ─── Directory facets ────────────────────────────────────────────────────
// Mirrors experts/browse/models.py (ExpertFacets). Counts are disjunctive:
// each group is counted with every *other* applied filter still in force.

export interface ExpertFacetOption {
  value: string
  label: string
  count: number
  selected: boolean
  logoUrl?: string | null
  industryFit?: string[]
}

export interface ExpertFacetGroup {
  /** `exclusive` is a single-select pair — choosing both would filter nothing. */
  selection: 'disjunctive' | 'threshold' | 'boolean' | 'exclusive'
  options: ExpertFacetOption[]
}

export interface ExpertFacetScope {
  search?: string | null
  /** Approved experts in scope (search-matched when a search is given). */
  universe: number
  /** Experts matching every applied filter. */
  matched: number
}

/** Group keys are the server's: products, product_years, industries, … */
export interface ExpertFacets {
  scope: ExpertFacetScope
  groups: Record<string, ExpertFacetGroup>
}

// API response wrapper for list
export interface ExpertListResponse {
  experts: ExpertListItem[]
  count?: number
  total?: number
  page?: number
  limit?: number
  facets?: ExpertFacets | null
}
