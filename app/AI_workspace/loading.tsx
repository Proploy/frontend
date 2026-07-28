import { Skeleton } from '@/components/ui/Skeleton'

/**
 * Route-level fallback for `/AI_workspace`. Renders by Next.js during
 * route transitions — mimics the workspace chrome (left sidebar of
 * evaluations, central header + chat thread, right decision panel).
 */
export default function AIWorkspaceLoading() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="mt-[80px] flex h-[calc(100dvh-80px)] min-h-0 flex-col overflow-hidden bg-white font-[family-name:var(--font-dm-sans)] text-[#181d27]"
    >
      <div className="grid h-full min-w-0 grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(600px,1fr)_360px]">
        {/* Sidebar */}
        <aside className="hidden min-h-0 border-r border-[#e9eaeb] lg:flex lg:flex-col">
          <div className="flex items-center justify-between border-b border-[#e9eaeb] px-[16px] py-[14px]">
            <Skeleton className="h-[18px] w-[120px] rounded-[4px]" />
            <Skeleton shape="circle" className="size-[28px]" />
          </div>
          <div className="flex flex-col gap-[8px] p-[12px]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-[10px] rounded-[10px] px-[10px] py-[10px]">
                <Skeleton shape="circle" className="size-[28px]" />
                <div className="flex flex-1 flex-col gap-[4px]">
                  <Skeleton className="h-[12px] w-[80%] rounded-[4px]" />
                  <Skeleton className="h-[10px] w-[50%] rounded-[4px]" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main column */}
        <main className="flex min-h-0 min-w-0 flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e9eaeb] px-[24px] py-[16px]">
            <div className="flex flex-col gap-[6px]">
              <Skeleton className="h-[20px] w-[200px] rounded-[6px]" />
              <Skeleton className="h-[12px] w-[140px] rounded-[4px]" />
            </div>
            <div className="flex items-center gap-[8px]">
              <Skeleton className="h-[36px] w-[80px] rounded-[8px]" />
              <Skeleton className="h-[36px] w-[80px] rounded-[8px]" />
              <Skeleton className="h-[36px] w-[100px] rounded-[8px]" />
            </div>
          </div>

          {/* Chat thread */}
          <div className="flex flex-1 flex-col gap-[16px] overflow-hidden bg-[#fafbfc] p-[24px]">
            {/* Bot message (left) */}
            <div className="flex items-start gap-[12px]">
              <Skeleton shape="circle" className="size-[32px]" />
              <div className="flex max-w-[70%] flex-col gap-[6px]">
                <Skeleton className="h-[14px] w-[280px] rounded-[8px]" />
                <Skeleton className="h-[14px] w-[420px] rounded-[8px]" />
                <Skeleton className="h-[14px] w-[200px] rounded-[8px]" />
              </div>
            </div>
            {/* User message (right) */}
            <div className="flex items-start justify-end gap-[12px]">
              <div className="flex max-w-[70%] flex-col items-end gap-[6px]">
                <Skeleton className="h-[14px] w-[160px] rounded-[8px]" />
                <Skeleton className="h-[14px] w-[240px] rounded-[8px]" />
              </div>
              <Skeleton shape="circle" className="size-[32px]" />
            </div>
            {/* Bot message (left) */}
            <div className="flex items-start gap-[12px]">
              <Skeleton shape="circle" className="size-[32px]" />
              <div className="flex max-w-[70%] flex-col gap-[6px]">
                <Skeleton className="h-[14px] w-[360px] rounded-[8px]" />
                <Skeleton className="h-[14px] w-[180px] rounded-[8px]" />
              </div>
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-[#e9eaeb] p-[16px]">
            <Skeleton className="h-[80px] w-full rounded-[12px]" />
            <div className="mt-[12px] flex justify-end gap-[8px]">
              <Skeleton className="h-[40px] w-[100px] rounded-[8px]" />
              <Skeleton className="h-[40px] w-[80px] rounded-[8px]" />
            </div>
          </div>
        </main>

        {/* Decision sidebar */}
        <aside className="hidden min-h-0 border-l border-[#e9eaeb] xl:flex xl:flex-col">
          <div className="border-b border-[#e9eaeb] px-[20px] py-[14px]">
            <Skeleton className="h-[18px] w-[140px] rounded-[4px]" />
          </div>
          <div className="flex flex-col gap-[12px] p-[16px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-[8px] rounded-[12px] border border-[#e9eaeb] p-[12px]">
                <Skeleton className="h-[60px] w-full rounded-[8px]" />
                <Skeleton className="h-[12px] w-[80%] rounded-[4px]" />
                <Skeleton className="h-[12px] w-[60%] rounded-[4px]" />
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
