/**
 * Strip the harness's control blocks out of an assistant message before it is
 * rendered as markdown.
 *
 * Sam's replies carry machine-readable side-channels — the product ids the
 * agent selected, tool calls, artifact proposals — which the side panel
 * consumes and the transcript must never show.
 *
 * The subtlety is streaming. Replies arrive as `message_delta` events, so the
 * component re-renders on a partial string many times per message. A block
 * that has not finished arriving cannot be matched by its shape, so it renders
 * raw until its closing bracket lands and the reader sees
 * `SELECTED_PRODUCT_IDS: [{"product_id": "prod-` flash by.
 *
 * So blocks are found by scanning rather than by matching a whole shape: locate
 * a control key, walk out to the delimiter that opens the block around it, and
 * bracket-match to its close. A block with no close has not finished arriving,
 * and everything from its opener to the end of the buffer is held back. What is
 * left is the partly-arrived key itself, which no bracket surrounds yet — hence
 * the tail rule at the end.
 *
 * The marker the agent actually emits is a bare, multi-entry array
 * (`prompts/prompt_builder.py`):
 *
 *   SELECTED_PRODUCT_IDS: [
 *     {"product_id": "pid1", "agent_score": 9.2, "reason": "..."},
 *     {"product_id": "pid2", "agent_score": 7.1, "reason": "..."}
 *   ]
 *
 * Both of its shapes matter: lazy `[\s\S]*?\}` stops at the first entry and
 * leaves the rest of the array behind as a stray `]`, and a key with no `{` in
 * front of it is not an object. Bracket matching handles both.
 */

/** Side-channel keys the harness emits. */
const CONTROL_KEYS = [
  'SELECTED_PRODUCT_IDS',
  'tool_name',
  'tool_id',
  'candidate_data',
  'artifact_proposal',
  'needs_profile_summary',
  'product_id',
]

/** A control key used as a key: quoted in an object, or bare before its array. */
const TRIGGER = new RegExp(`(?:^|[^A-Za-z0-9_])"?(?:${CONTROL_KEYS.join('|')})"?\\s*:`, 'g')

