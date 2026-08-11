'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ListingExplorer from '@/components/ListingExplorer'
import { ExpertDiscoveryCard } from '@/components/experts/ExpertDiscoveryCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCatalogProductMatches } from '@/features/catalog'
import { useApprovedExperts } from '@/features/experts/use-approved-experts'
import type { ExpertListItem } from '@/features/experts/types'
import {
  DEFAULT_EXPERT_FILTERS,
  type ExpertFilterValues,
} from '@/components/filters/ExpertFiltersDrawer'

export default function ExpertsPage() {
  return (
    <Suspense fallback={<ExpertsPageSuspenseFallback />}>
      <ExpertsPageContent />
    </Suspense>
  )
}

function ExpertsPageSuspenseFallback() {
  return (
    <div className="min-h-screen bg-white font-[family-name:var(--font-dm-sans)] flex flex-col">
      <div className="pt-[120px] pb-[64px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col items-center gap-[24px]">
          <Skeleton className="h-[64px] w-[824px] max-w-full rounded-full" />
        </div>
      </div>
      <section className="py-[64px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[24px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <article key={i} className="rounded-[16px] border border-[#e9eaeb] bg-white p-[24px]">
              <div className="flex flex-col gap-[16px] md:flex-row md:items-start md:gap-[24px]">
                <Skeleton shape="circle" className="size-[72px] shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
                  <div className="flex items-center justify-between gap-[12px]">
                    <Skeleton className="h-[24px] w-[200px] rounded-[6px]" />
                    <Skeleton className="h-[20px] w-[60px] rounded-full" />
                  </div>
                  <Skeleton className="h-[18px] w-[80%] rounded-[6px]" />
                  <div className="flex flex-wrap gap-[8px]">
                    {Array.from({ length: 4 }).map((__, j) => (
                      <Skeleton key={j} className="h-[26px] w-[80px] rounded-full" />
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
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
  const { experts, loading, error, refetch } = useApprovedExperts({
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
            <div className="flex flex-col gap-[24px]" role="status" aria-busy="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <article key={i} className="rounded-[16px] border border-[#e9eaeb] bg-white p-[24px]">
                  <div className="flex flex-col gap-[16px] md:flex-row md:items-start md:gap-[24px]">
                    <Skeleton shape="circle" className="size-[72px] shrink-0" />
                    <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
                      <div className="flex items-center justify-between gap-[12px]">
                        <Skeleton className="h-[24px] w-[200px] rounded-[6px]" />
                        <Skeleton className="h-[20px] w-[60px] rounded-full" />
                      </div>
                      <Skeleton className="h-[18px] w-[80%] rounded-[6px]" />
                      <div className="flex flex-wrap gap-[8px]">
                        {Array.from({ length: 4 }).map((__, j) => (
                          <Skeleton key={j} className="h-[26px] w-[80px] rounded-full" />
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-[16px] py-[96px]">
              <p
                className="font-[family-name:var(--font-dm-sans)] text-[18px] font-normal leading-[28px] text-[#535862]"
                style={{ fontVariationSettings: "'opsz' 14" }}
              >
                We couldn&apos;t load approved experts right now.
              </p>
              <p className="text-[14px] text-[#717680]">{error.error.message}</p>
              <button
                type="button"
                onClick={refetch}
                className="rounded-[10px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold text-white hover:bg-[#004eeb]"
              >
                Try again
              </button>
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
