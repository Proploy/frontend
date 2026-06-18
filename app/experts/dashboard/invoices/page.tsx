'use client'

import { useMemo, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  ArrowUpRight,
  BellRing,
  CheckCircle2,
  FileText,
  Loader2,
  Plus,
  Receipt,
  Search,
  Send,
  Wallet,
  X,
} from 'lucide-react'
import { BUTTON_SKEUO, CARD_SHADOW, DashboardShell } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { useClients } from '@/lib/clients/clients-store'
import type { Client, Invoice, InvoiceStatus, Project } from '@/hooks/types/clients-contracts'

// @react-pdf/renderer is web-only — load the download link without SSR.
const InvoiceDownload = dynamic(() => import('@/components/clients/InvoiceDownload'), {
  ssr: false,
  loading: () => (
    <span className={`flex items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold text-[#414651] ${BUTTON_SKEUO}`}>
      <Loader2 size={16} className="animate-spin" /> PDF
    </span>
  ),
})

const EXPERT_NAME = 'Jordan Avery'

/* derived status includes "overdue" which is a view of (sent + past due) */
type ViewStatus = InvoiceStatus | 'overdue'
type FilterId = 'all' | ViewStatus

const FILTERS: { id: FilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'draft', label: 'Draft' },
  { id: 'sent', label: 'Sent' },
  { id: 'paid', label: 'Paid' },
  { id: 'overdue', label: 'Overdue' },
]

const STATUS_META: Record<ViewStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: '#717680', bg: '#fafafa' },
  sent: { label: 'Sent', color: '#175cd3', bg: '#eff8ff' },
  paid: { label: 'Paid', color: '#067647', bg: '#ecfdf3' },
  overdue: { label: 'Overdue', color: '#b42318', bg: '#fef3f2' },
}

const usd = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)

const longDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const todayISO = () => new Date().toISOString().slice(0, 10)

const isOverdue = (inv: Invoice) => inv.status !== 'paid' && inv.dueDate < todayISO()

const viewStatus = (inv: Invoice): ViewStatus => (isOverdue(inv) ? 'overdue' : inv.status)

/** A project that carries an invoice, paired with its client for rendering. */
type Row = { project: Project; invoice: Invoice; client: Client | undefined }

