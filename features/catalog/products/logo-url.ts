import { getServiceApisBrowserBaseUrl } from '@/lib/service-apis/browser'

const PRODUCTION_SERVICE_APIS_URL = 'https://service-apis-731353524841.australia-southeast1.run.app'

// Product logo URLs resolve directly through the service-apis gateway.

/**
 * Convert any non-empty catalog logo reference into the backend logo route.
 *
 * The catalog may contain legacy Supabase public URLs, but those URLs must
 * never become browser image requests. The product id is the authoritative
 * lookup key for the approved logo endpoint.
 */
export function getProductLogoUrl(productId: string, logoReference: string | null | undefined): string | null {
  if (!logoReference) return null

  const baseUrl = getServiceApisBrowserBaseUrl() || PRODUCTION_SERVICE_APIS_URL

  if (logoReference.startsWith('/')) {
    return `${baseUrl}${logoReference}`
  }

  if (logoReference.startsWith('http://') || logoReference.startsWith('https://')) {
    if (logoReference.includes('/api/v1/catalog/products/')) {
      const path = logoReference.substring(logoReference.indexOf('/api/v1/catalog/products/'))
      return `${baseUrl}${path}`
    }
  }

  return `${baseUrl}/api/v1/catalog/products/${encodeURIComponent(productId)}/logo`
}
