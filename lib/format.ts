// Small shared formatting helpers (repo previously had none).

const USD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/** cents → "$1,234.50" */
export function formatCurrency(cents: number): string {
  return USD.format((cents || 0) / 100)
}

/** ISO date (YYYY-MM-DD) → "4 Jun 2026" */
export function formatDate(iso: string): string {
  if (!iso) return ''
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** minutes → "2h 30m" (or "45m", "3h") */
export function formatDuration(minutes: number): string {
  const m = Math.max(0, Math.round(minutes))
  const h = Math.floor(m / 60)
  const rem = m % 60
  if (h && rem) return `${h}h ${rem}m`
  if (h) return `${h}h`
  return `${rem}m`
}

/** seconds → "00:42:15" (live timer display) */
export function formatStopwatch(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds))
  const hh = String(Math.floor(s / 3600)).padStart(2, '0')
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
  const ss = String(s % 60).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

/** decimal hours → minutes (manual time entry) */
export function hoursToMinutes(hours: number): number {
  return Math.round((hours || 0) * 60)
}
