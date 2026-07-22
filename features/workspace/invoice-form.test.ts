import { describe, expect, it } from 'vitest'

import {
  buildManualInvoiceSettlementPayload,
  buildInvoiceCreatePayload,
  canBuyerSettleInvoice,
  getInvoiceCurrencyOptions,
  invoiceLineItemTotalCents,
  invoicePreviewTotalCents,
  normalizeInvoiceCurrency,
} from './invoice-form'

describe('workspace invoice form', () => {
  const input = {
    engagementId: 'engagement-1',
    title: 'Implementation phase 1',
    currency: 'USD',
    dueAt: '2026-08-01T00:00:00.000Z',
    lineItems: [
      { description: 'Discovery', quantity: 2, unitCents: 5000 },
      { description: 'Build', quantity: 3, unitCents: 10000 },
    ],
  }

  it('exposes selectable invoice currencies with USD first', () => {
    expect(getInvoiceCurrencyOptions().map((option) => option.code)).toEqual([
      'USD',
      'EUR',
      'GBP',
      'INR',
      'CAD',
      'AUD',
      'SGD',
      'AED',
    ])
  })

  it('calculates each editable line item amount from quantity and unit price', () => {
    expect(invoiceLineItemTotalCents({ description: 'Build', quantity: 3, unitCents: 1250 })).toBe(3750)
  })

  it('normalizes legacy or invalid currency values before formatting or sending', () => {
    expect(normalizeInvoiceCurrency('eur')).toBe('EUR')
    expect(normalizeInvoiceCurrency('US')).toBe('USD')
    expect(normalizeInvoiceCurrency('')).toBe('USD')
  })

  it('calculates the client preview without becoming the server total', () => {
    expect(invoicePreviewTotalCents(input.lineItems)).toBe(40000)
  })

  it('builds the service-api create payload and preserves optional references', () => {
    expect(
      buildInvoiceCreatePayload({
        ...input,
        contractId: 'contract-1',
        proposalId: 'proposal-1',
        templateId: 'template-1',
      }),
    ).toEqual({
      engagementId: 'engagement-1',
      contractId: 'contract-1',
      proposalId: 'proposal-1',
      templateId: 'template-1',
      title: 'Implementation phase 1',
      currency: 'USD',
      dueAt: '2026-08-01T00:00:00.000Z',
      lineItems: input.lineItems,
    })
  })

  it('builds a full-total manual settlement payload', () => {
    expect(buildManualInvoiceSettlementPayload(25000)).toEqual({
      paidAmountCents: 25000,
      providerRef: 'manual',
    })
  })

  it('allows only buyers to settle sent or overdue invoices', () => {
    expect(canBuyerSettleInvoice('sent', 'buyer')).toBe(true)
    expect(canBuyerSettleInvoice('overdue', 'buyer')).toBe(true)
    expect(canBuyerSettleInvoice('sent', 'expert')).toBe(false)
    expect(canBuyerSettleInvoice('draft', 'buyer')).toBe(false)
  })
})
