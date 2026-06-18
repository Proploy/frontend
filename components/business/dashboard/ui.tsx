'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { CARD_SHADOW } from '@/components/dashboard/DashboardChrome'
import type { EngagementStatus } from '@/lib/service-apis/business-dashboard-mock'

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

export const STATUS_STYLES: Record<EngagementStatus, { dot: string; text: string; bg: string }> = {
  'On track': { dot: '#17b26a', text: '#067647', bg: '#ecfdf3' },
  'At risk': { dot: '#f79009', text: '#b54708', bg: '#fffaeb' },
  Blocked: { dot: '#f04438', text: '#b42318', bg: '#fef3f2' },
  'In review': { dot: '#155eef', text: '#004eeb', bg: '#eff4ff' },
  Launched: { dot: '#7f56d9', text: '#6941c6', bg: '#f4f3ff' },
}

export function StatusPill({ status }: { status: EngagementStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className="inline-flex shrink-0 items-center gap-[6px] rounded-full px-[10px] py-[3px] text-[12px] font-semibold leading-[18px]"
      style={{ background: s.bg, color: s.text }}
    >
      <span className="size-[6px] rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  )
}

export function ProgressBar({ value, color = '#155eef' }: { value: number; color?: string }) {
  return (
    <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#f0f0f1]">
      <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
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
  action?: { label: string; href: string }
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`rounded-[12px] border border-[#e9eaeb] bg-white ${CARD_SHADOW} ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-[12px] border-b border-[#f0f0f1] px-[20px] py-[16px]">
          {title && <h2 className="font-semibold text-[16px] leading-[24px] text-[#181d27]">{title}</h2>}
          {action && (
            <Link
              href={action.href}
              className="inline-flex items-center gap-[4px] text-[13px] font-semibold leading-[18px] text-[#004eeb] hover:text-[#155eef]"
            >
              {action.label}
              <ArrowUpRight size={14} />
            </Link>
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
}: {
  icon: ReactNode
  label: string
  value: string
  sub: string
  href?: string
}) {
  const inner = (
    <>
      <div className="flex items-center justify-between">
        <span className="flex size-[36px] items-center justify-center rounded-[8px] bg-[#eff4ff] text-[#155eef]">
          {icon}
        </span>
        {href && <ArrowUpRight size={16} className="text-[#a4a7ae] transition-colors group-hover:text-[#155eef]" />}
      </div>
      <div className="flex flex-col gap-[2px]">
        <p className="text-[14px] font-medium leading-[20px] text-[#535862]">{label}</p>
        <p className="font-semibold text-[28px] leading-[36px] text-[#181d27] tracking-[-0.02em]">{value}</p>
        <p className="text-[12px] leading-[18px] text-[#717680]">{sub}</p>
      </div>
    </>
  )
  const cls = `group flex h-full flex-col gap-[12px] rounded-[12px] border border-[#e9eaeb] bg-white p-[20px] ${CARD_SHADOW}`
  if (href) {
    return (
      <Link href={href} className={`${cls} transition-colors hover:border-[#d5d7da]`}>
        {inner}
      </Link>
    )
  }
  return <div className={cls}>{inner}</div>
}

export function Avatar({ initial, color, size = 34 }: { initial: string; color: string; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{ background: color, width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </span>
  )
}
