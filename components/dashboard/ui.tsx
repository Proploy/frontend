'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowUpRight } from 'lucide-react'

/**
 * Shared dashboard primitives, used by the workspace surfaces and the
 * business design reference. Presentational only — no data source.
 *
 * Styling comes from the portal design system (`app/portal.css`, .pf-*), which
 * sits on the same V2 tokens as the marketing site. The public API here is
 * unchanged; only the rendering moved off the legacy hex palette.
 */
export type EngagementStatus =
  | 'On track'
  | 'At risk'
  | 'Blocked'
  | 'In review'
  | 'Launched'

export function usd(cents: number): string {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

/** Status → the .pf-pill tone that carries its tint, border and text colour. */
export const STATUS_TONE: Record<EngagementStatus, string> = {
  'On track': 'pf-pill--ok',
  'At risk': 'pf-pill--warn',
  Blocked: 'pf-pill--danger',
  'In review': 'pf-pill--info',
  Launched: 'pf-pill--violet',
}

/**
 * Raw per-status colours, kept for callers that need a bare value (an avatar
 * background, a progress fill) rather than a pill class. Now expressed as
 * portal tokens instead of the legacy hex literals.
 */
export const STATUS_STYLES: Record<EngagementStatus, { dot: string; text: string; bg: string }> = {
  'On track': { dot: 'var(--ok)', text: 'var(--ok)', bg: 'var(--ok-soft)' },
  'At risk': { dot: 'var(--warn)', text: 'var(--warn)', bg: 'var(--warn-soft)' },
  Blocked: { dot: 'var(--danger)', text: 'var(--danger)', bg: 'var(--danger-soft)' },
  'In review': { dot: 'var(--cobalt)', text: 'var(--cobalt-deep)', bg: 'var(--cobalt-soft)' },
  Launched: { dot: 'var(--violet)', text: 'var(--violet)', bg: 'var(--violet-soft)' },
}

export function StatusPill({ status }: { status: EngagementStatus }) {
  return <span className={`pf-pill pf-pill--dot ${STATUS_TONE[status]}`}>{status}</span>
}

export function ProgressBar({
  value,
  tone = '',
  color,
}: {
  value: number
  /** A `.pf-bar--*` modifier. */
  tone?: string
  /** Explicit fill colour; overrides `tone`. */
  color?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      className={`pf-bar ${tone}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${clamped}%`, ...(color ? { background: color } : null) }} />
    </div>
  )
}

export function SectionCard({
  title,
  action,
  children,
  className = '',
}: {
  title?: string
  action?: { label: string; href?: string; onClick?: () => void }
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`pf-card overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="pf-card-head">
          {title && <h2 className="pf-h2 truncate">{title}</h2>}
          {action?.href && (
            <Link href={action.href} className="pf-linkarrow shrink-0">
              {action.label}
              <ArrowUpRight size={14} />
            </Link>
          )}
          {action?.onClick && !action.href && (
            <button type="button" onClick={action.onClick} className="pf-linkarrow shrink-0">
              {action.label}
              <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

export function KpiCard({
  icon,
  label,
  value,
  sub,
  href,
  isLoading = false,
  error = null,
  loadingSlot,
}: {
  icon: ReactNode
  label: string
  value: string
  sub: string
  href?: string
  /** Render `loadingSlot` in place of the value while the source is in flight. */
  isLoading?: boolean
  /** Swaps the affordance for a warning glyph and surfaces the reason on hover. */
  error?: { message: string } | null
  loadingSlot?: ReactNode
}) {
  const inner = (
    <>
      <div className="pf-kpi-top">
        <span className="pf-kpi-label">{label}</span>
        {error ? (
          <span title={error.message} className="text-danger" aria-label="error">
            <AlertTriangle size={15} />
          </span>
        ) : (
          <span className="pf-ico pf-ico--sm pf-ico--soft">{icon}</span>
        )}
      </div>
      <div>
        {isLoading && loadingSlot ? loadingSlot : <span className="pf-kpi-value block">{value}</span>}
        <span className="pf-kpi-foot mt-[6px]">{sub}</span>
      </div>
    </>
  )
  if (href) {
    return (
      <Link href={href} className="pf-kpi">
        {inner}
      </Link>
    )
  }
  return <div className="pf-kpi">{inner}</div>
}

export function Avatar({ initial, color, size = 34 }: { initial: string; color?: string; size?: number }) {
  return (
    <span
      className={`pf-avatar ${color ? '' : 'pf-avatar--soft'}`}
      style={{
        ...(color ? { background: color } : null),
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {initial}
    </span>
  )
}
