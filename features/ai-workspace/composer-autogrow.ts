export const COMPOSER_MAX_HEIGHT = 200
export const COMPOSER_MIN_HEIGHT = 44

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

export function scrollAdjustmentFor(
  previousHeight: number,
  nextHeight: number,
): number {
  if (!Number.isFinite(previousHeight) || !Number.isFinite(nextHeight)) return 0
  return nextHeight - previousHeight
}
