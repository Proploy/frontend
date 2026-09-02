import { DEFAULT_EXPERT_FILTERS, EXPERT_SORT_OPTIONS, type ExpertFilterValues, type ExpertSort } from './filter-values'

/**
 * Experts directory filters live in the URL. The legacy single-value keys
 * (`platform`, `industry`, `projectType`, `location`) used by inbound links
 * keep working and now accept comma-joined lists; `search` is left alone.
 */
export const EXPERT_FILTER_PARAM_KEYS = {
  platforms: 'platform',
  industries: 'industry',
  projectTypes: 'projectType',
  countries: 'location',
  entityTypes: 'type',
  minimumYears: 'min_years',
  sort: 'sort',
} as const

const SORT_VALUES = new Set<string>(EXPERT_SORT_OPTIONS.map((option) => option.value))

type ParamsReader = { get(name: string): string | null }

function readList(params: ParamsReader, key: string): string[] {
  const raw = params.get(key)
  if (!raw) return []
  return Array.from(new Set(raw.split(',').map((value) => value.trim()).filter(Boolean)))
}

export function parseExpertFilterParams(params: ParamsReader): ExpertFilterValues {
  const keys = EXPERT_FILTER_PARAM_KEYS
  const years = Number(params.get(keys.minimumYears) ?? '')
  const sortRaw = params.get(keys.sort) ?? ''
  return {
    platforms: readList(params, keys.platforms),
    industries: readList(params, keys.industries),
    projectTypes: readList(params, keys.projectTypes),
    countries: readList(params, keys.countries),
    entityTypes: readList(params, keys.entityTypes),
    minimumYears: Number.isFinite(years) && years > 0 ? Math.min(Math.floor(years), 50) : 0,
    sort: SORT_VALUES.has(sortRaw) ? (sortRaw as ExpertSort) : DEFAULT_EXPERT_FILTERS.sort,
  }
}

export function applyExpertFilterParams(params: URLSearchParams, values: ExpertFilterValues): URLSearchParams {
  const keys = EXPERT_FILTER_PARAM_KEYS
  const setOrDelete = (key: string, value: string) => {
    if (value) params.set(key, value)
    else params.delete(key)
  }
  setOrDelete(keys.platforms, values.platforms.join(','))
  setOrDelete(keys.industries, values.industries.join(','))
  setOrDelete(keys.projectTypes, values.projectTypes.join(','))
  setOrDelete(keys.countries, values.countries.join(','))
  setOrDelete(keys.entityTypes, values.entityTypes.join(','))
  setOrDelete(keys.minimumYears, values.minimumYears > 0 ? String(values.minimumYears) : '')
  setOrDelete(keys.sort, values.sort === DEFAULT_EXPERT_FILTERS.sort ? '' : values.sort)
  return params
}

export function serializeExpertFilterParams(values: ExpertFilterValues): string {
  return applyExpertFilterParams(new URLSearchParams(), values).toString()
}
