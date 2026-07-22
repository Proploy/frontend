import { describe, expect, it } from 'vitest'

import { elapsedSeconds, formatElapsedSeconds } from './time-format'

describe('time formatter', () => {
  it('derives elapsed seconds from persisted startedAt', () => {
    expect(
      elapsedSeconds(
        '2026-07-21T12:00:00.000Z',
        Date.parse('2026-07-21T12:01:05.000Z'),
      ),
    ).toBe(65)
  })

  it('never displays negative elapsed time', () => {
    expect(
      elapsedSeconds(
        '2026-07-21T12:00:05.000Z',
        Date.parse('2026-07-21T12:00:00.000Z'),
      ),
    ).toBe(0)
  })

  it('treats service timestamps without an offset as UTC', () => {
    expect(
      elapsedSeconds(
        '2026-07-21T12:00:00.000',
        Date.parse('2026-07-21T12:01:05.000Z'),
      ),
    ).toBe(65)
  })

  it('formats hours, minutes, and seconds', () => {
    expect(formatElapsedSeconds(0)).toBe('00:00:00')
    expect(formatElapsedSeconds(65)).toBe('00:01:05')
    expect(formatElapsedSeconds(3661)).toBe('01:01:01')
  })
})
