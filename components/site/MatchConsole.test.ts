import fs from 'node:fs'
import path from 'node:path'

import {
  MIN_QUERY_LENGTH,
  isTypeThroughKey,
  ratingToBarWidth,
  resultNote,
} from './MatchConsole'
import type { CardProduct } from '@/features/catalog'

function readSource(file: string) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8')
}

function product(overrides: Partial<CardProduct> = {}): CardProduct {
  return {
    product_id: 'p1',
    product_name: 'Gusto',
    product_description: null,
    product_logo: null,
    rating: null,
    reviews: null,
    primary_category: 'Payroll',
    vendor_name: null,
    free_plan_available: false,
    free_trial_available: false,
    ...overrides,
  }
}

describe('ratingToBarWidth', () => {
  it('reads a 0–5 rating as a share of the track', () => {
    expect(ratingToBarWidth(5)).toBe(100)
    expect(ratingToBarWidth(4)).toBe(80)
    expect(ratingToBarWidth(0)).toBe(0)
  })

  it('collapses the bar for unrated products instead of inventing a score', () => {
    expect(ratingToBarWidth(null)).toBe(0)
    expect(ratingToBarWidth(Number.NaN)).toBe(0)
  })

  it('clamps ratings that fall outside the documented range', () => {
    expect(ratingToBarWidth(7)).toBe(100)
    expect(ratingToBarWidth(-2)).toBe(0)
  })
})

describe('resultNote', () => {
  it('prefers the catalog description', () => {
    expect(resultNote(product({ product_description: 'Cloud-based payroll.' })))
      .toBe('Cloud-based payroll.')
  })

  it('drops a vendor that just restates the product name', () => {
    // The catalog stores "Odoo" / "Odoo S.A.", which read as a duplicate line.
    expect(resultNote(product({ product_name: 'Odoo', vendor_name: 'Odoo S.A.' })))
      .toBe('Vetted implementers available')
  })

  it('keeps a vendor that adds information, with real plan and review signal', () => {
    expect(
      resultNote(
        product({
          product_name: 'Dynamics 365',
          vendor_name: 'Microsoft',
          free_trial_available: true,
          reviews: 1234,
        }),
      ),
    ).toBe('Microsoft · Free trial · 1,234 reviews')
  })

  it('never leaves the line empty', () => {
    expect(resultNote(product())).toBe('Vetted implementers available')
  })
})

describe('isTypeThroughKey', () => {
  const bare = { ctrlKey: false, metaKey: false, altKey: false }

  it('accepts printable characters so hovering then typing just works', () => {
    expect(isTypeThroughKey('a', bare)).toBe(true)
    expect(isTypeThroughKey('7', bare)).toBe(true)
  })

  it('ignores space, so the page can still be scrolled from a hover', () => {
    expect(isTypeThroughKey(' ', bare)).toBe(false)
  })

  it('ignores navigation and control keys', () => {
    expect(isTypeThroughKey('Tab', bare)).toBe(false)
    expect(isTypeThroughKey('ArrowDown', bare)).toBe(false)
    expect(isTypeThroughKey('Escape', bare)).toBe(false)
  })

  it('leaves browser shortcuts alone', () => {
    expect(isTypeThroughKey('r', { ...bare, metaKey: true })).toBe(false)
    expect(isTypeThroughKey('c', { ...bare, ctrlKey: true })).toBe(false)
  })
})

describe('MatchConsole interaction contract', () => {
  const source = readSource('components/site/MatchConsole.tsx')

  it('searches the real catalog rather than the demo fixtures', () => {
    expect(source).toContain('useProductList')
    expect(source).toContain('getProductDetailHref')
  })

  it('only queries the catalog once a real query exists', () => {
    // LiveResults owns the hook and is mounted behind `hasQuery`, so an idle
    // hero never calls the backend.
    expect(source).toContain('hasQuery ? (')
    expect(MIN_QUERY_LENGTH).toBeGreaterThan(1)
  })

  it('stops the idle animations once live', () => {
    // The scan beam is unmounted and the pulsing dot goes solid in live mode.
    expect(source).toContain('{!live && (')
    expect(source).toContain('${live ? "" : "pulse-dot"}')
    // The demo typing reel bails out instead of running behind the real input.
    expect(source).toContain('if (live) return;')
  })

  it('debounces keystrokes before they reach the catalog', () => {
    expect(source).toContain('DEBOUNCE_MS')
    expect(source).toContain('setTimeout(() => setDebouncedQuery(trimmed), DEBOUNCE_MS)')
  })

  it('reserves the demo reel footprint in every body state', () => {
    // Activating used to collapse the card under the pointer, because the
    // suggestion/loading/empty states are shorter than three result rows.
    const bodyStates = source.match(/BODY_MIN_H/g) ?? []
    // One definition plus demo list, suggestions, skeletons, error, empty, results.
    expect(bodyStates.length).toBe(7)
    // Skeleton rows must match a real row exactly, or loading shifts the card.
    expect(source).toContain('className="h-32 animate-pulse')
  })

  it('decides deactivation from the pointer position, not a leave event', () => {
    // Activating swaps the card's children and React can swallow the synthetic
    // pointerleave, which used to strand the console in live mode.
    expect(source).toContain('document.addEventListener("pointermove", onPointerMove)')
    expect(source).toContain('if (!live || query) return;')
  })
})
