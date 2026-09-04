import { isCurrentUserRestrictedFromSam } from './sam-access'

const serviceApisFetch = vi.hoisted(() => vi.fn())

vi.mock('@/lib/service-apis/server', () => ({ serviceApisFetch }))

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

/** Route each path to its own canned response. */
function route(responses: Record<string, Response | Error>) {
  serviceApisFetch.mockImplementation(async (path: string) => {
    const match = Object.entries(responses).find(([p]) => path.startsWith(p))
    const result = match?.[1] ?? json({}, 404)
    if (result instanceof Error) throw result
    return result
  })
}

const USERS_ME = '/api/v1/users/me'
const EXPERT_APPLICATION = '/api/v1/experts/me/application'

describe('isCurrentUserRestrictedFromSam', () => {
  beforeEach(() => {
    serviceApisFetch.mockReset()
  })

  it('reads role and expert status from service-apis, not Supabase', async () => {
    route({
      [USERS_ME]: json({ role: 'user' }),
      [EXPERT_APPLICATION]: json({ status: 'pending' }),
    })

    await isCurrentUserRestrictedFromSam()

    const paths = serviceApisFetch.mock.calls.map(([path]) => path)
    expect(paths).toContain(USERS_ME)
    expect(paths).toContain(EXPERT_APPLICATION)
    // Both reads are per-user and must carry the caller's token.
    serviceApisFetch.mock.calls.forEach(([, options]) => {
      expect(options).toMatchObject({ requireAuth: true })
    })
  })

  it('turns away an approved expert', async () => {
    route({
      [USERS_ME]: json({ role: 'user' }),
      [EXPERT_APPLICATION]: json({ status: 'approved' }),
    })
    expect(await isCurrentUserRestrictedFromSam()).toBe(true)
  })

  it('turns away an expert account role even with no expert record', async () => {
    route({
      [USERS_ME]: json({ role: 'expert' }),
      [EXPERT_APPLICATION]: json({ detail: 'Not found' }, 404),
    })
    expect(await isCurrentUserRestrictedFromSam()).toBe(true)
  })

  it('lets a buyer through', async () => {
    route({
      [USERS_ME]: json({ role: 'user' }),
      [EXPERT_APPLICATION]: json({ detail: 'Not found' }, 404),
    })
    expect(await isCurrentUserRestrictedFromSam()).toBe(false)
  })

  it('lets a pending or rejected applicant through — they are still buyers', async () => {
    for (const status of ['pending', 'rejected', 'draft']) {
      route({
        [USERS_ME]: json({ role: 'user' }),
        [EXPERT_APPLICATION]: json({ status }),
      })
      expect(await isCurrentUserRestrictedFromSam()).toBe(false)
    }
  })

  it('fails open when the gateway errors or is unreachable', async () => {
    // The previous implementation threw here and took the whole route down
    // with it, which is exactly how this broke in production.
    route({
      [USERS_ME]: new Error('ECONNREFUSED'),
      [EXPERT_APPLICATION]: json({}, 500),
    })
    expect(await isCurrentUserRestrictedFromSam()).toBe(false)
  })

  it('fails open on a malformed body rather than throwing', async () => {
    route({
      [USERS_ME]: new Response('<html>502</html>', {
        status: 200,
        headers: { 'content-type': 'text/html' },
      }),
      [EXPERT_APPLICATION]: json({}, 404),
    })
    expect(await isCurrentUserRestrictedFromSam()).toBe(false)
  })
})
