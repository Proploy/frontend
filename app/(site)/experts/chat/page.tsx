'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Archive,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Smile,
  SquarePen,
} from 'lucide-react'

import { Sidebar as ExpertSidebar } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { FileDropzone } from '@/components/experts/dashboard/FileDropzone'
import { ChatAvatar } from '@/components/messaging/chat-avatar'
import {
  ChatBubble,
  ConversationRow,
  DayDivider,
  type ChatMessage,
  type ChatThread,
} from '@/components/messaging/chat'
import { useDemo, addMessage, notify, DEMO_BUSINESS } from '@/lib/demo/demo-store'

// ChatThread id for the live demo-synced thread with the business dashboard.
const DEMO_CONVO_ID = 'northwind'

const CONVERSATIONS: ChatThread[] = [
  {
    id: DEMO_CONVO_ID,
    name: DEMO_BUSINESS,
    handle: 'Client · CRM migration',
    time: 'live',
    preview: 'Live conversation with your client.',
    unread: true,
    online: true,
  },
  {
    id: 'phoenix',
    name: 'Phoenix Baker',
    handle: '@phoenix',
    time: '5min ago',
    preview: 'Hey Olivia, Katherine sent me over the latest doc. I just have a quick question about the…',
    unread: true,
    online: true,
  },
  {
    id: 'andi',
    name: 'Andi Lane',
    handle: '@andi',
    time: '20min ago',
    preview: "Sure thing, I'll have a look today. They're looking great!",
    fromYou: true,
    online: true,
  },
  {
    id: 'mollie',
    name: 'Mollie Hall',
    handle: '@mollie',
    time: '1hr ago',
    preview: "I've just published the site again. Looks like it fixed it. How weird! I'll keep an eye on it…",
    unread: true,
    online: true,
  },
  {
    id: 'rosalee',
    name: 'Rosalee Melvin',
    handle: '@rosalee',
    time: '2hr ago',
    preview: 'Hey Liv just wanted to say thanks for chasing up the release for me. Really…',
  },
  {
    id: 'anaiah',
    name: 'Anaiah Whitten',
    handle: '@analah',
    time: '2hr ago',
    preview: "Good news!! Jack accepted the offer. I've sent over a contract for him to review but…",
    online: true,
  },
  {
    id: 'koray',
    name: 'Koray Okumus',
    handle: '@koray',
    time: '4hr ago',
    preview: 'Thanks! Looks great!',
    unread: true,
    online: true,
  },
  {
    id: 'eva',
    name: 'Eva Bond',
    handle: '@eva',
    time: '4hr ago',
    preview: "The press release went out! It's been picked up by a few people… Here's the link if you…",
  },
]

const STORAGE_KEY = 'proploy.chat.v1'

// Per-conversation message store, persisted to localStorage (page-local).
type ChatStore = Record<string, ChatMessage[]>

const EMOJI = ['👍', '❤️', '😂', '🎉', '🙌', '👀', '🔥', '✅', '🙏', '😅', '👌', '💡']

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `m-${crypto.randomUUID().slice(0, 8)}`
    : `m-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`
}

function loadStore(): ChatStore {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed: unknown = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed as ChatStore
    return {}
  } catch {
    return {}
  }
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    from: 'them',
    time: 'Thursday 11:40am',
    kind: 'text',
    text: "Hey Olivia, I've finished with the requirements doc! I made some notes in the gdoc as well for Phoenix to look over.",
    day: 'before',
  },
  {
    id: 'm2',
    from: 'them',
    time: 'Thursday 11:40am',
    kind: 'file',
    file: { name: 'Tech requirements.pdf', size: '1.2 MB' },
    day: 'before',
  },
  {
    id: 'm3',
    from: 'you',
    time: 'Thursday 11:41am',
    read: true,
    kind: 'text',
    text: "Awesome! Thanks. I'll look at this today.",
    day: 'before',
  },
  {
    id: 'm4',
    from: 'them',
    time: 'Thursday 11:44am',
    kind: 'text',
    text: "No rush though—we still have to wait for Lana's designs.",
    day: 'before',
  },
  {
    id: 'm5',
    from: 'them',
    time: 'Today 2:20pm',
    kind: 'text',
    text: 'Hey Olivia, can you please review the latest design?',
    day: 'today',
  },
  {
    id: 'm6',
    from: 'you',
    time: 'Just now',
    read: true,
    kind: 'text',
    text: "Sure thing, I'll have a look today. They're looking great!",
    reactions: ['❤️', '👌'],
    day: 'today',
  },
  {
    id: 'm7',
    from: 'them',
    time: 'Friday 2:20pm',
    kind: 'audio',
    audio: { duration: '00:28' },
    day: 'today',
  },
]

