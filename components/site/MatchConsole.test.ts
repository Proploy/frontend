import fs from 'node:fs'
import path from 'node:path'

import {
  MIN_QUERY_LENGTH,
  isTypeThroughKey,
} from './MatchConsole'

function readSource(file: string) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8')
}

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

  it('hosts the real catalog search rather than the demo fixtures', () => {
    // The hosted bar is the shared ProductSearch; the old products/ui list is gone.
    expect(source).toContain('ProductSearch')
    expect(source).not.toContain('useProductList')
    expect(source).not.toContain('products/ui')
  })

  it('places the mode toggle inside the card header so it drives the natural endpoint', () => {
    expect(source).toContain('SearchModeToggle')
    // "Describe what you need" must switch the real API — not be gated behind a
    // rollout flag that silently keeps calling keyword search.
    expect(source).not.toContain('isNaturalSearchEnabled')
    expect(source).toContain('value={mode}')
    expect(source).toContain('onChange={setMode}')
  })

  it('keeps the search bar visible and shows suggestions until a real query exists', () => {
    expect(source).toContain('!hasQuery && (')
    expect(MIN_QUERY_LENGTH).toBeGreaterThan(1)
  })

  it('lets the hosted search own debouncing and fallback handling', () => {
    const searchSource = readSource('components/search/ProductSearch.tsx')
    expect(searchSource).toContain('useKeywordSearch')
    expect(searchSource).toContain('useNaturalSearch')
    // Debounce and the never-silent keyword fallback live in the shared hooks.
    const hooksSource = readSource('features/catalog/search/hooks.ts')
    expect(hooksSource).toContain('setTimeout(resolve, 200)')
  })

  it('reserves the suggestion footprint so results never resize the card', () => {
    const bodyStates = source.match(/BODY_MIN_H/g) ?? []
    // One definition plus the embedded results list and the suggestions block.
    expect(bodyStates.length).toBe(3)
  })

  it('uses a persistent mode state instead of demo-reel live gating', () => {
    expect(source).not.toContain('data-live')
    expect(source).not.toContain('if (live) return;')
    expect(source).toContain('data-[mode=natural]')
  })

  it('keeps hover-then-type flowing into the hosted input', () => {
    expect(source).toContain('document.addEventListener("keydown", onKeyDown)')
    expect(source).toContain('isTypeThroughKey(event.key, event)')
  })

  it('sends the view-all link to the products page in the active mode', () => {
    expect(source).toContain('/products?search=${encodeURIComponent(trimmed)}')
    expect(source).toContain('&mode=natural')
  })
})