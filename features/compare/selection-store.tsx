'use client'

// features/compare/selection-store.tsx — browser-persistent product comparison selection.
// Holds the lightweight set of products a buyer has marked to compare (id + name + logo;
// full detail is fetched on the /compare page). Persisted to localStorage so the selection
// and the floating tray survive navigation and reloads. Mounted once in app/layout.tsx.

import React from 'react'

export const MAX_COMPARE = 4
const STORAGE_KEY = 'proploy:compare:v1'

export interface SelectedProduct {
  product_id: string
  product_name: string
  product_logo: string | null
}

interface CompareSelectionValue {
  items: SelectedProduct[]
  count: number
  isFull: boolean
  isSelected: (productId: string) => boolean
  toggle: (product: SelectedProduct) => void
  remove: (productId: string) => void
  clear: () => void
}

const CompareSelectionContext = React.createContext<CompareSelectionValue | null>(null)

function readStorage(): SelectedProduct[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((p): p is SelectedProduct => !!p && typeof p.product_id === 'string' && typeof p.product_name === 'string')
      .slice(0, MAX_COMPARE)
      .map((p) => ({ product_id: p.product_id, product_name: p.product_name, product_logo: p.product_logo ?? null }))
  } catch {
    return []
  }
}

export function CompareSelectionProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<SelectedProduct[]>([])
  const [hydrated, setHydrated] = React.useState(false)

  // Hydrate after mount to avoid an SSR/client mismatch (mirrors app/experts/chat).
  React.useEffect(() => {
    setItems(readStorage())
    setHydrated(true)
  }, [])

  // Persist on every change once hydrated (so we never overwrite storage with the empty initial state).
  React.useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* quota / private mode — selection still works for the session */
    }
  }, [items, hydrated])

  const value = React.useMemo<CompareSelectionValue>(() => {
    const isSelected = (productId: string) => items.some((p) => p.product_id === productId)
    return {
      items,
      count: items.length,
      isFull: items.length >= MAX_COMPARE,
      isSelected,
      toggle: (product) =>
        setItems((prev) => {
          if (prev.some((p) => p.product_id === product.product_id)) {
            return prev.filter((p) => p.product_id !== product.product_id)
          }
          if (prev.length >= MAX_COMPARE) return prev
          return [...prev, product]
        }),
      remove: (productId) => setItems((prev) => prev.filter((p) => p.product_id !== productId)),
      clear: () => setItems([]),
    }
  }, [items])

  return <CompareSelectionContext.Provider value={value}>{children}</CompareSelectionContext.Provider>
}

export function useCompareSelection(): CompareSelectionValue {
  const ctx = React.useContext(CompareSelectionContext)
  if (!ctx) throw new Error('useCompareSelection must be used within a CompareSelectionProvider')
  return ctx
}