export default function InvoicesPage() {
  const { clients, projects, getProject, createInvoiceFromProject, setInvoiceStatus } = useClients()

  const rows = useMemo<Row[]>(
    () =>
      projects
        .filter((p): p is Project & { invoice: Invoice } => Boolean(p.invoice))
        .map((p) => ({ project: p, invoice: p.invoice, client: clients.find((c) => c.id === p.clientId) }))
        .sort((a, b) => (a.invoice.issuedDate < b.invoice.issuedDate ? 1 : -1)),
    [projects, clients],
  )

  const [filter, setFilter] = useState<FilterId>('all')
  const [query, setQuery] = useState('')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(rows[0]?.project.id ?? null)
  const [showNew, setShowNew] = useState(false)
  const [reminderAt, setReminderAt] = useState(0)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      if (filter !== 'all' && viewStatus(r.invoice) !== filter) return false
      if (!q) return true
      return (
        r.invoice.number.toLowerCase().includes(q) ||
        r.project.name.toLowerCase().includes(q) ||
        (r.client?.name ?? '').toLowerCase().includes(q)
      )
    })
  }, [rows, filter, query])

  const metrics = useMemo(() => {
    const thisMonth = todayISO().slice(0, 7)
    let totalInvoiced = 0
    let outstanding = 0
    let paidThisMonth = 0
    let overdue = 0
    for (const { invoice } of rows) {
      totalInvoiced += invoice.totalCents
      if (invoice.status === 'paid') {
        if (invoice.issuedDate.slice(0, 7) === thisMonth) paidThisMonth += invoice.totalCents
      } else {
        outstanding += invoice.totalCents
        if (isOverdue(invoice)) overdue += invoice.totalCents
      }
    }
    return { totalInvoiced, outstanding, paidThisMonth, overdue }
  }, [rows])

  const selectedRow =
    (selectedProjectId && rows.find((r) => r.project.id === selectedProjectId)) || visible[0] || rows[0] || null

  const billableProjects = useMemo(
    () =>
      projects.filter(
        (p) =>
          !p.invoice &&
          p.timeEntries.some((e) => e.billable && !e.runningStartedAt && e.minutes > 0),
      ),
    [projects],
  )

  const select = (id: string) => {
    setSelectedProjectId(id)
    setReminderAt(0)
  }

  const sendReminder = () => setReminderAt(Date.now())

  return (
    <DashboardShell>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-[16px] border-b border-[#e9eaeb] bg-white px-[24px] py-[20px]">
          <div className="flex flex-col gap-[4px]">
            <h1 className="flex items-center gap-[10px] text-[24px] font-semibold leading-[32px] text-[#181d27]">
              <Receipt size={22} className="text-[#155eef]" />
              Invoices
            </h1>
            <p className="text-[14px] leading-[20px] text-[#535862]">
              Turn signed milestones into invoices in one click — track paid, sent, and overdue, send reminders, and export a PDF.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNew(true)}
            className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
          >
            <Plus size={18} /> New invoice
          </button>
        </header>

        {/* metric row */}
        <div className="grid grid-cols-1 gap-[16px] border-b border-[#e9eaeb] bg-white px-[24px] py-[20px] sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Total invoiced" value={usd(metrics.totalInvoiced)} icon={<FileText size={16} />} tint="#155eef" tintBg="#eff4ff" />
          <Metric label="Outstanding" value={usd(metrics.outstanding)} icon={<ArrowUpRight size={16} />} tint="#175cd3" tintBg="#eff8ff" />
          <Metric label="Paid this month" value={usd(metrics.paidThisMonth)} icon={<Wallet size={16} />} tint="#067647" tintBg="#ecfdf3" />
          <Metric label="Overdue" value={usd(metrics.overdue)} icon={<BellRing size={16} />} tint="#b42318" tintBg="#fef3f2" />
        </div>

        <div className="flex min-h-0 flex-1 flex-col xl:flex-row">
          {/* list */}
          <section className="flex flex-col border-b border-[#e9eaeb] bg-white xl:w-[420px] xl:shrink-0 xl:border-b-0 xl:border-r">
            <div className="flex flex-col gap-[12px] border-b border-[#e9eaeb] p-[16px]">
              <div className="relative">
                <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717680]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search invoices, clients, projects"
                  className={`w-full rounded-[8px] border border-[#d5d7da] bg-white py-[8px] pl-[36px] pr-[12px] text-[14px] leading-[20px] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
                />
              </div>
              <div className="flex gap-[4px] overflow-x-auto">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`whitespace-nowrap rounded-[6px] px-[10px] py-[6px] text-[13px] font-semibold leading-[18px] transition-colors ${
                      filter === f.id ? 'bg-[#eff4ff] text-[#155eef]' : 'text-[#535862] hover:bg-[#fafafa]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-[4px] overflow-y-auto p-[8px]">
              {visible.length === 0 && (
                <p className="px-[12px] py-[24px] text-center text-[14px] leading-[20px] text-[#717680]">
                  No invoices match.
                </p>
              )}
              {visible.map((r) => {
                const vs = viewStatus(r.invoice)
                const meta = STATUS_META[vs]
                const active = r.project.id === selectedRow?.project.id
                return (
                  <button
                    key={r.invoice.id}
                    type="button"
                    onClick={() => select(r.project.id)}
                    className={`rounded-[10px] border p-[12px] text-left transition-colors ${
                      active ? 'border-[#155eef] bg-[#f5f8ff]' : 'border-transparent hover:bg-[#fafafa]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-[8px]">
                      <span className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
                        {r.invoice.number}
                      </span>
                      <span className="shrink-0 text-[14px] font-semibold leading-[20px] text-[#181d27]">
                        {usd(r.invoice.totalCents)}
                      </span>
                    </div>
                    <p className="mt-[2px] truncate text-[13px] leading-[18px] text-[#535862]">
                      {r.client?.name ?? 'Unknown client'} · {r.project.name}
                    </p>
                    <div className="mt-[8px] flex items-center justify-between gap-[8px]">
                      <StatusBadge status={vs} />
                      <span className="text-[12px] leading-[18px] text-[#717680]">
                        Due {longDate(r.invoice.dueDate)}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          {/* detail */}
          <section className="min-w-0 flex-1 overflow-y-auto bg-[#fafafa] p-[24px]">
            {selectedRow ? (
              <InvoiceDetail
                row={selectedRow}
                reminderActive={reminderAt > 0}
                onMarkSent={() => setInvoiceStatus(selectedRow.project.id, 'sent')}
                onMarkPaid={() => setInvoiceStatus(selectedRow.project.id, 'paid')}
                onSendReminder={sendReminder}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="max-w-[360px] text-center">
                  <Receipt size={32} className="mx-auto text-[#d5d7da]" />
                  <h2 className="mt-[12px] text-[18px] font-semibold text-[#181d27]">No invoices yet</h2>
                  <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">
                    Create an invoice from a project with billable, tracked time to get started.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowNew(true)}
                    className={`mt-[16px] inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold text-white ${BUTTON_SKEUO}`}
                  >
                    <Plus size={18} /> New invoice
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {showNew && (
        <NewInvoiceModal
          projects={billableProjects}
          clients={clients}
          onClose={() => setShowNew(false)}
          onCreate={(projectId) => {
            createInvoiceFromProject(projectId)
            setShowNew(false)
            select(projectId)
          }}
        />
      )}
    </DashboardShell>
  )
}

/* ------------------------------------------------------------------ metric */

function Metric({
  label,
  value,
  icon,
  tint,
  tintBg,
}: {
  label: string
  value: string
  icon: React.ReactNode
  tint: string
  tintBg: string
}) {
  return (
    <div className={`flex items-center gap-[14px] rounded-[12px] border border-[#e9eaeb] bg-white p-[16px] ${CARD_SHADOW}`}>
      <span
        className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px]"
        style={{ color: tint, background: tintBg }}
      >
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] leading-[18px] text-[#717680]">{label}</span>
        <span className="block truncate text-[22px] font-semibold leading-[30px] tracking-[-0.4px] text-[#181d27]">
          {value}
        </span>
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ badge */

function StatusBadge({ status }: { status: ViewStatus }) {
  const meta = STATUS_META[status]
  return (
    <span
      className="inline-flex items-center gap-[6px] rounded-full px-[8px] py-[2px] text-[12px] font-medium leading-[18px]"
      style={{ color: meta.color, background: meta.bg }}
    >
      <span className="size-[6px] rounded-full" style={{ background: meta.color }} />
      {meta.label}
    </span>
  )
}

/* ------------------------------------------------------------------ detail */

function InvoiceDetail({
  row,
  reminderActive,
  onMarkSent,
  onMarkPaid,
  onSendReminder,
}: {
  row: Row
  reminderActive: boolean
  onMarkSent: () => void
  onMarkPaid: () => void
  onSendReminder: () => void
}) {
  const { invoice, client, project } = row
  const vs = viewStatus(invoice)
  const netTermDays = Math.max(
    0,
    Math.round(
      (new Date(`${invoice.dueDate}T00:00:00`).getTime() - new Date(`${invoice.issuedDate}T00:00:00`).getTime()) /
        86400000,
    ),
  )

  return (
    <>
      <article className={`mx-auto max-w-[760px] rounded-[16px] border border-[#e9eaeb] bg-white ${CARD_SHADOW}`}>
        <div className="border-b border-[#e9eaeb] px-[32px] pb-[24px] pt-[32px]">
          <div className="flex items-center justify-between gap-[12px]">
            <StatusBadge status={vs} />
            <span className="text-[13px] leading-[18px] text-[#717680]">Net {netTermDays} days</span>
          </div>
          <h2 className="mt-[16px] text-[24px] font-semibold leading-[32px] tracking-[-0.4px] text-[#181d27]">
            {invoice.number}
          </h2>
          <p className="mt-[4px] text-[14px] leading-[20px] text-[#535862]">{project.name}</p>

          <div className="mt-[20px] grid grid-cols-2 gap-[16px] sm:grid-cols-4">
            <Detail label="Billed to" value={client?.name ?? 'Unknown client'} />
            <Detail label="Contact" value={client?.contactEmail ?? '—'} />
            <Detail label="Issued" value={longDate(invoice.issuedDate)} />
            <Detail label="Due" value={longDate(invoice.dueDate)} />
          </div>
        </div>

        {/* line items */}
        <div className="px-[32px] py-[24px]">
          <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">Line items</p>
          <div className="mt-[12px] overflow-hidden rounded-[12px] border border-[#e9eaeb]">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#fafafa] text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">
                  <th className="px-[16px] py-[10px]">Description</th>
                  <th className="px-[16px] py-[10px] text-right">Hours</th>
                  <th className="px-[16px] py-[10px] text-right">Rate</th>
                  <th className="px-[16px] py-[10px] text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-[16px] py-[16px] text-center text-[14px] leading-[20px] text-[#717680]">
                      No billable line items.
                    </td>
                  </tr>
                )}
                {invoice.lineItems.map((li, i) => (
                  <tr key={li.id} className={i > 0 ? 'border-t border-[#e9eaeb]' : ''}>
                    <td className="px-[16px] py-[12px] text-[14px] leading-[20px] text-[#252b37]">{li.description}</td>
                    <td className="px-[16px] py-[12px] text-right text-[14px] leading-[20px] text-[#535862]">
                      {li.hours}
                    </td>
                    <td className="px-[16px] py-[12px] text-right text-[14px] leading-[20px] text-[#535862]">
                      {usd(li.rateCents)}
                    </td>
                    <td className="px-[16px] py-[12px] text-right text-[14px] font-semibold leading-[20px] text-[#181d27]">
                      {usd(li.amountCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* totals */}
          <div className="mt-[16px] ml-auto flex max-w-[320px] flex-col gap-[8px]">
            <TotalRow label="Subtotal" value={usd(invoice.subtotalCents)} />
            <TotalRow label={`Platform fee (${invoice.feePct}%)`} value={`-${usd(invoice.feeCents)}`} muted />
            <div className="mt-[4px] flex items-center justify-between border-t border-[#e9eaeb] pt-[12px]">
              <span className="text-[15px] font-semibold leading-[22px] text-[#181d27]">Net payout</span>
              <span className="text-[18px] font-semibold leading-[26px] tracking-[-0.2px] text-[#181d27]">
                {usd(invoice.totalCents)}
              </span>
            </div>
          </div>

          {invoice.notes && (
            <p className="mt-[20px] rounded-[10px] bg-[#fafafa] px-[14px] py-[10px] text-[13px] leading-[20px] text-[#535862]">
              {invoice.notes}
            </p>
          )}
        </div>
      </article>

      {/* action bar */}
      <div className="mx-auto mt-[16px] flex max-w-[760px] flex-col gap-[12px]">
        {reminderActive && (vs === 'sent' || vs === 'overdue') && (
          <div className="flex items-center gap-[8px] rounded-[12px] border border-[#a9efc5] bg-[#f6fef9] px-[16px] py-[10px] text-[13px] leading-[18px] text-[#067647]">
            <CheckCircle2 size={16} /> Reminder sent to {client?.contactEmail ?? 'the client'}.
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white p-[16px]">
          <span className="text-[13px] leading-[18px] text-[#535862]">
            {vs === 'paid'
              ? 'Paid in full — payout cleared to your account.'
              : vs === 'overdue'
                ? 'Past due. Send a reminder or mark as paid when funds arrive.'
                : vs === 'sent'
                  ? 'Awaiting payment. Send a reminder if the client is slow.'
                  : 'Draft — send to the client when you are ready.'}
          </span>
          <div className="flex flex-wrap items-center gap-[8px]">
            {(vs === 'sent' || vs === 'overdue') && (
              <button
                type="button"
                onClick={onSendReminder}
                className={`inline-flex items-center gap-[8px] rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa] ${BUTTON_SKEUO}`}
              >
                <BellRing size={18} /> Send reminder
              </button>
            )}
            {invoice.status === 'draft' && (
              <button
                type="button"
                onClick={onMarkSent}
                className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
              >
                <Send size={18} /> Mark as sent
              </button>
            )}
            {invoice.status !== 'paid' && invoice.status !== 'draft' && (
              <button
                type="button"
                onClick={onMarkPaid}
                className={`inline-flex items-center gap-[8px] rounded-[8px] bg-[#155eef] px-[16px] py-[10px] text-[14px] font-semibold leading-[20px] text-white transition-colors hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
              >
                <CheckCircle2 size={18} /> Mark as paid
              </button>
            )}
            {invoice.status === 'paid' && (
              <span className="inline-flex items-center gap-[8px] rounded-[8px] bg-[#ecfdf3] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#067647]">
                <CheckCircle2 size={18} /> Paid
              </span>
            )}
            {client && <InvoiceDownload invoice={invoice} client={client} expertName={EXPERT_NAME} />}
          </div>
        </div>
      </div>
    </>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#717680]">{label}</p>
      <p className="mt-[4px] truncate text-[14px] leading-[20px] text-[#181d27]">{value}</p>
    </div>
  )
}

function TotalRow({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between text-[14px] leading-[20px]">
      <span className="text-[#535862]">{label}</span>
      <span className={muted ? 'text-[#717680]' : 'font-semibold text-[#181d27]'}>{value}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ new-invoice modal */

function NewInvoiceModal({
  projects,
  clients,
  onClose,
  onCreate,
}: {
  projects: Project[]
  clients: Client[]
  onClose: () => void
  onCreate: (projectId: string) => void
}) {
  const billableTotal = (p: Project) => {
    const cents = p.timeEntries
      .filter((e) => e.billable && !e.runningStartedAt && e.minutes > 0)
      .reduce((s, e) => s + Math.round((e.minutes / 60) * e.rateCents), 0)
    return cents
  }

  return (
    <Overlay onClose={onClose} title="New invoice">
      <p className="mb-[16px] text-[14px] leading-[20px] text-[#535862]">
        Pick a project with billable tracked time. We will roll its time entries into a draft invoice you can review and send.
      </p>
      {projects.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-[#d5d7da] bg-[#fafafa] p-[24px] text-center">
          <FileText size={28} className="mx-auto text-[#d5d7da]" />
          <p className="mt-[10px] text-[14px] font-semibold leading-[20px] text-[#181d27]">Nothing to invoice yet</p>
          <p className="mt-[2px] text-[13px] leading-[18px] text-[#535862]">
            Every project with billable time already has an invoice, or no billable time has been logged.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[8px]">
          {projects.map((p) => {
            const client = clients.find((c) => c.id === p.clientId)
            return (
              <div
                key={p.id}
                className="flex items-center justify-between gap-[12px] rounded-[12px] border border-[#e9eaeb] p-[14px]"
              >
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{p.name}</p>
                  <p className="mt-[2px] truncate text-[13px] leading-[18px] text-[#535862]">
                    {client?.name ?? 'Unknown client'} · {usd(billableTotal(p))} billable
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onCreate(p.id)}
                  className={`inline-flex shrink-0 items-center gap-[6px] rounded-[8px] bg-[#155eef] px-[14px] py-[8px] text-[13px] font-semibold leading-[18px] text-white transition-colors hover:bg-[#004eeb] ${BUTTON_SKEUO}`}
                >
                  <Plus size={16} /> Create
                </button>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-[20px] flex items-center justify-end border-t border-[#e9eaeb] pt-[16px]">
        <button
          type="button"
          onClick={onClose}
          className={`rounded-[8px] border border-[#d5d7da] bg-white px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
        >
          Close
        </button>
      </div>
    </Overlay>
  )
}

function Overlay({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[#0a0d12]/40 p-[24px] backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="my-[24px] w-full max-w-[640px] rounded-[16px] border border-[#e9eaeb] bg-white shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#e9eaeb] px-[24px] py-[18px]">
          <h2 className="text-[18px] font-semibold leading-[28px] text-[#181d27]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-[32px] items-center justify-center rounded-[6px] text-[#717680] transition-colors hover:bg-[#fafafa] hover:text-[#181d27]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-[24px]">{children}</div>
      </div>
    </div>
  )
}
