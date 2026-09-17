'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Plus,
  Receipt,
  RefreshCw,
  Send,
  Trash2,
  X,
} from 'lucide-react'
import {

  WorkspaceLoading,
  WorkspaceShell,
  WorkspaceSignInState,
} from '@/components/workspace/WorkspaceShell'
import { Skeleton } from '@/components/ui/Skeleton'
import { KpiCard } from '@/components/portal/ui'
import {
  engagementTitle,
  longDate,
  relativeDate,
  statusLabel,
  statusLabelForViewer,
} from '@/components/workspace/workspace-format'
import { useCurrentUserRole, useWorkspace } from '@/features/workspace'
import {
  buildManualInvoiceSettlementPayload,
  buildInvoiceCreatePayload,
  canBuyerSettleInvoice,
  getInvoiceCurrencyOptions,
  invoiceLineItemTotalCents,
  invoicePreviewTotalCents,
  normalizeInvoiceCurrency,
  type InvoiceFormInput,
} from '@/features/workspace/invoice-form'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type { InvoiceStatus, WorkspaceInvoice } from '@/features/workspace/home-types'
import type { WorkspaceEngagement } from '@/features/workspace/types'
import { useWorkspaceQueryParam } from '@/features/workspace/use-workspace-query-param'

const OUTSTANDING_STATUSES = new Set<InvoiceStatus>(['draft', 'sent', 'overdue'])

function invoiceStatusClass(status: InvoiceStatus): string {
  if (status === 'paid') return 'bg-ok-soft text-ok'
  if (status === 'sent') return 'bg-cobalt-soft text-cobalt'
  if (status === 'overdue') return 'bg-danger-soft text-danger'
  if (status === 'cancelled' || status === 'refunded') return 'bg-danger-soft text-danger'
  return 'bg-surface-sunken text-ink-soft'
}

function invoiceMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: normalizeInvoiceCurrency(currency),
    maximumFractionDigits: 2,
  }).format(cents / 100)
}

function invoiceAggregateMoney(invoices: WorkspaceInvoice[], select: (invoice: WorkspaceInvoice) => boolean): string {
  const selected = invoices.filter(select)
  const currencies = new Set(selected.map((invoice) => invoice.currency))
  if (selected.length === 0) return invoiceMoney(0, 'USD')
  if (currencies.size !== 1) return 'Mixed currencies'
  const currency = selected[0]?.currency ?? 'USD'
  return invoiceMoney(selected.reduce((sum, invoice) => sum + invoice.totalCents, 0), currency)
}

function defaultDueAt(): string {
  const date = new Date()
  date.setDate(date.getDate() + 14)
  date.setHours(17, 0, 0, 0)
  return toDateTimeLocal(date.toISOString())
}

