// Expert project file upload — get a signed URL to PUT the file directly
export type ExpertProjectUploadUrlResponse = {
  uploadUrl: string
  storageKey: string
}

// Expert project file download — get a signed URL to retrieve the file
export type ExpertProjectDownloadUrlResponse = {
  downloadUrl: string
  expiresIn: number
}

export type ExpertProfilePictureUploadUrlResponse = {
  uploadUrl: string
  storageKey: string
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
  linkType: string  // portfolio | case_study | certification | testimonial
  url: string
}

export interface ExpertProjectInput {
  title: string
  summary: string
  link?: string | null
  outcomes: string
  fileUrl?: string | null
  fileStorageKey?: string | null
  fileName?: string | null
  fileContentType?: string | null
  fileSizeBytes?: number | null
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
}

export interface ExpertApplyRequest extends ExpertDraftRequest {
  displayName: string
  headline: string
  yearsExperience: number
}

// ExpertSubmitRequest extends ExpertDraftRequest with no additional fields
export type ExpertSubmitRequest = ExpertDraftRequest

export interface ExpertTagResponse {
  id: string
  tagType: string
  tagValue: string
}

export interface ExpertLinkResponse {
  id: string
  linkType: string
  url: string
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
}

export interface ExpertPublic {
  id: string
  displayName: string
  headline?: string | null
  entityType?: string | null
  regionCountry?: string | null
  regionCity?: string | null
  timezone?: string | null
  yearsExperience?: number | null
  projectsCompletedTotal?: number | null
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
}

// View model for expert listing (explore-experts page)
export interface ExpertListItem {
  id: string
  displayName: string
  headline: string | null
  regionCity: string | null
  regionCountry: string | null
  yearsExperience: number | null
  tags: ExpertTagResponse[]
  profilePictureUrl: string | null
}

// API response wrapper for list
export interface ExpertListResponse {
  experts: ExpertListItem[]
  total?: number
  page?: number
  limit?: number
}