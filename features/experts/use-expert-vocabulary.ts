/**
 * The answers the expert application form offers, served by the API.
 *
 * The wizard renders these as its choices and the directory turns the same
 * list into filter options, so a buyer can only ever filter on something an
 * expert was actually asked. Keeping two hand-maintained copies is what let
 * them drift — a filter for an answer the form never offered, or an answer
 * with no filter.
 *
 * Each caller passes the list it already had as `fallback`. The wizard has
 * required fields, so an unreachable API must degrade to a usable form rather
 * than an empty dropdown; the served list wins whenever it arrives.
 *
 * Products are not here: they belong to the catalog, and both sides read them
 * from `/catalog/products`.
 */
import { useEffect, useState } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'

export type ExpertVocabularyGroupKey =
  | 'industries'
  | 'project_types'
  | 'regions_served'
  | 'countries'
  | 'timezones'
  | 'entity_types'

export interface ExpertVocabularyOption {
  value: string
  label: string
}

export interface ExpertVocabularyGroup {
  label: string
  options: ExpertVocabularyOption[]
}

export interface ExpertVocabularyResponse {
  groups: Partial<Record<ExpertVocabularyGroupKey, ExpertVocabularyGroup>>
}

const client = new ServiceApisBrowserClient()

export function useExpertVocabulary(): ExpertVocabularyResponse['groups'] {
  const [groups, setGroups] = useState<ExpertVocabularyResponse['groups']>({})

  useEffect(() => {
    let cancelled = false

    async function load() {
      const result = await client.get<ExpertVocabularyResponse>('/api/v1/experts/vocabulary', {
        requireAuth: false,
        // The lists change when the form changes, which is a deploy, not a
        // request — so this can sit cached for a long time.
        readCache: { ttlMs: 60 * 60_000, staleMs: 24 * 60 * 60_000, persist: true },
      })
      if (cancelled || !result.ok) return
      setGroups(result.data.groups ?? {})
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return groups
}

/** The served answers for one question, or the caller's own list until they arrive. */
export function vocabularyLabels(
  groups: ExpertVocabularyResponse['groups'],
  key: ExpertVocabularyGroupKey,
  fallback: readonly string[],
): string[] {
  const options = groups[key]?.options
  return options?.length ? options.map((option) => option.label) : [...fallback]
}
