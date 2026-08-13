import { canSeeExpertJoinLink, isExpertRole } from './roles'

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
