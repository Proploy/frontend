'use client'

import { useMemo } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type {
  ProjectStatus,
  WorkspaceConversation,
  WorkspaceConversationListResponse,
  WorkspaceClientListResponse,
  WorkspaceEngagementListResponse,
  WorkspaceMeeting,
  WorkspaceMeetingIntent,
  WorkspaceMeetingIntentListResponse,
  WorkspaceMeetingListResponse,
  WorkspaceMessage,
  WorkspaceMessageListResponse,
  WorkspaceProject,
  WorkspaceProjectCreateRequest,
  WorkspaceProjectListResponse,
  WorkspaceSchedulingProfile,
} from '@/features/workspace/types'
import type {
  WorkspaceContract,
  WorkspaceContractListResponse,
  WorkspaceInvoice,
  WorkspaceInvoiceListResponse,
  WorkspaceProposal,
  WorkspaceProposalCreateRequest,
  WorkspaceProposalListResponse,
} from '@/features/workspace/home-types'
import type {
  InvoiceCreatePayload,
  InvoiceSettlementPayload,
  InvoiceUpdatePayload,
} from './invoice-form'
import type { WorkspaceEngagement } from '@/features/workspace/types'

const client = new ServiceApisBrowserClient()
const WORKSPACE_ROOT = '/api/v1/workspace'

type ApiResult<T> = { ok: true; data: T } | NormalizedError

export type ListEngagementsResult = ApiResult<WorkspaceEngagementListResponse>
export type ListClientsResult = ApiResult<WorkspaceClientListResponse>
export type ListMeetingIntentsResult = ApiResult<WorkspaceMeetingIntentListResponse>
export type ListProjectsResult = ApiResult<WorkspaceProjectListResponse>
export type ListConversationsResult = ApiResult<WorkspaceConversationListResponse>
export type ListMessagesResult = ApiResult<WorkspaceMessageListResponse>
export type ListMeetingsResult = ApiResult<WorkspaceMeetingListResponse>
export type GetSchedulingProfileResult = ApiResult<WorkspaceSchedulingProfile | null>
export type ListProposalsResult = ApiResult<WorkspaceProposalListResponse>
export type ListContractsResult = ApiResult<WorkspaceContractListResponse>
export type ListInvoicesResult = ApiResult<WorkspaceInvoiceListResponse>
export type ContractDocumentResult = ApiResult<Blob>
export type WorkspaceMutationResult<T> = ApiResult<T>

async function authedGet<T>(path: string): Promise<ApiResult<T>> {
  return client.get<T>(`${WORKSPACE_ROOT}${path}`, { requireAuth: true })
}

async function authedPost<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
  return client.post<T>(`${WORKSPACE_ROOT}${path}`, body, { requireAuth: true })
}

async function authedPatch<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
  return client.patch<T>(`${WORKSPACE_ROOT}${path}`, body, { requireAuth: true })
}

async function listEngagements(): Promise<ListEngagementsResult> {
  return authedGet<WorkspaceEngagementListResponse>('/me/engagements')
}

async function listClients(): Promise<ListClientsResult> {
  return authedGet<WorkspaceClientListResponse>('/me/clients')
}

async function getMySchedulingProfile(): Promise<GetSchedulingProfileResult> {
  return authedGet<WorkspaceSchedulingProfile | null>('/me/scheduling-profile')
}

async function updateEngagementStatus(
  engagementId: string,
  status: WorkspaceEngagement['status'],
): Promise<WorkspaceMutationResult<WorkspaceEngagement>> {
  return authedPatch<WorkspaceEngagement>(
    `/engagements/${encodeURIComponent(engagementId)}/status`,
    { status },
  )
}

async function ensureConversation(engagementId: string): Promise<WorkspaceMutationResult<WorkspaceConversation>> {
  return authedPost<WorkspaceConversation>(
    `/engagements/${encodeURIComponent(engagementId)}/conversation`,
    undefined,
  )
}

async function listMeetingIntents(): Promise<ListMeetingIntentsResult> {
  return authedGet<WorkspaceMeetingIntentListResponse>('/me/meeting-intents')
}

async function listExpertMeetingIntents(expertId: string): Promise<ListMeetingIntentsResult> {
  return authedGet<WorkspaceMeetingIntentListResponse>(
    `/experts/${encodeURIComponent(expertId)}/meeting-intents`,
  )
}

async function decideMeetingIntent(
  intentId: string,
  decision: 'accept' | 'decline',
  declineReason?: string,
): Promise<WorkspaceMutationResult<WorkspaceMeetingIntent>> {
  return authedPost<WorkspaceMeetingIntent>(
    `/meeting-intents/${encodeURIComponent(intentId)}/decision`,
    { decision, declineReason },
  )
}

async function createMeetingIntent(
  expertId: string,
  payload: {
    projectScope: string
    preferredTimes?: unknown
    organizationId?: string | null
  },
): Promise<WorkspaceMutationResult<WorkspaceMeetingIntent>> {
  return authedPost<WorkspaceMeetingIntent>(
    `/experts/${encodeURIComponent(expertId)}/meeting-intents`,
    { expertId, ...payload },
  )
}

