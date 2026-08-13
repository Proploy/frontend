'use client'

import { useMemo, useState } from 'react'
import type { EvaluationProduct } from '@/features/ai-workspace'
import { ProductName } from './ProductName'

export function ComparisonPanel({
  items,
  initialSelection,
  onCompare,
}: {
  items: EvaluationProduct[]
  initialSelection: string[]
  onCompare: (productIds: string[]) => void
}) {
  const allowedInitial = useMemo(
    () =>
      initialSelection.filter((productId) =>
        items.some((item) => item.product_id === productId),
      ),
    [initialSelection, items],
  )
  const [selected, setSelected] = useState<string[]>(
    allowedInitial.length >= 2
      ? allowedInitial
      : items.slice(0, 2).map((item) => item.product_id),
  )

  if (items.length < 2) {
    return (
      <div className="rounded-xl border border-dashed border-[#d5d7da] bg-[#fafafa] px-4 py-8 text-center">
        <p className="text-sm font-semibold text-[#414651]">
          Shortlist at least two products
        </p>
        <p className="mt-1 text-xs leading-5 text-[#717680]">
          Then choose up to four products to open in the existing comparison
          workspace.
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-xs leading-5 text-[#717680]">
        Choose 2–4 products. Your shortlist ranking stays independent.
      </p>
      <div className="mt-3 space-y-2">
        {items.map((product) => {
          const checked = selected.includes(product.product_id)
          return (
            <label
              key={product.product_id}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#e9eaeb] bg-white px-3 py-3 hover:border-[#b2ccff]"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() =>
                  setSelected((current) =>
                    checked
                      ? current.filter(
                          (id) => id !== product.product_id,
                        )
                      : current.length < 4
                        ? [...current, product.product_id]
                        : current,
                  )
                }
                className="size-4 accent-[#155eef]"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#181d27]">
                  <ProductName product={product} />
                </p>
                {product.match_score != null && (
                  <p className="text-xs text-[#717680]">
                    Match score: {(product.match_score * 100).toFixed(0)}%
                  </p>
                )}
              </div>
            </label>
          )
        })}
      </div>
      <button
        type="button"
        onClick={() => onCompare(selected)}
        disabled={selected.length < 2 || selected.length > 4}
        className="mt-4 h-10 w-full rounded-xl bg-[#155eef] text-sm font-semibold text-white hover:bg-[#0e4cc7] disabled:cursor-not-allowed disabled:bg-[#d5d7da]"
      >
        Open comparison
      </button>
    </div>
  )
}
