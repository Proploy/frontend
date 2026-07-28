import {
  createEvaluation,
  saveEvaluation,
  setComparisonSelection,
  shouldReloadEvaluationAfterStream,
  streamEvaluationResearch,
} from './evaluation-client'

describe('evaluation client', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SERVICE_APIS_URL', 'http://localhost:8020')
  })

  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('reloads durable artifacts after completion or a handled stream error', () => {
    expect(
      shouldReloadEvaluationAfterStream({
        completed: true,
        errored: false,
      }),
    ).toBe(true)
    expect(
      shouldReloadEvaluationAfterStream({
        completed: false,
        errored: true,
      }),
    ).toBe(true)
    expect(
      shouldReloadEvaluationAfterStream({
        completed: false,
        errored: false,
      }),
    ).toBe(false)
  })

  it('uses authenticated evaluation endpoints without client user IDs', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ evaluation_id: 'evaluation-1' }), {
        status: 201,
        headers: { 'content-type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await createEvaluation({
      title: 'Project management tools',
      user_id: 'forged-owner',
    } as never)

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain('/api/v1/ai_workspace/evaluations')
    expect(JSON.parse(String(request.body))).toEqual({
      title: 'Project management tools',
    })
  })

  it('encodes the evaluation ID in comparison selection requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await setComparisonSelection('evaluation/one', ['asana', 'clickup'])

    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toContain(
      '/evaluations/evaluation%2Fone/comparison-selection',
    )
    expect(request.method).toBe('PUT')
    expect(JSON.parse(String(request.body))).toEqual({
      product_ids: ['asana', 'clickup'],
    })
  })

  it('saves the native durable evaluation without the legacy profile flow', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ saved: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await saveEvaluation('evaluation/one')

    const [url, request] = fetchMock.mock.calls[0] as [
      string,
      RequestInit,
    ]
    expect(url).toContain(
      '/api/v1/ai_workspace/evaluations/evaluation%2Fone/save',
    )
    expect(request.method).toBe('POST')
    expect(JSON.parse(String(request.body))).toEqual({})
  })

  it('reports an incomplete stream so optimistic text is not replaced by stale history', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        [
          'event: message_delta',
          'data: {"delta":"New response"}',
          '',
          'event: error',
          'data: {"code":"TIMEOUT","message":"Timed out","retryable":true}',
          '',
          '',
        ].join('\n'),
        {
          status: 200,
          headers: { 'content-type': 'text/event-stream' },
        },
      ),
    )
    vi.stubGlobal('fetch', fetchMock)
    const events: string[] = []

    const result = await streamEvaluationResearch(
      'evaluation-1',
      'Plan an implementation',
      (event) => events.push(event.type),
    )

    expect(events).toEqual(['message_delta', 'error'])
    expect(result).toEqual({ completed: false, errored: true })
  })

  it('marks an unexpected end-of-stream as interrupted', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          [
            'event: message_delta',
            'data: {"delta":"Partial response"}',
            '',
            '',
          ].join('\n'),
          {
            status: 200,
            headers: { 'content-type': 'text/event-stream' },
          },
        ),
      ),
    )
    const events: string[] = []

    const result = await streamEvaluationResearch(
      'evaluation-1',
      'Continue',
      (event) => events.push(event.type),
    )

    expect(events).toEqual(['message_delta', 'error'])
    expect(result).toEqual({ completed: false, errored: true })
  })

  it('emits a visible error when a successful response has no body', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(null, {
          status: 200,
          headers: { 'content-type': 'text/event-stream' },
        }),
      ),
    )
    const events: string[] = []

    const result = await streamEvaluationResearch(
      'evaluation-1',
      'Continue',
      (event) => events.push(event.type),
    )

    expect(events).toEqual(['error'])
    expect(result).toEqual({ completed: false, errored: true })
  })
})
