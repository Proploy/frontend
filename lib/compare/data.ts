// lib/compare/data.ts — Proploy comparison sample data (ported from the design prototype).
// Products only — the previous 'expert' and 'business' entity types have been removed.
// Illustrative sample data — structured so it can later be wired to live catalog APIs.

export type EntityType = 'product'
export type LogoTone = 'brand' | 'pink' | 'success' | 'blue' | 'indigo'
export type Complexity = 'Low' | 'Medium' | 'High'
export type RecommendedPath =
  | 'Self-serve'
  | 'Guided setup'
  | 'Expert-led implementation'
  | 'White-glove project'

export interface EntityFit {
  teamSize: string
  industryFit: string
  workflows: string[]
  integrations: string[]
  compliance: string[]
  deployment: string
  verdict: string
}

export interface EntityReviews {
  pros: string[]
  cons: string[]
  sentiment: string[]
  reviewerSegment: string
  reviewerIndustry: string
  outcomes?: string[]
}

export interface AlternativeEntity {
  id?: string
  name: string
  initial: string
  category: string
  rating: number
  logoUrl?: string | null
}

export interface Entity {
  id: string
  type: EntityType
  name: string
  initial: string
  logoTone: LogoTone
  category: string
  tagline: string
  rating: number
  reviewCount: number
  reviewSource: string
  bestFor: string
  notFor: string
  segment: string
  pricingBucket: string
  entryPrice: string
  priceUnit: string
  pricingModel: string
  freeTrial: boolean
  freePlan: boolean
  contactSales: boolean
  keyLimits: string
  implComplexity: Complexity
  rolloutTimeline: string
  onboardingEffort: string
  adminSkill: string
  migrationRisk: Complexity
  fitScore: number
  recommendedPath: RecommendedPath
  fit: EntityFit
  reviews: EntityReviews
  alternatives: AlternativeEntity[]
  // Optional fields populated by compareEntryToEntity from CompareProductEntry.
  // Undefined when built from the legacy ProductDetail path or from mock data.
  vendorName?: string | null
  logoUrl?: string | null
  officialWebsite?: string | null
}

export interface Filters {
  category: string
  companySize: string
  budget: string
  region: string
  timeline: string
}

export const FILTER_OPTIONS = {
  category: ['All categories', 'Project Management', 'CRM & Sales', 'Marketing Automation', 'Customer Support'],
  companySize: ['Any size', '1–10', '11–50', '51–200', '201–1,000', '1,000+'],
  budget: ['Any budget', 'Under $10 / seat', '$10–25 / seat', '$25–75 / seat', 'Enterprise / custom'],
  region: ['Any region', 'North America', 'EMEA', 'APAC', 'LATAM'],
  timeline: ['Any timeline', 'Under 2 weeks', '2–6 weeks', '6–12 weeks', '3 months+'],
} as const

// The buyer context the fit score is measured against (answers from the builder filters).
export const BUYER_CONTEXT: Filters = {
  category: 'Project Management',
  companySize: '51–200',
  budget: '$10–25 / seat',
  region: 'North America',
  timeline: '2–6 weeks',
}

export const COMPLEXITY: Record<Complexity, { label: string; tone: 'success' | 'warning' | 'error' }> = {
  Low: { label: 'Low', tone: 'success' },
  Medium: { label: 'Medium', tone: 'warning' },
  High: { label: 'High', tone: 'error' },
}

// ---- PRODUCTS -------------------------------------------------------------
const monday: Entity = {
  id: 'monday', type: 'product', name: 'monday.com', initial: 'M', logoTone: 'brand',
  category: 'Project Management', tagline: 'Work OS for cross-functional ops',
  rating: 4.7, reviewCount: 12420, reviewSource: 'G2 + verified buyers',
  bestFor: 'Cross-functional ops & marketing teams that want visual, no-code workflows',
  notFor: 'Engineering teams needing deep issue-tracking or sprint tooling',
  segment: 'SMB → Mid-market',
  pricingBucket: '$$', entryPrice: '$9', priceUnit: '/seat / mo',
  pricingModel: 'Per seat, billed annually', freeTrial: true, freePlan: true,
  contactSales: false, keyLimits: 'Free plan capped at 2 seats; automations gated to paid tiers',
  implComplexity: 'Medium', rolloutTimeline: '3–6 weeks', onboardingEffort: 'Moderate',
  adminSkill: 'Low–Medium', migrationRisk: 'Low',
  fitScore: 91, recommendedPath: 'Guided setup',
  fit: {
    teamSize: 'Built for 10–500 seats', industryFit: 'Strong: marketing, ops, agencies',
    workflows: ['Project tracking', 'Approvals', 'Intake forms', 'Dashboards'],
    integrations: ['Slack', 'Gmail', 'Salesforce', 'Zoom', 'Jira'],
    compliance: ['SOC 2', 'GDPR', 'ISO 27001'], deployment: 'Cloud (SaaS)',
    verdict: 'Strong fit for a 51–200 ops team on a mid-tier budget. Fastest of the two to a usable rollout.',
  },
  reviews: {
    pros: ['Fast to configure', 'Loved by non-technical teams', 'Strong dashboards'],
    cons: ['Per-seat cost adds up', 'Reporting depth limited'],
    sentiment: ['Easy onboarding', 'Responsive support'],
    reviewerSegment: '60% Mid-market', reviewerIndustry: 'Marketing, Agencies, Ops',
  },
  alternatives: [
    { name: 'Asana', initial: 'A', category: 'Project Management', rating: 4.4 },
    { name: 'ClickUp', initial: 'C', category: 'Project Management', rating: 4.5 },
    { name: 'Wrike', initial: 'W', category: 'Project Management', rating: 4.2 },
  ],
}

