'use client'

import { useCallback, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  Download,
  Globe,
  Lock,
  Search,
  Send,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  DashboardShell,
} from '@/components/experts/dashboard/ExpertDashboardFrame'
import { useClients } from '@/lib/clients/clients-store'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Client, InvoiceStatus, Project } from '@/hooks/types/clients-contracts'

/* Full §7.8 payout status model */
type EarningStatus =
  | 'Awaiting client payment'
  | 'Held in escrow'
  | 'Milestone approved'
  | 'Payout pending'
  | 'Paid out'
  | 'Failed'
  | 'Refunded'
  | 'Disputed'

const STATUS_COLOR: Record<EarningStatus, string> = {
  'Awaiting client payment': '#f79009',
  'Held in escrow': '#6938ef',
  'Milestone approved': '#0086c0',
  'Payout pending': '#155eef',
  'Paid out': '#17b26a',
  Failed: '#f04438',
  Refunded: '#717680',
  Disputed: '#dd2590',
}
const ALL_STATUSES = Object.keys(STATUS_COLOR) as EarningStatus[]

// invoices only carry draft/sent/paid → map to the payout lifecycle.
const fromInvoiceStatus = (s: InvoiceStatus): EarningStatus =>
  s === 'paid' ? 'Paid out' : s === 'sent' ? 'Held in escrow' : 'Awaiting client payment'

const PAID = (s: EarningStatus) => s === 'Paid out'
const PENDING = (s: EarningStatus) =>
  s === 'Awaiting client payment' || s === 'Held in escrow' || s === 'Milestone approved' || s === 'Payout pending'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CURRENT_MONTH = 5 // June 2026 (the app's "today")

type Txn = {
  id: string
  clientId: string
  clientName: string
  brand: string
  projectId: string
  projectName: string
  date: string
  amountCents: number // subtotal
  feeCents: number
  netCents: number
  status: EarningStatus
}

/* ── Escrow lifecycle ──────────────────────────────────────────────────
   Money moves Funded → Held → Released → Paid out. We derive each stage
   from the payout statuses already present on a transaction. */
type EscrowStage = 'Funded' | 'Held' | 'Released' | 'Paid out'

const ESCROW_STAGES: {
  stage: EscrowStage
  blurb: string
  color: string
  icon: typeof Wallet
  match: (s: EarningStatus) => boolean
}[] = [
  { stage: 'Funded', blurb: 'Client paid into escrow', color: '#f79009', icon: Wallet, match: (s) => s === 'Awaiting client payment' },
  { stage: 'Held', blurb: 'Secured while you work', color: '#6938ef', icon: ShieldCheck, match: (s) => s === 'Held in escrow' },
  { stage: 'Released', blurb: 'Approved on acceptance', color: '#0086c0', icon: CheckCircle2, match: (s) => s === 'Milestone approved' || s === 'Payout pending' },
  { stage: 'Paid out', blurb: 'Settled to your account', color: '#17b26a', icon: Send, match: (s) => s === 'Paid out' },
]

/* ── FX (multi-currency payout preview) ────────────────────────────────
   Proploy locks the rate at release and charges a flat conversion fee. */
const FX = {
  currency: 'EUR',
  symbol: '€',
  rate: 0.92, // 1 USD → 0.92 EUR, locked at release
  feePct: 0.4, // flat conversion fee
}

