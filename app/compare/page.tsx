'use client'

// app/compare/page.tsx — public software/expert/vendor comparison page.
// Ported from the Claude Design prototype (app.jsx). The global Navbar (app/layout.tsx)
// sits above this page; the prototype's own Navbar/Footer and design-tool affordances
// (TweaksPanel, "Preview states" switcher) are intentionally dropped.

import React from 'react'
import Footer from '@/components/Footer'
import { Builder, MAX_COLS, type Column } from '@/components/compare/CompareBuilder'
import { BuyerBrief } from '@/components/compare/BuyerBrief'
import { DesktopTable, MobileCards, ResultsToolbar } from '@/components/compare/CompareTable'
import {
  Discussion, EmptyState, OneItemNudge, LoadingTable, SavedToast, MobileActionBar,
} from '@/components/compare/CompareSections'
import {
  ENTITIES, TABS, BUYER_CONTEXT, type EntityType, type Filters,
} from '@/lib/compare/data'

function useMediaQuery(q: string) {
  const [m, setM] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia(q)
    setM(mq.matches)
    const fn = (e: MediaQueryListEvent) => setM(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [q])
  return m
}

// Fixed tweak defaults (the prototype's design-time Tweaks panel is not shipped).
const DENSITY: 'compact' | 'regular' = 'regular'
const HIGHLIGHT_BEST = true
const ROW_STRIPING = true
const SHOW_BRIEF = true

const DEFAULT_COLUMNS: Column[] = [
  { type: 'product', id: 'monday' },
  { type: 'product', id: 'asana' },
]

export default function ComparePage() {
  const [columns, setColumns] = React.useState<Column[]>(DEFAULT_COLUMNS)
  const [filters, setFilters] = React.useState<Filters>({ ...BUYER_CONTEXT })
  const [tab, setTab] = React.useState<string>('At a glance')
  const [view, setView] = React.useState<'normal' | 'loading'>('normal')
  const [saved, setSaved] = React.useState(false)
  const [toast, setToast] = React.useState<'saved' | 'share' | null>(null)
  const isMobile = useMediaQuery('(max-width: 860px)')

  const filled = columns.filter((c) => c.id).map((c) => ENTITIES[c.id as string])
  const builderColumns: Column[] = columns.map((c) => ({ ...c, entity: c.id ? ENTITIES[c.id] : null }))
  const types: EntityType[] = columns.map((c) => (c.id ? ENTITIES[c.id].type : c.type))
  const distinctTypes = new Set(filled.map((e) => e.type))
  const mixedTypes = distinctTypes.size > 1

  // --- builder editing (always returns to a live comparison) ---
  const edit = (next: Column[]) => { setColumns(next); setView('normal') }
  const onType = (i: number, tp: EntityType) => edit(columns.map((c, idx) => (idx === i ? { type: tp, id: null } : c)))
  const onSwap = (i: number, id: string) => edit(columns.map((c, idx) => (idx === i ? { type: ENTITIES[id].type, id } : c)))
  const onRemove = (i: number) => edit(columns.filter((_, idx) => idx !== i))
  const onAdd = () => { if (columns.length < MAX_COLS) edit([...columns, { type: 'product', id: null }]) }

  const doSave = () => { setSaved(true); setToast('saved') }
  const doShare = () => setToast('share')
  const onCompare = () => { setView('loading'); window.setTimeout(() => setView('normal'), 1100) }

  const count = filled.length

  const renderResults = () => {
    if (view === 'loading') return <LoadingTable count={columns.length} />
    if (count === 0) return <EmptyState onAdd={onAdd} />
    const Table = isMobile ? MobileCards : DesktopTable
    if (count === 1) {
      return (
        <>
          <OneItemNudge onAdd={onAdd} />
          <Table entities={filled} tab={tab} tabs={TABS} onTab={setTab} onRemove={onRemove} density={DENSITY} highlight={HIGHLIGHT_BEST} striping={ROW_STRIPING} />
        </>
      )
    }
    return (
      <>
        {SHOW_BRIEF && <BuyerBrief entities={filled} loading={false} />}
        <ResultsToolbar count={count} onSave={doSave} onShare={doShare} onAdd={onAdd} canAdd={columns.length < MAX_COLS} saved={saved} />
        <div style={{ marginTop: 16 }}>
          <Table entities={filled} tab={tab} tabs={TABS} onTab={setTab} onRemove={onRemove} density={DENSITY} highlight={HIGHLIGHT_BEST} striping={ROW_STRIPING} />
        </div>
      </>
    )
  }

  return (
    <div
      className="font-[family-name:var(--font-dm-sans)]"
      style={{ minHeight: '100vh', background: '#fff', paddingTop: 80, paddingBottom: isMobile ? 88 : 72 }}
    >
      <Builder
        columns={builderColumns}
        types={types}
        filters={filters}
        setFilters={setFilters}
        onType={onType}
        onSwap={onSwap}
        onRemove={onRemove}
        onAdd={onAdd}
        onCompare={onCompare}
        onMatched={() => setToast('saved')}
        mixedTypes={mixedTypes && view !== 'loading'}
      />

      <div style={{ paddingBottom: 8 }}>{renderResults()}</div>

      {count >= 1 && view !== 'loading' && <Discussion />}

      <div style={{ marginTop: 64 }}>
        <Footer />
      </div>

      <SavedToast show={!!toast} kind={toast || 'saved'} onClose={() => setToast(null)} />
      <MobileActionBar onAdd={onAdd} onSave={doSave} onMatched={() => setToast('saved')} saved={saved} />
    </div>
  )
}
