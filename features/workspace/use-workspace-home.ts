'use client'

import { useEffect, useState } from 'react'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import { isCircuitOpen } from '@/lib/service-apis/error-utils'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import { statusLabelForViewer } from '@/components/workspace/workspace-format'
import { useCurrentUserRole, useWorkspace } from '@/features/workspace'
import type {
  WorkspaceConversation,
  WorkspaceEngagement,
  WorkspaceMeeting,
  WorkspaceNotification,
  WorkspaceProject,
  WorkspaceRole,
} from '@/features/workspace/types'
import {
  emptyWorkspaceHomeSnapshot,
  type WorkspaceContract,
  type WorkspaceContractListResponse,
  type WorkspaceHomeActivity,
  type WorkspaceHomeError,
  type WorkspaceHomeKpis,
  type WorkspaceHomeSnapshot,
  type WorkspaceInvoice,
  type WorkspaceInvoiceListResponse,
  type WorkspaceProposal,
  type WorkspaceProposalListResponse,
} from '@/features/workspace/home-types'

const client = new ServiceApisBrowserClient()
const WORKSPACE_ROOT = '/api/v1/workspace'

/** Endpoints that 404 on the live branch (W4/W5/W11 not yet landed in some
 *  environments). Treated as empty-list rather than an error so the home
 *  aggregator still renders. The `serviceUnavailable` flag does NOT flip on
 *  404 — that's a normal "no data yet" condition. */
const NOT_YET_LANDED_ENDPOINTS = new Set([
  '/me/proposals',
  '/me/contracts',
  '/me/invoices',
])

type ApiResult<T> = { ok: true; data: T } | NormalizedError

async function get<T>(path: string): Promise<ApiResult<T>> {
  return client.get<T>(`${WORKSPACE_ROOT}${path}`, { requireAuth: true })
}

function isServiceUnavailable(err: NormalizedError): boolean {
  if (err.status === 0) return true
  if (err.status === 503) return true
  if (err.error.code === 'NOT_CONFIGURED') return true
  if (err.error.code === 'CIRCUIT_OPEN') return true
  if (isCircuitOpen(err)) return true
  return false
}

function toError(endpoint: string, err: NormalizedError): WorkspaceHomeError {
  return {
    endpoint,
    status: err.status,
    code: err.error.code,
    message: err.error.message,
  }
}

/** Whether a 404 from `endpoint` should be silently swallowed because the
 *  endpoint isn't expected to exist on the current branch. */
function isNotYetLanded(endpoint: string, err: NormalizedError): boolean {
  return err.status === 404 && NOT_YET_LANDED_ENDPOINTS.has(endpoint)
}

function computeKpis(args: {
  engagements: WorkspaceEngagement[]
  projects: WorkspaceProject[]
  conversations: WorkspaceConversation[]
  proposals: WorkspaceProposal[]
  contracts: WorkspaceContract[]
  invoices: WorkspaceInvoice[]
}): WorkspaceHomeKpis {
  const openEngagements = args.engagements.filter((e) => e.status === 'active').length

  // The live `WorkspaceProject.status` enum is `draft | proposed | accepted |
  // declined | withdrawn | cancelled`. The §8.W9 brief calls for
  // "status === 'in_progress'", which is the future state per the §5 W3
  // milestones design. We count `accepted` today AND treat any future
  // `in_progress` value as in-flight work so the KPI doesn't regress when W3
  // lands.
  const activeProjects = args.projects.filter((p) => {
    const status = String(p.status)
    return status === 'in_progress' || status === 'accepted'
  }).length

  // Unread messages proxy: conversations with no `lastMessageAt` are
  // brand-new (0 messages); otherwise count them — the dashboard's exact
  // "unread" logic depends on `lastReadAt`, which isn't on this client-side
  // payload, so we expose a best-effort count and flag the KPI as
  // best-effort in the UI.
  const unreadMessages = args.conversations.filter((c) => Boolean(c.lastMessageAt)).length

  const proposalsAwaitingBuyer = args.proposals.filter((p) => p.status === 'sent').length
  const contractsAwaitingSign = args.contracts.filter(
    (c) => c.status === 'draft' || c.status === 'sent',
  ).length
  const invoicesAwaitingPayment = args.invoices.filter(
    (i) => i.status === 'sent' || i.status === 'overdue',
  ).length
  const pendingDecisions =
    proposalsAwaitingBuyer + contractsAwaitingSign + invoicesAwaitingPayment

  return {
    openEngagements,
    activeProjects,
    unreadMessages,
    pendingDecisions,
  }
}

