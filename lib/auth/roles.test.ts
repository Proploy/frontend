import { canSeeExpertJoinLink, isExpertRole, isRestrictedFromSam } from './roles'

describe('account roles', () => {
  it('recognizes only the approved expert account role', () => {
    expect(isExpertRole('expert')).toBe(true)
    expect(isExpertRole('user')).toBe(false)
    expect(isExpertRole('admin')).toBe(false)
  })

  it('shows the expert join link to visitors and regular users only', () => {
    expect(canSeeExpertJoinLink(null, false)).toBe(true)
    expect(canSeeExpertJoinLink('user', true)).toBe(true)
    expect(canSeeExpertJoinLink('expert', true)).toBe(false)
    expect(canSeeExpertJoinLink('admin', true)).toBe(false)
  })
})

describe('isRestrictedFromSam', () => {
  it('keeps approved experts out of the Sam workspace', () => {
    expect(isRestrictedFromSam('expert', 'approved')).toBe(true)
    expect(isRestrictedFromSam('expert', null)).toBe(true)
    // An approved record counts even if the account role lags behind.
    expect(isRestrictedFromSam('user', 'approved')).toBe(true)
  })

  it('treats an unfinished application as a buyer', () => {
    for (const status of ['draft', 'submitted', 'in_review', 'changes_requested', 'rejected']) {
      expect(isRestrictedFromSam('user', status)).toBe(false)
    }
  })

  it('lets buyers and signed-out visitors in', () => {
    expect(isRestrictedFromSam('user')).toBe(false)
    expect(isRestrictedFromSam('business')).toBe(false)
    expect(isRestrictedFromSam(null)).toBe(false)
    expect(isRestrictedFromSam(undefined, undefined)).toBe(false)
  })
})
