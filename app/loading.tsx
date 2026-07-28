import { Skeleton } from '@/components/ui/Skeleton'

/**
 * Global App Router fallback. Next.js renders this file while any route
 * segment is loading — combined with the <NextTopLoader /> progress bar
 * mounted in `app/layout.tsx`, this gives users visible feedback during
 * both the initial page load and client-side route transitions.
 *
 * Specific routes (e.g. /products, /experts, /AI_workspace) override this
 * with their own loading.tsx that mimics the destination page's layout.
 */
export default function GlobalLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="flex min-h-screen flex-col bg-white"
    >
      {/* Spacer for fixed navbar (height: 80px) */}
      <div className="h-[80px]" />

      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-[32px] px-[32px] py-[64px]">
        {/* Page heading */}
        <Skeleton className="h-[36px] w-[280px] rounded-[8px]" />

        {/* Primary content block */}
        <div className="flex flex-col gap-[16px]">
          <Skeleton className="h-[120px] w-full rounded-[12px]" />
          <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">
            <Skeleton className="h-[160px] rounded-[12px]" />
            <Skeleton className="h-[160px] rounded-[12px]" />
            <Skeleton className="h-[160px] rounded-[12px]" />
          </div>
        </div>

        {/* Secondary content block */}
        <Skeleton.Text lines={4} className="max-w-[640px]" />
      </div>
    </div>
  )
}
