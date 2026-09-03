import { describe, expect, it } from 'vitest'

import {
  CATALOG_REVALIDATE_SECONDS,
  CATEGORY_TREE_REVALIDATE_SECONDS,
  catalogRevalidateSeconds,
  isCacheableCatalogPath,
} from './cache-policy'

describe('isCacheableCatalogPath', () => {
  it('caches catalog reference data', () => {
    expect(isCacheableCatalogPath('/api/v1/catalog/categories/tree')).toBe(true)
    expect(isCacheableCatalogPath('/api/v1/catalog/products/facets')).toBe(true)
    expect(isCacheableCatalogPath('/api/v1/catalog/products/abc123/ui')).toBe(true)
    expect(isCacheableCatalogPath('/api/v1/catalog/products/abc123/media?kind=logo')).toBe(true)
  })

  it('caches browse and filtered lists, which are keyed by bounded options', () => {
    expect(isCacheableCatalogPath('/api/v1/catalog/products/ui?sort=name&limit=15&offset=0')).toBe(true)
    expect(isCacheableCatalogPath('/api/v1/catalog/products/ui?category=crm&pricing_bucket=free')).toBe(true)
  })

  it('never caches a response keyed by a search term', () => {
    expect(isCacheableCatalogPath('/api/v1/catalog/products/ui?search=project+management&limit=15')).toBe(false)
    expect(isCacheableCatalogPath('/api/v1/catalog/products/ui?category=crm&search=jira')).toBe(false)
  })

  it('treats a blank search term as browsing', () => {
    expect(isCacheableCatalogPath('/api/v1/catalog/products/ui?search=&limit=15')).toBe(true)
    expect(isCacheableCatalogPath('/api/v1/catalog/products/ui?search=%20&limit=15')).toBe(true)
  })

  it('leaves non-catalog paths to the caller (no caching)', () => {
    expect(isCacheableCatalogPath('/api/v1/experts')).toBe(false)
    expect(isCacheableCatalogPath('/api/v1/auth/sync')).toBe(false)
  })
})

describe('catalogRevalidateSeconds', () => {
  it('gives the category tree a short window so a bad snapshot cannot linger', () => {
    expect(catalogRevalidateSeconds('/api/v1/catalog/categories/tree')).toBe(CATEGORY_TREE_REVALIDATE_SECONDS)
    expect(CATEGORY_TREE_REVALIDATE_SECONDS).toBeLessThan(CATALOG_REVALIDATE_SECONDS)
  })

  it('keeps the long window for other catalog reference data', () => {
    expect(catalogRevalidateSeconds('/api/v1/catalog/products/facets')).toBe(CATALOG_REVALIDATE_SECONDS)
    expect(catalogRevalidateSeconds('/api/v1/catalog/products/abc/ui')).toBe(CATALOG_REVALIDATE_SECONDS)
  })

  it('refuses to cache searches and non-catalog paths', () => {
    expect(catalogRevalidateSeconds('/api/v1/catalog/products/ui?search=crm')).toBeNull()
    expect(catalogRevalidateSeconds('/api/v1/experts')).toBeNull()
  })
})