async function cancelMeetingIntent(
  intentId: string,
): Promise<WorkspaceMutationResult<WorkspaceMeetingIntent>> {
  return authedPost<WorkspaceMeetingIntent>(
    `/meeting-intents/${encodeURIComponent(intentId)}/cancel`,
    undefined,
  )
}

async function listProjects(): Promise<ListProjectsResult> {
  return authedGet<WorkspaceProjectListResponse>('/me/projects')
}

async function createProject(
  payload: WorkspaceProjectCreateRequest,
): Promise<WorkspaceMutationResult<WorkspaceProject>> {
  return authedPost<WorkspaceProject>(
    `/engagements/${encodeURIComponent(payload.engagementId)}/projects`,
    payload,
  )
}

async function updateProject(
  projectId: string,
  payload: Partial<Pick<WorkspaceProject, 'title' | 'summary' | 'scope' | 'budgetCents' | 'estimatedDuration'>>,
): Promise<WorkspaceMutationResult<WorkspaceProject>> {
  return authedPatch<WorkspaceProject>(`/projects/${encodeURIComponent(projectId)}`, payload)
}

async function submitProject(projectId: string): Promise<WorkspaceMutationResult<WorkspaceProject>> {
  return authedPost<WorkspaceProject>(`/projects/${encodeURIComponent(projectId)}/submit`, undefined)
}

async function decideProject(
  projectId: string,
  decision: 'accept' | 'decline',
  note?: string,
): Promise<WorkspaceMutationResult<WorkspaceProject>> {
  return authedPost<WorkspaceProject>(
    `/projects/${encodeURIComponent(projectId)}/decision`,
    { decision, note },
  )
}

async function withdrawProject(projectId: string): Promise<WorkspaceMutationResult<WorkspaceProject>> {
  return authedPost<WorkspaceProject>(`/projects/${encodeURIComponent(projectId)}/withdraw`, undefined)
}

async function listProposals(): Promise<ListProposalsResult> {
  return authedGet<WorkspaceProposalListResponse>('/me/proposals')
}

async function createProposal(
  payload: WorkspaceProposalCreateRequest,
): Promise<WorkspaceMutationResult<WorkspaceProposal>> {
  return authedPost<WorkspaceProposal>(
    `/engagements/${encodeURIComponent(payload.engagementId)}/proposals`,
    payload,
  )
}

async function sendProposal(proposalId: string): Promise<WorkspaceMutationResult<WorkspaceProposal>> {
  return authedPost<WorkspaceProposal>(
    `/proposals/${encodeURIComponent(proposalId)}/send`,
    undefined,
  )
}

async function updateProposal(
  proposalId: string,
  payload: Partial<Pick<WorkspaceProposal, 'title' | 'summary' | 'scope' | 'budgetCents' | 'validUntil'>>,
): Promise<WorkspaceMutationResult<WorkspaceProposal>> {
  return authedPatch<WorkspaceProposal>(
    `/proposals/${encodeURIComponent(proposalId)}`,
    payload,
  )
}

async function decideProposal(
  proposalId: string,
  decision: 'accept' | 'decline',
  note?: string,
): Promise<WorkspaceMutationResult<WorkspaceProposal>> {
  return authedPost<WorkspaceProposal>(
    `/proposals/${encodeURIComponent(proposalId)}/decision`,
    { decision, note },
  )
}

async function withdrawProposal(
  proposalId: string,
  note?: string,
): Promise<WorkspaceMutationResult<WorkspaceProposal>> {
  return authedPost<WorkspaceProposal>(
    `/proposals/${encodeURIComponent(proposalId)}/withdraw`,
    { note },
  )
}

async function listContracts(): Promise<ListContractsResult> {
  return authedGet<WorkspaceContractListResponse>('/me/contracts')
}

async function listInvoices(): Promise<ListInvoicesResult> {
  return authedGet<WorkspaceInvoiceListResponse>('/me/invoices')
}

async function createInvoice(
  payload: InvoiceCreatePayload,
): Promise<WorkspaceMutationResult<WorkspaceInvoice>> {
  return authedPost<WorkspaceInvoice>(
    `/engagements/${encodeURIComponent(payload.engagementId)}/invoices`,
    payload,
  )
}

async function updateInvoice(
  invoiceId: string,
  payload: InvoiceUpdatePayload,
): Promise<WorkspaceMutationResult<WorkspaceInvoice>> {
  return authedPatch<WorkspaceInvoice>(
    `/invoices/${encodeURIComponent(invoiceId)}`,
    payload,
  )
}

async function sendInvoice(invoiceId: string): Promise<WorkspaceMutationResult<WorkspaceInvoice>> {
  return authedPost<WorkspaceInvoice>(
    `/invoices/${encodeURIComponent(invoiceId)}/send`,
    undefined,
  )
}

export async function markInvoicePaid(
  invoiceId: string,
  payload: InvoiceSettlementPayload,
): Promise<WorkspaceMutationResult<WorkspaceInvoice>> {
  return authedPost<WorkspaceInvoice>(
    `/invoices/${encodeURIComponent(invoiceId)}/mark-paid`,
    payload,
  )
}

