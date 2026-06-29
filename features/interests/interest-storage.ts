'use client'

import { DEFAULT_INTEREST_STORAGE_STATE, type InterestPayload, type InterestStorageState } from './types'

const STORAGE_KEY = 'proploy.interests.v1'

function clonePayload(payload: InterestPayload): InterestPayload {
  return {
    industries: [...payload.industries],
    platforms: [...payload.platforms],
    project_types: [...payload.project_types],
    company_sizes: [...payload.company_sizes],
  }
}

export function readInterestStorage(): InterestStorageState {
  if (typeof window === 'undefined') return DEFAULT_INTEREST_STORAGE_STATE

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_INTEREST_STORAGE_STATE
    const parsed = JSON.parse(raw) as Partial<InterestStorageState>
    return {
      products: clonePayload(parsed.products ?? DEFAULT_INTEREST_STORAGE_STATE.products),
      experts: clonePayload(parsed.experts ?? DEFAULT_INTEREST_STORAGE_STATE.experts),
      dismissed_until: typeof parsed.dismissed_until === 'number' ? parsed.dismissed_until : null,
    }
  } catch {
    return DEFAULT_INTEREST_STORAGE_STATE
  }
}

export function writeInterestStorage(state: InterestStorageState) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* ignore quota/private-mode failures */
  }
}

export function clearInterestStorage() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function mergeInterestPayloads(...payloads: Array<Partial<InterestPayload> | null | undefined>): InterestPayload {
  const mergeList = (key: keyof InterestPayload) => {
    const values = payloads.flatMap((payload) => payload?.[key] ?? [])
    return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean))).slice(0, 12)
  }

  return {
    industries: mergeList('industries'),
    platforms: mergeList('platforms'),
    project_types: mergeList('project_types'),
    company_sizes: mergeList('company_sizes'),
  }
}

export function hasInterestData(payload: InterestPayload) {
  return (
    payload.industries.length > 0
    || payload.platforms.length > 0
    || payload.project_types.length > 0
    || payload.company_sizes.length > 0
  )
}

