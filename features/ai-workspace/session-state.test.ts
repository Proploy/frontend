import { describe, expect, it } from 'vitest'

import {
  appendRunDetail,
  buildAiWorkspaceResearchRequest,
  mergeToolRunDetail,
  restoreAiWorkspaceMessages,
} from '@/features/ai-workspace/session-state'
import type {
  AiWorkspaceMessage,
  AiWorkspaceRunDetail,
} from '@/features/ai-workspace/types'

function assistant(id: string): AiWorkspaceMessage {
  return {
    id,
    role: 'assistant',
    content: '',
    createdAt: '2026-07-27T00:00:00.000Z',
    status: 'streaming',
    runDetails: [],
  }
}

describe('AI workspace session state', () => {
  it('attaches a run detail only to the response that produced it', () => {
    const detail: AiWorkspaceRunDetail = {
      id: 'status-analysis',
      kind: 'status',
      label: 'Analyzing the request',
      status: 'running',
    }

    const messages = appendRunDetail(
      [assistant('assistant-1'), assistant('assistant-2')],
      'assistant-2',
      detail,
    )

    expect(messages[0].runDetails).toEqual([])
    expect(messages[1].runDetails).toEqual([detail])
  })

  it('merges tool completion into the matching running detail', () => {
    const started = mergeToolRunDetail(
      [assistant('assistant-1')],
      'assistant-1',
      {
        id: 'tool-1',
        name: 'search_catalog',
        status: 'started',
      },
    )
    const completed = mergeToolRunDetail(
      started,
      'assistant-1',
      {
        id: 'tool-1',
        name: 'search_catalog',
        status: 'completed',
        output: { summary: 'Found five products' },
      },
    )

    expect(completed[0].runDetails).toEqual([
      {
        id: 'tool-1',
        kind: 'tool',
        label: 'Search Catalog',
        status: 'completed',
        summary: 'Found five products',
      },
    ])
  })

  it('omits prior session and page history from a new dedicated-workspace request', () => {
    const request = buildAiWorkspaceResearchRequest({
      message: 'Find project management software',
      sessionId: '',
      pageContext: {
        route: '/AI_workspace',
        page_type: 'AI_workspace',
      },
      pageContextHistory: [
        {
          route: '/products/notion',
          page_type: 'product_detail',
          product_id: 'notion',
        },
      ],
      includePageContextHistory: false,
    })

    expect(request).toEqual({
      message: 'Find project management software',
      page_context: {
        route: '/AI_workspace',
        page_type: 'AI_workspace',
      },
    })
  })

  it('includes only the explicitly active session when continuing research', () => {
    const request = buildAiWorkspaceResearchRequest({
      message: 'Continue',
      sessionId: 'session-2',
      pageContext: {
        route: '/AI_workspace',
        page_type: 'AI_workspace',
      },
      pageContextHistory: [],
      includePageContextHistory: false,
    })

    expect(request.session_id).toBe('session-2')
    expect(request.page_context_history).toBeUndefined()
  })

  it('restores user, Markdown assistant, and safe tool details from one session turn', () => {
    const messages = restoreAiWorkspaceMessages({
      session_id: 'session-1',
      turns: [
        {
          turn_id: 'turn-1',
          user_message: 'Find PM tools',
          assistant_message: 'Use **Notion**.',
          tools_called: ['search_catalog'],
          tool_results: [
            {
              tool_name: 'search_catalog',
              success: true,
              summary: 'Found five products',
            },
          ],
          timestamp: '2026-07-27T01:00:00.000Z',
        },
      ],
    })

    expect(messages.map((message) => [message.role, message.content])).toEqual([
      ['user', 'Find PM tools'],
      ['assistant', 'Use **Notion**.'],
    ])
    expect(messages[1].runDetails).toEqual([
      {
        id: 'turn-1-search_catalog-0',
        kind: 'tool',
        label: 'Search Catalog',
        status: 'completed',
        summary: 'Found five products',
      },
    ])
  })
})
