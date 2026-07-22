'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent, ReactNode } from 'react'
import {
  BookmarkCheck,
  BookmarkPlus,
  Bot,
  CheckCircle2,
  CircleAlert,
  Clock3,
  Download,
  Edit3,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  Square,
  Trash2,
  UserRound,
  X,
} from 'lucide-react'

import { useAuth } from '@/components/providers/auth-provider'
import { ActionToast } from '@/components/ui/action-toast'
import {
  useAiWorkspace,
  useAiWorkspaceClient,
  type AiWorkspaceCandidate,
  type AiWorkspaceMessage,
  type AiWorkspaceProfile,
  type AiWorkspaceRecommendation,
  type AiWorkspaceRecord,
  type AiWorkspaceSession,
  type AiWorkspaceToolCall,
} from '@/features/ai-workspace'
import { exportAiReport, saveAiReport } from '@/features/users'
import { clearAuthIntent } from '@/lib/utils/auth-intent-client'

const PAGE_CONTEXT = {
  route: '/AI_workspace',
  page_type: 'AI_workspace',
  title: 'AI_workspace',
}

const QUICK_PROMPTS = [
  'Find procurement tools for a 50-person operations team.',
  'Build a shortlist for project management software.',
  'Compare the strongest CRM options for a services business.',
  'Help me prepare an implementation brief.',
]

const BUTTON_SHADOW =
  'shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05),inset_0px_0px_0px_1px_rgba(10,13,18,0.18),inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)]'
const PANEL_CLASS = 'rounded-[8px] border border-[#e9eaeb] bg-white shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]'

type ToastState = {
  tone: 'success' | 'error'
  message: string
} | null

function isRecord(value: unknown): value is AiWorkspaceRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function readString(record: AiWorkspaceRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value
  }
  return undefined
}

function readNumber(record: AiWorkspaceRecord, keys: string[]): number | undefined {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'number' && Number.isFinite(value)) return value
  }
  return undefined
}

function coerceRecordArray(value: unknown, keys: string[]): AiWorkspaceRecord[] {
  if (Array.isArray(value)) return value.filter(isRecord)
  if (!isRecord(value)) return []

  for (const key of keys) {
    const nested = value[key]
    if (Array.isArray(nested)) return nested.filter(isRecord)
  }

  return []
}

function coerceSessions(value: unknown): AiWorkspaceSession[] {
  return coerceRecordArray(value, ['sessions', 'items', 'data']).map((item) => item as AiWorkspaceSession)
}

function coerceCandidates(value: unknown): AiWorkspaceCandidate[] {
  return coerceRecordArray(value, ['candidates', 'items', 'data']).map((item) => item as AiWorkspaceCandidate)
}

function getSessionId(session: AiWorkspaceSession): string {
  return readString(session, ['session_id', 'id']) ?? ''
}

function getSessionTitle(session: AiWorkspaceSession, index = 0): string {
  const explicitTitle = readString(session, ['title', 'name', 'label', 'summary'])
  if (explicitTitle && !/^session\s+[a-f0-9-]{8,}$/i.test(explicitTitle)) return explicitTitle
  return `Research ${index + 1}`
}

