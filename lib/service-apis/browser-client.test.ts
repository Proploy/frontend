import { ServiceApisBrowserClient } from './browser-client'

describe('ServiceApisBrowserClient', () => {
  it('routes through the first-party proxy instead of calling service-apis directly', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    })
    vi.stubGlobal('fetch', fetchMock)

    await new ServiceApisBrowserClient().get('/api/v1/users/favorites', {
      requireAuth: true,
    })

    // Exactly one request: the browser no longer fetches a token of its own.
    expect(fetchMock).toHaveBeenCalledTimes(1)

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('/api/proxy/api/v1/users/favorites')
  })

  it('never lets the browser influence the auth decision', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    })
    vi.stubGlobal('fetch', fetchMock)

    await new ServiceApisBrowserClient().get('/api/v1/users/favorites', {
      requireAuth: true,
    })

    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit]
    const headers = new Headers(request.headers)

    // The proxy decides requireAuth from a server-side path allowlist. A
    // client-supplied hint or token here would be a trust boundary violation.
    expect(headers.get('x-require-auth')).toBeNull()
    expect(headers.get('authorization')).toBeNull()
  })
})
