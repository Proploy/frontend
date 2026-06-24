'use client'

// components/compare/CompareTray.tsx — floating selection tray, mounted site-wide.
// Shows the products a buyer has marked to compare and routes to /compare with them.
// Renders nothing when the selection is empty or while already on the compare page.

import { useRouter, usePathname } from 'next/navigation'
import { ArrowRight, X } from 'lucide-react'
import { CatalogImage } from '@/components/catalog/CatalogImage'
import { useCompareSelection, MAX_COMPARE } from '@/features/compare/selection-store'

export default function CompareTray() {
  const router = useRouter()
  const pathname = usePathname()
  const { items, count, remove, clear } = useCompareSelection()

  if (count === 0 || pathname?.startsWith('/compare')) return null

  const canCompare = count >= 2
  const goCompare = () => {
    if (!canCompare) return
    const ids = items.map((p) => p.product_id).join(',')
    router.push(`/compare?products=${encodeURIComponent(ids)}`)
  }

  return (
    <div
      className="compare-tray pointer-events-none fixed inset-x-0 z-[70] flex justify-center px-[16px]"
      style={{ bottom: 0, paddingBottom: 'calc(20px + env(safe-area-inset-bottom))' }}
      role="region"
      aria-label="Compare selection"
    >
      <div className="pointer-events-auto flex w-full max-w-[680px] flex-col gap-[12px] rounded-[16px] border border-[#e9eaeb] bg-white/95 p-[14px] backdrop-blur-md shadow-[0px_12px_32px_-8px_rgba(10,13,18,0.18),0px_2px_6px_-2px_rgba(10,13,18,0.10)] sm:flex-row sm:items-center sm:gap-[16px] sm:p-[12px] sm:pl-[18px]">
        <div className="flex min-w-0 flex-1 items-center gap-[12px]">
          <span className="hidden shrink-0 font-[family-name:var(--font-dm-sans)] text-[13px] font-semibold leading-[18px] text-[#717680] sm:block">
            Compare
            <span className="text-[#a4a7ae]"> {count}/{MAX_COMPARE}</span>
          </span>
          <ul className="flex min-w-0 flex-1 items-center gap-[8px] overflow-x-auto py-[2px]">
            {items.map((p) => (
              <li
                key={p.product_id}
                className="flex shrink-0 items-center gap-[8px] rounded-full border border-[#e9eaeb] bg-[#fafafa] py-[4px] pl-[6px] pr-[8px]"
              >
                <span className="flex size-[24px] items-center justify-center overflow-hidden rounded-[6px] border border-[#e9eaeb] bg-white text-[11px] font-bold text-[#155eef]">
                  {p.product_logo ? (
                    <CatalogImage
                      src={p.product_logo}
                      alt=""
                      className="size-full object-contain p-[2px]"
                      fallback={<span aria-hidden="true">{p.product_name.charAt(0)}</span>}
                    />
                  ) : (
                    <span aria-hidden="true">{p.product_name.charAt(0)}</span>
                  )}
                </span>
                <span className="max-w-[140px] truncate font-[family-name:var(--font-dm-sans)] text-[13px] font-medium leading-[18px] text-[#414651]">
                  {p.product_name}
                </span>
                <button
                  type="button"
                  onClick={() => remove(p.product_id)}
                  aria-label={`Remove ${p.product_name} from comparison`}
                  className="flex size-[18px] items-center justify-center rounded-full text-[#a4a7ae] transition-colors hover:bg-[#fef3f2] hover:text-[#d92d20]"
                >
                  <X size={13} />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-[10px]">
          <button
            type="button"
            onClick={clear}
            className="font-[family-name:var(--font-dm-sans)] text-[14px] font-semibold leading-[20px] text-[#717680] transition-colors hover:text-[#414651]"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={goCompare}
            disabled={!canCompare}
            title={canCompare ? undefined : 'Select at least 2 products to compare'}
            className="inline-flex items-center gap-[6px] rounded-[8px] border-2 border-white/[0.12] bg-[#155eef] px-[16px] py-[10px] font-[family-name:var(--font-dm-sans)] text-[15px] font-semibold leading-[20px] text-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] transition-colors hover:bg-[#0e4cc7] disabled:cursor-not-allowed disabled:bg-[#a4c4ff] disabled:shadow-none"
          >
            Compare {count}
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
