'use client'

export type InterestRouteKind = 'products' | 'experts'

export type InterestPayload = {
  industries: string[]
  platforms: string[]
  project_types: string[]
  company_sizes: string[]
}

export type InterestStorageState = {
  products: InterestPayload
  experts: InterestPayload
  dismissed_until: number | null
}

export const EMPTY_INTEREST_PAYLOAD: InterestPayload = {
  industries: [],
  platforms: [],
  project_types: [],
  company_sizes: [],
}

export const DEFAULT_INTEREST_STORAGE_STATE: InterestStorageState = {
  products: { ...EMPTY_INTEREST_PAYLOAD },
  experts: { ...EMPTY_INTEREST_PAYLOAD },
  dismissed_until: null,
}

export const PRODUCT_INTEREST_OPTIONS = {
  industries: ['Operations', 'Marketing', 'Sales', 'Finance', 'HR', 'Product', 'IT', 'Design'],
  platforms: ['Web', 'Mobile', 'API', 'Integrations', 'Automation', 'Analytics'],
  company_sizes: ['1-10', '11-50', '51-200', '201-1000', '1000+'],
} as const

export const EXPERT_INTEREST_OPTIONS = {
  industries: ['B2B SaaS', 'E-commerce', 'Fintech', 'Healthcare', 'Education', 'Marketplace', 'Services'],
  platforms: ['Asana', 'Jira', 'HubSpot', 'Salesforce', 'Monday.com', 'Notion', 'Airtable'],
  project_types: ['Implementation', 'Migration', 'Automation', 'Revamp', 'Training', 'Integration'],
} as const

