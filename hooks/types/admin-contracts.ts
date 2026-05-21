// admin-contracts.ts
// Type contracts for admin service-apis responses.
// Mirrors the exact JSON shapes returned by service-apis.

export interface AdminExpertUser {
  supabaseUserId: string
  email: string
  name: string | null
  avatarUrl: string | null
}

export interface AdminExpert {
  id: string
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'changes_requested'
  displayName: string
  headline: string | null
  entityType: string | null
  regionCountry: string | null
  regionCity: string | null
  yearsExperience: number | null
  createdAt: string
  updatedAt: string
  user: AdminExpertUser
  reviews: unknown[]
}

export interface AdminExpertDetail extends AdminExpert {
  timezone: string | null
  introVideoLink: string | null
  availabilityHoursPerWeek: string | null
  availabilityNotes: string | null
  whyPlatform: string | null
  uniqueStrength: string | null
  idealClients: string | null
  biggestWin: string | null
  primaryPlatforms: string[]
  secondaryPlatforms: string[]
  industryExpertise: string[]
  preferredProjectTypes: string[]
  toolsStack: string[]
  tags: { tagType: string; tagValue: string }[]
  links: { linkType: string; url: string }[]
  projects: { title: string; description: string; link: string | null; role: string | null }[]
  profilePictureUrl: string | null
  profilePictureKey: string | null
  projectsCompletedTotal: number | null
}

export interface AdminExpertsListResponse {
  data: AdminExpert[]
  total: number
  page: number
  limit: number
}