function getSessionDate(session: AiWorkspaceSession): string {
  const value = readString(session, ['updated_at', 'updatedAt', 'last_message_at', 'created_at', 'createdAt'])
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getNestedContent(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value
  if (!isRecord(value)) return undefined
  return readString(value, ['content', 'text', 'message', 'answer'])
}

function extractMessageContent(item: AiWorkspaceRecord): string {
  return getNestedContent(item.content)
    ?? getNestedContent(item.message)
    ?? readString(item, ['text', 'body', 'delta', 'answer'])
    ?? ''
}

function coerceRole(value: unknown): AiWorkspaceMessage['role'] {
  return value === 'user' || value === 'human' ? 'user' : 'assistant'
}

function extractSessionMessages(session: AiWorkspaceSession): AiWorkspaceMessage[] {
  const rawMessages = coerceRecordArray(session, ['messages', 'chat_messages', 'transcript', 'turns'])
  const sessionId = getSessionId(session)

  return rawMessages
    .map((item, index): AiWorkspaceMessage | null => {
      const content = extractMessageContent(item)
      if (!content) return null

      return {
        id: readString(item, ['id', 'message_id'])
          ?? `${sessionId || 'ai-workspace-session'}-${index}`,
        role: coerceRole(readString(item, ['role', 'speaker', 'author', 'type'])),
        content,
        createdAt: readString(item, ['created_at', 'createdAt', 'timestamp'])
          ?? new Date().toISOString(),
        status: 'complete',
      }
    })
    .filter((message): message is AiWorkspaceMessage => message !== null)
}

function extractProfile(value: unknown): AiWorkspaceProfile | null {
  if (!isRecord(value)) return null
  const profile = value.profile
  if (isRecord(profile)) return profile as AiWorkspaceProfile
  const session = value.session
  if (isRecord(session) && isRecord(session.profile)) return session.profile as AiWorkspaceProfile
  return null
}

function formatLabel(value: string): string {
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function formatUnknown(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map(formatUnknown).filter(Boolean).join(', ')
  if (isRecord(value)) {
    const named = readString(value, ['name', 'title', 'label', 'product_name', 'value'])
    if (named) return named
    try {
      return JSON.stringify(value)
    } catch {
      return 'Saved detail'
    }
  }
  return ''
}

function getItemId(item: AiWorkspaceRecord, index: number): string {
  return readString(item, ['candidate_id', 'product_id', 'id', 'slug', 'product_slug'])
    ?? `candidate-${index}`
}

function getItemName(item: AiWorkspaceRecord): string {
  return readString(item, ['product_name', 'name', 'title', 'vendor_name']) ?? 'Untitled'
}

function getItemBody(item: AiWorkspaceRecord): string {
  return readString(item, ['why_it_fits', 'reason', 'summary', 'description', 'short_description']) ?? ''
}

function getItemScore(item: AiWorkspaceRecord): string {
  const score = readNumber(item, ['fit_score', 'score', 'match_score'])
  if (typeof score === 'number') return String(Math.round(score))
  return readString(item, ['fit_score', 'score', 'match_score']) ?? ''
}

function getProfileRows(profile: AiWorkspaceProfile | null): Array<{ label: string; value: string }> {
  if (!profile) return []

  return Object.entries(profile)
    .map(([key, value]) => ({
      label: formatLabel(key),
      value: formatUnknown(value),
    }))
    .filter((row) => row.value.length > 0)
    .slice(0, 8)
}

function Panel({
  title,
  icon,
  action,
  children,
}: {
  title: string
  icon: ReactNode
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <section className={`${PANEL_CLASS} min-w-0 overflow-hidden`}>
      <div className="flex min-h-[52px] items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[16px] py-[12px]">
        <div className="flex min-w-0 items-center gap-[8px]">
          <span className="flex size-[28px] shrink-0 items-center justify-center rounded-[8px] bg-[#eff4ff] text-[#155eef]">
            {icon}
          </span>
          <h2 className="truncate text-[15px] font-semibold leading-[22px] text-[#181d27]">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function StatusPill({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'success' | 'warning' | 'error'
  children: ReactNode
}) {
  const toneClass = {
    neutral: 'border-[#e9eaeb] bg-[#fafafa] text-[#414651]',
    success: 'border-[#abefc6] bg-[#ecfdf3] text-[#067647]',
    warning: 'border-[#fedf89] bg-[#fffaeb] text-[#b54708]',
    error: 'border-[#fecdca] bg-[#fef3f2] text-[#b42318]',
  }[tone]

  return (
    <span className={`inline-flex items-center gap-[5px] rounded-full border px-[8px] py-[2px] text-[12px] font-semibold leading-[18px] ${toneClass}`}>
      {children}
    </span>
  )
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[120px] items-center justify-center px-[16px] py-[24px] text-center text-[14px] leading-[20px] text-[#717680]">
      {children}
    </div>
  )
}

function MessageBubble({ message }: { message: AiWorkspaceMessage }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end pl-[24px]' : 'justify-start pr-[24px]'}`}>
      <div
        className={`max-w-[760px] rounded-[8px] border px-[14px] py-[11px] ${
          isUser
            ? 'border-[#b2ccff] bg-[#eff4ff] text-[#181d27]'
            : message.status === 'failed'
              ? 'border-[#fecdca] bg-[#fef3f2] text-[#7a271a]'
              : 'border-[#e9eaeb] bg-white text-[#181d27]'
        }`}
      >
        <div className="mb-[5px] flex items-center gap-[6px] text-[12px] font-semibold leading-[18px] text-[#717680]">
          {isUser ? <UserRound size={13} /> : <Bot size={13} />}
          {isUser ? 'You' : 'Proploy'}
          {message.status === 'streaming' && !message.content ? (
            <Loader2 size={13} className="animate-spin" />
          ) : null}
        </div>
        <p className="whitespace-pre-wrap text-[15px] leading-[24px]">{message.content || 'Thinking...'}</p>
      </div>
    </div>
  )
}

function ToolCallRow({ tool }: { tool: AiWorkspaceToolCall }) {
  const name = readString(tool, ['name', 'tool_name', 'type']) ?? 'Tool activity'
  const status = readString(tool, ['status', 'state']) ?? 'running'
  return (
    <div className="rounded-[8px] border border-[#e9eaeb] bg-[#fafafa] px-[12px] py-[10px]">
      <div className="flex items-center justify-between gap-[10px]">
        <p className="truncate text-[13px] font-semibold leading-[18px] text-[#181d27]">{name}</p>
        <StatusPill tone={status === 'failed' ? 'error' : status === 'completed' ? 'success' : 'warning'}>
          {formatLabel(status)}
        </StatusPill>
      </div>
      {tool.output ? (
        <p className="mt-[6px] line-clamp-2 text-[13px] leading-[18px] text-[#535862]">{formatUnknown(tool.output)}</p>
      ) : null}
    </div>
  )
}

function RecommendationCard({
  item,
  index,
  disabled,
  onAdd,
}: {
  item: AiWorkspaceRecommendation
  index: number
  disabled: boolean
  onAdd: (item: AiWorkspaceRecommendation) => void
}) {
  const score = getItemScore(item)
  return (
    <div className="rounded-[8px] border border-[#e9eaeb] bg-white p-[12px]">
      <div className="flex items-start justify-between gap-[12px]">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{getItemName(item)}</p>
          {getItemBody(item) ? (
            <p className="mt-[4px] line-clamp-3 text-[13px] leading-[18px] text-[#535862]">{getItemBody(item)}</p>
          ) : null}
        </div>
        {score ? <StatusPill tone="success">{score}</StatusPill> : null}
      </div>
      <button
        type="button"
        onClick={() => onAdd(item)}
        disabled={disabled}
        className="mt-[10px] inline-flex h-[32px] items-center gap-[6px] rounded-[8px] border border-[#d5d7da] bg-white px-[10px] text-[13px] font-semibold leading-[18px] text-[#414651] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <BookmarkPlus size={14} />
        Add
        <span className="sr-only"> recommendation {index + 1}</span>
      </button>
    </div>
  )
}

function CandidateRow({
  item,
  index,
  disabled,
  onRemove,
}: {
  item: AiWorkspaceCandidate
  index: number
  disabled: boolean
  onRemove: (item: AiWorkspaceCandidate) => void
}) {
  return (
    <div className="flex items-start justify-between gap-[10px] rounded-[8px] border border-[#e9eaeb] bg-[#fafafa] px-[12px] py-[10px]">
      <div className="min-w-0">
        <p className="truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">{getItemName(item)}</p>
        {getItemBody(item) ? (
          <p className="mt-[3px] line-clamp-2 text-[13px] leading-[18px] text-[#535862]">{getItemBody(item)}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onRemove(item)}
        disabled={disabled}
        className="inline-flex size-[30px] shrink-0 items-center justify-center rounded-[8px] text-[#717680] transition-colors hover:bg-white hover:text-[#b42318] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Remove candidate ${index + 1}`}
      >
        <X size={15} />
      </button>
    </div>
  )
}

export default function AIWorkspacePage() {
  const { user, isLoading } = useAuth()
  const aiWorkspaceClient = useAiWorkspaceClient()
  const {
    sessionId,
    pageContext,
    setPageContext,
    messages,
    sendMessage,
    stopStreaming,
    openSession,
    startNewSession,
    isSending,
    lastError,
    recommendations,
    profile,
    thinking,
    toolCalls,
  } = useAiWorkspace({ initialPageContext: PAGE_CONTEXT })

  const [draft, setDraft] = useState('')
  const [contextQuery, setContextQuery] = useState('')
  const [sessions, setSessions] = useState<AiWorkspaceSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [sessionActionId, setSessionActionId] = useState<string | null>(null)
  const [renamingSessionId, setRenamingSessionId] = useState<string | null>(null)
  const [renameDraft, setRenameDraft] = useState('')
  const [candidates, setCandidates] = useState<AiWorkspaceCandidate[]>([])
  const [candidatesLoading, setCandidatesLoading] = useState(false)
  const [candidateActionKey, setCandidateActionKey] = useState<string | null>(null)
  const [profileAction, setProfileAction] = useState<'save' | 'load' | null>(null)
  const [reportAction, setReportAction] = useState<'save' | 'export' | null>(null)
  const [loadedProfile, setLoadedProfile] = useState<AiWorkspaceProfile | null>(null)
  const [savedProfileId, setSavedProfileId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastState>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeProfile = profile ?? loadedProfile
  const profileRows = useMemo(() => getProfileRows(activeProfile), [activeProfile])
  const latestUserMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === 'user')?.content ?? '',
    [messages],
  )
  const latestAssistantMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === 'assistant' && message.content)?.content ?? '',
    [messages],
  )

  useEffect(() => {
    // auth_intent is only a sign-in redirect hint. It is not AI_workspace
    // authentication and must not remain on this workspace route.
    clearAuthIntent()
  }, [])

  const researchTitle = useMemo(() => {
    const source = latestUserMessage.replace(/\s+/g, ' ').trim()
    if (!source) return 'AI research report'
    return source.length > 72 ? `${source.slice(0, 69)}...` : source
  }, [latestUserMessage])

  const loadSessions = useCallback(async () => {
    if (!user) return
    setSessionsLoading(true)
    const result = await aiWorkspaceClient.listSessions()
    if (result.ok) {
      setSessions(coerceSessions(result.data))
    } else {
      setToast({ tone: 'error', message: result.error.message })
    }
    setSessionsLoading(false)
  }, [aiWorkspaceClient, user])

  const loadCandidates = useCallback(async (targetSessionId = sessionId) => {
    if (!user || !targetSessionId) {
      setCandidates([])
      return
    }

    setCandidatesLoading(true)
    const result = await aiWorkspaceClient.listCandidates(targetSessionId)
    if (result.ok) {
      setCandidates(coerceCandidates(result.data))
    } else {
      setToast({ tone: 'error', message: result.error.message })
    }
    setCandidatesLoading(false)
  }, [aiWorkspaceClient, sessionId, user])

  useEffect(() => {
    setPageContext(PAGE_CONTEXT)
  }, [setPageContext])

  useEffect(() => {
    if (isLoading || !user) return
    const timer = window.setTimeout(() => {
      void loadSessions()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [isLoading, loadSessions, user])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadCandidates()
    }, 0)
    return () => window.clearTimeout(timer)
  }, [loadCandidates])

  useEffect(() => {
    if (!scrollRef.current) return
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages.length, isSending, thinking?.content])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const message = draft.trim()
    if (!message || isSending) return

    setDraft('')
    await sendMessage(message)
    await loadSessions()
    await loadCandidates()
  }

  const handleTextareaKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  const handleQuickPrompt = async (prompt: string) => {
    if (isSending) return
    await sendMessage(prompt)
    await loadSessions()
    await loadCandidates()
  }

  const handleOpenSession = async (session: AiWorkspaceSession) => {
    const targetSessionId = getSessionId(session)
    if (!targetSessionId) return

    setSessionActionId(targetSessionId)
    setSavedProfileId(null)
    const result = await aiWorkspaceClient.getSession(targetSessionId)
    if (result.ok) {
      const restoredMessages = extractSessionMessages(result.data)
      openSession(targetSessionId, restoredMessages.length > 0 ? restoredMessages : undefined)
      setLoadedProfile(extractProfile(result.data))
      setToast(null)
    } else {
      openSession(targetSessionId)
      setToast({ tone: 'error', message: result.error.message })
    }
    await loadCandidates(targetSessionId)
    setSessionActionId(null)
  }

  const beginRename = (session: AiWorkspaceSession) => {
    const targetSessionId = getSessionId(session)
    if (!targetSessionId) return
    setRenamingSessionId(targetSessionId)
    setRenameDraft(getSessionTitle(session))
  }

  const handleRename = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const targetSessionId = renamingSessionId
    const title = renameDraft.trim()
    if (!targetSessionId || !title) return

    setSessionActionId(targetSessionId)
    const result = await aiWorkspaceClient.renameSession(targetSessionId, { title, name: title })
    if (result.ok) {
      setRenamingSessionId(null)
      setRenameDraft('')
      await loadSessions()
      setToast({ tone: 'success', message: 'Research renamed.' })
    } else {
      setToast({ tone: 'error', message: result.error.message })
    }
    setSessionActionId(null)
  }

  const handleDeleteSession = async (session: AiWorkspaceSession) => {
    const targetSessionId = getSessionId(session)
    if (!targetSessionId) return
    if (!window.confirm('Delete this AI_workspace research?')) return

    setSessionActionId(targetSessionId)
    const result = await aiWorkspaceClient.deleteSession(targetSessionId)
    if (result.ok) {
      if (targetSessionId === sessionId) {
        startNewSession()
        setCandidates([])
        setLoadedProfile(null)
        setSavedProfileId(null)
      }
      await loadSessions()
      setToast({ tone: 'success', message: 'Research deleted.' })
    } else {
      setToast({ tone: 'error', message: result.error.message })
    }
    setSessionActionId(null)
  }

  const handleNewSession = () => {
    startNewSession()
    setCandidates([])
    setLoadedProfile(null)
    setSavedProfileId(null)
    setToast(null)
  }

  const handleAddCandidate = async (item: AiWorkspaceRecommendation) => {
    if (!sessionId) {
      setToast({ tone: 'error', message: 'Send a message before adding candidates.' })
      return
    }

    const actionKey = getItemId(item, recommendations.indexOf(item))
    setCandidateActionKey(actionKey)
    const result = await aiWorkspaceClient.addCandidate({
      session_id: sessionId,
      candidate_data: item,
    })
    if (result.ok) {
      await loadCandidates(sessionId)
      setToast({ tone: 'success', message: 'Candidate added.' })
    } else {
      setToast({ tone: 'error', message: result.error.message })
    }
    setCandidateActionKey(null)
  }

  const handleRemoveCandidate = async (item: AiWorkspaceCandidate) => {
    if (!sessionId) return

    const actionKey = getItemId(item, candidates.indexOf(item))
    const candidateId = readString(item, ['candidate_id', 'id'])
    if (!candidateId) {
      setToast({ tone: 'error', message: 'This candidate cannot be removed because it has no ID.' })
      return
    }

    setCandidateActionKey(actionKey)
    const result = await aiWorkspaceClient.removeCandidate({
      session_id: sessionId,
      candidate_id: candidateId,
    })
    if (result.ok) {
      await loadCandidates(sessionId)
      setToast({ tone: 'success', message: 'Candidate removed.' })
    } else {
      setToast({ tone: 'error', message: result.error.message })
    }
    setCandidateActionKey(null)
  }

  const handleSaveProfile = async () => {
    if (!sessionId) {
      setToast({ tone: 'error', message: 'Start research before saving.' })
      return
    }

    setProfileAction('save')
    const result = await aiWorkspaceClient.saveSession({
      session_id: sessionId,
      profile_name: 'AI Workspace Profile',
    })
    if (result.ok) {
      const nextProfileId = readString(result.data, ['profile_id', 'id'])
      if (nextProfileId) setSavedProfileId(nextProfileId)
    }
    setToast(result.ok
      ? { tone: 'success', message: 'Profile saved.' }
      : { tone: 'error', message: result.error.message })
    setProfileAction(null)
  }

  const handleSaveReport = async () => {
    if (!sessionId || messages.length === 0) {
      setToast({ tone: 'error', message: 'Run research before saving a report.' })
      return
    }
    setReportAction('save')
    const result = await saveAiReport({
      sessionId,
      title: researchTitle,
      summary: latestAssistantMessage || null,
      profile: activeProfile ?? {},
      recommendations,
      document: { messages },
    })
    setToast(result.ok
      ? { tone: 'success', message: 'Report saved to your profile.' }
      : { tone: 'error', message: result.error.message })
    setReportAction(null)
  }

  const handleExportCurrentReport = () => {
    if (!sessionId || messages.length === 0) {
      setToast({ tone: 'error', message: 'Run research before exporting a report.' })
      return
    }
    setReportAction('export')
    exportAiReport({
      sessionId,
      title: researchTitle,
      summary: latestAssistantMessage || null,
      profile: activeProfile ?? {},
      recommendations,
      document: { messages },
    }, 'proploy-research-report.json')
    setToast({ tone: 'success', message: 'Report export started.' })
    setReportAction(null)
  }

  const handleLoadProfile = async () => {
    if (!sessionId) {
      setToast({ tone: 'error', message: 'Open research before loading.' })
      return
    }

    const profileId = savedProfileId ?? readString(activeProfile ?? {}, ['profile_id', 'id'])
    if (!profileId) {
      setToast({ tone: 'error', message: 'Save the profile before loading it.' })
      return
    }

    setProfileAction('load')
    const result = await aiWorkspaceClient.loadSession({
      session_id: sessionId,
      profile_id: profileId,
    })
    if (result.ok) {
      const nextProfile = extractProfile(result.data)
      if (nextProfile) setLoadedProfile(nextProfile)
      setToast({ tone: 'success', message: nextProfile ? 'Profile loaded.' : 'No saved profile returned.' })
    } else {
      setToast({ tone: 'error', message: result.error.message })
    }
    setProfileAction(null)
  }

  const handleApplyContext = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPageContext({
      ...PAGE_CONTEXT,
      search_query: contextQuery.trim() || undefined,
    })
    setToast({ tone: 'success', message: 'Context updated.' })
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#f5f8ff] pt-[80px] font-[family-name:var(--font-dm-sans)]">
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#155eef]" />
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f5f8ff] px-[16px] pt-[80px] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-[560px] items-center justify-center">
          <section className={`${PANEL_CLASS} w-full p-[28px] text-center`}>
            <div className="mx-auto flex size-[52px] items-center justify-center rounded-[8px] bg-[#eff4ff] text-[#155eef]">
              <Sparkles size={24} />
            </div>
            <h1 className="mt-[18px] text-[28px] font-semibold leading-[36px] tracking-normal text-[#181d27]">AI_workspace</h1>
            <p className="mt-[8px] text-[15px] leading-[22px] text-[#535862]">
              Sign in with your Proploy account to open the workspace.
            </p>
            <Link
              href="/sign-in?redirect=/AI_workspace"
              className={`mt-[24px] inline-flex h-[44px] items-center justify-center rounded-[8px] bg-[#155eef] px-[16px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SHADOW}`}
            >
              Sign in
            </Link>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f5f8ff] pt-[80px] font-[family-name:var(--font-dm-sans)] text-[#181d27]">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1480px] flex-col gap-[16px] px-[16px] py-[16px] md:px-[24px]">
        <header className={`${PANEL_CLASS} flex flex-col gap-[14px] px-[16px] py-[14px] md:flex-row md:items-center md:justify-between`}>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-[10px]">
              <h1 className="text-[28px] font-semibold leading-[36px] tracking-normal text-[#181d27]">AI_workspace</h1>
              <StatusPill tone={sessionId ? 'success' : 'neutral'}>
                {sessionId ? 'Current research' : 'Ready'}
              </StatusPill>
            </div>
            <p className="mt-[4px] truncate text-[14px] leading-[20px] text-[#535862]">
              {sessionId ? 'Your research is linked to your Proploy profile.' : 'Start a research request to build your profile.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-[8px]">
            <button
              type="button"
              onClick={() => void handleSaveReport()}
              disabled={reportAction !== null}
              className="inline-flex h-[40px] items-center gap-[7px] rounded-[8px] border border-[#d5d7da] bg-white px-[12px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {reportAction === 'save' ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Save report
            </button>
            <button
              type="button"
              onClick={handleExportCurrentReport}
              disabled={reportAction !== null}
              className="inline-flex h-[40px] items-center gap-[7px] rounded-[8px] border border-[#d5d7da] bg-white px-[12px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {reportAction === 'export' ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
              Export
            </button>
            <button
              type="button"
              onClick={() => void loadSessions()}
              disabled={sessionsLoading}
              className="inline-flex h-[40px] items-center gap-[7px] rounded-[8px] border border-[#d5d7da] bg-white px-[12px] text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={16} className={sessionsLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              type="button"
              onClick={handleNewSession}
              className={`inline-flex h-[40px] items-center gap-[7px] rounded-[8px] bg-[#155eef] px-[12px] text-[14px] font-semibold leading-[20px] text-white ${BUTTON_SHADOW}`}
            >
              <Plus size={16} />
              New
            </button>
          </div>
        </header>

        <ActionToast
          show={!!toast}
          toast={toast ? { tone: toast.tone, title: toast.message } : null}
          onClose={() => setToast(null)}
        />

        <div className="grid flex-1 gap-[16px] xl:grid-cols-[292px_minmax(0,1fr)_360px]">
          <Panel
            title="Research"
            icon={<MessageSquare size={16} />}
            action={sessionsLoading ? <Loader2 size={16} className="animate-spin text-[#717680]" /> : null}
          >
            <div className="flex max-h-[720px] flex-col gap-[8px] overflow-y-auto p-[12px]">
              {sessions.length === 0 && !sessionsLoading ? (
                <EmptyState>No saved research yet.</EmptyState>
              ) : null}

              {sessions.map((session, index) => {
                const targetSessionId = getSessionId(session)
                const isActive = targetSessionId === sessionId
                const isBusy = sessionActionId === targetSessionId

                return (
                  <div
                    key={targetSessionId || getSessionTitle(session)}
                    className={`rounded-[8px] border px-[10px] py-[9px] ${
                      isActive ? 'border-[#84adff] bg-[#eff4ff]' : 'border-[#e9eaeb] bg-[#fafafa]'
                    }`}
                  >
                    {renamingSessionId === targetSessionId ? (
                      <form onSubmit={handleRename} className="flex items-center gap-[6px]">
                        <label className="sr-only" htmlFor={`rename-${targetSessionId}`}>Research name</label>
                        <input
                          id={`rename-${targetSessionId}`}
                          value={renameDraft}
                          onChange={(event) => setRenameDraft(event.target.value)}
                          className="min-w-0 flex-1 rounded-[8px] border border-[#d5d7da] bg-white px-[8px] py-[6px] text-[13px] leading-[18px] text-[#181d27] outline-none focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20"
                        />
                        <button
                          type="submit"
                          disabled={isBusy || !renameDraft.trim()}
                          className="inline-flex size-[30px] items-center justify-center rounded-[8px] bg-[#155eef] text-white disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label="Save research name"
                        >
                          {isBusy ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                        </button>
                      </form>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => void handleOpenSession(session)}
                          disabled={isBusy}
                          className="block w-full min-w-0 text-left disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <span className="block truncate text-[14px] font-semibold leading-[20px] text-[#181d27]">
                            {getSessionTitle(session, index)}
                          </span>
                          <span className="mt-[2px] flex items-center gap-[5px] text-[12px] leading-[18px] text-[#717680]">
                            {isBusy ? <Loader2 size={12} className="animate-spin" /> : <Clock3 size={12} />}
                            {getSessionDate(session) || 'Saved research'}
                          </span>
                        </button>
                        <div className="mt-[8px] flex items-center gap-[4px]">
                          <button
                            type="button"
                            onClick={() => beginRename(session)}
                            className="inline-flex size-[28px] items-center justify-center rounded-[8px] text-[#717680] transition-colors hover:bg-white hover:text-[#414651]"
                            aria-label="Rename research"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteSession(session)}
                            disabled={isBusy}
                            className="inline-flex size-[28px] items-center justify-center rounded-[8px] text-[#717680] transition-colors hover:bg-white hover:text-[#b42318] disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Delete research"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </Panel>

          <section className={`${PANEL_CLASS} flex min-h-[680px] min-w-0 flex-col overflow-hidden`}>
            <div className="flex min-h-[52px] items-center justify-between gap-[12px] border-b border-[#e9eaeb] px-[16px] py-[12px]">
              <div className="flex min-w-0 items-center gap-[8px]">
                <span className="flex size-[28px] shrink-0 items-center justify-center rounded-[8px] bg-[#ecfdf3] text-[#067647]">
                  <Bot size={16} />
                </span>
                <div className="min-w-0">
                  <h2 className="truncate text-[15px] font-semibold leading-[22px] text-[#181d27]">Chat</h2>
                  <p className="truncate text-[12px] leading-[18px] text-[#717680]">
                    {pageContext.search_query ? `Context: ${pageContext.search_query}` : pageContext.page_type}
                  </p>
                </div>
              </div>
              {isSending ? (
                <button
                  type="button"
                  onClick={stopStreaming}
                  className="inline-flex h-[34px] items-center gap-[6px] rounded-[8px] border border-[#fedf89] bg-[#fffaeb] px-[10px] text-[13px] font-semibold leading-[18px] text-[#b54708]"
                >
                  <Square size={13} />
                  Stop
                </button>
              ) : null}
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[#fafafa] px-[14px] py-[16px]">
              {messages.length === 0 ? (
                <div className="mx-auto flex min-h-[430px] max-w-[720px] flex-col items-center justify-center gap-[18px] text-center">
                  <div className="flex size-[56px] items-center justify-center rounded-[8px] bg-[#181d27] text-white">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h2 className="text-[24px] font-semibold leading-[32px] tracking-normal text-[#181d27]">Start a research workspace</h2>
                    <p className="mt-[6px] text-[15px] leading-[22px] text-[#535862]">
                      Ask for a shortlist, comparison, implementation plan, or procurement brief.
                    </p>
                  </div>
                  <div className="grid w-full gap-[8px] sm:grid-cols-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void handleQuickPrompt(prompt)}
                        disabled={isSending}
                        className="min-h-[54px] rounded-[8px] border border-[#d5d7da] bg-white px-[12px] py-[9px] text-left text-[14px] font-semibold leading-[20px] text-[#414651] transition-colors hover:bg-[#f5f8ff] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-[12px]">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
              )}
            </div>

            {thinking || lastError ? (
              <div className="border-t border-[#e9eaeb] bg-white px-[16px] py-[10px]" aria-live="polite">
                {thinking ? (
                  <div className="flex items-start gap-[8px] text-[13px] leading-[18px] text-[#535862]">
                    <Loader2 size={15} className={thinking.status === 'done' ? 'text-[#067647]' : 'animate-spin text-[#155eef]'} />
                    <span className="min-w-0 flex-1">{thinking.content || formatLabel(thinking.status)}</span>
                  </div>
                ) : null}
                {lastError ? (
                  <div className="flex flex-wrap items-center justify-between gap-[8px] text-[13px] leading-[18px] text-[#b42318]">
                    <span className="flex items-center gap-[7px]"><CircleAlert size={15} />{lastError}</span>
                    {latestUserMessage ? (
                      <button
                        type="button"
                        onClick={() => void sendMessage(latestUserMessage)}
                        disabled={isSending}
                        className="rounded-[8px] border border-[#fecdca] bg-white px-[9px] py-[5px] font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Retry
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="border-t border-[#e9eaeb] bg-white p-[12px]">
              <label htmlFor="ai-workspace-message" className="sr-only">Message</label>
              <div className="flex flex-col gap-[10px] rounded-[8px] border border-[#d5d7da] bg-white p-[10px] focus-within:border-[#155eef] focus-within:ring-2 focus-within:ring-[#155eef]/20">
                <textarea
                  id="ai-workspace-message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleTextareaKeyDown}
                  placeholder="Message AI_workspace"
                  disabled={isSending}
                  className="min-h-[76px] w-full resize-none bg-transparent text-[15px] leading-[24px] text-[#181d27] outline-none placeholder:text-[#717680] disabled:cursor-not-allowed disabled:opacity-60"
                />
                <div className="flex items-center justify-between gap-[10px]">
                  <StatusPill tone={isSending ? 'warning' : 'neutral'}>
                    {isSending ? 'Streaming' : 'Ready'}
                  </StatusPill>
                  <button
                    type="submit"
                    disabled={isSending || !draft.trim()}
                    className={`inline-flex h-[38px] items-center gap-[7px] rounded-[8px] bg-[#155eef] px-[12px] text-[14px] font-semibold leading-[20px] text-white disabled:cursor-not-allowed disabled:bg-[#a4c4ff] disabled:shadow-none ${BUTTON_SHADOW}`}
                  >
                    {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                    Send
                  </button>
                </div>
              </div>
            </form>
          </section>

          <div className="flex min-w-0 flex-col gap-[16px]">
            <Panel title="Context" icon={<Sparkles size={16} />}>
              <form onSubmit={handleApplyContext} className="flex flex-col gap-[10px] p-[12px]">
                <label htmlFor="ai-workspace-context" className="text-[13px] font-semibold leading-[18px] text-[#414651]">
                  Search context
                </label>
                <input
                  id="ai-workspace-context"
                  value={contextQuery}
                  onChange={(event) => setContextQuery(event.target.value)}
                  placeholder="project management, CRM, HRIS..."
                  className="h-[40px] rounded-[8px] border border-[#d5d7da] bg-white px-[11px] text-[14px] leading-[20px] text-[#181d27] outline-none placeholder:text-[#717680] focus:border-[#155eef] focus:ring-2 focus:ring-[#155eef]/20"
                />
                <button
                  type="submit"
                  className="inline-flex h-[36px] items-center justify-center rounded-[8px] border border-[#d5d7da] bg-white px-[10px] text-[13px] font-semibold leading-[18px] text-[#414651] transition-colors hover:bg-[#fafafa]"
                >
                  Apply
                </button>
              </form>
            </Panel>

            <Panel title="Activity" icon={<Clock3 size={16} />}>
              <div className="flex max-h-[260px] flex-col gap-[8px] overflow-y-auto p-[12px]">
                {toolCalls.length === 0 && !thinking ? <EmptyState>No activity yet.</EmptyState> : null}
                {thinking ? (
                  <div className="rounded-[8px] border border-[#fedf89] bg-[#fffaeb] px-[12px] py-[10px] text-[13px] leading-[18px] text-[#b54708]">
                    {thinking.content || formatLabel(thinking.status)}
                  </div>
                ) : null}
                {toolCalls.slice(-6).map((tool, index) => (
                  <ToolCallRow key={`${readString(tool, ['name', 'tool_name']) ?? 'tool'}-${index}`} tool={tool} />
                ))}
              </div>
            </Panel>

            <Panel title="Recommendations" icon={<BookmarkPlus size={16} />}>
              <div className="flex max-h-[340px] flex-col gap-[8px] overflow-y-auto p-[12px]">
                {recommendations.length === 0 ? <EmptyState>No recommendations yet.</EmptyState> : null}
                {recommendations.map((item, index) => {
                  const actionKey = getItemId(item, index)
                  return (
                    <RecommendationCard
                      key={actionKey}
                      item={item}
                      index={index}
                      disabled={candidateActionKey === actionKey}
                      onAdd={handleAddCandidate}
                    />
                  )
                })}
              </div>
            </Panel>

            <Panel
              title="Candidates"
              icon={<BookmarkCheck size={16} />}
              action={candidatesLoading ? <Loader2 size={16} className="animate-spin text-[#717680]" /> : null}
            >
              <div className="flex max-h-[300px] flex-col gap-[8px] overflow-y-auto p-[12px]">
                {candidates.length === 0 && !candidatesLoading ? <EmptyState>No candidates saved.</EmptyState> : null}
                {candidates.map((item, index) => {
                  const actionKey = getItemId(item, index)
                  return (
                    <CandidateRow
                      key={actionKey}
                      item={item}
                      index={index}
                      disabled={candidateActionKey === actionKey}
                      onRemove={handleRemoveCandidate}
                    />
                  )
                })}
              </div>
            </Panel>

            <Panel
              title="Profile"
              icon={<UserRound size={16} />}
              action={
                <div className="flex items-center gap-[4px]">
                  <button
                    type="button"
                    onClick={() => void handleLoadProfile()}
                    disabled={profileAction !== null}
                    className="inline-flex size-[30px] items-center justify-center rounded-[8px] text-[#717680] transition-colors hover:bg-[#fafafa] hover:text-[#414651] disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Load profile"
                  >
                    {profileAction === 'load' ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleSaveProfile()}
                    disabled={profileAction !== null}
                    className="inline-flex size-[30px] items-center justify-center rounded-[8px] text-[#717680] transition-colors hover:bg-[#fafafa] hover:text-[#414651] disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Save profile"
                  >
                    {profileAction === 'save' ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  </button>
                </div>
              }
            >
              <div className="flex max-h-[300px] flex-col gap-[8px] overflow-y-auto p-[12px]">
                {profileRows.length === 0 ? <EmptyState>No profile details yet.</EmptyState> : null}
                {profileRows.map((row) => (
                  <div key={row.label} className="rounded-[8px] border border-[#e9eaeb] bg-[#fafafa] px-[12px] py-[10px]">
                    <p className="text-[12px] font-semibold leading-[18px] text-[#717680]">{row.label}</p>
                    <p className="mt-[3px] line-clamp-3 text-[13px] leading-[18px] text-[#181d27]">{row.value}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </main>
  )
}
