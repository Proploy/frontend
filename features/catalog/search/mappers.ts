// Search Mappers — convert backend contracts to UI view models.

import type {
  KeywordSearchResult,
  KeywordSearchResponse,
  CatalogSearchResult,
  CatalogSearchResponse,
} from './types'

import type { CardProduct, ProductListResult } from '../products/types'
import { getProductLogoUrl } from '../products/logo-url'
import { isUnpublishedValue, normalizePublishedValue } from '../products/published-values'

// ── Keyword Search (Typeahead) ────────────────────────────────────────────────

export function mapKeywordSearchResultToCardProduct(result: KeywordSearchResult): CardProduct {
  return {
    product_id: result.product_id,
    product_name: normalizePublishedValue(result.product_name) ?? '',
    product_description: null, // Keyword search doesn't return description
    product_logo: getProductLogoUrl(result.product_id, result.approved_logo_url),
    rating: null, // Keyword search doesn't return rating
    reviews: null,
    primary_category: normalizePublishedValue(result.primary_category),
    vendor_name: normalizePublishedValue(result.vendor_name),
    free_plan_available: false, // Not in keyword search response
    free_trial_available: false,
  }
}

export function mapKeywordSearchResponseToResults(
  response: KeywordSearchResponse,
  limit: number,
  offset: number,
): ProductListResult {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(response.count / limit)
  return {
    products: response.results
      .filter((result) => !isUnpublishedValue(result.product_name))
      .map(mapKeywordSearchResultToCardProduct),
    pagination: {
      page,
      limit,
      total: response.count,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}

// ── Hybrid Search (Full Results) ──────────────────────────────────────────────

export function mapCatalogSearchResultToCardProduct(result: CatalogSearchResult): CardProduct {
  return {
    product_id: result.product_id,
    product_name: normalizePublishedValue(result.product_name) ?? '',
    product_description: normalizePublishedValue(result.short_description),
    product_logo: null, // Hybrid search doesn't return logo
    rating: result.avg_rating,
    reviews: result.total_reviews,
    primary_category: null, // Not in hybrid search result
    vendor_name: normalizePublishedValue(result.vendor_name),
    free_plan_available: result.free_plan,
    free_trial_available: result.free_trial,
  }
}

export function mapCatalogSearchResponseToResults(
  response: CatalogSearchResponse,
  limit: number,
  offset: number,
): ProductListResult {
  const page = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(response.count / limit)
  return {
    products: response.results
      .filter((result) => !isUnpublishedValue(result.product_name))
      .map(mapCatalogSearchResultToCardProduct),
    pagination: {
      page,
      limit,
      total: response.count,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}