/** An opening code fence sitting immediately before a block. */
const OPENING_FENCE = /```[A-Za-z]*[ \t]*\r?\n?[ \t]*$/

/** The trailing token of a buffer, once whitespace and punctuation are ruled out. */
const TRAILING_KEY = /(?:^|[^A-Za-z0-9_])"?([A-Za-z_]+)"?\s*:?\s*$/

/**
 * Where the block around a control key closes, honouring nesting and ignoring
 * brackets inside JSON strings. Returns -1 while the block is still arriving.
 */
function closingIndex(text: string, open: number): number {
  let depth = 0
  let inString = false
  for (let i = open; i < text.length; i += 1) {
    const char = text[i]
    if (inString) {
      if (char === '\\') i += 1
      else if (char === '"') inString = false
      continue
    }
    if (char === '"') inString = true
    else if (char === '{' || char === '[') depth += 1
    else if (char === '}' || char === ']') {
      depth -= 1
      if (depth === 0) return i
    }
  }
  return -1
}

/** True while the buffer ends on something that can only become a control key. */
function isPartialKey(token: string): boolean {
  const partial = CONTROL_KEYS.some((key) => key.toLowerCase().startsWith(token.toLowerCase()))
  if (!partial) return false
  // A bare word is ambiguous with prose — `product`, `tool`, a SQL `SELECT` —
  // so it is only held back once it carries something prose does not: the
  // key's underscore, or enough of the marker's screaming case to be no other
  // word. Nothing is risked by waiting: an id cannot appear before the colon
  // and bracket that the scan above already catches.
  return token.includes('_') || (token.length >= 8 && token === token.toUpperCase())
}

/** `(Product ID: 1975e56a3a92)` written into the prose.
 *
 *  Sam is asked to name products and keep ids in the trailing marker, but it
 *  sometimes writes the id beside the name as well. The control-block sweep
 *  below only recognises ids as a JSON key, so this parenthetical form reached
 *  the buyer. The service-apis sanitizer removes it from the stored message;
 *  this is the same rule for text still streaming.
 *
 *  Left partial on purpose: while `(Product ID: 1975e5` is still arriving the
 *  closing paren has not landed, so the holdback below hides the tail rather
 *  than flashing a half-written id. */
const PROSE_PRODUCT_ID =
  /[([{]\s*product\s*[_\-\s]?id\s*[:=]\s*["']?[A-Za-z0-9_-]{6,}["']?\s*[)\]}]/gi

/** An id parenthetical that has opened but not yet closed.
 *  Matches from the opening bracket onward, before the colon has arrived, so
 *  `(Product ID` is held back rather than shown and then retracted. */
const PARTIAL_PROSE_PRODUCT_ID =
  /[([{]\s*product\s*[_\-\s]?id\s*(?:[:=][^)\]}]*)?$/i

export function cleanMarkdown(text: string): string {
  if (!text) return ''

  let out = text
    .replace(/<thinking>[\s\S]*?<\/thinking>/gi, '')
    .replace(/<thinking>[\s\S]*$/i, '')
    .replace(PROSE_PRODUCT_ID, '')
    .replace(PARTIAL_PROSE_PRODUCT_ID, '')

  // --- control blocks ---------------------------------------------------
  let from = 0
  for (;;) {
    TRIGGER.lastIndex = from
    const hit = TRIGGER.exec(out)
    if (!hit) break

    // `hit[0]` may open with the character before the key, so find where the
    // key's own text begins. An opening quote is picked up by the walk below.
    const keyIndex = hit.index + hit[0].search(/"?[A-Za-z_]+"?\s*:$/)
    let start = keyIndex
    let opener = -1

    // Walk out through whatever wraps the key: `{"product_id"`, `[{"product_id"`,
    // `, {"product_id"`. The outermost delimiter is the block to remove.
    for (let i = start - 1; i >= 0; i -= 1) {
      const char = out[i]
      if (/\s/.test(char)) continue
      if (char === '"' && i === start - 1) {
        start = i
        continue
      }
      if (char === '{' || char === '[') {
        start = i
        opener = i
        continue
      }
      if (char === ',' && opener !== -1) continue
      break
    }

    // A bare marker has no object around it; its block opens at the bracket
    // that follows the colon.
    if (opener === -1) {
      const afterColon = hit.index + hit[0].length
      const next = out.slice(afterColon).search(/\S/)
      const candidate = next === -1 ? -1 : afterColon + next
      if (candidate !== -1 && (out[candidate] === '[' || out[candidate] === '{')) {
        opener = candidate
      } else if (candidate === -1) {
        // The value has not arrived yet — hold back the key and wait.
        out = out.slice(0, start)
        break
      } else {
        // A control word used as prose, not as a marker. Leave it be.
        from = hit.index + hit[0].length
        continue
      }
    }

    // A fenced block is removed with its fence, so no empty ``` pair is left.
    const fence = OPENING_FENCE.exec(out.slice(0, start))
    if (fence) start = fence.index

    const close = closingIndex(out, opener)
    if (close === -1) {
      // Still arriving. Nothing after it can be prose, so hold back the rest.
      out = out.slice(0, start)
      break
    }

    let end = close + 1
    if (fence) {
      const trailing = /^\s*```/.exec(out.slice(end))
      if (trailing) end += trailing[0].length
    }
    out = out.slice(0, start) + out.slice(end)
    from = start
  }

  // --- streaming tail ---------------------------------------------------
  // An odd number of fences means one is still open. Whatever follows it is
  // mid-flight, so hold it back rather than render a broken code block.
  const fences = out.match(/```/g)
  if (fences && fences.length % 2 === 1) {
    out = out.replace(/```(?:[A-Za-z]*)[\s\S]*$/, '')
  }

  // The key itself may still be mid-flight (`SELECTED_PROD`, `{"product_i`),
  // so no bracket surrounds it yet and the scan above cannot see it.
  const tail = TRAILING_KEY.exec(out)
  if (tail && isPartialKey(tail[1])) {
    const cut = out.lastIndexOf(tail[1])
    out = out.slice(0, cut).replace(/[\s{[,]*"?$/, '')
  }

  // Removing an id parenthetical leaves "Jira  captures" / "Jira , which".
  out = out.replace(/[ \t]{2,}/g, ' ').replace(/[ \t]+([,.;:!?)])/g, '$1')

  return out.replace(/\n{3,}/g, '\n\n').trim()
}
