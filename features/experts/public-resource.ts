import { getServiceApisBrowserBaseUrl } from '@/lib/service-apis/browser'

const PRODUCTION_SERVICE_APIS_URL = 'https://service-apis-731353524841.australia-southeast1.run.app'

/**
 * Resolve expert media and uploaded evidence through service-apis.
 * Raw Supabase Storage URLs are deliberately rejected, including legacy rows.
 */
export function resolveExpertPublicResourceUrl(value: string | null | undefined): string | null {
  if (!value || typeof value !== 'string') return null

  if (value.startsWith('/api/v1/experts/')) {
    const serviceBaseUrl = getServiceApisBrowserBaseUrl() || PRODUCTION_SERVICE_APIS_URL
    return `${serviceBaseUrl}${value}`
  }

  if (value.startsWith('/')) return null

  // Ensure URLs without protocol default to https://
  let urlToParse = value
  if (!/^https?:\/\//i.test(value)) {
    urlToParse = `https://${value}`
  }

  try {
    const parsed = new URL(urlToParse)
    const hostname = parsed.hostname.toLowerCase()
    const configuredHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.toLowerCase()
      : ''
    if (
      parsed.pathname.startsWith('/storage/v1/object/')
      && (
        hostname === configuredHostname
        || hostname.endsWith('.supabase.co')
        || hostname.endsWith('.supabase.in')
      )
    ) {
      return null
    }
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? urlToParse : null
  } catch {
    return null
  }
}
