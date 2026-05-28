const SERVICE_APIS_URL = process.env.NEXT_PUBLIC_SERVICE_APIS_URL

export async function syncUserToServiceApis(accessToken: string): Promise<boolean> {
  if (!SERVICE_APIS_URL) {
    console.warn('[auth-sync] NEXT_PUBLIC_SERVICE_APIS_URL is not configured')
    return false
  }

  try {
    const res = await fetch(`${SERVICE_APIS_URL}/api/v1/auth/sync`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const errorText = await res.text().catch(() => '')
      console.error('[auth-sync] sync failed:', res.status, errorText)
      return false
    }

    return true
  } catch (err) {
    console.error('[auth-sync] sync network error:', err)
    return false
  }
}
