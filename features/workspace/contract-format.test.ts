import { describe, expect, it } from 'vitest'
import {
  contractContentCompleteness,
  contractFieldValuesFromBody,
  contractSignerAction,
  parseContractSections,
} from './contract-format'

describe('contract format helpers', () => {
  it('parses headings and bullets without exposing Markdown markers', () => {
    const sections = parseContractSections('## Parties\n\n- Buyer: Priyanshu\n- Expert: Jane')

    expect(sections).toEqual([
      { title: 'Parties', paragraphs: [], bullets: ['Buyer: Priyanshu', 'Expert: Jane'] },
    ])
  })

  it('extracts editable fields and flags unresolved placeholders', () => {
    const values = contractFieldValuesFromBody(
      '## Services and deliverables\n\nConfigure ClickUP\n\n## Fees and payment\n\n[Fees and payment]',
    )

    expect(values.servicesDescription).toBe('Configure ClickUP')
    expect(values.consideration).toBe('')
    expect(contractContentCompleteness(values).missing).toContain('Fees and payment')
  })

  it('exposes the next signing action for each party', () => {
    expect(contractSignerAction('buyer', 'sent')).toBe('sign')
    expect(contractSignerAction('expert', 'buyer_signed')).toBe('sign')
    expect(contractSignerAction('buyer', 'draft')).toBe('waiting')
    expect(contractSignerAction('expert', 'sent')).toBe('waiting')
  })
})
