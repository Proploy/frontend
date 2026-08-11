import { describe, expect, it } from 'vitest'

import { mapTurnsToMessages } from '@/features/ai-workspace/session-history'

describe('mapTurnsToMessages', () => {
  it('returns an empty array when turns is null', () => {
    expect(mapTurnsToMessages(null)).toEqual([])
  })

  it('returns an empty array when turns is not an array', () => {
    expect(mapTurnsToMessages({})).toEqual([])
    expect(mapTurnsToMessages('turns')).toEqual([])
    expect(mapTurnsToMessages(undefined)).toEqual([])
  })

  it('skips entries that are not objects', () => {
    const messages = mapTurnsToMessages([null, 'invalid', 42, true])
    expect(messages).toEqual([])
  })

  it('maps a full user+assistant turn into two messages', () => {
    const messages = mapTurnsToMessages([
      {
        turn_id: 'turn-1',
        user_message: 'What is Notion?',
        assistant_message: 'Notion is a productivity tool.',
        timestamp: '2026-07-15T10:00:00Z',
      },
    ])

    expect(messages).toHaveLength(2)
    expect(messages[0]).toMatchObject({
      id: 'turn-1:user',
      role: 'user',
      content: 'What is Notion?',
      createdAt: '2026-07-15T10:00:00Z',
      status: 'complete',
    })
    expect(messages[1]).toMatchObject({
      id: 'turn-1:assistant',
      role: 'assistant',
      content: 'Notion is a productivity tool.',
      createdAt: '2026-07-15T10:00:00Z',
      status: 'complete',
    })
  })

  it('omits the assistant message when assistant_message is empty', () => {
    const messages = mapTurnsToMessages([
      { turn_id: 'turn-1', user_message: 'Hello' },
    ])
    expect(messages).toHaveLength(1)
    expect(messages[0]).toMatchObject({ role: 'user', content: 'Hello' })
  })

  it('omits the assistant message when assistant_message is missing', () => {
    const messages = mapTurnsToMessages([
      { turn_id: 'turn-1', user_message: 'Hello' },
    ])
    expect(messages).toHaveLength(1)
  })

  it('drops provenance fields (tools_called, tool_results, profile_delta, token_usage)', () => {
    const messages = mapTurnsToMessages([
      {
        turn_id: 'turn-1',
        user_message: 'Compare Notion to Confluence',
        assistant_message: 'Notion wins on UX; Confluence wins on enterprise.',
        tools_called: ['search', 'compare'],
        tool_results: [{ product_id: 'notion' }],
        profile_delta: { goals_added: ['collab'] },
        token_usage: {
          input_tokens: 100,
          output_tokens: 200,
          cache_read_tokens: 0,
          cache_creation_tokens: 0,
        },
        timestamp: '2026-07-15T10:00:00Z',
      },
    ])

    expect(messages).toHaveLength(2)
    expect(messages[0].runDetails).toEqual([])
    expect(messages[0]).not.toHaveProperty('tools_called')
    expect(messages[0]).not.toHaveProperty('tool_results')
    expect(messages[0]).not.toHaveProperty('profile_delta')
    expect(messages[0]).not.toHaveProperty('token_usage')
  })

  it('falls back to a deterministic timestamp when missing', () => {
    const messages = mapTurnsToMessages([
      { turn_id: 'turn-1', user_message: 'Hello' },
    ])
    expect(messages[0].createdAt).toBe(new Date(0).toISOString())
  })

  it('parses numeric timestamps into ISO format', () => {
    const epoch = 1710000000000 // 2024-03-09T14:13:20Z
    const messages = mapTurnsToMessages([
      { turn_id: 'turn-1', user_message: 'Hello', timestamp: epoch },
    ])
    expect(messages[0].createdAt).toBe(new Date(epoch).toISOString())
  })

  it('uses an index-based id when turn_id is missing', () => {
    const messages = mapTurnsToMessages([
      { user_message: 'one' },
      { user_message: 'two' },
    ])
    expect(messages[0].id).toBe('turn-0:user')
    expect(messages[1].id).toBe('turn-1:user')
  })

  it('preserves turn order from the source array', () => {
    const messages = mapTurnsToMessages([
      { turn_id: 'a', user_message: 'first', assistant_message: 'A' },
      { turn_id: 'b', user_message: 'second', assistant_message: 'B' },
      { turn_id: 'c', user_message: 'third', assistant_message: 'C' },
    ])
    expect(messages.map((m) => m.content)).toEqual([
      'first', 'A', 'second', 'B', 'third', 'C',
    ])
  })
})