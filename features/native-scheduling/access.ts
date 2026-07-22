import type { WorkspaceRole } from '@/features/workspace/types'

export type NativeSchedulingAccessMode = 'owner' | 'test_only' | 'unavailable'

export function nativeSchedulingAccessForRole(
  role: WorkspaceRole | null,
): NativeSchedulingAccessMode {
  if (role === 'expert') return 'owner'
  if (role === 'admin') return 'test_only'
  return 'unavailable'
}

export function nativeSchedulingOAuthReturnPath(testOnly: boolean): string {
  return testOnly ? '/workspace/settings?tab=scheduling' : '/workspace/settings'
}
