import type { ProductSort } from './types'

/**
 * Filter state for the Explore Products page. This is the UI-side shape; the
 * URL is the source of truth (see filter-params.ts) and filter-request.ts maps
 * it to the service-apis contract.
 */
export interface ProductFilterValues {
  /** Selected category term ids (ui_category roots or product categories); OR-ed. */
  categoryTermIds: string[]
  pricingBuckets: string[]
  freePlan: boolean
  freeTrial: boolean
  sort: ProductSort
  companySize: string[]
  deploymentModel: string[]
  compliance: string[]
  integrations: string[]
  industries: string[]
  implementationComplexity: string[]
  /** Minimum average rating as a string option value ('' = any). */
  minRating: string
  /** Starting price ceiling in USD/month as a string option value ('' = any). */
  maxStartingPrice: string
}

export const DEFAULT_PRODUCT_FILTERS: ProductFilterValues = {
  categoryTermIds: [],
  pricingBuckets: [],
  freePlan: false,
  freeTrial: false,
  sort: 'name',
  companySize: [],
  deploymentModel: [],
  compliance: [],
  integrations: [],
  industries: [],
  implementationComplexity: [],
  minRating: '',
  maxStartingPrice: '',
}

/** Filters that narrow results (sort excluded). */
export function countActiveProductFilters(values: ProductFilterValues): number {
  return (
    values.categoryTermIds.length +
    values.pricingBuckets.length +
    values.companySize.length +
    values.deploymentModel.length +
    values.compliance.length +
    values.integrations.length +
    values.industries.length +
    values.implementationComplexity.length +
    Number(Boolean(values.minRating)) +
    Number(values.maxStartingPrice !== '') +
    Number(values.freePlan) +
    Number(values.freeTrial)
  )
}

export function hasActiveProductFilters(values: ProductFilterValues): boolean {
  return countActiveProductFilters(values) > 0
}
