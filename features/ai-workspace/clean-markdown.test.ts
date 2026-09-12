import { cleanMarkdown } from './clean-markdown'

const CONTROL = /SELECTED_PRODUCT_IDS|tool_name|tool_id|candidate_data|artifact_proposal|needs_profile_summary|product_id/i

/**
 * Replay a reply the way the stream delivers it — one character at a time —
 * and count the frames in which a control block is visible. This is the bug:
 * the completed message was always clean, so only a delta-by-delta replay
 * catches it.
 */
function leakingFrames(full: string): number {
  let leaked = 0
  for (let i = 1; i <= full.length; i += 1) {
    if (CONTROL.test(cleanMarkdown(full.slice(0, i)))) leaked += 1
  }
  return leaked
}

/**
 * The marker the agent is actually told to emit — bare, multi-entry, and
 * spread over several lines (`agent-harness/.../prompts/prompt_builder.py`).
 * Every earlier test used a shape the harness never produces, which is how a
 * marker that leaked its ids in 142 of 254 frames passed a suite about leaks.
 */
const REAL_MARKER_REPLY = `Three strong fits for your team.

Linear is the closest match on issue tracking. Notion is broader but slower.

SELECTED_PRODUCT_IDS: [
  {"product_id": "pid1", "agent_score": 9.2, "reason": "fits a 30-person eng team"},
  {"product_id": "pid2", "agent_score": 7.1, "reason": "broader, but heavier to run"}
]`

describe('cleanMarkdown', () => {
  it('never shows a control block while the message streams', () => {
    const replies = [
      REAL_MARKER_REPLY,
      'Here are three strong fits for your stack.\n\n```json\n{"SELECTED_PRODUCT_IDS": ["prod-a1", "prod-b2"]}\n```',
      'Based on your requirements:\n\n{"SELECTED_PRODUCT_IDS": ["prod-a1"]}\n\nWant a comparison?',
      'Shortlist ready.\n\n```json\n[{"product_id": "p1", "score": 9}, {"product_id": "p2", "score": 7}]\n```',
      'Let me look that up.\n\n```json\n{"tool_name": "search_products", "tool_id": "t_88"}\n```',
    ]
    for (const reply of replies) {
      expect(leakingFrames(reply)).toBe(0)
    }
  })

  it('strips the whole marker array, leaving no stray bracket', () => {
    // Lazy matching used to stop at the first entry's `}`, so the rest of the
    // array was swept up entry by entry and its `]` was left on screen.
    const cleaned = cleanMarkdown(REAL_MARKER_REPLY)
    expect(cleaned).toBe(
      'Three strong fits for your team.\n\nLinear is the closest match on issue tracking. Notion is broader but slower.',
    )
    expect(cleaned).not.toMatch(/[[\]{}]/)
  })

  it('keeps the prose that follows a marker mid-message', () => {
    expect(
      cleanMarkdown(
        'Two fits.\n\nSELECTED_PRODUCT_IDS: [\n  {"product_id": "p1", "agent_score": 8}\n]\n\nWant a comparison?',
      ),
    ).toBe('Two fits.\n\nWant a comparison?')
  })

  it('strips completed control blocks and keeps the prose around them', () => {
    expect(
      cleanMarkdown(
        'Here are three strong fits.\n\n```json\n{"SELECTED_PRODUCT_IDS": ["a", "b"]}\n```',
      ),
    ).toBe('Here are three strong fits.')

    expect(cleanMarkdown('Before.\n\n{"tool_name": "x"}\n\nAfter.')).toContain('Before.')
    expect(cleanMarkdown('Before.\n\n{"tool_name": "x"}\n\nAfter.')).toContain('After.')
  })

  it('removes thinking blocks', () => {
    expect(cleanMarkdown('<thinking>hidden reasoning</thinking>Visible.')).toBe('Visible.')
  })

  it('leaves ordinary prose and code fences untouched', () => {
    const intact = [
      'Use `npm run build` to compile.',
      'Here is a snippet:\n\n```ts\nconst a = 1\n```\n\nThat is all.',
      // `product_id` as prose, not as a control block.
      'The product_id column is the join key.',
      // A closed JSON object in prose is not a control block.
      'Use a JSON object like {"name": "value"} in the config.',
      'The shape is { "id", "name" } for each row.',
    ]
    for (const text of intact) {
      expect(cleanMarkdown(text)).toBe(text.trim())
    }
  })

  it('holds back a code fence that is still open', () => {
    // A half-arrived fence would otherwise render as a broken code block.
    expect(cleanMarkdown('Result:\n\n```ts\nconst a =')).toBe('Result:')
  })

  it('handles empty input', () => {
    expect(cleanMarkdown('')).toBe('')
    expect(cleanMarkdown(undefined as unknown as string)).toBe('')
  })
})
