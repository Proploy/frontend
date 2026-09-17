'use client'

/**
 * The rich chat surface — thread row, message bubble (text / file / image /
 * voice), day divider — shared by the expert inbox (/experts/chat) and the
 * business inbox (/business/dashboard/messages).
 *
 * These were built once for the expert side and then reimplemented, more
 * thinly, for the business side; this module is the single implementation.
 * Presentational only: each surface supplies its own threads, messages and
 * send handler.
 */

import { CheckCheck, FileText, Play } from 'lucide-react'
import { ChatAvatar as Avatar } from '@/components/messaging/chat-avatar'

export type ChatThread = {
  id: string
  name: string
  handle: string
  time: string
  preview: string
  fromYou?: boolean
  unread?: boolean
  online?: boolean
}


export type ChatMessage = {
  id: string
  from: 'them' | 'you'
  time: string
  read?: boolean
  kind: 'text' | 'file' | 'audio' | 'image'
  text?: string
  file?: { name: string; size: string }
  image?: { name: string; size: string; dataUrl: string }
  audio?: { duration: string }
  reactions?: string[]
  day: 'before' | 'today'
}


const WAVE_BARS = [
  8, 14, 20, 12, 24, 30, 18, 26, 34, 22, 16, 28, 36, 20, 12, 24, 30, 18, 10, 22,
  32, 26, 14, 20, 12, 8,
]


export function ConversationRow({
  conversation,
  active,
  onSelect,
}: {
  conversation: ChatThread
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left flex gap-[8px] px-[16px] py-[16px] border-b border-surface-sunken transition-colors ${
        active ? 'bg-surface-sunken' : 'hover:bg-surface-hover'
      }`}
    >
      <span className="w-[8px] shrink-0 flex justify-center pt-[16px]">
        {conversation.unread && <span className="size-[8px] rounded-full bg-cobalt" />}
      </span>
      <Avatar name={conversation.name} size="md" online={conversation.online} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-[8px]">
          <p className="font-semibold text-[14px] leading-[20px] text-ink truncate">{conversation.name}</p>
          <span className="text-[14px] leading-[20px] text-ink-soft shrink-0">{conversation.time}</span>
        </div>
        <p className="text-[14px] leading-[20px] text-ink-soft">{conversation.handle}</p>
        <p className="mt-[8px] text-[14px] leading-[20px] text-ink-soft line-clamp-2">
          {conversation.fromYou && <span className="text-ink-soft">You: </span>}
          {conversation.preview}
        </p>
      </div>
    </button>
  )
}

export function ChatBubble({ message, sender }: { message: ChatMessage; sender: ChatThread }) {
  const isYou = message.from === 'you'

  return (
    <div className={`flex gap-[12px] ${isYou ? 'flex-row-reverse' : ''}`}>
      {!isYou && <Avatar name={sender.name} size="md" online={sender.online} />}
      <div className={`flex flex-col gap-[6px] max-w-[560px] min-w-0 ${isYou ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center gap-[8px] ${isYou ? 'flex-row-reverse' : ''}`}>
          <span className="font-medium text-[14px] leading-[20px] text-ink-soft">{isYou ? 'You' : sender.name}</span>
          <span className="inline-flex items-center gap-[4px] text-[12px] leading-[18px] text-ink-soft">
            {message.time}
            {isYou && (
              <CheckCheck size={14} className={message.read ? 'text-cobalt' : 'text-ink-faint'} />
            )}
          </span>
        </div>

        {message.kind === 'text' && (
          <div
            className={`px-[14px] py-[10px] text-[16px] leading-[24px] ${
              isYou
                ? 'bg-white border border-line text-ink rounded-[8px] rounded-tr-[2px]'
                : 'bg-surface-sunken text-ink rounded-[8px] rounded-tl-[2px]'
            }`}
          >
            {message.text}
          </div>
        )}

        {message.kind === 'file' && message.file && (
          <div className="flex items-center gap-[12px] bg-white border border-line rounded-[8px] rounded-tl-[2px] px-[14px] py-[12px] w-[280px]">
            <div className="flex items-center justify-center size-[40px] rounded-[6px] bg-danger-soft text-danger shrink-0">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[14px] leading-[20px] text-ink truncate">{message.file.name}</p>
              <p className="text-[14px] leading-[20px] text-ink-soft">{message.file.size}</p>
            </div>
          </div>
        )}

        {message.kind === 'image' && message.image && (
          <div
            className={`overflow-hidden bg-white border border-line rounded-[8px] w-[280px] ${
              isYou ? 'rounded-tr-[2px]' : 'rounded-tl-[2px]'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.image.dataUrl}
              alt={message.image.name}
              className="block w-full max-h-[280px] object-cover bg-surface-sunken"
            />
            <div className="flex items-center gap-[8px] px-[12px] py-[10px] border-t border-line">
              <span className="flex items-center justify-center size-[28px] rounded-[6px] bg-cobalt-soft text-cobalt shrink-0">
                <FileText size={16} />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-[14px] leading-[20px] text-ink truncate">
                  {message.image.name}
                </p>
                <p className="text-[14px] leading-[20px] text-ink-soft">{message.image.size}</p>
              </div>
            </div>
          </div>
        )}

        {message.kind === 'audio' && message.audio && (
          <div className="flex items-center gap-[12px] bg-surface-sunken rounded-[8px] rounded-tl-[2px] px-[14px] py-[12px] w-[300px]">
            <button
              type="button"
              aria-label="Play voice message"
              className="flex items-center justify-center size-[40px] rounded-full bg-cobalt text-white shrink-0"
            >
              <Play size={16} className="ml-[2px]" fill="currentColor" />
            </button>
            <Waveform />
            <span className="text-[12px] leading-[18px] text-ink-soft shrink-0 tabular-nums">
              {message.audio.duration}
            </span>
          </div>
        )}

        {message.reactions && message.reactions.length > 0 && (
          <div className="flex items-center gap-[6px]">
            {message.reactions.map((r, i) => (
              <span
                key={`${r}-${i}`}
                className="inline-flex items-center justify-center size-[28px] rounded-full bg-white border border-line text-[14px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
              >
                {r}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-[12px] py-[4px]">
      <span className="flex-1 h-px bg-line" />
      <span className="text-[14px] leading-[20px] font-medium text-ink-soft">{label}</span>
      <span className="flex-1 h-px bg-line" />
    </div>
  )
}

function Waveform() {
  return (
    <div className="flex-1 flex items-center gap-[2px] h-[28px] min-w-0">
      {WAVE_BARS.map((h, i) => (
        <span
          key={i}
          className="flex-1 rounded-full bg-cobalt/70"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  )
}
