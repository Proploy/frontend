import type {
  ProjectStatus,
  WorkspaceDashboardMeetingIntentSummary,
  WorkspaceEngagement,
  WorkspaceEngagementSummary,
  WorkspaceMeetingIntent,
  WorkspaceRole,
} from '@/features/workspace/types'
import type { ContractStatus, ProposalStatus } from '@/features/workspace/home-types'

export function money(cents?: number | null): string {
  if (cents === null || cents === undefined) return 'Budget not set'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

export function longDate(iso?: string | null): string {
  if (!iso) return 'Not set'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Not set'
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function timeDate(iso?: string | null): string {
  if (!iso) return 'Not set'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Not set'
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function relativeDate(iso?: string | null): string {
  if (!iso) return 'not available'
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return 'not available'
  const diffMs = Date.now() - then
  const minutes = Math.round(diffMs / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.round(hours / 24)
  if (days < 7) return `${days}d ago`
  return longDate(iso)
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'P'
  return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('')
}

export function intentTitle(intent: WorkspaceMeetingIntent | WorkspaceDashboardMeetingIntentSummary): string {
  return intent.requesterName || intent.requesterEmail || intent.requesterUserId || 'Buyer request'
}

export function engagementTitle(
  engagement: WorkspaceEngagement | WorkspaceEngagementSummary,
  viewerRole?: WorkspaceRole | null,
): string {
  const buyer = engagement.buyerDisplayName ?? (engagement.buyerOrganizationId ? 'Buyer organization' : null)
  const expert = engagement.expertDisplayName ?? 'Expert'
  if (viewerRole === 'expert') return buyer ?? 'Buyer'
  if (viewerRole === 'buyer') return expert
  if (engagement.buyerDisplayName && engagement.expertDisplayName) {
    return `${engagement.buyerDisplayName} and ${engagement.expertDisplayName}`
  }
  return buyer ?? expert
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function statusLabelForViewer(
  status: string,
  viewerRole?: WorkspaceRole | null,
): string {
  if (status === 'sent' && viewerRole === 'buyer') return 'Received'
  return statusLabel(status)
}

export function intentStatusClass(status: string): string {
  if (status === 'awaiting_acceptance') return 'bg-[#eff4ff] text-[#155eef]'
  if (status === 'scheduling_open' || status === 'booked') return 'bg-[#ecfdf3] text-[#067647]'
  if (status === 'declined' || status === 'expired' || status === 'cancelled') return 'bg-[#fef3f2] text-[#b42318]'
  return 'bg-[#fafafa] text-[#535862]'
}

export function projectStatusClass(status: ProjectStatus): string {
  if (status === 'accepted') return 'bg-[#ecfdf3] text-[#067647]'
  if (status === 'proposed') return 'bg-[#eff4ff] text-[#155eef]'
  if (status === 'draft') return 'bg-[#fafafa] text-[#535862]'
  if (status === 'declined' || status === 'withdrawn' || status === 'cancelled') return 'bg-[#fef3f2] text-[#b42318]'
  return 'bg-[#fafafa] text-[#535862]'
}

export function proposalStatusClass(status: ProposalStatus): string {
  if (status === 'sent') return 'bg-[#eff4ff] text-[#155eef]'
  if (status === 'accepted') return 'bg-[#ecfdf3] text-[#067647]'
  if (status === 'draft') return 'bg-[#fafafa] text-[#535862]'
  if (status === 'declined' || status === 'withdrawn' || status === 'archived') {
    return 'bg-[#fef3f2] text-[#b42318]'
  }
  return 'bg-[#fffaeb] text-[#b54708]'
}

export function contractStatusClass(status: ContractStatus): string {
  if (status === 'completed') return 'bg-[#ecfdf3] text-[#067647]'
  if (status === 'buyer_signed' || status === 'expert_signed') return 'bg-[#eff4ff] text-[#155eef]'
  if (status === 'sent') return 'bg-[#fffaeb] text-[#b54708]'
  if (status === 'cancelled' || status === 'declined') return 'bg-[#fef3f2] text-[#b42318]'
  return 'bg-[#fafafa] text-[#535862]'
}
