// TODO(cleanup): Replace PRODUCT_TABS with a hook-driven tab config from service-apis.
// Currently hardcoded because no backend endpoint provides tab structure.
// When service-apis exposes a product tabs/overview endpoint, remove this file
// and derive tab configuration from the hook response instead.

export type ProductTabKey =
  | 'product-information'
  | 'integrations'
  | 'pricing'
  | 'reviews'
  | 'features'
  | 'vetted-experts'

export const PRODUCT_TABS: Array<{ key: ProductTabKey; label: string; badge?: string }> = [
  { key: 'product-information', label: 'Product Information' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'features', label: 'Features' },
  { key: 'vetted-experts', label: 'Vetted Expert Implementation', badge: '20' },
]