/**
 * Which server-side catalog responses may be cached.
 *
 * Catalog reference data (the category tree, filter facets, a product detail
 * page) changes rarely, so it is cached for an hour. Responses keyed by a
 * free-text search term are never cached, for two reasons:
 *
 *  - Relevance ranking is computed in the gateway. A cached entry keeps
 *    serving results from an older ranking long after the ranking changed,
 *    which is how one query can return a stale, much shorter list while a
 *    neighbouring query returns the current one.
 *  - Every distinct query string becomes its own cache entry, so caching
 *    user input grows the cache without bound.
 */
export function isCacheableCatalogPath(path: string): boolean {
  if (!path.includes('/catalog/')) return false

  const query = path.split('?')[1]
  if (!query) return true

  const search = new URLSearchParams(query).get('search')
  return !search || search.trim() === ''
}
