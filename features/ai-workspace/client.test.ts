import {
  addAiWorkspaceCandidate,
  saveAiWorkspaceSession,
} from './client'

describe('AI_workspace write payloads', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.stubEnv('NEXT_PUBLIC_SERVICE_APIS_URL', 'http://localhost:8020')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('sends candidate_data to the direct service-apis endpoint', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ accessToken: 'fake-token' }), {
          status: 200,
        }),
      )
      .mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      })
    vi.stubGlobal('fetch', fetchMock)

    await addAiWorkspaceCandidate({
      session_id: 'session-1',
      candidate_data: { product_id: 'product-1', name: 'Asana' },
    })

    const [, request] = fetchMock.mock.calls[1] as [string, RequestInit]
    expect(JSON.parse(String(request.body))).toEqual({
      session_id: 'session-1',
      candidate_data: { product_id: 'product-1', name: 'Asana' },
    })
  })

  it('sends profile_name to the save endpoint', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ accessToken: 'fake-token' }), {
          status: 200,
        }),
      )
      .mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      })
    vi.stubGlobal('fetch', fetchMock)

    await saveAiWorkspaceSession({
      session_id: 'session-1',
      profile_name: 'AI Workspace Profile',
    })

    const [, request] = fetchMock.mock.calls[1] as [string, RequestInit]
    expect(JSON.parse(String(request.body))).toEqual({
      session_id: 'session-1',
      profile_name: 'AI Workspace Profile',
    })
  })
})
