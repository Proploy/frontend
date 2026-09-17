import {
  CLEARED_MS,
  DELETE_MS,
  HOLD_MS,
  INITIAL_TYPED_PLACEHOLDER,
  TYPE_MS,
  nextTypedPlaceholder,
  typedPlaceholderText,
  type TypedPlaceholderState,
} from './use-typed-placeholder'

const PHRASES = ['abc', 'xy']

/** Runs the machine for a bounded number of ticks, collecting what is shown. */
function reel(phrases: readonly string[], ticks: number) {
  let state = INITIAL_TYPED_PLACEHOLDER
  const frames: string[] = []
  for (let i = 0; i < ticks; i += 1) {
    state = nextTypedPlaceholder(state, phrases).state
    frames.push(typedPlaceholderText(state, phrases))
  }
  return frames
}

describe('typedPlaceholderText', () => {
  it('shows the phrase truncated to the typed length', () => {
    expect(typedPlaceholderText({ phrase: 0, chars: 2, phase: 'typing' }, PHRASES)).toBe('ab')
  })

  it('is empty rather than undefined for a missing phrase', () => {
    expect(typedPlaceholderText({ phrase: 9, chars: 3, phase: 'typing' }, PHRASES)).toBe('')
  })
})

describe('nextTypedPlaceholder', () => {
  it('types one character at a time', () => {
    const first = nextTypedPlaceholder(INITIAL_TYPED_PLACEHOLDER, PHRASES)
    expect(first.state).toEqual({ phrase: 0, chars: 1, phase: 'typing' })
    expect(first.delayMs).toBe(TYPE_MS)
  })

  it('holds a completed phrase long enough to read it', () => {
    const full: TypedPlaceholderState = { phrase: 0, chars: 3, phase: 'typing' }
    const held = nextTypedPlaceholder(full, PHRASES)
    expect(held.state.phase).toBe('holding')
    expect(held.delayMs).toBe(HOLD_MS)
    // The text does not change while holding, so it stays readable.
    expect(typedPlaceholderText(held.state, PHRASES)).toBe('abc')
  })

  it('deletes faster than it types, the way a real correction reads', () => {
    const deleting: TypedPlaceholderState = { phrase: 0, chars: 3, phase: 'deleting' }
    const step = nextTypedPlaceholder(deleting, PHRASES)
    expect(step.state.chars).toBe(2)
    expect(step.delayMs).toBe(DELETE_MS)
    expect(DELETE_MS).toBeLessThan(TYPE_MS)
  })

  it('moves to the next phrase once the field is empty', () => {
    const empty: TypedPlaceholderState = { phrase: 0, chars: 0, phase: 'deleting' }
    const wrapped = nextTypedPlaceholder(empty, PHRASES)
    expect(wrapped.state).toEqual({ phrase: 1, chars: 0, phase: 'typing' })
    expect(wrapped.delayMs).toBe(CLEARED_MS)
  })

  it('wraps back to the first phrase rather than running off the end', () => {
    const empty: TypedPlaceholderState = { phrase: 1, chars: 0, phase: 'deleting' }
    expect(nextTypedPlaceholder(empty, PHRASES).state.phrase).toBe(0)
  })

  it('never divides by zero on an empty phrase list', () => {
    const empty: TypedPlaceholderState = { phrase: 0, chars: 0, phase: 'deleting' }
    expect(nextTypedPlaceholder(empty, []).state.phrase).toBe(0)
  })

  it('types a phrase out, holds it, erases it, then starts the next one', () => {
    // The two unchanged "abc" frames are the phase flips either side of the
    // hold (typing -> holding, then holding -> deleting); neither edits text,
    // which is what keeps the finished phrase still while it is being read.
    expect(reel(PHRASES, 10)).toEqual([
      'a', 'ab', 'abc',   // typing
      'abc', 'abc',       // holding
      'ab', 'a', '',      // deleting
      '',                 // wrapped to "xy"
      'x',                // typing the next phrase
    ])
  })
})
