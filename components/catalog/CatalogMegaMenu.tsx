'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import {
  useCategoryRoots,
  type CategoryNode,
} from '@/features/catalog'

interface CatalogMegaMenuProps {
  mobile?: boolean
  onNavigate?: () => void
}

export default function CatalogMegaMenu({
  mobile = false,
  onNavigate,
}: CatalogMegaMenuProps) {
  const { tree: roots, loading: categoriesLoading, error: categoriesError } = useCategoryRoots()
  const [activeRootId, setActiveRootId] = useState<string | null>(null)
  const [expandedRootId, setExpandedRootId] = useState<string | null>(null)

  const activeRoot = useMemo(
    () => roots.find((root) => root.term_id === activeRootId) ?? roots[0] ?? null,
    [activeRootId, roots],
  )
  const selectRoot = (root: CategoryNode) => {
    setActiveRootId(root.term_id)
  }

  if (mobile) {
    return (
      <div className="flex flex-col gap-[8px]">
        {categoriesLoading ? (
          <div className="flex items-center gap-[8px] px-[12px] py-[16px] text-[14px] text-[#717680]">
            <Loader2 size={16} className="animate-spin" />
            Loading categories
          </div>
        ) : categoriesError ? (
          <p className="px-[12px] py-[12px] text-[14px] text-[#b42318]">Categories are temporarily unavailable.</p>
        ) : (
          roots.map((root) => {
            const expanded = expandedRootId === root.term_id
            return (
              <div key={root.term_id} className="overflow-hidden rounded-[10px] border border-[#e9eaeb]">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => {
                    setExpandedRootId(expanded ? null : root.term_id)
                    selectRoot(root)
                  }}
                  className="flex w-full items-center gap-[12px] bg-white px-[14px] py-[12px] text-left"
                >
                  <span>
                    <span className="block text-[15px] font-semibold text-[#181d27]">{root.label}</span>
                  </span>
                </button>

                {expanded && (
                  <div className="border-t border-[#e9eaeb] bg-[#fafafa] p-[8px]">
                    {root.children.map((child) => (
                      <Link
                        key={child.term_id}
                        href={`/products?category=${encodeURIComponent(child.term_id)}`}
                        onClick={onNavigate}
                        className="flex items-start rounded-[8px] px-[10px] py-[9px] text-[#414651] hover:bg-white hover:text-[#004eeb]"
                      >
                        <span>
                          <span className="block text-[14px] font-medium">{child.label}</span>
                          {child.description && (
                            <span className="mt-[2px] line-clamp-2 block text-[11px] leading-[16px] text-[#717680]">
                              {child.description}
                            </span>
                          )}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    )
  }

  return (
    <div className="grid h-[min(560px,calc(100vh-112px))] min-h-[360px] grid-cols-[260px_minmax(0,1fr)] overflow-hidden rounded-[18px] border border-[#e9eaeb] bg-white shadow-[0_24px_48px_-12px_rgba(10,13,18,0.2)]">
      <div className="flex min-h-0 flex-col border-r border-[#e9eaeb] bg-[#f7f9fc]">
        <div className="min-h-0 flex-1 overflow-y-auto p-[10px]">
          {categoriesLoading ? (
            <div className="flex items-center gap-[8px] px-[10px] py-[16px] text-[14px] text-[#717680]">
              <Loader2 size={16} className="animate-spin" />
              Loading categories
            </div>
          ) : categoriesError ? (
            <p className="px-[10px] py-[12px] text-[14px] text-[#b42318]">Categories are temporarily unavailable.</p>
          ) : (
            roots.map((root) => {
              const active = root.term_id === activeRoot?.term_id
              return (
                <button
                  key={root.term_id}
                  type="button"
                  onMouseEnter={() => selectRoot(root)}
                  onFocus={() => selectRoot(root)}
                  onClick={() => selectRoot(root)}
                  className={`mb-[4px] flex w-full items-center rounded-[10px] px-[12px] py-[11px] text-left transition-colors ${
                    active ? 'bg-[#155eef] text-white' : 'text-[#414651] hover:bg-white'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold">{root.label}</span>
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto p-[18px]">
          {activeRoot?.children.length === 0 ? (
            <p className="rounded-[12px] border border-dashed border-[#d5d7da] bg-[#fafafa] px-[18px] py-[24px] text-[13px] text-[#717680]">
              No subcategories are published for this category yet.
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-[10px] xl:grid-cols-3">
          {activeRoot?.children.map((child) => {
            return (
              <Link
                key={child.term_id}
                href={`/products?category=${encodeURIComponent(child.term_id)}`}
                onClick={onNavigate}
                className="group flex min-h-[112px] flex-col rounded-[12px] border border-[#e9eaeb] bg-white px-[14px] py-[13px] text-left transition-colors hover:border-[#b2ccff] hover:bg-[#f9fbff]"
              >
                <span className="flex items-start justify-between gap-[12px]">
                  <span className="text-[14px] font-semibold leading-[20px] text-[#181d27] group-hover:text-[#004eeb]">{child.label}</span>
                </span>
                {child.description && (
                  <span className="mt-[3px] line-clamp-2 block text-[12px] leading-[17px] text-[#717680]">
                    {child.description}
                  </span>
                )}
                <span className="mt-auto pt-[10px] text-[11px] font-semibold text-[#004eeb]">
                  Explore products
                </span>
              </Link>
            )
          })}
          </div>
        </div>
      </div>
    </div>
  )
}
