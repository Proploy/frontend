import { Suspense } from 'react'
import { serverCatalogApi } from '@/features/catalog/shared/server-api'
import ProductsPageClient from './ProductsPageClient'
import { ProductsPageSuspenseFallback } from './ProductsPageClient'
import { mapProductListResponseToPage } from '@/features/catalog/products/mappers'

const PRODUCT_PAGE_SIZE = 15

export default async function ProductsPage() {
  const treeResult = await serverCatalogApi.categories.getTree({
    next: { revalidate: 3600 },
  })
  
  const productsResult = await serverCatalogApi.products.list(
    { limit: PRODUCT_PAGE_SIZE, offset: 0 },
    { next: { revalidate: 3600 } }
  )

  const categoryTree = treeResult.ok ? treeResult.data.tree : []
  let initialProductsPage = null

  if (productsResult.ok) {
    initialProductsPage = mapProductListResponseToPage(productsResult.data, PRODUCT_PAGE_SIZE, 0)
  }

  return (
    <Suspense fallback={<ProductsPageSuspenseFallback />}>
      <ProductsPageClient 
        initialCategoryTree={categoryTree} 
        initialProductsPage={initialProductsPage} 
      />
    </Suspense>
  )
}
