import { describe, expect, it } from 'vitest'

import { groupTimeEntries } from './time-log'

describe('time-log grouping', () => {
  it('groups entries by week and local day while preserving active entries', () => {
    const groups = groupTimeEntries(
      [
        {
          id: 'active',
          projectId: 'project-1',
          userId: 'expert-1',
          startedAt: '2026-07-21T08:00:00Z',
          endedAt: null,
          durationMinutes: null,
          note: 'Client workshop',
          createdAt: '2026-07-21T08:00:00Z',
          updatedAt: '2026-07-21T08:00:00Z',
        },
      ],
      new Date('2026-07-21T09:00:00Z'),
    )

    expect(groups[0]?.days[0]?.entries[0]?.id).toBe('active')
    expect(groups[0]?.days[0]?.totalSeconds).toBeGreaterThan(0)
  })
})
