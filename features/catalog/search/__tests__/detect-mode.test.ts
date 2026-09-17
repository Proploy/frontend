import { detectSearchMode } from '../detect-mode'

describe('detectSearchMode', () => {
  it('sends names someone already knows to keyword search', () => {
    // These keep ghost completion and spell correction, which natural loses.
    expect(detectSearchMode('netsuite')).toBe('keyword')
    expect(detectSearchMode('payroll')).toBe('keyword')
    expect(detectSearchMode('project management')).toBe('keyword')
    expect(detectSearchMode('microsoft dynamics 365')).toBe('keyword')
  })

  it('sends a described need to natural search', () => {
    expect(detectSearchMode('HRIS that integrates with NetSuite')).toBe('natural')
    expect(detectSearchMode('Procurement suite for a 400-person manufacturer')).toBe('natural')
    expect(detectSearchMode('Field service platform with offline mode')).toBe('natural')
    expect(detectSearchMode('Revenue ops stack for a Series B SaaS')).toBe('natural')
  })

  it('treats a question as a described need however short', () => {
    expect(detectSearchMode('best crm?')).toBe('natural')
    expect(detectSearchMode('crm?')).toBe('natural')
  })

  it('treats a short intent phrase as a described need', () => {
    // Two words, but "find" and "best" are asking rather than naming.
    expect(detectSearchMode('find payroll')).toBe('natural')
    expect(detectSearchMode('best crm')).toBe('natural')
    expect(detectSearchMode('What is Odoo')).toBe('natural')
  })

  it('is not fooled by punctuation or casing on the opening word', () => {
    expect(detectSearchMode('  Best   CRM  ')).toBe('natural')
    expect(detectSearchMode('"find" payroll')).toBe('natural')
  })

  it('falls back to keyword for empty or whitespace input', () => {
    // An empty bar must not fire the slower, costlier natural endpoint.
    expect(detectSearchMode('')).toBe('keyword')
    expect(detectSearchMode('   ')).toBe('keyword')
  })

  it('flips at the fourth word, so names stay on the fast path', () => {
    expect(detectSearchMode('adobe creative cloud')).toBe('keyword')
    expect(detectSearchMode('adobe creative cloud express')).toBe('natural')
  })
})
