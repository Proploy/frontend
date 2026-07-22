import type { WorkspaceEngagement } from './types'

export function applyEngagementStatusResponse(
  current: WorkspaceEngagement[],
  updated: WorkspaceEngagement,
): WorkspaceEngagement[] {
  if (!current.some((engagement) => engagement.id === updated.id)) return current
  return current.map((engagement) => engagement.id === updated.id ? updated : engagement)
}
