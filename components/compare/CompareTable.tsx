'use client'

// components/compare/CompareTable.tsx — comparison table shell
// Ported from the design prototype (table.jsx): toolbar, tabs, desktop matrix, mobile cards.
//
// Chunk C trim: the 'Experts' tab and the entity-type chip in ColumnHeader
// have been removed. Compare is products only.

import React from 'react'
import { Icon, LogoTile, Pill, Btn, NoData } from './CompareUI'
import { buildRows, AltCard, type Row } from './CompareRows'
import { useProductAlternatives } from '@/features/catalog'
import { productAlternativeToCompareAlternative } from '@/lib/compare/from-catalog'
import type { Entity, Tab } from '@/lib/compare/data'

function LiveAlternativesCell({ entity }: { entity: Entity }) {
  const { alternatives, loading, error } = useProductAlternatives({ productId: entity.id, limit: 6 })
  const liveAlternatives = alternatives.map(productAlternativeToCompareAlternative)
  const shownAlternatives = liveAlternatives.length > 0 ? liveAlternatives : entity.alternatives

  if (loading && shownAlternatives.length === 0) {
    return (
      <span className="inline-flex items-center gap-[6px]" style={{ color: '#717680', fontSize: 13 }}>
        <Icon name="loader" size={13} color="#717680" className="animate-spin" />
        Loading alternatives
      </span>
    )
  }

  if ((error && shownAlternatives.length === 0) || shownAlternatives.length === 0) {
    return <NoData />
  }

  return (
    <div className="flex flex-col gap-[8px]">
      {shownAlternatives.map((alternative, index) => (
        <AltCard key={alternative.id ?? alternative.name} alt={alternative} />
      ))}
    </div>
  )
}

function alternativesRows(): Row[] {
  return [
    {
      label: 'Similar options',
      sub: 'Add any to your comparison',
      cell: (e) => <LiveAlternativesCell entity={e} />,
    },
  ]
}

export function getRows(tab: Tab | string): Row[] {
  if (tab === 'Alternatives') return alternativesRows()
  return buildRows(tab)
}

// ---- Results toolbar (save / share / add) --------------------------------
export function ResultsToolbar({
  count, onSave, onShare, onAdd, canAdd, saved,
}: {
  count: number
  onSave: () => void | Promise<void>
  onShare: () => void | Promise<void>
  onAdd: () => void
  canAdd: boolean
  saved: boolean
}) {
  return (
    <div style={{ maxWidth: 1440, margin: '28px auto 0', padding: '0 32px' }}>
      <div className="flex items-center justify-between gap-[14px] flex-wrap">
        <div className="flex items-center gap-[10px]">
          <h2 className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ margin: 0, fontSize: 22, letterSpacing: '-0.01em', color: '#181d27' }}>Detailed comparison</h2>
          <Pill tone="neutral">{count} options</Pill>
        </div>
        <div className="flex items-center gap-[10px]">
          <Btn variant="secondary" size="sm" icon={saved ? 'check' : 'bookmark'} onClick={onSave}>{saved ? 'Saved' : 'Save'}</Btn>
          <Btn variant="secondary" size="sm" icon="share" onClick={onShare}>Share</Btn>
          {canAdd && <Btn variant="secondary" size="sm" icon="plus" onClick={onAdd}>Add option</Btn>}
        </div>
      </div>
    </div>
  )
}

