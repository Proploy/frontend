import type {
  MeetingIntentStatus,
  WorkspaceClientRow,
  WorkspaceMeetingIntent,
  WorkspaceRequestRow,
} from '@/features/workspace/types'

const INTENT_STATUSES = new Set<string>([
  'awaiting_acceptance',
  'scheduling_open',
  'declined',
  'booked',
  'cancelled',
  'expired',
])

export function isMeetingIntentStatus(status: string): status is MeetingIntentStatus {
  return INTENT_STATUSES.has(status)
}

export function meetingIntentToRequestRow(intent: WorkspaceMeetingIntent): WorkspaceRequestRow {
  return {
    id: intent.id,
    source: 'direct_intent',
    status: intent.status,
    expertId: intent.expertId,
    requesterUserId: intent.requesterUserId,
    requesterEmail: intent.requesterEmail,
    requesterName: intent.requesterName,
    organizationId: intent.organizationId,
    projectScope: intent.projectScope,
    correlationToken: intent.correlationToken,
    createdAt: intent.createdAt,
    updatedAt: intent.updatedAt,
    expiresAt: intent.expiresAt,
  }
}

export function clientRowToRequestRow(client: WorkspaceClientRow): WorkspaceRequestRow | null {
  if (client.source !== 'meeting_intent') return null
  if (!client.meetingIntentId) return null
  if (!isMeetingIntentStatus(client.status)) return null

  return {
    id: client.meetingIntentId,
    source: 'meeting_intent',
    status: client.status,
    requesterUserId: client.buyerUserId,
    requesterEmail: client.buyerUserEmail,
    requesterName: client.buyerUserDisplayName ?? client.buyerOrganizationName,
    organizationId: client.buyerOrganizationId,
    projectScope: client.projectScope ?? 'No project scope provided yet.',
    createdAt: client.requestedAt ?? client.updatedAt,
    updatedAt: client.updatedAt,
  }
}

export function clientRowsToRequestRows(clients: WorkspaceClientRow[]): WorkspaceRequestRow[] {
  return clients.flatMap((client) => {
    const row = clientRowToRequestRow(client)
    return row ? [row] : []
  })
}

export function requestTitle(request: WorkspaceRequestRow): string {
  return request.requesterName || request.requesterEmail || request.requesterUserId || 'Buyer request'
}
