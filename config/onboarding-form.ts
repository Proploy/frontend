export const PLATFORM_SUGGESTIONS = [
    'Monday.com', 'Asana', 'HubSpot', 'Jira', 'Salesforce',
    'Slack', 'Zendesk', 'Shopify', 'WordPress', 'Webflow'
]

export const INDUSTRY_SUGGESTIONS = [
    'FinTech', 'Healthcare', 'E-commerce', 'SaaS', 'EdTech', 'Real Estate',
    'Logistics', 'Manufacturing', 'Retail', 'Banking', 'Insurance',
    'Travel & Hospitality', 'Media & Entertainment', 'Sports & Fitness',
    'Food & Beverage', 'Automotive', 'Energy', 'Telecommunications',
    'Government', 'Non-Profit', 'Startups', 'Enterprise'
]

export const PROJECT_PRIORITY_GROUPS: Record<string, string[]> = {
    Automation: ['AI Agents', 'Workflow Builders', 'No-Code Bots'],
    Ecosystem: ['App Marketplace', 'API Connectors', 'Integrations'],
    'Growth (PLG)': ['Onboarding', 'Product Tours', 'Self-Serve Upsell'],
    Vertical: ['Compliance Tools', 'Specialized CRM'],
    Marketing: ['Product Comparisons', 'SEO', 'Case Studies'],
}

export const PROJECT_TYPE_SUGGESTIONS = Object.values(PROJECT_PRIORITY_GROUPS).flat()

export const TOOLS_SUGGESTIONS = [
    'Monday.com', 'Asana', 'HubSpot', 'Jira', 'Salesforce', 'Zendesk',
    'Slack', 'Trello', 'Notion', 'Confluence', 'GitHub', 'Figma',
    'Postman', 'Docker', 'AWS', 'Azure', 'GCP', 'Zoom', 'Calendly',
    'Google Workspace', 'Microsoft 365', 'Dropbox', 'Stripe', 'Twilio'
]

export const MAJOR_COUNTRY_OPTIONS = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Spain',
    'Italy',
    'Netherlands',
    'Sweden',
    'Norway',
    'Denmark',
    'Switzerland',
    'Ireland',
    'Portugal',
    'Poland',
    'United Arab Emirates',
    'Saudi Arabia',
    'South Africa',
    'India',
    'Singapore',
    'Japan',
    'South Korea',
    'China',
    'Hong Kong',
    'New Zealand',
    'Brazil',
    'Mexico',
    'Argentina',
    'Chile',
]

export const TIMEZONE_OPTIONS = [
    'UTC-8 (PST)',
    'UTC-7 (MST)',
    'UTC-6 (CST)',
    'UTC-5 (EST)',
    'UTC-4 (AST)',
    'UTC-3 (BRT)',
    'UTC+0 (GMT)',
    'UTC+1 (CET)',
    'UTC+2 (EET)',
    'UTC+3 (GST)',
    'UTC+5:30 (IST)',
    'UTC+8 (SGT)',
    'UTC+9 (JST)',
    'UTC+10 (AEST)',
    'UTC+12 (NZST)',
]

export interface OnboardingField {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'tags' | 'url_list' | 'project_list' | 'project_priority' | 'url'
  required?: boolean
  placeholder?: string
  options?: string[]
  suggestions?: string[]
  groupedOptions?: Record<string, string[]>
}

export interface OnboardingStep {
  id: number
  title: string
  description: string
  fields: OnboardingField[]
}

export const onboardingSteps: OnboardingStep[] = [
    {
        id: 1,
        title: 'Identity & Entity',
        description: 'Tell us who you are and where you are located.',
        fields: [
            { name: 'entityType', label: 'Entity Type', type: 'select', options: ['Individual', 'Business/Team'], required: true },
            { name: 'displayName', label: 'Display Name (Public)', type: 'text', placeholder: 'e.g. John Doe Consulting', required: true },
            { name: 'headline', label: 'Headline', type: 'text', placeholder: 'One-line expertise summary', required: true },
            { name: 'regionCountry', label: 'Country', type: 'select', options: MAJOR_COUNTRY_OPTIONS, required: true },
            { name: 'regionCity', label: 'City', type: 'text', placeholder: 'e.g. London', required: true },
            { name: 'timezone', label: 'Timezone', type: 'select', options: TIMEZONE_OPTIONS, required: true },
        ],
    },
    {
        id: 2,
        title: 'Expertise & Focus',
        description: 'Define your area of expertise.',
        fields: [
            { name: 'primaryPlatforms', label: 'Primary Platforms', type: 'tags', required: true, suggestions: PLATFORM_SUGGESTIONS },
            { name: 'secondaryPlatforms', label: 'Secondary Platforms', type: 'tags', required: false, suggestions: PLATFORM_SUGGESTIONS },
            { name: 'industryExpertise', label: 'Industry Expertise', type: 'tags', required: true, suggestions: INDUSTRY_SUGGESTIONS },
            { name: 'preferredProjectTypes', label: 'Project Priorities', type: 'project_priority', required: true, groupedOptions: PROJECT_PRIORITY_GROUPS },
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
            { name: 'portfolioLinks', label: 'Portfolio Links', type: 'url_list', required: true },
            { name: 'caseStudyLinks', label: 'Case Study Links', type: 'url_list', required: false },
            { name: 'certificationLinks', label: 'Certification Links', type: 'url_list', required: true },
            { name: 'testimonialsLinks', label: 'Testimonials Links', type: 'url_list', required: true },
            { name: 'featuredProjects', label: 'Featured Projects', type: 'project_list', required: true },
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
            { name: 'toolsStack', label: 'Tools Stack', type: 'tags', required: true, suggestions: TOOLS_SUGGESTIONS },
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