function buildRecentActivity(args: {
  engagements: WorkspaceEngagement[]
  proposals: WorkspaceProposal[]
  contracts: WorkspaceContract[]
  invoices: WorkspaceInvoice[]
  viewerRole: WorkspaceRole | null
  limit?: number
}): WorkspaceHomeActivity[] {
  const limit = args.limit ?? 10
  const out: WorkspaceHomeActivity[] = []

  for (const e of args.engagements) {
    out.push({
      id: `engagement:${e.id}`,
      kind: 'engagement',
      createdAt: e.updatedAt ?? e.createdAt ?? '',
      title: `Engagement updated`,
      detail: e.expertDisplayName ?? e.buyerDisplayName ?? null,
      href: `/workspace/engagements`,
    })
  }

  for (const p of args.proposals) {
    out.push({
      id: `proposal:${p.id}`,
      kind: 'proposal',
      createdAt: p.sentAt ?? p.updatedAt ?? p.createdAt,
      title: p.title,
      detail: `Proposal · ${statusLabelForViewer(p.status, args.viewerRole)}`,
      href: `/workspace/proposals`,
    })
  }

  for (const c of args.contracts) {
    out.push({
      id: `contract:${c.id}`,
      kind: 'contract',
      createdAt: c.updatedAt ?? c.createdAt,
      title: `Contract ${statusLabelForViewer(c.status, args.viewerRole)}`,
      detail: null,
      href: `/workspace/contracts`,
    })
  }

  for (const i of args.invoices) {
    out.push({
      id: `invoice:${i.id}`,
      kind: 'invoice',
      createdAt: i.paidAt ?? i.createdAt,
      title: `Invoice ${statusLabelForViewer(i.status, args.viewerRole)}`,
      detail: i.totalCents ? `Total ${(i.totalCents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}` : null,
      href: `/workspace/invoices`,
    })
  }

  out.sort((a, b) => toTime(b.createdAt) - toTime(a.createdAt))
  return out.slice(0, limit)
}

function toTime(iso?: string | null): number {
  if (!iso) return 0
  const t = new Date(iso).getTime()
  return Number.isNaN(t) ? 0 : t
}

/**
 * useWorkspaceHome
 *
 * Aggregates the home-page fan-out for `feat-workspace`:
 *   - dashboard payload (counts + recent)
 *   - engagements, projects, conversations, proposals, contracts, invoices
 *   - notifications
 *
 * Each read is debounced by React's effect lifecycle (mounted once per role
 * resolution). The hook exposes `isLoading` while the first fan-out is
 * in-flight and `serviceUnavailable` when ANY call returns
 * 503/NOT_CONFIGURED/CIRCUIT_OPEN/NETWORK_ERROR — the home page renders a
 * visible badge for that case (per the diagnostic finding that the server
 * client silently swallows `SERVICE_APIS_BASE_URL` being unset).
 *
 * IMPORTANT: does not call `getApplication()` directly. Role is resolved
 * via `useCurrentUserRole()` which deduplicates within a tick. (See
 * §3 diagnostic in the workspace-completion-harness.)
 */
