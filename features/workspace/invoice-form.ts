export interface InvoiceFormLineItem {
  description: string
  quantity: number
  unitCents: number
}

export interface InvoiceFormInput {
  id?: string
  engagementId: string
  contractId?: string
  proposalId?: string
  templateId?: string
  title: string
  lineItems: InvoiceFormLineItem[]
  currency: string
  dueAt: string
}

export interface InvoiceCreatePayload {
  engagementId: string
  contractId?: string
  proposalId?: string
  templateId?: string
  title: string
  lineItems: InvoiceFormLineItem[]
  currency: string
  dueAt: string
}

export interface InvoiceUpdatePayload {
  title?: string
  lineItems?: InvoiceFormLineItem[]
  dueAt?: string
  currency?: string
}

export interface InvoiceSettlementPayload {
  paidAmountCents: number
  providerRef: 'manual'
}

export interface InvoiceCurrencyOption {
  code: string
  label: string
}

const INVOICE_CURRENCY_OPTIONS: InvoiceCurrencyOption[] = [
  { code: 'USD', label: 'USD — US Dollar' },
  { code: 'EUR', label: 'EUR — Euro' },
  { code: 'GBP', label: 'GBP — Pound Sterling' },
  { code: 'INR', label: 'INR — Indian Rupee' },
  { code: 'CAD', label: 'CAD — Canadian Dollar' },
  { code: 'AUD', label: 'AUD — Australian Dollar' },
  { code: 'SGD', label: 'SGD — Singapore Dollar' },
  { code: 'AED', label: 'AED — UAE Dirham' },
]

export function getInvoiceCurrencyOptions(): InvoiceCurrencyOption[] {
  return INVOICE_CURRENCY_OPTIONS
}

export function normalizeInvoiceCurrency(value: string | null | undefined): string {
  const normalized = (value ?? '').trim().toUpperCase()
  return /^[A-Z]{3}$/.test(normalized) ? normalized : 'USD'
}

export function invoiceLineItemTotalCents(item: InvoiceFormLineItem): number {
  return item.quantity * item.unitCents
}

export function invoicePreviewTotalCents(lineItems: InvoiceFormLineItem[]): number {
  return lineItems.reduce(
    (total, item) => total + invoiceLineItemTotalCents(item),
    0,
  )
}

export function buildManualInvoiceSettlementPayload(
  totalCents: number,
): InvoiceSettlementPayload {
  return {
    paidAmountCents: Math.max(0, Math.round(totalCents)),
    providerRef: 'manual',
  }
}

export function canBuyerSettleInvoice(
  status: InvoiceStatus,
  viewerRole: WorkspaceRole | null,
): boolean {
  return viewerRole === 'buyer' && (status === 'sent' || status === 'overdue')
}

export function buildInvoiceCreatePayload(input: InvoiceFormInput): InvoiceCreatePayload {
  const payload: InvoiceCreatePayload = {
    engagementId: input.engagementId,
    title: input.title.trim(),
    lineItems: input.lineItems.map((item) => ({
      description: item.description.trim(),
      quantity: item.quantity,
      unitCents: item.unitCents,
    })),
    currency: normalizeInvoiceCurrency(input.currency),
    dueAt: input.dueAt,
  }

  if (input.contractId) payload.contractId = input.contractId
  if (input.proposalId) payload.proposalId = input.proposalId
  if (input.templateId) payload.templateId = input.templateId

  return payload
}
import type { InvoiceStatus } from './home-types'
import type { WorkspaceRole } from './types'
