import { Suspense } from 'react'
import { serverCatalogApi } from '@/features/catalog/shared/server-api'
import ProductsPageClient from './ProductsPageClient'
import { ProductsPageSuspenseFallback } from './ProductsPageClient'
import { mapProductListResponseToPage } from '@/features/catalog/products/mappers'
import { buildProductListRequest } from '@/features/catalog/products/filter-request'
import {
  parseProductFilterParams,
  searchParamsFromRecord,
} from '@/features/catalog/products/filter-params'

const PRODUCT_PAGE_SIZE = 15

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  // Filters live in the URL, so the first page is rendered for exactly the
  // requested view (category, filters, keyword search). Natural-language
  // search runs client-side, so no list is prefetched in that mode.
  const params = searchParamsFromRecord(await searchParams)
  const filters = parseProductFilterParams(params)
  const search = params.get('search')?.trim() || undefined
  const naturalMode = params.get('mode') === 'natural'

  const [treeResult, facetsResult, productsResult] = await Promise.all([
    serverCatalogApi.categories.getTree(),
    serverCatalogApi.products.getFacets(search),
    naturalMode && search
      ? Promise.resolve(null)
      : serverCatalogApi.products.list(
          buildProductListRequest({
            ...filters,
            search,
            limit: PRODUCT_PAGE_SIZE,
            offset: 0,
          }),
        ),
  ])

  const categoryTree = treeResult.ok ? treeResult.data.tree : []
  const initialFacets = facetsResult.ok ? facetsResult.data : null
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
