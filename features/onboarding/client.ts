'use client'

import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'

const client = new ServiceApisBrowserClient()
const INTERESTS_PATH = '/api/v1/users/me/interests'

export type InterestsRecord = {
  user_id?: string
  industries: string[]
  platforms: string[]
  project_types: string[]
  company_sizes: string[]
}

export type InterestsPayload = {
  industries: string[]
  platforms: string[]
  project_types: string[]
  company_sizes: string[]
}

export type GetInterestsResult = { ok: true; data: InterestsRecord | null } | NormalizedError
export type SaveInterestsResult = { ok: true; data: InterestsRecord } | NormalizedError

/** GET the signed-in user's interests. 404 → no row yet, not a failure. */
export async function getInterests(): Promise<GetInterestsResult> {
  const result = await client.get<InterestsRecord>(INTERESTS_PATH, { requireAuth: true })
  if (!result.ok) {
    if (result.status === 404) return { ok: true, data: null }
    return result
  }
  return { ok: true, data: result.data }
}

export async function saveInterests(payload: InterestsPayload): Promise<SaveInterestsResult> {
  return client.patch<InterestsRecord>(INTERESTS_PATH, payload, { requireAuth: true })
}
