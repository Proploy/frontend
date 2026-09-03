/**
 * How long a server-side catalog response may be cached.
 *
 * Catalog reference data changes rarely, so it is cached. Two exceptions:
 *
 *  - Responses keyed by a free-text search term are never cached. Relevance
 *    ranking is computed in the gateway, so a cached entry keeps serving
 *    results from an older ranking, and caching user input would grow the
 *    cache without bound.
 *  - The category tree gets a short window. It drives the filter sidebar and
 *    the navigation menus, so a single empty or failed response is very
 *    visible, and an hour is a long time to serve one back.
 */
export const CATALOG_REVALIDATE_SECONDS = 3600
export const CATEGORY_TREE_REVALIDATE_SECONDS = 300

/** Seconds to cache a catalog response, or null when it must not be cached. */
export function catalogRevalidateSeconds(path: string): number | null {
  if (!path.includes('/catalog/')) return null

  const query = path.split('?')[1]
  const search = query ? new URLSearchParams(query).get('search') : null
  if (search && search.trim() !== '') return null

  if (path.includes('/catalog/categories')) return CATEGORY_TREE_REVALIDATE_SECONDS
  return CATALOG_REVALIDATE_SECONDS
}

/** True when a catalog response may be cached at all. */
export function isCacheableCatalogPath(path: string): boolean {
  return catalogRevalidateSeconds(path) !== null
}
