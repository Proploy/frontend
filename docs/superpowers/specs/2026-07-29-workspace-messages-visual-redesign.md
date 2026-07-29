# Workspace Messages Visual Redesign

## Goal

Redesign `/workspace/messages` as a polished, full-height conversation
experience. Remove the unused grey/right-side space and add restrained
blue–violet color while preserving the existing workspace shell, messaging
APIs, notification links, and message behavior.

## Visual Direction

Use a restrained professional treatment:

- a soft blue–violet ambient gradient in the conversation canvas;
- stronger blue-to-violet sent-message bubbles;
- white received-message bubbles with quiet borders and shadows;
- subtly tinted thread cards and a more legible selected state;
- limited decorative color that never competes with message content.

The result should feel appropriate for project, contract, and commercial
conversations rather than like a social chat application.

## Layout

- Keep the global workspace sidebar unchanged.
- Make the Messages page fill the available workspace height and width.
- Remove the conversation pane's fixed minimum height.
- Keep a two-pane desktop layout: a bounded thread rail and a flexible
  conversation pane.
- Let the message feed own the remaining vertical space between its header and
  composer, with internal scrolling.
- Ensure backgrounds extend to every edge of the conversation pane so no grey
  gutter or unpainted area remains.

## Thread Rail

- Give the rail a very light blue–violet surface wash.
- Keep the Threads label and loading behavior.
- Render each thread as a soft rounded card with a subtle border.
- Use a clearer blue edge, pale tint, and restrained shadow for the active
  thread.
- Preserve current titles, initials, last-message timing, selection behavior,
  empty state, and keyboard-accessible buttons.

## Conversation Header

- Add a compact gradient identity avatar derived from the selected title.
- Display the conversation title as the primary label.
- Display the engagement context as a small secondary badge or pill.
- Keep the header compact and separated from the feed with a quiet border and
  shadow.

## Message Feed

- Paint the feed with layered low-opacity blue and violet radial/linear
  gradients over a near-white base.
- Keep messages in the existing centered readable column.
- Render incoming messages as white bubbles with dark text, subtle borders,
  and a small shadow.
- Render sent messages with a saturated blue-to-violet gradient, white text,
  and a slightly stronger shadow.
- Keep timestamps readable and subordinate.
- Preserve multiline message content and sender-based alignment.
- Use the same ambient canvas for loading, empty, and no-selection states.

## Composer

- Keep the composer pinned to the bottom of the conversation pane without
  overlapping messages.
- Place its controls inside an elevated, lightly translucent near-white dock.
- Retain the disabled attachment button, resizable text area, send button,
  loading state, and submit behavior.
- Use the same blue-to-violet direction for the enabled send action.
- Preserve focus visibility, labels, disabled affordances, and keyboard form
  submission.

## Responsive Behavior

- Desktop and wide tablet: retain the side-by-side rail and conversation
  panes.
- Narrow layouts: retain the existing stacked flow while preventing fixed
  heights or horizontal overflow.
- Use dynamic available height rather than a hardcoded conversation minimum.
- Ensure the composer and feed remain usable with browser zoom and mobile
  viewport resizing.

## Scope and Data Flow

- Modify only the Messages/conversations presentation and any focused tests
  needed for it.
- Reuse current conversation, engagement, message, loading, error, send, read,
  and deep-link state.
- Do not change backend endpoints, payloads, persistence, the workspace
  sidebar, notification modal behavior, or other workspace pages.

## Error and Empty States

- Keep the current workspace error banner behavior.
- Render loading indicators over the ambient conversation canvas.
- Preserve the no-messages and no-thread-selected copy, with improved
  blue–violet icon surfaces that match the new design.
- Never hide the composer when a valid conversation is selected.

## Verification

- Add focused rendering tests for the full-height shell, ambient conversation
  canvas, distinct sent/received bubbles, tinted active thread, and elevated
  composer.
- Confirm message selection, query-string deep links, sending, scrolling,
  empty states, and loading states remain intact.
- Run changed-file lint, TypeScript, the complete frontend test suite, and a
  production build.
