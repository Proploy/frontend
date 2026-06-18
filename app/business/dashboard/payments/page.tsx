'use client'

import { useState } from 'react'
import { AlertTriangle, Check, CreditCard, Download, Scale, Wallet, X } from 'lucide-react'
import { BusinessPage, BusinessPageHeader, BUTTON_SKEUO } from '@/components/business/dashboard/BusinessDashboardFrame'
import { Avatar, KpiCard, SectionCard, usd } from '@/components/business/dashboard/ui'
import {
  MOCK_BUSINESS_DASHBOARD,
  MOCK_DISPUTES,
  MOCK_SPEND_BY_MONTH,
  MOCK_SPEND_BY_PROJECT,
} from '@/lib/service-apis/business-dashboard-mock'
import type { Dispute, EscrowMilestone } from '@/lib/service-apis/business-dashboard-mock'

const ESCROW_STYLE: Record<string, { text: string; bg: string }> = {
  Funded: { text: '#004eeb', bg: '#eff4ff' },
  'In review': { text: '#b54708', bg: '#fffaeb' },
  Released: { text: '#067647', bg: '#ecfdf3' },
}

const DISPUTE_STYLE: Record<Dispute['state'], { text: string; bg: string }> = {
  Open: { text: '#b42318', bg: '#fef3f2' },
  'In mediation': { text: '#b54708', bg: '#fffaeb' },
  Resolved: { text: '#067647', bg: '#ecfdf3' },
}