function toDateTimeLocal(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function asDueAtIso(value: string): string {
  return new Date(value).toISOString()
}

function emptyInvoiceForm(engagementId = ''): InvoiceFormInput {
  return {
    engagementId,
    title: '',
    currency: 'USD',
    dueAt: defaultDueAt(),
    lineItems: [{ id: crypto.randomUUID(), description: '', quantity: 1, unitCents: 0 }],
  }
}

export default function WorkspaceInvoicesPage() {
  const state = useCurrentUserRole()
  const workspace = useWorkspace()
  const requestedInvoiceId = useWorkspaceQueryParam('invoice')
  const [invoices, setInvoices] = useState<WorkspaceInvoice[]>([])
  const [engagements, setEngagements] = useState<WorkspaceEngagement[]>([])
  const [error, setError] = useState<NormalizedError | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)
  const [form, setForm] = useState<InvoiceFormInput>(() => emptyInvoiceForm())
  const [saving, setSaving] = useState(false)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [settlingId, setSettlingId] = useState<string | null>(null)
  const isExpertWorkspace = state.role === 'expert'

  useEffect(() => {
    if (state.isPending || !state.user) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [invoiceResult, engagementResult] = await Promise.all([
          workspace.listInvoices(),
          workspace.listEngagements(),
        ])
        if (cancelled) return

        if (invoiceResult.ok) {
          setInvoices(invoiceResult.data.invoices ?? [])
        } else if (invoiceResult.status !== 404) {
          setInvoices([])
          setError(invoiceResult)
        } else {
          setInvoices([])
        }
        if (engagementResult.ok) {
          setEngagements(engagementResult.data.engagements)
        } else {
          setError((current) => current ?? engagementResult)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [requestedInvoiceId, state.isPending, state.user, workspace])

  const sorted = useMemo(
    () => invoices.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [invoices],
  )
  const engagementMap = useMemo(
    () => new Map(engagements.map((engagement) => [engagement.id, engagement])),
    [engagements],
  )
  const kpis = useMemo(() => ({
    outstandingCount: invoices.filter((invoice) => OUTSTANDING_STATUSES.has(invoice.status)).length,
  }), [invoices])

  useEffect(() => {
    if (loading || !requestedInvoiceId) return
    document.getElementById(`invoice-${requestedInvoiceId}`)?.scrollIntoView({
      block: 'center',
    })
  }, [loading, requestedInvoiceId])

  function openCreate() {
    setForm(emptyInvoiceForm(engagements[0]?.id ?? ''))
    setFormError(null)
    setEditorOpen(true)
  }

  function openEdit(invoice: WorkspaceInvoice) {
    setForm({
      engagementId: invoice.engagementId,
      title: invoice.title,
      currency: normalizeInvoiceCurrency(invoice.currency),
      dueAt: toDateTimeLocal(invoice.dueAt),
      lineItems: invoice.lineItems.map((item) => ({ ...item, id: crypto.randomUUID() })),
      ...(invoice.contractId ? { contractId: invoice.contractId } : {}),
      ...(invoice.proposalId ? { proposalId: invoice.proposalId } : {}),
      ...(invoice.templateId ? { templateId: invoice.templateId } : {}),
    })
    setFormError(null)
    setEditorOpen(true)
  }

  async function saveInvoice() {
    setFormError(null)
    if (!form.engagementId || !form.title.trim()) {
      setFormError('Choose an engagement and add an invoice title.')
      return
    }
    if (!form.dueAt || Number.isNaN(new Date(form.dueAt).getTime())) {
      setFormError('Choose a valid due date.')
      return
    }
    if (form.lineItems.some((item) => !item.description.trim() || item.quantity <= 0 || item.unitCents < 0)) {
      setFormError('Each line item needs a description, quantity, and non-negative unit price.')
      return
    }

    setSaving(true)
    try {
      const payload = buildInvoiceCreatePayload({ ...form, dueAt: asDueAtIso(form.dueAt) })
      const result = form.id
        ? await workspace.updateInvoice(form.id, {
            title: payload.title,
            lineItems: payload.lineItems,
            currency: payload.currency,
            dueAt: payload.dueAt,
          })
        : await workspace.createInvoice(payload)

      if (!result.ok) {
        setError(result)
        return
      }
      setInvoices((current) => {
        const withoutCurrent = current.filter((invoice) => invoice.id !== result.data.id)
        return [result.data, ...withoutCurrent]
      })
      setEditorOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function sendInvoice(invoiceId: string) {
    setSendingId(invoiceId)
    const result = await workspace.sendInvoice(invoiceId)
    setSendingId(null)
    if (!result.ok) {
      setError(result)
      return
    }
    setInvoices((current) => current.map((invoice) => invoice.id === result.data.id ? result.data : invoice))
  }

  async function markInvoiceSettled(invoice: WorkspaceInvoice) {
    if (settlingId) return
    if (!window.confirm(`Mark ${invoice.invoiceNumber} as settled for the full invoice total?`)) return

    setSettlingId(invoice.id)
    setError(null)
    const result = await workspace.markInvoicePaid(
      invoice.id,
      buildManualInvoiceSettlementPayload(invoice.totalCents),
    )
    setSettlingId(null)

    if (!result.ok) {
      setError(result)
      return
    }
    setInvoices((current) => current.map((item) => item.id === result.data.id ? result.data : item))
  }

  if (state.isPending) return <WorkspaceLoading role={state.role} />
  if (!state.user) return <WorkspaceSignInState redirect="/workspace/invoices" />

  return (
    <WorkspaceShell role={state.role}>
      <main className="flex min-w-0 flex-1 flex-col">
        <header className="pf-pagebar">
          <div className="flex min-w-0 items-center gap-[14px]">
            <span className="pf-ico pf-ico--lg pf-ico--soft"><Receipt size={20} /></span>
            <div className="pf-pagebar-text">
              <span className="pf-eyebrow">Workspace</span>
              <h1 className="pf-title truncate">Invoices</h1>
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            {loading && <RefreshCw size={18} className="animate-spin text-cobalt" />}
            {isExpertWorkspace && (
              <button
                type="button"
                onClick={openCreate}
                disabled={engagements.length === 0}
                className="pf-btn pf-btn--primary"
              >
                <Plus size={16} />
                New invoice
              </button>
            )}
          </div>
        </header>

        {error && (
          <div className="px-[24px] pt-[16px]">
            <div className="pf-note pf-note--warn">
              <AlertTriangle size={15} />
              {error.error.message || 'Unable to refresh invoices.'}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-[16px] px-[24px] py-[24px] md:grid-cols-3">
          <InvoiceKpiCard title="Total billed" value={invoiceAggregateMoney(invoices, () => true)} note={`${invoices.length} invoice${invoices.length === 1 ? '' : 's'}`} isLoading={loading} />
          <InvoiceKpiCard title="Outstanding" value={String(kpis.outstandingCount)} note="awaiting payment" isLoading={loading} />
          <InvoiceKpiCard title="Paid" value={invoiceAggregateMoney(invoices, (invoice) => invoice.status === 'paid')} note="collected to date" isLoading={loading} />
        </div>

        <section className="pf-card mx-[24px] mb-[24px]">
          <div className="border-b border-line px-[20px] py-[16px]">
            <h2 className="pf-h2">All invoices</h2>
            <p className="mt-[2px] text-[13px] leading-[18px] text-ink-muted">
              {sorted.length === 0 ? 'No invoices yet.' : `${sorted.length} invoice${sorted.length === 1 ? '' : 's'} on file.`}
            </p>
          </div>
          {loading ? <InvoicesSkeleton /> : sorted.length === 0 ? (
            <div className="px-[20px] py-[40px] text-center text-[14px] leading-[20px] text-ink-muted">No invoices to display yet.</div>
          ) : (
            <ul className="divide-y divide-line-soft">
              {sorted.map((invoice) => {
                const engagement = engagementMap.get(invoice.engagementId)
                return (
                  <li
                    id={`invoice-${invoice.id}`}
                    key={invoice.id}
                    className={`flex flex-col gap-[12px] px-[20px] py-[16px] ${
                      requestedInvoiceId === invoice.id ? 'bg-cobalt-soft' : ''
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-[12px]">
                      <div className="min-w-0">
                        <p className="truncate text-[15px] font-semibold leading-[22px] text-ink">
                          {invoice.title || invoice.invoiceNumber}
                        </p>
                        <p className="mt-[2px] truncate text-[13px] leading-[18px] text-ink-soft">
                          {invoice.invoiceNumber} · {engagement ? engagementTitle(engagement, state.role) : 'Engagement'}
                        </p>
                      </div>
                      <span className={`inline-flex shrink-0 items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-semibold leading-[18px] ${invoiceStatusClass(invoice.status)}`}>
                        <span className="size-[6px] rounded-full bg-current" />
                        {statusLabelForViewer(invoice.status, state.role)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-[8px] text-[13px] leading-[18px] text-ink-soft sm:grid-cols-4">
                      <InvoiceFact label="Total" value={invoiceMoney(invoice.totalCents, invoice.currency)} />
                      <InvoiceFact label="Due" value={longDate(invoice.dueAt)} note={relativeDate(invoice.dueAt)} />
                      <InvoiceFact label="Paid" value={invoice.paidAt ? longDate(invoice.paidAt) : '—'} note={invoice.paidAt ? relativeDate(invoice.paidAt) : 'awaiting payment'} />
                      <InvoiceFact label="Issued" value={longDate(invoice.createdAt)} note={relativeDate(invoice.createdAt)} />
                    </div>

                    <div className="rounded-[8px] border border-line-soft bg-surface-sunken px-[12px] py-[10px]">
                      <p className="pf-eyebrow">Line items</p>
                      <div className="mt-[6px] divide-y divide-line-soft">
                        {invoice.lineItems.map((item, index) => (
                          <div key={`${invoice.id}-line-${index}`} className="flex items-center justify-between gap-[12px] py-[6px] text-[13px] leading-[18px]">
                            <span className="min-w-0 truncate text-ink-soft">{item.description} × {item.quantity}</span>
                            <span className="shrink-0 font-semibold text-ink">{invoiceMoney(item.quantity * item.unitCents, invoice.currency)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {isExpertWorkspace && (
                      <div className="flex flex-wrap items-center justify-end gap-[8px] border-t border-line-soft pt-[12px]">
                        {invoice.status === 'draft' && (
                          <>
                            <button type="button" onClick={() => openEdit(invoice)} className="rounded-[8px] border border-line bg-white px-[12px] py-[8px] text-[13px] font-semibold leading-[18px] text-ink-soft hover:bg-surface-hover">
                              Edit draft
                            </button>
                            <button type="button" onClick={() => void sendInvoice(invoice.id)} disabled={sendingId === invoice.id} className="pf-btn pf-btn--primary pf-btn--sm">
                              <Send size={14} />
                              {sendingId === invoice.id ? 'Sending…' : 'Send invoice'}
                            </button>
                          </>
                        )}
                      </div>
                    )}

                    {canBuyerSettleInvoice(invoice.status, state.role) && (
                      <div className="flex flex-wrap items-center justify-end gap-[8px] border-t border-line-soft pt-[12px]">
                        <button
                          type="button"
                          onClick={() => void markInvoiceSettled(invoice)}
                          disabled={settlingId === invoice.id}
                          className="pf-btn pf-btn--primary pf-btn--sm"
                        >
                          <Receipt size={14} />
                          {settlingId === invoice.id ? 'Settling…' : 'Mark as settled'}
                        </button>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </main>

      {editorOpen && (
        <InvoiceEditor
          form={form}
          engagements={engagements}
          isEditing={Boolean(form.id)}
          saving={saving}
          error={formError}
          onChange={setForm}
          onSave={() => void saveInvoice()}
          onClose={() => setEditorOpen(false)}
        />
      )}
    </WorkspaceShell>
  )
}

function InvoiceFact({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <span>
      <span className="pf-eyebrow block">{label}</span>
      <span className="mt-[2px] block text-[14px] font-semibold leading-[20px] text-ink">{value}</span>
      {note && <span className="mt-[2px] block text-[12px] text-ink-muted">{note}</span>}
    </span>
  )
}

function InvoiceEditor({
  form,
  engagements,
  isEditing,
  saving,
  error,
  onChange,
  onSave,
  onClose,
}: {
  form: InvoiceFormInput
  engagements: WorkspaceEngagement[]
  isEditing: boolean
  saving: boolean
  error: string | null
  onChange: (next: InvoiceFormInput) => void
  onSave: () => void
  onClose: () => void
}) {
  const total = invoicePreviewTotalCents(form.lineItems)
  const selectedEngagement = engagements.find((engagement) => engagement.id === form.engagementId)

  function updateLineItem(index: number, patch: Partial<InvoiceFormInput['lineItems'][number]>) {
    onChange({ ...form, lineItems: form.lineItems.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-[16px] sm:items-center">
      <div role="dialog" aria-modal="true" aria-labelledby="invoice-editor-title" className="max-h-[90vh] w-full max-w-[720px] overflow-y-auto rounded-[16px] border border-line bg-white p-[24px] shadow-[0_24px_48px_rgba(16,24,40,0.18)]">
        <div className="flex items-start justify-between gap-[16px]">
          <div>
            <h2 id="invoice-editor-title" className="text-[20px] font-semibold leading-[28px] text-ink">{isEditing ? 'Edit invoice draft' : 'New invoice'}</h2>
            <p className="mt-[4px] text-[13px] leading-[18px] text-ink-muted">Create a draft for the selected engagement, then send it to the buyer.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close invoice editor" className="rounded-[8px] p-[6px] text-ink-muted hover:bg-surface-hover"><X size={18} /></button>
        </div>

        <div className="mt-[20px] grid gap-[16px] sm:grid-cols-2">
          <label className="text-[13px] font-medium leading-[18px] text-ink-soft sm:col-span-2">
            Engagement
            <select value={form.engagementId} disabled={isEditing} onChange={(event) => onChange({ ...form, engagementId: event.target.value })} className="mt-[6px] h-[42px] w-full rounded-[8px] border border-line bg-white px-[12px] text-[14px] font-normal text-ink disabled:bg-surface-sunken">
              <option value="">Choose an engagement</option>
              {engagements.map((engagement) => <option key={engagement.id} value={engagement.id}>{engagementTitle(engagement, 'expert')}</option>)}
            </select>
            {selectedEngagement && <span className="mt-[4px] block text-[12px] font-normal text-ink-muted">{statusLabel(selectedEngagement.status)} engagement</span>}
          </label>
          <label className="text-[13px] font-medium leading-[18px] text-ink-soft sm:col-span-2">
            Invoice title
            <input value={form.title} onChange={(event) => onChange({ ...form, title: event.target.value })} placeholder="Implementation services" className="mt-[6px] h-[42px] w-full rounded-[8px] border border-line px-[12px] text-[14px] font-normal text-ink placeholder:text-ink-faint" />
          </label>
          <label className="text-[13px] font-medium leading-[18px] text-ink-soft">
            Due date
            <input type="datetime-local" value={form.dueAt} onChange={(event) => onChange({ ...form, dueAt: event.target.value })} className="mt-[6px] h-[42px] w-full rounded-[8px] border border-line px-[12px] text-[14px] font-normal text-ink" />
          </label>
          <label className="text-[13px] font-medium leading-[18px] text-ink-soft">
            Currency
            <select value={form.currency} onChange={(event) => onChange({ ...form, currency: event.target.value })} className="mt-[6px] h-[42px] w-full rounded-[8px] border border-line bg-white px-[12px] text-[14px] font-normal text-ink">
              {getInvoiceCurrencyOptions().map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}
              {!getInvoiceCurrencyOptions().some((option) => option.code === form.currency) && <option value={form.currency}>{form.currency}</option>}
            </select>
          </label>
        </div>

        <div className="mt-[20px] rounded-[12px] border border-line p-[16px]">
          <div className="flex items-center justify-between gap-[12px]">
            <div>
              <h3 className="text-[14px] font-semibold leading-[20px] text-ink">Line items</h3>
              <p className="mt-[2px] text-[12px] leading-[18px] text-ink-muted">Edit the breakdown; the total updates automatically.</p>
            </div>
            <span className="shrink-0 text-[16px] font-semibold text-ink">{invoiceMoney(total, form.currency)}</span>
          </div>
          <div className="pf-eyebrow mt-[12px] hidden gap-[8px] px-[10px]  sm:grid sm:grid-cols-[minmax(0,1fr)_90px_120px_120px_36px]">
            <span>Description</span>
            <span>Qty</span>
            <span>Unit price</span>
            <span>Amount</span>
            <span />
          </div>
          <div className="mt-[8px] flex flex-col gap-[10px]">
            {form.lineItems.map((item, index) => (
              <div key={item.id} className="grid gap-[8px] rounded-[8px] border border-line-soft p-[8px] sm:grid-cols-[minmax(0,1fr)_90px_120px_120px_36px] sm:border-0 sm:p-0">
                <input value={item.description} onChange={(event) => updateLineItem(index, { description: event.target.value })} placeholder="Description" aria-label={`Line item ${index + 1} description`} className="h-[40px] rounded-[8px] border border-line px-[10px] text-[13px] text-ink placeholder:text-ink-faint" />
                <input type="number" min={1} step={1} value={item.quantity} onChange={(event) => updateLineItem(index, { quantity: Number(event.target.value) })} aria-label={`Line item ${index + 1} quantity`} className="h-[40px] rounded-[8px] border border-line px-[10px] text-[13px] text-ink" />
                <input type="number" min={0} step="0.01" value={item.unitCents === 0 ? '' : String(item.unitCents / 100)} onChange={(event) => updateLineItem(index, { unitCents: Math.round(Number(event.target.value || 0) * 100) })} placeholder="0.00" aria-label={`Line item ${index + 1} unit price`} className="h-[40px] rounded-[8px] border border-line px-[10px] text-[13px] text-ink placeholder:text-ink-faint" />
                <div className="flex h-[40px] items-center justify-end rounded-[8px] bg-surface-sunken px-[10px] text-[13px] font-semibold text-ink" aria-label={`Line item ${index + 1} amount`}>{invoiceMoney(invoiceLineItemTotalCents(item), form.currency)}</div>
                <button type="button" onClick={() => onChange({ ...form, lineItems: form.lineItems.filter((_, itemIndex) => itemIndex !== index) })} disabled={form.lineItems.length === 1} aria-label={`Remove line item ${index + 1}`} className="flex h-[40px] items-center justify-center rounded-[8px] border border-line text-danger disabled:cursor-not-allowed disabled:opacity-40"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => onChange({ ...form, lineItems: [...form.lineItems, { id: crypto.randomUUID(), description: '', quantity: 1, unitCents: 0 }] })} className="mt-[12px] inline-flex items-center gap-[6px] rounded-[8px] border border-line bg-white px-[10px] py-[7px] text-[13px] font-semibold text-ink-soft hover:bg-surface-hover"><Plus size={14} /> Add line item</button>
        </div>

        {error && <p className="mt-[12px] rounded-[8px] bg-danger-soft px-[12px] py-[10px] text-[13px] leading-[18px] text-danger">{error}</p>}
        <div className="mt-[20px] flex justify-end gap-[8px] border-t border-line pt-[16px]">
          <button type="button" onClick={onClose} className="rounded-[8px] border border-line bg-white px-[14px] py-[9px] text-[14px] font-semibold text-ink-soft hover:bg-surface-hover">Cancel</button>
          <button type="button" onClick={onSave} disabled={saving} className="pf-btn pf-btn--primary pf-btn--sm">
            {saving ? <RefreshCw size={15} className="animate-spin" /> : <Receipt size={15} />}
            {saving ? 'Saving…' : 'Save draft'}
          </button>
        </div>
      </div>
    </div>
  )
}

/** Thin wrapper so this page keeps its title/value/note call sites. */
function InvoiceKpiCard({ title, value, note, isLoading }: { title: string; value: string; note: string; isLoading: boolean }) {
  return <KpiCard label={title} value={value} foot={note} isLoading={isLoading} />
}

function InvoicesSkeleton() {
  return (
    <ul className="divide-y divide-line-soft" aria-label="loading">
      {Array.from({ length: 3 }).map((_, index) => (
        <li key={index} className="flex flex-col gap-[10px] px-[20px] py-[16px]">
          <Skeleton className="h-[16px] w-[200px] rounded-[4px]" />
          <Skeleton className="h-[12px] w-[280px] rounded-[4px]" />
          <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-4">
            <Skeleton className="h-[36px] rounded-[4px]" />
            <Skeleton className="h-[36px] rounded-[4px]" />
            <Skeleton className="h-[36px] rounded-[4px]" />
            <Skeleton className="h-[36px] rounded-[4px]" />
          </div>
        </li>
      ))}
    </ul>
  )
}
