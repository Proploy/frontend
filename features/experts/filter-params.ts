import {
  DEFAULT_EXPERT_FILTERS,
  EXPERT_LIST_GROUPS,
  EXPERT_SORT_OPTIONS,
  EXPERT_THRESHOLD_GROUPS,
  type ExpertFilterValues,
  type ExpertListGroupKey,
  type ExpertSort,
  type ExpertThresholdKey,
} from './filter-values'

/**
 * Experts directory filters live in the URL. The legacy single-value keys
 * (`industry`, `projectType`, `location`) used by inbound links keep working
 * and now accept comma-joined lists; `search` is left alone.
 */
export const EXPERT_FILTER_PARAM_KEYS = {
  products: 'product',
  industries: 'industry',
  projectTypes: 'projectType',
  countries: 'location',
  regionsServed: 'region',
  timezones: 'timezone',
  entityTypes: 'type',
  minimumYears: 'min_years',
  minimumProjects: 'min_projects',
  minimumHoursPerWeek: 'min_hours',
  minimumProductYears: 'product_min_years',
  minimumProductProjects: 'product_min_projects',
  primaryProductOnly: 'product_primary',
  productCertified: 'product_certified',
  productIndustries: 'product_industry',
  certificationCount: 'certifications',
  availableFrom: 'available_from',
  remoteOnly: 'remote',
  sort: 'sort',
} as const

/** Lower bound of each band the API accepts; mirrors CERTIFICATION_BUCKETS. */
const CERTIFICATION_COUNTS = new Set(['0', '1', '2', '5'])

const SORT_VALUES = new Set<string>(EXPERT_SORT_OPTIONS.map((option) => option.value))
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

type ParamsReader = { get(name: string): string | null }

function readList(params: ParamsReader, key: string): string[] {
  const raw = params.get(key)
  if (!raw) return []
  return Array.from(new Set(raw.split(',').map((value) => value.trim()).filter(Boolean)))
}

function readThreshold(params: ParamsReader, key: string, max: number): number {
  const value = Number(params.get(key) ?? '')
  if (!Number.isFinite(value) || value <= 0) return 0
  return Math.min(Math.floor(value), max)
}

export function parseExpertFilterParams(params: ParamsReader): ExpertFilterValues {
  const keys = EXPERT_FILTER_PARAM_KEYS
  const sortRaw = params.get(keys.sort) ?? ''
  const availableFrom = params.get(keys.availableFrom)?.trim() ?? ''

  const lists = {} as Record<ExpertListGroupKey, string[]>
  for (const key of Object.keys(EXPERT_LIST_GROUPS) as ExpertListGroupKey[]) {
    lists[key] = readList(params, keys[key])
  }

  const certificationCount = params.get(keys.certificationCount)?.trim() ?? ''

  return {
    ...lists,
    minimumYears: readThreshold(params, keys.minimumYears, 50),
    minimumProjects: readThreshold(params, keys.minimumProjects, 100000),
    minimumHoursPerWeek: readThreshold(params, keys.minimumHoursPerWeek, 168),
    minimumProductYears: readThreshold(params, keys.minimumProductYears, 60),
    minimumProductProjects: readThreshold(params, keys.minimumProductProjects, 10000),
    primaryProductOnly: params.get(keys.primaryProductOnly) === '1',
    productCertified: params.get(keys.productCertified) === '1',
    certificationCount: CERTIFICATION_COUNTS.has(certificationCount) ? certificationCount : '',
    availableFrom: ISO_DATE.test(availableFrom) ? availableFrom : '',
    remoteOnly: params.get(keys.remoteOnly) === '1',
    sort: SORT_VALUES.has(sortRaw) ? (sortRaw as ExpertSort) : DEFAULT_EXPERT_FILTERS.sort,
  }
}

export function applyExpertFilterParams(
  params: URLSearchParams,
  values: ExpertFilterValues,
): URLSearchParams {
  const keys = EXPERT_FILTER_PARAM_KEYS
  const setOrDelete = (key: string, value: string) => {
    if (value) params.set(key, value)
    else params.delete(key)
  }

  for (const key of Object.keys(EXPERT_LIST_GROUPS) as ExpertListGroupKey[]) {
    setOrDelete(keys[key], values[key].join(','))
  }
  for (const key of Object.keys(EXPERT_THRESHOLD_GROUPS) as ExpertThresholdKey[]) {
    setOrDelete(keys[key], values[key] > 0 ? String(values[key]) : '')
  }
  setOrDelete(keys.primaryProductOnly, values.primaryProductOnly ? '1' : '')
  setOrDelete(keys.productCertified, values.productCertified ? '1' : '')
  setOrDelete(keys.certificationCount, values.certificationCount)
  setOrDelete(keys.availableFrom, values.availableFrom)
  setOrDelete(keys.remoteOnly, values.remoteOnly ? '1' : '')
  setOrDelete(keys.sort, values.sort === DEFAULT_EXPERT_FILTERS.sort ? '' : values.sort)
  return params
}

export function serializeExpertFilterParams(values: ExpertFilterValues): string {
  return applyExpertFilterParams(new URLSearchParams(), values).toString()
}

/**
 * Query string for `GET /api/v1/experts`. Multi-value groups repeat the
 * parameter (the API reads them with `Query(...)` lists), which is why this is
 * not the same shape as the browser URL above.
 */
export function buildExpertListQuery(
  values: ExpertFilterValues,
  extra: { search?: string; page?: number; limit?: number; includeFacets?: boolean } = {},
): URLSearchParams {
  const params = new URLSearchParams()
  const appendAll = (key: string, list: string[]) => {
    for (const value of list) params.append(key, value)
  }

  appendAll('product_id', values.products)
  appendAll('product_industry', values.productIndustries)
  appendAll('industry', values.industries)
  appendAll('project_type', values.projectTypes)
  appendAll('country', values.countries)
  appendAll('region_served', values.regionsServed)
  appendAll('timezone', values.timezones)
  // The API takes a single entity_type, not a list.
  if (values.entityTypes.length === 1) params.set('entity_type', values.entityTypes[0])

  if (values.minimumYears > 0) params.set('min_years', String(values.minimumYears))
  if (values.minimumProjects > 0) params.set('min_projects', String(values.minimumProjects))
  if (values.minimumHoursPerWeek > 0) {
    params.set('min_hours_per_week', String(values.minimumHoursPerWeek))
  }
  // Depth qualifies `product_id` server-side; it is matched against the same
  // expertise row rather than against the expert's own totals.
  if (values.minimumProductYears > 0) {
    params.set('min_product_years', String(values.minimumProductYears))
  }
  if (values.minimumProductProjects > 0) {
    params.set('min_product_projects', String(values.minimumProductProjects))
  }
  if (values.primaryProductOnly) params.set('product_primary_only', 'true')
  if (values.productCertified) params.set('product_certified', 'true')
  if (values.certificationCount) params.set('certification_count', values.certificationCount)
  if (values.availableFrom) params.set('available_from', values.availableFrom)
  if (values.remoteOnly) params.set('remote_only', 'true')
  if (values.sort) params.set('sort', values.sort)

  if (extra.search) params.set('search', extra.search)
  if (extra.page && extra.page > 1) params.set('page', String(extra.page))
  if (extra.limit) params.set('limit', String(extra.limit))
  if (extra.includeFacets) params.set('include_facets', 'true')
  return params
}
