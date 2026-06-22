'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchHero from './SearchHero'
import {
  ProductFiltersDrawer,
  type ProductFilterValues,
} from './filters/ProductFiltersDrawer'
import {
  ExpertFiltersDrawer,
  type ExpertFilterValues,
} from './filters/ExpertFiltersDrawer'

interface ListingExplorerProps {
  kind: 'products' | 'experts'
  productFilters?: ProductFilterValues
  expertFilters?: ExpertFilterValues
  onProductFiltersChange?: (values: ProductFilterValues) => void
  onExpertFiltersChange?: (values: ExpertFilterValues) => void
}

export default function ListingExplorer(props: ListingExplorerProps) {
  return (
    <Suspense fallback={null}>
      <ListingExplorerInner {...props} />
    </Suspense>
  )
}

function ListingExplorerInner({
  kind,
  productFilters,
  expertFilters,
  onProductFiltersChange,
  onExpertFiltersChange,
}: ListingExplorerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [activeLabels, setActiveLabels] = useState<string[]>([])

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    if (query) params.set('search', query)
    else params.delete('search')
    router.push(`/${kind}?${params.toString()}`)
  }

  return (
    <>
      <section className="pt-[120px] pb-[64px] bg-white">
        <div className="max-w-[1280px] mx-auto px-[32px]">
          <SearchHero
            kind={kind}
            onMoreFilters={() => setDrawerOpen(true)}
            onSearch={handleSearch}
            initialQuery={searchParams.get('search') ?? ''}
            activeLabels={activeLabels}
            onRemoveLabel={(label) => setActiveLabels((l) => l.filter((x) => x !== label))}
          />
        </div>
      </section>
      {drawerOpen && kind === 'products' && productFilters ? (
        <ProductFiltersDrawer
          key={JSON.stringify(productFilters)}
          open={drawerOpen}
          values={productFilters}
          onClose={() => setDrawerOpen(false)}
          onApply={(values) => {
            setActiveLabels([
              values.pricingBucket,
              values.freePlan ? 'Free plan' : '',
              values.freeTrial ? 'Free trial' : '',
            ].filter(Boolean))
            onProductFiltersChange?.(values)
          }}
        />
      ) : null}
      {drawerOpen && kind === 'experts' && expertFilters ? (
        <ExpertFiltersDrawer
          key={JSON.stringify(expertFilters)}
          open={drawerOpen}
          values={expertFilters}
          onClose={() => setDrawerOpen(false)}
          onApply={(values) => {
            setActiveLabels([
              values.location,
              values.entityType,
              values.platform,
              values.industry,
              values.projectType,
              values.minimumYears ? `${values.minimumYears}+ years` : '',
            ].filter(Boolean))
            onExpertFiltersChange?.(values)
          }}
        />
      ) : null}
    </>
  )
}
