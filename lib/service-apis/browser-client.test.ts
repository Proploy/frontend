import { ServiceApisBrowserClient } from './browser-client'

describe('ServiceApisBrowserClient', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SERVICE_APIS_URL', 'https://service-apis.example.com')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('calls service-apis directly with the server-resolved session token', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ accessToken: 'server-session-token' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      })
    vi.stubGlobal('fetch', fetchMock)

    await new ServiceApisBrowserClient().get('/api/v1/users/me/profile', {
      requireAuth: true,
    })

    const [tokenUrl, tokenRequest] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(tokenUrl).toBe('/api/auth/session-token')
    expect(tokenRequest.cache).toBe('no-store')

    const [url, request] = fetchMock.mock.calls[1] as [string, RequestInit]
    expect(url).toBe('https://service-apis.example.com/api/v1/users/me/profile')
    const headers = new Headers(request.headers)
    expect(headers.get('authorization')).toBe('Bearer server-session-token')
    expect(headers.get('x-proploy-service-auth')).toBeNull()
  })
})
