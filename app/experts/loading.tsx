import { Skeleton } from '@/components/ui/Skeleton'

/**
 * Route-level fallback for `/experts`. Renders by Next.js during route
 * transitions to /experts/* — mimics the search-hero + expert-card list.
 */
export default function ExpertsLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen bg-white font-[family-name:var(--font-dm-sans)] flex flex-col"
    >
      {/* Search hero placeholder */}
      <div className="pt-[120px] pb-[64px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col items-center gap-[24px]">
          <Skeleton className="h-[44px] w-[520px] max-w-full rounded-[8px]" />
          <Skeleton className="h-[64px] w-[824px] max-w-full rounded-full" />
          <div className="flex flex-wrap justify-center gap-[8px]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-[32px] w-[90px] rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Expert list */}
      <section className="py-[64px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[24px]">
          {Array.from({ length: 4 }).map((_, i) => (
            <ExpertCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  )
}

function ExpertCardSkeleton() {
  return (
    <article className="rounded-[16px] border border-[#e9eaeb] bg-white p-[24px]">
      <div className="flex flex-col gap-[16px] md:flex-row md:items-start md:gap-[24px]">
        {/* Avatar */}
        <Skeleton shape="circle" className="size-[72px] shrink-0" />

        {/* Body */}
        <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
          <div className="flex items-center justify-between gap-[12px]">
            <Skeleton className="h-[24px] w-[200px] rounded-[6px]" />
            <Skeleton className="h-[20px] w-[60px] rounded-full" />
          </div>
          <Skeleton className="h-[18px] w-[80%] rounded-[6px]" />
          <div className="flex flex-wrap gap-[8px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[26px] w-[80px] rounded-full" />
            ))}
          </div>
          <div className="mt-[4px] flex flex-wrap items-center gap-[12px]">
            <Skeleton className="h-[36px] w-[120px] rounded-[8px]" />
            <Skeleton className="h-[36px] w-[120px] rounded-[8px]" />
          </div>
        </div>
      </div>
    </article>
  )
}
