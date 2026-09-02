import type { ProductFilterValues } from './filter-values'
import type { ProductFilterRequest, ProductListRequest } from './types'

export interface ProductListRequestInput extends ProductFilterValues {
  search?: string
  limit: number
  offset: number
}

function list(values: string[] | undefined): string[] | undefined {
  return values?.length ? values : undefined
}

function number(value: string | undefined): number | undefined {
  if (value === undefined || value === '') return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

/** Maps UI filter state to the shared hard-filter contract (list and natural search). */
export function buildProductFilterRequest(values: ProductFilterValues): ProductFilterRequest {
  return {
    category: list(values.categoryTermIds),
    pricing_bucket: list(values.pricingBuckets),
    free_plan: values.freePlan || undefined,
    free_trial: values.freeTrial || undefined,
    company_size: list(values.companySize),
    deployment_model: list(values.deploymentModel),
    compliance: list(values.compliance),
    integration: list(values.integrations),
    industry: list(values.industries),
    implementation_complexity: list(values.implementationComplexity),
    min_rating: number(values.minRating),
    max_starting_price_usd: number(values.maxStartingPrice),
  }
}

export function buildProductListRequest({
  search,
  sort,
  limit,
  offset,
  ...values
}: ProductListRequestInput): ProductListRequest {
  return {
    ...buildProductFilterRequest({ ...values, sort }),
    search,
    sort,
    limit,
    offset,
  }
}
