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
      badgeClass: 'bg-[#fef3f2] text-[#b42318]',
      dotClass: 'border-[#fda29b] bg-[#fff5f4] text-[#b42318]',
      connectorClass: 'bg-[#fecdca]',
    }
  }

  if (
    milestone.status === 'completed' ||
    Boolean(milestone.buyerAcceptedAt && milestone.expertAcceptedAt)
  ) {
    return {
      key: 'approved',
      label: 'Approved',
      badgeClass: 'bg-[#ecfdf3] text-[#067647]',
      dotClass: 'border-[#12b76a] bg-[#ecfdf3] text-[#067647]',
      connectorClass: 'bg-[#12b76a]',
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
      badgeClass: 'bg-[#fffaeb] text-[#b54708]',
      dotClass: 'border-[#f79009] bg-[#fffaeb] text-[#b54708]',
      connectorClass: 'bg-[#eaecf0]',
    }
  }

  return {
    key: 'upcoming',
    label: 'Upcoming',
    badgeClass: 'bg-[#f2f4f7] text-[#667085]',
    dotClass: 'border-[#d0d5dd] bg-white text-[#98a2b3]',
    connectorClass: 'bg-[#eaecf0]',
  }
}
