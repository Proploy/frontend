// Re-exports for ExpertApplicationForm (migrated from unified onboarding-config)
// TODO: remove these re-exports once ExpertApplicationForm is updated to use
// the step-based config directly instead of flat suggestion lists.
export const INDUSTRY_SUGGESTIONS: string[] = []
export const PLATFORM_SUGGESTIONS: string[] = []
export const TOOLS_SUGGESTIONS: string[] = []
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OnboardingField = Record<string, any>
// PROJECT_PRIORITY_GROUPS was a Record<string, string[]> — unused in the step
// config, so provide a minimal stub to unblock the build.
export const PROJECT_PRIORITY_GROUPS: Record<string, string[]> = {}

export const onboardingSteps = [
    {
        id: 1,
        title: 'Identity & Entity',
        description: 'Tell us who you are and where you are located.',
        fields: [
            { name: 'entityType', label: 'Entity Type', type: 'select', options: ['Individual', 'Business/Team'], required: true },
            { name: 'displayName', label: 'Display Name (Public)', type: 'text', placeholder: 'e.g. John Doe Consulting', required: true },
            { name: 'headline', label: 'Headline', type: 'text', placeholder: 'One-line expertise summary', required: true },
            { name: 'regionCountry', label: 'Country', type: 'text', placeholder: 'e.g. United Kingdom', required: true },
            { name: 'regionCity', label: 'City', type: 'text', placeholder: 'e.g. London', required: true },
            { name: 'timezone', label: 'Timezone', type: 'text', placeholder: 'e.g. GMT', required: true },
        ],
    },
    {
        id: 2,
        title: 'Expertise & Focus',
        description: 'Define your area of expertise.',
        fields: [
            { name: 'primary_platforms', label: 'Primary Platforms', type: 'tags', required: true },
            { name: 'secondary_platforms', label: 'Secondary Platforms', type: 'tags', required: false },
            { name: 'industry_expertise', label: 'Industry Expertise', type: 'tags', required: true },
            { name: 'preferred_project_types', label: 'Preferred Project Types', type: 'tags', required: true },
            { name: 'yearsExperience', label: 'Years of Experience', type: 'number', required: true },
            { name: 'projectsCompletedTotal', label: 'Total Projects Completed', type: 'number', required: true },
        ],
    },
    {
        id: 3,
        title: 'Proof & Portfolio',
        description: 'Provide links and examples of your work.',
        fields: [
            { name: 'introVideoLink', label: 'Intro Video Link', type: 'url', placeholder: 'YouTube/Vimeo link', required: true },
            { name: 'portfolio_links', label: 'Portfolio Links', type: 'url_list', required: true },
            { name: 'case_study_links', label: 'Case Study Links', type: 'url_list', required: false },
            { name: 'certification_links', label: 'Certification Links', type: 'url_list', required: true },
            { name: 'testimonials_links', label: 'Testimonials Links', type: 'url_list', required: true },
            { name: 'featured_projects', label: 'Featured Projects', type: 'project_list', required: false },
        ],
    },
    {
        id: 4,
        title: 'Availability & Fit',
        description: 'When and how do you work?',
        fields: [
            { name: 'availabilityHoursPerWeek', label: 'Availability (Hours/Week)', type: 'number', required: true },
            { name: 'availabilityNotes', label: 'Availability Notes', type: 'textarea', required: true },
            { name: 'whyPlatform', label: 'Why join this platform?', type: 'textarea', required: true },
            { name: 'uniqueStrength', label: 'Your unique strength', type: 'textarea', required: true },
            { name: 'idealClients', label: 'Your ideal clients', type: 'textarea', required: true },
            { name: 'biggestWin', label: 'Your biggest win', type: 'textarea', required: true },
            { name: 'tools_stack', label: 'Tools Stack', type: 'tags', required: true },
        ],
    },
    {
        id: 5,
        title: 'Compliance',
        description: 'Finalize your application.',
        fields: [
            { name: 'agreeTerms', label: 'I agree to the terms and conditions', type: 'checkbox', required: true },
            { name: 'consentContact', label: 'I consent to being contacted by the platform', type: 'checkbox', required: true },
        ],
    },
]
