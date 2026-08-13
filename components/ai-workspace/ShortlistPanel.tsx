'use client'

import Link from 'next/link'
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  GripVertical,
  X,
} from 'lucide-react'
import type { EvaluationProduct } from '@/features/ai-workspace'
import { getProductDetailHref } from '@/features/catalog/products/product-detail-view'
import { ProductName } from './ProductName'

export function ShortlistPanel({
  items,
  onReorder,
  onRemove,
  onCompare,
}: {
  items: EvaluationProduct[]
  onReorder: (productIds: string[]) => void
  onRemove: (productId: string) => void
  onCompare: (productIds: string[]) => void
}) {
  const move = (index: number, offset: number) => {
    const target = index + offset
    if (target < 0 || target >= items.length) return
    const next = [...items]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    onReorder(next.map((product) => product.product_id))
  }

  if (!items.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#d5d7da] bg-white px-4 py-5 text-center">
        <p className="text-sm font-semibold text-[#414651]">
          Your shortlist is empty
        </p>
        <p className="mt-1 text-xs leading-5 text-[#717680]">
          Add suitable products from SAM&apos;s evidence-backed matches.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <ol className="space-y-2">
        {items.map((product, index) => {
          const profileHref = product.profile_href ?? getProductDetailHref(product.product_id)
          return (
          <li
            key={product.product_id}
            draggable
            onDragStart={(event) =>
              event.dataTransfer.setData(
                'text/plain',
                product.product_id,
              )
            }
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const moved = event.dataTransfer.getData('text/plain')
              const source = items.findIndex(
                (item) => item.product_id === moved,
              )
              if (source === -1 || source === index) return
              const next = [...items]
              const [item] = next.splice(source, 1)
              next.splice(index, 0, item)
              onReorder(next.map((entry) => entry.product_id))
            }}
            className="group flex items-center gap-2 rounded-xl border border-[#e9eaeb] bg-white px-2.5 py-2.5"
          >
            <GripVertical
              size={15}
              className="shrink-0 cursor-grab text-[#a4a7ae]"
              aria-hidden
            />
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f2f4f7] text-[11px] font-bold text-[#535862]">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <Link
                href={profileHref}
                className="block truncate text-sm font-semibold text-[#181d27] hover:text-[#155eef]"
              >
                <ProductName product={product} />
              </Link>
              {product.match_score != null ? (
                <p className="text-xs text-[#079455]">
                  {Math.round(product.match_score)}% match
                </p>
              ) : null}
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="flex size-7 items-center justify-center rounded-md text-[#717680] hover:bg-[#f5f8ff] disabled:opacity-30"
              >
                <ChevronUp size={14} aria-hidden />
                <span className="sr-only">
                  Move {product.product_name} up
                </span>
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                className="flex size-7 items-center justify-center rounded-md text-[#717680] hover:bg-[#f5f8ff] disabled:opacity-30"
              >
                <ChevronDown size={14} aria-hidden />
                <span className="sr-only">
                  Move {product.product_name} down
                </span>
              </button>
              <button
                type="button"
                onClick={() => onRemove(product.product_id)}
                className="flex size-7 items-center justify-center rounded-md text-[#a4a7ae] hover:bg-[#fef3f2] hover:text-[#b42318]"
              >
                <X size={14} aria-hidden />
                <span className="sr-only">
                  Remove {product.product_name}
                </span>
              </button>
            </div>
          </li>
          )
        })}
      </ol>
      {items.length >= 2 ? (
        <button
          type="button"
          onClick={() =>
            onCompare(
              items.slice(0, 4).map((product) => product.product_id),
            )
          }
          className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#155eef] px-4 text-sm font-semibold text-white hover:bg-[#0e4cc7]"
        >
          Compare shortlist
          <ArrowUpRight size={15} aria-hidden />
        </button>
      ) : null}
    </div>
  )
}
