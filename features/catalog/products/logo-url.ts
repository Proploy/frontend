import { getServiceApisBrowserBaseUrl } from '@/lib/service-apis/browser'

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
  const baseUrl = getServiceApisBrowserBaseUrl()
  if (!baseUrl) return null
  return `${baseUrl}/api/v1/catalog/products/${encodeURIComponent(productId)}/logo`
}
