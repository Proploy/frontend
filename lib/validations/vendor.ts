import { z } from 'zod'

// Step 1 - Expertise (ExpertiseStep uses accountType, platform, industry)
const expertiseStepSchema = z.object({
  accountType: z.string().min(1, 'Account type is required'),
  displayName: z.string().min(1, 'Display name is required'),
  headline: z.string().min(1, 'Professional headline is required'),
  categories: z.array(z.string()).min(1, 'At least one platform is required'),
})

// Step 2 - Credentials (CredentialsStep uses yearsExperience; bio is not collected)
const credentialsStepSchema = z.object({
  yearsExperience: z.string().min(1, 'Years of experience is required'),
})

// Step 3 - Projects (ProjectsStep uses totalProjects string)
const projectsStepSchema = z.object({
  totalProjects: z.string().min(1, 'Total projects completed is required'),
})

const uploadedApplicationFileSchema = z.object({
  name: z.string().min(1),
  size: z.number().nonnegative(),
  publicUrl: z.string().url().nullable().optional(),
  storageKey: z.string().nullable().optional(),
  fileContentType: z.string().nullable().optional(),
  visible: z.boolean(),
})

// Step 4 - Portfolio (links and uploaded portfolio files are valid evidence)
const portfolioStepSchema = z.object({
  portfolioLinks: z.array(z.object({
    url: z.string().min(1, 'URL is required'),
    visible: z.boolean(),
  })),
  portfolioFiles: z.array(uploadedApplicationFileSchema),
}).refine(
  (value) => value.portfolioLinks.length > 0 || value.portfolioFiles.length > 0,
  { message: 'Add at least one portfolio link or upload a portfolio file', path: ['portfolioLinks'] },
)

// Step 5 - Preferences (PreferencesStep uses timezone, regions[], weeklyAvailability, preferredProjectTypes[], whyPlatforms)
const preferencesStepSchema = z.object({
  timezone: z.string().min(1, 'Timezone is required'),
  regions: z.array(z.string()).min(1, 'At least one region is required'),
  weeklyAvailability: z.string().min(1, 'Weekly availability is required'),
  preferredProjectTypes: z.array(z.string()).min(1, 'At least one project type is required'),
})

// Full submit schema — mirrors VendorOnboardingData field names
export const vendorSubmitSchema = z.object({
  accountType: z.string().min(1),
  displayName: z.string().min(1),
  headline: z.string().min(1),
  categories: z.array(z.string()).min(1),
  specializations: z.array(z.string()),
  skills: z.array(z.string()),
  platform: z.string(),
  industry: z.string(),
  industries: z.array(z.string()),
  certificationFiles: z.array(uploadedApplicationFileSchema),
  manualCertifications: z.array(z.string()),
  yearsExperience: z.string().min(1),
  openToAssessment: z.boolean(),
  totalProjects: z.string().min(1),
  featuredProjects: z.array(z.object({
    title: z.string().min(1),
    clientIndustry: z.string(),
    platform: z.string(),
    delivered: z.string().min(1),
    outcome: z.string(),
    link: z.string(),
    ndaSafe: z.boolean(),
  })),
  portfolioFiles: z.array(uploadedApplicationFileSchema),
  portfolioLinks: z.array(z.object({ url: z.string(), visible: z.boolean() })),
  visibilitySettings: z.record(z.string(), z.boolean()),
  timezone: z.string().min(1),
  regions: z.array(z.string()).min(1),
  weeklyAvailability: z.string().min(1),
  earliestStartDate: z.string(),
  preferredProjectTypes: z.array(z.string()).min(1),
  whyPlatforms: z.string(),
  agreements: z.array(z.boolean()),
})

// Per-step schemas — index 0 = overview, 6 = review, 7 = submitted
export const vendorStepSchemas = [
  z.object({}), // Step 0 - Overview (no fields)
  expertiseStepSchema,
  credentialsStepSchema,
  projectsStepSchema,
  portfolioStepSchema,
  preferencesStepSchema,
  z.object({}), // Step 6 - Review (no additional fields validated here)
  z.object({}), // Step 7 - Submitted (no fields)
]