const asana: Entity = {
  id: 'asana', type: 'product', name: 'Asana', initial: 'A', logoTone: 'pink',
  category: 'Project Management', tagline: 'Task & project tracking',
  rating: 4.4, reviewCount: 10880, reviewSource: 'G2 + verified buyers',
  bestFor: 'Marketing & ops teams that live in tasks, projects, and timelines',
  notFor: 'Teams needing built-in budgeting or heavy resource management',
  segment: 'SMB → Mid-market',
  pricingBucket: '$$', entryPrice: '$10.99', priceUnit: '/seat / mo',
  pricingModel: 'Per seat, billed annually', freeTrial: true, freePlan: true,
  contactSales: false, keyLimits: 'Free plan up to 10 seats; timeline & portfolios are paid',
  implComplexity: 'Low', rolloutTimeline: '2–4 weeks', onboardingEffort: 'Light',
  adminSkill: 'Low', migrationRisk: 'Low',
  fitScore: 86, recommendedPath: 'Guided setup',
  fit: {
    teamSize: 'Built for 5–300 seats', industryFit: 'Strong: marketing, creative, ops',
    workflows: ['Task tracking', 'Project timelines', 'Intake forms', 'Goals'],
    integrations: ['Slack', 'Gmail', 'Salesforce', 'Zoom', 'Figma'],
    compliance: ['SOC 2', 'GDPR'], deployment: 'Cloud (SaaS)',
    verdict: 'Good fit and the lightest lift to deploy, but fewer ops/approval workflows than monday.com.',
  },
  reviews: {
    pros: ['Clean, intuitive UI', 'Quick team adoption', 'Good free tier'],
    cons: ['No native budgeting', 'Advanced views are paid'],
    sentiment: ['Intuitive', 'Great for small teams'],
    reviewerSegment: '55% SMB', reviewerIndustry: 'Marketing, Creative, Startups',
  },
  alternatives: [
    { name: 'monday.com', initial: 'M', category: 'Project Management', rating: 4.7 },
    { name: 'Trello', initial: 'T', category: 'Project Management', rating: 4.4 },
    { name: 'Notion', initial: 'N', category: 'Project Management', rating: 4.6 },
  ],
}

const hubspot: Entity = {
  id: 'hubspot', type: 'product', name: 'HubSpot', initial: 'H', logoTone: 'success',
  category: 'CRM & Sales', tagline: 'CRM, marketing & service hubs',
  rating: 4.4, reviewCount: 11240, reviewSource: 'G2 + verified buyers',
  bestFor: 'Growing teams that want CRM, marketing, and service in one suite',
  notFor: 'Teams that only need lightweight task management',
  segment: 'SMB → Mid-market',
  pricingBucket: '$$$', entryPrice: '$20', priceUnit: '/seat / mo',
  pricingModel: 'Tiered hubs + per seat', freeTrial: true, freePlan: true,
  contactSales: true, keyLimits: 'Marketing contacts metered; onboarding fee on Pro+',
  implComplexity: 'Medium', rolloutTimeline: '4–8 weeks', onboardingEffort: 'Moderate',
  adminSkill: 'Medium', migrationRisk: 'Medium',
  fitScore: 72, recommendedPath: 'Expert-led implementation',
  fit: {
    teamSize: 'Built for 10–1,000 seats', industryFit: 'Strong: sales, marketing, SaaS',
    workflows: ['Pipeline', 'Email automation', 'Ticketing', 'Reporting'],
    integrations: ['Slack', 'Gmail', 'Salesforce', 'Zoom', 'Stripe'],
    compliance: ['SOC 2', 'GDPR', 'ISO 27001'], deployment: 'Cloud (SaaS)',
    verdict: 'Powerful but broader than a PM need; only worth it if you also want CRM + marketing.',
  },
  reviews: {
    pros: ['All-in-one suite', 'Strong automation', 'Large partner network'],
    cons: ['Gets expensive fast', 'Contact tiers confuse buyers'],
    sentiment: ['Powerful', 'Steeper setup'],
    reviewerSegment: '50% Mid-market', reviewerIndustry: 'SaaS, Sales, Marketing',
  },
  alternatives: [
    { name: 'Salesforce', initial: 'S', category: 'CRM & Sales', rating: 4.3 },
    { name: 'Pipedrive', initial: 'P', category: 'CRM & Sales', rating: 4.5 },
    { name: 'Zoho CRM', initial: 'Z', category: 'CRM & Sales', rating: 4.1 },
  ],
}

