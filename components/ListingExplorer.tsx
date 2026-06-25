'use client'

import { Suspense, useMemo, useState } from 'react'
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
  const activeFilterChips = useMemo(() => {
    if (kind === 'products' && productFilters) {
      return productFilterChips(productFilters, onProductFiltersChange)
    }
    if (kind === 'experts' && expertFilters) {
      return expertFilterChips(expertFilters, onExpertFiltersChange)
    }
    return []
  }, [expertFilters, kind, onExpertFiltersChange, onProductFiltersChange, productFilters])

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
            activeLabels={activeFilterChips.map((chip) => chip.label)}
            onRemoveLabel={(label) => {
              activeFilterChips.find((chip) => chip.label === label)?.clear()
            }}
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
            onExpertFiltersChange?.(values)
          }}
        />
      ) : null}
    </>
  )
}

type ActiveFilterChip = {
  label: string
  clear: () => void
}

function productFilterChips(
  values: ProductFilterValues,
  onChange?: (values: ProductFilterValues) => void,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = []
  const setValues = (next: ProductFilterValues) => onChange?.(next)
  if (values.pricingBucket) {
    const labelMap: Record<string, string> = {
      free: 'Free pricing',
      low: 'Low pricing',
      mid: 'Mid-market',
      enterprise: 'Enterprise',
    }
    chips.push({
      label: labelMap[values.pricingBucket] ?? values.pricingBucket,
      clear: () => setValues({ ...values, pricingBucket: '' }),
    })
  }
  if (values.freePlan) {
    chips.push({
      label: 'Free plan available',
      clear: () => setValues({ ...values, freePlan: false }),
    })
  }
  if (values.freeTrial) {
    chips.push({
      label: 'Free trial available',
      clear: () => setValues({ ...values, freeTrial: false }),
    })
  }
  return chips
}

function expertFilterChips(
  values: ExpertFilterValues,
  onChange?: (values: ExpertFilterValues) => void,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = []
  const setValues = (next: ExpertFilterValues) => onChange?.(next)
  if (values.sort && values.sort !== 'relevance') {
    const labelMap: Record<ExpertFilterValues['sort'], string> = {
      relevance: 'Relevance',
      experience: 'Most experienced',
      projects: 'Most projects',
      name: 'Name',
    }
    chips.push({
      label: labelMap[values.sort],
      clear: () => setValues({ ...values, sort: 'relevance' }),
    })
  }
  if (values.entityType) {
    chips.push({
      label: values.entityType,
      clear: () => setValues({ ...values, entityType: '' }),
    })
  }
  if (values.platform) {
    chips.push({
      label: values.platform,
      clear: () => setValues({ ...values, platform: '' }),
    })
  }
  if (values.industry) {
    chips.push({
      label: values.industry,
      clear: () => setValues({ ...values, industry: '' }),
    })
  }
  if (values.projectType) {
    chips.push({
      label: values.projectType,
      clear: () => setValues({ ...values, projectType: '' }),
    })
  }
  if (values.location) {
    chips.push({
      label: values.location,
      clear: () => setValues({ ...values, location: '' }),
    })
  }
  if (values.minimumYears > 0) {
    chips.push({
      label: `${values.minimumYears}+ years`,
      clear: () => setValues({ ...values, minimumYears: 0 }),
    })
  }
  return chips
}
