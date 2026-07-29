'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ChevronRight,
  ListFilter,
  Loader2,
} from 'lucide-react'
import type { CategoryNode } from '@/features/catalog'

export function ProductCategoryDropdown({
  categoryTree,
  loading,
  error,
  selectedTermId,
  label,
  onSelect,
}: {
  categoryTree: CategoryNode[]
  loading: boolean
  error: boolean
  selectedTermId: string
  label: string
  onSelect: (termId: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [openPath, setOpenPath] = useState<string[]>([])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setOpenPath([])
        containerRef.current
          ?.querySelector<HTMLButtonElement>(
            'button[data-category-trigger="true"]',
          )
          ?.focus()
      }
    }
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setOpenPath([])
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [open])

  const choose = (termId: string) => {
    onSelect(termId)
    setOpen(false)
    setOpenPath([])
  }

  return (
    <div
      ref={containerRef}
      className="relative w-[200px]"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => {
        setOpen(false)
        setOpenPath([])
      }}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget as Node | null,
          )
        ) {
          setOpen(false)
          setOpenPath([])
        }
      }}
    >
      <button
        type="button"
        data-category-trigger="true"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
      >
        <ListFilter size={20} className="shrink-0 text-[#717680]" />
        <span className="min-w-0 flex-1 truncate text-left text-[16px] font-normal leading-[24px] text-[#717680]">
          {label}
        </span>
      </button>

      <div
        aria-label="Product categories"
        className={`before:content-[''] before:absolute before:-top-[8px] before:left-0 before:h-[8px] before:w-full absolute left-0 top-[calc(100%+8px)] z-50 w-[min(280px,calc(100vw-32px))] rounded-[12px] border border-[#e9eaeb] bg-white p-[6px] shadow-[0_20px_40px_-12px_rgba(10,13,18,0.22)] transition lg:w-[560px] ${
          open
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        <button
          type="button"
          aria-pressed={selectedTermId === ''}
          onClick={() => choose('')}
          className={`flex w-full items-center justify-between rounded-[8px] px-[10px] py-[9px] text-left text-[14px] ${
            selectedTermId === ''
              ? 'bg-[#eff4ff] font-semibold text-[#004eeb]'
              : 'text-[#414651] hover:bg-[#f5f8ff]'
          }`}
        >
          All categories
        </button>

        <div className="my-[5px] border-t border-[#e9eaeb]" />
        {loading ? (
          <p className="flex items-center gap-2 px-[10px] py-[12px] text-[13px] text-[#717680]">
            <Loader2 size={15} className="animate-spin" />
            Loading categories
          </p>
        ) : error ? (
          <p className="px-[10px] py-[12px] text-[13px] leading-5 text-[#b42318]">
            Categories are temporarily unavailable.
          </p>
        ) : (
          <CategoryMenuLevel
            nodes={categoryTree}
            level={0}
            rootGrid
            openPath={openPath}
            selectedTermId={selectedTermId}
            onOpenPath={setOpenPath}
            onSelect={choose}
          />
        )}
      </div>
    </div>
  )
}

function CategoryMenuLevel({
  nodes,
  level,
  rootGrid = false,
  openPath,
  selectedTermId,
  onOpenPath,
  onSelect,
}: {
  nodes: CategoryNode[]
  level: number
  rootGrid?: boolean
  openPath: string[]
  selectedTermId: string
  onOpenPath: (path: string[]) => void
  onSelect: (termId: string) => void
}) {
  return (
    <div
      data-testid={rootGrid ? 'product-category-root-grid' : undefined}
      className={rootGrid ? 'grid grid-cols-1 lg:grid-cols-2 lg:gap-x-[6px]' : ''}
    >
      {nodes.map((node) => {
        const hasChildren = node.children.length > 0
        const submenuOpen = openPath[level] === node.term_id
        const selectable = node.taxonomy_type !== 'ui_category'
        return (
          <div
            key={node.term_id}
            className="relative"
            onMouseEnter={() =>
              hasChildren
                ? onOpenPath([
                    ...openPath.slice(0, level),
                    node.term_id,
                  ])
                : onOpenPath(openPath.slice(0, level))
            }
          >
            <button
              type="button"
              aria-pressed={
                selectable
                  ? selectedTermId === node.term_id
                  : undefined
              }
              aria-expanded={hasChildren ? submenuOpen : undefined}
              onFocus={() => {
                if (hasChildren) {
                  onOpenPath([
                    ...openPath.slice(0, level),
                    node.term_id,
                  ])
                }
              }}
              onClick={() => {
                if (selectable) {
                  onSelect(node.term_id)
                } else if (hasChildren) {
                  onOpenPath([
                    ...openPath.slice(0, level),
                    node.term_id,
                  ])
                }
              }}
              className={`flex w-full items-center gap-[8px] rounded-[8px] px-[10px] py-[9px] text-left text-[14px] ${
                selectedTermId === node.term_id
                  ? 'bg-[#eff4ff] font-semibold text-[#004eeb]'
                  : submenuOpen
                    ? 'bg-[#f5f8ff] text-[#181d27]'
                    : 'text-[#414651] hover:bg-[#f5f8ff]'
              }`}
            >
              <span className="min-w-0 flex-1 truncate">
                {node.label}
              </span>
              {selectable ? (
                <span className="text-[11px] text-[#717680]">
                  {node.product_count}
                </span>
              ) : null}
              {hasChildren ? (
                <ChevronRight
                  size={14}
                  className="shrink-0 text-[#717680]"
                />
              ) : null}
            </button>

            {hasChildren ? (
              <div
                aria-label={`${node.label} subcategories`}
                className={`static mt-1 w-full rounded-[8px] border-0 bg-white pl-[12px] shadow-none lg:absolute lg:left-full lg:top-[-6px] lg:z-10 lg:mt-0 lg:w-[280px] lg:rounded-[12px] lg:border lg:border-[#e9eaeb] lg:p-[6px] lg:shadow-[0_20px_40px_-12px_rgba(10,13,18,0.22)] ${
                  submenuOpen ? 'block' : 'hidden'
                }`}
              >
                <CategoryMenuLevel
                  nodes={node.children}
                  level={level + 1}
                  rootGrid={false}
                  openPath={openPath}
                  selectedTermId={selectedTermId}
                  onOpenPath={onOpenPath}
                  onSelect={onSelect}
                />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
