'use client'

export const AUTH_INTENT_COOKIE = 'auth_intent'

export function setAuthIntent(intent: string) {
  const expires = new Date()
  expires.setHours(expires.getHours() + 1)
  document.cookie = `${AUTH_INTENT_COOKIE}=${intent}; path=/; expires=${expires.toUTCString()}`
}

export function getAuthIntent(): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + AUTH_INTENT_COOKIE + '=([^;]+)'))
  if (match) return match[2]
  return null
}

export function clearAuthIntent() {
  document.cookie = `${AUTH_INTENT_COOKIE}=; path=/; max-age=0`
}
