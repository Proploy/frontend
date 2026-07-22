import { describe, expect, it } from 'vitest'
import { applyEngagementStatusResponse } from './engagement-status'
import type { WorkspaceEngagement } from './types'

const current: WorkspaceEngagement[] = [
  {
    id: 'eng-1',
    status: 'active',
    buyerUserId: 'buyer-1',
    expertId: 'expert-1',
    createdAt: '2026-07-21T00:00:00Z',
    updatedAt: '2026-07-21T00:00:00Z',
  },
]

describe('applyEngagementStatusResponse', () => {
  it('replaces the matching engagement with the authoritative API response', () => {
    const updated = { ...current[0], status: 'paused' as const, updatedAt: '2026-07-21T01:00:00Z' }

    expect(applyEngagementStatusResponse(current, updated)).toEqual([updated])
  })

  it('does not add an unrelated response to the current list', () => {
    const updated = { ...current[0], id: 'eng-2', status: 'closed' as const }

    expect(applyEngagementStatusResponse(current, updated)).toBe(current)
  })
})
