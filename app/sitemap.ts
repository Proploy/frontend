import type { MetadataRoute } from 'next'

import { serverCatalogApi } from '@/features/catalog/shared/server-api'
import { SITE_URL } from '@/lib/seo'

// Rebuilt hourly, matching the product pages' own revalidate. Built once and
// cached otherwise, so a crawler hitting it costs one catalog walk an hour.
export const revalidate = 3600

// Public pages only. Expert profiles are left out until `experts/[id]` renders
// on the server: today it is a client page with no metadata of its own, so
// listing it would point crawlers at a spinner.
const STATIC_ROUTES: Array<{ path: string; priority: number }> = [
  { path: '/', priority: 1 },
  { path: '/products', priority: 0.9 },
  { path: '/experts', priority: 0.9 },
  { path: '/for-businesses', priority: 0.8 },
  { path: '/for-experts', priority: 0.8 },
  { path: '/ask-sam', priority: 0.7 },
  { path: '/proploy-agent', priority: 0.7 },
  { path: '/discover-experts', priority: 0.7 },
  { path: '/experts/top', priority: 0.6 },
  { path: '/experts/engineering', priority: 0.6 },
  { path: '/experts/data-ai', priority: 0.6 },
  { path: '/experts/product', priority: 0.6 },
  { path: '/experts/marketing', priority: 0.6 },
  { path: '/experts/finance-ops', priority: 0.6 },
  { path: '/experts/consulting', priority: 0.6 },
  { path: '/become-expert', priority: 0.6 },
  { path: '/post-a-job', priority: 0.6 },
  { path: '/find-work', priority: 0.6 },
  { path: '/get-discovered', priority: 0.6 },
  { path: '/manage-projects', priority: 0.5 },
  { path: '/manage-team-projects', priority: 0.5 },
  { path: '/hiring-workspace', priority: 0.5 },
  { path: '/hiring-calculator', priority: 0.5 },
  { path: '/sign-contracts', priority: 0.5 },
  { path: '/send-invoices', priority: 0.5 },
  { path: '/approve-invoices', priority: 0.5 },
  { path: '/payments', priority: 0.5 },
  { path: '/global-payments', priority: 0.5 },
  { path: '/global-payments-tax', priority: 0.5 },
  { path: '/commission', priority: 0.5 },
  { path: '/for-agencies', priority: 0.5 },
  { path: '/for-partners', priority: 0.5 },
  { path: '/for-investors', priority: 0.4 },
  { path: '/partnerships', priority: 0.4 },
  { path: '/customers', priority: 0.5 },
  { path: '/blog', priority: 0.5 },
  { path: '/guides', priority: 0.5 },
  { path: '/events', priority: 0.4 },
  { path: '/faqs', priority: 0.5 },
  { path: '/help', priority: 0.4 },
  { path: '/mission', priority: 0.4 },
  { path: '/careers', priority: 0.4 },
  { path: '/contact', priority: 0.4 },
  { path: '/refer', priority: 0.3 },
  { path: '/legal/terms', priority: 0.2 },
  { path: '/legal/privacy', priority: 0.2 },
  { path: '/legal/cookies', priority: 0.2 },
]

const PAGE_SIZE = 100
// A ceiling on the walk, not an expected size: the catalog holds under a
// hundred published products today.
const MAX_PAGES = 50

async function productIds(): Promise<string[]> {
  const ids: string[] = []
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const result = await serverCatalogApi.products.list({ limit: PAGE_SIZE, offset: page * PAGE_SIZE })
    // A catalog outage must not take the sitemap down with it: the marketing
    // routes are still worth serving, and the next rebuild picks products up.
    if (!result.ok) break
    ids.push(...result.data.results.map((product) => product.product_id))
    if (result.data.results.length < PAGE_SIZE || ids.length >= result.data.total) break
  }
  return Array.from(new Set(ids))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === '/' ? '' : path}`,
    changeFrequency: 'weekly',
    priority,
  }))

  const products: MetadataRoute.Sitemap = (await productIds()).map((id) => ({
    url: `${SITE_URL}/products/${encodeURIComponent(id)}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...pages, ...products]
}
