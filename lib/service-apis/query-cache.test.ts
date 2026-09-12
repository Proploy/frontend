import { afterEach, describe, expect, it, vi } from 'vitest'
import { cachedRead, clearQueryCache, invalidateQueries, peekQuery, setQuery } from './query-cache'

afterEach(() => {
  clearQueryCache()
  vi.useRealTimers()
})

describe('cachedRead', () => {
  it('fetches once and serves the fresh entry from memory', async () => {
    const fetcher = vi.fn(async () => ({ n: 1 }))
    const a = await cachedRead('k', fetcher, { ttlMs: 1000 })
    const b = await cachedRead('k', fetcher, { ttlMs: 1000 })
    expect(a).toEqual({ n: 1 })
    expect(b).toBe(a)
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('de-duplicates concurrent reads for the same key', async () => {
    let resolve: (v: number) => void = () => undefined
    const fetcher = vi.fn(() => new Promise<number>((r) => { resolve = r }))
    const p1 = cachedRead('k', fetcher, { ttlMs: 1000 })
    const p2 = cachedRead('k', fetcher, { ttlMs: 1000 })
    resolve(7)
    expect(await p1).toBe(7)
    expect(await p2).toBe(7)
    expect(fetcher).toHaveBeenCalledTimes(1)
  })

  it('serves stale data and refreshes in the background within staleMs', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const fetcher = vi.fn(async () => Date.now())
    await cachedRead('k', fetcher, { ttlMs: 100, staleMs: 100 })
    vi.setSystemTime(150)
    const stale = await cachedRead('k', fetcher, { ttlMs: 100, staleMs: 100 })
    expect(stale).toBe(0)
    await vi.runAllTimersAsync()
    expect(fetcher).toHaveBeenCalledTimes(2)
    expect(peekQuery<number>('k')?.data).toBe(150)
  })

  it('refetches after the stale window and after invalidation', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(0)
    const fetcher = vi.fn(async () => 'v')
    await cachedRead('k', fetcher, { ttlMs: 100 })
    vi.setSystemTime(500)
    await cachedRead('k', fetcher, { ttlMs: 100 })
    expect(fetcher).toHaveBeenCalledTimes(2)
    invalidateQueries('k')
    await cachedRead('k', fetcher, { ttlMs: 100 })
    expect(fetcher).toHaveBeenCalledTimes(3)
  })

  it('does not cache a failed read', async () => {
    const fetcher = vi.fn()
      .mockRejectedValueOnce(new Error('down'))
      .mockResolvedValueOnce('ok')
    await expect(cachedRead('k', fetcher, { ttlMs: 1000 })).rejects.toThrow('down')
    expect(await cachedRead('k', fetcher, { ttlMs: 1000 })).toBe('ok')
  })

  it('invalidates by prefix only', () => {
    setQuery('auth:/a', 1, { ttlMs: 1000 })
    setQuery('public:/a', 2, { ttlMs: 1000 })
    invalidateQueries('auth:')
    expect(peekQuery('auth:/a')).toBeNull()
    expect(peekQuery<number>('public:/a')?.data).toBe(2)
  })
})
