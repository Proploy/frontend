/**
 * Client-side read cache shared by every page that reads server data.
 *
 * One entry per request key. A read returns fresh data straight from memory,
 * de-duplicates concurrent requests for the same key, and serves stale data
 * while a refresh runs in the background (stale-while-revalidate). Catalog
 * reads are also persisted to sessionStorage so a reload or a second page
 * does not refetch reference data.
 *
 * Writes never go through here. After a write, call `invalidateQueries()` with
 * the affected path prefix so the next read refetches.
 */

export interface CacheEntry<T = unknown> {
  data: T
  fetchedAt: number
  ttlMs: number
}

export interface CachedReadOptions {
  /** How long an entry counts as fresh. */
  ttlMs: number
  /** Keep serving a stale entry (and refresh in the background) up to this age. */
  staleMs?: number
  /** Mirror the entry into sessionStorage. Only for public reference data. */
  persist?: boolean
}

type Listener = () => void

const STORAGE_PREFIX = 'proploy:q:'

const entries = new Map<string, CacheEntry>()
const inflight = new Map<string, Promise<unknown>>()
const listeners = new Map<string, Set<Listener>>()

function now(): number {
  return Date.now()
}

function notify(key: string) {
  listeners.get(key)?.forEach((listener) => listener())
}

function readStorage<T>(key: string): CacheEntry<T> | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_PREFIX + key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CacheEntry<T>
    if (typeof parsed.fetchedAt !== 'number' || typeof parsed.ttlMs !== 'number') return null
    return parsed
  } catch {
    return null
  }
}

function writeStorage(key: string, entry: CacheEntry) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry))
  } catch {
    // Quota or private mode: memory cache still works.
  }
}

function removeStorage(key: string) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(STORAGE_PREFIX + key)
  } catch {
    // ignore
  }
}

/** Fresh or stale entry for a key, or null. */
export function peekQuery<T>(key: string): CacheEntry<T> | null {
  const memory = entries.get(key) as CacheEntry<T> | undefined
  if (memory) return memory
  const stored = readStorage<T>(key)
  if (stored) entries.set(key, stored)
  return stored
}

export function isFresh(entry: CacheEntry, at = now()): boolean {
  return at - entry.fetchedAt < entry.ttlMs
}

export function setQuery<T>(key: string, data: T, options: Pick<CachedReadOptions, 'ttlMs' | 'persist'>) {
  const entry: CacheEntry<T> = { data, fetchedAt: now(), ttlMs: options.ttlMs }
  entries.set(key, entry)
  if (options.persist) writeStorage(key, entry)
  notify(key)
}

/** Drop every entry whose key starts with `prefix` (empty = everything). */
export function invalidateQueries(prefix = '') {
  for (const key of Array.from(entries.keys())) {
    if (key.startsWith(prefix)) {
      entries.delete(key)
      removeStorage(key)
      notify(key)
    }
  }
  if (typeof window === 'undefined') return
  try {
    const stored = Object.keys(window.sessionStorage).filter((k) => k.startsWith(STORAGE_PREFIX + prefix))
    stored.forEach((k) => window.sessionStorage.removeItem(k))
  } catch {
    // ignore
  }
}

export function subscribeQuery(key: string, listener: Listener): () => void {
  let set = listeners.get(key)
  if (!set) {
    set = new Set()
    listeners.set(key, set)
  }
  set.add(listener)
  return () => {
    set?.delete(listener)
    if (set && set.size === 0) listeners.delete(key)
  }
}

/**
 * Read through the cache. The fetcher runs at most once per key at a time.
 * Fresh entry: resolved from memory. Stale entry within `staleMs`: returned
 * now, refreshed in the background. Otherwise: awaited.
 */
export async function cachedRead<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CachedReadOptions,
): Promise<T> {
  const at = now()
  const existing = peekQuery<T>(key)
  if (existing && isFresh(existing, at)) return existing.data

  const revalidate = () => {
    const pending = inflight.get(key) as Promise<T> | undefined
    if (pending) return pending
    const run = fetcher()
      .then((data) => {
        setQuery(key, data, options)
        return data
      })
      .finally(() => {
        inflight.delete(key)
      })
    inflight.set(key, run)
    return run
  }

  const staleMs = options.staleMs ?? 0
  if (existing && staleMs > 0 && at - existing.fetchedAt < existing.ttlMs + staleMs) {
    void revalidate().catch(() => undefined)
    return existing.data
  }
  return revalidate()
}

/** Test-only reset. */
export function clearQueryCache() {
  entries.clear()
  inflight.clear()
  if (typeof window !== 'undefined') {
    try {
      Object.keys(window.sessionStorage)
        .filter((k) => k.startsWith(STORAGE_PREFIX))
        .forEach((k) => window.sessionStorage.removeItem(k))
    } catch {
      // ignore
    }
  }
}
