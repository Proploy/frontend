'use client'

import { useEffect, useMemo, useState } from 'react'
import { LockKeyhole, RefreshCw, TrendingUp } from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import {
  money,
  statusLabel,
} from '@/components/workspace/workspace-format'
import { useCurrentUserRole, useWorkspace } from '@/features/workspace'
import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type {
  ContractStatus,
  InvoiceStatus,
  ProposalStatus,
  WorkspaceContract,
  WorkspaceContractListResponse,
  WorkspaceInvoice,
  WorkspaceInvoiceListResponse,
  WorkspaceProposal,
  WorkspaceProposalListResponse,
} from '@/features/workspace/home-types'
import type { EngagementStatus, WorkspaceEngagement } from '@/features/workspace/types'

const client = new ServiceApisBrowserClient()

type StatusBucket<K extends string> = { status: K; label: string; count: number }

const ENGAGEMENT_ORDER: EngagementStatus[] = ['active', 'paused', 'closed']
const CONTRACT_ORDER: ContractStatus[] = [
  'draft',
  'sent',
  'buyer_signed',
  'expert_signed',
  'completed',
  'cancelled',
  'declined',
]
const INVOICE_ORDER: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue', 'cancelled']
const PROPOSAL_ORDER: ProposalStatus[] = [
  'draft',
  'sent',
  'accepted',
  'declined',
  'withdrawn',
  'superseded',
  'archived',
]

function bucketCounts<K extends string>(
  rows: { status: K }[],
  order: K[],
): StatusBucket<K>[] {
  return order.map((status) => ({
    status,
    label: statusLabel(status),
    count: rows.filter((row) => row.status === status).length,
  }))
}

const BAR_HEIGHT = 16
const BAR_GAP = 10
const LABEL_WIDTH = 140
const VALUE_WIDTH = 40
const CHART_WIDTH = 560
const CHART_PADDING_X = 16

