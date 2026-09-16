import { Sparkles } from 'lucide-react'
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
      className="fixed inset-0 flex min-h-0 flex-col overflow-hidden bg-paper font-[family-name:var(--font-dm-sans)] text-ink"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_58%_0%,rgba(45,99,255,0.08),transparent_32%)]" />
      <div className="relative grid h-full min-w-0 grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(600px,1fr)_360px]">
        {/* Sidebar */}
        <aside className="hidden min-h-0 border-r border-border/80 bg-paper/95 lg:flex lg:flex-col">
          <div className="flex min-h-[72px] items-center justify-between border-b border-border/80 px-4">
            <Skeleton className="h-[18px] w-[120px] rounded-[4px]" />
            <Skeleton shape="circle" className="size-[28px]" />
          </div>
          <div className="px-5 pb-3 pt-5"><Skeleton className="h-3 w-24 rounded" /></div>
          <div className="mx-4 rounded-2xl border border-dashed border-cobalt/20 bg-cobalt-soft/30 p-4">
            <span className="grid size-8 place-items-center rounded-xl bg-white text-cobalt shadow-sm"><Sparkles size={15} /></span>
            <Skeleton className="mt-3 h-3.5 w-32 rounded" />
            <Skeleton className="mt-2 h-3 w-full rounded" />
            <Skeleton className="mt-1.5 h-3 w-4/5 rounded" />
          </div>
          <div className="mt-auto border-t border-border/80 p-4"><Skeleton className="h-10 w-full rounded-xl" /></div>
        </aside>

        {/* Main column */}
        <main className="flex min-h-0 min-w-0 flex-col">
          {/* Header */}
          <div className="flex min-h-[72px] items-center justify-between border-b border-border/80 px-6">
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
          <div className="flex flex-1 flex-col gap-4 overflow-hidden bg-white/60 p-6">
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
          <div className="border-t border-border/80 bg-paper/80 p-4">
            <Skeleton className="mx-auto h-[76px] w-full max-w-[960px] rounded-2xl" />
          </div>
        </main>

        {/* Decision sidebar */}
        <aside className="hidden min-h-0 border-l border-border/80 bg-paper/80 xl:flex xl:flex-col">
          <div className="min-h-[72px] border-b border-border/80 px-5 py-6">
            <Skeleton className="h-[18px] w-[140px] rounded-[4px]" />
          </div>
          <div className="flex flex-col gap-[12px] p-[16px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-[8px] rounded-2xl border border-border/80 bg-white/70 p-[12px]">
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
