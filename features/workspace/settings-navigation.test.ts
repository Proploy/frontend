import { describe, expect, it } from 'vitest'
import {
  buildWorkspaceSettingsHref,
  parseWorkspaceSettingsTab,
} from '@/features/workspace/settings-navigation'

describe('workspace settings navigation', () => {
  it('opens the requested settings tab from the query string', () => {
    expect(parseWorkspaceSettingsTab('?tab=scheduling')).toBe('scheduling')
    expect(parseWorkspaceSettingsTab('?tab=notifications')).toBe('notifications')
  })

  it('falls back to profile for an unknown tab', () => {
    expect(parseWorkspaceSettingsTab('?tab=unknown')).toBe('profile')
    expect(parseWorkspaceSettingsTab('')).toBe('profile')
  })

  it('builds a direct scheduling settings link', () => {
    expect(buildWorkspaceSettingsHref('scheduling')).toBe('/workspace/settings?tab=scheduling')
  })
})
