'use client'

import dynamic from 'next/dynamic'
import { FileText, Send } from 'lucide-react'
import { useClients } from '@/lib/clients/clients-store'
import { BUTTON_SKEUO, CARD_SHADOW } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Client, Project } from '@/hooks/types/clients-contracts'

// react-pdf is client-only — load the download link without SSR.
const InvoiceDownload = dynamic(() => import('./InvoiceDownload'), {
  ssr: false,
  loading: () => <span className="text-[13px] text-[#717680]">Loading…</span>,
})

const STATUS_STYLE: Record<string, string> = {
  draft: 'bg-[#f5f5f5] text-[#717680]',
  sent: 'bg-[#eff8ff] text-[#175cd3]',
  paid: 'bg-[#ecfdf3] text-[#067647]',
}

export function InvoiceTab({ project, client, expertName }: { project: Project; client: Client; expertName: string }) {
  const { createInvoiceFromProject, setInvoiceStatus } = useClients()
  const invoice = project.invoice

  if (!invoice) {
    const billableCount = project.timeEntries.filter((e) => e.billable && e.minutes > 0).length
    return (
      <div className="rounded-[12px] border border-dashed border-[#d5d7da] p-[40px] flex flex-col items-center gap-[12px] text-center">
        <div className="size-[48px] rounded-full bg-[#eff4ff] flex items-center justify-center text-[#155eef]"><FileText size={24} /></div>
        <p className="font-semibold text-[16px] text-[#181d27]">No invoice yet</p>
        <p className="text-[14px] text-[#535862] max-w-[360px]">
          Generate an invoice from this project&apos;s {billableCount} billable time {billableCount === 1 ? 'entry' : 'entries'}. A 10% platform fee is applied.
        </p>
        {project.status !== 'Completed' && (
          <p className="text-[13px] text-[#b54708]">Tip: mark the project Completed before invoicing the client.</p>
        )}
        <button
          type="button"
          onClick={() => createInvoiceFromProject(project.id)}
          className={`mt-[8px] flex items-center gap-[6px] bg-[#155eef] border-2 border-white/[0.12] rounded-[8px] px-[16px] py-[10px] font-semibold text-[14px] text-white ${BUTTON_SKEUO}`}
        >
          <FileText size={18} /> Generate invoice
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-[16px]">
      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-[12px]">
        <div className="flex items-center gap-[10px]">
          <span className="font-semibold text-[16px] text-[#181d27]">{invoice.number}</span>
          <span className={`rounded-full px-[8px] py-[2px] text-[12px] font-medium capitalize ${STATUS_STYLE[invoice.status]}`}>{invoice.status}</span>
        </div>
        <div className="flex items-center gap-[10px]">
          <button type="button" onClick={() => createInvoiceFromProject(project.id)} className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] text-[#414651] ${BUTTON_SKEUO}`}>
            Regenerate
          </button>
          {invoice.status === 'draft' && (
            <button type="button" onClick={() => setInvoiceStatus(project.id, 'sent')} className={`flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] text-[#414651] ${BUTTON_SKEUO}`}>
              <Send size={16} /> Send to client
            </button>
          )}
          {invoice.status === 'sent' && (
            <button type="button" onClick={() => setInvoiceStatus(project.id, 'paid')} className={`bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] text-[#067647] ${BUTTON_SKEUO}`}>
              Mark paid
            </button>
          )}
          <InvoiceDownload invoice={invoice} client={client} expertName={expertName} />
        </div>
      </div>

      {/* On-screen preview (mirrors the PDF) */}
      <div className={`bg-white border border-[#e9eaeb] rounded-[12px] p-[32px] max-w-[720px] ${CARD_SHADOW}`}>
        <div className="flex items-center gap-[8px] mb-[24px]">
          <span className="size-[28px] rounded-[6px] bg-[#155eef] flex items-center justify-center text-white font-bold text-[14px]">p</span>
          <span className="font-semibold text-[18px] text-[#181d27]">proploy</span>
        </div>

        <div className="flex items-start justify-between mb-[24px]">
          <div>
            <p className="font-semibold text-[22px] text-[#181d27]">Invoice</p>
            <p className="text-[13px] text-[#717680]">{invoice.number}</p>
          </div>
          <div className="text-[13px] text-[#414651] text-right">
            <p>Issued: {formatDate(invoice.issuedDate)}</p>
            <p>Due: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>

        <div className="flex items-start justify-between mb-[24px]">
          <div>
            <p className="text-[11px] uppercase text-[#717680] mb-[3px]">From</p>
            <p className="text-[14px] text-[#181d27]">{expertName}</p>
            <p className="text-[13px] text-[#717680]">via Proploy</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase text-[#717680] mb-[3px]">Bill to</p>
            <p className="text-[14px] text-[#181d27]">{client.name}</p>
            {client.contactName && <p className="text-[13px] text-[#717680]">{client.contactName}</p>}
            {client.contactEmail && <p className="text-[13px] text-[#717680]">{client.contactEmail}</p>}
          </div>
        </div>

        <table className="w-full border-collapse mb-[16px]">
          <thead>
            <tr className="bg-[#fafafa] border-y border-[#e9eaeb] text-[12px] text-[#717680]">
              <th className="text-left px-[8px] py-[6px]">Description</th>
              <th className="text-right px-[8px] py-[6px]">Hours</th>
              <th className="text-right px-[8px] py-[6px]">Rate</th>
              <th className="text-right px-[8px] py-[6px]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((li) => (
              <tr key={li.id} className="border-b border-[#f0f0f0] text-[13px] text-[#181d27]">
                <td className="px-[8px] py-[8px]">{li.description}</td>
                <td className="px-[8px] py-[8px] text-right tabular-nums">{li.hours}</td>
                <td className="px-[8px] py-[8px] text-right tabular-nums">{formatCurrency(li.rateCents)}</td>
                <td className="px-[8px] py-[8px] text-right tabular-nums">{formatCurrency(li.amountCents)}</td>
              </tr>
            ))}
            {invoice.lineItems.length === 0 && (
              <tr><td colSpan={4} className="px-[8px] py-[12px] text-[13px] text-[#717680]">No billable time logged.</td></tr>
            )}
          </tbody>
        </table>

        <div className="ml-auto w-[260px] text-[13px]">
          <div className="flex justify-between py-[4px] text-[#535862]"><span>Subtotal</span><span className="tabular-nums">{formatCurrency(invoice.subtotalCents)}</span></div>
          <div className="flex justify-between py-[4px] text-[#535862]"><span>Platform fee ({invoice.feePct}%)</span><span className="tabular-nums">-{formatCurrency(invoice.feeCents)}</span></div>
          <div className="flex justify-between py-[8px] border-t border-[#e9eaeb] mt-[4px] font-semibold text-[15px] text-[#181d27]"><span>Net payout</span><span className="tabular-nums">{formatCurrency(invoice.totalCents)}</span></div>
        </div>
      </div>
    </div>
  )
}
