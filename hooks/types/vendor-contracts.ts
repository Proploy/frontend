// vendor-contracts.ts
// Type contracts for vendor/expert onboarding.

export interface VendorOnboardingData {
  // Overview step
  accountType?: string

  // Step 1 - Expertise
  categories: string[]
  specializations: string[]
  skills: string[]
  platform?: string
  industry?: string

  // Step 2 - Credentials
  certificationFiles: { name: string; size: number }[]
  manualCertifications: string[]
  yearsExperience: string
  openToAssessment: boolean

  // Step 3 - Projects
  totalProjects: string
  featuredProjects: FeaturedProject[]

  // Step 4 - Portfolio
  portfolioFiles: File[]
  portfolioLinks: AddedLink[]
  visibilitySettings: Record<string, boolean>

  // Step 5 - Preferences
  timezone: string
  regions: string[]
  weeklyAvailability: string
  earliestStartDate: string
  preferredProjectTypes: string[]
  whyPlatforms: string

  // Step 6 - Review
  agreements: boolean[]
}

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