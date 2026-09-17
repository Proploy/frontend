'use client'

import type { ComponentType, ReactNode } from 'react'
import Link from 'next/link'
import { AlertTriangle, ArrowUpRight } from 'lucide-react'

/**
 * Shared primitives for the internal portal, styled by `app/portal.css`
 * (.pf-*) on the V2 design tokens. Pages should compose these instead of
 * re-declaring cards, headers and pills with ad-hoc Tailwind — that drift is
 * exactly what left the portal on a separate visual system from the site.
 */

export type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info' | 'violet' | 'ink'

const TONE_CLASS: Record<Tone, string> = {
  neutral: '',
  ok: 'pf-pill--ok',
  warn: 'pf-pill--warn',
  danger: 'pf-pill--danger',
  info: 'pf-pill--info',
  violet: 'pf-pill--violet',
  ink: 'pf-pill--ink',
}

/* ── page header ────────────────────────────────────────────────────────── */

/**
 * The standing page header for every portal route: a mono eyebrow that names
 * where you are, a display title, an optional lede, and right-aligned actions.
 * `rule` draws the hairline the site uses between sections.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
  rule = true,
}: {
  eyebrow?: string
  title: string
  lede?: ReactNode
  actions?: ReactNode
  rule?: boolean
}) {
  return (
    <header>
      <div className="pf-head">
        <div className="pf-head-text">
          {eyebrow && <span className="pf-eyebrow">{eyebrow}</span>}
          <h1 className="pf-title">{title}</h1>
          {lede && <p className="pf-lede max-w-[62ch]">{lede}</p>}
        </div>
        {actions && <div className="pf-head-actions">{actions}</div>}
      </div>
      {rule && <hr className="pf-head-rule" />}
    </header>
  )
}

/* ── cards ──────────────────────────────────────────────────────────────── */

export function SectionCard({
  title,
  meta,
  action,
  children,
  className = '',
}: {
  title?: string
  /** Small mono note beside the title — a count, a timestamp. */
  meta?: ReactNode
  action?: { label: string; href?: string; onClick?: () => void }
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`pf-card overflow-hidden ${className}`}>
      {(title || action) && (
        <div className="pf-card-head">
          <div className="flex min-w-0 items-baseline gap-[10px]">
            {title && <h2 className="pf-h2 truncate">{title}</h2>}
            {meta && <span className="pf-row-meta">{meta}</span>}
          </div>
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

/* ── KPI ────────────────────────────────────────────────────────────────── */

export function KpiCard({
  icon: Icon,
  label,
  value,
  foot,
  href,
  isLoading = false,
  error,
}: {
  icon?: ComponentType<{ size?: number; className?: string }>
  label: string
  value: ReactNode
  /** The line under the figure — what it counts, when it was measured. */
  foot?: ReactNode
  href?: string
  isLoading?: boolean
  error?: { message: string } | null
}) {
  const body = (
    <>
      <div className="pf-kpi-top">
        <span className="pf-kpi-label">{label}</span>
        {error ? (
          <span title={error.message} aria-label="error" className="text-danger">
            <AlertTriangle size={15} />
          </span>
        ) : Icon ? (
          <span className="pf-ico pf-ico--sm pf-ico--soft">
            <Icon size={15} />
          </span>
        ) : null}
      </div>
      <div>
        {isLoading ? (
          <span className="pf-skeleton block h-[34px] w-[72px]" role="status" aria-label="loading" />
        ) : (
          <span className="pf-kpi-value block">{value}</span>
        )}
        {foot && <span className="pf-kpi-foot mt-[6px]">{error ? 'unable to refresh' : foot}</span>}
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} className="pf-kpi">
        {body}
      </Link>
    )
  }
  return <div className="pf-kpi">{body}</div>
}

/* ── pills, bars, notes ─────────────────────────────────────────────────── */

export function StatusPill({
  children,
  tone = 'neutral',
  dot = true,
  mono = false,
}: {
  children: ReactNode
  tone?: Tone
  dot?: boolean
  mono?: boolean
}) {
  return (
    <span
      className={`pf-pill ${TONE_CLASS[tone]} ${dot ? 'pf-pill--dot' : ''} ${mono ? 'pf-pill--mono' : ''}`}
    >
      {children}
    </span>
  )
}

export function ProgressBar({ value, tone = 'neutral' }: { value: number; tone?: Tone }) {
  const cls = tone === 'ok' ? 'pf-bar--ok' : tone === 'warn' ? 'pf-bar--warn' : tone === 'danger' ? 'pf-bar--danger' : ''
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      className={`pf-bar ${cls}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${clamped}%` }} />
    </div>
  )
}

export function Note({
  tone = 'neutral',
  icon,
  children,
}: {
  tone?: 'neutral' | 'info' | 'warn' | 'danger'
  icon?: ReactNode
  children: ReactNode
}) {
  const cls =
    tone === 'info' ? 'pf-note--info' : tone === 'warn' ? 'pf-note--warn' : tone === 'danger' ? 'pf-note--danger' : ''
  return (
    <div className={`pf-note ${cls}`} role={tone === 'danger' ? 'alert' : undefined}>
      {icon}
      <span className="min-w-0">{children}</span>
    </div>
  )
}

/* ── empty / loading ────────────────────────────────────────────────────── */

export function EmptyRows({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-[10px] px-[20px] py-[32px] text-center">
      <p className="pf-small">{message}</p>
      {action}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode
  title: string
  body?: string
  action?: ReactNode
}) {
  return (
    <div className="pf-empty">
      {icon && <span className="pf-empty-ico">{icon}</span>}
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {action}
    </div>
  )
}

export function RowSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <ul className="pf-list" aria-label="loading">
      {Array.from({ length: rows }).map((_, index) => (
        <li key={index} className="flex items-center gap-[12px] px-[20px] py-[14px]">
          <span className="pf-skeleton size-[30px] rounded-[8px]" />
          <span className="pf-skeleton h-[13px] flex-1" />
          <span className="pf-skeleton h-[13px] w-[52px]" />
        </li>
      ))}
    </ul>
  )
}
