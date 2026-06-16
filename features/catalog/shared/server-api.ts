import { normalizeServiceApiError } from '@/lib/service-apis/error-utils'
import { serviceApisFetch } from '@/lib/service-apis/server'

import type { CategoryTreeResponse } from '../categories/types'
import type {
  ProductCardResponse,
  ProductDetail,
  ProductListRequest,
  ProductMediaAssetItem,
} from '../products/types'
import type {
  CatalogSearchRequest,
  CatalogSearchResponse,
  KeywordSearchResponse,
} from '../search/types'
import type { ApiResult, CatalogRequestOptions } from './types'
import { buildQueryString } from './query'

async function request<T>(
  path: string,
  options: RequestInit & CatalogRequestOptions = {},
): Promise<ApiResult<T>> {
  if (!process.env.SERVICE_APIS_BASE_URL) {
    return {
      ok: false,
      status: 503,
      error: {
        code: 'NOT_CONFIGURED',
        message: 'SERVICE_APIS_BASE_URL is not configured',
      },
    }
  }

  const response = await serviceApisFetch(path, options)

  if (!response.ok) {
    return normalizeServiceApiError(response)
  }

  try {
    return { ok: true, data: await response.json() as T }
  } catch {
    return {
      ok: false,
      status: 502,
      error: {
        code: 'INVALID_RESPONSE',
        message: 'Service APIs returned an invalid response',
      },
    }
  }
}

export const serverCatalogApi = {
  categories: {
    getTree(options?: CatalogRequestOptions): Promise<ApiResult<CategoryTreeResponse>> {
      return request<CategoryTreeResponse>('/api/v1/catalog/categories/tree', options)
    },
  },
  products: {
    list(
      params: ProductListRequest,
      options?: CatalogRequestOptions,
    ): Promise<ApiResult<ProductCardResponse>> {
      const query = buildQueryString(params)
      return request<ProductCardResponse>(`/api/v1/catalog/products/ui?${query}`, options)
    },
    getDetail(
      productId: string,
      options?: CatalogRequestOptions,
    ): Promise<ApiResult<ProductDetail>> {
      return request<ProductDetail>(
        `/api/v1/catalog/products/${encodeURIComponent(productId)}/ui`,
        options,
      )
    },
    getMedia(
      productId: string,
      kind?: string,
      options?: CatalogRequestOptions,
    ): Promise<ApiResult<ProductMediaAssetItem[]>> {
      const query = buildQueryString({ kind: kind === 'all' ? undefined : kind })
      const suffix = query ? `?${query}` : ''
      return request<ProductMediaAssetItem[]>(
        `/api/v1/catalog/products/${encodeURIComponent(productId)}/media${suffix}`,
        options,
      )
    },
  },
  search: {
    keyword(
      query: string,
      limit = 20,
      options?: CatalogRequestOptions,
    ): Promise<ApiResult<KeywordSearchResponse>> {
      return request<KeywordSearchResponse>('/api/v1/catalog/search/keyword', {
        ...options,
        method: 'POST',
        body: JSON.stringify({ query, limit }),
      })
    },
    hybrid(
      params: CatalogSearchRequest,
      options?: CatalogRequestOptions,
    ): Promise<ApiResult<CatalogSearchResponse>> {
      return request<CatalogSearchResponse>('/api/v1/catalog/search/hybrid', {
        ...options,
        method: 'POST',
        body: JSON.stringify(params),
      })
    },
  },
}
