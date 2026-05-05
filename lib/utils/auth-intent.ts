export const AUTH_INTENT_COOKIE = 'auth_intent'

export function setAuthIntentCookie(value: string, maxAge = 3600): string {
  return `${AUTH_INTENT_COOKIE}=${value}; path=/; max-age=${maxAge}; HttpOnly`
}

export function getAuthIntentFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const authIntent = cookies.find(c => c.startsWith(`${AUTH_INTENT_COOKIE}=`))
  if (authIntent) {
    return authIntent.split('=')[1]
  }
  return null
}

export function clearAuthIntentCookie(): string {
  return `${AUTH_INTENT_COOKIE}=; path=/; max-age=0`
}
