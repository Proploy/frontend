// expert-contracts.ts
// Type contracts for expert service-apis responses.

export interface ExpertTag {
  id: string
  tagValue: string
}

export interface ExpertListItem {
  id: string
  displayName: string
  headline: string | null
  regionCity: string | null
  regionCountry: string | null
  yearsExperience: number | null
  tags: ExpertTag[]
}

export interface ExpertListResponse {
  data: ExpertListItem[]
  total: number
}