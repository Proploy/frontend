import { ServiceApisBrowserClient } from './browser-client'

const { getSessionMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getSession: getSessionMock },
  }),
}))

describe('ServiceApisBrowserClient', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SERVICE_APIS_URL', 'https://service-apis.example.com')
    getSessionMock.mockResolvedValue({
      data: { session: { access_token: 'browser-session-token' } },
    })
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    getSessionMock.mockReset()
  })

  it('calls service-apis directly with the browser Supabase access token', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({}),
    })
    vi.stubGlobal('fetch', fetchMock)

    await new ServiceApisBrowserClient().get('/api/v1/users/me/profile', {
      requireAuth: true,
    })

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://service-apis.example.com/api/v1/users/me/profile')
    const headers = new Headers(request.headers)
    expect(headers.get('authorization')).toBe('Bearer browser-session-token')
    expect(headers.get('x-proploy-service-auth')).toBeNull()
  })
})