export function useWorkspaceHome(): WorkspaceHomeSnapshot {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const [snapshot, setSnapshot] = useState<WorkspaceHomeSnapshot>(
    emptyWorkspaceHomeSnapshot,
  )

  useEffect(() => {
    if (state.isPending || !state.user) return
    let cancelled = false

    async function load() {
      setSnapshot((prev) => ({ ...prev, isLoading: true, errors: [], serviceUnavailable: false }))

      const errors: WorkspaceHomeError[] = []
      let serviceUnavailable = false

      // Fan out the must-have reads. We still call `workspace.*` for the
      // collections that the rest of the app already wires so we don't fork
      // the schema or replace methods that other streams own.
      const [
        engagementResult,
        projectResult,
        conversationResult,
        meetingResult,
        proposalResult,
        contractResult,
        invoiceResult,
        notificationResult,
      ] = await Promise.all([
        workspace.listEngagements(),
        workspace.listProjects(),
        workspace.listConversations(),
        workspace.listMeetings(),
        get<WorkspaceProposalListResponse>('/me/proposals'),
        get<WorkspaceContractListResponse>('/me/contracts'),
        get<WorkspaceInvoiceListResponse>('/me/invoices'),
        get<{ notifications: WorkspaceNotification[] }>('/notifications/me'),
      ])

      if (cancelled) return

      // ─── Engagements ────────────────────────────────────────────────
      let engagements: WorkspaceEngagement[] = []
      if (engagementResult.ok) {
        engagements = engagementResult.data.engagements
      } else {
        if (isServiceUnavailable(engagementResult)) serviceUnavailable = true
        errors.push(toError('/me/engagements', engagementResult))
      }

      // ─── Projects ───────────────────────────────────────────────────
      let projects: WorkspaceProject[] = []
      if (projectResult.ok) {
        projects = projectResult.data.projects
      } else {
        if (isServiceUnavailable(projectResult)) serviceUnavailable = true
        errors.push(toError('/me/projects', projectResult))
      }

      // ─── Conversations ─────────────────────────────────────────────
      let conversations: WorkspaceConversation[] = []
      if (conversationResult.ok) {
        conversations = conversationResult.data.conversations
      } else {
        if (isServiceUnavailable(conversationResult)) serviceUnavailable = true
        errors.push(toError('/me/conversations', conversationResult))
      }

      // ─── Meetings ───────────────────────────────────────────────────
      let meetings: WorkspaceMeeting[] = []
      if (meetingResult.ok) {
        meetings = meetingResult.data.meetings
      } else {
        if (isServiceUnavailable(meetingResult)) serviceUnavailable = true
        errors.push(toError('/me/meetings', meetingResult))
      }

      // ─── Proposals (404-safe for W11) ───────────────────────────────
      let proposals: WorkspaceProposal[] = []
      if (proposalResult.ok) {
        proposals = proposalResult.data.proposals
      } else if (isNotYetLanded('/me/proposals', proposalResult)) {
        proposals = []
      } else {
        if (isServiceUnavailable(proposalResult)) serviceUnavailable = true
        errors.push(toError('/me/proposals', proposalResult))
      }

      // ─── Contracts (404-safe for W4) ────────────────────────────────
      let contracts: WorkspaceContract[] = []
      if (contractResult.ok) {
        contracts = contractResult.data.contracts
      } else if (isNotYetLanded('/me/contracts', contractResult)) {
        contracts = []
      } else {
        if (isServiceUnavailable(contractResult)) serviceUnavailable = true
        errors.push(toError('/me/contracts', contractResult))
      }

      // ─── Invoices (404-safe for W5) ─────────────────────────────────
      let invoices: WorkspaceInvoice[] = []
      if (invoiceResult.ok) {
        invoices = invoiceResult.data.invoices
      } else if (isNotYetLanded('/me/invoices', invoiceResult)) {
        invoices = []
      } else {
        if (isServiceUnavailable(invoiceResult)) serviceUnavailable = true
        errors.push(toError('/me/invoices', invoiceResult))
      }

      // ─── Notifications ──────────────────────────────────────────────
      let notifications: WorkspaceNotification[] = []
      if (notificationResult.ok) {
        notifications = notificationResult.data.notifications
      } else {
        if (isServiceUnavailable(notificationResult)) serviceUnavailable = true
        errors.push(toError('/notifications/me', notificationResult))
      }

      // The dashboard endpoint is the single source of truth for counts on
      // the live API, but we treat it as advisory only — KPI numbers are
      // recomputed from the per-resource payloads above so they reflect
      // what the user actually has permission to see. We still issue a GET
      // so the dashboard payload surfaces any service-wide errors visibly.
      const dashboardResult = await client.get<{ scope?: string; counts?: Record<string, number> }>(
        `${WORKSPACE_ROOT}/me/dashboard`,
        { requireAuth: true },
      )
      if (cancelled) return
      if (!dashboardResult.ok) {
        if (isServiceUnavailable(dashboardResult)) serviceUnavailable = true
        // Dashboard failures are advisory — log but don't block the home.
        errors.push(toError('/me/dashboard', dashboardResult))
      }

      const kpis = computeKpis({
        engagements,
        projects,
        conversations,
        proposals,
        contracts,
        invoices,
      })

      const recentActivity = buildRecentActivity({
        engagements,
        proposals,
        contracts,
        invoices,
        viewerRole: state.role,
      })

      const unreadNotifications = notifications.filter(
        (n) => n.status === 'pending',
      ).length

      if (cancelled) return

      setSnapshot({
        kpis,
        recentActivity,
        unreadNotifications,
        engagements,
        projects,
        conversations,
        proposals,
        contracts,
        invoices,
        meetings,
        notifications,
        errors,
        serviceUnavailable,
        isLoading: false,
      })
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [state.expert?.id, state.isPending, state.user, workspace])

  return snapshot
}
