import { DEFAULT_PRODUCT_FILTERS, type ProductFilterValues } from './filter-values'
import type { ProductSort } from './types'

/**
 * URL search params are the single source of truth for product filters, so a
 * filtered view is shareable, survives refresh and back navigation, and can be
 * server-rendered. Keys are short and human-readable; multi-value filters are
 * comma-joined. `search` and `mode` are owned by the search UI and left alone.
 */
export const PRODUCT_FILTER_PARAM_KEYS = {
  category: 'category',
  pricingBuckets: 'pricing',
  companySize: 'size',
  deploymentModel: 'deploy',
  compliance: 'compliance',
  integrations: 'integrations',
  industries: 'industry',
  implementationComplexity: 'complexity',
  minRating: 'min_rating',
  maxStartingPrice: 'max_price',
  freePlan: 'free_plan',
  freeTrial: 'free_trial',
  sort: 'sort',
} as const

const SORT_VALUES: ReadonlySet<ProductSort> = new Set(['name', 'rating', 'market_presence', 'created_at'])
const RATING_VALUES = new Set(['4.5', '4', '3.5'])
const PRICE_VALUES = new Set(['0', '10', '30', '100'])

type ParamsReader = { get(name: string): string | null }

function readList(params: ParamsReader, key: string): string[] {
  const raw = params.get(key)
  if (!raw) return []
  return Array.from(
    new Set(
      raw
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    ),
  )
}

function readFlag(params: ParamsReader, key: string): boolean {
  const raw = params.get(key)
  return raw === '1' || raw === 'true'
}

function readChoice(params: ParamsReader, key: string, allowed: ReadonlySet<string>): string {
  const raw = params.get(key)?.trim() ?? ''
  return allowed.has(raw) ? raw : ''
}

export function parseProductFilterParams(params: ParamsReader): ProductFilterValues {
  const keys = PRODUCT_FILTER_PARAM_KEYS
  const sortRaw = params.get(keys.sort) as ProductSort | null
  return {
    categoryTermIds: readList(params, keys.category),
    pricingBuckets: readList(params, keys.pricingBuckets),
    freePlan: readFlag(params, keys.freePlan),
    freeTrial: readFlag(params, keys.freeTrial),
    sort: sortRaw && SORT_VALUES.has(sortRaw) ? sortRaw : DEFAULT_PRODUCT_FILTERS.sort,
    companySize: readList(params, keys.companySize),
    deploymentModel: readList(params, keys.deploymentModel),
    compliance: readList(params, keys.compliance),
    integrations: readList(params, keys.integrations),
    industries: readList(params, keys.industries),
    implementationComplexity: readList(params, keys.implementationComplexity),
    minRating: readChoice(params, keys.minRating, RATING_VALUES),
    maxStartingPrice: readChoice(params, keys.maxStartingPrice, PRICE_VALUES),
  }
}

/**
 * Writes the filter values into `params` in place. Default values remove
 * their key so the URL only carries what differs from the defaults.
 */
export function applyProductFilterParams(params: URLSearchParams, values: ProductFilterValues): URLSearchParams {
  const keys = PRODUCT_FILTER_PARAM_KEYS
  const setOrDelete = (key: string, value: string) => {
    if (value) params.set(key, value)
    else params.delete(key)
  }
  setOrDelete(keys.category, values.categoryTermIds.join(','))
  setOrDelete(keys.pricingBuckets, values.pricingBuckets.join(','))
  setOrDelete(keys.companySize, values.companySize.join(','))
  setOrDelete(keys.deploymentModel, values.deploymentModel.join(','))
  setOrDelete(keys.compliance, values.compliance.join(','))
  setOrDelete(keys.integrations, values.integrations.join(','))
  setOrDelete(keys.industries, values.industries.join(','))
  setOrDelete(keys.implementationComplexity, values.implementationComplexity.join(','))
  setOrDelete(keys.minRating, values.minRating)
  setOrDelete(keys.maxStartingPrice, values.maxStartingPrice)
  setOrDelete(keys.freePlan, values.freePlan ? '1' : '')
  setOrDelete(keys.freeTrial, values.freeTrial ? '1' : '')
  setOrDelete(keys.sort, values.sort === DEFAULT_PRODUCT_FILTERS.sort ? '' : values.sort)
  return params
}

/** Stable string for the current filter state, useful as an effect/request key. */
export function serializeProductFilterParams(values: ProductFilterValues): string {
  return applyProductFilterParams(new URLSearchParams(), values).toString()
}

/** Converts Next.js `searchParams` (server components) into a reader. */
export function searchParamsFromRecord(
  record: Record<string, string | string[] | undefined>,
): URLSearchParams {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(record)) {
    if (value === undefined) continue
    const first = Array.isArray(value) ? value[0] : value
    if (first !== undefined) params.set(key, first)
  }
  return params
}
