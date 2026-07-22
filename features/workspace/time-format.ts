function pad(value: number): string {
  return String(value).padStart(2, '0')
}

export function elapsedSeconds(startedAt: string, nowMs: number): number {
  const hasOffset = /(?:z|[+-]\d{2}:?\d{2})$/i.test(startedAt)
  const startedAtMs = new Date(hasOffset ? startedAt : `${startedAt}Z`).getTime()
  return Math.max(0, Math.floor((nowMs - startedAtMs) / 1000))
}

export function formatElapsedSeconds(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const remainingSeconds = safeSeconds % 60

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`
}
