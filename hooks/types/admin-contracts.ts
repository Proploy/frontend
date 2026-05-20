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
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
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

export interface AdminExpertsListResponse {
  data: AdminExpert[]
  total: number
  page: number
  limit: number
}
