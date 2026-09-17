import fs from 'node:fs'
import path from 'node:path'

import { isTypeThroughKey } from './MatchConsole'

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

  it('hosts the real catalog search rather than demo fixtures', () => {
    expect(source).toContain('ProductSearch')
    expect(source).not.toContain('useProductList')
    expect(source).not.toContain('products/ui')
  })

  it('has no manual mode toggle — the mode is read off the query', () => {
    // The toggle still exists for the products page; the landing bar must not
    // ask the visitor to classify their own query.
    expect(source).not.toContain('SearchModeToggle')
    expect(source).toContain('detectSearchMode(query)')
    // Derived, never stored: a stale mode state would keep calling the wrong
    // endpoint after the query changed underneath it.
    expect(source).not.toMatch(/useState[^\n]*mode/i)
  })

  it('still switches the real API rather than sitting behind a rollout flag', () => {
    expect(source).not.toContain('isNaturalSearchEnabled')
    expect(source).toContain('mode={mode}')
  })

  it('is one bar with the results expanding beneath it, not a floating dropdown', () => {
    // `embedded` keeps results in normal flow, so the panel grows the page.
    expect(source).toContain('variant="embedded"')
    expect(source).toContain('listClassName="mc-results"')
    // The old card chrome is gone: no header row, hint line or suggestion chips.
    expect(source).not.toContain('mc-row')
    expect(source).not.toContain('mc-suggest')
    expect(source).not.toContain('BODY_MIN_H')
  })

  it('surfaces the detected mode so the switch is visible without a toggle', () => {
    // `.mc-card[data-mode="natural"] .mc-results` tints the panel.
    expect(source).toContain('data-mode={mode}')
    const css = readSource('app/v2-pages.css')
    expect(css).toContain('.mc-card[data-mode="natural"] .mc-results')
  })

  it('lets the hosted search own debouncing, fallback and the view-all link', () => {
    const searchSource = readSource('components/search/ProductSearch.tsx')
    expect(searchSource).toContain('useKeywordSearch')
    expect(searchSource).toContain('useNaturalSearch')
    // The link into /products moved to ProductSearch with the card footer.
    expect(searchSource).toContain('/products?search=${encodeURIComponent(value)}')
    expect(searchSource).toContain('&mode=natural')
    // Debounce and the never-silent keyword fallback live in the shared hooks.
    const hooksSource = readSource('features/catalog/search/hooks.ts')
    expect(hooksSource).toContain('setTimeout(resolve, 200)')
  })

  it('keeps hover-then-type flowing into the hosted input', () => {
    expect(source).toContain('document.addEventListener("keydown", onKeyDown)')
    expect(source).toContain('isTypeThroughKey(event.key, event)')
  })
})
