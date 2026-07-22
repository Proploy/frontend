const { postMock } = vi.hoisted(() => ({
  postMock: vi.fn(),
}))

vi.mock('@/lib/service-apis/browser', () => ({
  ServiceApisBrowserClient: vi.fn(function ServiceApisBrowserClientMock() {
    return { post: postMock }
  }),
}))

import { describe, expect, it } from 'vitest'
import { markInvoicePaid } from './use-workspace'

describe('workspace invoice mutations', () => {
  it('posts a manual settlement through the existing mark-paid endpoint', async () => {
    postMock.mockResolvedValue({ ok: true, data: {} })

    const payload = { paidAmountCents: 25000, providerRef: 'manual' as const }
    await markInvoicePaid('invoice-1', payload)

    expect(postMock).toHaveBeenCalledWith(
      '/api/v1/workspace/invoices/invoice-1/mark-paid',
      payload,
      { requireAuth: true },
    )
  })
})
