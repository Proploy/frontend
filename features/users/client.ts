import { ServiceApisBrowserClient } from '@/lib/service-apis/browser'
import type { NormalizedError } from '@/lib/service-apis/error-utils'
import type {
  FavoriteRecord,
  FavoriteTargetType,
  PersonalizationProfile,
  RecentlyViewedRecord,
  SavedAiReport,
  SavedAiReportInput,
  UserProfile,
  UserProfileUpdate,
} from './types'

const client = new ServiceApisBrowserClient()
const USERS_ROOT = '/api/v1/users'
type ApiResult<T> = { ok: true; data: T } | NormalizedError

export const USER_PROFILE_PICTURE_CHANGED_EVENT = 'proploy:user-profile-picture-changed'

export function notifyUserProfilePictureChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(USER_PROFILE_PICTURE_CHANGED_EVENT))
}

export async function listFavorites(
  targetType?: FavoriteTargetType,
): Promise<ApiResult<FavoriteRecord[]>> {
  const query = targetType ? `?targetType=${encodeURIComponent(targetType)}` : ''
  return client.get<FavoriteRecord[]>(`${USERS_ROOT}/favorites${query}`, { requireAuth: true })
}

export async function addFavorite(payload: {
  targetType: FavoriteTargetType
  targetId: string
}): Promise<ApiResult<FavoriteRecord>> {
  return client.post<FavoriteRecord>(`${USERS_ROOT}/favorites`, payload, { requireAuth: true })
}

export async function removeFavorite(favoriteId: string): Promise<ApiResult<unknown>> {
  return client.delete(`${USERS_ROOT}/favorites/${encodeURIComponent(favoriteId)}`, { requireAuth: true })
}

export async function listRecentlyViewed(): Promise<ApiResult<RecentlyViewedRecord[]>> {
  return client.get<RecentlyViewedRecord[]>(`${USERS_ROOT}/recently-viewed`, { requireAuth: true })
}

export async function trackRecentlyViewed(payload: {
  targetType: FavoriteTargetType
  targetId: string
}): Promise<ApiResult<RecentlyViewedRecord>> {
  return client.post<RecentlyViewedRecord>(`${USERS_ROOT}/recently-viewed`, payload, { requireAuth: true })
}

export async function getUserProfile(): Promise<ApiResult<UserProfile>> {
  return client.get<UserProfile>(`${USERS_ROOT}/me`, { requireAuth: true })
}

export async function updateUserProfile(payload: UserProfileUpdate): Promise<ApiResult<UserProfile>> {
  return client.patch<UserProfile>(`${USERS_ROOT}/me`, payload, { requireAuth: true })
}

export async function uploadUserProfilePicture(file: File): Promise<ApiResult<UserProfile>> {
  return client.postBinary<UserProfile>(
    `${USERS_ROOT}/me/profile-picture/upload?filename=${encodeURIComponent(file.name)}`,
    file,
    { requireAuth: true },
  )
}

export async function getUserProfilePicture(): Promise<ApiResult<Blob>> {
  return client.getBinary(`${USERS_ROOT}/me/profile-picture`, { requireAuth: true })
}

export async function deleteUserProfilePicture(): Promise<ApiResult<UserProfile>> {
  return client.delete<UserProfile>(`${USERS_ROOT}/me/profile-picture`, { requireAuth: true })
}

export async function getPersonalizationProfile(): Promise<ApiResult<PersonalizationProfile>> {
  return client.get<PersonalizationProfile>(`${USERS_ROOT}/me/profile`, { requireAuth: true })
}

export async function listSavedReports(): Promise<ApiResult<SavedAiReport[]>> {
  return client.get<SavedAiReport[]>(`${USERS_ROOT}/me/reports`, { requireAuth: true })
}

export async function saveAiReport(payload: SavedAiReportInput): Promise<ApiResult<SavedAiReport>> {
  return client.post<SavedAiReport>(`${USERS_ROOT}/me/reports`, {
    sessionId: payload.sessionId ?? null,
    title: payload.title,
    summary: payload.summary ?? null,
    profile: payload.profile ?? {},
    recommendations: payload.recommendations ?? [],
    document: payload.document ?? null,
  }, { requireAuth: true })
}

export async function deleteSavedReport(reportId: string): Promise<ApiResult<unknown>> {
  return client.delete(`${USERS_ROOT}/me/reports/${encodeURIComponent(reportId)}`, { requireAuth: true })
}
