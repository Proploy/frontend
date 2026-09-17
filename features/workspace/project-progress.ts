export type MilestonePresentationKey = 'approved' | 'in_review' | 'upcoming' | 'cancelled'

export interface MilestonePresentationInput {
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled'
  buyerAcceptedAt?: string | null
  expertAcceptedAt?: string | null
}

export interface MilestonePresentation {
  key: MilestonePresentationKey
  label: string
  badgeClass: string
  dotClass: string
  connectorClass: string
}

export function getMilestonePresentation(
  milestone: MilestonePresentationInput,
): MilestonePresentation {
  if (milestone.status === 'cancelled') {
    return {
      key: 'cancelled',
      label: 'Cancelled',
      badgeClass: 'bg-danger-soft text-danger',
      dotClass: 'border-danger-line bg-danger-soft text-danger',
      connectorClass: 'bg-danger-line',
    }
  }

  if (
    milestone.status === 'completed' ||
    Boolean(milestone.buyerAcceptedAt && milestone.expertAcceptedAt)
  ) {
    return {
      key: 'approved',
      label: 'Approved',
      badgeClass: 'bg-ok-soft text-ok',
      dotClass: 'border-ok bg-ok-soft text-ok',
      connectorClass: 'bg-ok',
    }
  }

  if (
    milestone.status === 'in_progress' ||
    Boolean(
      milestone.buyerAcceptedAt ||
        milestone.expertAcceptedAt,
    )
  ) {
    return {
      key: 'in_review',
      label: 'In review',
      badgeClass: 'bg-warn-soft text-warn',
      dotClass: 'border-warn bg-warn-soft text-warn',
      connectorClass: 'bg-line',
    }
  }

  return {
    key: 'upcoming',
    label: 'Upcoming',
    badgeClass: 'bg-line-soft text-ink-muted',
    dotClass: 'border-ink-faint bg-white text-ink-faint',
    connectorClass: 'bg-line',
  }
}
