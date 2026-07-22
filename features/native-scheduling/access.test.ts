import { describe, expect, it } from 'vitest'
import {
  nativeSchedulingAccessForRole,
  nativeSchedulingOAuthReturnPath,
} from '@/features/native-scheduling/access'

describe('native scheduling access', () => {
  it('keeps calendar ownership with experts and exposes admins in test-only mode', () => {
    expect(nativeSchedulingAccessForRole('expert')).toBe('owner')
    expect(nativeSchedulingAccessForRole('admin')).toBe('test_only')
  })

  it('does not expose native calendar controls to buyers before an engagement flow', () => {
    expect(nativeSchedulingAccessForRole('buyer')).toBe('unavailable')
    expect(nativeSchedulingAccessForRole(null)).toBe('unavailable')
  })

  it('returns to the scheduling tab after the admin smoke test', () => {
    expect(nativeSchedulingOAuthReturnPath(true)).toBe('/workspace/settings?tab=scheduling')
    expect(nativeSchedulingOAuthReturnPath(false)).toBe('/workspace/settings')
  })
})
