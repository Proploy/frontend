'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import ListingExplorer from '@/components/ListingExplorer'
import { ExpertDiscoveryCard } from '@/components/experts/ExpertDiscoveryCard'
import { useCatalogProductMatches } from '@/features/catalog'
import { useApprovedExperts } from '@/features/experts/use-approved-experts'
import type { ExpertListItem } from '@/features/experts/types'
import {
  DEFAULT_EXPERT_FILTERS,
  type ExpertFilterValues,
} from '@/components/filters/ExpertFiltersDrawer'

export default function ExpertsPage() {
  return (
    <Suspense fallback={null}>
      <ExpertsPageContent />
    </Suspense>
  )
}

function ExpertsPageContent() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search')?.trim().toLowerCase() ?? ''
  const filtersFromUrl = useMemo<ExpertFilterValues>(() => ({
    ...DEFAULT_EXPERT_FILTERS,
    platform: searchParams.get('platform') ?? '',
    industry: searchParams.get('industry') ?? '',
    projectType: searchParams.get('projectType') ?? '',
    location: searchParams.get('location') ?? '',
  }), [searchParams])
  const [filters, setFilters] = useState<ExpertFilterValues>(filtersFromUrl)

  useEffect(() => {
    setFilters(filtersFromUrl)
  }, [filtersFromUrl])
  const { experts, loading } = useApprovedExperts({
    platform: filters.platform || undefined,
    industry: filters.industry || undefined,
    projectType: filters.projectType || undefined,
    limit: 50,
  })
  const platformNames = useMemo(
    () => Array.from(new Set(experts.flatMap((expert) => [
      ...(expert.primaryPlatforms ?? []),
      ...(expert.secondaryPlatforms ?? []),
    ]))),
    [experts],
  )
  const { products: catalogProducts } = useCatalogProductMatches(platformNames)
  const typedExperts: ExpertListItem[] = useMemo(() => {
    const filtered = experts.filter((expert) => {
    const location = [expert.regionCity, expert.regionCountry].filter(Boolean).join(' ').toLowerCase()
    const searchable = [
      expert.displayName,
      expert.headline,
      location,
      ...(expert.tags?.map((tag) => tag.tagValue) ?? []),
    ].filter(Boolean).join(' ').toLowerCase()
    const matchesSearch = !search || searchable.includes(search)
    const matchesLocation = !filters.location || location.includes(filters.location.toLowerCase())
    const matchesYears = (expert.yearsExperience ?? 0) >= filters.minimumYears
    const matchesType = !filters.entityType || expert.entityType?.toLowerCase().includes(filters.entityType)
      return matchesSearch && matchesLocation && matchesYears && matchesType
    })

    if (filters.sort === 'experience') {
      return [...filtered].sort((a, b) => (b.yearsExperience ?? 0) - (a.yearsExperience ?? 0))
    }
    if (filters.sort === 'projects') {
      return [...filtered].sort((a, b) => (b.projectsCompletedTotal ?? 0) - (a.projectsCompletedTotal ?? 0))
    }
    if (filters.sort === 'name') {
      return [...filtered].sort((a, b) => a.displayName.localeCompare(b.displayName))
    }
    return filtered
  }, [experts, filters, search])

  return (
    <div className="relative bg-white min-h-screen">
      <ListingExplorer
        kind="experts"
        expertFilters={filters}
        onExpertFiltersChange={setFilters}
      />
      {/* Expert Cards */}
      <section className="py-[64px]">
        <div className="max-w-[1280px] mx-auto px-[32px]">
          {loading ? (
            <div className="flex items-center justify-center py-[96px]">
              <Loader2 size={40} className="animate-spin text-[#155eef]" />
            </div>
          ) : typedExperts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-[96px] gap-[16px]">
              <p
                className="font-[family-name:var(--font-dm-sans)] font-normal text-[18px] leading-[28px] text-[#535862]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                No experts found yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-[24px]">
              {typedExperts.map((expert) => (
                <ExpertDiscoveryCard key={expert.id} expert={expert} catalogProducts={catalogProducts} />
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
