// @vitest-environment node
import { vi } from 'vitest'

const exchangeCodeForSession = vi.fn()
const serviceApisFetch = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({ auth: { exchangeCodeForSession } }),
}))
vi.mock('@/lib/service-apis/server', () => ({
  serviceApisFetch: (...args: unknown[]) => serviceApisFetch(...args),
}))

import { GET } from './route'

const ORIGIN = 'https://proploy.io'

function callback(query: string, cookie?: string) {
  return GET(
    new Request(`https://proploy-frontend.run.app/auth/callback?code=abc${query}`, {
      headers: cookie ? { cookie } : {},
    }),
  )
}

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_APP_URL', ORIGIN)
  exchangeCodeForSession.mockResolvedValue({
    data: { session: { access_token: 'token' } },
    error: null,
  })
  serviceApisFetch.mockResolvedValue(new Response('{}', { status: 200 }))
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('GET /auth/callback', () => {
  it('redirects to the decoded auth_intent cookie path', async () => {
    const res = await callback('&redirectTo=%2F', 'auth_intent=%2Fbecome-expert')
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe(`${ORIGIN}/become-expert`)
  })

  it('falls back to the redirectTo param without a cookie', async () => {
    const res = await callback('&redirectTo=%2Fbecome-expert')
    expect(res.headers.get('location')).toBe(`${ORIGIN}/become-expert`)
  })

  it.each([
    ['@evil.example'],
    ['//evil.example'],
    ['https://evil.example'],
    ['/\\evil.example'],
  ])('ignores an off-origin next=%s', async (next) => {
    const res = await callback(`&next=${encodeURIComponent(next)}`)
    expect(res.headers.get('location')).toBe(`${ORIGIN}/workspace`)
  })

  it('ignores an off-origin cookie and uses the param instead', async () => {
    const res = await callback('&redirectTo=%2Fbecome-expert', 'auth_intent=%2F%2Fevil.example')
    expect(res.headers.get('location')).toBe(`${ORIGIN}/become-expert`)
  })
})
