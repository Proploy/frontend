/** Auto-growing composer geometry, kept out of the component so it can be
 *  tested without a layout engine.
 *
 *  The composer is a flex sibling of the conversation scroller, so every
 *  pixel the textarea gains is a pixel the conversation loses. Left alone
 *  that pulls the last message down out of view on the buyer's first line
 *  wrap. `scrollAdjustmentFor` is the compensation.
 */

/** Roughly eight lines at the composer's 24px line-height, matching the
 *  height a ChatGPT-style composer stops growing at. Past this the textarea
 *  scrolls internally instead. */
export const COMPOSER_MAX_HEIGHT = 200

/** One line of text plus the textarea's vertical padding. */
export const COMPOSER_MIN_HEIGHT = 44

/**
 * Height the textarea should take to fit `contentHeight`, clamped to the
 * composer's band.
 *
 * `contentHeight` is the element's `scrollHeight` measured with the height
 * released. jsdom reports 0 there, so a non-positive measurement falls back
 * to the minimum rather than collapsing the composer.
 */
export function clampComposerHeight(contentHeight: number): number {
  if (!Number.isFinite(contentHeight) || contentHeight <= 0) {
    return COMPOSER_MIN_HEIGHT
  }
  return Math.min(
    Math.max(Math.round(contentHeight), COMPOSER_MIN_HEIGHT),
    COMPOSER_MAX_HEIGHT,
  )
}

/** True once the text no longer fits, i.e. the textarea owns a scrollbar. */
export function composerOverflows(contentHeight: number): boolean {
  return Number.isFinite(contentHeight) && contentHeight > COMPOSER_MAX_HEIGHT
}

/**
 * How much to add to the conversation scroller's `scrollTop` when the
 * composer's height changes from `previousHeight` to `nextHeight`.
 *
 * The scroller shows `[scrollTop, scrollTop + clientHeight]`. Growing the
 * composer by `delta` shrinks `clientHeight` by the same `delta`, so holding
 * `scrollTop` still would clip `delta` pixels off the bottom — exactly the
 * end of the conversation the buyer is reading. Adding `delta` back to
 * `scrollTop` keeps the bottom edge over the same content.
 *
 * The identity holds whether or not the buyer is pinned to the bottom: when
 * pinned, `scrollTop` is `scrollHeight - clientHeight`, and the adjusted
 * value is exactly the new pinned position. So one rule covers both the
 * "follow the answer" and "reading back through history" cases.
 */
export function scrollAdjustmentFor(
  previousHeight: number,
  nextHeight: number,
): number {
  if (!Number.isFinite(previousHeight) || !Number.isFinite(nextHeight)) return 0
  return nextHeight - previousHeight
}
