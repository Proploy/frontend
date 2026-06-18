import type { Contract } from '@/hooks/types/contracts-doc'

// Shared formatting used by BOTH the PDF and DOCX generators so the two outputs
// never drift. One source of truth for money, dates, and the contract total.

export const money = (cents: number, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(
    (cents || 0) / 100,
  )

export const longDate = (iso: string) => {
  // iso may be a date (YYYY-MM-DD) or a full timestamp
  const d = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

export const contractTotalCents = (c: Contract) =>
  c.milestones.reduce((sum, m) => sum + (m.amountCents || 0), 0)

export const safeFileName = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'contract'