export default function BusinessPaymentsPage() {
  const d = MOCK_BUSINESS_DASHBOARD
  const current = d.invoices[0]
  const totalEscrow = d.escrow.reduce((s, e) => s + e.amountCents, 0)

  const [disputes, setDisputes] = useState<Dispute[]>(MOCK_DISPUTES)
  const [disputeTarget, setDisputeTarget] = useState<EscrowMilestone | null>(null)
  const disputedKeys = new Set(disputes.map((x) => `${x.project}::${x.milestone}`))

  const exportCsv = () => {
    const header = ['Expert', 'Country', 'Work', 'Local amount', 'Currency', 'USD']
    const rows = current.lines.map((l) => [
      l.expert, l.country, l.description, String(l.amount), l.currency, (l.usdCents / 100).toFixed(2),
    ])
    const csv = [header, ...rows, ['', '', '', '', 'Total USD', (current.totalUsdCents / 100).toFixed(2)]]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${current.number}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const maxMonth = Math.max(...MOCK_SPEND_BY_MONTH.map((m) => m.cents))
  const maxProject = Math.max(...MOCK_SPEND_BY_PROJECT.map((p) => p.cents))

  return (
    <BusinessPage>
      <BusinessPageHeader
        title="Payments"
        subtitle="One consolidated statement across every expert and country. Fund milestones into escrow; release on acceptance."
        actions={
          <button
            type="button"
            onClick={exportCsv}
            className={`flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
          >
            <Download size={16} />
            Export CSV
          </button>
        }
      />

      <div className="mt-[24px] grid grid-cols-1 gap-[16px] sm:grid-cols-3">
        <KpiCard icon={<CreditCard size={18} />} label="Due this month" value={usd(current.totalUsdCents)} sub={`${current.period} · ${current.status}`} />
        <KpiCard icon={<Wallet size={18} />} label="Held in escrow" value={usd(totalEscrow)} sub={`${d.escrow.length} funded milestones`} />
        <KpiCard icon={<Check size={18} />} label="Paid last month" value={usd(d.invoices[1].totalUsdCents)} sub={d.invoices[1].period} />
      </div>

      {/* Spend analytics */}
      <div className="mt-[24px] grid grid-cols-1 gap-[24px] lg:grid-cols-2">
        <SectionCard title="Spend by month">
          <div className="flex items-end justify-between gap-[10px] px-[20px] py-[24px]" style={{ height: 200 }}>
            {MOCK_SPEND_BY_MONTH.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center justify-end gap-[8px]">
                <span className="text-[11px] font-medium text-[#717680]">${Math.round(m.cents / 100000) / 10}k</span>
                <div
                  className="w-full max-w-[36px] rounded-t-[6px] bg-[#155eef]"
                  style={{ height: `${(m.cents / maxMonth) * 130}px` }}
                />
                <span className="text-[12px] text-[#717680]">{m.month}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Spend by project">
          <ul className="flex flex-col gap-[14px] p-[20px]">
            {MOCK_SPEND_BY_PROJECT.map((p) => (
              <li key={p.project} className="flex flex-col gap-[6px]">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-[#414651]">{p.project}</span>
                  <span className="text-[#717680]">{usd(p.cents)}</span>
                </div>
                <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#f0f0f1]">
                  <div className="h-full rounded-full" style={{ width: `${(p.cents / maxProject) * 100}%`, background: p.color }} />
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="mt-[24px] grid grid-cols-1 gap-[24px] lg:grid-cols-[1.5fr_1fr]">
        {/* Consolidated invoice */}
        <SectionCard title={`Consolidated invoice · ${current.number}`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-[#f0f0f1] text-[12px] font-semibold uppercase tracking-[0.04em] text-[#717680]">
                  <th className="px-[20px] py-[12px]">Expert</th>
                  <th className="px-[20px] py-[12px]">Work</th>
                  <th className="px-[20px] py-[12px] text-right">Local</th>
                  <th className="px-[20px] py-[12px] text-right">USD</th>
                </tr>
              </thead>
              <tbody>
                {current.lines.map((l, i) => (
                  <tr key={i} className="border-b border-[#f0f0f1] hover:bg-[#fafafa]">
                    <td className="px-[20px] py-[14px]">
                      <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{l.expert}</p>
                      <p className="text-[12px] leading-[18px] text-[#717680]">{l.country}</p>
                    </td>
                    <td className="px-[20px] py-[14px] text-[14px] text-[#414651]">{l.description}</td>
                    <td className="px-[20px] py-[14px] text-right text-[14px] text-[#717680]">
                      {l.amount.toLocaleString()} {l.currency}
                    </td>
                    <td className="px-[20px] py-[14px] text-right text-[14px] font-medium text-[#181d27]">{usd(l.usdCents)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="px-[20px] py-[16px] text-right font-semibold text-[14px] text-[#414651]">Total (USD)</td>
                  <td className="px-[20px] py-[16px] text-right font-semibold text-[18px] text-[#181d27]">{usd(current.totalUsdCents)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-[12px] border-t border-[#f0f0f1] px-[20px] py-[16px]">
            <p className="text-[13px] leading-[18px] text-[#717680]">
              {current.lines.length} experts · {new Set(current.lines.map((l) => l.country)).size} countries · due {new Date(current.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
            </p>
            <button
              type="button"
              className={`flex items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
            >
              <Check size={16} />
              Approve & pay
            </button>
          </div>
        </SectionCard>

        {/* Escrow */}
        <SectionCard title="Escrow milestones">
          <ul className="divide-y divide-[#f0f0f1]">
            {d.escrow.map((e) => {
              const s = ESCROW_STYLE[e.state]
              const isDisputed = disputedKeys.has(`${e.project}::${e.milestone}`)
              return (
                <li key={e.id} className="flex items-start gap-[12px] px-[20px] py-[14px]">
                  <Avatar initial={e.expert.charAt(0)} color="#155eef" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-[14px] leading-[20px] text-[#181d27]">{e.milestone}</p>
                    <p className="text-[12px] leading-[18px] text-[#717680]">{e.project} · {e.expert}</p>
                    {!isDisputed && e.state !== 'Released' && (
                      <button
                        type="button"
                        onClick={() => setDisputeTarget(e)}
                        className="mt-[4px] inline-flex items-center gap-[4px] text-[12px] font-semibold text-[#b54708] hover:text-[#93370d]"
                      >
                        <Scale size={12} />
                        Raise dispute
                      </button>
                    )}
                    {isDisputed && (
                      <span className="mt-[4px] inline-flex items-center gap-[4px] text-[12px] font-semibold text-[#b42318]">
                        <AlertTriangle size={12} />
                        Disputed
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-[4px]">
                    <span className="font-semibold text-[14px] text-[#181d27]">{usd(e.amountCents)}</span>
                    <span className="rounded-full px-[8px] py-[1px] text-[12px] font-semibold leading-[18px]" style={{ color: s.text, background: s.bg }}>
                      {e.state}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </SectionCard>
      </div>

      {/* Disputes */}
      <div className="mt-[24px]">
        <SectionCard title={`Disputes · ${disputes.length}`}>
          {disputes.length === 0 ? (
            <p className="px-[20px] py-[24px] text-[14px] text-[#717680]">No open disputes. Funds release on milestone acceptance.</p>
          ) : (
            <ul className="divide-y divide-[#f0f0f1]">
              {disputes.map((dp) => {
                const s = DISPUTE_STYLE[dp.state]
                return (
                  <li key={dp.id} className="flex flex-wrap items-start gap-[12px] px-[20px] py-[16px]">
                    <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[8px] bg-[#fef3f2] text-[#b42318]">
                      <Scale size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-[8px]">
                        <p className="font-semibold text-[14px] leading-[20px] text-[#181d27]">{dp.milestone} · {dp.project}</p>
                        <span className="rounded-full px-[8px] py-[1px] text-[12px] font-semibold leading-[18px]" style={{ color: s.text, background: s.bg }}>
                          {dp.state}
                        </span>
                      </div>
                      <p className="text-[13px] leading-[18px] text-[#717680]">{dp.expert} · {dp.reason}</p>
                    </div>
                    <span className="font-semibold text-[14px] text-[#181d27]">{usd(dp.amountCents)}</span>
                  </li>
                )
              })}
            </ul>
          )}
        </SectionCard>
      </div>

      {disputeTarget && (
        <DisputeModal
          milestone={disputeTarget}
          onClose={() => setDisputeTarget(null)}
          onSubmit={(reason) => {
            setDisputes((prev) => [
              {
                id: `dp-${disputeTarget.id}`,
                project: disputeTarget.project,
                expert: disputeTarget.expert,
                milestone: disputeTarget.milestone,
                amountCents: disputeTarget.amountCents,
                reason,
                state: 'Open',
                opened: '2026-06-18',
              },
              ...prev,
            ])
            setDisputeTarget(null)
          }}
        />
      )}
    </BusinessPage>
  )
}

function DisputeModal({
  milestone,
  onClose,
  onSubmit,
}: {
  milestone: EscrowMilestone
  onClose: () => void
  onSubmit: (reason: string) => void
}) {
  const [reason, setReason] = useState('')
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-[16px]">
      <div className="absolute inset-0 bg-[#0a0d12]/40 backdrop-blur-[2px]" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-[460px] rounded-[16px] border border-[#e9eaeb] bg-white p-[24px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-[16px] top-[16px] inline-flex size-[32px] items-center justify-center rounded-[8px] text-[#717680] hover:bg-[#fafafa]">
          <X size={18} />
        </button>
        <h2 className="font-semibold text-[20px] leading-[28px] text-[#181d27]">Raise a dispute</h2>
        <p className="mt-[2px] text-[14px] leading-[20px] text-[#717680]">
          {milestone.milestone} · {milestone.project} · {usd(milestone.amountCents)} held in escrow
        </p>
        <label className="mt-[20px] flex flex-col gap-[6px]">
          <span className="text-[13px] font-medium text-[#414651]">What’s the issue?</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="Describe what was missed or incomplete. Proploy mediates before any release."
            className={`resize-none rounded-[8px] border border-[#d5d7da] px-[12px] py-[10px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
          />
        </label>
        <div className="mt-[20px] flex justify-end gap-[10px]">
          <button type="button" onClick={onClose} className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}>
            Cancel
          </button>
          <button
            type="button"
            disabled={!reason.trim()}
            onClick={() => onSubmit(reason.trim())}
            className={`rounded-[8px] bg-[#b42318] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white disabled:opacity-40 ${BUTTON_SKEUO}`}
          >
            Open dispute
          </button>
        </div>
      </div>
    </div>
  )
}
