'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Check } from 'lucide-react'
import type { NotificationItem } from '@/features/workspace/types'

/**
 * Notification bell + dropdown for the dashboard chrome. Self-contained so it can
 * be dropped into both the desktop sidebar and the mobile top bar. The panel is
 * `fixed` so it escapes the sidebar's stacking/overflow context.
 */
export function NotificationsBell({
  items,
  align = 'left',
}: {
  items: NotificationItem[]
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())

  const isUnread = (n: NotificationItem) => n.unread && !readIds.has(n.id)
  const unreadCount = items.filter(isUnread).length

  const markAll = () => setReadIds(new Set(items.map((i) => i.id)))

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
        className="pf-btn pf-btn--ghost pf-btn--icon pf-btn--sm relative"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute right-[3px] top-[2px] flex min-w-[15px] items-center justify-center rounded-full bg-[color:var(--danger)] px-[4px] font-[family-name:var(--font-ibm-plex-mono)] text-[10px] leading-[15px] text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} aria-hidden />
          <div
            className={`pf-card fixed z-[61] top-[64px] w-[360px] max-w-[calc(100vw-24px)] overflow-hidden shadow-[var(--shadow-pop)] ${
              align === 'right' ? 'right-[12px]' : 'left-[16px]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[color:var(--line-soft)] px-[16px] py-[12px]">
              <p className="pf-h2">Notifications</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAll}
                  className="pf-linkarrow"
                >
                  <Check size={14} />
                  Mark all read
                </button>
              )}
            </div>

            <ul className="max-h-[380px] divide-y divide-[color:var(--line-soft)] overflow-y-auto">
              {items.map((n) => {
                const unread = isUnread(n)
                const inner = (
                  <div className="flex items-start gap-[10px] px-[16px] py-[12px]">
                    <span
                      className={`mt-[7px] size-[7px] shrink-0 rounded-full ${unread ? 'bg-[color:var(--cobalt)]' : 'bg-transparent'}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-[8px]">
                        <p className={`truncate text-[14px] leading-[20px] ${unread ? 'font-semibold text-[color:var(--ink)]' : 'font-medium text-[color:var(--ink-soft)]'}`}>
                          {n.title}
                        </p>
                        <span className="pf-row-meta shrink-0">{n.when}</span>
                      </div>
                      <p className="pf-small">{n.body}</p>
                    </div>
                  </div>
                )
                return (
                  <li key={n.id} className="transition-colors hover:bg-[color:var(--surface-hover)]">
                    {n.href ? (
                      <Link href={n.href} onClick={() => setOpen(false)}>
                        {inner}
                      </Link>
                    ) : (
                      inner
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </>
  )
}
