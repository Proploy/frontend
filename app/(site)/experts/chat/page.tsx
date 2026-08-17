'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Home,
  LayoutGrid,
  FolderClosed,
  Inbox,
  Wallet,
  Users,
  MessageSquare,
  Settings,
  LifeBuoy,
  ChevronsUpDown,
  SquarePen,
  Phone,
  Archive,
  MoreVertical,
  Paperclip,
  Smile,
  Play,
  FileText,
  CheckCheck,
  BadgeCheck,
} from 'lucide-react'

import { Sidebar as ExpertSidebar } from '@/components/experts/dashboard/ExpertDashboardFrame'
import { FileDropzone } from '@/components/experts/dashboard/FileDropzone'
import { useDemo, addMessage, notify, DEMO_BUSINESS } from '@/lib/demo/demo-store'

// Conversation id for the live demo-synced thread with the business dashboard.
const DEMO_CONVO_ID = 'northwind'

const BUTTON_SKEUO =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'

type Conversation = {
  id: string
  name: string
  handle: string
  avatarBg: string
  time: string
  preview: string
  fromYou?: boolean
  unread?: boolean
  online?: boolean
}

const CONVERSATIONS: Conversation[] = [
  {
    id: DEMO_CONVO_ID,
    name: DEMO_BUSINESS,
    handle: 'Client · CRM migration',
    avatarBg: '#c7d7fe',
    time: 'live',
    preview: 'Live conversation with your client.',
    unread: true,
    online: true,
  },
  {
    id: 'phoenix',
    name: 'Phoenix Baker',
    handle: '@phoenix',
    avatarBg: '#d6cfb7',
    time: '5min ago',
    preview: 'Hey Olivia, Katherine sent me over the latest doc. I just have a quick question about the…',
    unread: true,
    online: true,
  },
  {
    id: 'andi',
    name: 'Andi Lane',
    handle: '@andi',
    avatarBg: '#dcccbd',
    time: '20min ago',
    preview: "Sure thing, I'll have a look today. They're looking great!",
    fromYou: true,
    online: true,
  },
  {
    id: 'mollie',
    name: 'Mollie Hall',
    handle: '@mollie',
    avatarBg: '#dfc3cd',
    time: '1hr ago',
    preview: "I've just published the site again. Looks like it fixed it. How weird! I'll keep an eye on it…",
    unread: true,
    online: true,
  },
  {
    id: 'rosalee',
    name: 'Rosalee Melvin',
    handle: '@rosalee',
    avatarBg: '#ddd0be',
    time: '2hr ago',
    preview: 'Hey Liv just wanted to say thanks for chasing up the release for me. Really…',
  },
  {
    id: 'anaiah',
    name: 'Anaiah Whitten',
    handle: '@analah',
    avatarBg: '#d9d0e6',
    time: '2hr ago',
    preview: "Good news!! Jack accepted the offer. I've sent over a contract for him to review but…",
    online: true,
  },
  {
    id: 'koray',
    name: 'Koray Okumus',
    handle: '@koray',
    avatarBg: '#e5cfe7',
    time: '4hr ago',
    preview: 'Thanks! Looks great!',
    unread: true,
    online: true,
  },
  {
    id: 'eva',
    name: 'Eva Bond',
    handle: '@eva',
    avatarBg: '#e8d7ea',
    time: '4hr ago',
    preview: "The press release went out! It's been picked up by a few people… Here's the link if you…",
  },
]