// ---- Tab bar --------------------------------------------------------------
export function TabBar({ tabs, active, onChange }: { tabs: readonly string[]; active: string; onChange: (t: string) => void }) {
  return (
    <div style={{ borderBottom: '1px solid #e9eaeb', background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(8px)' }}>
      <div className="tabbar-scroll flex gap-[4px] overflow-x-auto" style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px' }}>
        {tabs.map((t) => {
          const on = t === active
          return (
            <button
              type="button"
              key={t}
              onClick={() => onChange(t)}
              className="relative cursor-pointer whitespace-nowrap font-[family-name:var(--font-dm-sans)] font-semibold"
              style={{ border: 'none', background: 'transparent', padding: '14px 14px', fontSize: 14.5, color: on ? '#004eeb' : '#717680', transition: 'color 150ms' }}
              onMouseEnter={(e) => { if (!on) e.currentTarget.style.color = '#414651' }}
              onMouseLeave={(e) => { if (!on) e.currentTarget.style.color = '#717680' }}
            >
              {t}
              {on && <span style={{ position: 'absolute', left: 10, right: 10, bottom: -1, height: 2.5, borderRadius: 3, background: '#155eef' }} />}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ---- entity column header card -------------------------------------------
export function ColumnHeader({
  entity, onRemove, canRemove, density,
}: {
  entity: Entity
  onRemove: () => void
  canRemove: boolean
  density: 'compact' | 'regular'
}) {
  return (
    <div className="relative flex flex-col gap-[9px]" style={{ padding: density === 'compact' ? '12px 12px' : '16px 14px' }}>
      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove column"
          className="absolute flex cursor-pointer"
          style={{ top: 8, right: 8, border: 'none', background: 'transparent', padding: 4, borderRadius: 6, color: '#c4c6cb' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#fef3f2'; e.currentTarget.style.color = '#d92d20' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#c4c6cb' }}
        >
          <Icon name="x" size={15} />
        </button>
      )}
      <div className="flex items-center gap-[10px]">
        <LogoTile initial={entity.initial} tone={entity.logoTone} size={40} type={entity.type} logoUrl={entity.logoUrl} />
        <div className="min-w-0" style={{ paddingRight: 18 }}>
          <div className="font-[family-name:var(--font-dm-sans)] font-bold whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: 16, color: '#181d27', letterSpacing: '-0.01em' }}>{entity.name}</div>
          {entity.vendorName && (
            <div className="whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: 12, color: '#717680' }}>{entity.vendorName}</div>
          )}
          <div className="whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontSize: 12, color: '#717680' }}>{entity.category}</div>
        </div>
      </div>
    </div>
  )
}

interface TableProps {
  entities: Entity[]
  tab: string
  tabs: readonly string[]
  onTab: (t: string) => void
  onRemove: (i: number) => void
  density: 'compact' | 'regular'
  highlight?: boolean
  striping?: boolean
}

// ---- DESKTOP matrix -------------------------------------------------------
export function DesktopTable({ entities, tab, tabs, onTab, onRemove, density, highlight = true, striping = true }: TableProps) {
  const rows = getRows(tab)
  const n = entities.length
  const labelCol = 220
  const minProductCol = 260
  const cols = `${labelCol}px repeat(${n}, minmax(${minProductCol}px, 1fr))`
  const minTableWidth = labelCol + (n * minProductCol)
  const rowPadV = density === 'compact' ? '11px' : '16px'
  return (
    <div
      data-testid="comparison-table-frame"
      style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px' }}
    >
      {/* overflow:clip (not hidden) keeps the rounded corners WITHOUT turning the card
          into a scroll container — an overflow:hidden ancestor would break the sticky header. */}
      <div
        data-testid="comparison-table-scroller"
        className="overflow-clip"
        style={{ border: '1px solid #e9eaeb', borderRadius: 16, background: '#fff', boxShadow: 'var(--shadow-sm)' }}
      >
        <div style={{ minWidth: minTableWidth }}>
        {/* sticky tabs + header */}
        <div style={{ position: 'sticky', top: 80, zIndex: 30 }}>
          <TabBar tabs={tabs} active={tab} onChange={onTab} />
          <div
            data-testid="comparison-table-header-grid"
            style={{ display: 'grid', gridTemplateColumns: cols, background: '#fff', borderBottom: '1px solid #e9eaeb' }}
          >
            <div className="flex items-end" style={{ padding: '14px 18px', borderRight: '1px solid #f0f0f0' }}>
              <span className="font-[family-name:var(--font-dm-sans)] font-semibold uppercase" style={{ fontSize: 12, color: '#a4a7ae', letterSpacing: '0.05em' }}>{tab}</span>
            </div>
            {entities.map((e, i) => (
              <div key={e.id} style={{ borderRight: i < n - 1 ? '1px solid #f0f0f0' : 'none' }}>
                <ColumnHeader entity={e} onRemove={() => onRemove(i)} canRemove={n > 1} density={density} />
              </div>
            ))}
          </div>
        </div>
        {/* body rows */}
        <div>
          {rows.map((r, ri) => {
            const bestId = highlight && r.best ? r.best(entities) : null
            if (r.full) {
              return (
                <div key={ri} style={{ padding: '14px 18px', borderTop: '1px solid #f0f0f0', background: '#fafafa' }}>{r.cell(entities[0])}</div>
              )
            }
            return (
              <div key={ri} style={{ display: 'grid', gridTemplateColumns: cols, borderTop: ri === 0 ? 'none' : '1px solid #f0f0f0', background: striping && ri % 2 ? '#fcfcfd' : '#fff' }}>
                <div className="flex flex-col justify-center gap-[2px]" style={{ padding: `${rowPadV} 18px`, borderRight: '1px solid #f0f0f0' }}>
                  <span className="font-[family-name:var(--font-dm-sans)] font-semibold" style={{ fontSize: 13.5, color: '#414651' }}>{r.label}</span>
                  {r.sub && <span style={{ fontSize: 11.5, color: '#a4a7ae' }}>{r.sub}</span>}
                </div>
                {entities.map((e, ci) => {
                  const isBest = bestId === e.id
                  return (
                    <div
                      key={e.id}
                      data-testid="comparison-product-cell"
                      className="relative flex min-w-0 items-center"
                      style={{ padding: `${rowPadV} 16px`, borderRight: ci < n - 1 ? '1px solid #f0f0f0' : 'none', background: isBest ? '#f5f9ff' : r.highlight ? '#fcfcff' : 'transparent' }}
                    >
                      {isBest && <span style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, background: '#155eef' }} />}
                      <div className="min-w-0" style={{ width: '100%' }}>{r.cell(e)}</div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
        </div>
      </div>
      <p className="flex items-center gap-[7px]" style={{ margin: '12px 2px 0', fontSize: 12.5, color: '#a4a7ae' }}>
        <span className="inline-flex" style={{ width: 10, height: 10, borderRadius: 3, background: '#f5f9ff', border: '1px solid #b2ccff' }} />
        Highlighted cells indicate the strongest option for that row.
      </p>
    </div>
  )
}

// ---- MOBILE swipeable cards ----------------------------------------------
export function MobileCards({ entities, tab, tabs, onTab, onRemove, density, highlight = true }: TableProps) {
  const rows = getRows(tab).filter((r) => !r.full)
  const n = entities.length
  return (
    <div>
      <div style={{ position: 'sticky', top: 80, zIndex: 30 }}>
        <TabBar tabs={tabs} active={tab} onChange={onTab} />
      </div>
      <div className="flex items-center gap-[6px] justify-center" style={{ padding: '8px 0 4px', color: '#a4a7ae', fontSize: 12.5 }}>
        <Icon name="swap" size={14} color="#a4a7ae" /> Swipe to compare {n} options
      </div>
      <div className="mobile-swipe flex gap-[14px] overflow-x-auto" style={{ padding: '4px 20px 8px', scrollSnapType: 'x mandatory' }}>
        {entities.map((e, i) => (
          <div
            key={e.id}
            className="overflow-hidden"
            style={{ flex: '0 0 86%', maxWidth: 360, scrollSnapAlign: 'center', border: '1px solid #e9eaeb', borderRadius: 16, background: '#fff', boxShadow: 'var(--shadow-sm)' }}
          >
            <div style={{ borderBottom: '1px solid #f0f0f0' }}>
              <ColumnHeader entity={e} onRemove={() => onRemove(i)} canRemove={n > 1} density={density} />
            </div>
            <div>
              {rows.map((r, ri) => {
                const bestId = highlight && r.best ? r.best(entities) : null
                const isBest = bestId === e.id
                return (
                  <div key={ri} style={{ padding: '12px 14px', borderTop: ri === 0 ? 'none' : '1px solid #f5f5f5', background: isBest ? '#f5f9ff' : '#fff' }}>
                    <div className="flex items-center gap-[6px]" style={{ marginBottom: 6 }}>
                      <span className="font-[family-name:var(--font-dm-sans)] font-semibold uppercase" style={{ fontSize: 12, color: '#a4a7ae', letterSpacing: '0.04em' }}>{r.label}</span>
                      {isBest && <Pill tone="brand" dot>Best</Pill>}
                    </div>
                    <div>{r.cell(e)}</div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