const formatFx = (cents: number) =>
  `${FX.symbol}${((cents || 0) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

/* CSV-safe field (quote + escape embedded quotes). */
const csvCell = (v: string | number) => {
  const s = String(v)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const money = (cents: number) => ((cents || 0) / 100).toFixed(2)

export default function EarningsPage() {
  const { clients, projects } = useClients()
  const [tab, setTab] = useState<'All' | EarningStatus>('All')
  const [query, setQuery] = useState('')

  const txns = useMemo<Txn[]>(() => {
    const clientMap = new Map(clients.map((c) => [c.id, c]))
    return projects
      .filter((p): p is Project & { invoice: NonNullable<Project['invoice']> } => !!p.invoice)
      .map((p) => {
        const c = clientMap.get(p.clientId) as Client | undefined
        return {
          id: p.invoice.id,
          clientId: p.clientId,
          clientName: c?.name ?? 'Client',
          brand: c?.brand ?? '#155eef',
          projectId: p.id,
          projectName: p.name,
          date: p.invoice.issuedDate,
          amountCents: p.invoice.subtotalCents,
          feeCents: p.invoice.feeCents,
          netCents: p.invoice.totalCents,
          status: fromInvoiceStatus(p.invoice.status),
        }
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1))
  }, [clients, projects])

  const metrics = useMemo(() => {
    const totalEarned = txns.filter((t) => PAID(t.status)).reduce((s, t) => s + t.netCents, 0)
    const pending = txns.filter((t) => PENDING(t.status)).reduce((s, t) => s + t.netCents, 0)
    const fees = txns.reduce((s, t) => s + t.feeCents, 0)
    const monthNet = (m: number) =>
      txns.filter((t) => new Date(t.date + 'T00:00:00').getMonth() === m).reduce((s, t) => s + t.netCents, 0)
    const thisMonth = monthNet(CURRENT_MONTH)
    const lastMonth = monthNet(CURRENT_MONTH - 1)
    const delta = lastMonth ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : null
    return { totalEarned, pending, fees, thisMonth, delta }
  }, [txns])

  const monthly = useMemo(() => {
    const arr = new Array(12).fill(0)
    txns.forEach((t) => { arr[new Date(t.date + 'T00:00:00').getMonth()] += t.netCents })
    return arr
  }, [txns])

  // Escrow lifecycle: count + value at each stage of the money pipeline.
  const escrow = useMemo(
    () =>
      ESCROW_STAGES.map((stage) => {
        const matched = txns.filter((t) => stage.match(t.status))
        return {
          ...stage,
          count: matched.length,
          amountCents: matched.reduce((s, t) => s + t.netCents, 0),
        }
      }),
    [txns],
  )

  // FX preview — locked-rate conversion on the most recent paid-out payout.
  const fxPreview = useMemo(() => {
    const lastPaid = txns.find((t) => PAID(t.status)) ?? txns[0]
    if (!lastPaid) return null
    const usdCents = lastPaid.netCents
    const convFeeCents = Math.round(usdCents * (FX.feePct / 100))
    const convertedCents = Math.round((usdCents - convFeeCents) * FX.rate)
    return { projectName: lastPaid.projectName, usdCents, convFeeCents, convertedCents }
  }, [txns])

  // Currency split — illustrative breakdown of where payouts settle.
  const currencyBreakdown = useMemo(() => {
    const paidTotal = txns.filter((t) => PAID(t.status)).reduce((s, t) => s + t.netCents, 0) || 1
    return [
      { code: 'USD', label: 'US Dollar', pct: 72, color: '#155eef' },
      { code: 'EUR', label: 'Euro', pct: 19, color: '#6938ef' },
      { code: 'GBP', label: 'Pound Sterling', pct: 9, color: '#0086c0' },
    ].map((c) => ({ ...c, amountCents: Math.round((paidTotal * c.pct) / 100) }))
  }, [txns])

  const exportStatement = useCallback(() => {
    const header = ['Date', 'Client', 'Project', 'Invoice', 'Gross (USD)', 'Platform fee (USD)', 'Net payout (USD)', 'Status']
    const rows = txns.map((t) => [
      t.date,
      t.clientName,
      t.projectName,
      t.id,
      money(t.amountCents),
      money(t.feeCents),
      money(t.netCents),
      t.status,
    ])
    const totals = [
      'Totals', '', '', '',
      money(txns.reduce((s, t) => s + t.amountCents, 0)),
      money(txns.reduce((s, t) => s + t.feeCents, 0)),
      money(txns.reduce((s, t) => s + t.netCents, 0)),
      '',
    ]
    const csv = [header, ...rows, totals]
      .map((r) => r.map(csvCell).join(','))
      .join('\r\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `proploy-earnings-statement-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [txns])

  const filtered = txns
    .filter((t) => (tab === 'All' ? true : t.status === tab))
    .filter((t) => {
      if (!query) return true
      const q = query.toLowerCase()
      return t.clientName.toLowerCase().includes(q) || t.projectName.toLowerCase().includes(q)
    })

  const presentStatuses = ALL_STATUSES.filter((s) => txns.some((t) => t.status === s))

  return (
    <DashboardShell>
      <div className="flex-1 min-w-0">
        <div className="max-w-[1280px] mx-auto px-[32px] py-[32px] flex flex-col gap-[24px]">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-[16px]">
            <div className="flex flex-col gap-[4px]">
              <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">Earnings</h1>
              <p className="font-normal text-[16px] leading-[24px] text-[#535862]">
                Payments, platform fees and payouts across your projects.
              </p>
            </div>
            <button
              type="button"
              onClick={exportStatement}
              disabled={txns.length === 0}
              className={`flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] text-[#414651] disabled:opacity-50 disabled:cursor-not-allowed ${BUTTON_SKEUO}`}
            >
              <Download size={18} className="text-[#717680]" /> Export statement
            </button>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
            <Metric label="Total earned" value={formatCurrency(metrics.totalEarned)} />
            <Metric label="Pending payout" value={formatCurrency(metrics.pending)} />
            <Metric label="Paid this month" value={formatCurrency(metrics.thisMonth)} delta={metrics.delta} />
            <Metric label="Platform fees" value={formatCurrency(metrics.fees)} muted />
          </div>

          {/* Escrow lifecycle */}
          <section className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[24px] flex flex-col gap-[20px] ${CARD_SHADOW}`}>
            <div className="flex flex-wrap items-center justify-between gap-[8px]">
              <div className="flex flex-col gap-[2px]">
                <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Escrow lifecycle</p>
                <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                  Every milestone is funded up-front, held securely, then released to you on acceptance.
                </p>
              </div>
              <span className="inline-flex items-center gap-[6px] rounded-full border border-[#e9eaeb] bg-[#fafafa] px-[10px] py-[4px] text-[12px] font-medium text-[#414651]">
                <ShieldCheck size={14} className="text-[#17b26a]" /> Funds protected by Proploy escrow
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
              {escrow.map((s, i) => {
                const Icon = s.icon
                return (
                  <div key={s.stage} className="relative flex flex-col gap-[10px] rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[16px]">
                    {i < escrow.length - 1 && (
                      <span className="hidden lg:block absolute top-1/2 -right-[7px] -translate-y-1/2 text-[#d5d7da]">→</span>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex size-[32px] items-center justify-center rounded-full" style={{ background: `${s.color}1a`, color: s.color }}>
                        <Icon size={17} />
                      </span>
                      <span className="rounded-full border border-[#e9eaeb] bg-white px-[8px] py-[1px] text-[12px] font-medium text-[#414651] tabular-nums">
                        {s.count}
                      </span>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{s.stage}</p>
                      <p className="font-normal text-[12px] leading-[16px] text-[#717680]">{s.blurb}</p>
                    </div>
                    <p className="font-semibold text-[18px] leading-[26px] text-[#181d27] tabular-nums">{formatCurrency(s.amountCents)}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Multi-currency / FX */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
            <section className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[24px] flex flex-col gap-[16px] ${CARD_SHADOW}`}>
              <div className="flex items-center gap-[8px]">
                <Globe size={18} className="text-[#155eef]" />
                <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Multi-currency payout</p>
              </div>
              {fxPreview ? (
                <>
                  <p className="font-normal text-[14px] leading-[20px] text-[#535862]">
                    Get paid in your local currency. We lock the rate the moment a milestone is released — no surprises.
                  </p>
                  <div className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[16px] flex flex-col gap-[10px]">
                    <p className="text-[12px] font-medium text-[#717680] truncate">{fxPreview.projectName}</p>
                    <FxRow label="Net payout" value={formatCurrency(fxPreview.usdCents)} />
                    <FxRow label={`Conversion fee (${FX.feePct}% flat)`} value={`-${formatCurrency(fxPreview.convFeeCents)}`} muted />
                    <div className="flex items-center gap-[6px] text-[12px] text-[#717680]">
                      <Lock size={12} className="text-[#155eef]" />
                      Rate locked: 1 USD = {FX.rate.toFixed(2)} {FX.currency}
                    </div>
                    <div className="border-t border-[#e9eaeb] pt-[10px] flex items-center justify-between">
                      <span className="text-[14px] font-semibold text-[#181d27]">You receive</span>
                      <span className="text-[18px] font-semibold text-[#181d27] tabular-nums">{formatFx(fxPreview.convertedCents)}</span>
                    </div>
                  </div>
                </>
              ) : (
                <p className="font-normal text-[14px] leading-[20px] text-[#717680]">No payouts to convert yet.</p>
              )}
            </section>

            <section className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[24px] flex flex-col gap-[16px] ${CARD_SHADOW}`}>
              <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Settlement by currency</p>
              <div className="flex flex-col gap-[14px]">
                {currencyBreakdown.map((c) => (
                  <div key={c.code} className="flex flex-col gap-[6px]">
                    <div className="flex items-center justify-between text-[14px]">
                      <span className="flex items-center gap-[8px]">
                        <span className="size-[8px] rounded-full" style={{ background: c.color }} />
                        <span className="font-medium text-[#181d27]">{c.code}</span>
                        <span className="text-[#717680]">{c.label}</span>
                      </span>
                      <span className="font-semibold text-[#181d27] tabular-nums">{formatCurrency(c.amountCents)}</span>
                    </div>
                    <div className="h-[6px] rounded-full bg-[#e9eaeb] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="font-normal text-[12px] leading-[16px] text-[#717680]">
                One transparent flat fee per conversion. No hidden spread.
              </p>
            </section>
          </div>

          {/* Chart */}
          <section className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[24px] flex flex-col gap-[20px] ${CARD_SHADOW}`}>
            <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Earnings by month</p>
            <EarningsChart monthly={monthly} />
          </section>

          {/* Transactions */}
          <section className={`bg-white border border-[#e9eaeb] rounded-[12px] overflow-hidden ${CARD_SHADOW}`}>
            <div className="flex flex-wrap items-center justify-between gap-[12px] px-[24px] pt-[20px] pb-[16px]">
              <p className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Transactions</p>
              <div className="relative">
                <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717680]" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className={`w-[220px] bg-white border border-[#d5d7da] rounded-[8px] pl-[36px] pr-[12px] py-[9px] text-[14px] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`} />
              </div>
            </div>

            {/* status filter chips */}
            <div className="flex flex-wrap items-center gap-[8px] px-[24px] pb-[16px]">
              <Chip label="All" active={tab === 'All'} onClick={() => setTab('All')} />
              {(presentStatuses.length ? presentStatuses : ALL_STATUSES).map((s) => (
                <Chip key={s} label={s} color={STATUS_COLOR[s]} active={tab === s} onClick={() => setTab(s)} />
              ))}
            </div>

            <div className="overflow-x-auto border-t border-[#e9eaeb]">
              <table className="w-full min-w-[860px] border-collapse">
                <thead>
                  <tr className="bg-[#fafafa] border-b border-[#e9eaeb] text-left">
                    <Th className="pl-[24px]">Date</Th><Th>Client</Th><Th>Project</Th>
                    <Th>Amount</Th><Th>Platform fee</Th><Th>Net payout</Th><Th className="pr-[24px]">Status</Th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t) => (
                    <tr key={t.id} className="border-b border-[#e9eaeb] last:border-b-0 hover:bg-[#fafafa]">
                      <Td className="pl-[24px]"><span className="text-[13px] text-[#414651]">{formatDate(t.date)}</span></Td>
                      <Td>
                        <div className="flex items-center gap-[10px]">
                          <span className="size-[28px] rounded-full flex items-center justify-center text-white font-semibold text-[11px]" style={{ background: t.brand }}>{t.clientName.charAt(0)}</span>
                          <span className="text-[14px] text-[#181d27]">{t.clientName}</span>
                        </div>
                      </Td>
                      <Td>
                        <Link href={`/experts/dashboard/clients/${t.clientId}/projects/${t.projectId}`} className="text-[13px] text-[#155eef] hover:underline">{t.projectName}</Link>
                      </Td>
                      <Td><span className="text-[13px] text-[#181d27] tabular-nums">{formatCurrency(t.amountCents)}</span></Td>
                      <Td><span className="text-[13px] text-[#717680] tabular-nums">-{formatCurrency(t.feeCents)}</span></Td>
                      <Td><span className="text-[13px] font-semibold text-[#181d27] tabular-nums">{formatCurrency(t.netCents)}</span></Td>
                      <Td className="pr-[24px]"><StatusPill status={t.status} /></Td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="px-[24px] py-[48px] text-center">
                      <div className="flex flex-col items-center gap-[10px] text-[#717680]">
                        <div className="size-[44px] rounded-full bg-[#eff4ff] flex items-center justify-center text-[#155eef]"><Wallet size={22} /></div>
                        <p className="text-[14px]">{txns.length === 0 ? 'No earnings yet.' : 'No transactions match this filter.'}</p>
                        {txns.length === 0 && (
                          <Link href="/experts/dashboard/clients" className="text-[14px] font-semibold text-[#155eef]">Generate an invoice from a project →</Link>
                        )}
                      </div>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  )
}

