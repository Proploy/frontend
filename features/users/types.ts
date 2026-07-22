export type FavoriteTargetType = 'product' | 'expert' | 'software'

export const PERSONALIZATION_ROLES = ['user', 'expert'] as const

export function canUsePersonalization(role?: string | null): boolean {
  return role === 'user' || role === 'expert'
}

export type FavoriteRecord = {
  id: string
  userId: string
  targetType: FavoriteTargetType | string
  targetId: string
  productId?: string | null
  createdAt: string
}

export type RecentlyViewedRecord = {
  id: string
  userId: string
  targetType: FavoriteTargetType | string
  targetId: string
  viewedAt: string
}

export type SavedAiReport = {
  id: string
  userId: string
  sessionId?: string | null
  title: string
  summary?: string | null
  profile: Record<string, unknown>
  recommendations: unknown[]
  document?: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
}

export type UserProfile = {
  supabaseUserId: string
  email: string
  name?: string | null
  avatarUrl?: string | null
  profilePictureUrl?: string | null
  profilePictureKey?: string | null
  role: string
  createdAt?: string | null
}

export type PersonalizationProfile = UserProfile & {
  interests: {
    user_id: string
    industries: string[]
    platforms: string[]
    project_types: string[]
    company_sizes: string[]
  }
  favorites: FavoriteRecord[]
  recentlyViewed: RecentlyViewedRecord[]
  reports: SavedAiReport[]
}

export type UserProfileUpdate = {
  name?: string | null
  avatarUrl?: string | null
  profilePictureUrl?: string | null
}

export type SavedAiReportInput = {
  sessionId?: string | null
  title: string
  summary?: string | null
  profile?: Record<string, unknown>
  recommendations?: unknown[]
  document?: Record<string, unknown> | null
}
