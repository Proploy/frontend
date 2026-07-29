'use client'

// components/compare/CompareBuilder.tsx — comparison builder header
// Ported from the design prototype (builder.jsx): title, selector columns, CTAs.
//
// Chunk C trim: the TypeSwitch segmented control (product | expert | business)
// has been removed. Compare is products only.

import React from 'react'
import { Icon, LogoTile, Pill, Btn } from './CompareUI'
import type { Entity } from '@/lib/compare/data'

export const MAX_COLS = 4

export interface Column {
  // Chunk C trim: EntityType narrowed to the single literal 'product'. The
  // type tag is kept (rather than deleted outright) to minimise ripple through
  // downstream selectors that still switch on `column.type`.
  type: 'product'
  id: string | null
  entity?: Entity | null
}

export type CatalogOption = Pick<Entity, 'id' | 'type' | 'name' | 'initial' | 'logoTone' | 'category' | 'logoUrl'>

// ---- search dropdown to pick / swap an entity -----------------------------
function SelectorSearch({
  onPick, onClose, current, catalog,
}: {
  onPick: (id: string) => void
  onClose: () => void
  current?: string
  catalog: CatalogOption[]
}) {
  const [q, setQ] = React.useState('')
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const f = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose() }
    document.addEventListener('mousedown', f)
    return () => document.removeEventListener('mousedown', f)
  }, [onClose])
  const results = catalog.filter(
    (e) =>
      q === '' || e.name.toLowerCase().includes(q.toLowerCase()) || e.category.toLowerCase().includes(q.toLowerCase()),
  )
  return (
    <div
      ref={ref}
      className="overflow-hidden"
      style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 40, background: '#fff', border: '1px solid #e9eaeb', borderRadius: 12, boxShadow: 'var(--shadow-xl)' }}
    >
      <div className="flex items-center gap-[8px]" style={{ padding: '10px 12px', borderBottom: '1px solid #f0f0f0' }}>
        <Icon name="search" size={16} color="#717680" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products, category, or need"
          className="flex-1 outline-none border-none bg-transparent"
          style={{ fontSize: 14, color: '#181d27' }}
        />
      </div>
      <div style={{ maxHeight: 244, overflowY: 'auto' }}>
        {results.length === 0 && (
          <div className="italic" style={{ padding: '18px 14px', fontSize: 13.5, color: '#a4a7ae' }}>No matches. Try a different term.</div>
        )}
        {results.map((e) => (
          <button
            type="button"
            key={e.id}
            onClick={() => onPick(e.id)}
            disabled={current === e.id}
            className="flex items-center gap-[11px] w-full text-left"
            style={{ padding: '9px 12px', border: 'none', background: current === e.id ? '#f5f8ff' : 'transparent', cursor: current === e.id ? 'default' : 'pointer' }}
            onMouseEnter={(ev) => { if (current !== e.id) ev.currentTarget.style.background = '#fafafa' }}
            onMouseLeave={(ev) => { ev.currentTarget.style.background = current === e.id ? '#f5f8ff' : 'transparent' }}
          >
            <LogoTile initial={e.initial} tone={e.logoTone} size={32} type={e.type} logoUrl={e.logoUrl} />
            <div className="min-w-0 flex-1">
              <div className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ fontSize: 14, color: '#181d27' }}>{e.name}</div>
              <div style={{ fontSize: 12.5, color: '#717680' }}>{e.category}</div>
            </div>
            {current === e.id && <Pill tone="brand" dot>Selected</Pill>}
          </button>
        ))}
      </div>
    </div>
  )
}