function Metric({ label, value, delta, muted }: { label: string; value: string; delta?: number | null; muted?: boolean }) {
  const up = (delta ?? 0) >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <div className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[20px] flex flex-col gap-[8px] ${CARD_SHADOW}`}>
      <p className="font-medium text-[14px] text-[#414651]">{label}</p>
      <div className="flex items-end justify-between gap-[8px]">
        <p className={`font-semibold text-[28px] leading-[36px] tabular-nums ${muted ? 'text-[#535862]' : 'text-[#181d27]'}`}>{value}</p>
        {delta != null && (
          <span className={`inline-flex items-center gap-[2px] rounded-full border border-[#e9eaeb] px-[6px] py-[1px] text-[12px] font-medium ${up ? 'text-[#17b26a]' : 'text-[#f04438]'}`}>
            <Icon size={13} />{Math.abs(delta)}%
          </span>
        )}
      </div>
    </div>
  )
}

function EarningsChart({ monthly }: { monthly: number[] }) {
  const max = Math.max(...monthly, 1)
  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex items-end justify-between gap-[8px] h-[200px]">
        {monthly.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end items-center h-full" title={v ? `$${(v / 100).toLocaleString()}` : ''}>
            <div className="w-full max-w-[40px] rounded-t-[6px] bg-[#155eef]" style={{ height: `${(v / max) * 100}%`, minHeight: v ? '4px' : '0' }} />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {MONTHS.map((m) => <span key={m} className="flex-1 text-center text-[12px] font-medium text-[#717680]">{m}</span>)}
      </div>
    </div>
  )
}

function FxRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[14px]">
      <span className="text-[#535862]">{label}</span>
      <span className={`tabular-nums ${muted ? 'text-[#717680]' : 'text-[#181d27]'}`}>{value}</span>
    </div>
  )
}

function StatusPill({ status }: { status: EarningStatus }) {
  return (
    <span className="inline-flex items-center gap-[6px] rounded-full border border-[#e9eaeb] bg-white px-[8px] py-[2px] text-[12px] font-medium text-[#414651] whitespace-nowrap">
      <span className="size-[7px] rounded-full" style={{ background: STATUS_COLOR[status] }} />
      {status}
    </span>
  )
}

function Chip({ label, color, active, onClick }: { label: string; color?: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`inline-flex items-center gap-[6px] rounded-full border px-[10px] py-[4px] text-[13px] font-medium transition-colors ${active ? 'border-[#155eef] bg-[#eff4ff] text-[#155eef]' : 'border-[#e9eaeb] bg-white text-[#414651] hover:bg-[#fafafa]'}`}>
      {color && <span className="size-[7px] rounded-full" style={{ background: color }} />}
      {label}
    </button>
  )
}

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <th className={`font-medium text-[12px] text-[#717680] px-[16px] py-[12px] ${className}`}>{children}</th>
}
function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-[16px] py-[14px] align-middle ${className}`}>{children}</td>
}
