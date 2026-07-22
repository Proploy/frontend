import { describe, expect, it } from 'vitest'

import { statusLabelForViewer } from '@/components/workspace/workspace-format'

describe('workspace viewer status labels', () => {
  it('shows inbound sent as Received to a buyer', () => {
    expect(statusLabelForViewer('sent', 'buyer')).toBe('Received')
  })

  it('keeps Sent for expert and admin viewers', () => {
    expect(statusLabelForViewer('sent', 'expert')).toBe('Sent')
    expect(statusLabelForViewer('sent', 'admin')).toBe('Sent')
  })

  it('does not relabel other statuses', () => {
    expect(statusLabelForViewer('paid', 'buyer')).toBe('Paid')
    expect(statusLabelForViewer('declined', 'buyer')).toBe('Declined')
  })
})
