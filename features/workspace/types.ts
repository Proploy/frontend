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
  meetingIntentId?: string | null
  repUserId?: string | null
  createdAt: string
  updatedAt: string
  closedAt?: string | null
}

export interface WorkspaceEngagementParticipant {
  engagementId: string
  userId: string
  role: 'buyer_side' | 'expert_side' | 'observer'
  addedAt: string
}

export interface WorkspaceEngagementEvent {
  id: string
  engagementId: string
  eventType: string
  payload?: Record<string, unknown> | null
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

export interface WorkspaceSchedulingProfile {
  id: string
  expertId: string
  provider: 'cal_diy' | 'cal_com' | 'calendly' | 'manual'
  connectionMode: 'pasted_link' | 'connected'
  providerUserId?: string | null
  providerEventTypeId?: string | null
  providerAccountEmail?: string | null
  status: 'active' | 'disabled' | 'error'
  errorMessage?: string | null
  displayLabel: string
  durationMinutes: number
  locationType?: 'google_meet' | 'zoom' | 'in_person' | 'phone' | 'unknown' | null
  locationValue?: string | null
  externalLinkUrl?: string | null
  staticMeetingUrl?: string | null
  createdAt: string
  updatedAt: string
}

// ─── Conversation + Message ──────────────────────────────────────────────

export interface WorkspaceConversation {
  id: string
  engagementId: string
  kind: 'engagement'
  subject?: string | null
  createdAt: string
  lastMessageAt?: string | null
}

export interface WorkspaceMessage {
  id: string
  conversationId: string
  senderUserId: string
  body: string
  content: string
  /** Idempotency key minted by the client (handoff B.7). */
  clientNonce?: string | null
  createdAt: string
  editedAt?: string | null
  deletedAt?: string | null
  attachments?: WorkspaceMessageAttachment[]
}

export interface WorkspaceMessageAttachment {
  id: string
  messageId: string
  fileName: string
  contentType: string
  sizeBytes: number
  createdAt?: string
  downloadUrl?: string | null
}

export interface WorkspaceConversationParticipant {
  conversationId: string
  participantType: 'user' | 'external_contact'
  userId?: string | null
  externalContactId?: string | null
  role: 'member' | 'read_only'
  joinedAt: string
  lastReadAt?: string | null
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

export type ProjectStatus = 'draft' | 'proposed' | 'accepted' | 'declined' | 'withdrawn' | 'cancelled'

export interface WorkspaceProject {
  id: string
  engagementId: string
  status: ProjectStatus
  title: string
  summary: string
  scope: string
  budgetCents?: number | null
  estimatedDuration?: string | null
  buyerAcceptedAt?: string | null
  expertAcceptedAt?: string | null
  buyerDeclinedAt?: string | null
  expertDeclinedAt?: string | null
  createdByUserId: string
  updatedAt: string
  createdAt: string
}

export interface WorkspaceProjectAcceptance {
  projectId: string
  userId: string
  decision: 'accepted' | 'declined'
  note?: string | null
  createdAt: string
}

export interface WorkspaceProjectMilestoneCreateRequest {
  title: string
  summary?: string | null
  dueAt?: string | null
}

// ─── Meeting ─────────────────────────────────────────────────────────────

export type MeetingStatus = 'scheduled' | 'cancelled' | 'completed'

export interface WorkspaceMeeting {
  id: string
  engagementId: string
  meetingIntentId?: string | null
  schedulingProfileId?: string | null
  provider: 'cal_diy' | 'cal_com' | 'calendly' | 'google_calendar' | 'manual' | 'none'
  providerBookingUid?: string | null
  providerCalendarId?: string | null
  providerEventId?: string | null
  providerETag?: string | null
  providerUpdatedAt?: string | null
  correlationToken?: string | null
  startsAt: string
  endsAt: string
  actualStartsAt?: string | null
  actualEndsAt?: string | null
  timezone: string
  status: MeetingStatus | 'no_show' | 'rescheduled'
  title: string
  locationType?: 'google_meet' | 'zoom' | 'in_person' | 'phone' | 'unknown' | null
  meetingUrl?: string | null
  locationUrl?: string | null
  notes?: string | null
  confirmedByUserId?: string | null
  createdAt: string
  updatedAt: string
}

/** GET /api/v1/workspace/meetings — the calendar feed. */
export interface WorkspaceMeetingsResponse {
  meetings: WorkspaceMeeting[]
}

/**
 * POST /api/v1/workspace/meetings — book a call between the two engagement
 * parties. `provider: 'cal_diy'` routes through Proploy's own scheduler
 * (the Cal.com integration seam); the backend owns slot validation and
 * meeting-link creation.
 */
export interface ScheduleMeetingRequest {
  engagementId?: string | null
  title: string
  startsAt: string
  endsAt: string
  provider?: WorkspaceMeeting['provider']
  attendeeName?: string | null
  notes?: string | null
}

/** GET /api/v1/workspace/meetings — the calendar feed. */
export interface WorkspaceMeetingsResponse {
  meetings: WorkspaceMeeting[]
}

/**
 * POST /api/v1/workspace/meetings — book a call between the two engagement
 * parties. `provider: 'cal_diy'` routes through Proploy's own scheduler
 * (the Cal.com integration seam); the backend owns slot validation and
 * meeting-link creation.
 */
export interface ScheduleMeetingRequest {
  engagementId?: string | null
  title: string
  startsAt: string
  endsAt: string
  provider?: WorkspaceMeeting['provider']
  attendeeName?: string | null
  notes?: string | null
}

// ─── Notification (outbox state) ─────────────────────────────────────────

export type NotificationStatus = 'pending' | 'processing' | 'sent' | 'failed' | 'dead_letter'

export interface WorkspaceNotification {
  id: string
  template: string
  status: NotificationStatus
  title: string
  body: string
  href?: string | null
  readAt?: string | null
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

export interface WorkspaceDashboardMeetingSummary {
  id: string
  engagementId: string
  title: string
  startsAt: string
  endsAt: string
  status: string
  locationUrl?: string | null
}

export type WorkspaceClientSource = 'meeting_intent' | 'engagement'

export interface WorkspaceClientRow {
  source: WorkspaceClientSource
  engagementId?: string | null
  meetingIntentId?: string | null
  status: MeetingIntentStatus | EngagementStatus
  buyerUserId?: string | null
  buyerUserDisplayName?: string | null
  buyerUserEmail?: string | null
  buyerOrganizationId?: string | null
  buyerOrganizationName?: string | null
  projectScope?: string | null
  requestedAt?: string | null
  lastMessageAt?: string | null
  updatedAt: string
}

export interface WorkspaceClientListResponse {
  clients: WorkspaceClientRow[]
}

export type WorkspaceRequestSource = 'meeting_intent' | 'direct_intent'

export interface WorkspaceRequestRow {
  id: string
  source: WorkspaceRequestSource
  status: MeetingIntentStatus
  expertId?: string | null
  requesterUserId?: string | null
  requesterEmail?: string | null
  requesterName?: string | null
  organizationId?: string | null
  projectScope: string
  correlationToken?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  expiresAt?: string | null
}

export interface WorkspaceDashboardResponse {
  scope: WorkspaceRole
  counts: WorkspaceDashboardCounts
  recentEngagements: WorkspaceEngagementSummary[]
  recentIntents: WorkspaceDashboardMeetingIntentSummary[]
  upcomingMeetings: WorkspaceDashboardMeetingSummary[]
  unreadNotifications?: number
}

export interface WorkspaceEngagementListResponse {
  engagements: WorkspaceEngagement[]
}

export interface WorkspaceMeetingIntentListResponse {
  meetingIntents: WorkspaceMeetingIntent[]
}

export interface WorkspaceProjectListResponse {
  projects: WorkspaceProject[]
}

export interface WorkspaceConversationListResponse {
  conversations: WorkspaceConversation[]
}

export interface WorkspaceMessageListResponse {
  messages: WorkspaceMessage[]
  hasMore: boolean
}

export interface WorkspaceMeetingListResponse {
  meetings: WorkspaceMeeting[]
}

export interface WorkspaceProjectCreateRequest {
  engagementId: string
  title: string
  summary: string
  scope: string
  budgetCents?: number | null
  estimatedDuration?: string | null
  milestones?: WorkspaceProjectMilestoneCreateRequest[]
}
