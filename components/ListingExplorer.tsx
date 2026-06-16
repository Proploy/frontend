'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import SearchHero from './SearchHero'
import FiltersDrawer, { FilterValues } from './FiltersDrawer'

interface ListingExplorerProps {
  kind: 'products' | 'experts'
}

export default function ListingExplorer(props: ListingExplorerProps) {
  return (
    <Suspense fallback={null}>
      <ListingExplorerInner {...props} />
    </Suspense>
  )
}

function ListingExplorerInner({ kind }: ListingExplorerProps) {
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

  const handleApply = (values: FilterValues) => {
    const labels: string[] = []
    labels.push(...values.categories)
    labels.push(...values.types)
    if (values.location) labels.push(values.location)
    setActiveLabels(labels)
    setDrawerOpen(false)
  }

  return (
    <>
      <section className="pt-[120px] pb-[64px] bg-white">
        <div className="max-w-[1280px] mx-auto px-[32px]">
          <SearchHero
            onMoreFilters={() => setDrawerOpen(true)}
            onSearch={handleSearch}
            initialQuery={searchParams.get('search') ?? ''}
            activeLabels={activeLabels}
            onRemoveLabel={(label) => setActiveLabels((l) => l.filter((x) => x !== label))}
          />
        </div>
      </section>
      <FiltersDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onApply={handleApply} />
    </>
  )
}
