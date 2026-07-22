// Workspace home aggregator types (W9).
//
// These shapes are the *wire* payloads of the endpoints the home page now
// fans out to:
//   - GET /api/v1/workspace/me/dashboard   (existing)
//   - GET /api/v1/workspace/me/engagements (existing)
//   - GET /api/v1/workspace/me/conversations (existing)
//   - GET /api/v1/workspace/me/projects    (existing)
//   - GET /api/v1/workspace/me/proposals   (existing)
//   - GET /api/v1/workspace/me/contracts   (existing)
//   - GET /api/v1/workspace/me/invoices    (optional; still 404-safe)
//   - GET /api/v1/workspace/notifications/me (existing)
//
// Only the home aggregator (features/workspace/use-workspace-home.ts) and
// the home page (app/workspace/page.tsx) consume these types.

import type {
  WorkspaceConversation,
  WorkspaceEngagement,
  WorkspaceMeeting,
  WorkspaceNotification,
  WorkspaceProject,
} from '@/features/workspace/types'

// ─── Proposals (W11) ────────────────────────────────────────────────────

export type ProposalStatus =
  | 'draft'
  | 'sent'
  | 'accepted'
  | 'declined'
  | 'withdrawn'
  | 'superseded'
  | 'archived'

export interface WorkspaceProposal {
  id: string
  engagementId: string
  createdByUserId: string
  title: string
  summary: string
  scope: string
  budgetCents?: number | null
  validUntil?: string | null
  status: ProposalStatus
  sentAt?: string | null
  acceptedAt?: string | null
  declinedAt?: string | null
  declinedReason?: string | null
  withdrawnAt?: string | null
  supersededAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface WorkspaceProposalListResponse {
  proposals: WorkspaceProposal[]
}

export interface WorkspaceProposalCreateRequest {
  engagementId: string
  title: string
  summary: string
  scope: string
  budgetCents?: number | null
  validUntil?: string | null
}

// ─── Contracts ─────────────────────────────────────────────────────────

export type ContractStatus =
  | 'draft'
  | 'sent'
  | 'buyer_signed'
  | 'expert_signed'
  | 'completed'
  | 'cancelled'
  | 'declined'

export interface WorkspaceContract {
  id: string
  engagementId: string
  proposalId?: string | null
  templateId?: string | null
  title: string
  bodyMarkdown: string
  status: ContractStatus
  sentAt?: string | null
  buyerSignedAt?: string | null
  buyerSignerName?: string | null
  buyerSignatureStorageKey?: string | null
  expertSignedAt?: string | null
  expertSignerName?: string | null
  expertSignatureStorageKey?: string | null
  signedDocumentAvailable?: boolean
  completedAt?: string | null
  cancelledAt?: string | null
  declinedAt?: string | null
  declinedReason?: string | null
  createdByUserId: string
  createdAt: string
  updatedAt: string
}

export interface WorkspaceContractListResponse {
  contracts: WorkspaceContract[]
}

export interface WorkspaceContractDocumentUploadRequest {
  contractId: string
  fileName: string
  contentType: string
  sizeBytes: number
}

export interface WorkspaceContractDocumentUploadResponse {
  storageKey: string
  maxBytes: number
  contractId: string
}

// ─── Invoices (W5) ─────────────────────────────────────────────────────

export type InvoiceStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'overdue'
  | 'cancelled'
  | 'refunded'

export interface WorkspaceInvoice {
  id: string
  engagementId: string
  contractId?: string | null
  proposalId?: string | null
  templateId?: string | null
  invoiceNumber: string
  title: string
  lineItems: Array<{
    description: string
    quantity: number
    unitCents: number
  }>
  subtotalCents: number
  totalCents: number
  currency: string
  dueAt: string
  status: InvoiceStatus
  sentAt?: string | null
  paidAt?: string | null
  paidAmountCents?: number | null
  paymentProviderRef?: string | null
  createdByUserId: string
  createdAt: string
  updatedAt: string
}

export interface WorkspaceInvoiceListResponse {
  invoices: WorkspaceInvoice[]
}

// ─── Aggregated home snapshot ──────────────────────────────────────────

export interface WorkspaceHomeKpis {
  /** Engagement.status === 'active' */
  openEngagements: number
  /** Project.status === 'in_progress' (currently 'accepted' on the live API) */
  activeProjects: number
  /** Conversations with at least one message newer than the user's lastReadAt */
  unreadMessages: number
  /** Sum of: proposals awaiting buyer decision + contracts awaiting sign + invoices awaiting payment */
  pendingDecisions: number
}

export type WorkspaceHomeActivityKind =
  | 'engagement'
  | 'proposal'
  | 'contract'
  | 'invoice'

export interface WorkspaceHomeActivity {
  id: string
  kind: WorkspaceHomeActivityKind
  /** ISO timestamp used for sorting (newest first). */
  createdAt: string
  /** Human label e.g. "Proposal sent: Acme website redesign". */
  title: string
  /** Optional secondary line: amount, counterparty, status pill text. */
  detail?: string | null
  /** Optional route to open the source record. */
  href?: string | null
}

export interface WorkspaceHomeSnapshot {
  kpis: WorkspaceHomeKpis
  /** Last 10 events across engagement/proposal/contract/invoice streams. */
  recentActivity: WorkspaceHomeActivity[]
  /** Unread notifications surfaced for the badge / quick actions. */
  unreadNotifications: number
  /** Raw collections for the section cards. */
  engagements: WorkspaceEngagement[]
  projects: WorkspaceProject[]
  conversations: WorkspaceConversation[]
  proposals: WorkspaceProposal[]
  contracts: WorkspaceContract[]
  invoices: WorkspaceInvoice[]
  meetings: WorkspaceMeeting[]
  notifications: WorkspaceNotification[]
  /** Per-endpoint errors. Empty when every call succeeded. */
  errors: WorkspaceHomeError[]
  /** True when ANY endpoint returned a "service unavailable" (503 / NOT_CONFIGURED / NETWORK_ERROR). */
  serviceUnavailable: boolean
  /** True while the first fan-out is in-flight. */
  isLoading: boolean
}

export interface WorkspaceHomeError {
  endpoint: string
  status: number
  code: string
  message: string
}

/** Empty snapshot helper. */
export function emptyWorkspaceHomeSnapshot(): WorkspaceHomeSnapshot {
  return {
    kpis: {
      openEngagements: 0,
      activeProjects: 0,
      unreadMessages: 0,
      pendingDecisions: 0,
    },
    recentActivity: [],
    unreadNotifications: 0,
    engagements: [],
    projects: [],
    conversations: [],
    proposals: [],
    contracts: [],
    invoices: [],
    meetings: [],
    notifications: [],
    errors: [],
    serviceUnavailable: false,
    isLoading: true,
  }
}
