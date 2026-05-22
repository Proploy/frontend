// vendor-contracts.ts
// Type contracts for vendor/expert onboarding.

export interface FeaturedProject {
  title: string
  clientIndustry: string
  platform: string
  delivered: string
  outcome: string
  link: string
  ndaSafe: boolean
}

export interface AddedLink {
  url: string
  visible: boolean
}

export interface VendorOnboardingData {
  accountType?: string
  categories: string[]
  specializations: string[]
  skills: string[]
  platform?: string
  industry?: string
  certificationFiles: { name: string; size: number }[]
  manualCertifications: string[]
  yearsExperience: string
  openToAssessment: boolean
  totalProjects: string
  featuredProjects: FeaturedProject[]
  portfolioFiles: File[]
  portfolioLinks: AddedLink[]
  visibilitySettings: Record<string, boolean>
  timezone: string
  regions: string[]
  weeklyAvailability: string
  earliestStartDate: string
  preferredProjectTypes: string[]
  whyPlatforms: string
  agreements: boolean[]
}