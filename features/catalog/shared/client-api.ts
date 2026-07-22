'use client'

import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'

import type { CategoryTreeResponse } from '../categories/types'
import type {
  ProductCardResponse,
  ProductDetail,
  ProductListRequest,
  ProductMediaAssetItem,
  ProductAlternativesResponse,
} from '../products/types'
import type {
  CatalogSearchRequest,
  CatalogSearchResponse,
  KeywordSearchResponse,
} from '../search/types'
import type { ApiResult, CatalogRequestOptions } from './types'
import { buildQueryString } from './query'

const client = new ServiceApisBrowserClient()

export const clientCatalogApi = {
  categories: {
    getTree(options?: CatalogRequestOptions): Promise<ApiResult<CategoryTreeResponse>> {
      return client.get<CategoryTreeResponse>('/api/v1/catalog/categories/tree', options)
    },
  },
  products: {
    list(
      params: ProductListRequest,
      options?: CatalogRequestOptions,
    ): Promise<ApiResult<ProductCardResponse>> {
      const query = buildQueryString(params)
      return client.get<ProductCardResponse>(`/api/v1/catalog/products/ui?${query}`, options)
    },
    getDetail(
      productId: string,
      options?: CatalogRequestOptions,
    ): Promise<ApiResult<ProductDetail>> {
      return client.get<ProductDetail>(
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
      return client.get<ProductMediaAssetItem[]>(
        `/api/v1/catalog/products/${encodeURIComponent(productId)}/media${suffix}`,
        options,
      )
    },
    getAlternatives(
      productId: string,
      limit = 6,
      options?: CatalogRequestOptions,
    ): Promise<ApiResult<ProductAlternativesResponse>> {
      const query = buildQueryString({ limit })
      return client.get<ProductAlternativesResponse>(
        `/api/v1/catalog/products/${encodeURIComponent(productId)}/alternatives?${query}`,
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
      return client.post<KeywordSearchResponse>(
        '/api/v1/catalog/search/keyword',
        { query, limit },
        options,
      )
    },
    hybrid(
      params: CatalogSearchRequest,
      options?: CatalogRequestOptions,
    ): Promise<ApiResult<CatalogSearchResponse>> {
      return client.post<CatalogSearchResponse>('/api/v1/catalog/search/hybrid', params, options)
    },
  },
}
