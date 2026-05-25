import type { UserProfileResponse } from '@/hooks/types/user-contracts'
import type { AccountSettingsViewModel } from '@/hooks/types/settings-view-models'

function formatDate(value?: string | null) {
  if (!value) return 'Not available'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not available'
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function mapUserProfileToAccountSettings(profile: UserProfileResponse): AccountSettingsViewModel {
  return {
    id: profile.supabaseUserId,
    email: profile.email,
    name: profile.name?.trim() || profile.email,
    role: profile.role,
    avatarUrl: profile.avatarUrl ?? null,
    profilePictureUrl: profile.profilePictureUrl ?? null,
    createdAtLabel: formatDate(profile.createdAt),
  }
}
