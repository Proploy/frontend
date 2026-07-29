import { isBottomRightActivationPoint } from './ProployResearchPanel'

describe('Ask Proploy launcher activation', () => {
  it('activates only within the desktop bottom-right corner threshold', () => {
    expect(isBottomRightActivationPoint({
      clientX: 1910,
      clientY: 1070,
      viewportWidth: 1920,
      viewportHeight: 1080,
    })).toBe(true)

    expect(isBottomRightActivationPoint({
      clientX: 1800,
      clientY: 1070,
      viewportWidth: 1920,
      viewportHeight: 1080,
    })).toBe(false)

    expect(isBottomRightActivationPoint({
      clientX: 1910,
      clientY: 900,
      viewportWidth: 1920,
      viewportHeight: 1080,
    })).toBe(false)
  })

  it('rejects pointer coordinates outside the viewport', () => {
    expect(isBottomRightActivationPoint({
      clientX: 1921,
      clientY: 1080,
      viewportWidth: 1920,
      viewportHeight: 1080,
    })).toBe(false)
  })
})
