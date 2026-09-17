'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

/**
 * A typewriter for the search placeholder: type an example query out, hold it
 * long enough to read, delete it, then move to the next one.
 *
 * The cycle is a pure state machine so it can be tested without fake timers;
 * the hook is only the clock and the escape hatches around it.
 */

export const TYPE_MS = 55
export const DELETE_MS = 26
/** Long enough to actually read the example before it is erased. */
export const HOLD_MS = 1900
/** Beat on an empty field, so the phrases read as separate thoughts. */
export const CLEARED_MS = 420

export type TypedPlaceholderPhase = 'typing' | 'holding' | 'deleting'

export interface TypedPlaceholderState {
  /** Index into the phrase list. */
  phrase: number
  /** How many characters of that phrase are currently shown. */
  chars: number
  phase: TypedPlaceholderPhase
}

export const INITIAL_TYPED_PLACEHOLDER: TypedPlaceholderState = {
  phrase: 0,
  chars: 0,
  phase: 'typing',
}

export function typedPlaceholderText(
  state: TypedPlaceholderState,
  phrases: readonly string[],
): string {
  return (phrases[state.phrase] ?? '').slice(0, state.chars)
}

/** One tick: the next state, and how long to wait before applying it. */
export function nextTypedPlaceholder(
  state: TypedPlaceholderState,
  phrases: readonly string[],
): { state: TypedPlaceholderState; delayMs: number } {
  const phrase = phrases[state.phrase] ?? ''

  if (state.phase === 'typing') {
    if (state.chars < phrase.length) {
      return { state: { ...state, chars: state.chars + 1 }, delayMs: TYPE_MS }
    }
    return { state: { ...state, phase: 'holding' }, delayMs: HOLD_MS }
  }

  if (state.phase === 'holding') {
    return { state: { ...state, phase: 'deleting' }, delayMs: DELETE_MS }
  }

  if (state.chars > 0) {
    return { state: { ...state, chars: state.chars - 1 }, delayMs: DELETE_MS }
  }

  // Wrap to the next phrase; the list repeats rather than stopping.
  return {
    state: {
      phrase: phrases.length > 0 ? (state.phrase + 1) % phrases.length : 0,
      chars: 0,
      phase: 'typing',
    },
    delayMs: CLEARED_MS,
  }
}

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeReducedMotion(onChange: () => void) {
  const mql = window.matchMedia?.(REDUCED_MOTION_QUERY)
  if (!mql) return () => {}
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

function reducedMotionSnapshot() {
  return window.matchMedia?.(REDUCED_MOTION_QUERY).matches ?? false
}

/**
 * Returns the placeholder to show, or `null` when the caller should fall back
 * to its own static text.
 *
 * Null covers three cases on purpose: the server render and first hydration
 * pass (the server snapshot reports reduced motion, so the markup matches), a
 * visitor who has asked for reduced motion, and `enabled` being false — which
 * the caller sets while the field is focused or has a query, so the reel never
 * animates under someone who is actually typing.
 *
 * `running` is derived rather than stored. Setting it from an effect worked but
 * cost a cascading render on every focus and blur, which the react-hooks lint
 * rule rightly flags.
 */
export function useTypedPlaceholder(
  phrases: readonly string[],
  enabled: boolean,
): string | null {
  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    reducedMotionSnapshot,
    () => true,
  )
  const [state, setState] = useState(INITIAL_TYPED_PLACEHOLDER)
  const running = enabled && phrases.length > 0 && !reduced

  useEffect(() => {
    if (!running) return
    const { state: next, delayMs } = nextTypedPlaceholder(state, phrases)
    const timer = setTimeout(() => setState(next), delayMs)
    return () => clearTimeout(timer)
  }, [running, state, phrases])

  // Pausing leaves the reel where it was, so a blur resumes mid-phrase rather
  // than snapping back to the start of the list.
  return running ? typedPlaceholderText(state, phrases) : null
}