const salesforce: Entity = {
  id: 'salesforce', type: 'product', name: 'Salesforce', initial: 'S', logoTone: 'blue',
  category: 'CRM & Sales', tagline: 'Enterprise CRM platform',
  rating: 4.3, reviewCount: 19360, reviewSource: 'G2 + verified buyers',
  bestFor: 'Sales orgs that need deep customisation and enterprise governance',
  notFor: 'Small teams wanting fast, low-admin setup',
  segment: 'Mid-market → Enterprise',
  pricingBucket: '$$$$', entryPrice: '$25', priceUnit: '/seat / mo',
  pricingModel: 'Per seat + add-ons, annual', freeTrial: true, freePlan: false,
  contactSales: true, keyLimits: 'Most value gated behind higher tiers + add-ons',
  implComplexity: 'High', rolloutTimeline: '8–16 weeks', onboardingEffort: 'Heavy',
  adminSkill: 'High', migrationRisk: 'High',
  fitScore: 54, recommendedPath: 'White-glove project',
  fit: {
    teamSize: 'Built for 50–10,000 seats', industryFit: 'Strong: enterprise sales, finance',
    workflows: ['Pipeline', 'Forecasting', 'Custom objects', 'Approvals'],
    integrations: ['Slack', 'Gmail', 'Outlook', 'Zoom', 'MuleSoft'],
    compliance: ['SOC 2', 'GDPR', 'ISO 27001', 'HIPAA'], deployment: 'Cloud (SaaS)',
    verdict: 'Over-built for a 51–200 PM need and the slowest, riskiest rollout of the set.',
  },
  reviews: {
    pros: ['Endlessly customisable', 'Enterprise-grade', 'Huge ecosystem'],
    cons: ['Complex admin', 'High total cost', 'Long implementations'],
    sentiment: ['Powerful', 'Needs an admin'],
    reviewerSegment: '65% Enterprise', reviewerIndustry: 'Finance, SaaS, Manufacturing',
  },
  alternatives: [
    { name: 'HubSpot', initial: 'H', category: 'CRM & Sales', rating: 4.4 },
    { name: 'Dynamics 365', initial: 'D', category: 'CRM & Sales', rating: 3.8 },
    { name: 'Pipedrive', initial: 'P', category: 'CRM & Sales', rating: 4.5 },
  ],
}

// ---- EXPERTS / BUSINESS (removed) ---------------------------------------
// The 'expert' and 'business' entity types were trimmed in Chunk C. The
// selector, switch, and mock data have been removed. The /compare page is
// products only.

export const ENTITIES: Record<string, Entity> = {
  monday, asana, hubspot, salesforce,
}

// Catalog for the selector search dropdown. Products only — _searchType
// was redundant once EntityType narrowed to 'product', so it has been
// removed entirely; consumers can rely on `type` directly.
export const CATALOG: Entity[] = [monday, asana, hubspot, salesforce]

export const TABS = ['At a glance', 'Pricing', 'Fit', 'Implementation', 'Reviews', 'Alternatives'] as const
export type Tab = (typeof TABS)[number]

export const TYPE_META: Record<EntityType, { label: string; color: string; bg: string; border: string }> = {
  product: { label: 'Product', color: '#155eef', bg: '#eff4ff', border: '#b2ccff' },
}

export const PATH_META: Record<RecommendedPath, { blurb: string; tier: number }> = {
  'Self-serve': { blurb: 'You set it up yourself with docs & templates.', tier: 1 },
  'Guided setup': { blurb: 'Light expert help on config & onboarding.', tier: 2 },
  'Expert-led implementation': { blurb: 'A vetted expert owns the rollout end to end.', tier: 3 },
  'White-glove project': { blurb: 'Full project team handles migration & change.', tier: 4 },
}

export interface Discussion {
  q: string
  tag: string
  answers: number
  top: string
}

export const DISCUSSIONS: Discussion[] = [
  { q: 'Can this be implemented in under 30 days?', tag: 'Implementation', answers: 7, top: 'monday.com and Asana both ship in under 6 weeks; Salesforce rarely does.' },
  { q: 'Which tool is best for a CRM migration?', tag: 'Fit', answers: 5, top: 'For CRM specifically, Salesforce is the deepest; HubSpot covers the SMB-mid range.' },
  { q: 'Is this suitable for a 25-person operations team?', tag: 'Fit', answers: 9, top: 'Yes — monday.com and Asana both fit 25-person ops teams well on a mid-tier budget.' },
  { q: 'What does an expert-led implementation actually cost?', tag: 'Pricing', answers: 4, top: 'Most PM rollouts land $4k–9k depending on seats, migration, and training scope.' },
]
