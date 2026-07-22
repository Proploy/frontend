import { describe, expect, it } from 'vitest'

import { getMilestonePresentation } from './project-progress'

describe('milestone timeline presentation', () => {
  it('marks completed and mutually accepted milestones as approved', () => {
    expect(
      getMilestonePresentation({
        status: 'completed',
        buyerAcceptedAt: null,
        expertAcceptedAt: null,
      }),
    ).toMatchObject({ key: 'approved', label: 'Approved' })

    expect(
      getMilestonePresentation({
        status: 'in_progress',
        buyerAcceptedAt: '2026-07-21T09:00:00Z',
        expertAcceptedAt: '2026-07-21T09:01:00Z',
      }),
    ).toMatchObject({ key: 'approved', label: 'Approved' })
  })

  it('marks partially decided or active milestones as in review', () => {
    expect(
      getMilestonePresentation({
        status: 'planned',
        buyerAcceptedAt: '2026-07-21T09:00:00Z',
        expertAcceptedAt: null,
      }),
    ).toMatchObject({ key: 'in_review', label: 'In review' })

    expect(
      getMilestonePresentation({
        status: 'in_progress',
        buyerAcceptedAt: null,
        expertAcceptedAt: null,
      }),
    ).toMatchObject({ key: 'in_review', label: 'In review' })
  })

  it('marks untouched and cancelled milestones distinctly', () => {
    expect(
      getMilestonePresentation({
        status: 'planned',
        buyerAcceptedAt: null,
        expertAcceptedAt: null,
      }),
    ).toMatchObject({ key: 'upcoming', label: 'Upcoming' })

    expect(
      getMilestonePresentation({
        status: 'cancelled',
        buyerAcceptedAt: null,
        expertAcceptedAt: null,
      }),
    ).toMatchObject({ key: 'cancelled', label: 'Cancelled' })
  })
})
