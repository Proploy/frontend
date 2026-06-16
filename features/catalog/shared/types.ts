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
}
