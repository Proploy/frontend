export interface UserProfileResponse {
  supabaseUserId: string
  email: string
  name?: string | null
  avatarUrl?: string | null
  role: 'user' | 'expert' | 'business' | 'admin' | string
  profilePictureUrl?: string | null
  profilePictureKey?: string | null
  createdAt?: string | null
}

export interface UserProfileUpdateRequest {
  name?: string | null
  avatarUrl?: string | null
}
