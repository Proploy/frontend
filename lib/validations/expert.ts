import { z } from 'zod'

export const expertStatusSchema = z.enum([
    'draft',
    'submitted',
    'approved',
    'rejected',
    'changes_requested',
])

export const tagTypeSchema = z.enum([
    'platform',
    'industry',
    'project_type',
    'tool',
])

export const linkTypeSchema = z.enum([
    'portfolio',
    'case_study',
    'certification',
    'testimonial',
])

export const expertTagSchema = z.object({
    tagType: tagTypeSchema,
    tagValue: z.string().min(1),
})

export const expertLinkSchema = z.object({
    linkType: linkTypeSchema,
    url: z.string().url(),
})

export const expertProjectSchema = z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    link: z.string().url().optional().or(z.literal('')),
    outcomes: z.string().min(1),
})

export const expertDraftSchema = z.object({
    entityType: z.string().optional(),
    displayName: z.string().optional(),
    headline: z.string().optional(),
    regionCountry: z.string().optional(),
    regionCity: z.string().optional(),
    timezone: z.string().optional(),
    yearsExperience: z.number().int().min(0).optional(),
    projectsCompletedTotal: z.number().int().min(0).optional(),
    introVideoLink: z.string().url().optional().or(z.literal('')),
    availabilityHoursPerWeek: z.number().int().min(0).optional(),
    availabilityNotes: z.string().optional(),
    whyPlatform: z.string().optional(),
    uniqueStrength: z.string().optional(),
    idealClients: z.string().optional(),
    biggestWin: z.string().optional(),
    primaryPlatforms: z.array(z.string()).optional(),
    secondaryPlatforms: z.array(z.string()).optional(),
    industryExpertise: z.array(z.string()).optional(),
    preferredProjectTypes: z.array(z.string()).optional(),
    toolsStack: z.array(z.string()).optional(),
    tags: z.array(expertTagSchema).optional(),
    links: z.array(expertLinkSchema).optional(),
    projects: z.array(expertProjectSchema).optional(),
    agreeTerms: z.boolean().optional(),
    consentContact: z.boolean().optional(),
})

const stringRequired = (msg: string) => z.string().trim().min(1, msg)
const numberRequired = (msg: string) => z.number().int().min(0, msg)
const urlRequired = (msg: string) => z.string().trim().url(msg)
const requiredStringArray = (msg: string) => z.array(z.string().trim().min(1)).min(1, msg)
const webLinkSchema = z.string().trim().min(1).transform((value) => {
    if (/^https?:\/\//i.test(value)) {
        return value
    }

    return `https://${value}`
}).pipe(z.string().url('Please enter a valid web link'))

export const expertSubmitSchema = z.object({
    entityType: stringRequired('Entity type is required'),
    displayName: stringRequired('Display name is required'),
    headline: stringRequired('Headline is required'),
    regionCountry: stringRequired('Country is required'),
    regionCity: stringRequired('City is required'),
    timezone: stringRequired('Timezone is required'),
    yearsExperience: numberRequired('Years of experience is required'),
    projectsCompletedTotal: numberRequired('Total projects completed is required'),
    introVideoLink: urlRequired('Intro video link is required'),
    availabilityHoursPerWeek: numberRequired('Availability is required'),
    availabilityNotes: stringRequired('Availability notes are required'),
    whyPlatform: stringRequired('This field is required'),
    uniqueStrength: stringRequired('This field is required'),
    idealClients: stringRequired('This field is required'),
    biggestWin: stringRequired('This field is required'),
    primaryPlatforms: requiredStringArray('Primary platforms are required'),
    secondaryPlatforms: z.array(z.string()).optional(),
    industryExpertise: requiredStringArray('Industry expertise is required'),
    preferredProjectTypes: requiredStringArray('Project priorities are required'),
    toolsStack: requiredStringArray('Tools stack is required'),
    tags: z.array(expertTagSchema).optional(),
    links: z.array(expertLinkSchema).optional(),
    projects: z.array(expertProjectSchema).optional(),
    portfolioLinks: z.array(webLinkSchema).min(1, 'Portfolio links are required'),
    caseStudyLinks: z.array(webLinkSchema).optional(),
    certificationLinks: z.array(webLinkSchema).min(1, 'Certification links are required'),
    testimonialsLinks: z.array(webLinkSchema).min(1, 'Testimonials links are required'),
    featuredProjects: z.array(expertProjectSchema).min(1, 'Featured projects are required'),
    agreeTerms: z.boolean().refine(val => val === true, {
        message: 'You must agree to the terms and conditions',
    }),
    consentContact: z.boolean().refine(val => val === true, {
        message: 'You must consent to being contacted',
    }),
})