function StatusBarChart<K extends string>({
  title,
  rows,
  accent,
  total,
}: {
  title: string
  rows: StatusBucket<K>[]
  accent: string
  total: number
}) {
  const innerWidth = CHART_WIDTH - LABEL_WIDTH - VALUE_WIDTH - CHART_PADDING_X * 2
  const maxCount = Math.max(1, ...rows.map((row) => row.count))
  const chartHeight = rows.length * (BAR_HEIGHT + BAR_GAP) + BAR_GAP

  return (
    <div className="flex min-w-0 flex-col gap-[12px]">
      <div className="flex flex-wrap items-baseline justify-between gap-[8px]">
        <h3 className="text-[15px] font-semibold leading-[22px] text-[#181d27]">{title}</h3>
        <span className="text-[12px] leading-[18px] text-[#717680]">
          {total} total
        </span>
      </div>
      <div className="min-w-0 overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${chartHeight}`}
          role="img"
          aria-label={title}
          className="h-auto w-full min-w-[480px]"
        >
          {rows.map((row, index) => {
            const y = BAR_GAP + index * (BAR_HEIGHT + BAR_GAP)
            const width = (row.count / maxCount) * innerWidth
            return (
              <g key={row.status}>
                <text
                  x={CHART_PADDING_X}
                  y={y + BAR_HEIGHT * 0.7}
                  className="fill-[#535862] text-[12px] font-medium"
                >
                  {row.label}
                </text>
                <rect
                  x={CHART_PADDING_X + LABEL_WIDTH}
                  y={y}
                  width={Math.max(width, 1)}
                  height={BAR_HEIGHT}
                  rx={4}
                  fill={accent}
                  fillOpacity={row.count === 0 ? 0.25 : 1}
                />
                <text
                  x={CHART_WIDTH - CHART_PADDING_X}
                  y={y + BAR_HEIGHT * 0.7}
                  textAnchor="end"
                  className="fill-[#181d27] text-[12px] font-semibold"
                >
                  {row.count}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

export default function WorkspaceSalesPage() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const [engagements, setEngagements] = useState<WorkspaceEngagement[]>([])
  const [contracts, setContracts] = useState<WorkspaceContract[]>([])
  const [invoices, setInvoices] = useState<WorkspaceInvoice[]>([])
  const [proposals, setProposals] = useState<WorkspaceProposal[]>([])
  const [error, setError] = useState<NormalizedError | null>(null)
  const [loading, setLoading] = useState(false)
  const isExpertWorkspace = state.role === 'expert' || state.role === 'admin'

  useEffect(() => {
    if (state.isPending || !state.user || !isExpertWorkspace) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const [engagementResult, contractResult, invoiceResult, proposalResult] = await Promise.all([
        workspace.listEngagements(),
        client.get<WorkspaceContractListResponse>('/api/v1/workspace/me/contracts', {
          requireAuth: true,
        }),
        client.get<WorkspaceInvoiceListResponse>('/api/v1/workspace/me/invoices', {
          requireAuth: true,
        }),
        client.get<WorkspaceProposalListResponse>('/api/v1/workspace/me/proposals', {
          requireAuth: true,
        }),
      ])

      if (cancelled) return

      let nextError: NormalizedError | null = null

      if (engagementResult.ok) {
        setEngagements(engagementResult.data.engagements ?? [])
      } else {
        setEngagements([])
        nextError = engagementResult
      }

      if (contractResult.ok) {
        setContracts(contractResult.data.contracts ?? [])
      } else if (contractResult.status === 404) {
        // W4 not yet on this branch.
        setContracts([])
      } else {
        setContracts([])
        nextError = nextError ?? contractResult
      }

      if (invoiceResult.ok) {
        setInvoices(invoiceResult.data.invoices ?? [])
      } else if (invoiceResult.status === 404) {
        // W5 not yet on this branch.
        setInvoices([])
      } else {
        setInvoices([])
        nextError = nextError ?? invoiceResult
      }

      if (proposalResult.ok) {
        setProposals(proposalResult.data.proposals ?? [])
      } else if (proposalResult.status === 404) {
        // W11 not yet on this branch.
        setProposals([])
      } else {
        setProposals([])
        nextError = nextError ?? proposalResult
      }

      setError(nextError)
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [isExpertWorkspace, state.isPending, state.user, workspace])

  const engagementBuckets = useMemo(
    () => bucketCounts<EngagementStatus>(engagements, ENGAGEMENT_ORDER),
    [engagements],
  )
  const contractBuckets = useMemo(
    () => bucketCounts<ContractStatus>(contracts, CONTRACT_ORDER),
    [contracts],
  )
  const invoiceBuckets = useMemo(
    () => bucketCounts<InvoiceStatus>(invoices, INVOICE_ORDER),
    [invoices],
  )
  const proposalBuckets = useMemo(
    () => bucketCounts<ProposalStatus>(proposals, PROPOSAL_ORDER),
    [proposals],
  )

  const openEngagements = engagements.filter((e) => e.status === 'active').length
  const contractsAwaitingClose = contracts.filter(
    (c) => c.status === 'sent' || c.status === 'buyer_signed',
  ).length
  const proposalsSent = proposals.filter((p) => p.status === 'sent').length
  const paidRevenueCents = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + (i.totalCents ?? 0), 0)
  const billedCents = invoices.reduce((sum, i) => sum + (i.totalCents ?? 0), 0)

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace/sales" />

  if (!isExpertWorkspace) {
    return (
      <WorkspaceShell role={state.role}>
        <main className="flex min-h-[60vh] items-center justify-center px-[24px] py-[48px]">
          <div
            className={`max-w-[440px] rounded-[16px] border border-[#e9eaeb] bg-white p-[32px] text-center ${CARD_SHADOW}`}
          >
            <span className="mx-auto flex size-[56px] items-center justify-center rounded-full bg-[#eff4ff] text-[#155eef]">
              <LockKeyhole size={28} />
            </span>
            <h1 className="mt-[16px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              Sales report
            </h1>
            <p className="mt-[8px] text-[15px] leading-[24px] text-[#535862]">
              This section is for approved expert accounts.
            </p>
          </div>
        </main>
      </WorkspaceShell>
    )
  }

  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
          <div className="flex flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <TrendingUp size={22} className="text-[#155eef]" />
              Sales report
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-[10px]">
            <span className="inline-flex items-center gap-[8px] rounded-full bg-[#eff8ff] px-[12px] py-[6px] text-[13px] font-semibold leading-[18px] text-[#175cd3]">
              <span className="size-[8px] rounded-full bg-[#175cd3]" />
              {loading ? 'Refreshing…' : `${engagements.length} engagements`}
            </span>
            <button
              type="button"
              disabled
              className={`inline-flex cursor-not-allowed items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#a4a7ae] opacity-70 ${BUTTON_SKEUO}`}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </header>

        {error && (
          <div className="border-b border-[#fedf89] bg-[#fffaeb] px-[24px] py-[10px] text-[13px] leading-[18px] text-[#b54708]">
            {error.error.message || 'Unable to refresh sales report.'}
          </div>
        )}

        <div className="grid grid-cols-1 gap-[16px] px-[24px] py-[24px] md:grid-cols-2 xl:grid-cols-5">
          <SalesKpiCard
            title="Open engagements"
            value={String(openEngagements)}
            note={`${engagements.length} on file`}
            isLoading={loading}
          />
          <SalesKpiCard
            title="Contracts awaiting close"
            value={String(contractsAwaitingClose)}
            note="sent or buyer-signed"
            isLoading={loading}
          />
          <SalesKpiCard
            title="Proposals in 'sent'"
            value={String(proposalsSent)}
            note={`${proposals.length} total proposals`}
            isLoading={loading}
          />
          <SalesKpiCard
            title="Paid revenue"
            value={money(paidRevenueCents)}
            note="collected to date"
            isLoading={loading}
          />
          <SalesKpiCard
            title="Total billed"
            value={money(billedCents)}
            note={`${invoices.length} invoice${invoices.length === 1 ? '' : 's'}`}
            isLoading={loading}
          />
        </div>

        <div className="grid grid-cols-1 gap-[16px] px-[24px] pb-[24px] xl:grid-cols-3">
          <section className={`rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] ${CARD_SHADOW}`}>
            <StatusBarChart
              title="Revenue by status"
              rows={invoiceBuckets}
              accent="#155eef"
              total={invoices.length}
            />
          </section>
          <section className={`rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] ${CARD_SHADOW}`}>
            <StatusBarChart
              title="Proposals by status"
              rows={proposalBuckets}
              accent="#7a5af8"
              total={proposals.length}
            />
          </section>
          <section className={`rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] ${CARD_SHADOW}`}>
            <StatusBarChart
              title="Engagements by status"
              rows={engagementBuckets}
              accent="#17b26a"
              total={engagements.length}
            />
          </section>
        </div>
      </main>
    </WorkspaceShell>
  )
}

function SalesKpiCard({
  title,
  value,
  note,
  isLoading,
}: {
  title: string
  value: string
  note: string
  isLoading: boolean
}) {
  return (
    <section className={`rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] ${CARD_SHADOW}`}>
      <p className="text-[14px] font-medium leading-[20px] text-[#535862]">{title}</p>
      {isLoading ? (
        <span className="mt-[12px] block h-[32px] w-[120px] animate-pulse rounded-[6px] bg-[#f0f0f1]" aria-label="loading" />
      ) : (
        <p className="mt-[10px] text-[26px] font-semibold leading-[34px] text-[#181d27]">{value}</p>
      )}
      <p className="mt-[2px] text-[13px] leading-[18px] text-[#717680]">{note}</p>
    </section>
  )
}
