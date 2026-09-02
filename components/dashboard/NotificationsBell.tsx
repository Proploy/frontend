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
        className="relative inline-flex size-[36px] items-center justify-center rounded-[8px] text-[#414651] transition-colors hover:bg-[#fafafa]"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute right-[6px] top-[5px] flex min-w-[16px] items-center justify-center rounded-full bg-[#d92d20] px-[4px] text-[10px] font-semibold leading-[16px] text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} aria-hidden />
          <div
            className={`fixed z-[61] top-[64px] w-[360px] max-w-[calc(100vw-24px)] overflow-hidden rounded-[12px] border border-[#e9eaeb] bg-white shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] ${
              align === 'right' ? 'right-[12px]' : 'left-[16px]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-[#f0f0f1] px-[16px] py-[12px]">
              <p className="font-semibold text-[15px] leading-[22px] text-[#181d27]">Notifications</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAll}
                  className="inline-flex items-center gap-[4px] text-[13px] font-semibold text-[#004eeb] hover:text-[#155eef]"
                >
                  <Check size={14} />
                  Mark all read
                </button>
              )}
            </div>

            <ul className="max-h-[380px] divide-y divide-[#f0f0f1] overflow-y-auto">
              {items.map((n) => {
                const unread = isUnread(n)
                const inner = (
                  <div className="flex items-start gap-[10px] px-[16px] py-[12px]">
                    <span
                      className={`mt-[6px] size-[8px] shrink-0 rounded-full ${unread ? 'bg-[#155eef]' : 'bg-transparent'}`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-[8px]">
                        <p className={`truncate text-[14px] leading-[20px] ${unread ? 'font-semibold text-[#181d27]' : 'font-medium text-[#414651]'}`}>
                          {n.title}
                        </p>
                        <span className="shrink-0 text-[12px] leading-[18px] text-[#717680]">{n.when}</span>
                      </div>
                      <p className="text-[13px] leading-[18px] text-[#717680]">{n.body}</p>
                    </div>
                  </div>
                )
                return (
                  <li key={n.id} className="transition-colors hover:bg-[#fafafa]">
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
