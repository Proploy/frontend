import type { GetCacheOptions } from '@/lib/service-apis/browser-client'
import type { NormalizedError } from '@/lib/service-apis/error-utils'

export type { NormalizedError } from '@/lib/service-apis/error-utils'

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface ApiSuccess<T> {
  ok: true
  data: T
}

export type ApiResult<T> = NormalizedError | ApiSuccess<T>

export interface CatalogRequestOptions {
  requireAuth?: boolean
  accessToken?: string | null
  /** Override the client read cache (catalog reads are cached by default). */
  readCache?: GetCacheOptions | false
  /** Aborts the in-flight request, e.g. when a newer typeahead query supersedes it. */
  signal?: AbortSignal
}
