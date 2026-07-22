import { describe, expect, it } from 'vitest'

import { buildSubItemReorderInput, sortSubItems } from './subitem-order'

describe('project sub-item ordering', () => {
  it('sorts work items by persisted order with a deterministic legacy fallback', () => {
    const items = [
      { id: 'two', sortOrder: 1, createdAt: '2026-07-21T10:00:00Z' },
      { id: 'one', sortOrder: 0, createdAt: '2026-07-21T11:00:00Z' },
    ]

    expect(sortSubItems(items).map((item) => item.id)).toEqual(['one', 'two'])
  })

  it('builds a complete reorder payload including cancelled items', () => {
    const columns = {
      open: [{ id: 'one', status: 'open' as const }],
      in_progress: [],
      completed: [],
      cancelled: [{ id: 'cancelled', status: 'cancelled' as const }],
    }

    expect(buildSubItemReorderInput(columns)).toEqual({
      items: [
        { id: 'one', status: 'open' },
        { id: 'cancelled', status: 'cancelled' },
      ],
    })
  })
})
