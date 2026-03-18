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
    tags: z.array(expertTagSchema).optional(),
    links: z.array(expertLinkSchema).optional(),
    projects: z.array(expertProjectSchema).optional(),
})

export const expertSubmitSchema = z.object({
    entityType: z.string().min(1, 'Entity type is required'),
    displayName: z.string().min(1, 'Display name is required'),
    headline: z.string().min(1, 'Headline is required'),
    regionCountry: z.string().min(1, 'Country is required'),
    regionCity: z.string().min(1, 'City is required'),
    timezone: z.string().min(1, 'Timezone is required'),
    yearsExperience: z.number().int().min(0, 'Years of experience is required'),
    projectsCompletedTotal: z.number().int().min(0, 'Total projects completed is required'),
    introVideoLink: z.string().url('Invalid video link'),
    availabilityHoursPerWeek: z.number().int().min(0, 'Availability is required'),
    availabilityNotes: z.string().min(1, 'Availability notes are required'),
    whyPlatform: z.string().min(1, 'This field is required'),
    uniqueStrength: z.string().min(1, 'This field is required'),
    idealClients: z.string().min(1, 'This field is required'),
    biggestWin: z.string().min(1, 'This field is required'),
    tags: z.array(expertTagSchema).min(1, 'At least one tag is required'),
    links: z.array(expertLinkSchema).min(1, 'At least one link is required'),
    projects: z.array(expertProjectSchema).optional(),
    agreeTerms: z.literal(true, {
        errorMap: () => ({ message: 'You must agree to the terms' }),
    }),
    consentContact: z.literal(true, {
        errorMap: () => ({ message: 'You must consent to being contacted' }),
    }),
})
