import type { ExpertListItem } from './types'

/**
 * Filter state for the experts directory. All list filters are multi-select
 * (OR within a group, AND across groups) and evaluated client-side against
 * the loaded directory, so the pill options can be derived from real data.
 */
export type ExpertSort = 'relevance' | 'experience' | 'projects' | 'name'

export interface ExpertFilterValues {
  platforms: string[]
  industries: string[]
  projectTypes: string[]
  countries: string[]
  entityTypes: string[]
  /** Minimum years of experience; 0 means any. */
  minimumYears: number
  sort: ExpertSort
}

export const DEFAULT_EXPERT_FILTERS: ExpertFilterValues = {
  platforms: [],
  industries: [],
  projectTypes: [],
  countries: [],
  entityTypes: [],
  minimumYears: 0,
  sort: 'relevance',
}

export const EXPERT_YEARS_OPTIONS = [3, 5, 10] as const

export const EXPERT_SORT_OPTIONS: { value: ExpertSort; label: string }[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'experience', label: 'Most experienced' },
  { value: 'projects', label: 'Most projects' },
  { value: 'name', label: 'Name' },
]

export const ENTITY_TYPE_LABELS: Record<string, string> = {
  individual: 'Individual',
  business: 'Business or team',
}

export function countActiveExpertFilters(values: ExpertFilterValues): number {
  return (
    values.platforms.length +
    values.industries.length +
    values.projectTypes.length +
    values.countries.length +
    values.entityTypes.length +
    Number(values.minimumYears > 0)
  )
}

export function hasActiveExpertFilters(values: ExpertFilterValues): boolean {
  return countActiveExpertFilters(values) > 0
}

const norm = (value: string) => value.trim().toLowerCase()

function tagValues(expert: ExpertListItem, tagType: string): string[] {
  return (expert.tags ?? [])
    .filter((tag) => tag.tagType === tagType)
    .map((tag) => tag.tagValue)
    .filter((value): value is string => Boolean(value))
}

export function expertPlatformLabels(expert: ExpertListItem): string[] {
  return unique([
    ...(expert.primaryPlatforms ?? []),
    ...(expert.secondaryPlatforms ?? []),
    ...tagValues(expert, 'platform'),
  ])
}

export function expertIndustryLabels(expert: ExpertListItem): string[] {
  return unique([...(expert.industryExpertise ?? []), ...tagValues(expert, 'industry')])
}

export function expertProjectTypeLabels(expert: ExpertListItem): string[] {
  return unique([...(expert.preferredProjectTypes ?? []), ...tagValues(expert, 'project_type')])
}

export function expertEntityType(expert: ExpertListItem): string {
  const raw = norm(expert.entityType ?? '')
  if (!raw) return ''
  return raw.includes('business') || raw.includes('team') || raw.includes('agency') ? 'business' : 'individual'
}

function unique(values: string[]): string[] {
  const seen = new Map<string, string>()
  for (const value of values) {
    const key = norm(value)
    if (key && !seen.has(key)) seen.set(key, value.trim())
  }
  return Array.from(seen.values())
}

function matchesAny(selected: string[], candidates: string[]): boolean {
  if (selected.length === 0) return true
  const keys = new Set(candidates.map(norm))
  return selected.some((value) => keys.has(norm(value)))
}

/** True when the expert satisfies every active group (OR within a group). */
export function matchesExpertFilters(expert: ExpertListItem, values: ExpertFilterValues): boolean {
  if (!matchesAny(values.platforms, expertPlatformLabels(expert))) return false
  if (!matchesAny(values.industries, expertIndustryLabels(expert))) return false
  if (!matchesAny(values.projectTypes, expertProjectTypeLabels(expert))) return false
  if (!matchesAny(values.countries, expert.regionCountry ? [expert.regionCountry] : [])) return false
  if (!matchesAny(values.entityTypes, [expertEntityType(expert)])) return false
  if ((expert.yearsExperience ?? 0) < values.minimumYears) return false
  return true
}

export function sortExperts(experts: ExpertListItem[], sort: ExpertSort): ExpertListItem[] {
  if (sort === 'experience') {
    return [...experts].sort((a, b) => (b.yearsExperience ?? 0) - (a.yearsExperience ?? 0))
  }
  if (sort === 'projects') {
    return [...experts].sort((a, b) => (b.projectsCompletedTotal ?? 0) - (a.projectsCompletedTotal ?? 0))
  }
  if (sort === 'name') {
    return [...experts].sort((a, b) => a.displayName.localeCompare(b.displayName))
  }
  return experts
}

export interface ExpertFilterOptions {
  platforms: string[]
  industries: string[]
  projectTypes: string[]
  countries: string[]
  entityTypes: string[]
}

/** Distinct option labels present in the directory, most common first. */
export function deriveExpertFilterOptions(experts: ExpertListItem[]): ExpertFilterOptions {
  const tally = (lists: string[][]): string[] => {
    const counts = new Map<string, { label: string; count: number }>()
    for (const list of lists) {
      for (const value of list) {
        const key = norm(value)
        if (!key) continue
        const entry = counts.get(key) ?? { label: value.trim(), count: 0 }
        entry.count += 1
        counts.set(key, entry)
      }
    }
    return Array.from(counts.values())
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .map((entry) => entry.label)
  }
  return {
    platforms: tally(experts.map(expertPlatformLabels)),
    industries: tally(experts.map(expertIndustryLabels)),
    projectTypes: tally(experts.map(expertProjectTypeLabels)),
    countries: tally(experts.map((expert) => (expert.regionCountry ? [expert.regionCountry] : []))),
    entityTypes: tally(experts.map((expert) => [expertEntityType(expert)].filter(Boolean))),
  }
}
