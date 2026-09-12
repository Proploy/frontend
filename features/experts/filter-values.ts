/**
 * Filter state for the experts directory.
 *
 * Every group is evaluated server-side by `GET /api/v1/experts`, which also
 * returns the option counts (see `ExpertFacets`). The client no longer derives
 * options from the loaded page: several groups — regions served, remote only,
 * weekly availability, earliest start — are not present on `ExpertListItem` at
 * all, so they can only be filtered where the data lives.
 *
 * Group names match `FACET_GROUP_FIELDS` in
 * `service-apis/modules/experts/browse/models.py`.
 */
export type ExpertSort = 'relevance' | 'experience' | 'projects' | 'name' | 'recent'

export interface ExpertFilterValues {
  /** Catalog product ids (facet group `products`). */
  products: string[]
  /**
   * Depth on the picked product, not on the expert. The API matches these
   * against the same expertise row as `products`, so "Asana" with
   * `minimumProductYears: 5` means five years on Asana. With no product
   * picked they still read correctly, as "on some one product".
   */
  minimumProductYears: number
  minimumProductProjects: number
  primaryProductOnly: boolean
  productCertified: boolean
  /**
   * Industries the expert serves *on the picked product*, chosen when applying
   * from that product's own catalog list. Distinct from `industries`, which is
   * the expert-wide answer: an expert can work in healthcare generally and use
   * Zendesk only for retail clients.
   */
  productIndustries: string[]
  /**
   * How many credentials the expert declared, as a band from
   * `CERTIFICATION_BUCKETS` carried by its lower bound ('0', '1', '2', '5').
   * '' means no preference.
   */
  certificationCount: string
  industries: string[]
  projectTypes: string[]
  countries: string[]
  regionsServed: string[]
  timezones: string[]
  entityTypes: string[]
  /** Thresholds; 0 means any. */
  minimumYears: number
  minimumProjects: number
  minimumHoursPerWeek: number
  /** ISO date (YYYY-MM-DD); '' means any. */
  availableFrom: string
  /** Tri-state: true filters to remote-only experts, false is "no preference". */
  remoteOnly: boolean
  sort: ExpertSort
}

export const DEFAULT_EXPERT_FILTERS: ExpertFilterValues = {
  products: [],
  minimumProductYears: 0,
  minimumProductProjects: 0,
  primaryProductOnly: false,
  productCertified: false,
  productIndustries: [],
  certificationCount: '',
  industries: [],
  projectTypes: [],
  countries: [],
  regionsServed: [],
  timezones: [],
  entityTypes: [],
  minimumYears: 0,
  minimumProjects: 0,
  minimumHoursPerWeek: 0,
  availableFrom: '',
  remoteOnly: false,
  sort: 'relevance',
}

/** Multi-select groups, and the facet group each one is counted by. */
export const EXPERT_LIST_GROUPS = {
  products: 'products',
  productIndustries: 'product_industries',
  industries: 'industries',
  projectTypes: 'project_types',
  countries: 'countries',
  regionsServed: 'regions_served',
  timezones: 'timezones',
  entityTypes: 'entity_types',
} as const

export type ExpertListGroupKey = keyof typeof EXPERT_LIST_GROUPS

/** Threshold groups, and the facet group each one is counted by. */
export const EXPERT_THRESHOLD_GROUPS = {
  minimumYears: 'years',
  minimumProjects: 'projects',
  minimumHoursPerWeek: 'availability_hours',
  minimumProductYears: 'product_years',
  minimumProductProjects: 'product_projects',
} as const

export type ExpertThresholdKey = keyof typeof EXPERT_THRESHOLD_GROUPS

/** Flags that qualify the picked product, and the facet group counting each. */
export const EXPERT_PRODUCT_FLAG_GROUPS = {
  primaryProductOnly: 'product_primary_only',
  productCertified: 'product_certified',
} as const

export type ExpertProductFlagKey = keyof typeof EXPERT_PRODUCT_FLAG_GROUPS

export const EXPERT_SORT_OPTIONS: { value: ExpertSort; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'experience', label: 'Most experienced' },
  { value: 'projects', label: 'Most projects' },
  { value: 'recent', label: 'Recently joined' },
  { value: 'name', label: 'Name' },
]

export const ENTITY_TYPE_LABELS: Record<string, string> = {
  individual: 'Individual',
  business: 'Business or team',
}

export function countActiveExpertFilters(values: ExpertFilterValues): number {
  const lists = (Object.keys(EXPERT_LIST_GROUPS) as ExpertListGroupKey[]).reduce(
    (total, key) => total + values[key].length,
    0,
  )
  const thresholds = (Object.keys(EXPERT_THRESHOLD_GROUPS) as ExpertThresholdKey[]).reduce(
    (total, key) => total + Number(values[key] > 0),
    0,
  )
  const flags = (Object.keys(EXPERT_PRODUCT_FLAG_GROUPS) as ExpertProductFlagKey[]).reduce(
    (total, key) => total + Number(values[key]),
    0,
  )
  return (
    lists +
    thresholds +
    flags +
    Number(Boolean(values.certificationCount)) +
    Number(Boolean(values.availableFrom)) +
    Number(values.remoteOnly)
  )
}

/**
 * Change the product selection, dropping depth when nothing is left to qualify.
 *
 * Depth is only reachable in the UI while a product is selected, so clearing
 * the last product has to clear it too — otherwise it keeps narrowing the
 * results from a control nobody can see, and the only clue is a chip.
 */
export function withProducts(
  values: ExpertFilterValues,
  products: string[],
): ExpertFilterValues {
  // Industries are offered per product, so a value picked under the old
  // selection may not be offered under the new one. Left in place it would
  // keep narrowing the results with no option on screen to switch it off.
  if (products.length > 0) return { ...values, products, productIndustries: [] }
  return {
    ...values,
    products,
    minimumProductYears: 0,
    minimumProductProjects: 0,
    primaryProductOnly: false,
    productCertified: false,
    productIndustries: [],
  }
}

export function hasActiveExpertFilters(values: ExpertFilterValues): boolean {
  return countActiveExpertFilters(values) > 0
}
