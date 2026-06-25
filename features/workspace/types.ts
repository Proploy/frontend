// Workspace data shapes.
//
// These types are the wire format for the new /api/v1/workspace/* backend
// (handoff A.3). They are intentionally separate from features/experts/types.ts
// — that module's types (ExpertMe, ExpertDashboardResponse, etc.) describe
// the legacy expert-as-a-person model and stay in use only for the public
// /experts/[id] profile.
//
// Workspace pages import exclusively from this file via
// features/workspace/index.ts. Do not import from features/experts/* in
// workspace code.

export type WorkspaceRole = 'buyer' | 'expert' | 'admin'

// ─── Engagement ──────────────────────────────────────────────────────────

export type EngagementStatus = 'active' | 'paused' | 'closed'

export interface WorkspaceEngagementSummary {
  id: string
  status: EngagementStatus
  buyerUserId?: string | null
  buyerOrganizationId?: string | null
  expertId: string
  /** Display name of the expert party. */
  expertDisplayName?: string | null
  expertAvatarUrl?: string | null
  /** Display name of the buyer party (user name or org name). */
  buyerDisplayName?: string | null
  buyerAvatarUrl?: string | null
  lastActivityAt?: string | null
  lastMessageAt?: string | null
  updatedAt?: string | null
}

export interface WorkspaceEngagement extends WorkspaceEngagementSummary {
  createdAt: string
  closedAt?: string | null
}

export interface WorkspaceEngagementParticipant {
  id: string
  engagementId: string
  userId?: string | null
  externalContactId?: string | null
  role: 'buyer' | 'expert' | 'observer'
  displayName: string
}

export interface WorkspaceEngagementEvent {
  id: string
  engagementId: string
  type: string
  payload: Record<string, unknown>
  createdAt: string
  actorUserId?: string | null
}

// ─── Meeting Intent ──────────────────────────────────────────────────────

export type MeetingIntentStatus =
  | 'awaiting_acceptance'
  | 'scheduling_open'
  | 'declined'
  | 'booked'
  | 'cancelled'
  | 'expired'

export interface WorkspaceMeetingIntent {
  id: string
  status: MeetingIntentStatus
  expertId: string
  requesterUserId: string
  requesterEmail: string
  requesterName?: string | null
  organizationId?: string | null
  projectScope: string
  preferredTimes?: unknown
  correlationToken: string
  schedulingProfileId?: string | null
  acceptedAt?: string | null
  declinedAt?: string | null
  declineReason?: string | null
  createdAt: string
  updatedAt: string
  expiresAt: string
}

// ─── Conversation + Message ──────────────────────────────────────────────

export interface WorkspaceConversation {
  id: string
  engagementId: string
  lastMessageAt: string
  unreadCount: number
  participantCount: number
}

export interface WorkspaceMessage {
  id: string
  conversationId: string
  senderUserId: string
  content: string
  /** Idempotency key minted by the client (handoff B.7). */
  clientNonce?: string | null
  createdAt: string
  attachments?: WorkspaceMessageAttachment[]
}

export interface WorkspaceMessageAttachment {
  id: string
  messageId: string
  fileName: string
  contentType: string
  sizeBytes: number
  downloadUrl?: string | null
}

// ─── Organization + Invitation ───────────────────────────────────────────

export type OrgRole = 'owner' | 'admin' | 'billing' | 'member'

export interface WorkspaceOrganization {
  id: string
  slug: string
  name: string
  createdAt: string
  memberCount: number
}

export interface WorkspaceOrgMember {
  id: string
  userId: string
  email: string
  displayName?: string | null
  role: OrgRole
  joinedAt: string
}

export type InvitationKind = 'organization_join' | 'engagement_join'
export type InvitationStatus = 'pending' | 'accepted' | 'revoked' | 'expired'

export interface WorkspaceInvitation {
  id: string
  token: string
  kind: InvitationKind
  email: string
  role: OrgRole
  status: InvitationStatus
  createdAt: string
  expiresAt: string
}

// ─── Project ─────────────────────────────────────────────────────────────

export type ProjectStatus = 'draft' | 'proposed' | 'accepted' | 'declined' | 'withdrawn'

export interface WorkspaceProject {
  id: string
  engagementId: string
  status: ProjectStatus
  title: string
  scope?: string | null
  budgetCents?: number | null
  estimatedDuration?: string | null
  buyerAcceptedAt?: string | null
  expertAcceptedAt?: string | null
  createdByUserId: string
  updatedAt: string
  createdAt: string
  submittedAt?: string | null
  decidedAt?: string | null
}

export interface WorkspaceProjectAcceptance {
  id: string
  projectId: string
  userId: string
  decision: 'accept' | 'decline'
  reason?: string | null
  createdAt: string
}

// ─── Meeting ─────────────────────────────────────────────────────────────

export type MeetingStatus = 'scheduled' | 'cancelled' | 'completed'

export interface WorkspaceMeeting {
  id: string
  engagementId: string
  startsAt?: string
  endsAt?: string
  status: MeetingStatus | string
  title?: string | null
  provider?: 'cal_diy' | 'google' | 'zoom' | null
  meetingUrl?: string | null
  locationUrl?: string | null
}

// ─── Notification (outbox state) ─────────────────────────────────────────

export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'dead_letter'

export interface WorkspaceNotification {
  id: string
  recipientUserId: string
  template: string
  subject: string
  status: NotificationStatus
  createdAt: string
  sentAt?: string | null
}

// ─── Dashboard ───────────────────────────────────────────────────────────

export interface WorkspaceDashboardCounts {
  activeEngagements: number
  pendingIntents: number
  unreadConversations: number
  unreadMessages?: number
  upcomingMeetings: number
  pendingProposals: number
}

export interface WorkspaceDashboardMeetingIntentSummary {
  id: string
  status: MeetingIntentStatus
  expertId?: string | null
  requesterUserId?: string | null
  requesterEmail?: string | null
  requesterName?: string | null
  organizationId?: string | null
  projectScope: string
  correlationToken: string
  schedulingProfileId?: string | null
  acceptedAt?: string | null
  declinedAt?: string | null
  declineReason?: string | null
  updatedAt?: string | null
  createdAt: string
  expiresAt: string
}

export type WorkspaceClientSource = 'meeting_intent' | 'engagement'

export interface WorkspaceClientRow {
  source: WorkspaceClientSource
  meetingIntent?: WorkspaceMeetingIntent | null
  engagement?: WorkspaceEngagementSummary | null
}

export interface WorkspaceDashboardResponse {
  scope: WorkspaceRole
  counts: WorkspaceDashboardCounts
  recentEngagements: WorkspaceEngagementSummary[]
  recentIntents: WorkspaceDashboardMeetingIntentSummary[]
  upcomingMeetings: WorkspaceMeeting[]
  unreadNotifications?: number
}
