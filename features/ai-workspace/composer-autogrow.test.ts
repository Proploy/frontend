import { describe, expect, it } from 'vitest'
import {
  COMPOSER_MAX_HEIGHT,
  COMPOSER_MIN_HEIGHT,
  clampComposerHeight,
  composerOverflows,
  scrollAdjustmentFor,
} from './composer-autogrow'

describe('clampComposerHeight', () => {
  it('holds one line at the minimum', () => {
    expect(clampComposerHeight(20)).toBe(COMPOSER_MIN_HEIGHT)
    expect(clampComposerHeight(COMPOSER_MIN_HEIGHT)).toBe(COMPOSER_MIN_HEIGHT)
  })

  it('grows with the text between the minimum and the cap', () => {
    expect(clampComposerHeight(92)).toBe(92)
    expect(clampComposerHeight(140)).toBe(140)
  })

  it('stops growing at the cap', () => {
    expect(clampComposerHeight(COMPOSER_MAX_HEIGHT + 400)).toBe(
      COMPOSER_MAX_HEIGHT,
    )
  })

  it('falls back to the minimum when the layout engine reports nothing', () => {
    // jsdom always measures scrollHeight as 0; a naive clamp would collapse
    // the composer to nothing in every component test.
    expect(clampComposerHeight(0)).toBe(COMPOSER_MIN_HEIGHT)
    expect(clampComposerHeight(Number.NaN)).toBe(COMPOSER_MIN_HEIGHT)
  })
})

describe('composerOverflows', () => {
  it('is false while the text still fits', () => {
    expect(composerOverflows(120)).toBe(false)
    expect(composerOverflows(COMPOSER_MAX_HEIGHT)).toBe(false)
  })

  it('is true once the text passes the cap', () => {
    expect(composerOverflows(COMPOSER_MAX_HEIGHT + 1)).toBe(true)
  })
})

describe('scrollAdjustmentFor', () => {
  it('pushes the conversation up by exactly what the composer took', () => {
    expect(scrollAdjustmentFor(44, 68)).toBe(24)
  })

  it('gives the space back when the composer shrinks', () => {
    expect(scrollAdjustmentFor(200, 44)).toBe(-156)
  })

  it('does nothing when the height is unchanged', () => {
    expect(scrollAdjustmentFor(68, 68)).toBe(0)
  })

  it('ignores unmeasurable heights rather than jumping the scroller', () => {
    expect(scrollAdjustmentFor(Number.NaN, 68)).toBe(0)
  })
})