async function updateContract(
  contractId: string,
  payload: {
    title?: string
    bodyMarkdown?: string
    fieldValues?: Record<string, string>
  },
): Promise<WorkspaceMutationResult<WorkspaceContract>> {
  return authedPatch<WorkspaceContract>(
    `/contracts/${encodeURIComponent(contractId)}`,
    payload,
  )
}

async function sendContract(contractId: string): Promise<WorkspaceMutationResult<WorkspaceContract>> {
  return authedPost<WorkspaceContract>(
    `/contracts/${encodeURIComponent(contractId)}/send`,
    undefined,
  )
}

async function signContract(
  contractId: string,
  payload: { role: 'buyer' | 'expert'; name: string },
): Promise<WorkspaceMutationResult<WorkspaceContract>> {
  return authedPost<WorkspaceContract>(
    `/contracts/${encodeURIComponent(contractId)}/sign`,
    payload,
  )
}

async function cancelContract(
  contractId: string,
  reason?: string,
): Promise<WorkspaceMutationResult<WorkspaceContract>> {
  return authedPost<WorkspaceContract>(
    `/contracts/${encodeURIComponent(contractId)}/cancel`,
    { reason },
  )
}

async function declineContract(
  contractId: string,
  reason?: string,
): Promise<WorkspaceMutationResult<WorkspaceContract>> {
  return authedPost<WorkspaceContract>(
    `/contracts/${encodeURIComponent(contractId)}/decline`,
    { reason },
  )
}

async function downloadSignedContractDocument(contractId: string): Promise<ContractDocumentResult> {
  return client.getBinary(
    `${WORKSPACE_ROOT}/contracts/${encodeURIComponent(contractId)}/document`,
    { requireAuth: true },
  )
}

async function downloadProjectSignedContract(projectId: string): Promise<ContractDocumentResult> {
  return client.getBinary(
    `${WORKSPACE_ROOT}/projects/${encodeURIComponent(projectId)}/signed-contract`,
    { requireAuth: true },
  )
}

async function listConversations(): Promise<ListConversationsResult> {
  return authedGet<WorkspaceConversationListResponse>('/me/conversations')
}

async function listMessages(conversationId: string): Promise<ListMessagesResult> {
  return authedGet<WorkspaceMessageListResponse>(
    `/conversations/${encodeURIComponent(conversationId)}/messages`,
  )
}

async function postMessage(
  conversationId: string,
  body: string,
  clientNonce: string,
): Promise<WorkspaceMutationResult<WorkspaceMessage>> {
  return authedPost<WorkspaceMessage>(
    `/conversations/${encodeURIComponent(conversationId)}/messages`,
    { body, content: body, clientNonce },
  )
}

async function markConversationRead(conversationId: string): Promise<WorkspaceMutationResult<Record<string, never>>> {
  return authedPost<Record<string, never>>(
    `/conversations/${encodeURIComponent(conversationId)}/read`,
    undefined,
  )
}

async function listMeetings(): Promise<ListMeetingsResult> {
  return authedGet<WorkspaceMeetingListResponse>('/me/meetings')
}

async function markMeetingBooked(payload: {
  meetingIntentId: string
  startsAt: string
  endsAt: string
  timezone?: string
  title: string
  locationUrl?: string | null
  notes?: string | null
}): Promise<WorkspaceMutationResult<WorkspaceMeeting>> {
  return authedPost<WorkspaceMeeting>('/meetings/mark-booked', {
    ...payload,
    timezone: payload.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  })
}

async function cancelMeeting(meetingId: string): Promise<WorkspaceMutationResult<WorkspaceMeeting>> {
  return authedPatch<WorkspaceMeeting>(`/meetings/${encodeURIComponent(meetingId)}/cancel`, undefined)
}

export const PROPOSAL_STATUSES = new Set<ProjectStatus>(['draft', 'proposed', 'declined', 'withdrawn'])
export const ACTIVE_PROJECT_STATUSES = new Set<ProjectStatus>(['accepted'])

export const useWorkspace = () =>
  useMemo(
    () => ({
      listEngagements,
      listClients,
      getMySchedulingProfile,
      updateEngagementStatus,
      ensureConversation,
      listMeetingIntents,
      listExpertMeetingIntents,
      decideMeetingIntent,
      createMeetingIntent,
      cancelMeetingIntent,
      listProjects,
      createProject,
      updateProject,
      submitProject,
      decideProject,
      withdrawProject,
      listProposals,
      createProposal,
      updateProposal,
      sendProposal,
      decideProposal,
      withdrawProposal,
      listContracts,
      listInvoices,
      createInvoice,
      updateInvoice,
      sendInvoice,
      markInvoicePaid,
      updateContract,
      sendContract,
      signContract,
      cancelContract,
      declineContract,
      downloadSignedContractDocument,
      downloadProjectSignedContract,
      listConversations,
      listMessages,
      postMessage,
      markConversationRead,
      listMeetings,
      markMeetingBooked,
      cancelMeeting,
    }),
    [],
  )
