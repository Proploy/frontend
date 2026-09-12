import { z } from 'zod'
import type { VendorOnboardingData, VendorSectionKey } from '@/hooks/types/vendor-contracts'
import { MAX_SOCIAL_LINKS } from '@/features/experts/onboarding-mappers'
import { socialUrlError } from '@/features/experts/social-links'
import type { SocialPlatform } from '@/features/experts/types'

export { MAX_SOCIAL_LINKS }

// Per-section schemas. Nothing here blocks navigation or saving: the wizard
// runs the active section's schema and shows the messages as inline hints.
// The server's `progress` block is the source of truth for completeness.

const optionalHttpsUrl = z.string().refine(
  (value) => {
    if (!value.trim()) return true
    try {
      const parsed = new URL(value)
      return parsed.protocol === 'https:' && Boolean(parsed.hostname)
    } catch {
      return false
    }
  },
  { message: 'Links must start with https://' },
)

const integerString = (min: number, max: number, label: string) =>
  z.string().refine(
    (value) => {
      if (!value.trim()) return true
      const parsed = Number(value)
      return Number.isInteger(parsed) && parsed >= min && parsed <= max
    },
    { message: `${label} must be a whole number between ${min} and ${max}` },
  )


const identitySectionSchema = z.object({
  accountType: z.string().min(1, 'Choose an account type'),
  displayName: z.string().trim().min(1, 'Add a public display name'),
  headline: z.string().trim().min(1, 'Add a professional headline'),
})

const certificationSchema = z.object({
  name: z.string(),
  issuer: z.string(),
  year: integerString(1980, new Date().getFullYear() + 1, 'Certification year'),
  credentialUrl: optionalHttpsUrl,
})

const productSchema = z.object({
  productName: z.string().trim().min(1, 'Product name is required'),
  yearsExperience: integerString(0, 60, 'Years on this product'),
  projectsCompleted: integerString(0, 10000, 'Projects on this product'),
  certifications: z.array(certificationSchema),
})

const productsSectionSchema = z.object({
  productExpertise: z.array(productSchema).min(1, 'Add at least one product you work on'),
  industries: z.array(z.string()).min(1, 'Select at least one industry'),
}).superRefine((value, ctx) => {
  const seen = new Set<string>()
  for (const product of value.productExpertise) {
    const key = product.productName.trim().toLowerCase()
    if (seen.has(key)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `${product.productName} is listed twice`, path: ['productExpertise'] })
    }
    seen.add(key)
    if (!product.yearsExperience.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Add years of experience on ${product.productName}`, path: ['productExpertise'] })
    }
  }
})

const experienceSectionSchema = z.object({
  yearsExperience: z.string().min(1, 'Select your total years of experience'),
  totalProjects: integerString(0, 100000, 'Total projects').refine((v) => v.trim().length > 0, {
    message: 'Add the total number of client projects you have completed',
  }),
})

const socialLinkSchema = z
  .object({
    platform: z.string(),
    url: z.string(),
  })
  .superRefine((link, ctx) => {
    const message = socialUrlError(link.platform as SocialPlatform, link.url)
    if (message) ctx.addIssue({ code: z.ZodIssueCode.custom, message, path: ['url'] })
  })

const socialsSectionSchema = z.object({
  socialLinks: z.array(socialLinkSchema).max(MAX_SOCIAL_LINKS, `Add at most ${MAX_SOCIAL_LINKS} links`),
}).superRefine((value, ctx) => {
  const seen = new Set<string>()
  for (const link of value.socialLinks) {
    const key = `${link.platform}|${link.url.trim().toLowerCase()}`
    if (seen.has(key)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'The same link is listed twice', path: ['socialLinks'] })
    }
    seen.add(key)
  }
})

const uploadedApplicationFileSchema = z.object({
  name: z.string().min(1),
  size: z.number().nonnegative(),
  publicUrl: z.string().url().nullable().optional(),
  storageKey: z.string().nullable().optional(),
  fileContentType: z.string().nullable().optional(),
  visible: z.boolean(),
})

const featuredProjectSchema = z.object({
  title: z.string().trim().min(1, 'Every featured project needs a title'),
  platform: z.string(),
  clientIndustry: z.string(),
  delivered: z.string().trim().min(1, 'Describe what you delivered on each featured project'),
  outcome: z.string(),
  link: optionalHttpsUrl,
  ndaSafe: z.boolean(),
})

const evidenceSectionSchema = z.object({
  featuredProjects: z.array(featuredProjectSchema).max(3, 'Feature at most three projects'),
  portfolioLinks: z.array(z.object({ url: z.string().min(1, 'URL is required'), visible: z.boolean() })),
  portfolioFiles: z.array(uploadedApplicationFileSchema),
  introVideoLink: z.string().optional(),
}).refine(
  (value) =>
    value.featuredProjects.length > 0
    || value.portfolioLinks.length > 0
    || value.portfolioFiles.length > 0
    || Boolean(value.introVideoLink?.trim()),
  { message: 'Add a project, a portfolio item, or an intro video', path: ['featuredProjects'] },
)

const availabilitySectionSchema = z.object({
  timezone: z.string().min(1, 'Select your timezone'),
  regionCountry: z.string().min(1, 'Select the country you are based in'),
  regionCity: z.string(),
  regions: z.array(z.string()).min(1, 'Select at least one region you can serve'),
  weeklyAvailability: z.string().min(1, 'Choose your weekly availability'),
  earliestStartDate: z.string().refine((v) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), {
    message: 'Earliest start date must be a valid date',
  }),
  preferredProjectTypes: z.array(z.string()).min(1, 'Select at least one project type'),
})

const agreementsSectionSchema = z.object({
  agreements: z.array(z.boolean()).refine((v) => Boolean(v[0] && v[1]), {
    message: 'Accept the vendor terms and privacy policy to submit',
  }),
})

export const vendorSectionSchemas: Record<VendorSectionKey, z.ZodTypeAny> = {
  identity: identitySectionSchema,
  products: productsSectionSchema,
  experience: experienceSectionSchema,
  socials: socialsSectionSchema,
  evidence: evidenceSectionSchema,
  availability: availabilitySectionSchema,
  agreements: agreementsSectionSchema,
}

/** Inline hints for one section. Empty when the section validates. */
export function getSectionHints(section: VendorSectionKey, form: VendorOnboardingData): string[] {
  const result = vendorSectionSchemas[section].safeParse(form)
  if (result.success) return []
  const messages = result.error.errors.map((issue) => issue.message)
  return Array.from(new Set(messages))
}