export default function ExpertsChatPage() {
  const demo = useDemo()
  const [activeId, setActiveId] = useState(DEMO_CONVO_ID)
  // Per-conversation store. Starts as the seeded thread for the default convo;
  // hydrated from localStorage after mount to avoid an SSR hydration mismatch.
  const [store, setStore] = useState<ChatStore>({ andi: INITIAL_MESSAGES })
  const [hydrated, setHydrated] = useState(false)
  const [draft, setDraft] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const active = CONVERSATIONS.find((c) => c.id === activeId) ?? CONVERSATIONS[0]
  const isDemoThread = activeId === DEMO_CONVO_ID

  // Hydrate after mount, merging persisted threads over the seed.
  useEffect(() => {
    // SSR-safe hydration: merge persisted threads over the seed after mount.
    const persisted = loadStore()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStore((prev) => ({ ...prev, ...persisted }))
     
    setHydrated(true)
  }, [])

  // Persist whenever the store changes (only after hydration so we never
  // clobber saved data with the pre-hydration seed).
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch {
      // ignore quota / serialization errors (e.g. very large images)
    }
  }, [store, hydrated])

  const messages = useMemo<ChatMessage[]>(() => {
    if (activeId === DEMO_CONVO_ID) {
      return demo.messages.map((m) => ({
        id: m.id,
        from: m.from === 'expert' ? 'you' : 'them',
        time: 'now',
        read: true,
        kind: 'text',
        text: m.text,
        day: 'today',
      }))
    }
    return store[activeId] ?? (activeId === 'andi' ? INITIAL_MESSAGES : [])
  }, [store, activeId, demo.messages])

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
    })
  }, [])

  const appendMessage = useCallback(
    (message: ChatMessage) => {
      setStore((prev) => {
        const existing = prev[activeId] ?? (activeId === 'andi' ? INITIAL_MESSAGES : [])
        return { ...prev, [activeId]: [...existing, message] }
      })
      scrollToBottom()
    },
    [activeId, scrollToBottom],
  )

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    if (isDemoThread) {
      addMessage('expert', text)
      notify({
        role: 'business',
        kind: 'message',
        title: `New message from your expert`,
        body: text.length > 60 ? `${text.slice(0, 60)}…` : text,
        href: '/business/dashboard/messages',
      })
      setDraft('')
      setEmojiOpen(false)
      scrollToBottom()
      return
    }
    appendMessage({
      id: newId(),
      from: 'you',
      time: 'Just now',
      read: false,
      kind: 'text',
      text,
      day: 'today',
    })
    setDraft('')
    setEmojiOpen(false)
  }

  const handleFiles = useCallback(
    (files: File[]) => {
      const file = files[0]
      if (!file) return
      const base = {
        id: newId(),
        from: 'you' as const,
        time: 'Just now',
        read: false,
        day: 'today' as const,
      }
      const size = formatBytes(file.size)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = () => {
          appendMessage({
            ...base,
            kind: 'image',
            image: { name: file.name, size, dataUrl: String(reader.result) },
          })
        }
        reader.readAsDataURL(file)
      } else {
        appendMessage({ ...base, kind: 'file', file: { name: file.name, size } })
      }
    },
    [appendMessage],
  )

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length) handleFiles(files)
    e.target.value = ''
  }

  const insertEmoji = (emoji: string) => {
    setDraft((prev) => prev + emoji)
    setEmojiOpen(false)
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white font-[family-name:var(--font-dm-sans)] text-ink">
      <ExpertSidebar />

      {/* Messages list panel */}
      <aside className="hidden md:flex w-[360px] shrink-0 flex-col border-r border-line">
        <header className="flex items-center justify-between px-[20px] h-[80px] shrink-0">
          <div className="flex items-center gap-[8px]">
            <h1 className="pf-title pf-title--sm">Messages</h1>
            <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-cobalt-soft text-cobalt text-[12px] leading-[18px] font-medium">
              <span className="size-[6px] rounded-full bg-cobalt" />
              40
            </span>
          </div>
          <button
            type="button"
            aria-label="New message"
            className="pf-btn pf-btn--secondary"
          >
            <SquarePen size={18} />
          </button>
        </header>

        <div className="px-[16px] pb-[12px] shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              placeholder="Search"
              aria-label="Search conversations"
              className="pf-input h-[34px] pl-[34px] pr-[44px] text-[13px]"
            />
            <span className="absolute right-[10px] top-1/2 -translate-y-1/2 px-[6px] py-[2px] text-[12px] leading-[18px] text-ink-muted border border-line rounded-[4px] bg-white">
              ⌘K
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((c) => (
            <ConversationRow
              key={c.id}
              conversation={c}
              active={c.id === activeId}
              onSelect={() => setActiveId(c.id)}
            />
          ))}
        </div>
      </aside>

      {/* Conversation */}
      <section className="flex-1 min-w-0 flex flex-col">
        <header className="flex items-center justify-between gap-[16px] px-[24px] h-[97px] shrink-0 border-b border-line">
          <div className="flex items-center gap-[12px] min-w-0">
            <ChatAvatar name={active.name} size="md" online={active.online} verified />
            <div className="min-w-0">
              <div className="flex items-center gap-[8px]">
                <span className="font-semibold text-[18px] leading-[28px] text-ink truncate">{active.name}</span>
                {active.online && (
                  <span className="inline-flex items-center gap-[5px] px-[8px] py-[2px] rounded-full bg-ok-soft text-ok text-[12px] leading-[18px] font-medium border border-ok-line">
                    <span className="size-[6px] rounded-full bg-ok" />
                    Online
                  </span>
                )}
              </div>
              <p className="text-[14px] leading-[20px] text-ink-soft truncate">{active.handle}</p>
            </div>
          </div>

          <div className="flex items-center gap-[12px] shrink-0">
            <button
              type="button"
              className="pf-btn pf-btn--secondary sm:flex"
            >
              <Phone size={16} />
              Call
            </button>
            <button
              type="button"
              className="pf-btn pf-btn--secondary sm:flex"
            >
              <Archive size={16} />
              Archive
            </button>
            <Link
              href={`/experts/${active.id}`}
              className="flex items-center bg-cobalt hover:bg-cobalt-deep border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white transition-colors"
            >
              View profile
            </Link>
            <button
              type="button"
              aria-label="More options"
              className="flex items-center justify-center size-[40px] rounded-[8px] text-ink-muted hover:bg-surface-hover"
            >
              <MoreVertical size={18} />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-[24px] py-[24px]">
          <div className="flex flex-col gap-[16px] max-w-[856px] mx-auto">
            {messages.map((m, i) => {
              const prev = messages[i - 1]
              const showDivider = !prev || (prev.day !== m.day && m.day === 'today')
              return (
                <div key={m.id} className="flex flex-col gap-[16px]">
                  {showDivider && m.day === 'today' && <DayDivider label="Today" />}
                  <ChatBubble message={m} sender={active} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Composer */}
        <div className="px-[24px] py-[24px] shrink-0">
          <div className="max-w-[856px] mx-auto flex flex-col gap-[12px]">
            {/* Drag-and-drop attachment target (also wired to the paperclip button) */}
            <FileDropzone
              multiple={false}
              hint="Drag a file or image here, or click to browse"
              onFiles={handleFiles}
            />
            <div className="relative rounded-[10px] border border-line bg-white px-[14px] py-[12px] shadow-[var(--shadow-xs)] focus-within:border-cobalt">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={onFileInputChange}
              />
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                rows={2}
                placeholder="Message"
                className="w-full resize-none bg-transparent text-[16px] leading-[24px] text-ink placeholder:text-ink-muted focus:outline-none min-h-[56px]"
              />
              <div className="flex items-center justify-between pt-[8px]">
                <div className="flex items-center gap-[2px]">
                  <button
                    type="button"
                    aria-label="Attach file"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center size-[28px] rounded-[6px] text-ink-faint hover:text-ink-soft hover:bg-surface-hover transition-colors"
                  >
                    <Paperclip size={18} />
                  </button>
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="Add emoji"
                      aria-expanded={emojiOpen}
                      onClick={() => setEmojiOpen((v) => !v)}
                      className={`flex items-center justify-center size-[28px] rounded-[6px] transition-colors ${
                        emojiOpen
                          ? 'text-cobalt bg-cobalt-soft'
                          : 'text-ink-faint hover:text-ink-soft hover:bg-surface-hover'
                      }`}
                    >
                      <Smile size={18} />
                    </button>
                    {emojiOpen && (
                      <>
                        <button
                          type="button"
                          aria-label="Close emoji picker"
                          className="fixed inset-0 z-10 cursor-default"
                          onClick={() => setEmojiOpen(false)}
                        />
                        <div
                          role="menu"
                          className="pf-menu absolute bottom-[36px] left-0 z-20"
                        >
                          {EMOJI.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => insertEmoji(emoji)}
                              className="flex size-[32px] items-center justify-center rounded-[6px] text-[18px] hover:bg-surface-hover transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!draft.trim()}
                  className="font-semibold text-[14px] leading-[20px] text-cobalt-deep hover:underline disabled:text-ink-faint disabled:no-underline disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}





/** Chat avatar: the shared Avatar plus this surface's presence/verified marks. */
