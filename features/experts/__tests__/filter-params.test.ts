import { describe, expect, it } from 'vitest'

import { applyExpertFilterParams, parseExpertFilterParams, serializeExpertFilterParams } from '../filter-params'
import {
  DEFAULT_EXPERT_FILTERS,
  countActiveExpertFilters,
  deriveExpertFilterOptions,
  matchesExpertFilters,
  sortExperts,
  type ExpertFilterValues,
} from '../filter-values'
import type { ExpertListItem } from '../types'

const full: ExpertFilterValues = {
  platforms: ['Asana', 'HubSpot CRM'],
  industries: ['Fintech'],
  projectTypes: ['CRM migration'],
  countries: ['India'],
  entityTypes: ['business'],
  minimumYears: 5,
  sort: 'experience',
}

function expert(overrides: Partial<ExpertListItem>): ExpertListItem {
  return {
    id: 'x',
    displayName: 'Expert',
    headline: null,
    regionCity: null,
    regionCountry: null,
    yearsExperience: null,
    tags: [],
    profilePictureUrl: null,
    ...overrides,
  }
}

describe('expert filter URL params', () => {
  it('round-trips every filter and leaves search alone', () => {
    const params = applyExpertFilterParams(new URLSearchParams('search=asana'), full)
    expect(parseExpertFilterParams(params)).toEqual(full)
    expect(params.get('search')).toBe('asana')
    expect(serializeExpertFilterParams(full)).toBe(
      'platform=Asana%2CHubSpot+CRM&industry=Fintech&projectType=CRM+migration&location=India&type=business&min_years=5&sort=experience',
    )
  })

  it('accepts legacy single-value links', () => {
    expect(parseExpertFilterParams(new URLSearchParams('platform=Asana&industry=Fintech'))).toEqual({
      ...DEFAULT_EXPERT_FILTERS,
      platforms: ['Asana'],
      industries: ['Fintech'],
    })
  })

  it('drops defaults and ignores bad values', () => {
    expect(serializeExpertFilterParams(DEFAULT_EXPERT_FILTERS)).toBe('')
    const parsed = parseExpertFilterParams(new URLSearchParams('min_years=abc&sort=bogus'))
    expect(parsed.minimumYears).toBe(0)
    expect(parsed.sort).toBe('relevance')
    expect(countActiveExpertFilters(full)).toBe(7)
  })
})

describe('expert filter matching', () => {
  const a = expert({
    id: 'a',
    displayName: 'Bea',
    primaryPlatforms: ['Asana'],
    industryExpertise: ['Fintech'],
    preferredProjectTypes: ['CRM migration'],
    regionCountry: 'India',
    entityType: 'Business',
    yearsExperience: 8,
    projectsCompletedTotal: 3,
  })
  const b = expert({
    id: 'b',
    displayName: 'Al',
    secondaryPlatforms: ['hubspot crm'],
    regionCountry: 'Germany',
    entityType: 'individual',
    yearsExperience: 2,
    projectsCompletedTotal: 9,
  })

  it('ORs within a group and ANDs across groups, case-insensitively', () => {
    expect(matchesExpertFilters(a, full)).toBe(true)
    expect(matchesExpertFilters(b, full)).toBe(false)
    expect(matchesExpertFilters(b, { ...DEFAULT_EXPERT_FILTERS, platforms: ['HubSpot CRM'] })).toBe(true)
    expect(matchesExpertFilters(b, { ...DEFAULT_EXPERT_FILTERS, minimumYears: 3 })).toBe(false)
  })

  it('derives options from the directory and sorts by the chosen key', () => {
    const options = deriveExpertFilterOptions([a, b])
    expect(options.platforms).toEqual(['Asana', 'hubspot crm'])
    expect(options.countries).toEqual(['Germany', 'India'])
    expect(options.entityTypes).toEqual(['business', 'individual'])
    expect(sortExperts([a, b], 'projects').map((e) => e.id)).toEqual(['b', 'a'])
    expect(sortExperts([a, b], 'name').map((e) => e.id)).toEqual(['b', 'a'])
    expect(sortExperts([a, b], 'experience').map((e) => e.id)).toEqual(['a', 'b'])
  })
})
