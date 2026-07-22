import { describe, expect, it } from 'vitest'
import {
  PRODUCT_CARD_CLASS,
  PRODUCT_CARD_DESCRIPTION_CLASS,
} from '../presentation'

describe('product card presentation', () => {
  it('reserves a fixed three-line description area and keeps the card full height', () => {
    expect(PRODUCT_CARD_CLASS).toContain('h-full')
    expect(PRODUCT_CARD_CLASS).toContain('flex-col')
    expect(PRODUCT_CARD_DESCRIPTION_CLASS).toContain('line-clamp-3')
    expect(PRODUCT_CARD_DESCRIPTION_CLASS).toContain('min-h-[72px]')
  })
})
