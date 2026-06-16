import { describe, expect, it } from 'vitest'

import { createLatestRequestGuard } from '../latest-request'

describe('createLatestRequestGuard', () => {
  it('accepts only the most recently started request', () => {
    const guard = createLatestRequestGuard()

    const first = guard.begin()
    const second = guard.begin()

    expect(guard.isLatest(first)).toBe(false)
    expect(guard.isLatest(second)).toBe(true)
  })

  it('invalidates the current request', () => {
    const guard = createLatestRequestGuard()
    const request = guard.begin()

    guard.invalidate()

    expect(guard.isLatest(request)).toBe(false)
  })
})
