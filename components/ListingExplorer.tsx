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
import type { CategoryNode } from '@/features/catalog'

interface ListingExplorerProps {
  kind: 'products' | 'experts'
  productFilters?: ProductFilterValues
  expertFilters?: ExpertFilterValues
  productCategoryTree?: CategoryNode[]
  productCategoriesLoading?: boolean
  productCategoriesError?: boolean
  onProductFiltersChange?: (values: ProductFilterValues) => void
  onExpertFiltersChange?: (values: ExpertFilterValues) => void
  onSearchChange?: () => void
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
  productCategoryTree = [],
  productCategoriesLoading = false,
  productCategoriesError = false,
  onProductFiltersChange,
  onExpertFiltersChange,
  onSearchChange,
}: ListingExplorerProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const activeFilterChips = useMemo(() => {
    if (kind === 'products' && productFilters) {
      return productFilterChips(
        productFilters,
        productCategoryTree,
        onProductFiltersChange,
      )
    }
    if (kind === 'experts' && expertFilters) {
      return expertFilterChips(expertFilters, onExpertFiltersChange)
    }
    return []
  }, [
    expertFilters,
    kind,
    onExpertFiltersChange,
    onProductFiltersChange,
    productCategoryTree,
    productFilters,
  ])
  const productQuickFilterLabels = useMemo(() => {
    if (kind !== 'products' || !productFilters) return undefined
    const category = findCategoryLabel(
      productCategoryTree,
      productFilters.categoryTermId,
    )
    const pricing = pricingLabel(productFilters.pricingBucket)
    const planCount =
      Number(productFilters.freePlan) +
      Number(productFilters.freeTrial)
    return {
      category: category ?? 'Any category',
      pricing: pricing ?? 'Any pricing',
      plans:
        planCount > 0
          ? `${planCount} plan filter${planCount === 1 ? '' : 's'}`
          : 'Plans & trials',
    }
  }, [kind, productCategoryTree, productFilters])

  const handleSearch = (query: string) => {
    onSearchChange?.()
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    if (query) params.set('search', query)
    else params.delete('search')
    router.push(`/${kind}?${params.toString()}`)
  }

  return (
    <>
      <section className="bg-white pb-[32px] pt-[120px]">
        <div className="max-w-[1280px] mx-auto px-[32px]">
          <SearchHero
            kind={kind}
            onMoreFilters={() => setDrawerOpen(true)}
            onSearch={handleSearch}
            initialQuery={searchParams.get('search') ?? ''}
            quickFilterLabels={productQuickFilterLabels}
            productCategoryTree={productCategoryTree}
            productCategoriesLoading={productCategoriesLoading}
            productCategoriesError={productCategoriesError}
            selectedCategoryTermId={
              productFilters?.categoryTermId ?? ''
            }
            onCategorySelect={(categoryTermId) => {
              if (!productFilters) return
              onProductFiltersChange?.({
                ...productFilters,
                categoryTermId,
              })
            }}
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
  categoryTree: CategoryNode[],
  onChange?: (values: ProductFilterValues) => void,
): ActiveFilterChip[] {
  const chips: ActiveFilterChip[] = []
  const setValues = (next: ProductFilterValues) => onChange?.(next)
  const categoryLabel = findCategoryLabel(
    categoryTree,
    values.categoryTermId,
  )
  if (values.categoryTermId) {
    chips.push({
      label: categoryLabel ?? 'Selected category',
      clear: () => setValues({ ...values, categoryTermId: '' }),
    })
  }
  if (values.pricingBucket) {
    chips.push({
      label:
        pricingLabel(values.pricingBucket) ??
        values.pricingBucket,
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

function findCategoryLabel(
  nodes: CategoryNode[],
  termId: string,
): string | null {
  if (!termId) return null
  for (const node of nodes) {
    if (node.term_id === termId) return node.label
    const nested = findCategoryLabel(node.children, termId)
    if (nested) return nested
  }
  return null
}

function pricingLabel(value: string): string | null {
  const labels: Record<string, string> = {
    free: 'Free pricing',
    low: 'Low pricing',
    mid: 'Mid-market',
    enterprise: 'Enterprise',
  }
  return labels[value] ?? null
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