// ---- one selector column in the builder -----------------------------------
function SelectorColumn({
  entity, onSwap, onRemove, canRemove, catalog,
}: {
  entity?: Entity | null
  onSwap: (id: string) => void
  onRemove: () => void
  canRemove: boolean
  catalog: CatalogOption[]
}) {
  const [open, setOpen] = React.useState(false)
  if (!entity) {
    return (
      <div
        className="relative flex flex-col gap-[12px]"
        style={{ border: '1.5px dashed #d5d7da', borderRadius: 14, padding: 14, background: '#fff', minHeight: 150 }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-[9px] w-full cursor-pointer"
          style={{ padding: '10px 12px', border: '1px solid #d5d7da', borderRadius: 8, background: '#fff', boxShadow: 'var(--shadow-xs)', fontSize: 14, color: '#717680' }}
        >
          <Icon name="search" size={16} color="#717680" />
          Search products…
        </button>
        {open && <SelectorSearch catalog={catalog} onPick={(id) => { onSwap(id); setOpen(false) }} onClose={() => setOpen(false)} />}
      </div>
    )
  }
  return (
    <div
      className="relative flex flex-col gap-[10px]"
      style={{ border: '1px solid #e9eaeb', borderRadius: 14, padding: 14, background: '#fff', minHeight: 150, boxShadow: 'var(--shadow-xs)' }}
    >
      <div className="flex items-start justify-between gap-[10px]">
        <LogoTile initial={entity.initial} tone={entity.logoTone} size={58} type={entity.type} logoUrl={entity.logoUrl} />
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label="Remove"
            className="flex cursor-pointer"
            style={{ border: 'none', background: 'transparent', padding: 4, borderRadius: 6, color: '#a4a7ae' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#fef3f2'; e.currentTarget.style.color = '#d92d20' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a4a7ae' }}
          >
            <Icon name="x" size={16} />
          </button>
        )}
      </div>
      <div className="min-w-0">
        <div
          className="font-[family-name:var(--font-dm-sans)] font-bold whitespace-nowrap overflow-hidden text-ellipsis"
          style={{ fontSize: 21, lineHeight: '27px', color: '#181d27', letterSpacing: '-0.02em' }}
        >
          {entity.name}
        </div>
        <div className="whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: 13.5, color: '#717680' }}>{entity.category}</div>
      </div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-[6px] self-start cursor-pointer font-[family-name:var(--font-dm-sans)] font-semibold"
        style={{ padding: '5px 10px', borderRadius: 8, border: '1px solid #d5d7da', background: '#fff', boxShadow: 'var(--shadow-xs)', fontSize: 13, color: '#414651' }}
      >
        <Icon name="swap" size={14} color="#414651" /> Swap
      </button>
      {open && <SelectorSearch current={entity.id} catalog={catalog} onPick={(id) => { onSwap(id); setOpen(false) }} onClose={() => setOpen(false)} />}
    </div>
  )
}

export function Builder({
  columns, onSwap, onRemove, onAdd, onCompare, onMatched,
  catalog = [],
}: {
  columns: Column[]
  onSwap: (i: number, id: string) => void
  onRemove: (i: number) => void
  onAdd: () => void
  onCompare: () => void
  onMatched: () => void | Promise<void>
  catalog?: CatalogOption[]
}) {
  const tooMany = columns.length >= MAX_COLS
  return (
    <section style={{ background: 'linear-gradient(180deg,#f5f8ff 0%, #ffffff 100%)', borderBottom: '1px solid #e9eaeb', paddingTop: 40, paddingBottom: 28 }}>
      <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px' }}>
        <div className="flex items-end justify-between gap-[24px] flex-wrap" style={{ marginBottom: 22 }}>
          <div style={{ maxWidth: 640 }}>
            <div className="inline-flex items-center gap-[7px]" style={{ marginBottom: 10 }}>
              <Pill tone="brand" icon="sparkle">Buyer-first comparison</Pill>
            </div>
            <h1 className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ margin: 0, fontSize: 36, lineHeight: '44px', letterSpacing: '-0.72px', color: '#181d27' }}>
              Compare software
            </h1>
            <p style={{ margin: '10px 0 0', fontSize: 17, lineHeight: '26px', color: '#535862', maxWidth: 560 }}>
              See not just which tool scores best, but which one your team can actually deploy — with the right people to roll it out.
            </p>
          </div>
          <div className="flex gap-[10px] flex-wrap">
            <Btn variant="secondary" icon="users" onClick={onMatched}>Get matched instead</Btn>
            <Btn variant="primary" icon="sliders" onClick={onCompare}>Compare now</Btn>
          </div>
        </div>

        {/* selector row */}
        <div
          className="builder-grid items-stretch"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))${tooMany ? '' : ' minmax(220px, 0.8fr)'}`, gap: 14 }}
        >
          {columns.map((c, i) => (
            <SelectorColumn
              key={i}
              entity={c.entity}
              onSwap={(id) => onSwap(i, id)}
              onRemove={() => onRemove(i)}
              canRemove={columns.length > 1}
              catalog={catalog}
            />
          ))}
          {!tooMany && (
            <button
              type="button"
              onClick={onAdd}
              className="flex flex-col items-center justify-center gap-[8px] cursor-pointer"
              style={{ border: '1.5px dashed #b2ccff', borderRadius: 14, background: '#f5f8ff', minHeight: 158, color: '#004eeb' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#eff4ff')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f8ff')}
            >
              <span className="flex items-center justify-center" style={{ width: 36, height: 36, borderRadius: 9999, background: '#fff', border: '1px solid #b2ccff', boxShadow: 'var(--shadow-xs)' }}>
                <Icon name="plus" size={18} color="#155eef" />
              </span>
              <span className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ fontSize: 14 }}>Add comparison</span>
            </button>
          )}
        </div>

        {tooMany && (
          <div className="inline-flex items-center gap-[8px] font-[family-name:var(--font-dm-sans)] font-medium" style={{ marginTop: 10, padding: '7px 12px', borderRadius: 8, background: '#fffaeb', border: '1px solid #fec84b', color: '#b54708', fontSize: 13.5 }}>
            <Icon name="alert" size={15} color="#dc6803" /> You can compare up to {MAX_COLS} options at once. Remove one to add another.
          </div>
        )}

      </div>
    </section>
  )
}
