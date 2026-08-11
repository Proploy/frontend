import { Skeleton } from '@/components/ui/Skeleton'

/**
 * Route-level fallback for `/products`. Renders by Next.js during route
 * transitions to /products/* — mimics the search-hero + product-grid
 * layout so the destination page's structure is visible while it loads.
 */
export default function ProductsLoading() {
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
              <Skeleton key={i} className="h-[32px] w-[80px] rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Section */}
      <section className="py-[96px]">
        <div className="max-w-[1280px] mx-auto px-[32px] flex flex-col gap-[64px]">
          {/* Hero text */}
          <div className="max-w-[768px] mx-auto flex flex-col gap-[20px]">
            <Skeleton className="h-[44px] w-[420px] mx-auto rounded-[6px]" />
            <Skeleton className="h-[30px] w-[520px] mx-auto rounded-[6px]" />
          </div>

          {/* Category filter tabs */}
          <div className="flex flex-wrap items-start justify-center gap-[8px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[44px] w-[110px] rounded-[8px]" />
            ))}
          </div>

          {/* Sub-category chips */}
          <div className="flex flex-wrap justify-center gap-[8px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[40px] w-[140px] rounded-[8px]" />
            ))}
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[32px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>

          {/* Load-more button placeholder */}
          <div className="flex justify-center">
            <Skeleton className="h-[48px] w-[220px] rounded-[8px]" />
          </div>
        </div>
      </section>
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <article className="rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] flex flex-col gap-[20px]">
      <div className="flex items-start justify-between gap-[12px]">
        <Skeleton className="size-[48px] rounded-[10px]" />
        <Skeleton className="h-[24px] w-[140px] rounded-full" />
      </div>
      <Skeleton className="h-[28px] w-[80%] rounded-[6px]" />
      <Skeleton.Text lines={2} />
      <div className="mt-auto flex items-center justify-end gap-[10px]">
        <Skeleton shape="circle" className="size-[32px]" />
        <Skeleton shape="circle" className="size-[32px]" />
        <Skeleton className="h-[20px] w-[80px] rounded-[4px]" />
      </div>
    </article>
  )
}
