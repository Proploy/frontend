'use client'

import type { FormEvent, ReactNode } from 'react'
import { Paperclip, Send } from 'lucide-react'
import {
  initials,
  relativeDate,
  timeDate,
} from '@/components/workspace/workspace-format'
import type { WorkspaceMessage } from '@/features/workspace/types'

export function MessagesLayout({
  threadRail,
  conversationHeader,
  conversationBody,
  composer,
}: {
  threadRail: ReactNode
  conversationHeader?: ReactNode
  conversationBody: ReactNode
  composer?: ReactNode
}) {
  return (
    <div
      data-messages-layout
      className="flex min-h-0 flex-1 flex-col overflow-hidden xl:flex-row"
    >
      <section className="flex max-h-[360px] flex-col border-b border-[#e5e7f7] bg-gradient-to-b from-[#fbfcff] via-[#f8f8ff] to-[#f5f3ff] xl:max-h-none xl:w-[360px] xl:shrink-0 xl:border-b-0 xl:border-r">
        {threadRail}
      </section>

      <section
        data-conversation-pane
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#f8f9ff]"
      >
        {conversationHeader}
        <div
          data-conversation-canvas
          className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(circle_at_12%_12%,rgba(208,224,255,0.62),transparent_34%),radial-gradient(circle_at_88%_78%,rgba(233,221,255,0.58),transparent_38%),linear-gradient(145deg,#fbfdff_0%,#f8f9ff_48%,#fbf8ff_100%)]"
        >
          {conversationBody}
        </div>
        {composer}
      </section>
    </div>
  )
}

export function ConversationThreadCard({
  active,
  title,
  lastMessageAt,
  onSelect,
}: {
  active: boolean
  title: string
  lastMessageAt?: string | null
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={`group w-full rounded-[14px] border p-[12px] text-left transition-all duration-200 ${
        active
          ? 'border-[#84adff] bg-[#eef4ff] shadow-[0_8px_24px_rgba(21,94,239,0.10)]'
          : 'border-transparent bg-white/45 hover:border-[#d9ddf2] hover:bg-white/80'
      }`}
    >
      <div className="flex items-center gap-[11px]">
        <span
          className={`flex size-[38px] shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white shadow-sm ${
            active
              ? 'bg-gradient-to-br from-[#155eef] to-[#7f56d9]'
              : 'bg-gradient-to-br from-[#528bff] to-[#8f70d8]'
          }`}
        >
          {initials(title)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
            {title}
          </span>
          <span className="block truncate text-[13px] leading-[18px] text-[#667085]">
            Last message {relativeDate(lastMessageAt)}
          </span>
        </span>
        {active && (
          <span
            aria-hidden="true"
            className="size-[7px] shrink-0 rounded-full bg-[#155eef] shadow-[0_0_0_4px_rgba(21,94,239,0.10)]"
          />
        )}
      </div>
    </button>
  )
}

export function ConversationHeader({
  title,
  engagementLabel,
}: {
  title: string
  engagementLabel: string
}) {
  return (
    <div className="relative z-10 flex items-center gap-[12px] border-b border-[#e5e7f2] bg-white/90 px-[20px] py-[14px] shadow-[0_6px_20px_rgba(34,45,90,0.05)] backdrop-blur-xl sm:px-[24px]">
      <span className="flex size-[42px] shrink-0 items-center justify-center rounded-[13px] bg-gradient-to-br from-[#155eef] to-[#7f56d9] text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(80,70,190,0.22)]">
        {initials(title)}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[17px] font-semibold leading-[24px] text-[#181d27]">
          {title}
        </span>
        <span className="mt-[2px] inline-flex max-w-full rounded-full border border-[#dbe5ff] bg-[#f2f5ff] px-[8px] py-[2px] text-[11px] font-medium leading-[16px] text-[#475467]">
          <span className="truncate">Engagement · {engagementLabel}</span>
        </span>
      </span>
    </div>
  )
}

export function MessageBubble({
  message,
  own,
}: {
  message: WorkspaceMessage
  own: boolean
}) {
  return (
    <div className={`flex ${own ? 'justify-end' : 'justify-start'}`}>
      <div
        data-message-direction={own ? 'sent' : 'received'}
        className={`max-w-[min(680px,85%)] rounded-[18px] px-[15px] py-[11px] ${
          own
            ? 'rounded-br-[6px] bg-gradient-to-br from-[#155eef] via-[#3b5fe8] to-[#7f56d9] text-white shadow-[0_10px_26px_rgba(69,76,200,0.22)]'
            : 'rounded-bl-[6px] border border-white/80 bg-white text-[#252b37] shadow-[0_8px_24px_rgba(45,55,90,0.09)]'
        }`}
      >
        <p className="whitespace-pre-wrap text-[14px] leading-[21px]">
          {message.content || message.body}
        </p>
        <p
          className={`mt-[6px] text-[11px] leading-[16px] ${
            own ? 'text-white/75' : 'text-[#717680]'
          }`}
        >
          {timeDate(message.createdAt)}
        </p>
      </div>
    </div>
  )
}

export function MessageComposer({
  draft,
  sending,
  onDraftChange,
  onSubmit,
}: {
  draft: string
  sending: boolean
  onDraftChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <form
      data-message-composer
      onSubmit={onSubmit}
      className="relative z-10 border-t border-[#e5e7f2] bg-white/82 px-[16px] py-[14px] shadow-[0_-12px_30px_rgba(40,50,90,0.07)] backdrop-blur-xl sm:px-[24px]"
    >
      <div className="mx-auto flex max-w-[860px] items-end gap-[10px] rounded-[16px] border border-white/90 bg-white/88 p-[6px] shadow-[0_10px_30px_rgba(52,64,120,0.10)]">
        <button
          type="button"
          disabled
          aria-label="Attachments"
          className="flex size-[40px] shrink-0 items-center justify-center rounded-[10px] border border-[#e1e5f2] bg-[#f8f9ff] text-[#a4a7ae] disabled:cursor-not-allowed"
        >
          <Paperclip size={18} />
        </button>
        <textarea
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          aria-label="Message"
          rows={1}
          placeholder="Write a message"
          className="max-h-[160px] min-h-[40px] flex-1 resize-y border-0 bg-transparent px-[8px] py-[9px] text-[14px] leading-[20px] text-[#181d27] placeholder:text-[#8a8fa1] focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending || !draft.trim()}
          className="inline-flex h-[40px] items-center gap-[8px] rounded-[11px] bg-gradient-to-r from-[#155eef] to-[#6941c6] px-[16px] text-[14px] font-semibold leading-[20px] text-white shadow-[0_8px_18px_rgba(58,66,190,0.22)] transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none"
        >
          <Send size={17} />
          Send
        </button>
      </div>
    </form>
  )
}
