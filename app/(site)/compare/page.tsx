'use client'

// app/compare/page.tsx — public product comparison page.
// The comparison is driven by selected live catalog product ids in the query
// string. With no query the page starts empty; it never falls back to
// prototype entities.
// The global Navbar (app/layout.tsx) sits above this page.
//
// Chunk C trim: products only. The previous 'expert' and 'business' entity
// types have been removed, so the column type is always 'product' and the
// onType / mixedTypes props are gone.

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Footer from '@/components/Footer'
import { Builder, MAX_COLS, type CatalogOption, type Column } from '@/components/compare/CompareBuilder'
import { BuyerBrief } from '@/components/compare/BuyerBrief'
import { DesktopTable, MobileCards, ResultsToolbar } from '@/components/compare/CompareTable'
import {
  ActionToast,
  EmptyState,
  LoadingTable,
  MatchedExpertsModal,
  MobileActionBar,
  OneItemNudge,
  ShareComparisonModal,
  type ActionToastState,
} from '@/components/compare/CompareSections'
import { useCompareEntities } from '@/features/compare/use-compare-entities'
import { compareApi, type CompareMatchedExpert } from '@/features/compare/client-api'
import { useProductList } from '@/features/catalog'
import { saveAiReport } from '@/features/users'
import {
  TABS,
  type Entity,
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

function seedColumns(productIds: string[]): Column[] {
  return productIds.map((id) => ({ type: 'product', id }))
}

function ComparePageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productIds = React.useMemo(() => {
    const raw = searchParams.get('products')
    return raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : []
  }, [searchParams])
  const idsKey = productIds.join(',')

  const { products: catalogProducts } = useProductList({ limit: 100, sort: 'name' })

  const [columns, setColumns] = React.useState<Column[]>(() => seedColumns(productIds))
  const [tab, setTab] = React.useState<string>('At a glance')
  const [view, setView] = React.useState<'normal' | 'loading'>('normal')
  const [saved, setSaved] = React.useState(false)
  const [toast, setToast] = React.useState<ActionToastState | null>(null)
  const [shareOpen, setShareOpen] = React.useState(false)
  const [matchedOpen, setMatchedOpen] = React.useState(false)
  const [matchedLoading, setMatchedLoading] = React.useState(false)
  const [matchedError, setMatchedError] = React.useState<string | null>(null)
  const [matchedExperts, setMatchedExperts] = React.useState<CompareMatchedExpert[]>([])
  const isMobile = useMediaQuery('(max-width: 860px)')

  const selectedProductIds = React.useMemo(
    () => columns.map((column) => column.id).filter((id): id is string => Boolean(id)).slice(0, MAX_COLS),
    [columns],
  )
  const compareHref = selectedProductIds.length > 0
    ? `/compare?products=${selectedProductIds.map((id) => encodeURIComponent(id)).join(',')}`
    : '/compare'

  const { byId: realById, loading: realLoading } =
    useCompareEntities(selectedProductIds)

  // Reset the columns whenever the incoming product set changes (e.g. the tray
  // navigates here again with a different selection on the same route).
  const prevKey = React.useRef(idsKey)
  React.useEffect(() => {
    if (prevKey.current !== idsKey) {
      prevKey.current = idsKey
      setColumns(seedColumns(productIds))
      setTab('At a glance')
      setSaved(false)
      setToast(null)
      setShareOpen(false)
      setMatchedOpen(false)
    }
  }, [idsKey, productIds])

  // Resolve only to the service-backed entity map. Missing data stays empty
  // instead of being replaced by a prototype product.
  const resolveEntity = React.useCallback(
    (id: string): Entity | undefined => realById[id],
    [realById],
  )

  // Search the same published catalog endpoint as the product grid. Picking
  // an option then loads its full live detail through useCompareEntities.
  const catalog = React.useMemo<CatalogOption[]>(() => catalogProducts.map((product) => ({
    id: product.product_id,
    type: 'product',
    name: product.product_name,
    initial: product.product_name.charAt(0).toUpperCase() || 'P',
    logoTone: 'brand',
    category: product.primary_category ?? 'Software',
    logoUrl: product.product_logo,
  })), [catalogProducts])

  const filled = columns.map((c) => (c.id ? resolveEntity(c.id) : null)).filter((e): e is Entity => !!e)
  const builderColumns: Column[] = columns.map((c) => ({ ...c, entity: c.id ? resolveEntity(c.id) ?? null : null }))

  // Selected products are still being fetched and nothing has resolved yet.
  const fetchPending = selectedProductIds.length > 0 && realLoading

  // --- builder editing (always returns to a live comparison) ---
  const edit = (next: Column[]) => {
    setColumns(next)
    setView('normal')
    setSaved(false)
  }
  const onSwap = (i: number, id: string) =>
    edit(columns.map((c, idx) => (idx === i ? { type: 'product', id } : c)))
  const onRemove = (i: number) => edit(columns.filter((_, idx) => idx !== i))
  const onAdd = () => { if (columns.length < MAX_COLS) edit([...columns, { type: 'product', id: null }]) }

  const doSave = async () => {
    if (filled.length < 2) {
      setToast({ tone: 'info', title: 'Add two products first', body: 'A saved comparison needs at least two selected products.' })
      return
    }
    const names = filled.map((entity) => entity.name)
    const result = await saveAiReport({
      title: `Comparison: ${names.join(' vs ')}`,
      summary: `Compared ${names.length} products: ${names.join(', ')}.`,
      profile: {
        type: 'comparison',
        productIds: selectedProductIds,
        url: compareHref,
      },
      recommendations: filled.map((entity, index) => ({
        rank: index + 1,
        product_id: entity.id,
        name: entity.name,
      })),
      document: {
        type: 'comparison',
        url: compareHref,
        productIds: selectedProductIds,
        products: filled.map((entity) => ({
          product_id: entity.id,
          name: entity.name,
          logo_url: entity.logoUrl,
        })),
      },
    })
    if (result.ok) {
      setSaved(true)
      setToast({ tone: 'success', title: 'Comparison saved', body: 'Find it under Saved comparisons in your account.' })
    } else {
      setToast({ tone: 'error', title: 'Could not save comparison', body: result.error.message })
    }
  }

  const doShare = () => {
    if (selectedProductIds.length < 2) {
      setToast({ tone: 'info', title: 'Add two products first', body: 'The share link reflects the selected comparison products.' })
      return
    }
    setShareOpen(true)
  }

  const openMatchedExperts = async () => {
    if (selectedProductIds.length === 0) {
      setToast({ tone: 'info', title: 'Add products first', body: 'Matched experts are based on the products in your comparison.' })
      return
    }
    setMatchedOpen(true)
    setMatchedLoading(true)
    setMatchedError(null)
    setMatchedExperts([])
    const result = await compareApi.getMatchedExperts({ product_ids: selectedProductIds, limit: 12 })
    if (result.ok) {
      setMatchedExperts(result.data.experts)
    } else {
      setMatchedError(result.error.message)
    }
    setMatchedLoading(false)
  }

  const onCompare = () => {
    if (selectedProductIds.length < 2) {
      setToast({ tone: 'info', title: 'Add one more product', body: 'Choose at least two products before comparing.' })
      return
    }
    setView('normal')
    router.replace(compareHref, { scroll: false })
  }

  const count = filled.length

  const renderResults = () => {
    if (view === 'loading' || fetchPending) return <LoadingTable count={columns.length} />
    if (count === 0) return <EmptyState onAdd={onAdd} onMatched={openMatchedExperts} />
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
        onSwap={onSwap}
        onRemove={onRemove}
        onAdd={onAdd}
        onCompare={onCompare}
        onMatched={openMatchedExperts}
        catalog={catalog}
      />

      <div style={{ paddingBottom: 8 }}>{renderResults()}</div>

      <div style={{ marginTop: 64 }}>
        <Footer />
      </div>

      <ActionToast show={!!toast} toast={toast} onClose={() => setToast(null)} />
      <ShareComparisonModal
        open={shareOpen}
        url={compareHref}
        onClose={() => setShareOpen(false)}
        onCopied={() => setToast({ tone: 'info', title: 'Share link copied', body: 'Anyone with the link can view this comparison.' })}
      />
      <MatchedExpertsModal
        open={matchedOpen}
        loading={matchedLoading}
        error={matchedError}
        experts={matchedExperts}
        onClose={() => setMatchedOpen(false)}
      />
      <MobileActionBar onAdd={onAdd} onSave={doSave} onMatched={openMatchedExperts} saved={saved} />
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <ComparePageInner />
    </Suspense>
  )
}
