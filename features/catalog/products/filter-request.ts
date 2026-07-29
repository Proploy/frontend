import type { ProductFilterValues } from '@/components/filters/ProductFiltersDrawer'
import type { ProductListRequest } from './types'

export interface ProductListRequestInput extends ProductFilterValues {
  search?: string
  limit: number
  offset: number
}

export function buildProductListRequest({
  categoryTermId,
  search,
  pricingBucket,
  freePlan,
  freeTrial,
  sort,
  limit,
  offset,
}: ProductListRequestInput): ProductListRequest {
  return {
    category: categoryTermId || undefined,
    search,
    pricing_bucket: pricingBucket || undefined,
    free_plan: freePlan || undefined,
    free_trial: freeTrial || undefined,
    sort,
    limit,
    offset,
  }
}