type Message = {
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

const STORAGE_KEY = 'proploy.chat.v1'

// Per-conversation message store, persisted to localStorage (page-local).
type ChatStore = Record<string, Message[]>

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

const INITIAL_MESSAGES: Message[] = [
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const messages = useMemo<Message[]>(() => {
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
    (message: Message) => {
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
    <div className="flex h-screen overflow-hidden bg-white font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <ExpertSidebar />

      {/* Messages list panel */}
      <aside className="hidden md:flex w-[360px] shrink-0 flex-col border-r border-[#e9eaeb]">
        <header className="flex items-center justify-between px-[20px] h-[80px] shrink-0">
          <div className="flex items-center gap-[8px]">
            <h1 className="font-semibold text-[18px] leading-[28px] text-[#181d27]">Messages</h1>
            <span className="inline-flex items-center gap-[4px] px-[8px] py-[2px] rounded-full bg-[#eff4ff] text-[#155eef] text-[12px] leading-[18px] font-medium">
              <span className="size-[6px] rounded-full bg-[#155eef]" />
              40
            </span>
          </div>
          <button
            type="button"
            aria-label="New message"
            className={`flex items-center justify-center size-[40px] rounded-[8px] bg-white border border-[#d5d7da] text-[#414651] ${BUTTON_SKEUO}`}
          >
            <SquarePen size={18} />
          </button>
        </header>

        <div className="px-[16px] pb-[12px] shrink-0">
          <div className="relative">
            <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[#717680]" />
            <input
              type="text"
              placeholder="Search"
              className={`w-full bg-white border border-[#d5d7da] rounded-[8px] pl-[36px] pr-[40px] py-[8px] text-[14px] leading-[20px] placeholder:text-[#717680] focus:outline-none focus:ring-2 focus:ring-[#155eef]/30 ${BUTTON_SKEUO}`}
            />
            <span className="absolute right-[10px] top-1/2 -translate-y-1/2 px-[6px] py-[2px] text-[12px] leading-[18px] text-[#717680] border border-[#e9eaeb] rounded-[4px] bg-white">
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
        <header className="flex items-center justify-between gap-[16px] px-[24px] h-[97px] shrink-0 border-b border-[#e9eaeb]">
          <div className="flex items-center gap-[12px] min-w-0">
            <Avatar name={active.name} bg={active.avatarBg} size={40} online={active.online} verified />
            <div className="min-w-0">
              <div className="flex items-center gap-[8px]">
                <span className="font-semibold text-[18px] leading-[28px] text-[#181d27] truncate">{active.name}</span>
                {active.online && (
                  <span className="inline-flex items-center gap-[5px] px-[8px] py-[2px] rounded-full bg-[#ecfdf3] text-[#067647] text-[12px] leading-[18px] font-medium border border-[#abefc6]">
                    <span className="size-[6px] rounded-full bg-[#17b26a]" />
                    Online
                  </span>
                )}
              </div>
              <p className="text-[14px] leading-[20px] text-[#535862] truncate">{active.handle}</p>
            </div>
          </div>

          <div className="flex items-center gap-[12px] shrink-0">
            <button
              type="button"
              className={`hidden sm:flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
            >
              <Phone size={16} />
              Call
            </button>
            <button
              type="button"
              className={`hidden sm:flex items-center gap-[6px] bg-white border border-[#d5d7da] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-[#414651] ${BUTTON_SKEUO}`}
            >
              <Archive size={16} />
              Archive
            </button>
            <Link
              href={`/experts/${active.id}`}
              className="flex items-center bg-[#155eef] hover:bg-[#004eeb] border-2 border-white/[0.12] rounded-[8px] px-[14px] py-[10px] font-semibold text-[14px] leading-[20px] text-white transition-colors"
            >
              View profile
            </Link>
            <button
              type="button"
              aria-label="More options"
              className="flex items-center justify-center size-[40px] rounded-[8px] text-[#717680] hover:bg-[#fafafa]"
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
                  <MessageBubble message={m} sender={active} />
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
            <div
              className={`relative bg-white border border-[#d5d7da] rounded-[8px] px-[14px] pt-[12px] pb-[12px] ${BUTTON_SKEUO}`}
            >
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
                className="w-full resize-none bg-transparent text-[16px] leading-[24px] text-[#181d27] placeholder:text-[#717680] focus:outline-none min-h-[56px]"
              />
              <div className="flex items-center justify-between pt-[8px]">
                <div className="flex items-center gap-[2px]">
                  <button
                    type="button"
                    aria-label="Attach file"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center size-[28px] rounded-[6px] text-[#a4a7ae] hover:text-[#414651] hover:bg-[#fafafa] transition-colors"
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
                          ? 'text-[#155eef] bg-[#eff4ff]'
                          : 'text-[#a4a7ae] hover:text-[#414651] hover:bg-[#fafafa]'
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
                          className={`absolute bottom-[36px] left-0 z-20 grid grid-cols-6 gap-[2px] rounded-[10px] border border-[#e9eaeb] bg-white p-[6px] ${BUTTON_SKEUO}`}
                        >
                          {EMOJI.map((emoji) => (
                            <button
                              key={emoji}
                              type="button"
                              onClick={() => insertEmoji(emoji)}
                              className="flex size-[32px] items-center justify-center rounded-[6px] text-[18px] hover:bg-[#fafafa] transition-colors"
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
                  className="font-semibold text-[14px] leading-[20px] text-[#004eeb] hover:underline disabled:text-[#a4a7ae] disabled:no-underline disabled:cursor-not-allowed"
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

function ConversationRow({
  conversation,
  active,
  onSelect,
}: {
  conversation: Conversation
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left flex gap-[8px] px-[16px] py-[16px] border-b border-[#f5f5f5] transition-colors ${
        active ? 'bg-[#fafafa]' : 'hover:bg-[#fafafa]'
      }`}
    >
      <span className="w-[8px] shrink-0 flex justify-center pt-[16px]">
        {conversation.unread && <span className="size-[8px] rounded-full bg-[#155eef]" />}
      </span>
      <Avatar name={conversation.name} bg={conversation.avatarBg} size={40} online={conversation.online} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-[8px]">
          <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">{conversation.name}</p>
          <span className="text-[14px] leading-[20px] text-[#535862] shrink-0">{conversation.time}</span>
        </div>
        <p className="text-[14px] leading-[20px] text-[#535862]">{conversation.handle}</p>
        <p className="mt-[8px] text-[14px] leading-[20px] text-[#535862] line-clamp-2">
          {conversation.fromYou && <span className="text-[#414651]">You: </span>}
          {conversation.preview}
        </p>
      </div>
    </button>
  )
}

function MessageBubble({ message, sender }: { message: Message; sender: Conversation }) {
  const isYou = message.from === 'you'

  return (
    <div className={`flex gap-[12px] ${isYou ? 'flex-row-reverse' : ''}`}>
      {!isYou && <Avatar name={sender.name} bg={sender.avatarBg} size={40} online={sender.online} />}
      <div className={`flex flex-col gap-[6px] max-w-[560px] min-w-0 ${isYou ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center gap-[8px] ${isYou ? 'flex-row-reverse' : ''}`}>
          <span className="font-medium text-[14px] leading-[20px] text-[#414651]">{isYou ? 'You' : sender.name}</span>
          <span className="inline-flex items-center gap-[4px] text-[12px] leading-[18px] text-[#535862]">
            {message.time}
            {isYou && (
              <CheckCheck size={14} className={message.read ? 'text-[#155eef]' : 'text-[#a4a7ae]'} />
            )}
          </span>
        </div>

        {message.kind === 'text' && (
          <div
            className={`px-[14px] py-[10px] text-[16px] leading-[24px] ${
              isYou
                ? 'bg-white border border-[#e9eaeb] text-[#181d27] rounded-[8px] rounded-tr-[2px]'
                : 'bg-[#f5f5f5] text-[#181d27] rounded-[8px] rounded-tl-[2px]'
            }`}
          >
            {message.text}
          </div>
        )}

        {message.kind === 'file' && message.file && (
          <div className="flex items-center gap-[12px] bg-white border border-[#e9eaeb] rounded-[8px] rounded-tl-[2px] px-[14px] py-[12px] w-[280px]">
            <div className="flex items-center justify-center size-[40px] rounded-[6px] bg-[#fef3f2] text-[#d92d20] shrink-0">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">{message.file.name}</p>
              <p className="text-[14px] leading-[20px] text-[#535862]">{message.file.size}</p>
            </div>
          </div>
        )}

        {message.kind === 'image' && message.image && (
          <div
            className={`overflow-hidden bg-white border border-[#e9eaeb] rounded-[8px] w-[280px] ${
              isYou ? 'rounded-tr-[2px]' : 'rounded-tl-[2px]'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.image.dataUrl}
              alt={message.image.name}
              className="block w-full max-h-[280px] object-cover bg-[#fafafa]"
            />
            <div className="flex items-center gap-[8px] px-[12px] py-[10px] border-t border-[#e9eaeb]">
              <span className="flex items-center justify-center size-[28px] rounded-[6px] bg-[#eff8ff] text-[#155eef] shrink-0">
                <FileText size={16} />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-[14px] leading-[20px] text-[#181d27] truncate">
                  {message.image.name}
                </p>
                <p className="text-[14px] leading-[20px] text-[#535862]">{message.image.size}</p>
              </div>
            </div>
          </div>
        )}

        {message.kind === 'audio' && message.audio && (
          <div className="flex items-center gap-[12px] bg-[#f5f5f5] rounded-[8px] rounded-tl-[2px] px-[14px] py-[12px] w-[300px]">
            <button
              type="button"
              aria-label="Play voice message"
              className="flex items-center justify-center size-[40px] rounded-full bg-[#155eef] text-white shrink-0"
            >
              <Play size={16} className="ml-[2px]" fill="currentColor" />
            </button>
            <Waveform />
            <span className="text-[12px] leading-[18px] text-[#535862] shrink-0 tabular-nums">
              {message.audio.duration}
            </span>
          </div>
        )}

        {message.reactions && message.reactions.length > 0 && (
          <div className="flex items-center gap-[6px]">
            {message.reactions.map((r, i) => (
              <span
                key={`${r}-${i}`}
                className="inline-flex items-center justify-center size-[28px] rounded-full bg-white border border-[#e9eaeb] text-[14px] shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]"
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

function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-[12px] py-[4px]">
      <span className="flex-1 h-px bg-[#e9eaeb]" />
      <span className="text-[14px] leading-[20px] font-medium text-[#535862]">{label}</span>
      <span className="flex-1 h-px bg-[#e9eaeb]" />
    </div>
  )
}

const WAVE_BARS = [
  8, 14, 20, 12, 24, 30, 18, 26, 34, 22, 16, 28, 36, 20, 12, 24, 30, 18, 10, 22,
  32, 26, 14, 20, 12, 8,
]

function Waveform() {
  return (
    <div className="flex-1 flex items-center gap-[2px] h-[28px] min-w-0">
      {WAVE_BARS.map((h, i) => (
        <span
          key={i}
          className="flex-1 rounded-full bg-[#155eef]/70"
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  )
}

function Avatar({
  name,
  bg,
  size,
  online,
  verified,
}: {
  name: string
  bg: string
  size: number
  online?: boolean
  verified?: boolean
}) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className="size-full rounded-full flex items-center justify-center font-semibold text-[#414651]"
        style={{ background: bg, fontSize: size * 0.38 }}
      >
        {initials}
      </div>
      {verified && (
        <BadgeCheck
          size={16}
          className="absolute -bottom-[1px] -right-[1px] text-[#155eef] fill-[#155eef] [&>path]:stroke-white"
        />
      )}
      {online && !verified && (
        <span className="absolute bottom-0 right-0 size-[10px] rounded-full bg-[#17b26a] border-[1.5px] border-white" />
      )}
    </div>
  )
}
