'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Calendar,
  Clock3,
  FolderClosed,
  Inbox,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import {
  BUTTON_SKEUO,
  CARD_SHADOW,
  WorkspaceShell,
} from '@/components/workspace/WorkspaceShell'

export type WorkspacePlaceholderIconKey =
  | 'calendar'
  | 'folder'
  | 'inbox'
  | 'message'
  | 'settings'
  | 'users'

const PLACEHOLDER_ICONS = {
  calendar: Calendar,
  folder: FolderClosed,
  inbox: Inbox,
  message: MessageSquare,
  settings: Settings,
  users: Users,
} satisfies Record<WorkspacePlaceholderIconKey, typeof Inbox>

type WorkspacePlaceholderPageProps = {
  title: string
  eyebrow: string
  description: string
  icon: WorkspacePlaceholderIconKey
  primaryLabel?: string
  primaryHref?: string
  notes: string[]
}

export function WorkspacePlaceholderPage({
  title,
  eyebrow,
  description,
  icon,
  primaryLabel,
  primaryHref,
  notes,
}: WorkspacePlaceholderPageProps) {
  const Icon = PLACEHOLDER_ICONS[icon]

  return (
    <WorkspaceShell>
      <main className="flex-1 min-w-0">
        <div className="max-w-[1144px] mx-auto px-[32px] py-[32px] flex flex-col gap-[24px]">
          <header className="flex flex-wrap items-start justify-between gap-[16px]">
            <div className="flex flex-col gap-[4px]">
              <p className="text-[13px] font-semibold leading-[20px] text-[#155eef]">{eyebrow}</p>
              <h1 className="font-semibold text-[24px] leading-[32px] text-[#181d27]">{title}</h1>
              <p className="max-w-[720px] text-[16px] leading-[24px] text-[#535862]">{description}</p>
            </div>
            {primaryHref && primaryLabel ? (
              <Link
                href={primaryHref}
                className={`inline-flex items-center gap-[6px] rounded-[8px] border-2 border-white/[0.12] bg-[#155eef] px-[14px] py-[10px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SKEUO}`}
              >
                {primaryLabel}
                <ArrowRight size={16} />
              </Link>
            ) : null}
          </header>

          <section className={`bg-white border border-[#e9eaeb] rounded-[12px] overflow-hidden ${CARD_SHADOW}`}>
            <div className="flex items-center gap-[12px] border-b border-[#e9eaeb] px-[20px] py-[16px]">
              <div className="flex size-[40px] items-center justify-center rounded-[8px] bg-[#eff4ff] text-[#155eef]">
                <Icon size={20} />
              </div>
              <div>
                <h2 className="text-[16px] font-semibold leading-[24px] text-[#181d27]">Workspace module pending</h2>
                <p className="text-[13px] leading-[18px] text-[#717680]">
                  This route exists now; its backend hook will be wired in the next phase.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-[12px] p-[20px] md:grid-cols-3">
              {notes.map((note) => (
                <div key={note} className="rounded-[10px] border border-[#e9eaeb] bg-[#fafafa] p-[16px]">
                  <div className="mb-[10px] flex items-center gap-[8px] text-[#717680]">
                    <Clock3 size={16} />
                    <span className="text-[12px] font-medium leading-[18px]">Planned behavior</span>
                  </div>
                  <p className="text-[14px] leading-[20px] text-[#414651]">{note}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </WorkspaceShell>
  )
}
