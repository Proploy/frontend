import type { Metadata } from 'next'
import { Suspense } from 'react'
import { serverCatalogApi } from '@/features/catalog/shared/server-api'
import ProductsPageClient from './ProductsPageClient'
import { ProductsPageSuspenseFallback } from './ProductsPageClient'
import {
  mapProductFacets,
  mapProductListResponseToPage,
} from '@/features/catalog/products/mappers'
import { buildProductListRequest } from '@/features/catalog/products/filter-request'
import {
  parseProductFilterParams,
  searchParamsFromRecord,
} from '@/features/catalog/products/filter-params'

// The canonical drops the query string: every filter and search combination
// renders a variant of this one page, and they must not compete with it.
export const metadata: Metadata = {
  title: 'Software catalog — Proploy',
  description:
    'Browse business software by category, compliance, integrations and pricing, and find vetted experts who implement it.',
  alternates: { canonical: '/products' },
}

const PRODUCT_PAGE_SIZE = 15

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // Filters live in the URL, so the first page is rendered for exactly the
  // requested view (category, filters, keyword search). The same request
  // carries the filter facets for that view, so the sidebar and the results
  // describe one id universe. Natural-language search runs client-side, so
  // nothing (list or facets) is prefetched in that mode.
  const params = searchParamsFromRecord(await searchParams)
  const filters = parseProductFilterParams(params)
  const search = params.get('search')?.trim() || undefined
  const naturalMode = params.get('mode') === 'natural'

  const [treeResult, productsResult] = await Promise.all([
    serverCatalogApi.categories.getTree(),
    naturalMode && search
      ? Promise.resolve(null)
      : serverCatalogApi.products.list({
          ...buildProductListRequest({
            ...filters,
            search,
            limit: PRODUCT_PAGE_SIZE,
            offset: 0,
          }),
          include_facets: true,
        }),
  ])

  // Leave this empty when the fetch fails; the client hook refetches when it
  // starts without a tree, so the filter list is never permanently empty.
  const categoryTree = treeResult.ok ? treeResult.data.tree ?? [] : []
  const initialFacets =
    productsResult && productsResult.ok && productsResult.data.facets
      ? mapProductFacets(productsResult.data.facets)
      : null
  const initialProductsPage =
    productsResult && productsResult.ok
      ? mapProductListResponseToPage(productsResult.data, PRODUCT_PAGE_SIZE, 0)
      : null

  return (
    <Suspense fallback={<ProductsPageSuspenseFallback />}>
      <ProductsPageClient
        initialCategoryTree={categoryTree}
        initialProductsPage={initialProductsPage}
        initialFacets={initialFacets}
      />
    </Suspense>
  )
}
