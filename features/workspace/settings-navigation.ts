export type WorkspaceSettingsTab = 'profile' | 'notifications' | 'scheduling'

const SETTINGS_TABS: WorkspaceSettingsTab[] = ['profile', 'notifications', 'scheduling']

export function parseWorkspaceSettingsTab(search: string): WorkspaceSettingsTab {
  const requestedTab = new URLSearchParams(search).get('tab')
  return requestedTab && SETTINGS_TABS.includes(requestedTab as WorkspaceSettingsTab)
    ? requestedTab as WorkspaceSettingsTab
    : 'profile'
}

export function buildWorkspaceSettingsHref(tab: WorkspaceSettingsTab): string {
  return `/workspace/settings?tab=${tab}`
}
