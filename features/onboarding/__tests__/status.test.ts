import { describe, expect, it } from 'vitest'
import { hasCapturedInterests, isOnboarded } from '../status'

const NO_SIGNALS = { role: 'user', hasExpertApplication: false, interests: null }

describe('hasCapturedInterests', () => {
  it('is false for missing, empty, or malformed payloads', () => {
    expect(hasCapturedInterests(null)).toBe(false)
    expect(hasCapturedInterests(undefined)).toBe(false)
    expect(hasCapturedInterests({ industries: [], platforms: [], project_types: [], company_sizes: [] })).toBe(false)
    expect(hasCapturedInterests({ industries: null, platforms: undefined })).toBe(false)
  })

  it('is true as soon as any list has an entry', () => {
    expect(hasCapturedInterests({ industries: ['Fintech'] })).toBe(true)
    expect(hasCapturedInterests({ company_sizes: ['11-50'] })).toBe(true)
  })
})

describe('isOnboarded', () => {
  it('gates a fresh account with no signals', () => {
    expect(isOnboarded(NO_SIGNALS)).toBe(false)
  })

  it('treats expert and admin roles as onboarded', () => {
    expect(isOnboarded({ ...NO_SIGNALS, role: 'expert' })).toBe(true)
    expect(isOnboarded({ ...NO_SIGNALS, role: 'admin' })).toBe(true)
  })

  it('treats any expert application — including an unsubmitted draft — as onboarded', () => {
    expect(isOnboarded({ ...NO_SIGNALS, hasExpertApplication: true })).toBe(true)
  })

  it('treats captured buyer interests as onboarded', () => {
    expect(isOnboarded({ ...NO_SIGNALS, interests: { platforms: ['HubSpot'] } })).toBe(true)
  })

  it('fails open when a signal could not be read', () => {
    expect(isOnboarded({ ...NO_SIGNALS, signalsUnavailable: true })).toBe(true)
  })
})
